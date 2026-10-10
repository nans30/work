import React from 'react';
import { ArrowUpRight, Sparkles, Target } from 'lucide-react';

interface CircularProgressProps {
  percentage: number; // 0 to 100
  currentValue: number;
  targetValue: number;
  unit: string;
  label: string;
  scoreLabel?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  currentValue,
  targetValue,
  unit,
  label,
  scoreLabel = 'Excellent!',
}) => {
  const validPercentage = Math.min(100, Math.max(0, percentage));

  // SVG dimensions for Semi-Circle Arc
  const width = 280;
  const height = 155;
  const strokeWidth = 18;
  const radius = 110;
  const cx = width / 2;
  const cy = 135;

  // Semi-circle circumference = PI * R
  const arcLength = Math.PI * radius;
  const strokeDashoffset = arcLength - (validPercentage / 100) * arcLength;

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-slate-100 shadow-mockup relative overflow-hidden flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Target Harian</span>
            <h3 className="text-sm font-bold text-slate-800">{label}</h3>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          <ArrowUpRight className="w-3.5 h-3.5" />
          +{validPercentage}%
        </span>
      </div>

      {/* Center Semi-Circle Arc Gauge */}
      <div className="relative flex flex-col items-center justify-center my-1">
        <svg width={width} height={height} className="overflow-visible">
          {/* Gradient definitions matching mockup */}
          <defs>
            <linearGradient id="mockupArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#9333EA" />
            </linearGradient>

            <linearGradient id="bgTrackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#F8FAFC" />
            </linearGradient>
          </defs>

          {/* Background track arc (180 degrees) */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Foreground colored arc */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="url(#mockupArcGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text inside Arc */}
        <div className="absolute top-[50px] flex flex-col items-center text-center">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Daily Score
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
            {scoreLabel}
          </span>
          <div className="mt-1 inline-flex items-center gap-1 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            +{validPercentage}%
          </div>
        </div>
      </div>

      {/* Bottom Sub-Card (Recommendations pill) */}
      <div className="mt-2 bg-slate-50/80 border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block leading-snug">
              {currentValue.toLocaleString()} / {targetValue.toLocaleString()} {unit}
            </span>
            <span className="text-[10px] text-slate-500">
              {validPercentage >= 100 ? 'Target tercapai hari ini!' : `Sisa ${(targetValue - currentValue).toLocaleString()} ${unit} lagi`}
            </span>
          </div>
        </div>

        <span className="text-xs font-bold text-purple-600 font-sans">
          {Math.round(validPercentage)}%
        </span>
      </div>
    </div>
  );
};
