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
    description: 'Target ketahanan kardiorespirasi & peningkatan volume lari secara aman.',
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
    description: 'Target kekuatan otot dada, triceps, dan ketahanan anaerobik cepat.',
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
    description: 'Target ketahanan otot inti (core stability & endurance).',
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
    description: 'Target kekuatan menarik (pull strength), punggung atas, dan bisep.',
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

export interface GoalCalculationResult {
  totalSessionsNeeded: number;
  estimatedWeeks: number;
  readinessPercentage: number;
  weeklyProgressionData: Array<{
    week: string;
    projected: number;
    baseline: number;
    target: number;
  }>;
  roadmapPhases: RoadmapPhase[];
  keyAdvice: string;
}

/**
 * Menghitung estimasi jumlah sesi latihan dan proyeksi roadmap
 * berdasarkan kaidah progressive overload aman (10% volume increase per week untuk lari,
 * serta progresi repetisi bertahap untuk calisthenics).
 */
export function calculateGoalRoadmap(
  category: GoalCategory,
  baseline: number,
  target: number,
  frequencyPerWeek: number
): GoalCalculationResult {
  const safeBaseline = Math.max(0.1, baseline);
  const safeTarget = Math.max(safeBaseline, target);
  const safeFrequency = Math.max(1, Math.min(7, frequencyPerWeek));

  const gap = safeTarget - safeBaseline;
  const readiness = Math.min(100, Math.round((safeBaseline / safeTarget) * 100));

  let estimatedWeeks = 0;
  let weeklyData: Array<{ week: string; projected: number; baseline: number; target: number }> = [];
  let phases: RoadmapPhase[] = [];
  let keyAdvice = '';

  if (category === 'running') {
    // Kaidah lari: Peningkatan jarak aman 10% per minggu
    // Formula: baseline * (1.10)^weeks = target => weeks = ln(target / baseline) / ln(1.10)
    const rawWeeks = gap > 0 ? Math.log(safeTarget / safeBaseline) / Math.log(1.10) : 1;
    estimatedWeeks = Math.max(2, Math.ceil(rawWeeks));

    // Generate weekly progression
    let currentDist = safeBaseline;
    for (let w = 1; w <= estimatedWeeks; w++) {
      currentDist = Math.min(safeTarget, safeBaseline * Math.pow(1.10, w));
      weeklyData.push({
        week: `Mgg ${w}`,
        projected: Number(currentDist.toFixed(1)),
        baseline: safeBaseline,
        target: safeTarget,
      });
    }

    const totalSessions = estimatedWeeks * safeFrequency;

    phases = [
      {
        phaseNumber: 1,
        title: 'Aerobic Base Building',
        weeks: `Minggu 1 - ${Math.max(1, Math.floor(estimatedWeeks * 0.35))}`,
        targetRange: `${safeBaseline.toFixed(1)} km - ${(safeBaseline + gap * 0.35).toFixed(1)} km`,
        sessions: Math.ceil(totalSessions * 0.35),
        focus: 'Membangun kapasitas paru-paru dan penguatan tendon kaki pada Zona 2 (Easy Pace).',
        tips: 'Jangan lari terlalu cepat; gunakan pace di mana Anda masih bisa berbicara tanpa terengah-engah.',
      },
      {
        phaseNumber: 2,
        title: 'Volume & Tempo Progression',
        weeks: `Minggu ${Math.max(2, Math.floor(estimatedWeeks * 0.35) + 1)} - ${Math.floor(estimatedWeeks * 0.75)}`,
        targetRange: `${(safeBaseline + gap * 0.35).toFixed(1)} km - ${(safeBaseline + gap * 0.75).toFixed(1)} km`,
        sessions: Math.ceil(totalSessions * 0.4),
        focus: 'Meningkatkan jarak long run mingguan + 1 sesi interval/tempo lari.',
        tips: 'Gunakan 1 sesi lari panjang di akhir pekan dan istirahat penuh sehari setelahnya.',
      },
      {
        phaseNumber: 3,
        title: 'Peak Mileage & Target Simulation',
        weeks: `Minggu ${Math.floor(estimatedWeeks * 0.75) + 1} - ${estimatedWeeks}`,
        targetRange: `${(safeBaseline + gap * 0.75).toFixed(1)} km - ${safeTarget.toFixed(1)} km`,
        sessions: Math.ceil(totalSessions * 0.25),
        focus: 'Simulasi jarak penuh target dan strategi hidrasi / elektrolit saat berlari.',
        tips: 'Lakukan tapering (pengurangan volume 30%) di 4 hari menjelang sesi pencapaian 20 km.',
      },
    ];

    keyAdvice = `Untuk mencapai target ${safeTarget} km dari ${safeBaseline} km, Anda membutuhkan sekitar ${totalSessions} kali sesi lari (~${estimatedWeeks} minggu dengan frekuensi ${safeFrequency}x seminggu).`;

    return {
      totalSessionsNeeded: totalSessions,
      estimatedWeeks,
      readinessPercentage: readiness,
      weeklyProgressionData: weeklyData,
      roadmapPhases: phases,
      keyAdvice,
    };
  }

  // Calisthenics (Push-Up, Sit-Up, Pull-Up)
  // Rata-rata penambahan kapasitas repetisi aman: ~2-3 reps per minggu untuk pushup/situp, ~0.8 reps per minggu untuk pullup
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

  phases = [
    {
      phaseNumber: 1,
      title: 'Density & Form Conditioning',
      weeks: `Minggu 1 - ${Math.max(1, Math.floor(estimatedWeeks * 0.35))}`,
      targetRange: `${Math.round(safeBaseline)} - ${Math.round(safeBaseline + gap * 0.35)} reps`,
      sessions: Math.ceil(totalSessions * 0.35),
      focus: 'Memperbaiki ritme, form sempurna (full range of motion), dan time under tension.',
      tips: 'Lakukan metode EMOM (Every Minute on the Minute) dengan 50-60% kapasitas maksimal per set.',
    },
    {
      phaseNumber: 2,
      title: 'Pyramid & Anaerobic Threshold',
      weeks: `Minggu ${Math.max(2, Math.floor(estimatedWeeks * 0.35) + 1)} - ${Math.floor(estimatedWeeks * 0.75)}`,
      targetRange: `${Math.round(safeBaseline + gap * 0.35)} - ${Math.round(safeBaseline + gap * 0.75)} reps`,
      sessions: Math.ceil(totalSessions * 0.4),
      focus: 'Melatih batas ambang asam laktat dengan set piramida dan drop-set singkat.',
      tips: 'Kombinasikan dengan latihan aksesoris penguat (seperti plank untuk sit-up, atau dips/tricep extension untuk push-up).',
    },
    {
      phaseNumber: 3,
      title: '1-Minute Speed & Endurance Test',
      weeks: `Minggu ${Math.floor(estimatedWeeks * 0.75) + 1} - ${estimatedWeeks}`,
      targetRange: `${Math.round(safeBaseline + gap * 0.75)} - ${Math.round(safeTarget)} reps`,
      sessions: Math.ceil(totalSessions * 0.25),
      focus: 'Simulasi kecepatan tinggi dalam 60 detik dengan pacing ritme teratur.',
      tips: 'Bagi 60 detik menjadi 3 blok waktu: 20 detik pertama stabil, 20 detik kedua jaga ritme, 20 detik terakhir all-out.',
    },
  ];

  keyAdvice = `Untuk mencapai target ${safeTarget} ${category === 'pullup' ? 'pull-up' : category === 'pushup' ? 'push-up' : 'sit-up'} dalam 1 menit, Anda membutuhkan sekitar ${totalSessions} sesi latihan intensif (~${estimatedWeeks} minggu dengan frekuensi ${safeFrequency}x seminggu).`;

  return {
    totalSessionsNeeded: totalSessions,
    estimatedWeeks,
    readinessPercentage: readiness,
    weeklyProgressionData: weeklyData,
    roadmapPhases: phases,
    keyAdvice,
  };
}
