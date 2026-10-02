import React from 'react';
import type { DailyLog } from '../lib/supabase';
import { Activity, Bot, Calendar, Clock, Flame, Sparkles } from 'lucide-react';

interface HistoryDashboardProps {
  logs: DailyLog[];
  latestAdvice?: string;
  isGeneratingAdvice?: boolean;
}

export const HistoryDashboard: React.FC<HistoryDashboardProps> = ({
  logs,
  latestAdvice,
  isGeneratingAdvice,
}) => {
  const latestLog = logs[0];
  const adviceToShow = latestAdvice || latestLog?.ai_recommendation;

  const averageSleep =
    logs.length > 0
      ? (logs.reduce((acc, curr) => acc + curr.sleep_hours, 0) / logs.length).toFixed(1)
      : '0';

  const averageWeight =
    logs.length > 0
      ? (logs.reduce((acc, curr) => acc + curr.weight, 0) / logs.length).toFixed(1)
      : '0';

  return (
    <div className="space-y-4">
      {/* Kartu Ringkasan Quick Stats */}
      {logs.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Rata-rata Berat
            </div>
            <div className="text-lg font-bold text-slate-100">
              {averageWeight} <span className="text-xs font-normal text-slate-500">kg</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> Rata-rata Tidur
            </div>
            <div className="text-lg font-bold text-slate-100">
              {averageSleep} <span className="text-xs font-normal text-slate-500">jam</span>
            </div>
          </div>
        </div>
      )}

      {/* Kartu Rekomendasi AI Coach */}
      {(adviceToShow || isGeneratingAdvice) && (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-purple-950/50 border border-indigo-500/30 rounded-3xl p-5 shadow-xl backdrop-blur-xl transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-indigo-300 text-sm font-semibold">
              <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>AI Recovery Coach</span>
            </div>
            <span className="flex items-center gap-1 text-[11px] text-indigo-400/80 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
              <Sparkles className="w-3 h-3" /> Gemini 2.5 Flash
            </span>
          </div>

          {isGeneratingAdvice ? (
            <div className="flex items-center gap-2 py-3 text-slate-400 text-xs">
              <div className="w-3.5 h-3.5 border-2 border-indigo-400/40 border-t-indigo-400 rounded-full animate-spin" />
              <span>Menyiapkan analisis cerdas untuk hari ini...</span>
            </div>
          ) : (
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-normal">
              {adviceToShow}
            </p>
          )}
        </div>
      )}

      {/* List Riwayat Log */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-400" /> Riwayat Log Terbaru
          </h3>
          <span className="text-xs text-slate-500">{logs.length} catatan</span>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-slate-500">Belum ada riwayat aktivitas.</p>
            <p className="text-[11px] text-slate-600 mt-1">
              Catat berat badan dan tidur Anda di atas untuk memulai!
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {logs.map((log, index) => (
              <div
                key={log.id || `${log.date}-${index}`}
                className="bg-slate-950/50 hover:bg-slate-950/80 transition-colors border border-slate-800/60 rounded-2xl p-3.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 flex-wrap">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>
                      {log.date
                        ? new Date(log.date).toLocaleDateString('id-ID', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })
                        : 'Hari ini'}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-indigo-400 font-medium px-2 py-0.5 bg-indigo-500/10 rounded-md">
                      {log.workout}
                    </span>
                  </div>
                  {log.notes && (
                    <p className="text-xs text-slate-400 truncate italic">
                      "{log.notes}"
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-slate-100 flex items-center gap-1 justify-end">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    {log.weight}{' '}
                    <span className="text-[10px] text-slate-500 font-normal">kg</span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                    <Clock className="w-3 h-3 text-blue-400" />
                    {log.sleep_hours}{' '}
                    <span className="text-[10px] text-slate-500 font-normal">jam</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
