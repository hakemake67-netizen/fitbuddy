import React from 'react';
import { 
  Sparkles, 
  Dumbbell, 
  Target, 
  Clock, 
  ChevronRight, 
  ArrowRight, 
  Mic, 
  Play, 
  Layers, 
  ShieldCheck, 
  Activity,
  HeartPulse,
  RotateCcw
} from 'lucide-react';
import { UserProfile, WorkoutPlan, ActiveWorkoutState } from '../types';

interface DashboardOverviewProps {
  user: UserProfile;
  plan: WorkoutPlan | null;
  activeWorkoutState: ActiveWorkoutState | null;
  onBuildPlan: () => void;
  onContinueWorkout: () => void;
  onViewPlan: () => void;
  onOpenCoach: () => void;
  onOpenDemoClass: (exerciseName: string) => void;
}

export default function DashboardOverview({
  user,
  plan,
  activeWorkoutState,
  onBuildPlan,
  onContinueWorkout,
  onViewPlan,
  onOpenCoach,
  onOpenDemoClass,
}: DashboardOverviewProps) {
  // Determine greeting based on local time
  const currentHour = new Date().getHours();
  const timeGreeting = currentHour < 12 
    ? 'Good morning' 
    : currentHour < 18 
    ? 'Good afternoon' 
    : 'Good evening';

  const activeRoutine = plan ? (plan.updatedPlan || plan.originalPlan) : [];

  // Determine current day for workout
  const currentDayIndex = activeWorkoutState?.dayNumber 
    ? Math.max(0, Math.min(activeWorkoutState.dayNumber - 1, activeRoutine.length - 1))
    : 0;

  const currentDay = activeRoutine[currentDayIndex] || activeRoutine[0] || null;

  // =========================================================================
  // SCENARIO A: USER HAS NO PLAN YET (Section 2)
  // =========================================================================
  if (!plan || activeRoutine.length === 0) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 py-6">
        {/* Welcome Hero Card */}
        <div className="rounded-3xl p-8 sm:p-12 border border-white/[0.08] bg-gradient-to-b from-[#0c121d] via-[#090d14] to-[#07090e] shadow-2xl relative overflow-hidden space-y-6">
          <div className="relative z-10 space-y-4 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
              GETTING STARTED
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome to FitBuddy.
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              Build a personalized 7-day fitness plan based on your goals and experience.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onBuildPlan}
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <span>BUILD MY PLAN</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Soft volumetric glow */}
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* Simple Explanation of what FitBuddy does (No fake stats, no fake testimonials) */}
        <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#0c1017] space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            How FitBuddy Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 font-mono font-bold flex items-center justify-center">
                1
              </div>
              <strong className="text-white block pt-1">Periodized 7-Day Plan</strong>
              <p className="text-slate-400 leading-relaxed">
                Structured workouts designed around your equipment, skill level, and primary fitness goal.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 font-mono font-bold flex items-center justify-center">
                2
              </div>
              <strong className="text-white block pt-1">Individual Demo Classes</strong>
              <p className="text-slate-400 leading-relaxed">
                Step-by-step form cues, breathing rhythms, and kinematic demonstrations for every movement.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 font-mono font-bold flex items-center justify-center">
                3
              </div>
              <strong className="text-white block pt-1">Adaptive Guidance</strong>
              <p className="text-slate-400 leading-relaxed">
                Adjust exercises based on joint comfort or fatigue while preserving your original plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCENARIO B: USER HAS AN ACTIVE PLAN (Section 3 & 4)
  // =========================================================================
  const hasInProgressSession = !!activeWorkoutState && activeWorkoutState.planId === plan.id;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* 1. Greeting & Current Goal */}
      <div className="border-b border-white/[0.08] pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {timeGreeting}, {user.username}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
            <span>Your current goal:</span>
            <span className="text-emerald-400 font-bold">{user.goal}</span>
            <span>·</span>
            <span className="capitalize">{user.equipment}</span>
          </div>
        </div>

        {plan.updatedPlan && (
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-auto font-semibold">
            Plan Updated with Feedback
          </span>
        )}
      </div>

      {/* 2. CURRENT PLAN CARD */}
      <div className="rounded-3xl p-6 sm:p-8 border border-white/[0.1] bg-[#0c1017] shadow-xl relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              CURRENT PLAN
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs font-mono text-slate-300 font-bold">
              Day {currentDay ? currentDay.dayNumber : 1} of 7
            </span>
          </div>

          {hasInProgressSession && (
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1.5 self-start sm:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              In Progress · Exercise {(activeWorkoutState?.exerciseIndex || 0) + 1}
            </span>
          )}
        </div>

        {currentDay && (
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {currentDay.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Focus: <span className="text-slate-200 font-medium">{currentDay.focus}</span>
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Estimated duration: {user.sessionDuration || '45-60 min'}</span>
              <span>·</span>
              <span>{currentDay.main_workout.length} Exercises</span>
            </div>
          </div>
        )}

        {/* Primary and Secondary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          {/* Primary: [ CONTINUE WORKOUT ] */}
          <button
            type="button"
            onClick={onContinueWorkout}
            className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>CONTINUE WORKOUT</span>
          </button>

          {/* Secondary: [ VIEW 7-DAY PLAN ] */}
          <button
            type="button"
            onClick={onViewPlan}
            className="px-5 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Layers className="w-4 h-4 text-slate-400" />
            <span>VIEW 7-DAY PLAN</span>
          </button>
        </div>
      </div>

      {/* 3. TODAY'S RECOVERY */}
      <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#0c1017] space-y-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
              TODAY'S RECOVERY
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Evidence-Based</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {currentDay?.recoveryGuidance || plan.nutritionTip || 'Prioritize 7.5 to 8.5 hours of uninterrupted sleep for neuromuscular recovery. Replenish electrolytes and maintain 1.8-2.0g protein per kg of bodyweight.'}
        </p>

        <p className="text-[11px] text-slate-500 italic pt-1">
          General guidance. Consult a medical provider or registered dietitian for specialized dietary requirements.
        </p>
      </div>

      {/* 4. COACH CALLOUT */}
      <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#0c1017] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block">
              COACH
            </span>
            <p className="text-sm font-bold text-white mt-0.5">
              Need help with today's workout?
            </p>
            <p className="text-xs text-slate-400">
              Ask about proper form cues, tempo, rest duration, or exercise regressions for {currentDay?.title || 'today\'s session'}.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCoach}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow self-start sm:self-center shrink-0"
        >
          <Mic className="w-4 h-4" />
          <span>TALK TO COACH</span>
        </button>
      </div>
    </div>
  );
}
