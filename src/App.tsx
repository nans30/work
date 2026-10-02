import { useEffect, useState } from 'react';
import { LogForm } from './components/LogForm';
import { HistoryDashboard } from './components/HistoryDashboard';
import { fetchRecentLogs, insertDailyLog } from './lib/supabase';
import type { DailyLog } from './lib/supabase';
import { generateFitnessAdvice } from './services/gemini';
import { HeartPulse, RefreshCw, Smartphone } from 'lucide-react';

export default function App() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [latestAdvice, setLatestAdvice] = useState<string>('');
  const [showPwaTip, setShowPwaTip] = useState(false);

  useEffect(() => {
    loadLogs();

    // Deteksi jika dibuka di Safari iOS non-standalone untuk menampilkan tips Add to Home Screen
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (isIos && !isStandalone) {
      setShowPwaTip(true);
    }
  }, []);

  const loadLogs = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchRecentLogs(10);
      setLogs(data);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddLog = async (logData: Omit<DailyLog, 'id' | 'created_at'>) => {
    setLoading(true);
    try {
      // 1. Dapatkan insight berbasis AI dari Gemini
      const advice = await generateFitnessAdvice(logData as DailyLog, logs);
      setLatestAdvice(advice);

      // 2. Simpan ke database Supabase (atau fallback offline)
      const saved = await insertDailyLog({
        ...logData,
        ai_recommendation: advice,
      });

      // 3. Update state di UI
      setLogs((prev) => [saved, ...prev]);
    } catch (err) {
      console.error('Gagal menyimpan log:', err);
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center selection:bg-indigo-500/30">
      {/* Mobile Container */}
      <main className="w-full max-w-md px-4 pt-4 pb-12 space-y-5">
        {/* iOS-Style App Header */}
        <header className="flex items-center justify-between pt-safe-top">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                AuraFit
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                Fitness, Sleep & AI Recovery
              </p>
            </div>
          </div>

          <button
            onClick={loadLogs}
            disabled={isRefreshing}
            className="w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
            title="Muat ulang data"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`}
            />
          </button>
        </header>

        {/* PWA iOS Add to Home Screen Banner */}
        {showPwaTip && (
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-slate-300 backdrop-blur-md">
            <Smartphone className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-slate-100 mb-0.5">Pasang Aplikasi di iPhone</p>
              <p className="text-slate-400 text-[11px]">
                Tekan tombol <strong>Share</strong> (ikon kotak panah ke atas) di Safari lalu pilih <strong>"Add to Home Screen"</strong> untuk pengalaman layar penuh seperti aplikasi native.
              </p>
            </div>
            <button
              onClick={() => setShowPwaTip(false)}
              className="text-slate-500 hover:text-slate-300 text-xs px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Form Komponen */}
        <LogForm onSubmit={handleAddLog} isLoading={loading} />

        {/* Dashboard Riwayat & Rekomendasi AI */}
        <HistoryDashboard
          logs={logs}
          latestAdvice={latestAdvice}
          isGeneratingAdvice={loading}
        />

        {/* Footer info */}
        <footer className="text-center pt-4 pb-safe-bottom">
          <p className="text-[11px] text-slate-600">
            AuraFit Tracker • Supabase + Gemini 2.5 Flash
          </p>
        </footer>
      </main>
    </div>
  );
}
