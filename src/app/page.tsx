"use client";

import { usePortfolio } from '../hooks/usePortfolio';
import Loading from '../components/Loading';
import SummaryCards from '../components/SummaryCards';
import SectorSummary from '../components/SectorSummary';
import PortfolioTable from '../components/PortfolioTable';
import styles from '../components/dashboard.module.css';

export default function DashboardPage() {
  const { data, loading, error } = usePortfolio();

  if (loading && !data) return <Loading />;
  
  if (error) {
    return (
      <div className={styles.container}>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
          <h2 style={{ color: 'var(--negative-color)' }}>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Portfolio Dashboard</h1>
        <p className={styles.subtitle}>Real-time tracking and analysis of your investments.</p>
      </header>

      <div className={styles.grid}>
        <SummaryCards summary={data.summary} />
        
        <div className={styles.mainContent}>
          <PortfolioTable holdings={data.holdings} />
        </div>
        
        <div className={styles.sideContent}>
          <SectorSummary sectors={data.sectors} />
        </div>
      </div>
    </div>
  );
}
