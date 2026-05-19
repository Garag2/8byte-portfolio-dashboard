import { PortfolioHolding, EnrichedHolding, PortfolioData, PortfolioSummary, SectorAllocation } from '../types/portfolio';
import { getStockData } from './yahooFinance';

function checkMarketStatus(): 'Open' | 'Closed' {
  // NSE/BSE trading hours: Mon–Fri, 9:15 AM – 3:30 PM IST (UTC+5:30)
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST = UTC + 5:30
  const ist = new Date(now.getTime() + istOffset);

  const day = ist.getUTCDay(); // 0 = Sun, 6 = Sat
  const hours = ist.getUTCHours();
  const minutes = ist.getUTCMinutes();
  const totalMinutes = hours * 60 + minutes;

  const marketOpen = 9 * 60 + 15;   // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM

  if (day === 0 || day === 6) return 'Closed'; // Weekend
  if (totalMinutes < marketOpen || totalMinutes >= marketClose) return 'Closed';
  return 'Open';
}

export async function getEnrichedPortfolio(holdings: PortfolioHolding[]): Promise<PortfolioData> {
  const symbols = holdings.map(h => h.symbol);
  
  if (symbols.length === 0) {
    return {
      holdings: [],
      summary: { totalInvestment: 0, presentValue: 0, totalGainLossAmount: 0, totalGainLossPercentage: 0, dayGainLossAmount: 0, dayGainLossPercentage: 0 },
      sectors: [],
      lastUpdated: new Date().toISOString(),
      marketStatus: 'Closed'
    };
  }

  const stockData = await getStockData(symbols);
  const dataMap = new Map(stockData.map((d: any) => [d.symbol, d]));

  let totalInvestment = 0;
  let presentValue = 0;
  let dayGainLossAmount = 0;

  const enrichedHoldings: EnrichedHolding[] = holdings.map(holding => {
    const data = dataMap.get(holding.symbol);
    
    const currentPrice = data?.regularMarketPrice || holding.averageBuyPrice;
    const previousClose = data?.regularMarketPreviousClose || currentPrice;
    
    const investment = holding.averageBuyPrice * holding.shares;
    const value = currentPrice * holding.shares;
    
    const gainLossAmount = value - investment;
    const gainLossPercentage = investment > 0 ? (gainLossAmount / investment) * 100 : 0;
    
    const dayGainAmount = (currentPrice - previousClose) * holding.shares;
    const dayGainPercentage = previousClose > 0 ? ((currentPrice - previousClose) / previousClose) * 100 : 0;

    totalInvestment += investment;
    presentValue += value;
    dayGainLossAmount += dayGainAmount;

    return {
      ...holding,
      name: data?.shortName || data?.longName || holding.symbol,
      currentPrice,
      previousClose,
      totalInvestment: investment,
      presentValue: value,
      totalGainLossAmount: gainLossAmount,
      totalGainLossPercentage: gainLossPercentage,
      dayGainLossAmount: dayGainAmount,
      dayGainLossPercentage: dayGainPercentage,
      portfolioPercentage: 0, 
      sector: data?.sector || 'Unknown',
      peRatio: data?.peRatio || 'N/A',
      latestEarnings: data?.latestEarnings || 'N/A'
    };
  });

  enrichedHoldings.forEach(h => {
    h.portfolioPercentage = presentValue > 0 ? (h.presentValue / presentValue) * 100 : 0;
  });
  
  enrichedHoldings.sort((a, b) => b.presentValue - a.presentValue);

  const totalGainLossAmount = presentValue - totalInvestment;
  const totalGainLossPercentage = totalInvestment > 0 ? (totalGainLossAmount / totalInvestment) * 100 : 0;
  const previousTotalValue = presentValue - dayGainLossAmount;
  const dayGainLossPercentage = previousTotalValue > 0 ? (dayGainLossAmount / previousTotalValue) * 100 : 0;

  const summary: PortfolioSummary = {
    totalInvestment,
    presentValue,
    totalGainLossAmount,
    totalGainLossPercentage,
    dayGainLossAmount,
    dayGainLossPercentage,
  };

  const sectorMap = new Map<string, number>();
  enrichedHoldings.forEach(h => {
    sectorMap.set(h.sector, (sectorMap.get(h.sector) || 0) + h.presentValue);
  });

  const sectors: SectorAllocation[] = Array.from(sectorMap.entries())
    .map(([sector, value]) => ({
      sector,
      value,
      percentage: presentValue > 0 ? (value / presentValue) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value);

  return {
    holdings: enrichedHoldings,
    summary,
    sectors,
    lastUpdated: new Date().toISOString(),
    marketStatus: checkMarketStatus()
  };
}
