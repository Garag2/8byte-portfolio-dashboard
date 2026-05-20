import { EnrichedHolding, SectorAllocation } from '../types/portfolio';

export const groupHoldingsBySector = (holdings: EnrichedHolding[]): SectorAllocation[] => {
  const presentValue = holdings.reduce((sum, holding) => sum + holding.presentValue, 0);
  const sectorMap = new Map<string, Pick<SectorAllocation, 'sector' | 'totalInvestment' | 'presentValue' | 'gainLossAmount'>>();
  
  holdings.forEach(h => {
    const sector = sectorMap.get(h.sector) || {
      sector: h.sector,
      totalInvestment: 0,
      presentValue: 0,
      gainLossAmount: 0,
    };

    sector.totalInvestment += h.totalInvestment;
    sector.presentValue += h.presentValue;
    sector.gainLossAmount += h.totalGainLossAmount;
    sectorMap.set(h.sector, sector);
  });

  return Array.from(sectorMap.values())
    .map(sector => ({
      ...sector,
      gainLossPercentage: sector.totalInvestment > 0 ? (sector.gainLossAmount / sector.totalInvestment) * 100 : 0,
      value: sector.presentValue,
      percentage: presentValue > 0 ? (sector.presentValue / presentValue) * 100 : 0
    }))
    .sort((a, b) => b.presentValue - a.presentValue);
};
