-- ==========================================================
-- Schema Database untuk Aplikasi Fitness & Sleep Tracker
-- Jalankan skrip ini di SQL Editor Supabase Anda
-- ==========================================================

-- 1. Buat Enum untuk Tipe Latihan
CREATE TYPE workout_type AS ENUM (
  'Kardio',
  'Angkat Beban',
  'Yoga & Stretching',
  'HIIT / Calisthenics',
  'Rest Day',
  'Lainnya'
);

-- 2. Buat Tabel Data Harian (daily_logs)
CREATE TABLE IF NOT EXISTS daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  weight NUMERIC(5, 2) NOT NULL,            -- contoh: 68.50 kg
  sleep_hours NUMERIC(3, 1) NOT NULL,       -- contoh: 7.5 jam
  workout workout_type NOT NULL DEFAULT 'Angkat Beban',
  notes TEXT,
  ai_recommendation TEXT
);

-- 3. Tambahkan Index untuk Performa Query Riwayat Tercepat
CREATE INDEX IF NOT EXISTS idx_daily_logs_created_at ON daily_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs (date DESC);

-- 4. Aktifkan Row Level Security (RLS)
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- 5. Kebijakan RLS Sementara (Public Read & Insert untuk MVP/Demo)
CREATE POLICY "Allow public read access" ON daily_logs
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON daily_logs
  FOR INSERT WITH CHECK (true);
