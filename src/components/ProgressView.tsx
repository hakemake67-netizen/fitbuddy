import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  History, 
  Clock, 
  Dumbbell, 
  Layers, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { UserProfile, WorkoutPlan, WorkoutHistoryItem } from '../types';

interface ProgressViewProps {
  user: UserProfile;
  plan: WorkoutPlan | null;
  onNavigateToWorkout: () => void;
}

export default function ProgressView({ user, plan, onNavigateToWorkout }: ProgressViewProps) {
  const [data, setData] = useState<{
    totalCompletionsCount: number;
    completedDaysCount: number;
    totalPlanDays: number;
    completionsByDay: Record<number, number>;
    workoutHistory: WorkoutHistoryItem[];
    planHistory: Array<{ feedback: string; appliedAt: string; note: string }>;
  } | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = () => {
    setIsLoading(true);
    setError(null);
    fetch(`/api/progress/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load progress data');
        return res.json();
      })
      .then((resData) => {
        setData(resData);
      })
      .catch((err) => {
        console.error('Error fetching progress:', err);
        setError("We couldn't load your progress.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProgress();
  }, [user.id, plan]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-6 animate-pulse">
        <div className="h-20 bg-white/[0.03] rounded-2xl border border-white/[0.06]" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-24 bg-white/[0.03] rounded-2xl" />
          <div className="h-24 bg-white/[0.03] rounded-2xl" />
          <div className="h-24 bg-white/[0.03] rounded-2xl" />
        </div>
        <div className="h-48 bg-white/[0.03] rounded-2xl" />
      </div>
    );
  }

  // Error State (Section 15: Error states with [ TRY AGAIN ])
  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-[#0c1017] border border-white/[0.08] text-center space-y-4">
        <p className="text-sm text-slate-300">{error}</p>
        <button
          type="button"
          onClick={fetchProgress}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
        >
          TRY AGAIN
        </button>
      </div>
    );
  }

  const workoutsCompleted = data?.completedDaysCount || 0;
  const exercisesCompleted = data?.totalCompletionsCount || 0;
  const totalDays = data?.totalPlanDays || 7;
  const consistencyRate = Math.round((workoutsCompleted / totalDays) * 100);
  const workoutHistory = data?.workoutHistory || [];
  const planHistory = data?.planHistory || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-5">
        <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
          PERFORMANCE & ADHERENCE
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Progress
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Objective record of completed workouts, exercise volume, and plan revisions.
        </p>
      </div>

      {/* ======================================================================= */}
      {/* 7. PROGRESS - THIS WEEK & CURRENT PLAN SECTIONS                         */}
      {/* ======================================================================= */}
      <div className="space-y-4">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block">
          THIS WEEK
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Workouts completed */}
          <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-1">
            <span className="text-xs text-slate-400 font-medium">Workouts Completed</span>
            <div className="text-3xl font-extrabold text-white mt-1">
              {workoutsCompleted}
              <span className="text-sm text-slate-500 font-normal"> / {totalDays}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 block">Scheduled 7-day periodization</span>
          </div>

          {/* Exercises completed */}
          <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-1">
            <span className="text-xs text-slate-400 font-medium">Exercises Completed</span>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1">
              {exercisesCompleted}
            </div>
            <span className="text-[11px] font-mono text-slate-500 block">Verified exercise logs</span>
          </div>

          {/* Consistency */}
          <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-1">
            <span className="text-xs text-slate-400 font-medium">Consistency</span>
            <div className="text-3xl font-extrabold text-white mt-1">
              {consistencyRate}%
            </div>
            <span className="text-[11px] font-mono text-slate-500 block">
              {workoutsCompleted === 0 ? 'No sessions logged yet' : `${workoutsCompleted} of ${totalDays} days finished`}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 8. PROGRESS VISUALIZATION - 7-DAY COMPLETION TIMELINE                   */}
      {/* ======================================================================= */}
      <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#0c1017] space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              7-Day Completion Timeline
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Day {Math.min(workoutsCompleted + 1, 7)} of 7
          </span>
        </div>

        {/* 7-Day Completion Timeline */}
        <div className="grid grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
            const count = data?.completionsByDay?.[dayNum] || 0;
            const isFinished = count >= 3;
            const hasStarted = count > 0 && !isFinished;

            return (
              <div
                key={dayNum}
                className={`p-3 rounded-xl border text-center transition flex flex-col justify-between items-center h-24 ${
                  isFinished
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : hasStarted
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-500'
                }`}
              >
                <span className="font-mono text-xs font-bold">Day {dayNum}</span>

                {isFinished ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 my-auto" />
                ) : hasStarted ? (
                  <span className="text-[11px] font-mono text-amber-400 font-bold my-auto">
                    {count} logged
                  </span>
                ) : (
                  <span className="text-sm text-slate-600 my-auto">—</span>
                )}

                <span className="text-[10px] font-mono opacity-70">
                  {isFinished ? 'Completed' : hasStarted ? 'Active' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 6. WORKOUT HISTORY                                                      */}
      {/* ======================================================================= */}
      <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#0c1017] space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Workout History
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {workoutHistory.length} Recorded
          </span>
        </div>

        {workoutHistory.length > 0 ? (
          <div className="space-y-2.5">
            {workoutHistory.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400 font-bold">
                      {item.date}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      Day {item.dayNumber}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {item.exercisesCompleted} of {item.totalExercises} exercises logged
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State (Section 14: No history) */
          <div className="p-8 text-center space-y-3">
            <p className="text-xs text-slate-400">
              No workouts completed yet.
            </p>
            <button
              type="button"
              onClick={onNavigateToWorkout}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              Start Your First Workout
            </button>
          </div>
        )}
      </div>

      {/* ======================================================================= */}
      {/* 7. PLAN HISTORY & UPDATED PLANS                                         */}
      {/* ======================================================================= */}
      <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#0c1017] space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Updated Plans & Feedback History
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {planHistory.length} Revisions
          </span>
        </div>

        {planHistory.length > 0 ? (
          <div className="space-y-3">
            {planHistory.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-emerald-400 font-semibold">Feedback Revision #{idx + 1}</span>
                  <span>{new Date(item.appliedAt).toLocaleDateString()}</span>
                </div>
                <p className="text-white font-medium italic">"{item.feedback}"</p>
                <p className="text-slate-300 leading-relaxed pt-1">{item.note}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 p-4">
            Original plan is currently active without feedback-based adaptations.
          </p>
        )}
      </div>
    </div>
  );
}
