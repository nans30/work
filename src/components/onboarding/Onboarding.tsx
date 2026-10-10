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
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-lg lg:max-w-xl bg-white dark:bg-[#131B2E] border border-slate-100 dark:border-slate-800 rounded-[36px] p-6 sm:p-9 shadow-mockup-lg dark:shadow-mockup-dark flex flex-col justify-between font-sans relative overflow-hidden transition-colors">
        {/* Top Navigation & Step Indicator */}
        <div>
          <div className="flex items-center justify-between mb-4">
            {step > 1 ? (
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-10 h-10" />
            )}

            <div className="text-center">
              <span className="text-xs font-bold tracking-wider uppercase text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full border border-purple-100 dark:border-purple-800">
                Step {step} of {totalSteps}
              </span>
            </div>

            <div className="w-10 h-10" />
          </div>

          {/* Progress Bar Line */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>

          {/* Step 1: Gender Selection */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Profil Pribadi
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Siapa nama dan gender Anda?
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Data ini membantu AI Pro Coach menyesuaikan anjuran latihan & metabolisme Anda.
                </p>
              </div>

              {/* Input Nama */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nama Panggilan</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama Anda"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 font-medium"
                />
              </div>

              {/* Gender Cards */}
              <div className="space-y-2.5 pt-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Pilih Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('Male')}
                    className={`p-4 rounded-[28px] border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-32 ${
                      gender === 'Male'
                        ? 'bg-slate-900 dark:bg-purple-600 text-white border-slate-900 dark:border-purple-500 shadow-md scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold ${gender === 'Male' ? 'bg-purple-600 dark:bg-slate-900 text-white' : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'}`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-snug">Pria</h4>
                      <p className={`text-[11px] ${gender === 'Male' ? 'text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                        Target massa otot & power
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender('Female')}
                    className={`p-4 rounded-[28px] border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-32 ${
                      gender === 'Female'
                        ? 'bg-slate-900 dark:bg-purple-600 text-white border-slate-900 dark:border-purple-500 shadow-md scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold ${gender === 'Female' ? 'bg-purple-600 dark:bg-slate-900 text-white' : 'bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400'}`}>
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-snug">Wanita</h4>
                      <p className={`text-[11px] ${gender === 'Female' ? 'text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                        Tone & fleksibilitas
                      </p>
                    </div>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setGender('Other')}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    gender === 'Other'
                      ? 'bg-slate-900 dark:bg-purple-600 text-white border-slate-900 dark:border-purple-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold">Lainnya / Tidak ingin menyebutkan</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${gender === 'Other' ? 'border-purple-400 bg-purple-500' : 'border-slate-300 dark:border-slate-700'}`}>
                    {gender === 'Other' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Fitness Experience */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <Dumbbell className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Riwayat Kebugaran
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Pengalaman fitness Anda?
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Pilih tingkat intensitas yang paling mewakili rutinitas latihan Anda.
                </p>
              </div>

              {/* Simple Yes/No Toggle */}
              <div className="grid grid-cols-2 gap-3 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setHasExperience(true)}
                  className={`py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                    hasExperience ? 'bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
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
                  className={`py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                    !hasExperience ? 'bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Belum Pernah
                </button>
              </div>

              {/* Level Experience Cards */}
              <div className="space-y-2.5 pt-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tingkat Pengalaman Latihan</label>

                <button
                  type="button"
                  onClick={() => {
                    setFitnessLevel('Beginner');
                    setHasExperience(false);
                  }}
                  className={`w-full p-4 rounded-[24px] border text-left transition duration-200 cursor-pointer flex items-center justify-between ${
                    fitnessLevel === 'Beginner'
                      ? 'bg-slate-900 dark:bg-purple-600 text-white border-slate-900 dark:border-purple-500 shadow-md scale-[1.01]'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-lg">
                      🌱
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Pemula (Beginner)</h4>
                      <p className={`text-[11px] ${fitnessLevel === 'Beginner' ? 'text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                        Baru memulai atau latihan &lt; 6 bulan
                      </p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${fitnessLevel === 'Beginner' ? 'border-purple-400 bg-purple-500' : 'border-slate-300 dark:border-slate-700'}`}>
                    {fitnessLevel === 'Beginner' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFitnessLevel('Intermediate');
                    setHasExperience(true);
                  }}
                  className={`w-full p-4 rounded-[24px] border text-left transition duration-200 cursor-pointer flex items-center justify-between ${
                    fitnessLevel === 'Intermediate'
                      ? 'bg-slate-900 dark:bg-purple-600 text-white border-slate-900 dark:border-purple-500 shadow-md scale-[1.01]'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-lg">
                      ⚡
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Menengah (Intermediate)</h4>
                      <p className={`text-[11px] ${fitnessLevel === 'Intermediate' ? 'text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                        Rutin berlatih 1-2 tahun ke belakang
                      </p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${fitnessLevel === 'Intermediate' ? 'border-purple-400 bg-purple-500' : 'border-slate-300 dark:border-slate-700'}`}>
                    {fitnessLevel === 'Intermediate' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFitnessLevel('Advanced');
                    setHasExperience(true);
                  }}
                  className={`w-full p-4 rounded-[24px] border text-left transition duration-200 cursor-pointer flex items-center justify-between ${
                    fitnessLevel === 'Advanced'
                      ? 'bg-slate-900 dark:bg-purple-600 text-white border-slate-900 dark:border-purple-500 shadow-md scale-[1.01]'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-lg">
                      🔥
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Lanjutan (Advanced / Athlete)</h4>
                      <p className={`text-[11px] ${fitnessLevel === 'Advanced' ? 'text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                        Pengalaman &gt; 2 tahun dengan target spesifik
                      </p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${fitnessLevel === 'Advanced' ? 'border-purple-400 bg-purple-500' : 'border-slate-300 dark:border-slate-700'}`}>
                    {fitnessLevel === 'Advanced' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Big Weight Slider */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Berat Badan Awal
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Berapa berat badan Anda?
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Geser slider untuk mengatur angka berat badan awal.
                </p>
              </div>

              {/* Giant Weight Display */}
              <div className="py-7 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] text-center space-y-3 shadow-sm relative overflow-hidden">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
                    {weight.toFixed(1)}
                  </span>
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">kg</span>
                </div>

                <div className="px-6 sm:px-8">
                  <input
                    type="range"
                    min="40"
                    max="150"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-1.5">
                    <span>40 kg</span>
                    <span>Progresif</span>
                    <span>150 kg</span>
                  </div>
                </div>

                <div className="flex justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setWeight((prev) => Math.max(40, prev - 1))}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition cursor-pointer shadow-sm"
                  >
                    - 1.0
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeight((prev) => Math.max(40, prev - 0.1))}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition cursor-pointer shadow-sm"
                  >
                    - 0.1
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeight((prev) => Math.min(150, prev + 0.1))}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition cursor-pointer shadow-sm"
                  >
                    + 0.1
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeight((prev) => Math.min(150, prev + 1))}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition cursor-pointer shadow-sm"
                  >
                    + 1.0
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-6">
          <button
            type="button"
            onClick={handleNext}
            className="w-full bg-[#0F172A] dark:bg-purple-600 hover:bg-black dark:hover:bg-purple-700 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer group"
          >
            <span>{step === totalSteps ? 'Mulai Perjalanan Kebugaran' : 'Lanjutkan'}</span>
            <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
