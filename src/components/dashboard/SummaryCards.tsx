import React from 'react';
import { Clock, Dumbbell, Sparkles, TrendingUp } from 'lucide-react';

interface SummaryCardsProps {
  activeMinutes: number;
  workoutsCompleted: number;
  pointsEarned: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  activeMinutes,
  workoutsCompleted,
  pointsEarned,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Today's Activity</h3>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Real-time stats</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Card 1: Waktu / Active Minutes */}
        <div className="bg-white dark:bg-[#131B2E] rounded-[28px] p-4 border border-slate-100 dark:border-slate-800 shadow-mockup dark:shadow-mockup-dark flex flex-col justify-between h-32 hover:shadow-mockup-lg transition-all group">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> +12%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block mb-0.5">Waktu Latihan</span>
            <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
              {activeMinutes} <span className="text-xs font-normal text-slate-400 dark:text-slate-500">mnt</span>
            </div>
          </div>
        </div>

        {/* Card 2: Jumlah Sesi Latihan */}
        <div className="bg-white dark:bg-[#131B2E] rounded-[28px] p-4 border border-slate-100 dark:border-slate-800 shadow-mockup dark:shadow-mockup-dark flex flex-col justify-between h-32 hover:shadow-mockup-lg transition-all group">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> +100%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block mb-0.5">Sesi Selesai</span>
            <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
              {workoutsCompleted} <span className="text-xs font-normal text-slate-400 dark:text-slate-500">sesi</span>
            </div>
          </div>
        </div>

        {/* Card 3: Aura Gamification Points */}
        <div className="bg-white dark:bg-[#131B2E] rounded-[28px] p-4 border border-slate-100 dark:border-slate-800 shadow-mockup dark:shadow-mockup-dark flex flex-col justify-between h-32 hover:shadow-mockup-lg transition-all group">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded-full">
              pts
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block mb-0.5">Aura Poin</span>
            <div className="text-xl font-black text-purple-600 dark:text-purple-400 tracking-tight font-sans">
              +{pointsEarned}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
