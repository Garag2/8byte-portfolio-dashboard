import { PortfolioHolding, EnrichedHolding, PortfolioData, PortfolioSummary, SectorAllocation } from '../types/portfolio';
import { getStockData } from './yahooFinance';

export async function getEnrichedPortfolio(holdings: PortfolioHolding[]): Promise<PortfolioData> {
  const symbols = holdings.map(h => h.symbol);
  
  if (symbols.length === 0) {
    return { 
      holdings: [], 
      summary: { totalValue: 0, totalGainLossAmount: 0, totalGainLossPercentage: 0, dayGainLossAmount: 0, dayGainLossPercentage: 0 }, 
      sectors: [] 
    };
  }

  let stockData: any[] = [];
  try {
    stockData = await getStockData(symbols);
  } catch (error) {
    console.error('Failed to fetch stock data, using fallback values:', error);
    // Fallback to empty stock data so we just use buy prices
  }
  
  const dataMap = new Map(stockData.map(d => [d.symbol, d]));

  const enrichedHoldings: EnrichedHolding[] = holdings.map(holding => {
    const data = dataMap.get(holding.symbol);
    
    // If data is unavailable, fallback to the averageBuyPrice
    const currentPrice = data?.regularMarketPrice || holding.averageBuyPrice;
    const previousClose = data?.regularMarketPreviousClose || holding.averageBuyPrice;
    const totalValue = currentPrice * holding.shares;
    const costBasis = holding.averageBuyPrice * holding.shares;
    
    const totalGainLossAmount = totalValue - costBasis;
    const totalGainLossPercentage = costBasis > 0 ? (totalGainLossAmount / costBasis) * 100 : 0;
    
    const dayGainLossAmount = (currentPrice - previousClose) * holding.shares;
    const dayGainLossPercentage = previousClose > 0 ? ((currentPrice - previousClose) / previousClose) * 100 : 0;

    return {
      ...holding,
      currentPrice,
      previousClose,
      totalValue,
      totalGainLossAmount,
      totalGainLossPercentage,
      dayGainLossAmount,
      dayGainLossPercentage,
      sector: data?.sector || 'Unknown',
      name: data?.shortName || data?.longName || holding.symbol,
    };
  });

  // Calculate summary
  let totalValue = 0;
  let totalCostBasis = 0;
  let dayGainLossAmount = 0;

  enrichedHoldings.forEach(h => {
    totalValue += h.totalValue;
    totalCostBasis += (h.averageBuyPrice * h.shares);
    dayGainLossAmount += h.dayGainLossAmount;
  });

  const totalGainLossAmount = totalValue - totalCostBasis;
  const totalGainLossPercentage = totalCostBasis > 0 ? (totalGainLossAmount / totalCostBasis) * 100 : 0;
  const previousTotalValue = totalValue - dayGainLossAmount;
  const dayGainLossPercentage = previousTotalValue > 0 ? (dayGainLossAmount / previousTotalValue) * 100 : 0;

  const summary: PortfolioSummary = {
    totalValue,
    totalGainLossAmount,
    totalGainLossPercentage,
    dayGainLossAmount,
    dayGainLossPercentage,
  };

  // Calculate sectors
  const sectorMap = new Map<string, number>();
  enrichedHoldings.forEach(h => {
    sectorMap.set(h.sector, (sectorMap.get(h.sector) || 0) + h.totalValue);
  });

  const sectors: SectorAllocation[] = Array.from(sectorMap.entries())
    .map(([sector, value]) => ({
      sector,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value);

  return {
    holdings: enrichedHoldings,
    summary,
    sectors,
  };
}
