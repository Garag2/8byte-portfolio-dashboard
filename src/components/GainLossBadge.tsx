import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatter';

interface Props {
  amount: number;
  percentage: number;
}

const GainLossBadge = React.memo(({ amount, percentage }: Props) => {
  const isPositive = amount > 0;
  const isNegative = amount < 0;

  const typeClass = isPositive 
    ? 'text-emerald-400 bg-emerald-400/10' 
    : isNegative 
      ? 'text-rose-400 bg-rose-400/10' 
      : 'text-slate-400 bg-white/5';
      
  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium ${typeClass}`}>
      <Icon size={14} />
      <span>{formatCurrency(Math.abs(amount))} ({formatPercentage(Math.abs(percentage))})</span>
    </div>
  );
});

GainLossBadge.displayName = 'GainLossBadge';
export default GainLossBadge;
