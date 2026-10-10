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
  X,
  UserCheck,
  Home,
  BarChart2,
  ListOrdered,
  Sun,
  Moon,
} from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  logs: DailyLog[];
  advice: string;
  isGeneratingAdvice: boolean;
  onAddLog: (log: Omit<DailyLog, 'id' | 'created_at'>, muscles: MuscleGroup[]) => Promise<void>;
  onRefreshAdvice: () => void;
  onResetOnboarding: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  logs,
  advice,
  isGeneratingAdvice,
  onAddLog,
  onRefreshAdvice,
  onResetOnboarding,
  theme = 'light',
  onToggleTheme,
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

  const todayDateStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const totalPoints = logs.length * 150 + 250;
  const activeMinutesToday = logs.length > 0 ? 45 + logs.length * 15 : 45;
  const workoutsCount = logs.length > 0 ? logs.length : 1;

  const burnedCalories = Math.min(2200, 1650 + logs.length * 180);
  const percentage = Math.round((burnedCalories / profile.dailyCalorieTarget) * 100);

  // Dynamic Header Titles matching mockup (Analytics / My Goals / Recent Activity)
  const getPageHeading = () => {
    switch (activeTab) {
      case 'goals':
        return {
          title: 'My Goals & Analytics',
          subtitle: 'Kalkulator target jarak, repetisi & pacing kecepatan',
        };
      case 'history':
        return {
          title: 'Riwayat Aktivitas',
          subtitle: 'Catatan performa latihan & kualitas pemulihan tidur',
        };
      case 'overview':
      default:
        return {
          title: `Hi, ${profile.name} 👋`,
          subtitle: todayDateStr,
        };
    }
  };

  const currentHeading = getPageHeading();

  return (
    <div className="space-y-6 pb-28 lg:pb-12 animate-fadeIn font-sans">
      {/* Top Header: Clean Page Title without duplicate segmented tabs */}
      <header className="flex items-center justify-between gap-4 pt-2 pb-2">
        <div>
          {activeTab !== 'overview' && (
            <button
              onClick={() => setActiveTab('overview')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline mb-1 cursor-pointer"
            >
              ← Kembali ke Dashboard
            </button>
          )}
          {activeTab === 'overview' && (
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-0.5">
              {currentHeading.subtitle}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {currentHeading.title}
          </h1>
          {activeTab !== 'overview' && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentHeading.subtitle}
            </p>
          )}
        </div>

        {/* Right Action Icons (Theme Switcher & Profile Settings) */}
        <div className="flex items-center gap-2.5">
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center bg-white dark:bg-[#131B2E] p-1 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-sm mr-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-full transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-slate-900 dark:bg-purple-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-3.5 py-1.5 rounded-full transition cursor-pointer ${
                activeTab === 'goals'
                  ? 'bg-slate-900 dark:bg-purple-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              My Goals
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-full transition cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-slate-900 dark:bg-purple-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Riwayat
            </button>
          </div>

          {/* Theme Toggle Button (Light/Dark Mode) */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="w-10 h-10 rounded-full bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              title={theme === 'dark' ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-purple-600" />
              )}
            </button>
          )}

          {/* Quick Profile / Settings Action Pill */}
          <button
            onClick={onResetOnboarding}
            className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-[#131B2E] rounded-full border border-slate-200 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer text-xs font-bold"
            title="Pengaturan Profil"
          >
            <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline">{profile.fitnessLevel}</span>
            <Settings className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Area (Left: 8 cols on desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <CircularProgress
              percentage={percentage}
              currentValue={burnedCalories}
              targetValue={profile.dailyCalorieTarget}
              unit="kkal"
              label="Target Kalori Harian"
              scoreLabel="Excellent!"
            />

            <SummaryCards
              activeMinutes={activeMinutesToday}
              workoutsCompleted={workoutsCount}
              pointsEarned={totalPoints}
            />

            <ActivityChart />

            <MuscleWorkload
              selectedMuscles={selectedMuscles}
              onToggleMuscle={toggleMuscle}
            />
          </div>

          {/* Sidebar Area (Right: 4 cols on desktop) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <AICoachCard
              advice={advice}
              isLoading={isGeneratingAdvice}
              onRefreshAdvice={onRefreshAdvice}
              coachName="Pro Coach AI"
            />

            {/* Desktop Direct Log Form */}
            <div className="hidden lg:block space-y-3">
              <LogForm onSubmit={handleFormSubmit} isLoading={isGeneratingAdvice} />
            </div>

            {/* Quick Profile Summary Badge Card */}
            <div className="bg-white dark:bg-[#131B2E] rounded-[32px] p-5 border border-slate-100 dark:border-slate-800 shadow-mockup dark:shadow-mockup-dark flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{profile.name} ({profile.gender})</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Target Harian: {profile.dailyCalorieTarget} kkal</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
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

      {/* Floating Bottom Navigation Dock (HANYA MUNCUL DI MOBILE: lg:hidden) */}
      <div className="lg:hidden fixed bottom-5 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <div className="bg-white/95 dark:bg-[#131B2E]/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-full py-2 px-3 shadow-floating dark:shadow-floating-dark flex items-center gap-1 sm:gap-2 pointer-events-auto">
          {/* Home Tab */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-slate-900 dark:bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
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
                ? 'bg-slate-900 dark:bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
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
                ? 'bg-slate-900 dark:bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
            title="Riwayat Aktivitas"
          >
            <ListOrdered className="w-5 h-5" />
          </button>

          <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Action Circle Button (Mobile only) */}
          <button
            onClick={() => setShowLogModal(true)}
            className="w-12 h-12 rounded-full bg-slate-900 dark:bg-purple-600 hover:bg-black text-white flex items-center justify-center shadow-lg active:scale-95 transition cursor-pointer"
            title="Catat Aktivitas Baru"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Modal Popup Input Log Harian */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn lg:hidden">
          <div className="w-full max-w-md bg-white dark:bg-[#131B2E] rounded-[36px] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-purple-600" /> Tambah Aktivitas Hari Ini
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-slate-900 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4">
              <span className="text-[11px] text-purple-700 dark:text-purple-300 font-bold block mb-1.5">
                Target Otot Terpilih:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedMuscles.map((m) => (
                  <span
                    key={m}
                    className="text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/80 border border-purple-100 dark:border-purple-800 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-lg"
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
