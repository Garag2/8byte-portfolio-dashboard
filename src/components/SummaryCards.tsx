import { Briefcase, DollarSign, Activity } from 'lucide-react';
import styles from './dashboard.module.css';
import { PortfolioSummary } from '../types/portfolio';
import { formatCurrency } from '../utils/formatter';
import GainLossBadge from './GainLossBadge';

interface Props {
  summary: PortfolioSummary;
}

export default function SummaryCards({ summary }: Props) {
  return (
    <div className={styles.summaryCards}>
      <div className={`glass-panel ${styles.card}`}>
        <div className={styles.cardTitle}>
          <Briefcase size={16} /> Total Balance
        </div>
        <div className={styles.cardValue}>{formatCurrency(summary.totalValue)}</div>
      </div>
      
      <div className={`glass-panel ${styles.card}`}>
        <div className={styles.cardTitle}>
          <DollarSign size={16} /> Total Return
        </div>
        <div className={styles.cardValue}>
          <GainLossBadge amount={summary.totalGainLossAmount} percentage={summary.totalGainLossPercentage} />
        </div>
      </div>

      <div className={`glass-panel ${styles.card}`}>
        <div className={styles.cardTitle}>
          <Activity size={16} /> Today's Return
        </div>
        <div className={styles.cardValue}>
          <GainLossBadge amount={summary.dayGainLossAmount} percentage={summary.dayGainLossPercentage} />
        </div>
      </div>
    </div>
  );
}
