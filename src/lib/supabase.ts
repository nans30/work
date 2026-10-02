import { createClient } from '@supabase/supabase-js';

export type WorkoutType =
  | 'Kardio'
  | 'Angkat Beban'
  | 'Yoga & Stretching'
  | 'HIIT / Calisthenics'
  | 'Rest Day'
  | 'Lainnya';

export interface DailyLog {
  id?: string;
  created_at?: string;
  date?: string;
  weight: number;
  sleep_hours: number;
  workout: WorkoutType;
  notes?: string;
  ai_recommendation?: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Inisialisasi Supabase client jika konfigurasi tersedia
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const LOCAL_STORAGE_KEY = 'aurafit_local_logs';

/**
 * Menyimpan data log harian baru ke Supabase atau LocalStorage jika offline/belum terhubung
 */
export async function insertDailyLog(log: Omit<DailyLog, 'id' | 'created_at'>): Promise<DailyLog> {
  const newLog: DailyLog = {
    ...log,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    date: log.date || new Date().toISOString().split('T')[0],
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('daily_logs')
        .insert([log])
        .select()
        .single();

      if (error) {
        console.warn('Gagal menyimpan ke Supabase, beralih ke cache lokal:', error.message);
      } else if (data) {
        return data as DailyLog;
      }
    } catch (err) {
      console.warn('Supabase request error, fallback ke penyimpanan lokal:', err);
    }
  }

  // Simpan ke LocalStorage sebagai cadangan / offline support
  const existing = getLocalLogs();
  const updated = [newLog, ...existing];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return newLog;
}

/**
 * Mengambil riwayat log terbaru
 */
export async function fetchRecentLogs(limit = 10): Promise<DailyLog[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data as DailyLog[];
      }
    } catch (err) {
      console.warn('Gagal mengambil data dari Supabase, memuat dari lokal storage:', err);
    }
  }

  return getLocalLogs().slice(0, limit);
}

function getLocalLogs(): DailyLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return getDefaultSampleLogs();
    return JSON.parse(raw);
  } catch {
    return getDefaultSampleLogs();
  }
}

function getDefaultSampleLogs(): DailyLog[] {
  return [
    {
      id: 'sample-1',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      weight: 68.2,
      sleep_hours: 7.5,
      workout: 'Angkat Beban',
      notes: 'Latihan chest & triceps, energi bagus.',
      ai_recommendation: 'Pemulihan tidur sangat optimal (7.5 jam). Tubuh siap untuk progresi beban bertahap hari ini. Pastikan asupan protein 1.6-2.0g/kgBB tercukupi.',
    },
    {
      id: 'sample-2',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      weight: 68.5,
      sleep_hours: 5.5,
      workout: 'Kardio',
      notes: 'Lari santai 3km, agak mengantuk.',
      ai_recommendation: 'Tidur kurang dari 6 jam berisiko meningkatkan hormon kortisol. Prioritaskan tidur lebih awal malam ini dan hindari kafein 6 jam sebelum tidur.',
    },
  ];
}
