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
      {/* Card 1: Total Investment */}
      <div className="glass-panel p-5 md:p-6 rounded-2xl flex flex-col gap-2 md:gap-3 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)] relative overflow-hidden group">
        <div className="absolute right-4 top-4 text-3xl opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-300 select-none">
          💰
        </div>
        <div className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider flex items-center gap-2">
          <Wallet size={16} className="text-blue-400 group-hover:animate-bounce" /> Total Investment 🏦
        </div>
        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
          {formatCurrency(summary.totalInvestment)}
        </div>
      </div>

      {/* Card 2: Current Value */}
      <div className="glass-panel p-5 md:p-6 rounded-2xl flex flex-col gap-2 md:gap-3 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgb(99,102,241,0.15)] relative overflow-hidden group">
        <div className="absolute right-4 top-4 text-3xl opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-300 select-none">
          💎
        </div>
        <div className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider flex items-center gap-2">
          <Briefcase size={16} className="text-indigo-400 group-hover:animate-bounce" /> Current Value 🚀
        </div>
        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
          {formatCurrency(summary.presentValue)}
        </div>
      </div>
      
      {/* Card 3: Overall Return */}
      <div className="glass-panel p-5 md:p-6 rounded-2xl flex flex-col gap-2 md:gap-3 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgb(16,185,129,0.15)] relative overflow-hidden group cursor-pointer">
        <div className="absolute right-4 top-4 text-3xl opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-300 select-none">
          🏆
        </div>
        <div className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider flex items-center gap-2">
          <DollarSign size={16} className="text-emerald-400 group-hover:animate-bounce" /> Overall Return 🤑
        </div>
        <div className="text-2xl md:text-3xl font-bold">
          <GainLossBadge amount={summary.totalGainLossAmount} percentage={summary.totalGainLossPercentage} />
        </div>
      </div>

      {/* Card 4: Today's Return */}
      <div className="glass-panel p-5 md:p-6 rounded-2xl flex flex-col gap-2 md:gap-3 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgb(245,158,11,0.15)] relative overflow-hidden group cursor-pointer">
        <div className="absolute right-4 top-4 text-3xl opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-300 select-none">
          ⚡
        </div>
        <div className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider flex items-center gap-2">
          <Activity size={16} className="text-amber-400 group-hover:animate-bounce" /> Today&apos;s Return 🔥
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
