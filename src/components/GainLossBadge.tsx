import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import styles from './dashboard.module.css';
import { formatCurrency, formatPercentage } from '../utils/formatter';

interface Props {
  amount: number;
  percentage: number;
}

export default function GainLossBadge({ amount, percentage }: Props) {
  const isPositive = amount > 0;
  const isNegative = amount < 0;
  const isNeutral = amount === 0;

  const typeClass = isPositive ? styles.positive : isNegative ? styles.negative : styles.neutral;
  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <div className={`${styles.badge} ${typeClass}`}>
      <Icon size={14} />
      <span>{formatCurrency(Math.abs(amount))} ({formatPercentage(Math.abs(percentage))})</span>
    </div>
  );
}
