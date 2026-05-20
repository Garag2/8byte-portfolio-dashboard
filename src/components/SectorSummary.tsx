"use client";
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SectorAllocation } from '../types/portfolio';
import { formatCurrency, formatPercentage } from '../utils/formatter';
import GainLossBadge from './GainLossBadge';

interface Props {
  sectors: SectorAllocation[];
}

const COLORS = ['#3b82f6', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

const SectorSummary = React.memo(({ sectors }: Props) => {
  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col gap-5">
      <div className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-6">Sector Allocation</div>
      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <PieChart>
            <Pie
              data={sectors}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              nameKey="sector"
              stroke="none"
            >
              {sectors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value ?? 0))}
              contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend wrapperStyle={{ fontSize: '0.8rem', color: '#94a3b8' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-3">
        {sectors.map((sector, index) => (
          <div key={sector.sector} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="font-semibold text-slate-100 truncate">{sector.sector}</span>
              </div>
              <span className="text-xs text-slate-400">{formatPercentage(sector.percentage)}</span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-400">
              <div className="flex items-center justify-between gap-3">
                <span>Total Investment</span>
                <span className="text-slate-200">{formatCurrency(sector.totalInvestment)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Total Present Value</span>
                <span className="text-slate-200">{formatCurrency(sector.presentValue)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Gain/Loss</span>
                <GainLossBadge amount={sector.gainLossAmount} percentage={sector.gainLossPercentage} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

SectorSummary.displayName = 'SectorSummary';
export default SectorSummary;
