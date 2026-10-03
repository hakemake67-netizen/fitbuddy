import React, { useState } from 'react';
import { 
  Dumbbell, 
  Sparkles, 
  Target, 
  Layers, 
  Clock, 
  ShieldCheck, 
  User, 
  ChevronRight,
  ArrowRight,
  Flame,
  Check
} from 'lucide-react';
import { UserProfile, WorkoutPlan } from '../types';
import { GOALS_EDUCATION, FOCUS_AREAS_EDUCATION } from '../data/exerciseDatabase';

interface PlanGeneratorProps {
  initialUser: UserProfile;
  onPlanCreated: (plan: WorkoutPlan, user: UserProfile) => void;
  onSelectExerciseDemo: (exerciseName: string) => void;
  onLaunchGuidedOnboarding?: () => void;
}

export default function PlanGenerator({ 
  initialUser, 
  onPlanCreated, 
  onSelectExerciseDemo,
  onLaunchGuidedOnboarding 
}: PlanGeneratorProps) {
  const [username, setUsername] = useState<string>(initialUser.username || 'Alex Morgan');
  const [userId, setUserId] = useState<string>(initialUser.id || 'FB-1049');
  const [age, setAge] = useState<number | ''>(initialUser.age || 26);
  const [weight, setWeight] = useState<number | ''>(initialUser.weight || 72);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(initialUser.weightUnit || 'kg');

  // Goals
  const [goal, setGoal] = useState<string>(initialUser.goal || 'Muscle Gain');
  // Equipment
  const [equipment, setEquipment] = useState<'gym' | 'bodyweight' | 'minimal'>(initialUser.equipment || 'gym');
  // Skill Level
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(initialUser.skillLevel || 'Intermediate');
  // Session Duration
  const [sessionDuration, setSessionDuration] = useState<string>(initialUser.sessionDuration || '45-60 min');
  // Focus Areas
  const [focusAreas, setFocusAreas] = useState<string[]>(initialUser.focusAreas || ['Chest', 'Back', 'Legs', 'Core']);
  // Injury Notes
  const [injuryNotes, setInjuryNotes] = useState<string>(initialUser.injuryNotes || '');

  // Loading State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Calibrating athlete biometrics...');

  const handleToggleFocus = (area: string) => {
    if (focusAreas.includes(area)) {
      if (focusAreas.length > 1) {
        setFocusAreas(focusAreas.filter((a) => a !== area));
      }
    } else {
      setFocusAreas([...focusAreas, area]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setStatusMessage('Analyzing biometrics and physiological constraints...');

    setTimeout(() => {
      setStatusMessage('Synthesizing 7-day periodization routine with Gemini AI...');
    }, 700);

    setTimeout(() => {
      setStatusMessage('Configuring rest intervals, warm-ups, and recovery protocols...');
    }, 1400);

    try {
      const response = await fetch('/api/workouts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'FB-1001',
          username: username || 'Athlete',
          age: Number(age) || 26,
          weight: Number(weight) || 72,
          weightUnit,
          goal,
          skillLevel,
          equipment,
          sessionDuration,
          focusAreas,
          injuryNotes
        })
      });

      const data = await response.json();
      if (data.success && data.plan) {
        onPlanCreated(data.plan, data.user);
      } else {
        throw new Error(data.error || 'Failed to generate plan');
      }
    } catch (err) {
      console.error('Plan creation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedGoalData = GOALS_EDUCATION[goal] || GOALS_EDUCATION['Muscle Gain'];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Banner inspired by the reference mobile screenshot */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-white/[0.08] bg-gradient-to-r from-emerald-950/20 via-white/[0.02] to-transparent backdrop-blur-xl overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI WORKOUT GENERATOR</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Build Your 7-Day Custom Training Routine
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Configure your physiological baseline, available gear, and target objectives. FitBuddy designs a periodized, evidence-based program calibrated to your schedule.
          </p>

          {onLaunchGuidedOnboarding && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onLaunchGuidedOnboarding}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition cursor-pointer"
              >
                <span>Launch Step-by-Step Guided Setup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Subtle radial ambient light */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Athlete Biometrics */}
        <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#0c1017] space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white">1. Athlete Profile & Biometrics</h2>
            </div>
            <span className="text-xs font-mono text-slate-500">STEP 1 OF 4</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Athlete Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="e.g. Alex Morgan"
                className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Athlete ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                placeholder="e.g. FB-1049"
                className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Age (Years)</label>
              <input
                type="number"
                min="14"
                max="99"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                required
                className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">Body Weight</label>
                <div className="flex rounded-lg bg-black/40 p-0.5 border border-white/[0.08] text-[10px]">
                  <button
                    type="button"
                    onClick={() => setWeightUnit('kg')}
                    className={`px-2 py-0.5 rounded ${weightUnit === 'kg' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                  >
                    KG
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightUnit('lbs')}
                    className={`px-2 py-0.5 rounded ${weightUnit === 'lbs' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
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
                onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
                required
                className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Primary Goal Selection */}
        <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#0c1017] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2.5">
              <Target className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white">2. Primary Fitness Objective</h2>
            </div>
            <span className="text-xs font-mono text-slate-500">STEP 2 OF 4</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { id: 'Muscle Gain', title: 'Muscle Gain', desc: 'Hypertrophy, progressive tension, and volume accumulation.' },
              { id: 'Weight Loss', title: 'Weight Loss', desc: 'Metabolic density, calorie expenditure, and muscle preservation.' },
              { id: 'Strength', title: 'Strength', desc: 'Maximum force output, low reps, and central neural adaptation.' },
              { id: 'General Fitness', title: 'General Fitness', desc: 'Longevity, cardiovascular baseline, and functional balance.' },
              { id: 'Endurance', title: 'Endurance', desc: 'Aerobic threshold, high stamina, and mitochondrial adaptation.' }
            ].map((g) => {
              const isSelected = goal === g.id;
              return (
                <div
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                      {g.title}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{g.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Goal Educational Preview Card */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-400">Scientific Focus for {selectedGoalData.title}</span>
              <span className="text-slate-500 text-[11px]">Recommended Principles</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedGoalData.explanation}</p>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-white/[0.04]">
              <strong>Focus:</strong> {selectedGoalData.focus}
            </div>
          </div>
        </div>

        {/* Section 3: Equipment & Skill Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Equipment Selection */}
          <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#0c1017] space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-3">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white">3. Available Equipment</h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'gym' as const,
                  title: 'Full Commercial Gym',
                  desc: 'Barbells, power racks, dumbbells, cable stations, and machines.'
                },
                {
                  id: 'bodyweight' as const,
                  title: 'Zero Equipment (Calisthenics)',
                  desc: '100% floor-based bodyweight mechanics and gravity leverage.'
                },
                {
                  id: 'minimal' as const,
                  title: 'Minimal Home Kit',
                  desc: 'Pair of dumbbells and resistance loop/tube bands.'
                }
              ].map((eq) => {
                const isSelected = equipment === eq.id;
                return (
                  <div
                    key={eq.id}
                    onClick={() => setEquipment(eq.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 shadow-sm'
                        : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.15]'
                    }`}
                  >
                    <div>
                      <span className={`text-xs font-bold block ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                        {eq.title}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{eq.desc}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skill Level & Session Duration */}
          <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#0c1017] space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-3">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Skill Level & Duration</h2>
            </div>

            {/* Skill Level */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">Experience Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Beginner' as const, label: 'Beginner', rest: '75-90s rest' },
                  { id: 'Intermediate' as const, label: 'Intermediate', rest: '60-75s rest' },
                  { id: 'Advanced' as const, label: 'Advanced', rest: '45-60s rest' }
                ].map((tier) => {
                  const isSelected = skillLevel === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSkillLevel(tier.id)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer text-center ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block font-bold">{tier.label}</span>
                      <span className="text-[10px] opacity-70 block">{tier.rest}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Session Duration */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">Target Session Time</label>
              <div className="grid grid-cols-4 gap-2">
                {['30 min', '45 min', '60 min', '75 min'].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setSessionDuration(dur)}
                    className={`py-2 rounded-xl border text-xs font-mono font-medium transition cursor-pointer ${
                      sessionDuration === dur
                        ? 'bg-emerald-500 text-slate-950 font-bold border-transparent'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Focus Areas & Injury Notes */}
        <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#0c1017] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white">4. Focus Groups & Safety Guardrails</h2>
            </div>
            <span className="text-xs font-mono text-slate-500">STEP 4 OF 4</span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">Target Focus Areas (Select multiple)</label>
            <div className="flex flex-wrap gap-2">
              {['Full Body', 'Chest', 'Back', 'Arms', 'Legs', 'Core', 'Mobility'].map((area) => {
                const isSelected = focusAreas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => handleToggleFocus(area)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition border cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {area}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-medium text-slate-300">
              Injury Guardrails or Health Notes (Optional)
            </label>
            <input
              type="text"
              value={injuryNotes}
              onChange={(e) => setInjuryNotes(e.target.value)}
              placeholder="e.g. Protect lower back, avoid deep dips, avoid heavy overhead loading"
              className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] disabled:opacity-50 text-slate-950 font-extrabold text-sm transition-all shadow-xl flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 fill-current" />
          <span>{isGenerating ? 'Generating 7-Day Plan...' : 'Create My 7-Day Workout Plan'}</span>
        </button>
      </form>

      {/* Generation Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#090d14] border border-white/[0.1] p-8 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold block">
                GENERATING WORKOUT PLAN
              </span>
              <h3 className="text-base font-bold text-white mt-1">{statusMessage}</h3>
            </div>
            <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-2/3 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400">
              Calibrating periodized volume for {goal} ({equipment.toUpperCase()})
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
