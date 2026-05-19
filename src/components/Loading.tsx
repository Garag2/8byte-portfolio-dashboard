import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-white/10 border-l-blue-500 rounded-full animate-spin"></div>
      <p className="text-slate-400">Analyzing Portfolio Data...</p>
    </div>
  );
}
