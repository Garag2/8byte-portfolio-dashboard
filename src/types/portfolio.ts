export interface PortfolioHolding {
  symbol: string;
  shares: number;
  averageBuyPrice: number;
}

export interface EnrichedHolding extends PortfolioHolding {
  currentPrice: number;
  previousClose: number;
  totalValue: number;
  totalGainLossAmount: number;
  totalGainLossPercentage: number;
  dayGainLossAmount: number;
  dayGainLossPercentage: number;
  sector: string;
  name: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalGainLossAmount: number;
  totalGainLossPercentage: number;
  dayGainLossAmount: number;
  dayGainLossPercentage: number;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
}

export interface PortfolioData {
  holdings: EnrichedHolding[];
  summary: PortfolioSummary;
  sectors: SectorAllocation[];
}
