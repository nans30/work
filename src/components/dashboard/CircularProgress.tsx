import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

interface CircularProgressProps {
  percentage: number; // 0 to 100
  currentValue: number;
  targetValue: number;
  unit: string;
  label: string;
  scoreLabel?: string;
  onOpenAiCoach?: () => void;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  currentValue,
  targetValue,
  unit,
  label,
  scoreLabel = 'Excellent!',
  onOpenAiCoach,
}) => {
  const validPercentage = Math.min(100, Math.max(0, percentage));

  // SVG dimensions matching the exact arc in the mockup
  const width = 290;
  const height = 160;
  const strokeWidth = 20;
  const radius = 115;
  const cx = width / 2;
  const cy = 142;

  // Circumference of semi-circle = PI * R
  const arcLength = Math.PI * radius;
  const strokeDashoffset = arcLength - (validPercentage / 100) * arcLength;

  return (
    <div className="bg-white dark:bg-[#131B2E] rounded-[32px] p-6 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-mockup relative overflow-hidden flex flex-col justify-between transition-colors">
      {/* Top Header Label from Mockup */}
      <div className="text-center pt-1 mb-1">
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
          {label || 'Fitness Score'}
        </span>
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

        {/* Center Text inside Arc (Exact Mockup Typography) */}
        <div className="absolute top-[42px] flex flex-col items-center text-center">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
            {scoreLabel}
          </span>
          <div className="mt-1.5 inline-flex items-center gap-1 bg-[#10B981] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            +{validPercentage}%
          </div>
        </div>
      </div>

      {/* Bottom Action Card matching mockup: "Optimize your recovery with AI-driven recommendations. >" */}
      <div
        onClick={onOpenAiCoach}
        className="mt-3 bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 rounded-2xl p-3.5 flex items-center justify-between shadow-sm hover:shadow-md transition cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block leading-snug">
              Optimize your fitness with AI Coach
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {currentValue.toLocaleString()} / {targetValue.toLocaleString()} {unit} • Berdasarkan tidur & pemulihan
            </span>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition" />
      </div>
    </div>
  );
};
