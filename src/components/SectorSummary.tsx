"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SectorAllocation } from '../types/portfolio';
import styles from './dashboard.module.css';
import { formatCurrency } from '../utils/formatter';

interface Props {
  sectors: SectorAllocation[];
}

const COLORS = ['#45f3ff', '#00ff88', '#ff3366', '#f39c12', '#9b59b6', '#3498db', '#e74c3c'];

export default function SectorSummary({ sectors }: Props) {
  return (
    <div className="glass-panel" style={{ height: '100%' }}>
      <div className={styles.cardTitle}>Sector Allocation</div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sectors}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
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
              formatter={(value: any) => formatCurrency(Number(value))}
              contentStyle={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--surface-border)', borderRadius: '8px' }}
            />
            <Legend wrapperStyle={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
