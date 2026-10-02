import React, { useState } from 'react';
import type { UserProfile } from '../onboarding/Onboarding';
import type { DailyLog } from '../../lib/supabase';
import { CircularProgress } from './CircularProgress';
import { SummaryCards } from './SummaryCards';
import { ActivityChart } from './ActivityChart';
import { MuscleWorkload, type MuscleGroup } from './MuscleWorkload';
import { AICoachCard } from './AICoachCard';
import { LogForm } from '../LogForm';
import { HistoryDashboard } from '../HistoryDashboard';
import { Flame, PlusCircle, Settings, X } from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  logs: DailyLog[];
  advice: string;
  isGeneratingAdvice: boolean;
  onAddLog: (log: Omit<DailyLog, 'id' | 'created_at'>, muscles: MuscleGroup[]) => Promise<void>;
  onRefreshAdvice: () => void;
  onResetOnboarding: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  logs,
  advice,
  isGeneratingAdvice,
  onAddLog,
  onRefreshAdvice,
  onResetOnboarding,
}) => {
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>(['Shoulders', 'Arms']);
  const [showLogModal, setShowLogModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  const toggleMuscle = (muscle: MuscleGroup) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    );
  };

  const handleFormSubmit = async (logData: Omit<DailyLog, 'id' | 'created_at'>) => {
    await onAddLog(logData, selectedMuscles);
    setShowLogModal(false);
  };

  // Gamification & stats calculations
  const todayDateStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  const totalPoints = logs.length * 150 + 250;
  const activeMinutesToday = logs.length > 0 ? 45 + logs.length * 15 : 45;
  const workoutsCount = logs.length > 0 ? logs.length : 1;

  // Circular progress: Calorie target calculation
  const burnedCalories = Math.min(2200, 1650 + logs.length * 180);
  const percentage = Math.round((burnedCalories / profile.dailyCalorieTarget) * 100);

  return (
    <div className="space-y-5 pb-12 animate-fadeIn">
      {/* Top Header: Greeting & Date */}
      <header className="flex items-center justify-between pt-safe-top">
        <div>
          <span className="text-[11px] font-semibold text-purple-400 tracking-wider uppercase block">
            {todayDateStr}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
            Hello, {profile.name} <span className="text-xl">👋</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-semibold shadow-pastel-purple active:scale-95 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Catat Log</span>
          </button>

          <button
            onClick={onResetOnboarding}
            className="w-9 h-9 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
            title="Ubah Profil / Assessment"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Navigation Tabs (Overview vs History) */}
      <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-slate-800/80 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 rounded-xl font-semibold transition ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Dashboard & AI Coach
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 rounded-xl font-semibold transition ${
            activeTab === 'history'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Riwayat Log ({logs.length})
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Circular Progress: Daily Calorie Goal */}
          <CircularProgress
            percentage={percentage}
            currentValue={burnedCalories}
            targetValue={profile.dailyCalorieTarget}
            unit="kkal"
            label="Target Kalori Harian"
          />

          {/* Today's Activity Summary Cards (Pastel theme) */}
          <SummaryCards
            activeMinutes={activeMinutesToday}
            workoutsCompleted={workoutsCount}
            pointsEarned={totalPoints}
          />

          {/* Pro Coach AI Card */}
          <AICoachCard
            advice={advice}
            isLoading={isGeneratingAdvice}
            onRefreshAdvice={onRefreshAdvice}
            coachName="Pro Coach AI"
          />

          {/* Muscle Workload Selector */}
          <MuscleWorkload
            selectedMuscles={selectedMuscles}
            onToggleMuscle={toggleMuscle}
          />

          {/* Weekly Activity Line Chart (Recharts) */}
          <ActivityChart />
        </>
      ) : (
        /* History Tab */
        <div className="space-y-4">
          <HistoryDashboard logs={logs} latestAdvice={advice} isGeneratingAdvice={isGeneratingAdvice} />
        </div>
      )}

      {/* Modal Popup Input Log Harian */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-purple-400" /> Tambah Aktivitas Hari Ini
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4">
              <span className="text-[11px] text-purple-300 font-medium block mb-1.5">
                Target Otot Terpilih:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedMuscles.map((m) => (
                  <span
                    key={m}
                    className="text-[10px] bg-purple-500/15 border border-purple-500/30 text-purple-200 px-2 py-0.5 rounded-lg"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <LogForm onSubmit={handleFormSubmit} isLoading={isGeneratingAdvice} />
          </div>
        </div>
      )}
    </div>
  );
};
