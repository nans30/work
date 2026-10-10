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
import {
  Flame,
  Plus,
  Settings,
  Target,
  X,
  UserCheck,
  Home,
  BarChart2,
  ListOrdered,
} from 'lucide-react';

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
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const totalPoints = logs.length * 150 + 250;
  const activeMinutesToday = logs.length > 0 ? 45 + logs.length * 15 : 45;
  const workoutsCount = logs.length > 0 ? logs.length : 1;

  // Circular progress: Calorie target calculation
  const burnedCalories = Math.min(2200, 1650 + logs.length * 180);
  const percentage = Math.round((burnedCalories / profile.dailyCalorieTarget) * 100);

  return (
    <div className="space-y-6 pb-28 animate-fadeIn font-sans">
      {/* Top Header matching mockup ("Wed, 29 Apr 2026 - Hi, Watson 👋") */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-2">
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-0.5">
            {todayDateStr}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Hi, {profile.name} <span className="text-2xl">👋</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Profile / Settings Action Pill */}
          <button
            onClick={onResetOnboarding}
            className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-full border border-slate-200/80 shadow-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer text-xs font-bold"
            title="Pengaturan Profil"
          >
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <span>{profile.fitnessLevel}</span>
            <Settings className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>
        </div>
      </header>

      {/* Tab Switcher (Desktop & Mobile Segmented Control) */}
      <div className="flex bg-white p-1.5 rounded-[24px] border border-slate-100 shadow-mockup text-xs font-bold gap-1 max-w-md">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 rounded-2xl transition cursor-pointer text-center ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex-1 py-2.5 rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'goals'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Target className="w-3.5 h-3.5 text-purple-400" />
          <span>My Goals & Pace</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 rounded-2xl transition cursor-pointer text-center ${
            activeTab === 'history'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Riwayat ({logs.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Area (Left: 8 cols on desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Semi-Circular Progress Gauge from Mockup */}
            <CircularProgress
              percentage={percentage}
              currentValue={burnedCalories}
              targetValue={profile.dailyCalorieTarget}
              unit="kkal"
              label="Target Kalori Harian"
              scoreLabel="Excellent!"
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

          {/* Sidebar Area (Right: 4 cols on desktop) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Pro Coach AI Banner Card */}
            <AICoachCard
              advice={advice}
              isLoading={isGeneratingAdvice}
              onRefreshAdvice={onRefreshAdvice}
              coachName="Pro Coach AI"
            />

            {/* Desktop Direct Log Form (Inline) */}
            <div className="hidden lg:block space-y-3">
              <LogForm onSubmit={handleFormSubmit} isLoading={isGeneratingAdvice} />
            </div>

            {/* Quick Profile Summary Badge Card */}
            <div className="bg-white rounded-[32px] p-5 border border-slate-100 shadow-mockup flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{profile.name} ({profile.gender})</h4>
                  <p className="text-xs text-slate-400">Target Harian: {profile.dailyCalorieTarget} kkal</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
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

      {/* Floating Bottom Navigation Dock (Persis seperti di Mockup Gambar!) */}
      <div className="fixed bottom-5 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-full py-2 px-3 shadow-floating flex items-center gap-1 sm:gap-2 pointer-events-auto">
          {/* Home Tab */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-800'
            }`}
            title="Dashboard Overview"
          >
            <Home className="w-5 h-5" />
          </button>

          {/* Goals Analytics Tab */}
          <button
            onClick={() => setActiveTab('goals')}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition cursor-pointer ${
              activeTab === 'goals'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-800'
            }`}
            title="My Goals & Analytics"
          >
            <BarChart2 className="w-5 h-5" />
          </button>

          {/* History Tab */}
          <button
            onClick={() => setActiveTab('history')}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition cursor-pointer ${
              activeTab === 'history'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-800'
            }`}
            title="Riwayat Aktivitas"
          >
            <ListOrdered className="w-5 h-5" />
          </button>

          <div className="w-[1px] h-6 bg-slate-200 mx-1" />

          {/* Big Black Action Circle Button from Mockup */}
          <button
            onClick={() => setShowLogModal(true)}
            className="w-12 h-12 rounded-full bg-slate-900 hover:bg-black text-white flex items-center justify-center shadow-lg active:scale-95 transition cursor-pointer"
            title="Catat Aktivitas Baru"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Modal Popup Input Log Harian */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-[36px] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-purple-600" /> Tambah Aktivitas Hari Ini
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4">
              <span className="text-[11px] text-purple-700 font-bold block mb-1.5">
                Target Otot Terpilih:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedMuscles.map((m) => (
                  <span
                    key={m}
                    className="text-[10px] font-semibold bg-purple-50 border border-purple-100 text-purple-700 px-2.5 py-0.5 rounded-lg"
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
