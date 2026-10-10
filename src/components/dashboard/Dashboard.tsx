import React, { useState } from 'react';
import type { UserProfile } from '../onboarding/Onboarding';
import type { DailyLog } from '../../lib/supabase';
import { CircularProgress } from './CircularProgress';
import { SummaryCards } from './SummaryCards';
import { ActivityChart } from './ActivityChart';
import { MuscleWorkload, type MuscleGroup } from './MuscleWorkload';
import { AICoachCard } from './AICoachCard';
import { GoalAnalytics } from '../analytics/GoalAnalytics';
import { LogForm } from '../LogForm';
import { HistoryDashboard } from '../HistoryDashboard';
import { Flame, PlusCircle, Settings, Target, X, Calendar as CalendarIcon, UserCheck } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'history'>('overview');

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
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Header: Responsive App Bar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-purple-400 tracking-wider uppercase mb-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{todayDateStr}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Hello, {profile.name} <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Level: <span className="text-purple-300 font-medium">{profile.fitnessLevel}</span> • Berat Awal: <span className="text-slate-200">{profile.initialWeight} kg</span>
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Quick Log Button (Mobile & Desktop) */}
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-semibold shadow-pastel-purple active:scale-95 transition cursor-pointer lg:hidden"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Catat Log</span>
          </button>

          <button
            onClick={onResetOnboarding}
            className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center gap-2 text-xs font-medium transition active:scale-95 cursor-pointer shadow-soft"
            title="Ubah Profil"
          >
            <Settings className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Pengaturan Profil</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/90 text-xs gap-1 max-w-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 rounded-xl font-semibold transition cursor-pointer text-center ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Dashboard Utama
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex-1 py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'goals'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Target className="w-3.5 h-3.5 text-purple-300" />
          <span>Analitik Target & Pace</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 rounded-xl font-semibold transition cursor-pointer text-center ${
            activeTab === 'history'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Riwayat ({logs.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Area (Left on Desktop: 8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Daily Calorie Goal Circular Progress */}
            <CircularProgress
              percentage={percentage}
              currentValue={burnedCalories}
              targetValue={profile.dailyCalorieTarget}
              unit="kkal"
              label="Target Kalori Harian"
            />

            {/* Today's Activity Summary Cards */}
            <SummaryCards
              activeMinutes={activeMinutesToday}
              workoutsCompleted={workoutsCount}
              pointsEarned={totalPoints}
            />

            {/* Weekly Activity Line Chart (Recharts) */}
            <ActivityChart />

            {/* Muscle Workload Selector */}
            <MuscleWorkload
              selectedMuscles={selectedMuscles}
              onToggleMuscle={toggleMuscle}
            />
          </div>

          {/* Sidebar Area (Right on Desktop: 4 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Pro Coach AI Card */}
            <AICoachCard
              advice={advice}
              isLoading={isGeneratingAdvice}
              onRefreshAdvice={onRefreshAdvice}
              coachName="Pro Coach AI"
            />

            {/* Desktop Direct Log Form (Inline) */}
            <div className="hidden lg:block bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-soft space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-purple-400" /> Catat Aktivitas Cepat
                </h3>
                <span className="text-[10px] text-purple-300 font-medium bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  {selectedMuscles.join(', ') || 'General'}
                </span>
              </div>
              <LogForm onSubmit={handleFormSubmit} isLoading={isGeneratingAdvice} />
            </div>

            {/* Quick Profile Summary Badge Card */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4 flex items-center justify-between shadow-soft">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-300 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">{profile.name} ({profile.gender})</h4>
                  <p className="text-[10px] text-slate-400">Target Harian: {profile.dailyCalorieTarget} kkal</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                Active
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <GoalAnalytics profile={profile} logs={logs} />
      )}

      {activeTab === 'history' && (
        <div className="max-w-3xl space-y-4">
          <HistoryDashboard logs={logs} latestAdvice={advice} isGeneratingAdvice={isGeneratingAdvice} />
        </div>
      )}

      {/* Mobile Modal Popup Input Log Harian */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn lg:hidden">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-purple-400" /> Tambah Aktivitas Hari Ini
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
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
