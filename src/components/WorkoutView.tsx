import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Video, 
  Check, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  Activity, 
  History,
  ShieldCheck,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { UserProfile, WorkoutPlan, WorkoutDay, ExerciseItem, ActiveWorkoutState } from '../types';
import ActiveWorkoutSession from './ActiveWorkoutSession';

interface WorkoutViewProps {
  plan: WorkoutPlan;
  user: UserProfile;
  selectedDayIndex: number;
  onSelectDayIndex: (idx: number) => void;
  onOpenDemoClass: (exerciseName: string) => void;
  onOpenCoach: () => void;
  onPlanUpdated: (updatedPlan: WorkoutPlan) => void;
  initialSessionState?: ActiveWorkoutState | null;
  onSessionStateChange?: (state: ActiveWorkoutState | null) => void;
  initialOpenSession?: boolean;
}

export default function WorkoutView({
  plan,
  user,
  selectedDayIndex,
  onSelectDayIndex,
  onOpenDemoClass,
  onOpenCoach,
  onPlanUpdated,
  initialSessionState,
  onSessionStateChange,
  initialOpenSession = false,
}: WorkoutViewProps) {
  // Plan version toggle: 'current' (updated if exists) vs 'original'
  const [viewingVersion, setViewingVersion] = useState<'current' | 'original'>('current');
  const activeRoutine: WorkoutDay[] = viewingVersion === 'original' 
    ? plan.originalPlan 
    : (plan.updatedPlan || plan.originalPlan);

  const currentDay: WorkoutDay = activeRoutine[selectedDayIndex] || activeRoutine[0];

  // Active Focused Workout Session Modal
  const [isActiveSessionOpen, setIsActiveSessionOpen] = useState<boolean>(initialOpenSession);
  const [activeSessionStartIndex, setActiveSessionStartIndex] = useState<number>(
    initialSessionState?.exerciseIndex || 0
  );
  const [activeSessionStartSet, setActiveSessionStartSet] = useState<number>(
    initialSessionState?.currentSet || 1
  );

  useEffect(() => {
    if (initialOpenSession) {
      setIsActiveSessionOpen(true);
      if (initialSessionState) {
        setActiveSessionStartIndex(initialSessionState.exerciseIndex || 0);
        setActiveSessionStartSet(initialSessionState.currentSet || 1);
      }
    }
  }, [initialOpenSession, initialSessionState]);

  // Completion State Map (key: `${plan.id}-${dayNumber}-${exerciseId}`)
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  // Feedback State
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [isUpdatingPlan, setIsUpdatingPlan] = useState<boolean>(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Fetch real completion status for current user from backend
  useEffect(() => {
    fetch(`/api/progress/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.recentCompletions) {
          const map: Record<string, boolean> = {};
          data.recentCompletions.forEach((c: any) => {
            map[`${c.planId}-${c.dayNumber}-${c.exerciseId}`] = true;
          });
          setCompletedMap(map);
        }
      })
      .catch((err) => console.error('Error fetching completions:', err));
  }, [user.id, plan.id]);

  // Toggle exercise completion in real database
  const handleToggleCompletion = async (exercise: ExerciseItem) => {
    const key = `${plan.id}-${currentDay.dayNumber}-${exercise.id}`;
    const nextState = !completedMap[key];

    // Optimistic UI update
    setCompletedMap((prev) => ({ ...prev, [key]: nextState }));

    try {
      await fetch('/api/exercises/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          planId: plan.id,
          dayNumber: currentDay.dayNumber,
          exerciseId: exercise.id,
          exerciseName: exercise.name
        })
      });
    } catch (err) {
      console.error('Failed to save completion:', err);
    }
  };

  // Submit feedback to update the plan
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInput.trim() || isUpdatingPlan) return;

    setIsUpdatingPlan(true);
    setFeedbackSuccess(null);
    setFeedbackError(null);

    try {
      const response = await fetch('/api/workouts/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          feedback: feedbackInput.trim()
        })
      });

      const data = await response.json();
      if (data.success && data.plan) {
        onPlanUpdated(data.plan);
        setViewingVersion('current');
        setFeedbackSuccess('Your plan was updated based on your feedback. The original plan is preserved.');
        setFeedbackInput('');
      } else {
        throw new Error(data.error || 'Failed to update plan');
      }
    } catch (err: any) {
      console.error('Error updating plan:', err);
      setFeedbackError('Unable to update plan right now. Please try again.');
    } finally {
      setIsUpdatingPlan(false);
    }
  };

  const handleStartWorkout = (startIndex: number = 0) => {
    setActiveSessionStartIndex(startIndex);
    setIsActiveSessionOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ========================================================================= */}
      {/* 1. 7-DAY PLAN HEADER & DAY SELECTOR                                       */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
              YOUR 7-DAY PLAN
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              A personalized plan built around your goal and experience.
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

        {/* Day Selector (DAY 1 to DAY 7, horizontally scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
            const isSelected = selectedDayIndex === dayIdx;
            const dayItem = activeRoutine[dayIdx];
            return (
              <button
                key={dayIdx}
                type="button"
                onClick={() => onSelectDayIndex(dayIdx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-md'
                    : 'bg-[#0c1017] text-slate-300 hover:text-white border-white/[0.08] hover:border-white/[0.18]'
                }`}
              >
                DAY {dayIdx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DAY WORKOUT CONTENT (SHOW ONLY SELECTED DAY)                           */}
      {/* ========================================================================= */}
      {currentDay && (
        <div className="space-y-6">
          {/* Day Title & Focus Header */}
          <div className="rounded-2xl p-6 bg-[#0c1017] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <span className="font-bold">DAY {currentDay.dayNumber} OF 7</span>
                <span>·</span>
                <span className="text-slate-400">{user.sessionDuration} Duration</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{currentDay.title}</h2>
              <p className="text-xs text-slate-400">{currentDay.focus}</p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => handleStartWorkout(0)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START WORKOUT</span>
              </button>

              <button
                type="button"
                onClick={onOpenCoach}
                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs transition cursor-pointer"
                title="Consult Live Coach"
              >
                <Activity className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* WARM-UP */}
          <div className="rounded-2xl p-5 bg-[#0c1017] border border-white/[0.08] space-y-1.5">
            <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider block">
              WARM-UP
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{currentDay.warm_up}</p>
          </div>

          {/* EXERCISES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block">
                EXERCISES ({currentDay.main_workout.length})
              </span>
              <span className="text-xs text-slate-500">Tap Demo to inspect 3D kinematics</span>
            </div>

            <div className="space-y-3">
              {currentDay.main_workout.map((exercise, idx) => {
                const key = `${plan.id}-${currentDay.dayNumber}-${exercise.id}`;
                const isDone = !!completedMap[key];

                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isDone
                        ? 'bg-black/30 border-white/[0.04] opacity-65'
                        : 'bg-[#0c1017] border-white/[0.08] hover:border-white/[0.16]'
                    }`}
                  >
                    {/* Exercise Details */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-base font-bold truncate ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                          {exercise.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-400 capitalize">
                          {exercise.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono flex-wrap">
                        <span className="text-emerald-400 font-bold">{exercise.sets} sets</span>
                        <span>·</span>
                        <span>{exercise.reps_or_duration}</span>
                        <span>·</span>
                        <span>{exercise.rest} rest</span>
                        <span>·</span>
                        <span className="text-slate-500">{exercise.targetMuscles.join(', ')}</span>
                      </div>

                      <p className="text-xs text-slate-300 italic pt-0.5">
                        "{exercise.form_cue}"
                      </p>
                    </div>

                    {/* Actions: [ DEMO ] [ START ] [ COMPLETE ] */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {/* [ DEMO ] */}
                      <button
                        type="button"
                        onClick={() => onOpenDemoClass(exercise.name)}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5 text-emerald-400" />
                        <span>DEMO</span>
                      </button>

                      {/* [ START ] */}
                      <button
                        type="button"
                        onClick={() => handleStartWorkout(idx)}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-white/[0.08] text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current text-emerald-400" />
                        <span>START</span>
                      </button>

                      {/* [ COMPLETE ] */}
                      <button
                        type="button"
                        onClick={() => handleToggleCompletion(exercise)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950 shadow-md'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08]'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>{isDone ? 'COMPLETED' : 'COMPLETE'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COOL-DOWN */}
          <div className="rounded-2xl p-5 bg-[#0c1017] border border-white/[0.08] space-y-1.5">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider block">
              COOL-DOWN
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{currentDay.cool_down}</p>
          </div>

          {/* RECOVERY */}
          <div className="rounded-2xl p-5 bg-[#0c1017] border border-white/[0.08] space-y-1.5">
            <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider block">
              RECOVERY
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentDay.recoveryGuidance || 'Hydrate with electrolyte water and ensure 7.5 to 8.5 hours of uninterrupted sleep for tissue remodeling.'}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 14. NUTRITION & RECOVERY                                                  */}
      {/* ========================================================================= */}
      <div className="rounded-2xl p-6 bg-[#0c1017] border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
              NUTRITION & RECOVERY
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Practical Guidance</span>
          </div>
          <span className="text-[11px] text-slate-500">General Guidance</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          {plan.nutritionTip}
        </p>

        <p className="text-[11px] text-slate-500 italic">
          General nutrition guidance. Consult a medical or healthcare provider for specialized dietary requirements.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 15. FEEDBACK & UPDATE MY PLAN                                             */}
      {/* ========================================================================= */}
      <div className="rounded-2xl p-6 bg-[#0c1017] border border-white/[0.08] space-y-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider block">
            HOW DID THIS PLAN FEEL?
          </span>
          <p className="text-xs text-slate-400 mt-1">
            Provide feedback on exercise difficulty, joint comfort, or time constraints to generate an updated plan while keeping your original plan safe.
          </p>
        </div>

        <form onSubmit={handleFeedbackSubmit} className="space-y-3">
          <textarea
            rows={3}
            value={feedbackInput}
            onChange={(e) => setFeedbackInput(e.target.value)}
            placeholder="Tell FitBuddy what you'd like to change... (e.g. My knees hurt on lunges, please substitute with single-leg glute bridges; or make Day 2 lighter)."
            className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] p-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition resize-none"
          />

          {feedbackSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              {feedbackSuccess}
            </div>
          )}

          {feedbackError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{feedbackError}</span>
            </div>
          )}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={!feedbackInput.trim() || isUpdatingPlan}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>{isUpdatingPlan ? 'Updating Plan...' : 'UPDATE MY PLAN'}</span>
            </button>
          </div>
        </form>

        {/* Feedback History Logs */}
        {plan.feedbackHistory && plan.feedbackHistory.length > 0 && (
          <div className="pt-3 border-t border-white/[0.06] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <History className="w-3.5 h-3.5 text-emerald-400" />
              <span>Plan Revisions ({plan.feedbackHistory.length})</span>
            </div>
            <div className="space-y-2">
              {plan.feedbackHistory.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs space-y-0.5">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Feedback: "{item.feedback}"</span>
                    <span>{new Date(item.appliedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-300 text-xs">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Focused Active Workout Session Modal */}
      <ActiveWorkoutSession
        isOpen={isActiveSessionOpen}
        onClose={() => setIsActiveSessionOpen(false)}
        day={currentDay}
        planId={plan.id}
        userId={user.id}
        initialExerciseIndex={activeSessionStartIndex}
        initialSetNumber={activeSessionStartSet}
        onOpenDemo={onOpenDemoClass}
        onOpenCoach={onOpenCoach}
        onSessionStateChange={onSessionStateChange}
        onExerciseCompleted={(exerciseId) => {
          const key = `${plan.id}-${currentDay.dayNumber}-${exerciseId}`;
          setCompletedMap((prev) => ({ ...prev, [key]: true }));
        }}
      />
    </div>
  );
}
