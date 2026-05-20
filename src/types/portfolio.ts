export interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  averageBuyPrice: number;
}

export interface EnrichedHolding extends PortfolioHolding {
  exchangeCode: string;
  currentPrice: number;
  previousClose: number;
  totalInvestment: number;
  presentValue: number;
  totalGainLossAmount: number;
  totalGainLossPercentage: number;
  dayGainLossAmount: number;
  dayGainLossPercentage: number;
  portfolioPercentage: number;
  sector: string;
  peRatio: string | number;
  latestEarnings: string;
}

export interface PortfolioSummary {
  totalInvestment: number;
  presentValue: number;
  totalGainLossAmount: number;
  totalGainLossPercentage: number;
  dayGainLossAmount: number;
  dayGainLossPercentage: number;
}

export interface SectorAllocation {
  sector: string;
  totalInvestment: number;
  presentValue: number;
  gainLossAmount: number;
  gainLossPercentage: number;
  value: number;
  percentage: number;
}

export interface PortfolioData {
  holdings: EnrichedHolding[];
  summary: PortfolioSummary;
  sectors: SectorAllocation[];
  lastUpdated: string;
  marketStatus: 'Open' | 'Closed';
}
