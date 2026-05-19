import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] gap-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-[250px] h-[250px] bg-blue-500/10 rounded-full blur-[80px] animate-pulse"></div>
      
      {/* Interactive Spinner */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-slate-700/30 border-l-blue-400 rounded-full animate-spin"></div>
        <div className="text-4xl animate-bounce duration-1000">🚀</div>
      </div>
      
      <div className="text-center z-10 flex flex-col gap-2">
        <h3 className="text-white text-xl font-bold tracking-wide flex items-center justify-center gap-2">
          Crunching Portfolio Data <span className="animate-bounce delay-150">💰</span><span className="animate-bounce delay-300">📈</span>
        </h3>
        <p className="text-slate-400 text-sm animate-pulse">Fetching live prices & computing returns...</p>
      </div>
    </div>
  );
}
