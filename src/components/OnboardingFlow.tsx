import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Dumbbell, 
  Target, 
  Flame, 
  HeartPulse, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { UserProfile, WorkoutPlan } from '../types';

interface OnboardingFlowProps {
  initialUser: UserProfile;
  onComplete: (plan: WorkoutPlan, user: UserProfile) => void;
  onCancel?: () => void;
}

export type OnboardingStep = 
  | 'welcome' 
  | 'about' 
  | 'goal' 
  | 'experience' 
  | 'equipment' 
  | 'summary' 
  | 'generating';

export default function OnboardingFlow({
  initialUser,
  onComplete,
  onCancel,
}: OnboardingFlowProps) {
  const [step, setStep] = useState<OnboardingStep>('welcome');

  // Form State (Preserved across back/forward navigation)
  const [name, setName] = useState<string>(initialUser.username || '');
  const [age, setAge] = useState<number | ''>(initialUser.age || '');
  const [weight, setWeight] = useState<number | ''>(initialUser.weight || '');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(initialUser.weightUnit || 'kg');

  const [goal, setGoal] = useState<string>(initialUser.goal || 'Muscle Gain');
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    initialUser.skillLevel || 'Intermediate'
  );
  const [equipmentOption, setEquipmentOption] = useState<'No Equipment' | 'Home Equipment' | 'Gym' | 'Mixed'>('Gym');

  // Validation errors
  const [validationError, setValidationError] = useState<string | null>(null);

  // Generation state
  const [generationPhase, setGenerationPhase] = useState<string>('Understanding your goal');
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Map user equipment selection to backend schema ('gym' | 'bodyweight' | 'minimal')
  const mapEquipmentToCategory = (opt: string): 'gym' | 'bodyweight' | 'minimal' => {
    switch (opt) {
      case 'No Equipment':
        return 'bodyweight';
      case 'Home Equipment':
        return 'minimal';
      case 'Gym':
      case 'Mixed':
      default:
        return 'gym';
    }
  };

  // Step 2 Validation
  const handleValidateAbout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError('Please enter your name.');
      return;
    }
    const numAge = Number(age);
    if (!age || isNaN(numAge) || numAge < 14 || numAge > 100) {
      setValidationError('Please enter a valid age between 14 and 100.');
      return;
    }
    const numWeight = Number(weight);
    if (!weight || isNaN(numWeight) || numWeight < 30 || numWeight > 300) {
      setValidationError('Please enter a valid body weight.');
      return;
    }

    setValidationError(null);
    setStep('goal');
  };

  // Step 7: Call real API to generate 7-day workout plan
  const handleCreatePlan = async () => {
    setStep('generating');
    setIsSubmitting(true);
    setApiError(null);
    setGenerationPhase('Understanding your goal');

    const t1 = setTimeout(() => {
      setGenerationPhase('Building your 7-day workouts');
    }, 1200);

    const t2 = setTimeout(() => {
      setGenerationPhase('Preparing recovery guidance');
    }, 2400);

    const mappedEquipment = mapEquipmentToCategory(equipmentOption);
    const userId = initialUser.id || `FB-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const response = await fetch('/api/workouts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          username: name.trim() || 'Athlete',
          age: Number(age) || 26,
          weight: Number(weight) || 72,
          weightUnit,
          goal,
          skillLevel,
          equipment: mappedEquipment,
          sessionDuration: '45-60 min',
          focusAreas: ['Full Body'],
          injuryNotes: ''
        })
      });

      if (!response.ok) {
        throw new Error('Network error generating workout plan');
      }

      const data = await response.json();
      if (data.success && data.plan) {
        // Mark onboarding complete in storage
        try {
          localStorage.setItem('fitbuddy_onboarded', 'true');
        } catch (e) {}

        clearTimeout(t1);
        clearTimeout(t2);
        onComplete(data.plan, data.user);
      } else {
        throw new Error(data.error || 'Failed to create plan');
      }
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      clearTimeout(t1);
      clearTimeout(t2);
      setIsSubmitting(false);
      setApiError('Unable to generate your plan right now. Please check your connection and try again.');
    }
  };

  // Progress Stepper Indicators (Screen 2 through 6)
  const stepsList: OnboardingStep[] = ['about', 'goal', 'experience', 'equipment', 'summary'];
  const currentStepIndex = stepsList.indexOf(step);

  return (
    <div className="fixed inset-0 z-50 bg-[#07090e] text-[#f1f5f9] flex flex-col justify-between overflow-y-auto px-4 py-6 sm:py-10">
      {/* Top Navigation Row */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between gap-4">
        {step !== 'welcome' && step !== 'generating' ? (
          <button
            type="button"
            onClick={() => {
              if (step === 'about') setStep('welcome');
              else if (step === 'goal') setStep('about');
              else if (step === 'experience') setStep('goal');
              else if (step === 'equipment') setStep('experience');
              else if (step === 'summary') setStep('equipment');
            }}
            className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-400 hover:text-white transition px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        ) : (
          <div className="w-16" />
        )}

        {/* Step Progress Dots */}
        {currentStepIndex >= 0 && step !== 'generating' && (
          <div className="flex items-center gap-1.5">
            {stepsList.map((s, idx) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStepIndex
                    ? 'w-6 bg-emerald-400'
                    : idx < currentStepIndex
                    ? 'w-2 bg-emerald-500/50'
                    : 'w-2 bg-white/[0.1]'
                }`}
              />
            ))}
          </div>
        )}

        {onCancel && step !== 'generating' ? (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-mono text-slate-400 hover:text-white transition px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] cursor-pointer"
          >
            Cancel
          </button>
        ) : (
          <div className="w-16" />
        )}
      </div>

      {/* Main Screen Content Viewport */}
      <div className="w-full max-w-xl mx-auto my-auto py-6 sm:py-8">
        {/* ========================================================================= */}
        {/* SCREEN 1: WELCOME                                                         */}
        {/* ========================================================================= */}
        {step === 'welcome' && (
          <div className="text-center space-y-6 animate-in fade-in duration-500">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <Dumbbell className="w-7 h-7" />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                FITBUDDY ONBOARDING
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Let's build a plan that fits you.
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed">
                Your plan will be based on your goal, experience and workout preferences.
              </p>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => setStep('about')}
                className="w-full sm:w-auto min-w-[260px] py-4 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-sm sm:text-base transition-all shadow-xl shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2 mx-auto"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: ABOUT YOU                                                       */}
        {/* ========================================================================= */}
        {step === 'about' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Tell us about yourself
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Your biological parameters help personalize volume and recovery.
              </p>
            </div>

            {validationError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleValidateAbout} className="space-y-4">
              <div className="rounded-2xl p-5 sm:p-6 bg-[#0c1017] border border-white/[0.08] space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="e.g. Jordan Lee"
                    className="w-full rounded-xl bg-white/[0.03] border border-white/[0.1] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
                    autoFocus
                  />
                </div>

                {/* Age & Weight Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Age */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Age (Years)
                    </label>
                    <input
                      type="number"
                      min="14"
                      max="100"
                      value={age}
                      onChange={(e) => {
                        setAge(e.target.value ? Number(e.target.value) : '');
                        if (validationError) setValidationError(null);
                      }}
                      placeholder="e.g. 26"
                      className="w-full rounded-xl bg-white/[0.03] border border-white/[0.1] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Weight with Unit Switcher */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Body Weight
                      </label>
                      <div className="flex rounded-lg bg-black/50 p-0.5 border border-white/[0.08] text-[10px] font-mono">
                        <button
                          type="button"
                          onClick={() => setWeightUnit('kg')}
                          className={`px-2 py-0.5 rounded transition ${
                            weightUnit === 'kg' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
                          }`}
                        >
                          KG
                        </button>
                        <button
                          type="button"
                          onClick={() => setWeightUnit('lbs')}
                          className={`px-2 py-0.5 rounded transition ${
                            weightUnit === 'lbs' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
                          }`}
                        >
                          LBS
                        </button>
                      </div>
                    </div>
                    <input
                      type="number"
                      step="0.5"
                      min="30"
                      max="300"
                      value={weight}
                      onChange={(e) => {
                        setWeight(e.target.value ? Number(e.target.value) : '');
                        if (validationError) setValidationError(null);
                      }}
                      placeholder="e.g. 72"
                      className="w-full rounded-xl bg-white/[0.03] border border-white/[0.1] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: FITNESS GOAL                                                    */}
        {/* ========================================================================= */}
        {step === 'goal' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                What do you want to achieve?
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Choose your primary objective for this 7-day routine.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'Weight Loss',
                  title: 'Weight Loss',
                  desc: 'High-density metabolic circuits and active intervals to shed fat while maintaining muscle.',
                  icon: Flame,
                  accent: 'text-amber-400'
                },
                {
                  id: 'Muscle Gain',
                  title: 'Muscle Gain',
                  desc: 'Hypertrophy-focused volume and progressive tension to build lean muscle mass.',
                  icon: Dumbbell,
                  accent: 'text-emerald-400'
                },
                {
                  id: 'General Fitness',
                  title: 'General Fitness',
                  desc: 'Balanced athletic movement, full-body functionality, and daily energy.',
                  icon: HeartPulse,
                  accent: 'text-teal-400'
                },
                {
                  id: 'Strength',
                  title: 'Strength',
                  desc: 'Maximum neural force production, heavier loading, and compound multi-joint power.',
                  icon: Target,
                  accent: 'text-sky-400'
                },
                {
                  id: 'Endurance',
                  title: 'Endurance',
                  desc: 'Sustained stamina, aerobic threshold development, and muscular conditioning.',
                  icon: Sparkles,
                  accent: 'text-indigo-400'
                }
              ].map((item) => {
                const isSelected = goal === item.id;
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => setGoal(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-[#0c1017] border-white/[0.08] hover:border-white/[0.18]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : 'bg-white/[0.03] border-white/[0.06] text-slate-400'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setStep('experience')}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: EXPERIENCE                                                      */}
        {/* ========================================================================= */}
        {step === 'experience' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                How would you describe your experience?
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                This dictates the complexity, volume, and rest intervals of your routine.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'Beginner' as const,
                  title: 'Beginner',
                  desc: 'New to structured workouts',
                  details: 'Foundational movements, generous 75-90s rest intervals, focus on form safety.'
                },
                {
                  id: 'Intermediate' as const,
                  title: 'Intermediate',
                  desc: 'Comfortable with regular training',
                  details: 'Progressive overload, 60s rest periods, multi-planar compound sets.'
                },
                {
                  id: 'Advanced' as const,
                  title: 'Advanced',
                  desc: 'Experienced with structured training',
                  details: 'High training density, 45-60s rest, advanced exercise variations.'
                }
              ].map((tier) => {
                const isSelected = skillLevel === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setSkillLevel(tier.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-[#0c1017] border-white/[0.08] hover:border-white/[0.18]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {tier.title}
                        </h3>
                        <span className="text-xs text-emerald-400 font-medium">· {tier.desc}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-snug">{tier.details}</p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setStep('equipment')}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 5: EQUIPMENT                                                       */}
        {/* ========================================================================= */}
        {step === 'equipment' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                What do you have available?
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Exercises are strictly calibrated to match your chosen training environment.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'No Equipment' as const,
                  title: 'No Equipment',
                  desc: '100% bodyweight calisthenics leverage. Zero gym equipment required.'
                },
                {
                  id: 'Home Equipment' as const,
                  title: 'Home Equipment',
                  desc: 'Pair of dumbbells and resistance bands for compact home workouts.'
                },
                {
                  id: 'Gym' as const,
                  title: 'Gym',
                  desc: 'Full commercial gym access with barbells, cable machines, and benches.'
                },
                {
                  id: 'Mixed' as const,
                  title: 'Mixed',
                  desc: 'Combination of bodyweight mechanics and available free weights.'
                }
              ].map((opt) => {
                const isSelected = equipmentOption === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setEquipmentOption(opt.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-[#0c1017] border-white/[0.08] hover:border-white/[0.18]'
                    }`}
                  >
                    <div>
                      <h3 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {opt.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 leading-snug">{opt.desc}</p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setStep('summary')}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <span>REVIEW PLAN SUMMARY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 6: PLAN SUMMARY                                                    */}
        {/* ========================================================================= */}
        {step === 'summary' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                CONFIRMATION
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Ready to create your 7-day plan?
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Review your personalized training parameters below before synthesis.
              </p>
            </div>

            {apiError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Plan Generation Error</p>
                  <p>{apiError}</p>
                </div>
              </div>
            )}

            {/* Summary Card */}
            <div className="rounded-2xl p-6 bg-[#0c1017] border border-white/[0.08] divide-y divide-white/[0.06] text-xs">
              <div className="flex items-center justify-between pb-3">
                <span className="text-slate-400">Name</span>
                <span className="font-bold text-white text-sm">{name}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-400">Age</span>
                <span className="font-bold text-white font-mono">{age} years</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-400">Weight</span>
                <span className="font-bold text-white font-mono">
                  {weight} {weightUnit}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-400">Goal</span>
                <span className="font-bold text-emerald-400">{goal}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-400">Experience</span>
                <span className="font-bold text-white">{skillLevel}</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-400">Equipment</span>
                <span className="font-bold text-white">{equipmentOption}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreatePlan}
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50 text-slate-950 font-extrabold text-sm sm:text-base transition cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>CREATE MY PLAN</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 7: CALM CINEMATIC GENERATION                                       */}
        {/* ========================================================================= */}
        {step === 'generating' && (
          <div className="text-center space-y-6 py-12 animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <RefreshCw className="w-7 h-7 animate-spin text-emerald-400" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                FITBUDDY SYNTHESIS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Creating your plan
              </h2>
              <p className="text-sm font-medium text-slate-300 transition-all duration-300">
                {generationPhase}
              </p>
            </div>

            {/* Calm supporting steps checklist */}
            <div className="max-w-xs mx-auto space-y-2.5 text-left text-xs pt-4">
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Understanding your goal</span>
              </div>
              <div
                className={`flex items-center gap-2 transition-opacity duration-500 ${
                  generationPhase !== 'Understanding your goal'
                    ? 'opacity-100 text-slate-300'
                    : 'opacity-40 text-slate-500'
                }`}
              >
                <Check
                  className={`w-4 h-4 shrink-0 ${
                    generationPhase !== 'Understanding your goal' ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span>Building your 7-day workouts</span>
              </div>
              <div
                className={`flex items-center gap-2 transition-opacity duration-500 ${
                  generationPhase === 'Preparing recovery guidance'
                    ? 'opacity-100 text-slate-300'
                    : 'opacity-40 text-slate-500'
                }`}
              >
                <Check
                  className={`w-4 h-4 shrink-0 ${
                    generationPhase === 'Preparing recovery guidance'
                      ? 'text-emerald-400'
                      : 'text-slate-600'
                  }`}
                />
                <span>Preparing recovery guidance</span>
              </div>
            </div>

            {/* Recovery in case API stalls or errors */}
            {apiError && (
              <div className="pt-4 space-y-3">
                <p className="text-xs text-rose-300">{apiError}</p>
                <button
                  type="button"
                  onClick={handleCreatePlan}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs transition cursor-pointer"
                >
                  Retry Plan Creation
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Screen Footer Assurance */}
      <div className="w-full max-w-xl mx-auto text-center text-[10px] font-mono text-slate-500">
        FITBUDDY · Evidence-Based 7-Day Periodization
      </div>
    </div>
  );
}
