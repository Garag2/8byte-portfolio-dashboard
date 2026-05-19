import { EnrichedHolding, SectorAllocation } from '../types/portfolio';

export const groupHoldingsBySector = (holdings: EnrichedHolding[]): SectorAllocation[] => {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.totalValue, 0);
  const sectorMap = new Map<string, number>();
  
  holdings.forEach(h => {
    sectorMap.set(h.sector, (sectorMap.get(h.sector) || 0) + h.totalValue);
  });

  return Array.from(sectorMap.entries())
    .map(([sector, value]) => ({
      sector,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value);
};
