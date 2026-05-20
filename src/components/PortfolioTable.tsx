"use client";
import React, { useState, useMemo } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, useReactTable, SortingState } from '@tanstack/react-table';
import { EnrichedHolding } from '../types/portfolio';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatter';
import GainLossBadge from './GainLossBadge';
import { ArrowUpDown } from 'lucide-react';

interface Props {
  holdings: EnrichedHolding[];
}

const PortfolioTable = React.memo(({ holdings }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<EnrichedHolding>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Particulars',
      cell: ({ getValue, row }) => (
        <div>
          <div className="font-bold text-blue-400">{getValue<string>()}</div>
          <div className="text-xs text-slate-400 mt-1">{row.original.symbol}</div>
        </div>
      ),
    },
    {
      accessorKey: 'averageBuyPrice',
      header: 'Purchase Price',
      cell: ({ getValue }) => formatCurrency(getValue<number>()),
    },
    {
      accessorKey: 'shares',
      header: 'Qty',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    },
    {
      accessorKey: 'totalInvestment',
      header: 'Investment',
      cell: ({ getValue }) => formatCurrency(getValue<number>()),
    },
    {
      accessorKey: 'portfolioPercentage',
      header: 'Portfolio %',
      cell: ({ getValue }) => formatPercentage(getValue<number>()),
    },
    {
      accessorKey: 'exchangeCode',
      header: 'NSE/BSE',
      cell: ({ getValue }) => <span className="font-medium text-slate-300">{getValue<string>()}</span>,
    },
    {
      accessorKey: 'currentPrice',
      header: 'CMP',
      cell: ({ getValue }) => formatCurrency(getValue<number>()),
    },
    {
      accessorKey: 'presentValue',
      header: 'Present Value',
      cell: ({ getValue }) => formatCurrency(getValue<number>()),
    },
    {
      accessorKey: 'totalGainLossAmount',
      header: 'Gain/Loss',
      cell: ({ getValue, row }) => (
        <GainLossBadge 
          amount={getValue<number>()} 
          percentage={row.original.totalGainLossPercentage} 
        />
      ),
    },
    {
      accessorKey: 'peRatio',
      header: 'P/E (TTM)',
      cell: ({ getValue }) => {
        const val = getValue<string | number>();
        return <span className="text-slate-300">{(!val || val === 'N/A') ? '—' : val}</span>;
      },
    },
    {
      accessorKey: 'latestEarnings',
      header: 'Latest Earnings',
      cell: ({ getValue }) => {
        const val = getValue<string>();
        return <span className="text-slate-300">{(!val || val === 'N/A') ? '—' : val}</span>;
      },
    }
  ], []);

  const table = useReactTable({
    data: holdings,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="glass-panel rounded-2xl w-full overflow-hidden flex flex-col h-[500px] md:h-[600px] max-h-[70vh]">
      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px] relative">
          <thead className="sticky top-0 z-10 bg-slate-800/95 backdrop-blur-md shadow-sm">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-white/10">
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    onClick={header.column.getToggleSortingHandler()}
                    className={`p-4 text-sm font-medium text-slate-400 whitespace-nowrap bg-slate-900/50 ${header.column.getCanSort() ? 'cursor-pointer hover:text-slate-200' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && <ArrowUpDown size={14} className="opacity-50" />}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-4 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

PortfolioTable.displayName = 'PortfolioTable';
export default PortfolioTable;
