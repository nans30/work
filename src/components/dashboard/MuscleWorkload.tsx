import React from 'react';
import { Activity } from 'lucide-react';

export type MuscleGroup = 'Shoulders' | 'Chest' | 'Back' | 'Arms' | 'Core' | 'Legs';

interface MuscleItem {
  id: MuscleGroup;
  name: string;
  category: 'Upper' | 'Lower' | 'Core';
  defaultLoad: number; // 0 to 100%
  color: string;
}

const muscleList: MuscleItem[] = [
  { id: 'Shoulders', name: 'Bahu (Shoulders)', category: 'Upper', defaultLoad: 80, color: 'bg-purple-500' },
  { id: 'Chest', name: 'Dada (Chest)', category: 'Upper', defaultLoad: 65, color: 'bg-indigo-500' },
  { id: 'Back', name: 'Punggung (Back)', category: 'Upper', defaultLoad: 90, color: 'bg-sky-500' },
  { id: 'Arms', name: 'Lengan (Arms)', category: 'Upper', defaultLoad: 70, color: 'bg-emerald-500' },
  { id: 'Core', name: 'Perut (Core)', category: 'Core', defaultLoad: 50, color: 'bg-amber-500' },
  { id: 'Legs', name: 'Kaki (Legs)', category: 'Lower', defaultLoad: 85, color: 'bg-rose-500' },
];

interface MuscleWorkloadProps {
  selectedMuscles: MuscleGroup[];
  onToggleMuscle: (muscle: MuscleGroup) => void;
}

export const MuscleWorkload: React.FC<MuscleWorkloadProps> = ({
  selectedMuscles,
  onToggleMuscle,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-5 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Muscle Workload</h3>
            <p className="text-[10px] text-slate-400">Pilih otot yang difokuskan hari ini</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
          {selectedMuscles.length} Dilatih
        </span>
      </div>

      {/* Grid of Interactive Muscle Badges / Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {muscleList.map((m) => {
          const isSelected = selectedMuscles.includes(m.id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onToggleMuscle(m.id)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-800/90 border-purple-400 shadow-soft scale-[1.01]'
                  : 'bg-slate-950/50 border-slate-800/70 hover:border-slate-700 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white">{m.name}</span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isSelected ? 'bg-purple-400 shadow-sm shadow-purple-400/80' : 'bg-slate-700'
                  }`}
                />
              </div>

              {/* Workload intensity progress bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${isSelected ? m.color : 'bg-slate-700'} rounded-full transition-all duration-300`}
                    style={{ width: isSelected ? `${m.defaultLoad}%` : '20%' }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>{m.category}</span>
                  <span>{isSelected ? `${m.defaultLoad}% load` : 'Resting'}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
