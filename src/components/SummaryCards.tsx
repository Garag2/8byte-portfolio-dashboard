import React from 'react';
import { Briefcase, DollarSign, Activity, Wallet } from 'lucide-react';
import { PortfolioSummary } from '../types/portfolio';
import { formatCurrency } from '../utils/formatter';
import GainLossBadge from './GainLossBadge';

interface Props {
  summary: PortfolioSummary;
}

const SummaryCards = React.memo(({ summary }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 w-full">
      <div className="glass-panel p-5 md:p-6 rounded-2xl flex flex-col gap-2 md:gap-3 transition-transform hover:-translate-y-1">
        <div className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider flex items-center gap-2">
          <Wallet size={16} /> Total Investment
        </div>
        <div className="text-2xl md:text-3xl font-bold">{formatCurrency(summary.totalInvestment)}</div>
      </div>

      <div className="glass-panel p-5 md:p-6 rounded-2xl flex flex-col gap-2 md:gap-3 transition-transform hover:-translate-y-1">
        <div className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider flex items-center gap-2">
          <Briefcase size={16} /> Current Value
        </div>
        <div className="text-2xl md:text-3xl font-bold">{formatCurrency(summary.presentValue)}</div>
      </div>
      
      <div className="glass-panel p-5 md:p-6 rounded-2xl flex flex-col gap-2 md:gap-3 transition-transform hover:-translate-y-1">
        <div className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider flex items-center gap-2">
          <DollarSign size={16} /> Overall Return
        </div>
        <div className="text-2xl md:text-3xl font-bold">
          <GainLossBadge amount={summary.totalGainLossAmount} percentage={summary.totalGainLossPercentage} />
        </div>
      </div>

      <div className="glass-panel p-5 md:p-6 rounded-2xl flex flex-col gap-2 md:gap-3 transition-transform hover:-translate-y-1">
        <div className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider flex items-center gap-2">
          <Activity size={16} /> Today's Return
        </div>
        <div className="text-2xl md:text-3xl font-bold">
          <GainLossBadge amount={summary.dayGainLossAmount} percentage={summary.dayGainLossPercentage} />
        </div>
      </div>
    </div>
  );
});

SummaryCards.displayName = 'SummaryCards';
export default SummaryCards;
