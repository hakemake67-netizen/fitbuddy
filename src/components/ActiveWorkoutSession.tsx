import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Check, 
  RotateCcw, 
  FastForward, 
  Video, 
  Activity, 
  Dumbbell, 
  CheckCircle2, 
  Timer,
  Clock,
  ArrowRight
} from 'lucide-react';
import { WorkoutDay, ExerciseItem, ActiveWorkoutState } from '../types';

interface ActiveWorkoutSessionProps {
  isOpen: boolean;
  onClose: () => void;
  day: WorkoutDay;
  planId: string;
  userId: string;
  initialExerciseIndex?: number;
  initialSetNumber?: number;
  onOpenDemo: (exerciseName: string) => void;
  onOpenCoach: () => void;
  onExerciseCompleted: (exerciseId: string) => void;
  onSessionStateChange?: (state: ActiveWorkoutState | null) => void;
}

export default function ActiveWorkoutSession({
  isOpen,
  onClose,
  day,
  planId,
  userId,
  initialExerciseIndex = 0,
  initialSetNumber = 1,
  onOpenDemo,
  onOpenCoach,
  onExerciseCompleted,
  onSessionStateChange,
}: ActiveWorkoutSessionProps) {
  const exercises = day.main_workout || [];
  const [exerciseIndex, setExerciseIndex] = useState<number>(initialExerciseIndex);
  const [currentSet, setCurrentSet] = useState<number>(initialSetNumber);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Rest Timer State
  const [isResting, setIsResting] = useState<boolean>(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState<number>(60);
  const [initialRestDuration, setInitialRestDuration] = useState<number>(60);

  // Day Completion State
  const [isDayComplete, setIsDayComplete] = useState<boolean>(false);
  const [sessionDurationSecs, setSessionDurationSecs] = useState<number>(0);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);

  const timerRef = useRef<any>(null);

  // Initialize when opened
  useEffect(() => {
    if (isOpen) {
      setExerciseIndex(Math.min(initialExerciseIndex, exercises.length - 1));
      setCurrentSet(initialSetNumber || 1);
      setIsPaused(false);
      setIsResting(false);
      setIsDayComplete(false);
      setSessionDurationSecs(0);
      setCompletedExerciseIds([]);
    }
  }, [isOpen, initialExerciseIndex, initialSetNumber, day]);

  // Persist session state for "CONTINUE WORKOUT"
  useEffect(() => {
    if (!isOpen) return;

    if (isDayComplete) {
      // Day completed - clear active session state
      onSessionStateChange?.(null);
      try {
        localStorage.removeItem(`fitbuddy_session_${userId}`);
        fetch(`/api/users/${userId}/session-state`, { method: 'DELETE' }).catch(() => {});
      } catch (e) {}
      return;
    }

    const curEx = exercises[exerciseIndex];
    const totalS = curEx ? parseInt(curEx.sets.match(/\d+/)?.[0] || '3', 10) : 3;
    const sessionState: ActiveWorkoutState = {
      userId,
      planId,
      dayNumber: day.dayNumber,
      exerciseIndex,
      exerciseName: curEx?.name || 'Exercise',
      currentSet,
      totalSets: totalS,
      isPaused,
      sessionDurationSecs,
      lastUpdated: new Date().toISOString()
    };

    onSessionStateChange?.(sessionState);
    try {
      localStorage.setItem(`fitbuddy_session_${userId}`, JSON.stringify(sessionState));
      fetch(`/api/users/${userId}/session-state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionState)
      }).catch(() => {});
    } catch (e) {}
  }, [isOpen, exerciseIndex, currentSet, isPaused, isDayComplete, day.dayNumber, planId, userId]);

  // Session duration timer
  useEffect(() => {
    let interval: any = null;
    if (isOpen && !isPaused && !isDayComplete) {
      interval = setInterval(() => {
        setSessionDurationSecs((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isPaused, isDayComplete]);

  // Rest Interval Countdown Timer
  useEffect(() => {
    if (isResting && !isPaused && restSecondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishRestInterval();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isResting, isPaused, restSecondsLeft]);

  const currentExercise: ExerciseItem | undefined = exercises[exerciseIndex];
  const totalSets = currentExercise ? parseInt(currentExercise.sets.match(/\d+/)?.[0] || '3', 10) : 3;

  // Handles completion of set or exercise
  const handleCompleteSetOrExercise = async () => {
    if (!currentExercise) return;

    // Parse configured rest period from exercise (e.g. "60 seconds" -> 60)
    const match = currentExercise.rest.match(/\d+/);
    const secs = match ? parseInt(match[0], 10) : 60;

    // Check if this completes the whole exercise
    const isLastSet = currentSet >= totalSets;

    if (isLastSet) {
      // Persist completion to real backend database
      try {
        await fetch('/api/exercises/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            planId,
            dayNumber: day.dayNumber,
            exerciseId: currentExercise.id,
            exerciseName: currentExercise.name
          })
        });
        onExerciseCompleted(currentExercise.id);
        setCompletedExerciseIds((prev) => [...prev, currentExercise.id]);
      } catch (err) {
        console.error('Failed to save completion:', err);
      }
    }

    // Check if whole day is complete
    if (isLastSet && exerciseIndex >= exercises.length - 1) {
      setIsDayComplete(true);
      return;
    }

    // Enter Rest State
    setInitialRestDuration(secs);
    setRestSecondsLeft(secs);
    setIsResting(true);
  };

  const finishRestInterval = () => {
    setIsResting(false);
    if (currentSet < totalSets) {
      setCurrentSet((prev) => prev + 1);
    } else {
      if (exerciseIndex < exercises.length - 1) {
        setExerciseIndex((prev) => prev + 1);
        setCurrentSet(1);
      } else {
        setIsDayComplete(true);
      }
    }
  };

  const handleSkipRest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    finishRestInterval();
  };

  const handleAddRestTime = (seconds: number) => {
    setRestSecondsLeft((prev) => prev + seconds);
    setInitialRestDuration((prev) => prev + seconds);
  };

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07090e]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0a0d14] border border-white/[0.1] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                {day.day} · {day.title}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Session Time: {formatTime(sessionDurationSecs)}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
            aria-label="Exit Workout Session"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col justify-between space-y-6">
          {/* ========================================================================= */}
          {/* SCREEN: DAY COMPLETE                                                      */}
          {/* ========================================================================= */}
          {isDayComplete ? (
            <div className="text-center space-y-6 py-6 animate-in fade-in duration-500">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  SESSION CONCLUDED
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  DAY COMPLETE
                </h2>
                <p className="text-sm text-slate-300 max-w-sm mx-auto">
                  You have successfully completed all prescribed movements for {day.day}.
                </p>
              </div>

              {/* Verified Workout Summary (No fake statistics) */}
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left text-xs">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Exercises</span>
                  <span className="text-lg font-bold text-white mt-0.5 block">
                    {exercises.length} of {exercises.length}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Duration</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono mt-0.5 block">
                    {formatTime(sessionDurationSecs)}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 max-w-md mx-auto">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block mb-1">
                  POST-WORKOUT RECOVERY
                </span>
                <p>{day.recoveryGuidance || 'Hydrate with 500ml water and refuel with lean protein.'}</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto min-w-[240px] py-3.5 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition cursor-pointer mx-auto block shadow-lg"
              >
                Return to Plan
              </button>
            </div>
          ) : isResting ? (
            /* ========================================================================= */
            /* SCREEN: REST TIMER COUNTDOWN                                              */
            /* ========================================================================= */
            <div className="text-center space-y-6 py-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  RECOVERY INTERVAL
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  REST
                </h3>
                <p className="text-xs text-slate-400">
                  Allow ATP stores to replenish before your next effort.
                </p>
              </div>

              {/* Large Countdown Display */}
              <div className="py-4">
                <div className="font-mono text-5xl sm:text-6xl font-black text-emerald-400 tracking-tight">
                  {formatTime(restSecondsLeft)}
                </div>
                {/* Progress bar */}
                <div className="w-48 sm:w-64 h-1.5 bg-white/[0.08] rounded-full mx-auto mt-4 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-1000"
                    style={{
                      width: `${Math.max(0, (restSecondsLeft / initialRestDuration) * 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Next Exercise Preview */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] max-w-sm mx-auto text-xs text-left">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Up Next:</span>
                <span className="font-bold text-white text-sm block mt-0.5">
                  {currentSet < totalSets
                    ? `${currentExercise?.name} (Set ${currentSet + 1} of ${totalSets})`
                    : exercises[exerciseIndex + 1]?.name || 'Next Exercise'}
                </span>
              </div>

              {/* Rest Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-bold text-xs transition cursor-pointer border border-white/[0.08]"
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </button>

                <button
                  type="button"
                  onClick={() => handleAddRestTime(15)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-bold text-xs transition cursor-pointer border border-white/[0.08]"
                >
                  +15s
                </button>

                <button
                  type="button"
                  onClick={handleSkipRest}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <span>SKIP REST</span>
                  <FastForward className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          ) : currentExercise ? (
            /* ========================================================================= */
            /* SCREEN: CURRENT EXERCISE SET EXECUTION                                    */
            /* ========================================================================= */
            <div className="space-y-6">
              {/* Exercise Step Tracker */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>
                  EXERCISE {exerciseIndex + 1} OF {exercises.length}
                </span>
                <span className="text-emerald-400 font-semibold">
                  SET {currentSet} OF {totalSets}
                </span>
              </div>

              {/* Main Exercise Card */}
              <div className="rounded-2xl p-6 bg-[#0e121a] border border-white/[0.08] space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold uppercase">
                      {currentExercise.category}
                    </span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-400">{currentExercise.targetMuscles.join(', ')}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {currentExercise.name}
                  </h3>
                </div>

                {/* Prescription Grid */}
                <div className="grid grid-cols-3 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Current Set</span>
                    <span className="text-base font-bold text-white font-mono mt-0.5 block">
                      {currentSet} / {totalSets}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Reps / Duration</span>
                    <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block truncate">
                      {currentExercise.reps_or_duration}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Target Rest</span>
                    <span className="text-base font-bold text-white font-mono mt-0.5 block">
                      {currentExercise.rest}
                    </span>
                  </div>
                </div>

                {/* Form Cue */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                    FORM INSTRUCTION
                  </span>
                  <p className="text-slate-200 leading-relaxed italic">
                    "{currentExercise.form_cue}"
                  </p>
                </div>
              </div>

              {/* Auxiliary Affordances: Demo Class & Coach Consultation */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onOpenDemo(currentExercise.name)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Demo Class</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenCoach}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Ask Coach About This</span>
                </button>
              </div>

              {/* Main Actions: PAUSE & COMPLETE */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="px-4 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCompleteSetOrExercise}
                  className="flex-1 py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-extrabold text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>
                    {currentSet < totalSets
                      ? `COMPLETE SET ${currentSet} & REST`
                      : `COMPLETE EXERCISE & REST`}
                  </span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
