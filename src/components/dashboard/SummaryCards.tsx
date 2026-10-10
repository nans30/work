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
        <h3 className="text-sm font-bold text-slate-900">Today's Activity</h3>
        <span className="text-xs text-slate-400 font-medium">Real-time stats</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Card 1: Waktu / Active Minutes */}
        <div className="bg-white rounded-[28px] p-4 border border-slate-100 shadow-mockup flex flex-col justify-between h-32 hover:shadow-mockup-lg transition-all group">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> +12%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Waktu Latihan</span>
            <div className="text-xl font-black text-slate-900 tracking-tight font-sans">
              {activeMinutes} <span className="text-xs font-normal text-slate-400">mnt</span>
            </div>
          </div>
        </div>

        {/* Card 2: Jumlah Sesi Latihan */}
        <div className="bg-white rounded-[28px] p-4 border border-slate-100 shadow-mockup flex flex-col justify-between h-32 hover:shadow-mockup-lg transition-all group">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> +100%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Sesi Selesai</span>
            <div className="text-xl font-black text-slate-900 tracking-tight font-sans">
              {workoutsCompleted} <span className="text-xs font-normal text-slate-400">sesi</span>
            </div>
          </div>
        </div>

        {/* Card 3: Aura Gamification Points */}
        <div className="bg-white rounded-[28px] p-4 border border-slate-100 shadow-mockup flex flex-col justify-between h-32 hover:shadow-mockup-lg transition-all group">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
              pts
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Aura Poin</span>
            <div className="text-xl font-black text-slate-900 tracking-tight font-sans text-purple-600">
              +{pointsEarned}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
