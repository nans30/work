import React from 'react';
import { Bot, Sparkles, RefreshCw, Zap } from 'lucide-react';

interface AICoachCardProps {
  advice: string;
  isLoading: boolean;
  onRefreshAdvice?: () => void;
  coachName?: string;
}

export const AICoachCard: React.FC<AICoachCardProps> = ({
  advice,
  isLoading,
  onRefreshAdvice,
  coachName = 'Pro Coach AI',
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#1E3A8A] via-[#312E81] to-[#6B21A8] rounded-[32px] p-6 text-white shadow-mockup-lg">
      {/* Background ambient circular design */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-sm">
            <Bot className="w-5 h-5 text-purple-200 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">{coachName}</h3>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-400/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                ACTIVE
              </span>
            </div>
            <span className="text-[11px] text-purple-200/90 flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-purple-300" /> Gemini 2.5 Flash
            </span>
          </div>
        </div>

        {onRefreshAdvice && (
          <button
            onClick={onRefreshAdvice}
            disabled={isLoading}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Minta saran baru"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Advice Content */}
      <div className="relative z-10 pt-1">
        {isLoading ? (
          <div className="flex items-center gap-2.5 py-3 text-purple-100 text-xs">
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            <span>Menganalisis performa latihan & pemulihan tidur Anda...</span>
          </div>
        ) : (
          <div className="space-y-2.5">
            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal">
              {advice || 'Tetap penuhi target tidur dan hidrasi Anda untuk pemulihan optimal hari ini!'}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-200 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 font-medium">
                <Zap className="w-3 h-3 text-amber-300" /> Actionable Recovery Tips
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
