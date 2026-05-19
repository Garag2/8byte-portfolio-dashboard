"use client";

import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, SortingState } from '@tanstack/react-table';
import { useState } from 'react';
import { EnrichedHolding } from '../types/portfolio';
import styles from './dashboard.module.css';
import { formatCurrency, formatNumber } from '../utils/formatter';
import GainLossBadge from './GainLossBadge';
import { ArrowUpDown } from 'lucide-react';

interface Props {
  holdings: EnrichedHolding[];
}

export default function PortfolioTable({ holdings }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: holdings,
    columns: [
      {
        accessorKey: 'symbol',
        header: 'Asset',
        cell: info => (
          <div>
            <div className={styles.symbol}>{info.getValue() as string}</div>
            <div className={styles.name}>{info.row.original.name}</div>
          </div>
        ),
      },
      {
        accessorKey: 'shares',
        header: 'Shares',
        cell: info => formatNumber(info.getValue() as number),
      },
      {
        accessorKey: 'currentPrice',
        header: 'Price',
        cell: info => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: 'totalValue',
        header: 'Total Value',
        cell: info => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: 'dayGainLossAmount',
        header: 'Today\'s Change',
        cell: info => (
          <GainLossBadge 
            amount={info.getValue() as number} 
            percentage={info.row.original.dayGainLossPercentage} 
          />
        ),
      },
      {
        accessorKey: 'totalGainLossAmount',
        header: 'Total Return',
        cell: info => (
          <GainLossBadge 
            amount={info.getValue() as number} 
            percentage={info.row.original.totalGainLossPercentage} 
          />
        ),
      },
    ],
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={`glass-panel ${styles.tableWrapper}`}>
      <table className={styles.table}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th 
                  key={header.id} 
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() && <ArrowUpDown size={14} opacity={0.5} />}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
