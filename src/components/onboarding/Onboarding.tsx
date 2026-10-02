import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, Dumbbell, Flame, Sparkles, User, Users } from 'lucide-react';

export interface UserProfile {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  hasExperience: boolean;
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  initialWeight: number;
  targetWeight?: number;
  dailyCalorieTarget: number;
}

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  initialName?: string;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialName = 'Alex' }) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 3;

  // Form State
  const [name, setName] = useState(initialName);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [hasExperience, setHasExperience] = useState<boolean>(true);
  const [fitnessLevel, setFitnessLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [weight, setWeight] = useState<number>(68);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({
        name: name.trim() || 'Alex',
        gender,
        hasExperience,
        fitnessLevel,
        initialWeight: weight,
        dailyCalorieTarget: 2200,
      });
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between max-w-md mx-auto px-5 py-6 pt-safe-top pb-safe-bottom font-sans">
      {/* Top Navigation & Step Indicator */}
      <div>
        <div className="flex items-center justify-between mb-4">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-10 h-10" />
          )}

          <div className="text-center">
            <span className="text-xs font-semibold tracking-wider uppercase text-purple-400">
              Step {step} of {totalSteps}
            </span>
          </div>

          <div className="w-10 h-10" />
        </div>

        {/* Progress Bar Line */}
        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-sky-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step 1: Gender Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Profil Pribadi
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Siapa nama dan gender Anda?
              </h2>
              <p className="text-xs text-slate-400">
                Data ini membantu AI Pro Coach menyesuaikan anjuran nutrisi dan metabolisme Anda.
              </p>
            </div>

            {/* Input Nama */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Nama Panggilan</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="w-full bg-slate-900/80 border border-slate-700/60 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* Gender Cards */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-medium text-slate-300">Pilih Gender</label>
              <div className="grid grid-cols-2 gap-3">
                {/* Pria Card */}
                <button
                  type="button"
                  onClick={() => setGender('Male')}
                  className={`p-4 rounded-3xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-32 ${
                    gender === 'Male'
                      ? 'bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border-purple-400 shadow-pastel-purple scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">Pria</h4>
                    <p className="text-[11px] text-slate-400">Target massa otot & power</p>
                  </div>
                </button>

                {/* Wanita Card */}
                <button
                  type="button"
                  onClick={() => setGender('Female')}
                  className={`p-4 rounded-3xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-32 ${
                    gender === 'Female'
                      ? 'bg-gradient-to-br from-pink-900/60 to-purple-900/40 border-pink-400 shadow-soft-lg scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-9 h-9 rounded-2xl bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">Wanita</h4>
                    <p className="text-[11px] text-slate-400">Target tone, stamina & fleksibilitas</p>
                  </div>
                </button>
              </div>

              {/* Other Option */}
              <button
                type="button"
                onClick={() => setGender('Other')}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  gender === 'Other'
                    ? 'bg-purple-900/40 border-purple-400 shadow-soft'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-200">Lainnya / Lebih suka tidak menyebutkan</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${gender === 'Other' ? 'border-purple-400 bg-purple-500' : 'border-slate-600'}`}>
                  {gender === 'Other' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Fitness Experience */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Riwayat Kebugaran
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Apakah Anda memiliki pengalaman fitness?
              </h2>
              <p className="text-xs text-slate-400">
                Pilih tingkat intensitas yang paling mewakili rutinitas latihan Anda saat ini.
              </p>
            </div>

            {/* Simple Yes/No Toggle */}
            <div className="grid grid-cols-2 gap-3 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setHasExperience(true)}
                className={`py-2.5 text-xs font-semibold rounded-xl transition ${
                  hasExperience ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ya, Pernah
              </button>
              <button
                type="button"
                onClick={() => {
                  setHasExperience(false);
                  setFitnessLevel('Beginner');
                }}
                className={`py-2.5 text-xs font-semibold rounded-xl transition ${
                  !hasExperience ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Belum Pernah
              </button>
            </div>

            {/* Level Experience Cards */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-medium text-slate-300">Tingkat Pengalaman Latihan</label>

              {/* Beginner */}
              <button
                type="button"
                onClick={() => {
                  setFitnessLevel('Beginner');
                  setHasExperience(false);
                }}
                className={`w-full p-4 rounded-3xl border text-left transition duration-200 cursor-pointer flex items-center justify-between ${
                  fitnessLevel === 'Beginner'
                    ? 'bg-gradient-to-r from-emerald-950/70 to-slate-900 border-emerald-400 shadow-pastel-green scale-[1.01]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                    🌱
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">Pemula (Beginner)</h4>
                    <p className="text-[11px] text-slate-400">Baru memulai atau latihan &lt; 6 bulan</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${fitnessLevel === 'Beginner' ? 'border-emerald-400 bg-emerald-500' : 'border-slate-600'}`}>
                  {fitnessLevel === 'Beginner' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              {/* Intermediate */}
              <button
                type="button"
                onClick={() => {
                  setFitnessLevel('Intermediate');
                  setHasExperience(true);
                }}
                className={`w-full p-4 rounded-3xl border text-left transition duration-200 cursor-pointer flex items-center justify-between ${
                  fitnessLevel === 'Intermediate'
                    ? 'bg-gradient-to-r from-purple-950/70 to-slate-900 border-purple-400 shadow-pastel-purple scale-[1.01]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                    ⚡
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">Menengah (Intermediate)</h4>
                    <p className="text-[11px] text-slate-400">Rutin berlatih 1-2 tahun ke belakang</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${fitnessLevel === 'Intermediate' ? 'border-purple-400 bg-purple-500' : 'border-slate-600'}`}>
                  {fitnessLevel === 'Intermediate' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              {/* Advanced */}
              <button
                type="button"
                onClick={() => {
                  setFitnessLevel('Advanced');
                  setHasExperience(true);
                }}
                className={`w-full p-4 rounded-3xl border text-left transition duration-200 cursor-pointer flex items-center justify-between ${
                  fitnessLevel === 'Advanced'
                    ? 'bg-gradient-to-r from-amber-950/70 to-slate-900 border-amber-400 shadow-soft-lg scale-[1.01]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                    🔥
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">Lanjutan (Advanced / Athlete)</h4>
                    <p className="text-[11px] text-slate-400">Pengalaman &gt; 2 tahun dengan target spesifik</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${fitnessLevel === 'Advanced' ? 'border-amber-400 bg-amber-500' : 'border-slate-600'}`}>
                  {fitnessLevel === 'Advanced' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Big Weight Slider & Stepper */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-medium">
                <Flame className="w-3.5 h-3.5 text-sky-400" /> Berat Badan Saat Ini
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Berapa berat badan awal Anda?
              </h2>
              <p className="text-xs text-slate-400">
                Geser slider atau gunakan tombol untuk mengatur berat badan awal Anda.
              </p>
            </div>

            {/* Giant Central Weight Display */}
            <div className="py-8 bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-slate-800 rounded-3xl text-center space-y-4 shadow-soft-lg relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-black tracking-tight text-white font-sans drop-shadow-md">
                  {weight.toFixed(1)}
                </span>
                <span className="text-xl font-semibold text-purple-400">kg</span>
              </div>

              {/* Slider Control */}
              <div className="px-8">
                <input
                  type="range"
                  min="40"
                  max="150"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-medium mt-2">
                  <span>40 kg</span>
                  <span>Ideal Balance</span>
                  <span>150 kg</span>
                </div>
              </div>

              {/* Quick Increment/Decrement Buttons */}
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setWeight((prev) => Math.max(40, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white active:scale-95 transition"
                >
                  - 1.0 kg
                </button>
                <button
                  type="button"
                  onClick={() => setWeight((prev) => Math.max(40, prev - 0.1))}
                  className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white active:scale-95 transition"
                >
                  - 0.1 kg
                </button>
                <button
                  type="button"
                  onClick={() => setWeight((prev) => Math.min(150, prev + 0.1))}
                  className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white active:scale-95 transition"
                >
                  + 0.1 kg
                </button>
                <button
                  type="button"
                  onClick={() => setWeight((prev) => Math.min(150, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white active:scale-95 transition"
                >
                  + 1.0 kg
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Button */}
      <div className="pt-6">
        <button
          type="button"
          onClick={handleNext}
          className="w-full bg-[#05070c] border border-purple-500/40 hover:border-purple-400 text-white font-semibold py-4 rounded-2xl shadow-pastel-purple flex items-center justify-center gap-2 text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer group"
        >
          <span>{step === totalSteps ? 'Mulai Perjalanan Kebugaran' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
