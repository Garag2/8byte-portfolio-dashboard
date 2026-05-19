"use client";
import React from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import Loading from '../components/Loading';
import SummaryCards from '../components/SummaryCards';
import SectorSummary from '../components/SectorSummary';
import PortfolioTable from '../components/PortfolioTable';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { data, loading, error } = usePortfolio();

  if (loading && !data) return <Loading />;
  
  if (error && !data) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="glass-panel p-8 rounded-2xl text-center flex flex-col items-center gap-4 max-w-md">
          <AlertCircle size={48} className="text-rose-500" />
          <h2 className="text-xl font-bold text-rose-400">Connection Error</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-12 max-w-[1600px] mx-auto flex flex-col gap-6 md:gap-8 transition-opacity duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-1 md:mb-2">
            Portfolio Analytics
          </h1>
          <p className="text-slate-400 text-base md:text-lg">Real-time tracking of your investments.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm font-medium text-slate-300 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-lg self-start md:self-auto">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 md:h-3 md:w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${data.marketStatus === 'Open' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 ${data.marketStatus === 'Open' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            Market {data.marketStatus}
          </div>
          <div className="w-px h-3 md:h-4 bg-white/20"></div>
          <div className="flex items-center gap-1 md:gap-2">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Updated {new Date(data.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-6 md:gap-8">
        <SummaryCards summary={data.summary} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <PortfolioTable holdings={data.holdings} />
          </div>
          
          <div className="xl:col-span-1">
            <SectorSummary sectors={data.sectors} />
          </div>
        </div>
      </div>
    </div>
  );
}
