import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../onboarding/Onboarding';
import type { DailyLog } from '../../lib/supabase';
import {
  goalPresets,
  calculateGoalRoadmap,
  formatPace,
  type FitnessGoalPreset,
  type GoalCalculationResult,
} from '../../lib/goalAnalytics';
import { generateGoalFeasibilityAdvice } from '../../services/gemini';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  Activity,
  Award,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Footprints,
  Gauge,
  RefreshCw,
  Sparkles,
  Target,
  Timer,
  Zap,
} from 'lucide-react';

interface GoalAnalyticsProps {
  profile: UserProfile;
  logs: DailyLog[];
}

export const GoalAnalytics: React.FC<GoalAnalyticsProps> = ({ profile, logs }) => {
  const [selectedPreset, setSelectedPreset] = useState<FitnessGoalPreset>(goalPresets[0]);
  const [baseline, setBaseline] = useState<number>(selectedPreset.defaultBaseline);
  const [target, setTarget] = useState<number>(selectedPreset.defaultTarget);
  const [frequency, setFrequency] = useState<number>(selectedPreset.defaultFrequencyPerWeek);

  // Pace states (detik per km)
  const [targetPaceSeconds, setTargetPaceSeconds] = useState<number>(
    selectedPreset.defaultTargetPaceSeconds || 345 // 5:45 min/km
  );
  const [baselinePaceSeconds, setBaselinePaceSeconds] = useState<number>(
    selectedPreset.defaultBaselinePaceSeconds || 420 // 7:00 min/km
  );

  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Perhitungan roadmap kalkulator
  const result: GoalCalculationResult = calculateGoalRoadmap(
    selectedPreset.category,
    baseline,
    target,
    frequency,
    targetPaceSeconds,
    baselinePaceSeconds
  );

  const handleSelectPreset = (preset: FitnessGoalPreset) => {
    setSelectedPreset(preset);
    setBaseline(preset.defaultBaseline);
    setTarget(preset.defaultTarget);
    setFrequency(preset.defaultFrequencyPerWeek);
    if (preset.defaultTargetPaceSeconds) {
      setTargetPaceSeconds(preset.defaultTargetPaceSeconds);
    }
    if (preset.defaultBaselinePaceSeconds) {
      setBaselinePaceSeconds(preset.defaultBaselinePaceSeconds);
    }
  };

  const averageSleep =
    logs.length > 0
      ? Number((logs.reduce((acc, curr) => acc + curr.sleep_hours, 0) / logs.length).toFixed(1))
      : 7.5;

  const handleFetchAiAdvice = async () => {
    setIsLoadingAi(true);
    try {
      const advice = await generateGoalFeasibilityAdvice({
        profile,
        goalTitle: selectedPreset.title,
        baseline,
        target,
        unit: selectedPreset.targetUnit,
        frequencyPerWeek: frequency,
        estimatedSessions: result.totalSessionsNeeded,
        estimatedWeeks: result.estimatedWeeks,
        averageSleep,
      });
      setAiAdvice(advice);
    } catch (err) {
      console.error('Gagal mengambil analisis AI:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    handleFetchAiAdvice();
  }, [selectedPreset.id, targetPaceSeconds]);

  const renderPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-4 h-4" />;
      case 'Flame':
        return <Flame className="w-4 h-4" />;
      case 'Activity':
        return <Activity className="w-4 h-4" />;
      case 'Dumbbell':
      default:
        return <Dumbbell className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-10">
      {/* Title & Introduction */}
      <div className="bg-gradient-to-br from-purple-950/60 via-slate-900/80 to-slate-950 border border-purple-500/25 rounded-3xl p-5 shadow-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1.5">
          <Sparkles className="w-4 h-4" />
          <span>Goal Feasibility & Pace Analytics</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Kalkulator Target, Pace & Sesi Latihan
        </h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Hitung secara presisi berapa kali sesi latihan, estimasi waktu tempuh, serta pembagian zona kecepatan (*pace*) untuk mencapai target Anda.
        </p>
      </div>

      {/* Goal Preset Selector Cards */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-slate-300 block">Pilih Target Kebugaran:</label>
        <div className="grid grid-cols-2 gap-2.5">
          {goalPresets.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-28 ${
                  isSelected
                    ? 'bg-gradient-to-br from-purple-900/60 to-indigo-900/40 border-purple-400 shadow-pastel-purple scale-[1.02]'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {renderPresetIcon(preset.iconName)}
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-white leading-snug">{preset.title}</h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Target: {preset.defaultTarget} {preset.targetUnit}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Special Running Pace & Estimated Finish Time Highlight Card */}
      {selectedPreset.category === 'running' && (
        <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-purple-950/70 border border-indigo-500/30 rounded-3xl p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
              <Gauge className="w-4 h-4 text-sky-400" />
              <span>Target Kecepatan (Pace) & Waktu Selesai</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {result.speedKmh} km/jam
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3">
              <span className="text-[10px] text-slate-400 block mb-1">Target Pace:</span>
              <div className="text-xl font-bold text-white tracking-tight flex items-baseline gap-1">
                {result.targetPaceFormatted} <span className="text-xs font-normal text-slate-400">/km</span>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3">
              <span className="text-[10px] text-slate-400 block mb-1">Total Waktu Tempuh {target} km:</span>
              <div className="text-xl font-bold text-sky-300 tracking-tight flex items-baseline gap-1">
                {result.estimatedFinishTimeFormatted}
              </div>
            </div>
          </div>

          {/* Pace Adjustment Slider */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Atur Target Pace Kecepatan:</span>
              <span className="text-purple-300 font-bold bg-purple-500/15 px-2 py-0.5 rounded-lg border border-purple-500/30">
                {formatPace(targetPaceSeconds)} min/km ({result.speedKmh} km/h)
              </span>
            </div>
            <input
              type="range"
              min="240"  // 4:00 min/km
              max="540"  // 9:00 min/km
              step="15"  // 15 detik step
              value={targetPaceSeconds}
              onChange={(e) => setTargetPaceSeconds(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>Cepat (4:00 /km)</span>
              <span>Moderat (6:00 /km)</span>
              <span>Santai (9:00 /km)</span>
            </div>
          </div>
        </div>
      )}

      {/* Calisthenics Cadence Highlight Card */}
      {selectedPreset.category !== 'running' && (
        <div className="bg-gradient-to-br from-purple-950/70 via-slate-900 to-indigo-950/60 border border-purple-500/30 rounded-3xl p-4 flex items-center justify-between shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <Timer className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Target Cadence Kecepatan</h4>
              <p className="text-[11px] text-slate-400">Ritme per repetisi dalam 60 detik</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">
              {result.cadenceSecondsPerRep} <span className="text-xs font-normal text-slate-400">dtk/rep</span>
            </div>
            <span className="text-[10px] text-purple-300">
              ({result.targetRepsPerSecond} reps/detik)
            </span>
          </div>
        </div>
      )}

      {/* Interactive Controls: Baseline, Target & Frequency */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-5 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-purple-400" /> Parameter Kapasitas & Frekuensi
          </h3>
          <span className="text-[11px] font-medium text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
            {selectedPreset.targetUnit.toUpperCase()}
          </span>
        </div>

        {/* 1. Kemampuan Saat Ini (Baseline) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Kemampuan Saat Ini (Baseline):</span>
            <span className="text-white font-bold text-sm bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700">
              {baseline} {selectedPreset.targetUnit}
            </span>
          </div>
          <input
            type="range"
            min={selectedPreset.minVal}
            max={target}
            step={selectedPreset.step}
            value={baseline}
            onChange={(e) => setBaseline(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* 2. Target Capaian (Goal) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Target yang Ingin Dicapai:</span>
            <span className="text-purple-300 font-bold text-sm bg-purple-500/15 px-2.5 py-1 rounded-xl border border-purple-500/30">
              {target} {selectedPreset.targetUnit}
            </span>
          </div>
          <input
            type="range"
            min={baseline}
            max={selectedPreset.maxVal}
            step={selectedPreset.step}
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
          />
        </div>

        {/* 3. Frekuensi Latihan per Minggu */}
        <div className="space-y-2 pt-1">
          <span className="text-xs text-slate-400 font-medium block">
            Frekuensi Latihan per Minggu:
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            {[2, 3, 4, 5, 6].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setFrequency(days)}
                className={`py-2 rounded-xl text-xs font-semibold transition ${
                  frequency === days
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {days}x / mgg
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Easy-to-Understand KPI Summary Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-[#101b2b] border border-sky-500/25 rounded-3xl p-3.5 flex flex-col justify-between h-28 shadow-pastel-blue/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-sky-300">Total Latihan</span>
            <Zap className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white tracking-tight">
              ~{result.totalSessionsNeeded}
            </div>
            <span className="text-[10px] text-slate-400">kali sesi latihan</span>
          </div>
        </div>

        <div className="bg-[#0f241a] border border-emerald-500/25 rounded-3xl p-3.5 flex flex-col justify-between h-28 shadow-pastel-green/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-emerald-300">Waktu Capai</span>
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white tracking-tight">
              ~{result.estimatedWeeks}
            </div>
            <span className="text-[10px] text-slate-400">minggu program</span>
          </div>
        </div>

        <div className="bg-[#1d122c] border border-purple-500/30 rounded-3xl p-3.5 flex flex-col justify-between h-28 shadow-pastel-purple/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-purple-300">Kesiapan Saat Ini</span>
            <Award className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white tracking-tight">
              {result.readinessPercentage}%
            </div>
            <span className="text-[10px] text-slate-400">dari target puncak</span>
          </div>
        </div>
      </div>

      {/* 3 Pace Training Zones Breakdown (Khusus Running) */}
      {selectedPreset.category === 'running' && result.paceZones && (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-5 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" /> Pembagian Zona Latihan Pace
            </h3>
            <span className="text-[10px] text-slate-400">Strategi 80/20</span>
          </div>

          <div className="space-y-2.5">
            {result.paceZones.map((zone) => (
              <div
                key={zone.name}
                className={`border rounded-2xl p-3 space-y-1.5 ${zone.colorClass}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">{zone.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-medium">
                      {zone.code}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono">{zone.paceStr}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">{zone.description}</p>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
                  <span>Alokasi: {zone.percentageUsage}</span>
                  <span>Kecepatan: ~{zone.speedKmh} km/jam</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Feasibility Assessment Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-950/80 via-slate-900/90 to-indigo-950/70 border border-purple-500/30 rounded-3xl p-5 shadow-pastel-purple backdrop-blur-xl">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 text-purple-300 text-sm font-semibold">
            <Bot className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>AI Feasibility & Coach Assessment</span>
          </div>
          <button
            onClick={handleFetchAiAdvice}
            disabled={isLoadingAi}
            className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center active:scale-95 transition cursor-pointer"
            title="Analisis ulang target"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {isLoadingAi ? (
          <div className="flex items-center gap-2 py-3 text-purple-200 text-xs">
            <div className="w-3.5 h-3.5 border-2 border-purple-400/40 border-t-purple-400 rounded-full animate-spin" />
            <span>Menganalisis pacing & kesiapan fisiologis tubuh Anda...</span>
          </div>
        ) : (
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-normal">
            {aiAdvice || result.keyAdvice}
          </p>
        )}
      </div>

      {/* Proyeksi Kenaikan Mingguan (Recharts) */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-5 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-sky-400" /> Kurva Proyeksi Mingguan
            </h3>
            <p className="text-[10px] text-slate-400">Peningkatan kapasitas bertahap menuju target</p>
          </div>
          <span className="text-[11px] font-semibold text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
            {selectedPreset.targetUnit}
          </span>
        </div>

        <div className="h-44 w-full -ml-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={result.weeklyProgressionData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="goalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818CF8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#818CF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 10 }}
                domain={[0, 'dataMax + 5']}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 border border-slate-700/90 px-3 py-2 rounded-xl shadow-xl text-xs">
                        <span className="text-slate-400 font-medium block">{label}</span>
                        <span className="text-white font-bold text-sm">
                          {payload[0].value} {selectedPreset.targetUnit}
                        </span>
                        <span className="text-[10px] text-emerald-400 block mt-0.5">
                          Target Akhir: {target} {selectedPreset.targetUnit}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine
                y={target}
                stroke="#A855F7"
                strokeDasharray="4 4"
                label={{
                  value: `Target: ${target} ${selectedPreset.targetUnit}`,
                  fill: '#C084FC',
                  fontSize: 10,
                  position: 'top',
                }}
              />
              <Area
                type="monotone"
                dataKey="projected"
                stroke="#818CF8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#goalGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Step-by-Step Milestone Roadmap */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-5 shadow-soft space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Roadmap Tahapan Latihan
          </h3>
          <span className="text-[10px] text-slate-400">3 Fase Terstruktur</span>
        </div>

        <div className="space-y-3">
          {result.roadmapPhases.map((phase) => (
            <div
              key={phase.phaseNumber}
              className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center border border-purple-500/30">
                    {phase.phaseNumber}
                  </span>
                  <h4 className="font-semibold text-xs text-white">{phase.title}</h4>
                </div>
                <span className="text-[10px] font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                  {phase.weeks} ({phase.sessions} sesi)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 text-[11px]">Rentang Kapasitas:</span>
                <span className="text-purple-300 font-semibold text-[11px]">
                  {phase.targetRange}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">{phase.focus}</p>

              <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-2.5 flex items-start gap-2 text-[10px] text-purple-200">
                <ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Tips Coach:</strong> {phase.tips}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
