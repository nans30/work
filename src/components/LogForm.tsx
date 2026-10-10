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
      className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-mockup space-y-4"
    >
      {/* Form Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" /> Catat Aktivitas Hari Ini
        </h2>
        <span className="text-[11px] font-bold px-2.5 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-100">
          Daily Log
        </span>
      </div>

      {/* Grid Inputs: Weight & Sleep */}
      <div className="grid grid-cols-2 gap-3">
        {/* Berat Badan */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-blue-600" /> Berat Badan
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              placeholder="68.5"
              required
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 text-sm pr-9 transition font-medium"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold pointer-events-none">
              kg
            </span>
          </div>
        </div>

        {/* Jam Tidur */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-amber-500" /> Jam Tidur
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
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 text-sm pr-9 transition font-medium"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold pointer-events-none">
              jam
            </span>
          </div>
        </div>
      </div>

      {/* Tipe Latihan */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Dumbbell className="w-3.5 h-3.5 text-emerald-600" /> Tipe Latihan
        </label>
        <div className="relative">
          <select
            value={workout}
            onChange={(e) => setWorkout(e.target.value as WorkoutType)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 text-sm appearance-none cursor-pointer transition font-medium"
          >
            {workoutOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-white text-slate-900">
                {opt}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-3 pointer-events-none text-slate-400 text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Catatan / Notes */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400" /> Catatan Tambahan (Opsional)
        </label>
        <textarea
          rows={2}
          placeholder="Contoh: Otot paha agak pegal, energi latihan bagus..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 text-sm resize-none transition"
        />
      </div>

      {/* Submit Button (Deep Black Pill Button from Mockup) */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#0F172A] hover:bg-black active:scale-[0.98] text-white font-semibold py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50 transition cursor-pointer"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Menganalisis dengan AI...</span>
          </div>
        ) : (
          <>
            <Send className="w-4 h-4 text-purple-400" /> Simpan & Dapatkan Saran AI
          </>
        )}
      </button>
    </form>
  );
};
