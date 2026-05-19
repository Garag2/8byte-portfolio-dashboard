import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

export async function getStockData(symbols: string[]) {
  try {
    const quotes = await yahooFinance.quote(symbols);
    const quotesArray = Array.isArray(quotes) ? quotes : [quotes];

    // Fetch summary profiles to get sectors
    const profiles = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const profile: any = await yahooFinance.quoteSummary(symbol, { modules: ['summaryProfile'] });
          return { symbol, sector: profile.summaryProfile?.sector || 'Unknown' };
        } catch (error) {
          console.warn(`Could not fetch profile for ${symbol}`);
          return { symbol, sector: 'Unknown' };
        }
      })
    );

    const sectorMap = new Map(profiles.map(p => [p.symbol, p.sector]));

    return quotesArray.map((quote: any) => ({
      ...quote,
      sector: sectorMap.get(quote.symbol) || 'Unknown'
    }));

  } catch (error) {
    console.error('Error fetching Yahoo Finance data:', error);
    throw error;
  }
}
