import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  Play, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  History,
  AlertCircle
} from 'lucide-react';
import { UserProfile, WorkoutPlan, WorkoutDay } from '../types';

interface MyPlanViewProps {
  plan: WorkoutPlan | null;
  user: UserProfile;
  onSelectDayAndStart: (dayIndex: number) => void;
  onBuildPlan: () => void;
  onOpenCoach: () => void;
  onPlanUpdated: (updatedPlan: WorkoutPlan) => void;
}

export default function MyPlanView({
  plan,
  user,
  onSelectDayAndStart,
  onBuildPlan,
  onOpenCoach,
  onPlanUpdated,
}: MyPlanViewProps) {
  // Plan version switcher: 'current' (updated if present) vs 'original'
  const [viewingVersion, setViewingVersion] = useState<'current' | 'original'>('current');
  const [completionsByDay, setCompletionsByDay] = useState<Record<number, number>>({});
  const [isLoadingCompletions, setIsLoadingCompletions] = useState<boolean>(true);

  // Fetch actual completions for current user from database
  useEffect(() => {
    if (!user.id) return;
    setIsLoadingCompletions(true);
    fetch(`/api/progress/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.completionsByDay) {
          setCompletionsByDay(data.completionsByDay);
        }
      })
      .catch((err) => console.error('Error loading plan completions:', err))
      .finally(() => setIsLoadingCompletions(false));
  }, [user.id, plan]);

  // Empty State (Section 14: No plan)
  if (!plan) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-[#0c1017] border border-white/[0.08] text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
          <Layers className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">You haven't created a plan yet.</h2>
          <p className="text-xs text-slate-400">
            Build a personalized 7-day fitness plan based on your goals and experience.
          </p>
        </div>
        <button
          type="button"
          onClick={onBuildPlan}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow"
        >
          <span>BUILD MY PLAN</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const activeRoutine: WorkoutDay[] = viewingVersion === 'original' 
    ? plan.originalPlan 
    : (plan.updatedPlan || plan.originalPlan);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="font-bold uppercase tracking-wider">MY 7-DAY PLAN</span>
            <span>·</span>
            <span className="text-slate-400">{user.goal}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Structured Periodization Schedule
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real completion states tracked from verified workout logs.
          </p>
        </div>

        {/* Original vs Updated Plan Switcher */}
        {plan.updatedPlan && (
          <div className="flex items-center p-0.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewingVersion('current')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                viewingVersion === 'current'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              UPDATED PLAN
            </button>
            <button
              type="button"
              onClick={() => setViewingVersion('original')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                viewingVersion === 'original'
                  ? 'bg-white/10 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ORIGINAL PLAN
            </button>
          </div>
        )}
      </div>

      {/* 7-DAY PLAN CARDS (Day 1 through Day 7) */}
      <div className="space-y-3.5">
        {activeRoutine.map((day, idx) => {
          const completedExercisesCount = completionsByDay[day.dayNumber] || 0;
          const totalExercises = day.main_workout.length;
          const isCompleted = completedExercisesCount >= 3;
          const isInProgress = completedExercisesCount > 0 && !isCompleted;

          return (
            <div
              key={idx}
              className={`p-5 sm:p-6 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isCompleted
                  ? 'bg-emerald-950/10 border-emerald-500/25 hover:border-emerald-500/40'
                  : isInProgress
                  ? 'bg-[#0c1017] border-amber-500/30'
                  : 'bg-[#0c1017] border-white/[0.08] hover:border-white/[0.16]'
              }`}
            >
              {/* Day info */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isCompleted 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-white/[0.04] text-slate-400'
                  }`}>
                    DAY {day.dayNumber}
                  </span>

                  {/* Completion State based strictly on stored data */}
                  {isCompleted ? (
                    <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed ({completedExercisesCount}/{totalExercises})
                    </span>
                  ) : isInProgress ? (
                    <span className="text-[11px] font-mono text-amber-400 font-bold">
                      In Progress ({completedExercisesCount}/{totalExercises})
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-500">
                      Scheduled ({totalExercises} exercises)
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight">
                  {day.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>Focus: <strong className="text-slate-200 font-medium">{day.focus}</strong></span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {user.sessionDuration || '45-60 min'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => onSelectDayAndStart(idx)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-sm ${
                    isCompleted
                      ? 'bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08]'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-emerald-500/10'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isCompleted ? 'REVIEW WORKOUT' : 'START WORKOUT'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
