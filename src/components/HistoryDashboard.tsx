import React from 'react';
import type { DailyLog } from '../lib/supabase';
import { Activity, Bot, Clock, Flame, Sparkles } from 'lucide-react';

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
      {/* Quick Stats */}
      {logs.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-[28px] p-4 border border-slate-100 shadow-mockup">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
              <Flame className="w-4 h-4 text-amber-500" /> Rata-rata Berat
            </div>
            <div className="text-xl font-black text-slate-900 font-sans">
              {averageWeight} <span className="text-xs font-normal text-slate-400">kg</span>
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-4 border border-slate-100 shadow-mockup">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
              <Clock className="w-4 h-4 text-blue-600" /> Rata-rata Tidur
            </div>
            <div className="text-xl font-black text-slate-900 font-sans">
              {averageSleep} <span className="text-xs font-normal text-slate-400">jam</span>
            </div>
          </div>
        </div>
      )}

      {/* AI Recovery Coach Card */}
      {(adviceToShow || isGeneratingAdvice) && (
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1E3A8A] via-[#312E81] to-[#6B21A8] rounded-[32px] p-6 text-white shadow-mockup-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-white text-sm font-bold">
              <Bot className="w-5 h-5 text-purple-300 animate-pulse" />
              <span>AI Coach Insights</span>
            </div>
            <span className="text-[11px] text-purple-200 bg-white/15 px-2.5 py-0.5 rounded-full font-medium">
              <Sparkles className="w-3 h-3 inline mr-1" /> Gemini
            </span>
          </div>

          {isGeneratingAdvice ? (
            <div className="flex items-center gap-2 py-2 text-purple-100 text-xs">
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Menyiapkan analisis cerdas...</span>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">{adviceToShow}</p>
          )}
        </div>
      )}

      {/* List Riwayat Log (Recent Transactions style from mockup) */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-mockup space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600" /> Riwayat Aktivitas Harian
          </h3>
          <span className="text-xs font-semibold text-slate-400">{logs.length} catatan</span>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-slate-400">Belum ada riwayat aktivitas.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log, index) => (
              <div
                key={log.id || `${log.date}-${index}`}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-2xl px-2 transition"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className="font-bold text-slate-900">{log.workout}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-400 font-medium">
                      {log.date
                        ? new Date(log.date).toLocaleDateString('id-ID', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })
                        : 'Hari ini'}
                    </span>
                  </div>
                  {log.notes && <p className="text-xs text-slate-400 truncate italic">"{log.notes}"</p>}
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-slate-900 font-sans">
                    {log.weight} <span className="text-xs font-normal text-slate-400">kg</span>
                  </div>
                  <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 mt-0.5">
                    {log.sleep_hours} jam tidur
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
