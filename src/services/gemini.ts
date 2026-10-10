import { GoogleGenAI } from '@google/genai';
import type { DailyLog } from '../lib/supabase';
import type { UserProfile } from '../components/onboarding/Onboarding';
import type { MuscleGroup } from '../components/dashboard/MuscleWorkload';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const hasGeminiKey = Boolean(apiKey && !apiKey.includes('YOUR_API_KEY') && !apiKey.includes('placeholder'));

export interface ProCoachInput {
  profile: UserProfile;
  currentLog: DailyLog;
  selectedMuscles?: MuscleGroup[];
  previousLogs?: DailyLog[];
}

export interface GoalFeasibilityInput {
  profile: UserProfile;
  goalTitle: string;
  baseline: number;
  target: number;
  unit: string;
  frequencyPerWeek: number;
  estimatedSessions: number;
  estimatedWeeks: number;
  averageSleep?: number;
}

/**
 * Menghasilkan analisis mendalam dan saran pemulihan sebagai 'Pro Coach' ditenagai Gemini API
 */
export async function generateProCoachInsight(input: ProCoachInput): Promise<string> {
  const { profile, currentLog, selectedMuscles = [], previousLogs = [] } = input;

  if (hasGeminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const historySummary = previousLogs
        .slice(0, 3)
        .map(
          (l) =>
            `- Tanggal: ${l.date || 'Lalu'} | Latihan: ${l.workout} | Tidur: ${l.sleep_hours} jam | BB: ${l.weight} kg`
        )
        .join('\n');

      const targetedMusclesStr =
        selectedMuscles.length > 0 ? selectedMuscles.join(', ') : 'General Full-Body / Rest';

      const prompt = `
Peran: Anda adalah 'Pro Fitness & Recovery Coach' berpengalaman tingkat elit.
Nama Klien: ${profile.name}
Profil Klien:
- Gender: ${profile.gender}
- Tingkat Pengalaman: ${profile.fitnessLevel} (Pengalaman sebelumnya: ${profile.hasExperience ? 'Ya' : 'Belum'})
- Berat Awal: ${profile.initialWeight} kg

Data Aktivitas Hari Ini:
- Berat Badan Hari Ini: ${currentLog.weight} kg (Perubahan: ${(currentLog.weight - profile.initialWeight).toFixed(1)} kg)
- Durasi Tidur Tadi Malam: ${currentLog.sleep_hours} jam
- Jenis Latihan Hari Ini: ${currentLog.workout}
- Fokus Kelompok Otot (Targeted Muscles): ${targetedMusclesStr}
- Catatan Klien: ${currentLog.notes || 'Tidak ada'}

Riwayat Log Singkat:
${historySummary || 'Baru memulai sesi pertama.'}

Instruksi Output:
Tulis respons bergaya coach profesional, empati, langsung ke poin, dan memotivasi (maksimal 3-4 kalimat dalam Bahasa Indonesia):
1. Berikan apresiasi atau evaluasi performa hari ini dengan menyebut fokus otot (${targetedMusclesStr}).
2. Analisis kualitas pemulihan berdasarkan ${currentLog.sleep_hours} jam tidur dan apakah intensitas perlu disesuaikan.
3. Berikan 1 instruksi praktis untuk recovery (misal: hidrasi, peregangan otot terkait, atau jendela nutrisi protein).
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini API request failed, beralih ke fallback coach cerdas:', err);
    }
  }

  // Fallback Rule-Based Smart Coach
  return getOfflineProCoachAdvice(profile, currentLog, selectedMuscles);
}

/**
 * Menghasilkan analisis kelayakan target kebugaran (Goal Feasibility) & tips roadmap
 */
export async function generateGoalFeasibilityAdvice(input: GoalFeasibilityInput): Promise<string> {
  const {
    profile,
    goalTitle,
    baseline,
    target,
    unit,
    frequencyPerWeek,
    estimatedSessions,
    estimatedWeeks,
    averageSleep = 7.5,
  } = input;

  if (hasGeminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
Peran: Anda adalah 'Pro Fitness Analytics & Head Coach'.
Klien: ${profile.name} (Tingkat: ${profile.fitnessLevel}, Gender: ${profile.gender}, Berat: ${profile.initialWeight} kg).
Rata-rata tidur saat ini: ${averageSleep} jam/malam.

Rencana Target Kebugaran:
- Target: ${goalTitle} (Dari ${baseline} ${unit} menuju ${target} ${unit})
- Rencana Latihan: ${frequencyPerWeek} kali per minggu
- Estimasi Model Kalkulator: Membutuhkan ~${estimatedSessions} sesi latihan dalam kurun waktu ~${estimatedWeeks} minggu.

Instruksi Output:
Berikan analisis coaching singkat dan sangat jelas (3-4 kalimat dalam Bahasa Indonesia):
1. Apakah target ini realistis dan aman dengan frekuensi ${frequencyPerWeek}x/minggu?
2. Berikan 1 strategi kunci untuk menghindari cedera/kelelahan berlebih (misal: pacing pernafasan saat lari, atau teknik rest-pause untuk pushup/situp).
3. Evaluasi apakah durasi tidur ${averageSleep} jam mencukupi untuk mendukung target ini dan tips tidur pemulihannya.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini API goal feasibility failed, fallback to local logic:', err);
    }
  }

  // Fallback Heuristik
  const sleepStatus =
    averageSleep >= 7.5
      ? `Rata-rata tidur Anda (${averageSleep} jam) sudah sangat baik untuk mendukung adaptasi sistem saraf dan otot.`
      : `Perhatikan waktu tidur Anda (${averageSleep} jam); tingkatkan minimal ke 7.5 jam agar pemulihan glikogen dan otot optimal.`;

  return `Target ${goalTitle} (${target} ${unit}) dari posisi awal ${baseline} ${unit} sangat terukur dan realistis dalam ~${estimatedWeeks} minggu dengan ${frequencyPerWeek} sesi/minggu. Terapkan prinsip progressive overload tanpa memaksakan lonjakan volume mendadak di minggu awal. ${sleepStatus}`;
}

function getOfflineProCoachAdvice(
  profile: UserProfile,
  log: DailyLog,
  muscles: MuscleGroup[]
): string {
  const { sleep_hours, workout, weight } = log;
  const muscleNames = muscles.length > 0 ? muscles.join(' & ') : workout;

  let sleepEvaluation = '';
  if (sleep_hours >= 7.5) {
    sleepEvaluation = `Kerja bagus ${profile.name}! Tidur ${sleep_hours} jam memberikan regenerasi anabolik optimal untuk otot ${muscleNames}.`;
  } else if (sleep_hours >= 6) {
    sleepEvaluation = `Sesi yang solid untuk ${muscleNames}, namun tidur ${sleep_hours} jam membutuhkan perhatian ekstra pada hidrasi dan pemanasan.`;
  } else {
    sleepEvaluation = `Perhatian ${profile.name}, tidur ${sleep_hours} jam dapat memicu kelelahan pada otot ${muscleNames}. Turunkan intensitas 15-20% untuk mencegah cedera.`;
  }

  const hydrationTarget = (weight * 0.035).toFixed(1);
  const recoveryTip =
    muscles.includes('Legs') || muscles.includes('Back')
      ? `Fokuskan foam rolling 5 menit dan konsumsi air minimal ${hydrationTarget}L untuk mempercepat pembuangan asam laktat.`
      : `Pastikan asupan protein 25-30g setelah latihan serta hidrasi ${hydrationTarget}L untuk memaksimalkan sintesis protein otot.`;

  return `${sleepEvaluation} Sebagai atlet level ${profile.fitnessLevel}, ${recoveryTip}`;
}

/**
 * Kompatibilitas fungsi legacy
 */
export async function generateFitnessAdvice(
  currentLog: DailyLog,
  previousLogs: DailyLog[] = []
): Promise<string> {
  const defaultProfile: UserProfile = {
    name: 'Pengguna',
    gender: 'Male',
    hasExperience: true,
    fitnessLevel: 'Intermediate',
    initialWeight: currentLog.weight,
    dailyCalorieTarget: 2000,
  };

  return generateProCoachInsight({
    profile: defaultProfile,
    currentLog,
    previousLogs,
  });
}
