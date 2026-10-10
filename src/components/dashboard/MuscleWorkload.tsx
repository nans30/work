import React from 'react';
import { Activity } from 'lucide-react';

export type MuscleGroup = 'Shoulders' | 'Chest' | 'Back' | 'Arms' | 'Core' | 'Legs';

interface MuscleItem {
  id: MuscleGroup;
  name: string;
  category: 'Upper' | 'Lower' | 'Core';
  defaultLoad: number;
  colorGradient: string;
}

const muscleList: MuscleItem[] = [
  { id: 'Shoulders', name: 'Bahu (Shoulders)', category: 'Upper', defaultLoad: 80, colorGradient: 'from-purple-500 to-indigo-600' },
  { id: 'Chest', name: 'Dada (Chest)', category: 'Upper', defaultLoad: 65, colorGradient: 'from-blue-500 to-indigo-600' },
  { id: 'Back', name: 'Punggung (Back)', category: 'Upper', defaultLoad: 90, colorGradient: 'from-sky-500 to-blue-600' },
  { id: 'Arms', name: 'Lengan (Arms)', category: 'Upper', defaultLoad: 70, colorGradient: 'from-emerald-500 to-teal-600' },
  { id: 'Core', name: 'Perut (Core)', category: 'Core', defaultLoad: 50, colorGradient: 'from-amber-500 to-orange-600' },
  { id: 'Legs', name: 'Kaki (Legs)', category: 'Lower', defaultLoad: 85, colorGradient: 'from-rose-500 to-pink-600' },
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
    <div className="bg-white dark:bg-[#131B2E] rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-mockup dark:shadow-mockup-dark space-y-4 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Muscle Workload</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Pilih fokus otot latihan hari ini</p>
          </div>
        </div>
        <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full border border-purple-100 dark:border-purple-800">
          {selectedMuscles.length} Fokus Otot
        </span>
      </div>

      {/* Grid of Interactive Muscle Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {muscleList.map((m) => {
          const isSelected = selectedMuscles.includes(m.id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onToggleMuscle(m.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 dark:bg-purple-600 text-white border-slate-900 dark:border-purple-500 shadow-md scale-[1.02]'
                  : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                  {m.name}
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isSelected ? 'bg-emerald-400 shadow-sm' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                />
              </div>

              <div className="space-y-1 mt-1">
                <div className="w-full bg-slate-200/60 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isSelected ? `bg-gradient-to-r ${m.colorGradient}` : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    style={{ width: isSelected ? `${m.defaultLoad}%` : '20%' }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
                  <span>{m.category}</span>
                  <span className={isSelected ? 'text-purple-200 dark:text-purple-200 font-medium' : 'text-slate-400'}>
                    {isSelected ? `${m.defaultLoad}% load` : 'Resting'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
