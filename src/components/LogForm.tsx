import React, { useState } from 'react';
import type { DailyLog, WorkoutType } from '../lib/supabase';
import { Dumbbell, Moon, Scale, Sparkles, Send, FileText } from 'lucide-react';

interface LogFormProps {
  onSubmit: (log: Omit<DailyLog, 'id' | 'created_at'>) => Promise<void>;
  isLoading: boolean;
}

const workoutOptions: WorkoutType[] = [
  'Angkat Beban',
  'Kardio',
  'HIIT / Calisthenics',
  'Yoga & Stretching',
  'Rest Day',
  'Lainnya',
];

export const LogForm: React.FC<LogFormProps> = ({ onSubmit, isLoading }) => {
  const [weight, setWeight] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [workout, setWorkout] = useState<WorkoutType>('Angkat Beban');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !sleepHours) return;

    await onSubmit({
      weight: parseFloat(weight),
      sleep_hours: parseFloat(sleepHours),
      workout,
      notes: notes.trim() || undefined,
      date: new Date().toISOString().split('T')[0],
    });

    setNotes('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-5 shadow-2xl space-y-4 relative overflow-hidden"
    >
      {/* Subtle Glow Background */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Form Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" /> Catat Aktivitas Hari Ini
        </h2>
        <span className="text-[11px] font-medium px-2.5 py-0.5 bg-indigo-500/15 text-indigo-300 rounded-full border border-indigo-500/20">
          Input Harian
        </span>
      </div>

      {/* Grid Inputs: Weight & Sleep */}
      <div className="grid grid-cols-2 gap-3">
        {/* Berat Badan */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-blue-400" /> Berat Badan
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              placeholder="68.5"
              required
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-700/60 rounded-2xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm pr-9 transition-all"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium pointer-events-none">
              kg
            </span>
          </div>
        </div>

        {/* Jam Tidur */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-amber-400" /> Durasi Tidur
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.5"
              min="0"
              max="24"
              placeholder="7.5"
              required
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-700/60 rounded-2xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm pr-9 transition-all"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium pointer-events-none">
              jam
            </span>
          </div>
        </div>
      </div>

      {/* Tipe Latihan */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
          <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Tipe Latihan
        </label>
        <div className="relative">
          <select
            value={workout}
            onChange={(e) => setWorkout(e.target.value as WorkoutType)}
            className="w-full bg-slate-950/70 border border-slate-700/60 rounded-2xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm appearance-none cursor-pointer transition-all"
          >
            {workoutOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-slate-900 text-slate-200">
                {opt}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-3 pointer-events-none text-slate-500 text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Catatan / Notes */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400" /> Catatan Tambahan (Opsional)
        </label>
        <textarea
          rows={2}
          placeholder="Contoh: Otot paha agak pegal, merasa berenergi tinggi..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-slate-950/70 border border-slate-700/60 rounded-2xl px-3.5 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm resize-none transition-all"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:scale-[0.98] text-white font-medium py-3 rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50 transition-all cursor-pointer"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Menganalisis dengan AI...</span>
          </div>
        ) : (
          <>
            <Send className="w-4 h-4" /> Simpan & Dapatkan Saran AI
          </>
        )}
      </button>
    </form>
  );
};
