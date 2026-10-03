import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Dumbbell } from 'lucide-react';
import scene1GymBg from '../assets/images/cinematic_gym_intro_1791003553281.jpg';
import scene2ExerciseBg from '../assets/images/athlete_exercise_scene_1791004587730.jpg';

interface CinematicOnboardingProps {
  onComplete: () => void;
}

export default function CinematicOnboarding({ onComplete }: CinematicOnboardingProps) {
  // Current elapsed time in seconds (0 to 20)
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);

  // Audio Context & Synth references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicIntervalRef = useRef<any>(null);

  // ---------------------------------------------------------------------------
  // 1. TIMELINE PROGRESSION (20 SECONDS TOTAL: SCENE 1: 0-10s, SCENE 2: 10-20s)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setSecondsElapsed(elapsed);

      // Auto-transition to main app after 20 seconds
      if (elapsed >= 20) {
        clearInterval(interval);
        handleFinish();
      }
    }, 100);

    return () => {
      clearInterval(interval);
      stopAudioMusic();
    };
  }, []);

  const handleFinish = () => {
    setIsExiting(true);
    stopAudioMusic();
    setTimeout(() => {
      try {
        localStorage.setItem('fitbuddy_intro_seen', 'true');
      } catch (e) {}
      onComplete();
    }, 600);
  };

  const handleSkip = () => {
    setIsExiting(true);
    stopAudioMusic();
    setTimeout(() => {
      try {
        localStorage.setItem('fitbuddy_intro_seen', 'true');
      } catch (e) {}
      onComplete();
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // 2. GUITAR-BASED MOTIVATIONAL CINEMATIC MUSIC SYNTHESIZER (WEB AUDIO API)
  // ---------------------------------------------------------------------------
  const playGuitarNote = (ctx: AudioContext, freq: number, time: number, duration: number = 2.4) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Warm triangle/saw mix for acoustic/clean electric guitar pluck
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    // Filter envelope for guitar string pluck attack and harmonic decay
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, time);
    filter.frequency.exponentialRampToValueAtTime(380, time + duration);

    // Gain envelope with immediate pluck attack and natural ringing decay
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.18, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  };

  const startAudioMusic = async () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      setIsAudioEnabled(true);
      const ctx = audioCtxRef.current;

      // Motivational Guitar Arpeggio chords: Em9 -> Cmaj7 -> G -> Dadd9
      const chordNotes = [
        [164.81, 246.94, 329.63, 392.00, 493.88], // Em9 (E3, B3, E4, G4, B4)
        [130.81, 196.00, 261.63, 329.63, 493.88], // Cmaj7 (C3, G3, C4, E4, B4)
        [196.00, 246.94, 293.66, 392.00, 587.33], // G (G3, B3, D4, G4, D5)
        [146.83, 220.00, 293.66, 369.99, 440.00], // Dadd9 (D3, A3, D4, F#4, A4)
      ];

      let chordIndex = 0;
      let noteIndex = 0;

      const schedulePattern = () => {
        if (!ctx || ctx.state !== 'running') return;
        const now = ctx.currentTime;
        const currentChord = chordNotes[chordIndex];
        const freq = currentChord[noteIndex % currentChord.length];

        playGuitarNote(ctx, freq, now, 2.2);

        noteIndex++;
        if (noteIndex % currentChord.length === 0) {
          chordIndex = (chordIndex + 1) % chordNotes.length;
        }
      };

      // Play note every 450ms for calm, inspiring fingerpicked tempo
      musicIntervalRef.current = setInterval(schedulePattern, 450);
      schedulePattern();
    } catch (err) {
      console.warn('Audio autoplay policy restriction handled smoothly:', err);
      setIsAudioEnabled(false);
    }
  };

  const stopAudioMusic = () => {
    if (musicIntervalRef.current) {
      clearInterval(musicIntervalRef.current);
      musicIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    setIsAudioEnabled(false);
  };

  const toggleSound = () => {
    if (isAudioEnabled) {
      stopAudioMusic();
    } else {
      startAudioMusic();
    }
  };

  // Determine current scene: 0–10s = Scene 1; 10–20s = Scene 2
  const isScene2 = secondsElapsed >= 10;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#05070b] text-[#f1f5f9] flex flex-col justify-between overflow-hidden transition-opacity duration-700 select-none ${
        isExiting ? 'opacity-0 scale-98 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* --------------------------------------------------------------------- */}
      {/* TOP CONTROLS: Brand badge, Sound Toggle, Skip Intro                   */}
      {/* --------------------------------------------------------------------- */}
      <div className="relative z-30 w-full px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs shadow-sm">
            <Dumbbell className="w-4 h-4" />
          </div>
          <span className="text-sm font-extrabold tracking-widest text-white uppercase font-mono">
            FITBUDDY
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Toggle (Respects autoplay policies cleanly) */}
          <button
            type="button"
            onClick={toggleSound}
            className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-300 hover:text-white transition px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] cursor-pointer"
            title={isAudioEnabled ? 'Mute Music' : 'Enable Motivational Guitar Sound'}
          >
            {isAudioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sound: On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>Sound: Off</span>
              </>
            )}
          </button>

          {/* Skip Intro Button */}
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-mono font-medium text-slate-300 hover:text-white transition px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] cursor-pointer"
          >
            Skip Intro
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* CINEMATIC VISUAL VIEWPORT (SCENE 1: 0-10s | SCENE 2: 10-20s)         */}
      {/* --------------------------------------------------------------------- */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 w-full max-w-5xl mx-auto my-auto">
        {/* Full-width Cinema Visual Frame */}
        <div className="relative w-full aspect-[16/9] max-h-[380px] sm:max-h-[460px] rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl bg-[#090d14]">
          {/* SCENE 1 IMAGE (0 to 10s: Athlete preparing in modern gym) */}
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${
              !isScene2 ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={scene1GymBg}
              alt="Gym Environment Preparation"
              className="w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.05] motion-safe:scale-105 motion-safe:transition-transform motion-safe:duration-[10000ms] motion-safe:ease-out motion-safe:scale-110"
            />
            {/* Cinematic Gradient Vignettes */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-transparent to-black/40 pointer-events-none" />
            <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70 pointer-events-none" />
          </div>

          {/* SCENE 2 IMAGE (10 to 20s: Athlete performing controlled exercise) */}
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isScene2 ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={scene2ExerciseBg}
              alt="Athlete Performing Controlled Workout"
              className="w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.05] motion-safe:scale-105 motion-safe:transition-transform motion-safe:duration-[10000ms] motion-safe:ease-out motion-safe:scale-110"
            />
            {/* Cinematic Gradient Vignettes */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-transparent to-black/40 pointer-events-none" />
            <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70 pointer-events-none" />
          </div>

          {/* Discreet brand watermark */}
          <div className="absolute bottom-4 left-5 z-20 text-[11px] font-mono tracking-wider text-slate-400/80">
            fitbuddy
          </div>

          {/* Subtle overhead emerald rim light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent blur-sm z-20" />
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* CINEMATIC STORYTELLING TYPOGRAPHY                                  */}
        {/* ------------------------------------------------------------------- */}
        <div className="w-full max-w-xl text-center space-y-3 pt-6 sm:pt-8 min-h-[140px] flex flex-col justify-center">
          {/* Scene 1 Headline (0 to 10s) */}
          {!isScene2 && (
            <div className="transition-all duration-1000 animate-fadeIn space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                PHASE 01 · FOUNDATION
              </span>
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
                START WHERE YOU ARE.
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                Consistency begins with a single deliberate step.
              </p>
            </div>
          )}

          {/* Scene 2 Headline & Reveal (10 to 20s) */}
          {isScene2 && (
            <div className="transition-all duration-1000 animate-fadeIn space-y-2">
              {secondsElapsed < 15 ? (
                <>
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                    PHASE 02 · PROGRESSION
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
                    BUILD YOUR BETTER ROUTINE.
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 font-mono">
                    Strength, movement, and intelligent guidance.
                  </p>
                </>
              ) : (
                /* 15 to 20s: Final Brand Reveal */
                <div className="space-y-1.5 animate-fadeIn">
                  <div className="text-2xl sm:text-4xl font-black tracking-widest text-emerald-400 font-mono uppercase">
                    FITBUDDY
                  </div>
                  <p className="text-sm sm:text-base text-slate-200 font-medium">
                    Your fitness. Your plan. Your pace.
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    Entering your personal training space...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 20-SECOND PROGRESS TIMELINE BAR (Scene 1: 0-10s | Scene 2: 10-20s)    */}
      {/* --------------------------------------------------------------------- */}
      <div className="w-full max-w-2xl mx-auto px-6 pb-6 space-y-2">
        <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-400 transition-all duration-100 ease-linear"
            style={{ width: `${Math.min(100, (secondsElapsed / 20) * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span className={!isScene2 ? 'text-emerald-400 font-bold' : ''}>
            Scene 1: Preparation (0–10s)
          </span>
          <span className={isScene2 ? 'text-emerald-400 font-bold' : ''}>
            Scene 2: Execution & Routine (10–20s)
          </span>
        </div>
      </div>
    </div>
  );
}
