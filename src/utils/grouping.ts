import { EnrichedHolding, SectorAllocation } from '../types/portfolio';

export const groupHoldingsBySector = (holdings: EnrichedHolding[]): SectorAllocation[] => {
  const presentValue = holdings.reduce((sum, holding) => sum + holding.presentValue, 0);
  const sectorMap = new Map<string, number>();
  
  holdings.forEach(h => {
    sectorMap.set(h.sector, (sectorMap.get(h.sector) || 0) + h.presentValue);
  });

  return Array.from(sectorMap.entries())
    .map(([sector, value]) => ({
      sector,
      value,
      percentage: presentValue > 0 ? (value / presentValue) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value);
};
