import React from 'react';
import { Target } from 'lucide-react';

interface CircularProgressProps {
  percentage: number; // 0 to 100
  currentValue: number;
  targetValue: number;
  unit: string;
  label: string;
  size?: number;
  strokeWidth?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  currentValue,
  targetValue,
  unit,
  label,
  size = 140,
  strokeWidth = 12,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const validPercentage = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (validPercentage / 100) * circumference;

  return (
    <div className="flex items-center gap-5 bg-gradient-to-br from-slate-900/90 to-slate-950/80 border border-slate-800/80 rounded-3xl p-5 shadow-soft">
      {/* SVG Circular Progress */}
      <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800/60"
            fill="transparent"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#circleGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            fill="transparent"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold tracking-tight text-white font-sans">
            {Math.round(validPercentage)}%
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
            Completed
          </span>
        </div>
      </div>

      {/* Target Details */}
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-400">
          <Target className="w-3.5 h-3.5" />
          <span>{label}</span>
        </div>
        <div className="text-xl font-bold text-white tracking-tight">
          {currentValue.toLocaleString()} <span className="text-xs font-normal text-slate-400">{unit}</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Target harian: <span className="text-slate-200 font-medium">{targetValue.toLocaleString()} {unit}</span>.
          {validPercentage >= 100
            ? ' 🔥 Target harian tercapai!'
            : ` Tersisa ${(targetValue - currentValue).toLocaleString()} ${unit} lagi.`}
        </p>
      </div>
    </div>
  );
};
