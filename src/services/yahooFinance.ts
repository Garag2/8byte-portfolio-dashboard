import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

// Simple in-memory cache to handle rate limits and reduce API calls
interface StockQuoteData {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice: number | null;
  regularMarketPreviousClose: number | null;
  sector: string;
  peRatio: string;
  latestEarnings: string;
}

interface CacheEntry {
  data: StockQuoteData;
  timestamp: number;
}
const cache: Record<string, CacheEntry> = {};
const googleCache: Record<string, CacheEntry> = {};
const CACHE_TTL_MS = 60 * 1000; // 1 minute

// Prevent Rate Limit errors by mapping known sectors directly
const knownSectors: Record<string, string> = {
  'HDFCBANK.NS': 'Financial Services',
  'BAJFINANCE.NS': 'Financial Services',
  'ICICIBANK.NS': 'Financial Services',
  'BAJAJHFL.NS': 'Financial Services',
  'SAVANIFIN.BO': 'Financial Services',
  'AFFLE.NS': 'Technology',
  'LTIM.NS': 'Technology',
  'KPITTECH.NS': 'Technology',
  'TATATECH.NS': 'Technology',
  'INFY.NS': 'Technology',
  'HAPPSTMNDS.NS': 'Technology',
  'TANLA.NS': 'Technology',
  'BLSE.NS': 'Technology',
  'DMART.NS': 'Consumer Defensive',
  'TATACONSUM.NS': 'Consumer Defensive',
  'PIDILITIND.NS': 'Industrials',
  'ASTRAL.NS': 'Industrials',
  'POLYCAB.NS': 'Industrials',
  'TATAPOWER.NS': 'Utilities',
  'KPIGREEN.NS': 'Utilities',
  'SUZLON.NS': 'Utilities',
  'GENSOL.NS': 'Industrials',
  'HARIOMPIPE.NS': 'Basic Materials',
  'CLEAN.NS': 'Basic Materials',
  'DEEPAKNTR.NS': 'Basic Materials',
  'FINEORG.NS': 'Basic Materials',
  'GRAVITA.NS': 'Basic Materials',
  'SBILIFE.NS': 'Financial Services',
  'EASEMYTRIP.NS': 'Consumer Cyclical'
};

interface YahooQuote {
  symbol?: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketPreviousClose?: number;
  trailingPE?: number;
  epsTrailingTwelveMonths?: number;
}

function toGoogleFinanceSymbol(symbol: string) {
  if (symbol.endsWith('.NS')) return `${symbol.replace('.NS', '')}:NSE`;
  if (symbol.endsWith('.BO')) return `${symbol.replace('.BO', '')}:BOM`;
  return symbol;
}

function normalizeMetric(value: string | undefined) {
  if (!value) return 'N/A';
  const normalized = value.replace(/<!--.*?-->/g, '').replace(/,/g, '').trim();
  return normalized && normalized !== '-' ? normalized : 'N/A';
}

function extractGoogleMetric(html: string, label: string) {
  const labelIndex = html.indexOf(label);
  if (labelIndex === -1) return 'N/A';

  const metricBlock = html.slice(labelIndex, labelIndex + 800);
  const valueMatch = metricBlock.match(/class="P6K39c">([^<]+)</);
  return normalizeMetric(valueMatch?.[1]);
}

async function getGoogleFinanceMetrics(symbol: string): Promise<Pick<StockQuoteData, 'peRatio' | 'latestEarnings'>> {
  const now = Date.now();
  const cached = googleCache[symbol];
  if (cached && now - cached.timestamp <= CACHE_TTL_MS) {
    return {
      peRatio: cached.data.peRatio,
      latestEarnings: cached.data.latestEarnings,
    };
  }

  const googleSymbol = toGoogleFinanceSymbol(symbol);
  const response = await fetch(`https://www.google.com/finance/quote/${encodeURIComponent(googleSymbol)}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; PortfolioDashboard/1.0)',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`Google Finance request failed for ${symbol}: ${response.status}`);
  }

  const html = await response.text();
  const metrics = {
    peRatio: extractGoogleMetric(html, 'P/E ratio'),
    latestEarnings: extractGoogleMetric(html, 'Earnings per share'),
  };

  googleCache[symbol] = {
    data: createFallbackQuote(symbol, metrics),
    timestamp: now,
  };

  return metrics;
}

function createFallbackQuote(
  symbol: string,
  metrics: Pick<StockQuoteData, 'peRatio' | 'latestEarnings'> = { peRatio: 'N/A', latestEarnings: 'N/A' }
): StockQuoteData {
  return {
    symbol,
    regularMarketPrice: null,
    regularMarketPreviousClose: null,
    sector: knownSectors[symbol] || 'Unknown',
    peRatio: metrics.peRatio,
    latestEarnings: metrics.latestEarnings,
  };
}

export async function getStockData(symbols: string[]): Promise<StockQuoteData[]> {
  const now = Date.now();
  const symbolsToFetch = symbols.filter(sym => {
    const cached = cache[sym];
    return !cached || (now - cached.timestamp > CACHE_TTL_MS);
  });

  if (symbolsToFetch.length > 0) {
    // Fetch each symbol individually to prevent batch silent drops
    const results = await Promise.allSettled(
      symbolsToFetch.map(async sym => {
        const [quote, googleMetrics] = await Promise.all([
          yahooFinance.quote(sym) as Promise<YahooQuote | undefined>,
          getGoogleFinanceMetrics(sym).catch(() => ({ peRatio: 'N/A', latestEarnings: 'N/A' })),
        ]);

        return { quote, googleMetrics };
      })
    );

    results.forEach((result, idx) => {
      const sym = symbolsToFetch[idx];
      if (result.status === 'fulfilled' && result.value) {
        const { quote, googleMetrics } = result.value;
        if (!quote) {
          cache[sym] = {
            data: createFallbackQuote(sym, googleMetrics),
            timestamp: now
          };
          return;
        }

        const fallbackPe = quote.trailingPE ? quote.trailingPE.toFixed(2) : 'N/A';
        const fallbackEarnings = quote.epsTrailingTwelveMonths ? quote.epsTrailingTwelveMonths.toFixed(2) : 'N/A';

        cache[sym] = {
          data: {
            symbol: quote.symbol || sym,
            shortName: quote.shortName,
            longName: quote.longName,
            regularMarketPrice: quote.regularMarketPrice ?? null,
            regularMarketPreviousClose: quote.regularMarketPreviousClose ?? null,
            sector: knownSectors[sym] || 'Unknown',
            peRatio: googleMetrics.peRatio !== 'N/A' ? googleMetrics.peRatio : fallbackPe,
            latestEarnings: googleMetrics.latestEarnings !== 'N/A' ? googleMetrics.latestEarnings : fallbackEarnings,
          },
          timestamp: now
        };
      } else {
        // Symbol not resolvable — inject fallback so dashboard doesn't crash
        if (!cache[sym]) {
          cache[sym] = {
            data: createFallbackQuote(sym),
            timestamp: now
          };
        }
      }
    });
  }

  // Ensure all symbols have at least a fallback in cache to avoid crashes
  symbols.forEach(sym => {
    if (!cache[sym]) {
      cache[sym] = {
        data: createFallbackQuote(sym),
        timestamp: Date.now()
      };
    } else if (cache[sym].data.sector === 'Unknown') {
      cache[sym].data.sector = knownSectors[sym] || 'Unknown';
    }
  });

  return symbols.map(sym => cache[sym].data);
}
