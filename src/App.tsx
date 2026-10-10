import { useEffect, useState } from 'react';
import { Onboarding, type UserProfile } from './components/onboarding/Onboarding';
import { Dashboard } from './components/dashboard/Dashboard';
import type { MuscleGroup } from './components/dashboard/MuscleWorkload';
import { fetchRecentLogs, insertDailyLog } from './lib/supabase';
import type { DailyLog } from './lib/supabase';
import { generateProCoachInsight } from './services/gemini';
import { Moon, Smartphone, Sun } from 'lucide-react';

const PROFILE_STORAGE_KEY = 'aurafit_user_profile';
const THEME_STORAGE_KEY = 'aurafit_theme';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [latestAdvice, setLatestAdvice] = useState<string>('');
  const [showPwaTip, setShowPwaTip] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Theme state: Default explicitly to 'light'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'dark') {
        return 'dark';
      }
      return 'light'; // Default to Light Mode
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    // 1. Cek Profil Onboarding
    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (e) {
      console.warn('Gagal membaca saved profile:', e);
    }

    // 2. Load Riwayat Log
    loadLogs();

    // 3. Deteksi PWA iOS Safari
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone;
    if (isIos && !isStandalone) {
      setShowPwaTip(true);
    }

    setIsInitialized(true);
  }, []);

  const loadLogs = async () => {
    try {
      const data = await fetchRecentLogs(10);
      setLogs(data);
      if (data.length > 0 && data[0].ai_recommendation) {
        setLatestAdvice(data[0].ai_recommendation);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  const handleCompleteOnboarding = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));

    const sampleCurrentLog: DailyLog = {
      weight: newProfile.initialWeight,
      sleep_hours: 8.0,
      workout: 'Angkat Beban',
      notes: 'Memulai hari pertama bersama AuraFit Pro Coach!',
      date: new Date().toISOString().split('T')[0],
    };

    setLoadingAdvice(true);
    try {
      const initialAdvice = await generateProCoachInsight({
        profile: newProfile,
        currentLog: sampleCurrentLog,
        selectedMuscles: ['Shoulders', 'Arms'],
        previousLogs: logs,
      });
      setLatestAdvice(initialAdvice);
    } finally {
      setLoadingAdvice(false);
    }
  };

  const handleAddLog = async (
    logData: Omit<DailyLog, 'id' | 'created_at'>,
    selectedMuscles: MuscleGroup[]
  ) => {
    if (!profile) return;
    setLoadingAdvice(true);

    try {
      const advice = await generateProCoachInsight({
        profile,
        currentLog: logData as DailyLog,
        selectedMuscles,
        previousLogs: logs,
      });
      setLatestAdvice(advice);

      const saved = await insertDailyLog({
        ...logData,
        ai_recommendation: advice,
      });

      setLogs((prev) => [saved, ...prev]);
    } catch (err) {
      console.error('Gagal menyimpan log:', err);
    } finally {
      setLoadingAdvice(false);
    }
  };

  const handleRefreshAdvice = async () => {
    if (!profile) return;
    const currentLog = logs[0] || {
      weight: profile.initialWeight,
      sleep_hours: 7.5,
      workout: 'Angkat Beban',
      date: new Date().toISOString().split('T')[0],
    };

    setLoadingAdvice(true);
    try {
      const advice = await generateProCoachInsight({
        profile,
        currentLog,
        selectedMuscles: ['Shoulders', 'Back'],
        previousLogs: logs,
      });
      setLatestAdvice(advice);
    } finally {
      setLoadingAdvice(false);
    }
  };

  const handleResetOnboarding = () => {
    if (confirm('Apakah Anda ingin mengulang kuesioner onboarding?')) {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      setProfile(null);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0B0F19] flex items-center justify-center text-slate-900 dark:text-white font-sans">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
        {/* iOS PWA Add to Home Screen Banner */}
        {showPwaTip && (
          <div className="mb-4 bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300 shadow-mockup max-w-xl mx-auto">
            <Smartphone className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-slate-900 dark:text-white mb-0.5">Pasang di iPhone</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Tekan <strong>Share</strong> di Safari lalu pilih <strong>"Add to Home Screen"</strong> untuk pengalaman aplikasi native.
              </p>
            </div>
            <button
              onClick={() => setShowPwaTip(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Kondisi: Tampilkan Onboarding atau Dashboard */}
        {!profile ? (
          <div className="relative">
            <div className="absolute top-2 right-2 z-20">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Ganti Tema (Light/Dark)"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
              </button>
            </div>
            <Onboarding onComplete={handleCompleteOnboarding} />
          </div>
        ) : (
          <Dashboard
            profile={profile}
            logs={logs}
            advice={latestAdvice}
            isGeneratingAdvice={loadingAdvice}
            onAddLog={handleAddLog}
            onRefreshAdvice={handleRefreshAdvice}
            onResetOnboarding={handleResetOnboarding}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}
      </div>
    </div>
  );
}
