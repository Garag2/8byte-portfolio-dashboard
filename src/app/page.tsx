"use client";
import React, { useRef, useEffect, useCallback } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import Loading from '../components/Loading';
import SummaryCards from '../components/SummaryCards';
import SectorSummary from '../components/SectorSummary';
import PortfolioTable from '../components/PortfolioTable';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  emoji: string;
  size: number;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
}

export default function DashboardPage() {
  const { data, loading, error } = usePortfolio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Trigger a full-screen emoji burst
  const triggerCelebration = useCallback((clientX?: number, clientY?: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Default to center if no click coordinates
    const startX = clientX !== undefined ? clientX - rect.left : canvas.width / 2;
    const startY = clientY !== undefined ? clientY - rect.top : canvas.height / 2;

    const emojis = ['🚀', '💰', '📈', '🔥', '💸', '✨', '💎', '🥳', '🟢'];
    const count = 35;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      particlesRef.current.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 5, // Upward bias
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: Math.random() * 20 + 20,
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1
      });
    }
  }, []);

  // Update & Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // Gravity
        p.vx *= 0.98; // Friction
        p.rotation += p.rotationSpeed;
        p.alpha -= 0.015; // Fade

        if (p.alpha <= 0 || p.y > canvas.height) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.font = `${p.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji, 0, 0);
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Auto trigger a small burst if load was successful and returns are green!
  useEffect(() => {
    if (data && data.summary.totalGainLossAmount > 0) {
      const timer = setTimeout(() => {
        triggerCelebration();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [data, triggerCelebration]);

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

  const handleCardClick = (e: React.MouseEvent) => {
    triggerCelebration(e.clientX, e.clientY);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-12 max-w-[1600px] mx-auto flex flex-col gap-6 md:gap-8 transition-opacity duration-500 relative">
      {/* Full Screen Overlay Celebration Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[999]"
      />

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-1 md:mb-2 flex items-center gap-2">
            Portfolio Analytics ✨
          </h1>
          <p className="text-slate-400 text-base md:text-lg">Real-time tracking of your investments.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm font-medium text-slate-300 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-lg self-start md:self-auto hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 md:h-3 md:w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${data.marketStatus === 'Open' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 ${data.marketStatus === 'Open' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            Market {data.marketStatus} {data.marketStatus === 'Open' ? '🟢' : '🔴'}
          </div>
          <div className="w-px h-3 md:h-4 bg-white/20"></div>
          <div className="flex items-center gap-1 md:gap-2">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Updated {new Date(data.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-6 md:gap-8" onClick={handleCardClick}>
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
