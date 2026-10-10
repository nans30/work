import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

interface CircularProgressProps {
  percentage: number; // 0 to 100
  label?: string;
  scoreLabel?: string;
  goalTitle?: string;
  completedSessions?: number;
  totalSessions?: number;
  targetValue?: number;
  targetUnit?: string;
  estimatedWeeks?: number;
  onNavigateToGoals?: () => void;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  label = 'Progres Target My Goals',
  scoreLabel = 'Excellent!',
  goalTitle = 'Jogging / Lari Jarak Jauh',
  completedSessions = 0,
  totalSessions = 18,
  estimatedWeeks = 6,
  onNavigateToGoals,
}) => {
  const validPercentage = Math.min(100, Math.max(0, percentage));

  // SVG dimensions matching the exact arc in the mockup
  const width = 300;
  const height = 165;
  const strokeWidth = 18;
  const radius = 122;
  const cx = width / 2;
  const cy = 148;

  // Circumference of semi-circle = PI * R
  const arcLength = Math.PI * radius;
  const strokeDashoffset = arcLength - (validPercentage / 100) * arcLength;

  return (
    <div className="bg-white dark:bg-[#131B2E] rounded-[32px] p-6 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-mockup relative overflow-hidden flex flex-col justify-between transition-colors">
      {/* Card Header matching Luxury Mockup */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {label}
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              {goalTitle} • <strong className="text-slate-700 dark:text-slate-300">{completedSessions}/{totalSessions}</strong> Sesi
            </span>
          </div>
        </div>

        <button
          onClick={onNavigateToGoals}
          className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition cursor-pointer"
          title="Atur Target di My Goals"
        >
          {validPercentage}% Tercapai
        </button>
      </div>

      {/* Center Semi-Circular Arc Gauge */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            {/* Exact Gradient from the Mockup Arc (Dark Blue to Purple/Violet) */}
            <linearGradient id="mockupArcGradientExact" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="35%" stopColor="#2563EB" />
              <stop offset="70%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#9333EA" />
            </linearGradient>
          </defs>

          {/* Background track arc (180 degrees) */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="text-[#F1F4F9] dark:text-slate-800"
          />

          {/* Foreground colored arc */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="url(#mockupArcGradientExact)"
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text inside Arc (Positioned comfortably in the hollow center without touching the arc) */}
        <div className="absolute inset-x-0 bottom-3.5 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-sans leading-none mb-1.5">
            {scoreLabel}
          </span>
          <div className="inline-flex items-center gap-1 bg-[#10B981] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            +{validPercentage}%
          </div>
        </div>
      </div>

      {/* Bottom Action Card matching mockup: "Optimize your recovery with AI-driven recommendations. >" */}
      <div
        onClick={onNavigateToGoals}
        className="mt-3 bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 rounded-2xl p-3.5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-purple-200 dark:hover:border-purple-800 transition cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-purple-600 transition">
            <Sparkles className="w-4 h-4 text-purple-300 group-hover:text-white transition" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block leading-snug">
              Target: {goalTitle}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              Estimasi roadmap ~{estimatedWeeks} minggu ({completedSessions}/{totalSessions} sesi) • Klik untuk atur target
            </span>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-0.5 transition" />
      </div>
    </div>
  );
};
