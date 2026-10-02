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
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-950/80 via-slate-900/90 to-indigo-950/60 border border-purple-500/30 rounded-3xl p-5 shadow-pastel-purple backdrop-blur-xl">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
            <Bot className="w-4 h-4 text-purple-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white tracking-tight">{coachName}</h3>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-full border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
            <span className="text-[10px] text-purple-300/80 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Gemini 2.5 Flash
            </span>
          </div>
        </div>

        {onRefreshAdvice && (
          <button
            onClick={onRefreshAdvice}
            disabled={isLoading}
            className="w-8 h-8 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 flex items-center justify-center transition active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Minta saran baru"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Advice Content */}
      <div className="relative z-10">
        {isLoading ? (
          <div className="flex items-center gap-2.5 py-3 text-purple-200 text-xs">
            <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
            <span>Menganalisis performa latihan & pemulihan tidur Anda...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs md:text-sm text-slate-100 leading-relaxed font-normal">
              {advice || 'Tetap penuhi target tidur dan hidrasi Anda untuk pemulihan optimal hari ini!'}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                <Zap className="w-3 h-3 text-amber-400" /> Actionable Insights
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
