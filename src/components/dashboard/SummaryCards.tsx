import React from 'react';
import { Clock, Dumbbell, Sparkles } from 'lucide-react';

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
        <h3 className="text-sm font-semibold text-slate-200">Today's Activity</h3>
        <span className="text-[11px] font-medium text-slate-500">Live updates</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {/* Card 1: Waktu / Active Time (Pastel Blue) */}
        <div className="bg-[#101b2b] border border-sky-500/20 rounded-3xl p-3.5 flex flex-col justify-between h-32 shadow-pastel-blue/30 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="w-8 h-8 rounded-2xl bg-sky-400/20 text-sky-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-medium text-sky-300 block mb-0.5">Waktu</span>
            <div className="text-lg font-bold text-white tracking-tight">
              {activeMinutes} <span className="text-[10px] font-normal text-slate-400">mnt</span>
            </div>
          </div>
        </div>

        {/* Card 2: Jumlah Latihan (Pastel Green) */}
        <div className="bg-[#0f241a] border border-emerald-500/20 rounded-3xl p-3.5 flex flex-col justify-between h-32 shadow-pastel-green/30 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="w-8 h-8 rounded-2xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center">
            <Dumbbell className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-medium text-emerald-300 block mb-0.5">Latihan</span>
            <div className="text-lg font-bold text-white tracking-tight">
              {workoutsCompleted} <span className="text-[10px] font-normal text-slate-400">sesi</span>
            </div>
          </div>
        </div>

        {/* Card 3: Gamification Points (Pastel Purple) */}
        <div className="bg-[#1d122c] border border-purple-500/25 rounded-3xl p-3.5 flex flex-col justify-between h-32 shadow-pastel-purple/30 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="w-8 h-8 rounded-2xl bg-purple-400/20 text-purple-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-medium text-purple-300 block mb-0.5">Aura Poin</span>
            <div className="text-lg font-bold text-white tracking-tight">
              +{pointsEarned} <span className="text-[10px] font-normal text-slate-400">pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
