import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

// Simple in-memory cache to handle rate limits and reduce API calls
interface CacheEntry {
  data: any;
  timestamp: number;
}
const cache: Record<string, CacheEntry> = {};
const CACHE_TTL_MS = 60 * 1000; // 1 minute

// Prevent Rate Limit errors by mapping known sectors directly
const knownSectors: Record<string, string> = {
  'HDFCBANK.NS': 'Financial Services',
  'BAJFINANCE.NS': 'Financial Services',
  'ICICIBANK.NS': 'Financial Services',
  'BAJAJHOUS.NS': 'Financial Services',
  'SAVANIFI.BO': 'Financial Services',
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



export async function getStockData(symbols: string[]) {
  const now = Date.now();
  const symbolsToFetch = symbols.filter(sym => {
    const cached = cache[sym];
    return !cached || (now - cached.timestamp > CACHE_TTL_MS);
  });

  if (symbolsToFetch.length > 0) {
    // Fetch each symbol individually to prevent batch silent drops
    const results = await Promise.allSettled(
      symbolsToFetch.map(sym => yahooFinance.quote(sym))
    );

    results.forEach((result, idx) => {
      const sym = symbolsToFetch[idx];
      if (result.status === 'fulfilled' && result.value) {
        const quote = result.value as any;

        let formattedEarnings = 'N/A';
        if (quote.earningsTimestamp) {
          const d = new Date(quote.earningsTimestamp);
          formattedEarnings = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
        }

        cache[sym] = {
          data: {
            ...quote,
            sector: knownSectors[sym] || 'Unknown',
            peRatio: quote.trailingPE ? quote.trailingPE.toFixed(2) : 'N/A',
            latestEarnings: formattedEarnings
          },
          timestamp: now
        };
      } else {
        // Symbol not resolvable — inject fallback so dashboard doesn't crash
        if (!cache[sym]) {
          cache[sym] = {
            data: { symbol: sym, regularMarketPrice: null, regularMarketPreviousClose: null, sector: knownSectors[sym] || 'Unknown', peRatio: 'N/A', latestEarnings: 'N/A' },
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
        data: { symbol: sym, regularMarketPrice: null, regularMarketPreviousClose: null, sector: knownSectors[sym] || 'Unknown', peRatio: 'N/A', latestEarnings: 'N/A' },
        timestamp: Date.now()
      };
    } else if (cache[sym].data.sector === 'Unknown') {
      cache[sym].data.sector = knownSectors[sym] || 'Unknown';
    }
  });

  return symbols.map(sym => cache[sym].data);
}
