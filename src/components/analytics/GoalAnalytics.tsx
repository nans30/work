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
  ArrowUpRight,
} from 'lucide-react';

interface GoalAnalyticsProps {
  profile: UserProfile;
  logs: DailyLog[];
}

export const ACTIVE_GOAL_KEY = 'aurafit_active_goal';

export interface SavedGoalData {
  presetId: string;
  baseline: number;
  target: number;
  frequency: number;
  targetPaceSeconds?: number;
  baselinePaceSeconds?: number;
}

export const GoalAnalytics: React.FC<GoalAnalyticsProps> = ({ profile, logs }) => {
  const [selectedPreset, setSelectedPreset] = useState<FitnessGoalPreset>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_GOAL_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = goalPresets.find((p) => p.id === parsed.presetId);
        if (match) return match;
      }
    } catch {}
    return goalPresets[0];
  });

  const [baseline, setBaseline] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_GOAL_KEY);
      if (saved) return JSON.parse(saved).baseline || goalPresets[0].defaultBaseline;
    } catch {}
    return goalPresets[0].defaultBaseline;
  });

  const [target, setTarget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_GOAL_KEY);
      if (saved) return JSON.parse(saved).target || goalPresets[0].defaultTarget;
    } catch {}
    return goalPresets[0].defaultTarget;
  });

  const [frequency, setFrequency] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_GOAL_KEY);
      if (saved) return JSON.parse(saved).frequency || goalPresets[0].defaultFrequencyPerWeek;
    } catch {}
    return goalPresets[0].defaultFrequencyPerWeek;
  });

  // Pace states (detik per km)
  const [targetPaceSeconds, setTargetPaceSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_GOAL_KEY);
      if (saved) return JSON.parse(saved).targetPaceSeconds || 345;
    } catch {}
    return 345;
  });

  const [baselinePaceSeconds, setBaselinePaceSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_GOAL_KEY);
      if (saved) return JSON.parse(saved).baselinePaceSeconds || 420;
    } catch {}
    return 420;
  });

  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Sync state to localStorage whenever values change
  useEffect(() => {
    try {
      const dataToSave: SavedGoalData = {
        presetId: selectedPreset.id,
        baseline,
        target,
        frequency,
        targetPaceSeconds,
        baselinePaceSeconds,
      };
      localStorage.setItem(ACTIVE_GOAL_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('Gagal menyimpan goal ke storage:', e);
    }
  }, [selectedPreset.id, baseline, target, frequency, targetPaceSeconds, baselinePaceSeconds]);

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
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Title & Introduction Banner */}
      <div className="bg-white dark:bg-[#131B2E] rounded-[32px] p-6 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-mockup dark:shadow-mockup-dark relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Goal Feasibility & Pace Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Kalkulator Target, Pace & Sesi Latihan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            Hitung secara presisi berapa kali sesi latihan, estimasi waktu tempuh, serta pembagian zona kecepatan (*pace*) untuk mencapai target Anda.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Target {target} {selectedPreset.targetUnit}
          </span>
        </div>
      </div>

      {/* Goal Preset Selector Grid (4 Columns on Desktop) */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Pilih Target Kebugaran:</label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {goalPresets.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-4 rounded-[28px] border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-32 ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-purple-600 text-white border-slate-900 dark:border-purple-500 shadow-mockup-lg scale-[1.02]'
                    : 'bg-white dark:bg-[#131B2E] border-slate-100 dark:border-slate-800 shadow-mockup dark:shadow-mockup-dark text-slate-800 dark:text-slate-200 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                      isSelected ? 'bg-purple-600 dark:bg-slate-900 text-white shadow-sm' : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                    }`}
                  >
                    {renderPresetIcon(preset.iconName)}
                  </div>
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <div>
                  <h4 className={`font-bold text-xs sm:text-sm leading-snug ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {preset.title}
                  </h4>
                  <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                    Target: {preset.defaultTarget} {preset.targetUnit}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols on desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Running Pace & Speed Highlight Card */}
          {selectedPreset.category === 'running' && (
            <div className="bg-white dark:bg-[#131B2E] rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-mockup dark:shadow-mockup-dark space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white text-xs font-bold">
                  <Gauge className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Target Kecepatan (Pace) & Waktu Selesai</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                  {result.speedKmh} km/jam
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block mb-1">Target Pace:</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
                    {result.targetPaceFormatted} <span className="text-xs font-normal text-slate-400 dark:text-slate-500">/km</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block mb-1">Total Waktu {target} km:</span>
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tight font-sans">
                    {result.estimatedFinishTimeFormatted}
                  </div>
                </div>
              </div>

              {/* Pace Slider */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Atur Target Pace Kecepatan:</span>
                  <span className="text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-xl border border-purple-100 dark:border-purple-800">
                    {formatPace(targetPaceSeconds)} min/km ({result.speedKmh} km/h)
                  </span>
                </div>
                <input
                  type="range"
                  min="240"
                  max="540"
                  step="15"
                  value={targetPaceSeconds}
                  onChange={(e) => setTargetPaceSeconds(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  <span>Cepat (4:00 /km)</span>
                  <span>Moderat (6:00 /km)</span>
                  <span>Santai (9:00 /km)</span>
                </div>
              </div>
            </div>
          )}

          {/* Calisthenics Cadence Card */}
          {selectedPreset.category !== 'running' && (
            <div className="bg-white dark:bg-[#131B2E] rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-mockup dark:shadow-mockup-dark flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Timer className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Target Cadence Kecepatan</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Ritme per repetisi dalam 60 detik</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900 dark:text-white font-sans">
                  {result.cadenceSecondsPerRep} <span className="text-xs font-normal text-slate-400 dark:text-slate-500">dtk/rep</span>
                </div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  ({result.targetRepsPerSecond} reps/detik)
                </span>
              </div>
            </div>
          )}

          {/* Interactive Parameter Controls */}
          <div className="bg-white dark:bg-[#131B2E] rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-mockup dark:shadow-mockup-dark space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Parameter Kapasitas & Frekuensi
              </h3>
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-100 dark:border-purple-800">
                {selectedPreset.targetUnit.toUpperCase()}
              </span>
            </div>

            {/* Baseline Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Kemampuan Saat Ini (Baseline):</span>
                <span className="text-slate-900 dark:text-white font-black text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
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
                className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {/* Target Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Target yang Ingin Dicapai:</span>
                <span className="text-purple-700 dark:text-purple-300 font-black text-sm bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-xl border border-purple-100 dark:border-purple-800">
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
                className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Frekuensi Latihan */}
            <div className="space-y-2 pt-1">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium block">
                Frekuensi Latihan per Minggu:
              </span>
              <div className="grid grid-cols-5 gap-2">
                {[2, 3, 4, 5, 6].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setFrequency(days)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      frequency === days
                        ? 'bg-slate-900 dark:bg-purple-600 text-white shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {days}x / mgg
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recharts Weekly Progression Curve */}
          <div className="bg-white dark:bg-[#131B2E] rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-mockup dark:shadow-mockup-dark space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Kurva Proyeksi Mingguan
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Peningkatan kapasitas bertahap menuju target</p>
              </div>
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-100 dark:border-purple-800">
                {selectedPreset.targetUnit}
              </span>
            </div>

            <div className="h-56 w-full -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={result.weeklyProgressionData}
                  margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="goalGradTheme" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} className="stroke-slate-100 dark:stroke-slate-800" />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'Poppins' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'Poppins' }}
                    domain={[0, 'dataMax + 5']}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 dark:bg-slate-950 border border-slate-700 text-white px-3.5 py-2.5 rounded-2xl shadow-xl text-xs font-sans">
                            <span className="text-slate-400 block text-[10px]">{label}</span>
                            <span className="text-white font-bold text-sm">
                              {payload[0].value} {selectedPreset.targetUnit}
                            </span>
                            <span className="text-[11px] text-emerald-400 block mt-0.5">
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
                    stroke="#7C3AED"
                    strokeDasharray="4 4"
                    label={{
                      value: `Target: ${target} ${selectedPreset.targetUnit}`,
                      fill: '#7C3AED',
                      fontSize: 11,
                      position: 'top',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="projected"
                    stroke="#7C3AED"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#goalGradTheme)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3-Phase Roadmap (Horizontal Grid on Desktop) */}
          <div className="bg-white dark:bg-[#131B2E] rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-mockup dark:shadow-mockup-dark space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Roadmap Tahapan Latihan
              </h3>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">3 Fase Terstruktur</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
              {result.roadmapPhases.map((phase) => (
                <div
                  key={phase.phaseNumber}
                  className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-2.5 flex flex-col justify-between hover:border-slate-200 dark:hover:border-slate-700 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center">
                        {phase.phaseNumber}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                        {phase.weeks} ({phase.sessions} sesi)
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{phase.title}</h4>

                    <div className="text-[11px] text-purple-700 dark:text-purple-400 font-semibold">
                      Rentang: {phase.targetRange}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{phase.focus}</p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800 rounded-xl p-2.5 flex items-start gap-1.5 text-[10px] text-purple-900 dark:text-purple-200 mt-2">
                    <ChevronRight className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Tips:</strong> {phase.tips}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols on desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white dark:bg-[#131B2E] rounded-[24px] p-3.5 border border-slate-100 dark:border-slate-800 shadow-mockup dark:shadow-mockup-dark flex flex-col justify-between h-28">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Total Sesi</span>
                <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
                  ~{result.totalSessionsNeeded}
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">kali sesi</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#131B2E] rounded-[24px] p-3.5 border border-slate-100 dark:border-slate-800 shadow-mockup dark:shadow-mockup-dark flex flex-col justify-between h-28">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Waktu</span>
                <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
                  ~{result.estimatedWeeks}
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">minggu</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#131B2E] rounded-[24px] p-3.5 border border-slate-100 dark:border-slate-800 shadow-mockup dark:shadow-mockup-dark flex flex-col justify-between h-28">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">Kesiapan</span>
                <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
                  {result.readinessPercentage}%
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">dari target</span>
              </div>
            </div>
          </div>

          {/* AI Feasibility Assessment Card */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#1E3A8A] via-[#312E81] to-[#6B21A8] rounded-[32px] p-6 text-white shadow-mockup-lg">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-white text-sm font-bold">
                <Bot className="w-5 h-5 text-purple-300 animate-pulse" />
                <span>AI Feasibility Coach</span>
              </div>
              <button
                onClick={handleFetchAiAdvice}
                disabled={isLoadingAi}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active:scale-95 transition cursor-pointer"
                title="Analisis ulang target"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {isLoadingAi ? (
              <div className="flex items-center gap-2 py-3 text-purple-100 text-xs">
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Menganalisis pacing & kesiapan fisiologis tubuh Anda...</span>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal">
                {aiAdvice || result.keyAdvice}
              </p>
            )}
          </div>

          {/* Pace Training Zones Matrix */}
          {selectedPreset.category === 'running' && result.paceZones && (
            <div className="bg-white dark:bg-[#131B2E] rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-mockup dark:shadow-mockup-dark space-y-3 transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Zona Latihan Pace (80/20)
                </h3>
              </div>

              <div className="space-y-2.5">
                {result.paceZones.map((zone) => (
                  <div
                    key={zone.name}
                    className="border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 rounded-2xl p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{zone.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 font-bold text-purple-700 dark:text-purple-300 border border-slate-200 dark:border-slate-700">
                          {zone.code}
                        </span>
                      </div>
                      <span className="text-xs font-bold font-mono text-purple-700 dark:text-purple-300">{zone.paceStr}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{zone.description}</p>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between pt-0.5">
                      <span>Alokasi: {zone.percentageUsage}</span>
                      <span>Kecepatan: ~{zone.speedKmh} km/h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
