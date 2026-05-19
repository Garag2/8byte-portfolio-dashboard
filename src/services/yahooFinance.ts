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

// Mock fallback for PE / Earnings
const mockData: Record<string, { peRatio: number; latestEarnings: string }> = {
  AAPL: { peRatio: 28.5, latestEarnings: 'Q2 2026' },
  MSFT: { peRatio: 35.2, latestEarnings: 'Q2 2026' },
  GOOGL: { peRatio: 22.1, latestEarnings: 'Q1 2026' },
  AMZN: { peRatio: 40.5, latestEarnings: 'Q3 2026' },
  NVDA: { peRatio: 65.4, latestEarnings: 'Q4 2026' },
  JPM: { peRatio: 11.2, latestEarnings: 'Q1 2026' },
  JNJ: { peRatio: 15.6, latestEarnings: 'Q2 2026' },
  PG: { peRatio: 20.4, latestEarnings: 'Q3 2026' },
  XOM: { peRatio: 12.8, latestEarnings: 'Q4 2026' }
};

export async function getStockData(symbols: string[]) {
  const now = Date.now();
  const symbolsToFetch = symbols.filter(sym => {
    const cached = cache[sym];
    return !cached || (now - cached.timestamp > CACHE_TTL_MS);
  });

  if (symbolsToFetch.length > 0) {
    try {
      const quotes = await yahooFinance.quote(symbolsToFetch);
      const quotesArray = Array.isArray(quotes) ? quotes : [quotes];

      quotesArray.forEach((quote: any) => {
        cache[quote.symbol] = {
          data: {
            ...quote,
            sector: knownSectors[quote.symbol] || 'Unknown',
            peRatio: mockData[quote.symbol]?.peRatio || 'N/A',
            latestEarnings: mockData[quote.symbol]?.latestEarnings || 'N/A'
          },
          timestamp: now
        };
      });
    } catch (error) {
      console.error('Yahoo Finance Error:', error);
      // Fallback: If cache is empty, insert empty mock data to prevent crashes
      symbolsToFetch.forEach(sym => {
        if (!cache[sym]) {
          cache[sym] = {
            data: { symbol: sym, regularMarketPrice: null, regularMarketPreviousClose: null, sector: knownSectors[sym] || 'Unknown', peRatio: 'N/A', latestEarnings: 'N/A' },
            timestamp: now
          };
        }
      });
    }
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
