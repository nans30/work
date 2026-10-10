export type GoalCategory = 'running' | 'pushup' | 'situp' | 'pullup' | 'custom';

export interface FitnessGoalPreset {
  id: string;
  category: GoalCategory;
  title: string;
  targetUnit: string;
  defaultBaseline: number;
  defaultTarget: number;
  minVal: number;
  maxVal: number;
  step: number;
  defaultFrequencyPerWeek: number;
  iconName: string;
  description: string;
  defaultBaselinePaceSeconds?: number; // e.g. 420s = 7:00 min/km
  defaultTargetPaceSeconds?: number;   // e.g. 330s = 5:30 min/km
}

export const goalPresets: FitnessGoalPreset[] = [
  {
    id: 'running-20k',
    category: 'running',
    title: 'Jogging / Lari Jarak Jauh',
    targetUnit: 'km',
    defaultBaseline: 5,
    defaultTarget: 20,
    minVal: 1,
    maxVal: 42,
    step: 1,
    defaultFrequencyPerWeek: 3,
    iconName: 'Footprints',
    description: 'Target ketahanan kardiorespirasi, peningkatan jarak (km) & kecepatan pace.',
    defaultBaselinePaceSeconds: 420, // 7:00 min/km
    defaultTargetPaceSeconds: 345,   // 5:45 min/km
  },
  {
    id: 'pushup-50',
    category: 'pushup',
    title: 'Push-Up (1 Menit)',
    targetUnit: 'reps',
    defaultBaseline: 20,
    defaultTarget: 50,
    minVal: 5,
    maxVal: 100,
    step: 5,
    defaultFrequencyPerWeek: 4,
    iconName: 'Flame',
    description: 'Target kekuatan otot dada, triceps, dan kecepatan repetisi/detik (cadence).',
  },
  {
    id: 'situp-50',
    category: 'situp',
    title: 'Sit-Up / Crunch (1 Menit)',
    targetUnit: 'reps',
    defaultBaseline: 25,
    defaultTarget: 50,
    minVal: 10,
    maxVal: 100,
    step: 5,
    defaultFrequencyPerWeek: 4,
    iconName: 'Activity',
    description: 'Target ketahanan otot inti (core stability) dan cadence repetisi.',
  },
  {
    id: 'pullup-15',
    category: 'pullup',
    title: 'Pull-Up Max Effort',
    targetUnit: 'reps',
    defaultBaseline: 5,
    defaultTarget: 15,
    minVal: 1,
    maxVal: 35,
    step: 1,
    defaultFrequencyPerWeek: 3,
    iconName: 'Dumbbell',
    description: 'Target kekuatan menarik (pull strength) & penguatan punggung atas.',
  },
];

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  weeks: string;
  targetRange: string;
  sessions: number;
  focus: string;
  tips: string;
}

export interface PaceZone {
  name: string;
  code: string;
  paceStr: string;
  speedKmh: number;
  percentageUsage: string;
  description: string;
  colorClass: string;
}

export interface GoalCalculationResult {
  totalSessionsNeeded: number;
  estimatedWeeks: number;
  readinessPercentage: number;
  weeklyProgressionData: Array<{
    week: string;
    projected: number;
    projectedPace?: number;
    baseline: number;
    target: number;
  }>;
  roadmapPhases: RoadmapPhase[];
  keyAdvice: string;
  // Pace & Speed Metrics
  speedKmh?: number;
  estimatedFinishTimeFormatted?: string;
  targetPaceFormatted?: string;
  baselinePaceFormatted?: string;
  paceZones?: PaceZone[];
  // Calisthenics Cadence Metrics
  cadenceSecondsPerRep?: number;
  targetRepsPerSecond?: number;
}

/**
 * Format detik per km menjadi string pace (contoh: 330s -> "5:30")
 */
export function formatPace(secondsPerKm: number): string {
  const mins = Math.floor(secondsPerKm / 60);
  const secs = Math.round(secondsPerKm % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Hitung kecepatan km/jam dari detik per km
 */
export function paceToSpeed(secondsPerKm: number): number {
  if (secondsPerKm <= 0) return 0;
  return Number((3600 / secondsPerKm).toFixed(1));
}

/**
 * Hitung estimasi waktu selesai (contoh: 20 km pada 345s/km -> "1 Jam 55 Mnt")
 */
export function calculateFinishTime(distanceKm: number, paceSeconds: number): string {
  const totalSeconds = distanceKm * paceSeconds;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  if (hours > 0) {
    return `${hours} Jam ${minutes} Mnt`;
  }
  return `${minutes} Mnt ${seconds > 0 ? `${seconds} Dtk` : ''}`;
}

/**
 * Menghitung estimasi jumlah sesi latihan, roadmap, dan analitik pace & speed
 */
export function calculateGoalRoadmap(
  category: GoalCategory,
  baseline: number,
  target: number,
  frequencyPerWeek: number,
  targetPaceSeconds = 345, // default 5:45 min/km
  baselinePaceSeconds = 420 // default 7:00 min/km
): GoalCalculationResult {
  const safeBaseline = Math.max(0.1, baseline);
  const safeTarget = Math.max(safeBaseline, target);
  const safeFrequency = Math.max(1, Math.min(7, frequencyPerWeek));

  const gap = safeTarget - safeBaseline;
  const readiness = Math.min(100, Math.round((safeBaseline / safeTarget) * 100));

  let estimatedWeeks = 0;
  let weeklyData: Array<{ week: string; projected: number; projectedPace?: number; baseline: number; target: number }> = [];
  let phases: RoadmapPhase[] = [];
  let keyAdvice = '';

  if (category === 'running') {
    // Kaidah lari: Peningkatan jarak aman 10% per minggu
    const rawWeeks = gap > 0 ? Math.log(safeTarget / safeBaseline) / Math.log(1.10) : 1;
    estimatedWeeks = Math.max(2, Math.ceil(rawWeeks));

    const paceGap = baselinePaceSeconds - targetPaceSeconds;
    const paceStepPerWeek = paceGap / estimatedWeeks;

    let currentDist = safeBaseline;
    for (let w = 1; w <= estimatedWeeks; w++) {
      currentDist = Math.min(safeTarget, safeBaseline * Math.pow(1.10, w));
      const currentPace = Math.max(targetPaceSeconds, baselinePaceSeconds - paceStepPerWeek * w);
      weeklyData.push({
        week: `Mgg ${w}`,
        projected: Number(currentDist.toFixed(1)),
        projectedPace: Number(paceToSpeed(currentPace)),
        baseline: safeBaseline,
        target: safeTarget,
      });
    }

    const totalSessions = estimatedWeeks * safeFrequency;
    const speed = paceToSpeed(targetPaceSeconds);
    const finishTime = calculateFinishTime(safeTarget, targetPaceSeconds);
    const targetPaceStr = formatPace(targetPaceSeconds);
    const baselinePaceStr = formatPace(baselinePaceSeconds);

    // 3 Zona Latihan Pace untuk Lari
    const easyPaceSec = targetPaceSeconds + 60; // +1:00 min/km slower
    const tempoPaceSec = targetPaceSeconds + 15; // +0:15 min/km
    const intervalPaceSec = Math.max(180, targetPaceSeconds - 30); // -0:30 min/km faster

    const paceZones: PaceZone[] = [
      {
        name: 'Easy / Aerobic Pace',
        code: 'Zona 2',
        paceStr: `${formatPace(easyPaceSec)} - ${formatPace(easyPaceSec + 30)} /km`,
        speedKmh: paceToSpeed(easyPaceSec),
        percentageUsage: '70 - 80% Sesi',
        description: 'Membangun kapasitas paru-paru & pembakaran lemak tanpa membuat otot kelelahan.',
        colorClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
      },
      {
        name: 'Threshold / Tempo Pace',
        code: 'Zona 3-4',
        paceStr: `${formatPace(tempoPaceSec)} - ${formatPace(targetPaceSeconds)} /km`,
        speedKmh: paceToSpeed(tempoPaceSec),
        percentageUsage: '15 - 20% Sesi',
        description: 'Meningkatkan batas ambang toleransi asam laktat untuk menjaga kecepatan konstan.',
        colorClass: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
      },
      {
        name: 'Interval / Speed Pace',
        code: 'Zona 5',
        paceStr: `${formatPace(intervalPaceSec)} /km`,
        speedKmh: paceToSpeed(intervalPaceSec),
        percentageUsage: '5 - 10% Sesi',
        description: 'Sprint 400m - 800m untuk efisiensi kayuhan kaki (stride frequency) & VO2 Max.',
        colorClass: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
      },
    ];

    phases = [
      {
        phaseNumber: 1,
        title: 'Aerobic Base & Easy Pacing',
        weeks: `Minggu 1 - ${Math.max(1, Math.floor(estimatedWeeks * 0.35))}`,
        targetRange: `${safeBaseline.toFixed(1)} km - ${(safeBaseline + gap * 0.35).toFixed(1)} km (Pace ${formatPace(easyPaceSec)})`,
        sessions: Math.ceil(totalSessions * 0.35),
        focus: 'Membangun fondasi kardio pada Zona 2 (Easy Pace). Fokus pada durasi lari, bukan kecepatan.',
        tips: 'Pertahankan pace percakapan (bisa bicara santai 2 kalimat tanpa terengah-engah).',
      },
      {
        phaseNumber: 2,
        title: 'Tempo Run & Volume Building',
        weeks: `Minggu ${Math.max(2, Math.floor(estimatedWeeks * 0.35) + 1)} - ${Math.floor(estimatedWeeks * 0.75)}`,
        targetRange: `${(safeBaseline + gap * 0.35).toFixed(1)} km - ${(safeBaseline + gap * 0.75).toFixed(1)} km (Pace ${formatPace(tempoPaceSec)})`,
        sessions: Math.ceil(totalSessions * 0.4),
        focus: 'Kombinasi 1 sesi long run akhir pekan + 1 sesi tempo run untuk membiasakan kecepatan.',
        tips: 'Gunakan sepatu dengan bantalan memadai dan konsumsi cairan elektrolit setiap 5 km.',
      },
      {
        phaseNumber: 3,
        title: 'Race Pace Simulation & Tapering',
        weeks: `Minggu ${Math.floor(estimatedWeeks * 0.75) + 1} - ${estimatedWeeks}`,
        targetRange: `${(safeBaseline + gap * 0.75).toFixed(1)} km - ${safeTarget.toFixed(1)} km (Target Pace ${targetPaceStr})`,
        sessions: Math.ceil(totalSessions * 0.25),
        focus: `Simulasi kecepatan target ${targetPaceStr} /km dan penyesuaian waktu selesai ${finishTime}.`,
        tips: 'Lakukan pengurangan volume lari 30% pada 4 hari sebelum tes lari jarak 20 km.',
      },
    ];

    keyAdvice = `Untuk mencapai target ${safeTarget} km pada kecepatan Pace ${targetPaceStr}/km (${speed} km/jam), Anda membutuhkan sekitar ${totalSessions} sesi latihan (~${estimatedWeeks} minggu dengan ${safeFrequency}x seminggu). Estimasi total waktu selesai adalah ${finishTime}.`;

    return {
      totalSessionsNeeded: totalSessions,
      estimatedWeeks,
      readinessPercentage: readiness,
      weeklyProgressionData: weeklyData,
      roadmapPhases: phases,
      keyAdvice,
      speedKmh: speed,
      estimatedFinishTimeFormatted: finishTime,
      targetPaceFormatted: targetPaceStr,
      baselinePaceFormatted: baselinePaceStr,
      paceZones,
    };
  }

  // Calisthenics (Push-Up, Sit-Up, Pull-Up Cadence)
  const repGrowthPerWeek = category === 'pullup' ? 0.8 : 2.5;
  const rawWeeksCalisthenics = gap > 0 ? Math.ceil(gap / repGrowthPerWeek) : 1;
  estimatedWeeks = Math.max(2, Math.min(16, rawWeeksCalisthenics));
  const totalSessions = estimatedWeeks * safeFrequency;

  let currentReps = safeBaseline;
  const stepPerWeek = gap / estimatedWeeks;
  for (let w = 1; w <= estimatedWeeks; w++) {
    currentReps = Math.min(safeTarget, safeBaseline + stepPerWeek * w);
    weeklyData.push({
      week: `Mgg ${w}`,
      projected: Math.round(currentReps),
      baseline: safeBaseline,
      target: safeTarget,
    });
  }

  // Cadence: detik per rep dalam 60 detik
  const cadenceSeconds = Number((60 / safeTarget).toFixed(1));
  const repsPerSec = Number((safeTarget / 60).toFixed(2));

  phases = [
    {
      phaseNumber: 1,
      title: 'Cadence & Form Conditioning',
      weeks: `Minggu 1 - ${Math.max(1, Math.floor(estimatedWeeks * 0.35))}`,
      targetRange: `${Math.round(safeBaseline)} - ${Math.round(safeBaseline + gap * 0.35)} reps`,
      sessions: Math.ceil(totalSessions * 0.35),
      focus: `Membiasakan ritme ${cadenceSeconds} detik per repetisi dengan full range of motion.`,
      tips: 'Gunakan metronom suara atau hitungan ritme teratur (1 detik turun, eksplosif naik).',
    },
    {
      phaseNumber: 2,
      title: 'Lactate Threshold & Density Sets',
      weeks: `Minggu ${Math.max(2, Math.floor(estimatedWeeks * 0.35) + 1)} - ${Math.floor(estimatedWeeks * 0.75)}`,
      targetRange: `${Math.round(safeBaseline + gap * 0.35)} - ${Math.round(safeBaseline + gap * 0.75)} reps`,
      sessions: Math.ceil(totalSessions * 0.4),
      focus: 'Latihan set piramida dan melatih ambang kelelahan asam laktat pada detik ke 35-50.',
      tips: 'Kombinasikan dengan latihan aksesoris penguat triceps & core plank 3x seminggu.',
    },
    {
      phaseNumber: 3,
      title: '1-Minute Full Speed Test',
      weeks: `Minggu ${Math.floor(estimatedWeeks * 0.75) + 1} - ${estimatedWeeks}`,
      targetRange: `${Math.round(safeBaseline + gap * 0.75)} - ${Math.round(safeTarget)} reps`,
      sessions: Math.ceil(totalSessions * 0.25),
      focus: `Mengeksekusi target ${safeTarget} repetisi dalam 60 detik tanpa kehilangan bentuk (ritme ${cadenceSeconds} detik/rep).`,
      tips: 'Bagi 60 detik: 20 detik pertama hemat energi, 20 detik kedua jaga ritme, 20 detik terakhir all-out.',
    },
  ];

  keyAdvice = `Untuk mencapai target ${safeTarget} ${category === 'pullup' ? 'pull-up' : category === 'pushup' ? 'push-up' : 'sit-up'} dalam 1 menit (${cadenceSeconds} detik/rep), Anda membutuhkan sekitar ${totalSessions} sesi latihan (~${estimatedWeeks} minggu dengan frekuensi ${safeFrequency}x seminggu).`;

  return {
    totalSessionsNeeded: totalSessions,
    estimatedWeeks,
    readinessPercentage: readiness,
    weeklyProgressionData: weeklyData,
    roadmapPhases: phases,
    keyAdvice,
    cadenceSecondsPerRep: cadenceSeconds,
    targetRepsPerSecond: repsPerSec,
  };
}
