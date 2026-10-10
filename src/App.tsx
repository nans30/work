import { useEffect, useState } from 'react';
import { Onboarding, type UserProfile } from './components/onboarding/Onboarding';
import { Dashboard } from './components/dashboard/Dashboard';
import type { MuscleGroup } from './components/dashboard/MuscleWorkload';
import { fetchRecentLogs, insertDailyLog } from './lib/supabase';
import type { DailyLog } from './lib/supabase';
import { generateProCoachInsight } from './services/gemini';
import { Smartphone } from 'lucide-react';

const PROFILE_STORAGE_KEY = 'aurafit_user_profile';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [latestAdvice, setLatestAdvice] = useState<string>('');
  const [showPwaTip, setShowPwaTip] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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

    // Request initial welcome advice from Pro Coach AI
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
      // 1. Dapatkan Pro Coach insight dari Gemini
      const advice = await generateProCoachInsight({
        profile,
        currentLog: logData as DailyLog,
        selectedMuscles,
        previousLogs: logs,
      });
      setLatestAdvice(advice);

      // 2. Simpan ke database Supabase (atau fallback)
      const saved = await insertDailyLog({
        ...logData,
        ai_recommendation: advice,
      });

      // 3. Update state log
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
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-white font-sans">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-purple-500/30">
      {/* Expansive Responsive Container (Mobile: max-w-md, Desktop: max-w-7xl) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
        {/* iOS PWA Add to Home Screen Banner */}
        {showPwaTip && (
          <div className="mb-4 bg-slate-900/90 border border-purple-500/30 rounded-2xl p-3 flex items-start gap-3 text-xs text-slate-300 backdrop-blur-md max-w-xl mx-auto">
            <Smartphone className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-white mb-0.5">Pasang di iPhone</p>
              <p className="text-slate-400 text-[11px]">
                Tekan <strong>Share</strong> di Safari lalu pilih <strong>"Add to Home Screen"</strong> untuk pengalaman aplikasi native.
              </p>
            </div>
            <button
              onClick={() => setShowPwaTip(false)}
              className="text-slate-500 hover:text-slate-300 text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Kondisi: Tampilkan Onboarding atau Dashboard */}
        {!profile ? (
          <Onboarding onComplete={handleCompleteOnboarding} />
        ) : (
          <Dashboard
            profile={profile}
            logs={logs}
            advice={latestAdvice}
            isGeneratingAdvice={loadingAdvice}
            onAddLog={handleAddLog}
            onRefreshAdvice={handleRefreshAdvice}
            onResetOnboarding={handleResetOnboarding}
          />
        )}
      </div>
    </div>
  );
}
