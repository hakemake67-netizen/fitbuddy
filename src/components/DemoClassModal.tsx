import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Wind, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Activity,
  User
} from 'lucide-react';
import ThreeRealisticHumanModel from './ThreeRealisticHumanModel';
import { ExerciseItem, AvatarProfile } from '../types';
import { getExerciseDemoData } from '../data/exerciseDatabase';

interface DemoClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  onStartExercise?: (exerciseName: string) => void;
  avatar?: AvatarProfile | null;
}

export default function DemoClassModal({ 
  isOpen, 
  onClose, 
  exerciseName,
  onStartExercise,
  avatar
}: DemoClassModalProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentPhase, setCurrentPhase] = useState<number>(0);

  const exercise: ExerciseItem = getExerciseDemoData(exerciseName);

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      setCurrentPhase(0);
    }
  }, [isOpen, exerciseName]);

  // Phase progression timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const phasesCount = exercise.movementPhases?.length || 3;
    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % phasesCount);
    }, 2400);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, exercise]);

  const handleStartDemo = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReplay = () => {
    setCurrentPhase(0);
    setIsPlaying(true);
  };

  if (!isOpen) return null;

  const currentPhaseData = exercise.movementPhases?.[currentPhase] || {
    phase: 'Movement In Progress',
    cue: exercise.form_cue
  };

  const howToPerform = exercise.howToPerform || {
    startingPosition: exercise.setupInstructions?.[0] || 'Assume athletic posture with core engaged.',
    movement: exercise.movementPhases?.[0]?.cue || 'Execute controlled concentric and eccentric cadence.',
    returnPosition: exercise.setupInstructions?.[1] || 'Return safely to starting position with full control.'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#090d14] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header: EXERCISE NAME, Target muscles, Equipment, Difficulty */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                {exercise.name} DEMO CLASS
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs font-mono text-slate-400">{exercise.equipment}</span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs font-mono text-emerald-400">{exercise.difficulty}</span>
              {avatar && (
                <>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30">
                    <User className="w-3 h-3" />
                    Personal 3D Avatar
                  </span>
                </>
              )}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <strong className="text-slate-300 font-medium">Target Muscles:</strong>
              <span>{exercise.targetMuscles.join(', ')}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
            aria-label="Close Demo Class"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* REALISTIC 3D HUMAN ATHLETE MODEL (THREE.JS) */}
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#070a11] h-[380px]">
            <ThreeRealisticHumanModel
              avatar={avatar}
              exerciseType={exercise.name}
              isPlaying={isPlaying}
              showControls={false}
              interactiveOrbit={true}
              className="w-full h-full"
            />

            {/* Visualizer HUD Overlays */}
            <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
              <span className="px-2.5 py-1 rounded-lg bg-black/80 border border-white/[0.1] text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5 backdrop-blur-md">
                <Activity className="w-3.5 h-3.5" />
                Realistic 3D Kinematics & Muscle Activation
              </span>
            </div>

            <div className="absolute top-3 right-3 pointer-events-none">
              <span className="px-2 py-1 rounded-lg bg-black/70 border border-white/10 text-[10px] font-mono text-slate-400 backdrop-blur-md">
                Drag to rotate 360°
              </span>
            </div>

            {/* Active Phase Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/85 border border-white/[0.1] rounded-xl px-4 py-2.5 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                    PHASE: {currentPhaseData.phase}
                  </span>
                  <p className="text-xs font-medium text-white">{currentPhaseData.cue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTROLS: [ START DEMO ] [ PAUSE ] [ REPLAY ] */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleStartDemo}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                isPlaying
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-white/[0.05] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-white/[0.08]'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START DEMO</span>
            </button>

            <button
              onClick={handlePause}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                !isPlaying
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08]'
              }`}
            >
              <Pause className="w-4 h-4" />
              <span>PAUSE</span>
            </button>

            <button
              onClick={handleReplay}
              className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REPLAY</span>
            </button>
          </div>

          {/* HOW TO PERFORM: 1. Starting position 2. Movement 3. Return position */}
          <div className="rounded-2xl p-5 bg-[#0c1017] border border-white/[0.08] space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              HOW TO PERFORM
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-white block mb-0.5">Starting Position</strong>
                  <p className="text-slate-300 leading-relaxed">{howToPerform.startingPosition}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-white block mb-0.5">Movement</strong>
                  <p className="text-slate-300 leading-relaxed">{howToPerform.movement}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-white block mb-0.5">Return Position</strong>
                  <p className="text-slate-300 leading-relaxed">{howToPerform.returnPosition}</p>
                </div>
              </div>
            </div>
          </div>

          {/* BREATHING & COACHING CUE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 bg-[#0c1017] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                <Wind className="w-4 h-4 text-sky-400" />
                <span>BREATHING</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {exercise.breathing || 'Inhale during the lowering (eccentric) phase; exhale during the pressing or lifting (concentric) effort.'}
              </p>
            </div>

            <div className="rounded-2xl p-5 bg-[#0c1017] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>COACHING CUE</span>
              </div>
              <p className="text-xs text-emerald-300 italic leading-relaxed">
                "{exercise.coachingCue || exercise.form_cue}"
              </p>
            </div>
          </div>

          {/* COMMON MISTAKE & SAFETY NOTE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 bg-rose-500/10 border border-rose-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>COMMON MISTAKE</span>
              </div>
              <ul className="space-y-1 text-xs text-rose-200">
                {exercise.commonMistakes?.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-400">·</span>
                    <span>{m}</span>
                  </li>
                )) || <li>Rushing tempo and losing abdominal tension.</li>}
              </ul>
            </div>

            <div className="rounded-2xl p-5 bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>SAFETY NOTE</span>
              </div>
              <p className="text-xs text-amber-200 leading-relaxed">
                {exercise.safetyNotes || 'Operate only within pain-free active joint range of motion.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions: [ START EXERCISE ] [ CLOSE ] */}
        <div className="px-6 py-4 border-t border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Unique Exercise Masterclass</span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {onStartExercise && (
              <button
                type="button"
                onClick={() => {
                  onStartExercise(exercise.name);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>START EXERCISE</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold text-xs transition cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
