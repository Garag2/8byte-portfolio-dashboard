import { PortfolioHolding } from '../types/portfolio';

export const calculateTotalCostBasis = (holdings: PortfolioHolding[]): number => {
  return holdings.reduce((total, holding) => {
    return total + (holding.shares * holding.averageBuyPrice);
  }, 0);
};

export const calculatePercentageChange = (currentValue: number, previousValue: number): number => {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};
