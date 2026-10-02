import { GoogleGenAI } from '@google/genai';
import type { DailyLog } from '../lib/supabase';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const hasGeminiKey = Boolean(apiKey && !apiKey.includes('YOUR_API_KEY') && !apiKey.includes('placeholder'));

/**
 * Menghasilkan saran & rekomendasi pemulihan harian menggunakan Google Gemini API
 */
export async function generateFitnessAdvice(
  currentLog: DailyLog,
  previousLogs: DailyLog[] = []
): Promise<string> {
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

      const prompt = `
Anda adalah seorang "AI Fitness & Recovery Coach" profesional dan bersahabat.
Analisis data harian pengguna berikut:
- Berat Badan: ${currentLog.weight} kg
- Durasi Tidur: ${currentLog.sleep_hours} jam
- Rencana Latihan Hari Ini: ${currentLog.workout}
- Catatan Pengguna: ${currentLog.notes || 'Tidak ada'}

Riwayat 3 hari sebelumnya:
${historySummary || 'Belum ada data sebelumnya.'}

Instruksi Output:
Tulis respon dalam 3 sampai 4 kalimat ringkas dan jelas dalam Bahasa Indonesia:
1. Evaluasi kualitas pemulihan berdasarkan durasi tidurnya (${currentLog.sleep_hours} jam).
2. Rekomendasi intensitas latihan yang cocok untuk ${currentLog.workout} hari ini.
3. Satu tips actionable mengenai nutrisi, hidrasi, atau mobilitas.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini API call failed, menggunakan rekomendasi cerdas bawaan:', err);
    }
  }

  // Fallback Rule-Based Smart Coach jika API key belum diset atau offline
  return getOfflineCoachAdvice(currentLog);
}

/**
 * Heuristik pemulihan cerdas untuk pengalaman demo instan tanpa konfigurasi awal
 */
function getOfflineCoachAdvice(log: DailyLog): string {
  const { sleep_hours, workout, weight } = log;

  let sleepFeedback = '';
  if (sleep_hours >= 7.5) {
    sleepFeedback = `Tidur Anda sangat optimal (${sleep_hours} jam), sistem saraf pusat dan otot telah pulih dengan baik.`;
  } else if (sleep_hours >= 6) {
    sleepFeedback = `Durasi tidur Anda cukup (${sleep_hours} jam), namun perhatikan sinyal kelelahan selama sesi latihan.`;
  } else {
    sleepFeedback = `Tidur Anda kurang dari batas ideal (${sleep_hours} jam). Hindari memaksakan intensitas maksimal hari ini untuk mencegah cedera.`;
  }

  let workoutAdvice = '';
  if (workout === 'Angkat Beban') {
    workoutAdvice =
      sleep_hours >= 7
        ? 'Anda dalam kondisi prima untuk progressive overload pada gerakan compound.'
        : 'Pertimbangkan untuk menurunkan volume set atau fokus pada repetisi terkontrol.';
  } else if (workout === 'Kardio' || workout === 'HIIT / Calisthenics') {
    workoutAdvice =
      sleep_hours >= 7
        ? 'Bagus untuk memacu denyut jantung di zona 3-4.'
        : 'Jaga detak jantung di zona aerobik ringan (Zona 2) agar tidak membebani sistem kardiorespirasi.';
  } else if (workout === 'Yoga & Stretching' || workout === 'Rest Day') {
    workoutAdvice = 'Pilihan tepat untuk merestorasi mobilitas sendi dan menurunkan tingkat stres otot.';
  } else {
    workoutAdvice = 'Lakukan pemanasan dinamis 5-10 menit sebelum memulai sesi.';
  }

  const hydrationTip = `Targetkan minum air minimal ${(weight * 0.035).toFixed(1)} Liter hari ini untuk menjaga hidrasi dan metabolisme.`;

  return `${sleepFeedback} ${workoutAdvice} ${hydrationTip}`;
}
