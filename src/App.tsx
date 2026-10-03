import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Database, 
  RefreshCw, 
  Sliders, 
  Search, 
  Check, 
  Terminal, 
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  User,
  Clock,
  Sparkles,
  Shuffle,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Plus,
  Volume2,
  VolumeX,
  Video,
  Mic,
  GraduationCap,
  SlidersHorizontal,
  CheckCircle2,
  Info,
  X,
  Trophy,
  Zap,
  Flame,
  Award,
  Dumbbell
} from 'lucide-react';
import VideoDemoClassModal from './VideoDemoClassModal';
import XpLevelModal from './XpLevelModal';
import LevelUpCelebrationModal from './LevelUpCelebrationModal';
import LiveAiTestModal from './LiveAiTestModal';
import EquipmentComparisonModal from './EquipmentComparisonModal';
import { 
  calculateLevelFromXp, 
  playXpGainChime, 
  playLevelUpFanfare, 
  XpHistoryEntry 
} from './xpSystem';
import { 
  EquipmentType, 
  EQUIPMENT_OPTIONS, 
  detectEquipmentCategory, 
  findAlternativeExercise, 
  getAdaptive7DayPlan, 
  EXERCISE_EQUIVALENTS,
  ExerciseItem
} from './equipmentExercises';

interface DayExercise {
  exercise_name: string;
  sets: string;
  reps_or_duration: string;
  rest: string;
  equipment_needed?: string;
  equipment_category?: EquipmentType;
  form_cue?: string;
  target_muscle?: string;
}

interface DayPlan {
  day: string;
  focus: string;
  warm_up: string;
  main_workout: DayExercise[];
  cool_down: string;
}

interface StoredWorkout {
  id: number;
  userId: string;
  username: string;
  age: number;
  weight: number;
  goal: string;
  intensity: string;
  equipment?: EquipmentType;
  originalPlan: string;
  updatedPlan: string | null;
  nutritionTip: string;
  createdAt: string;
}

/**
 * Cinematic Motion Graphics Canvas: Interactive Biometric Harmonic Curves, Particle Constellations & Chromatic Waves
 */
function CinematicMotionCanvas({ accentRgb }: { accentRgb: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rgbRef = useRef<string>(accentRgb);

  useEffect(() => {
    rgbRef.current = accentRgb;
  }, [accentRgb]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let width = 0;
    let height = 0;
    let animId = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const mouse = { x: width * 0.5, y: height * 0.35, tx: width * 0.5, ty: height * 0.35 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Biometric Nodes
    const particles = Array.from({ length: 36 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.8,
      alpha: Math.random() * 0.45 + 0.15,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      pulse: Math.random() * Math.PI * 2
    }));

    let time = 0;
    const render = () => {
      time += 0.009;
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;

      ctx.clearRect(0, 0, width, height);

      const activeRgb = rgbRef.current || '142, 230, 193';

      // 1. Kinetic Radial Cursor Illumination
      const cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 380);
      cursorGlow.addColorStop(0, `rgba(${activeRgb}, 0.06)`);
      cursorGlow.addColorStop(0.5, `rgba(${activeRgb}, 0.015)`);
      cursorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = cursorGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Harmonic Biometric Waves (Sine Ribbons)
      for (let w = 0; w < 4; w++) {
        ctx.beginPath();
        const yOffset = height * (0.28 + w * 0.16) + Math.sin(time * 0.4 + w * 1.2) * 22;
        const amp = 32 + w * 12;
        const freq = 0.0018 - w * 0.00025;

        ctx.moveTo(0, yOffset);
        for (let x = 0; x <= width; x += 16) {
          const dist = Math.hypot(x - mouse.x, yOffset - mouse.y);
          const influence = Math.max(0, 1 - dist / 420) * 26 * Math.sin(time * 2.2 + w);
          const y = yOffset + Math.sin(x * freq + time * 1.1 + w * 1.5) * amp + influence;
          ctx.lineTo(x, y);
        }

        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, `rgba(${activeRgb}, 0)`);
        gradient.addColorStop(0.25, `rgba(${activeRgb}, ${0.12 - w * 0.025})`);
        gradient.addColorStop(0.7, `rgba(${activeRgb}, ${0.07 - w * 0.015})`);
        gradient.addColorStop(1, `rgba(${activeRgb}, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = w === 0 ? 1.6 : 1.1;
        ctx.stroke();
      }

      // 3. Connective Constellation Laser Lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.16;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${activeRgb}, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // 4. Drifting Biometric Nodes with Pulsing Core
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.03;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentR = p.r + Math.sin(p.pulse) * 0.4;
        const currentAlpha = p.alpha + Math.sin(p.pulse) * 0.1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${activeRgb}, ${currentAlpha * 0.75})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-75"
      aria-hidden="true"
    />
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'result' | 'admin' | 'deployment'>('home');

  // Scrolltide.co Curated Spectrum of High-End Athletic & Tech Palettes
  const RANDOM_PALETTES = [
    { name: "Mint Emerald", hex: "#8ee6c1", rgb: "142, 230, 193" },
    { name: "Cyan Pulse", hex: "#22d3ee", rgb: "34, 211, 238" },
    { name: "Electric Cobalt", hex: "#38bdf8", rgb: "56, 189, 248" },
    { name: "Hyper Violet", hex: "#c084fc", rgb: "192, 132, 252" },
    { name: "Solar Amber", hex: "#fbbf24", rgb: "251, 191, 36" },
    { name: "Crimson Apex", hex: "#fb7185", rgb: "251, 113, 133" },
    { name: "Neon Lime", hex: "#a3e635", rgb: "163, 230, 53" },
    { name: "Luminous Fuchsia", hex: "#e879f9", rgb: "232, 121, 249" },
    { name: "Plasma Orange", hex: "#fb923c", rgb: "251, 146, 60" },
    { name: "Electric Teal", hex: "#2dd4bf", rgb: "45, 212, 191" },
    { name: "Deep Azure", hex: "#60a5fa", rgb: "96, 165, 250" },
    { name: "Radiant Coral", hex: "#f43f5e", rgb: "244, 63, 94" },
    { name: "Aurora Green", hex: "#34d399", rgb: "52, 211, 153" },
    { name: "Laser Gold", hex: "#facc15", rgb: "250, 204, 21" }
  ];

  const [currentPaletteIndex, setCurrentPaletteIndex] = useState<number>(0);
  const [paletteName, setPaletteName] = useState<string>('Mint Emerald');
  const [currentAccentHex, setCurrentAccentHex] = useState<string>('#8ee6c1');
  const [accentRgb, setAccentRgb] = useState<string>('142, 230, 193');
  const [isShufflingColor, setIsShufflingColor] = useState<boolean>(false);

  const applyColorPalette = (hex: string, rgb: string, name?: string) => {
    setCurrentAccentHex(hex);
    setAccentRgb(rgb);
    if (name) setPaletteName(name);

    document.documentElement.style.setProperty('--accent', hex);
    document.documentElement.style.setProperty('--accent-rgb', rgb);
    document.documentElement.style.setProperty('--accent-hover', hex);
    document.documentElement.style.setProperty('--accent-soft', `rgba(${rgb}, 0.14)`);
    document.documentElement.style.setProperty('--accent-border', `rgba(${rgb}, 0.35)`);
    document.documentElement.style.setProperty('--accent-glow', `rgba(${rgb}, 0.25)`);

    try {
      localStorage.setItem('fitbuddy_random_color', JSON.stringify({ hex, rgb, name: name || 'Custom' }));
    } catch (e) {}
  };

  const changeRandomColor = () => {
    setIsShufflingColor(true);
    setTimeout(() => setIsShufflingColor(false), 500);

    let nextIdx = Math.floor(Math.random() * RANDOM_PALETTES.length);
    if (nextIdx === currentPaletteIndex && RANDOM_PALETTES.length > 1) {
      nextIdx = (nextIdx + 1) % RANDOM_PALETTES.length;
    }
    setCurrentPaletteIndex(nextIdx);
    const chosen = RANDOM_PALETTES[nextIdx];
    applyColorPalette(chosen.hex, chosen.rgb, chosen.name);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fitbuddy_random_color');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.hex && parsed.rgb) {
          applyColorPalette(parsed.hex, parsed.rgb, parsed.name);
          return;
        }
      }
    } catch (e) {}
    applyColorPalette(RANDOM_PALETTES[0].hex, RANDOM_PALETTES[0].rgb, RANDOM_PALETTES[0].name);
  }, []);

  // Scrolltide.co Signature Scroll Dynamics & Section Reveal Observer
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      });

      const elements = document.querySelectorAll('.scrolltide-reveal, .scrolltide-slide-up');
      elements.forEach(el => observer?.observe(el));
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer?.disconnect();
    };
  }, [activeTab]);

  // =========================================================================
  // VOICE COACH ENGINE (Full App Voice Synthesis & Audible Guidance)
  // =========================================================================
  const COACH_PERSONAS = [
    { id: 'Jax', name: 'Coach Jax', specialty: 'Tactical Strength', tagline: 'Decisive & Focused Form Direction', pitch: 0.95, rate: 1.0 },
    { id: 'Maya', name: 'Coach Maya', specialty: 'Kinetic Flow', tagline: 'Smooth Biomechanics & Breath Control', pitch: 1.1, rate: 1.05 },
    { id: 'Selene', name: 'Coach Selene', specialty: 'Mobility & Form', tagline: 'Calm & Methodical Joint Alignment', pitch: 1.0, rate: 0.95 },
    { id: 'Vance', name: 'Coach Vance', specialty: 'High Intensity', tagline: 'High Energy Motivation & Drive', pitch: 1.05, rate: 1.12 }
  ];

  const [isVoiceCoachEnabled, setIsVoiceCoachEnabled] = useState<boolean>(true);
  const [coachPersonaId, setCoachPersonaId] = useState<string>('Jax');
  const [isCoachSpeaking, setIsCoachSpeaking] = useState<boolean>(false);
  const [currentCoachSpeech, setCurrentCoachSpeech] = useState<string | null>(null);
  const [showCoachMenu, setShowCoachMenu] = useState<boolean>(false);
  const speechTimeoutRef = useRef<any>(null);

  // Active persona object
  const activeCoach = COACH_PERSONAS.find(p => p.id === coachPersonaId) || COACH_PERSONAS[0];

  // Global speak function with browser Web Speech API & live subtitle ticker
  const speakCoach = (text: string, force = true) => {
    // Show subtitle pill in UI
    setCurrentCoachSpeech(text);
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => {
      setCurrentCoachSpeech(null);
    }, 6500);

    if (!isVoiceCoachEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      if (force) {
        window.speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = activeCoach.pitch;
      utterance.rate = activeCoach.rate;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        if (activeCoach.id === 'Maya' || activeCoach.id === 'Selene') {
          const female = voices.find(v => v.lang.startsWith('en') && (
            v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Zira') || v.name.includes('Karen')
          ));
          if (female) utterance.voice = female;
        } else {
          const male = voices.find(v => v.lang.startsWith('en') && (
            v.name.includes('Male') || v.name.includes('Daniel') || v.name.includes('Alex') || v.name.includes('David') || v.name.includes('George')
          ));
          if (male) utterance.voice = male;
        }
      }

      utterance.onstart = () => setIsCoachSpeaking(true);
      utterance.onend = () => setIsCoachSpeaking(false);
      utterance.onerror = () => setIsCoachSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error(e);
      setIsCoachSpeaking(false);
    }
  };

  // =========================================================================
  // SCALABLE XP & LEVEL PROGRESSION STATE
  // =========================================================================
  const [totalXp, setTotalXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('fitbuddy_total_xp');
      return saved ? parseInt(saved, 10) : 180;
    } catch (e) {
      return 180;
    }
  });

  const [xpHistory, setXpHistory] = useState<XpHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('fitbuddy_xp_history');
      return saved ? JSON.parse(saved) : [
        { id: '1', source: 'Initial Onboarding Calibration', amount: 100, timestamp: 'Today' },
        { id: '2', source: 'Form Technique Drill', amount: 80, timestamp: 'Today' }
      ];
    } catch (e) {
      return [];
    }
  });

  const [floatingXpTokens, setFloatingXpTokens] = useState<{ id: string; amount: number; text: string }[]>([]);
  const [isXpModalOpen, setIsXpModalOpen] = useState<boolean>(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState<boolean>(false);
  const [newUnlockedLevel, setNewUnlockedLevel] = useState<number>(2);
  const [isAiTestModalOpen, setIsAiTestModalOpen] = useState<boolean>(false);

  const currentLevelStats = calculateLevelFromXp(totalXp);

  const grantXp = (amount: number, source: string) => {
    const oldLevel = calculateLevelFromXp(totalXp).level;
    const nextTotalXp = totalXp + amount;
    const newStats = calculateLevelFromXp(nextTotalXp);

    setTotalXp(nextTotalXp);
    try {
      localStorage.setItem('fitbuddy_total_xp', String(nextTotalXp));
    } catch (e) {}

    // Add entry to history
    const newEntry: XpHistoryEntry = {
      id: Math.random().toString(36).substring(2, 9),
      source,
      amount,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const nextHistory = [newEntry, ...xpHistory.slice(0, 19)];
    setXpHistory(nextHistory);
    try {
      localStorage.setItem('fitbuddy_xp_history', JSON.stringify(nextHistory));
    } catch (e) {}

    // Floating visual XP token
    const tokenId = Math.random().toString(36).substring(2, 9);
    setFloatingXpTokens(prev => [...prev, { id: tokenId, amount, text: source }]);
    setTimeout(() => {
      setFloatingXpTokens(prev => prev.filter(t => t.id !== tokenId));
    }, 2000);

    // Audio and Voice feedback
    if (newStats.level > oldLevel) {
      playLevelUpFanfare();
      setNewUnlockedLevel(newStats.level);
      setIsLevelUpModalOpen(true);
      speakCoach(`Level Up! Outstanding dedication! You have achieved Level ${newStats.level}: ${newStats.rank.title}!`);
    } else {
      playXpGainChime();
    }
  };

  // Video Demo Class State
  const [isVideoDemoOpen, setIsVideoDemoOpen] = useState<boolean>(false);
  const [videoDemoExercise, setVideoDemoExercise] = useState<string>('Barbell Bench Press');

  const openVideoDemoClass = (exerciseName: string) => {
    setVideoDemoExercise(exerciseName);
    setIsVideoDemoOpen(true);
    speakCoach(`Generating interactive video demo class for ${exerciseName}. Setting up biomechanical kinematics.`);
    grantXp(60, `${exerciseName} Video Demo Class`);
  };

  // Built-in Stopwatch & Rest Interval Timer State (For Daily Workout View)
  const [timerMode, setTimerMode] = useState<'rest' | 'stopwatch'>('rest');
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [timerDuration, setTimerDuration] = useState<number>(60);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [activeExerciseResting, setActiveExerciseResting] = useState<string | null>(null);
  const [restJustCompleted, setRestJustCompleted] = useState<boolean>(false);

  // Helper to extract numeric seconds from strings like "75 seconds", "60 sec", "45s"
  const parseRestSeconds = (restStr: string): number => {
    const match = restStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 60;
  };

  // Web Audio API Gentle Sound Beep when Rest Finishes
  const playRestCompleteChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1175, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  };

  // Timer Tick Effect with Voice Coaching Milestones
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        if (timerMode === 'rest') {
          setTimerSeconds((prev) => {
            // Halfway voice cue
            if (timerDuration >= 30 && prev === Math.floor(timerDuration / 2)) {
              speakCoach(`Halfway through rest. ${prev} seconds to go. Keep your breathing steady.`, false);
            }
            // 10s warning
            if (prev === 10) {
              speakCoach('10 seconds remaining. Step up and lock in your grip.', false);
            }
            // 3, 2, 1 countdown
            if (prev === 3) speakCoach('Three', false);
            if (prev === 2) speakCoach('Two', false);
            if (prev === 1) speakCoach('One', false);

            if (prev <= 1) {
              setIsTimerActive(false);
              setRestJustCompleted(true);
              playRestCompleteChime();
              speakCoach(`Rest complete! Time to crush your next set of ${activeExerciseResting || 'exercises'}!`, true);
              grantXp(15, 'Rest Interval Discipline');
              return 0;
            }
            return prev - 1;
          });
        } else {
          // Stopwatch mode: announce milestones
          setTimerSeconds((prev) => {
            const next = prev + 1;
            if (next === 60) speakCoach('One minute active work elapsed.', false);
            if (next === 120) speakCoach('Two minutes active work elapsed. Pacing looks strong.', false);
            return next;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerMode, timerDuration, activeExerciseResting]);

  const startExerciseRest = (exerciseName: string, restStr: string) => {
    const secs = parseRestSeconds(restStr);
    setTimerMode('rest');
    setTimerDuration(secs);
    setTimerSeconds(secs);
    setActiveExerciseResting(exerciseName);
    setIsTimerActive(true);
    setRestJustCompleted(false);
    speakCoach(`Rest timer initiated: ${secs} seconds for ${exerciseName}. Breathe deeply and recover.`);
  };

  const handleToggleTimer = () => {
    if (timerMode === 'rest' && timerSeconds === 0) {
      setTimerSeconds(timerDuration);
      setRestJustCompleted(false);
      setIsTimerActive(true);
      speakCoach(`Starting ${timerDuration} seconds rest countdown.`);
    } else {
      const willBeActive = !isTimerActive;
      setIsTimerActive(willBeActive);
      if (willBeActive) {
        speakCoach('Rest resumed.');
      } else {
        speakCoach('Timer paused.');
      }
    }
  };

  const handleResetTimer = () => {
    setIsTimerActive(false);
    setRestJustCompleted(false);
    if (timerMode === 'rest') {
      setTimerSeconds(timerDuration);
      speakCoach(`Timer reset to ${timerDuration} seconds.`);
    } else {
      setTimerSeconds(0);
      speakCoach('Stopwatch reset to zero.');
    }
  };

  const handleAdd15s = () => {
    setTimerSeconds((prev) => prev + 15);
    if (timerMode === 'rest') {
      setTimerDuration((prev) => prev + 15);
    }
    speakCoach('15 seconds added to rest interval.');
  };

  const setPresetRest = (secs: number) => {
    setTimerMode('rest');
    setTimerDuration(secs);
    setTimerSeconds(secs);
    setIsTimerActive(true);
    setRestJustCompleted(false);
    speakCoach(`Rest countdown set to ${secs} seconds.`);
  };

  const formatTimerDisplay = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  // Form State
  const [userId, setUserId] = useState('FB-1049');
  const [username, setUsername] = useState('Jordan Lee');
  const [age, setAge] = useState<number | ''>(26);
  const [weight, setWeight] = useState<number | ''>(72.0);
  const [goal, setGoal] = useState('Muscle Gain');
  const [intensity, setIntensity] = useState('Intermediate');
  const [userEquipment, setUserEquipment] = useState<EquipmentType>('gym');
  const [showEquipmentMatrixModal, setShowEquipmentMatrixModal] = useState<boolean>(false);
  const [swappingExerciseKey, setSwappingExerciseKey] = useState<string | null>(null);
  
  // Loading & Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('Analyzing profile');
  const [generationProgress, setGenerationProgress] = useState(25);
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingStep, setUpdatingStep] = useState('Reviewing your request');
  const [updatingProgress, setUpdatingProgress] = useState(30);

  // Professional Progress State (No Fake Gamification/XP)
  const [completedDays, setCompletedDays] = useState<number[]>([1]);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [completedDayNumber, setCompletedDayNumber] = useState<number>(1);

  // Active Generated Plan
  const [activeDays, setActiveDays] = useState<DayPlan[]>([
    {
      day: 'Day 1 – Upper Body Push',
      focus: 'Chest, Shoulders & Triceps (Hypertrophy)',
      warm_up: '8 min dynamic arm circles, shoulder band pull-aparts, push-up walkouts',
      main_workout: [
        { exercise_name: 'Incline Dumbbell Bench Press', sets: '3', reps_or_duration: '10-12 reps', rest: '75 seconds' },
        { exercise_name: 'Seated Dumbbell Overhead Press', sets: '3', reps_or_duration: '10 reps', rest: '60 seconds' },
        { exercise_name: 'Bodyweight Triceps Dips / Incline Push-ups', sets: '3', reps_or_duration: '12 reps', rest: '60 seconds' },
        { exercise_name: 'Overhead Cable Triceps Extensions', sets: '3', reps_or_duration: '15 reps', rest: '45 seconds' }
      ],
      cool_down: '5 min chest doorway stretch, overhead triceps stretch, deep breathing'
    },
    {
      day: 'Day 2 – Upper Body Pull & Core',
      focus: 'Back, Posterior Deltoids & Core Stability',
      warm_up: '7 min cat-cow stretches, bird-dogs, and light band pull-aparts',
      main_workout: [
        { exercise_name: 'Lat Pulldowns or Assisted Pull-ups', sets: '4', reps_or_duration: '8-10 reps', rest: '90 seconds' },
        { exercise_name: 'Bent-Over Dumbbell Rows', sets: '3', reps_or_duration: '10-12 reps', rest: '60 seconds' },
        { exercise_name: 'Standing Dumbbell Biceps Curls', sets: '3', reps_or_duration: '12 reps', rest: '60 seconds' },
        { exercise_name: 'Plank Hold with Core Bracing', sets: '3', reps_or_duration: '45-60 seconds', rest: '45 seconds' }
      ],
      cool_down: '6 min child pose, cobra stretch, hanging bar decompression'
    },
    {
      day: 'Day 3 – Lower Body Foundation',
      focus: 'Quadriceps, Hamstrings & Posterior Chain',
      warm_up: '8 min leg swings, bodyweight air squats, ankle mobility drills',
      main_workout: [
        { exercise_name: 'Goblet Squats or Barbell Back Squats', sets: '4', reps_or_duration: '10 reps', rest: '90 seconds' },
        { exercise_name: 'Romanian Dumbbell Deadlifts', sets: '3', reps_or_duration: '10-12 reps', rest: '75 seconds' },
        { exercise_name: 'Walking Lunges with Dumbbells', sets: '3', reps_or_duration: '12 steps/leg', rest: '60 seconds' },
        { exercise_name: 'Standing Calf Raises', sets: '3', reps_or_duration: '15-20 reps', rest: '45 seconds' }
      ],
      cool_down: '7 min standing quad stretch, hamstring fold, seated pigeon stretch'
    },
    {
      day: 'Day 4 – Active Recovery & Mobility',
      focus: 'Thoracic Mobility & Core Stability Flow',
      warm_up: '5 min light brisk treadmill walk or easy stationary cycle',
      main_workout: [
        { exercise_name: 'Thoracic Spine Foam Rolling & Rotations', sets: '2', reps_or_duration: '10 reps/side', rest: '30 seconds' },
        { exercise_name: 'World’s Greatest Stretch Flow', sets: '2', reps_or_duration: '8 reps/side', rest: '30 seconds' },
        { exercise_name: 'Dead Bugs with Core Bracing', sets: '3', reps_or_duration: '12 reps', rest: '45 seconds' },
        { exercise_name: 'Zone 2 Steady Walk or Swim', sets: '1', reps_or_duration: '25-30 minutes', rest: 'Continuous' }
      ],
      cool_down: '5 min diaphragmatic box breathing (4s in, 4s hold, 4s out)'
    },
    {
      day: 'Day 5 – Full-Body Functional Strength',
      focus: 'Compound Strength & Conditioning',
      warm_up: '8 min jumping jacks, inchworms, and bodyweight air squats',
      main_workout: [
        { exercise_name: 'Kettlebell / Dumbbell Swings', sets: '4', reps_or_duration: '15 reps', rest: '60 seconds' },
        { exercise_name: 'Dumbbell Thrusters (Squat to Overhead Press)', sets: '3', reps_or_duration: '10 reps', rest: '75 seconds' },
        { exercise_name: 'Renegade Rows with Controlled Pace', sets: '3', reps_or_duration: '10 reps total', rest: '60 seconds' },
        { exercise_name: 'Mountain Climbers (Controlled Cadence)', sets: '3', reps_or_duration: '40s on / 20s rest', rest: '45 seconds' }
      ],
      cool_down: '6 min downward dog to cobra flow, kneeling hip flexor stretch'
    },
    {
      day: 'Day 6 – Cardiovascular Intervals & Core',
      focus: 'Cardiovascular Conditioning & Target Core',
      warm_up: '6 min light jog or rowing machine, dynamic torso twists',
      main_workout: [
        { exercise_name: 'Interval Cardio (Rower, Bike, or Treadmill)', sets: '1', reps_or_duration: '20 minutes (1m hard / 1m easy)', rest: 'Active recovery' },
        { exercise_name: 'Hanging Knee Raises or Reverse Crunches', sets: '3', reps_or_duration: '12-15 reps', rest: '45 seconds' },
        { exercise_name: 'Russian Twists with Medicine Ball', sets: '3', reps_or_duration: '20 total twists', rest: '45 seconds' },
        { exercise_name: 'Side Plank Holds', sets: '3', reps_or_duration: '30s per side', rest: '30 seconds' }
      ],
      cool_down: '7 min full-body static stretches and foam rolling'
    },
    {
      day: 'Day 7 – Rest & Recovery',
      focus: 'Deep Recovery, Joint Decompression & Nutrition Reset',
      warm_up: 'Gentle 5-minute morning mobility stretch',
      main_workout: [
        { exercise_name: 'Gentle Outdoor Walk in Nature', sets: '1', reps_or_duration: '30-45 minutes light pace', rest: 'Continuous' },
        { exercise_name: 'Full-Body Static Flexibility Routine', sets: '1', reps_or_duration: '15 minutes full body', rest: 'Slow transitions' },
        { exercise_name: 'Hydration and Electrolyte Replenishment Check', sets: '1', reps_or_duration: 'Throughout the day', rest: 'N/A' }
      ],
      cool_down: '10 min mindfulness relaxation, preparation for Week 2'
    }
  ]);

  const [nutritionTip, setNutritionTip] = useState(
    'Prioritize 130g of daily protein (1.8g/kg body weight) distributed evenly across 3-4 meals to support muscle protein synthesis. Maintain hydration at 3.0-3.5L of water daily, with 400-500ml consumed 60 minutes pre-workout. Target 7.5 to 8.5 hours of uninterrupted sleep for neuromuscular recovery.'
  );
  const [originalPlanText, setOriginalPlanText] = useState(
    `FITBUDDY 7-DAY WORKOUT PLAN (GENERATED VIA GEMINI AI)\nUser: Jordan Lee (ID: FB-1049)\nGoal: Muscle Gain | Intensity: Intermediate\n==================================================\n\n[Day 1 – Upper Body Push] - Chest, Shoulders & Triceps\n  Warm-up: 8 min dynamic shoulder mobility & arm circles\n  Main Workout:\n    • Incline Dumbbell Bench Press — 3 sets x 10-12 reps (Rest: 75s)\n    • Seated Dumbbell Overhead Press — 3 sets x 10 reps (Rest: 60s)\n    • Bodyweight Triceps Dips / Incline Push-ups — 3 sets x 12 reps (Rest: 60s)\n    • Overhead Cable Triceps Extensions — 3 sets x 15 reps (Rest: 45s)\n  Cool-down: 5 min chest doorway stretch and slow diaphragmatic breathing\n----------------------------------------\n[Day 7 – Rest & Recovery] - Recovery & Weekly Reset\n  Warm-up: 5 min gentle morning mobility stretch\n  Main Workout:\n    • 30-45 min outdoor restorative walk (Rest: Continuous)\n  Cool-down: 10 min mindfulness relaxation`
  );
  const [updatedPlanText, setUpdatedPlanText] = useState<string | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [feedbackApplied, setFeedbackApplied] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [currentRecordId, setCurrentRecordId] = useState<number>(1);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({
    '0-0': true,
    '0-1': true,
    '0-2': true,
    '0-3': true
  });
  const [adminSearch, setAdminSearch] = useState('');

  // Stored Records
  const [storedRecords, setStoredRecords] = useState<StoredWorkout[]>([
    {
      id: 1,
      userId: 'FB-1049',
      username: 'Jordan Lee',
      age: 26,
      weight: 72.0,
      goal: 'Muscle Gain',
      intensity: 'Intermediate',
      originalPlan: `FITBUDDY 7-DAY WORKOUT PLAN (GENERATED VIA GEMINI AI)\nUser: Jordan Lee (ID: FB-1049)\nGoal: Muscle Gain | Intensity: Intermediate\n==================================================\n\n[Day 1 – Upper Body Push] - Chest, Shoulders & Triceps\n  Warm-up: 8 min dynamic shoulder mobility & arm circles\n  Main Workout:\n    • Incline Dumbbell Bench Press — 3 sets x 10-12 reps (Rest: 75s)\n    • Seated Dumbbell Overhead Press — 3 sets x 10 reps (Rest: 60s)\n    • Bodyweight Triceps Dips / Incline Push-ups — 3 sets x 12 reps (Rest: 60s)\n    • Overhead Cable Triceps Extensions — 3 sets x 15 reps (Rest: 45s)\n  Cool-down: 5 min chest doorway stretch and slow diaphragmatic breathing`,
      updatedPlan: null,
      nutritionTip: 'Prioritize 130g of daily protein (1.8g/kg body weight) distributed evenly across 3-4 meals to support muscle protein synthesis. Maintain hydration at 3.0-3.5L of water daily.',
      createdAt: '2026-09-30 17:00'
    },
    {
      id: 2,
      userId: 'FB-2088',
      username: 'Elena Rostova',
      age: 29,
      weight: 60.5,
      goal: 'General Fitness',
      intensity: 'Beginner',
      originalPlan: `FITBUDDY 7-DAY WORKOUT PLAN\nUser: Elena Rostova (ID: FB-2088)\nGoal: General Fitness | Intensity: Beginner\n==================================================\n\n[Day 1 – Joint Mobility & Posture]\n  Warm-up: 10 min gentle breathing and spinal twists\n  Main Workout:\n    • Bodyweight Squats — 3 sets x 12 reps (Rest: 60s)\n    • Push-ups against bench — 3 sets x 10 reps (Rest: 60s)\n  Cool-down: 8 min stretch`,
      updatedPlan: `FITBUDDY REVISED WORKOUT PLAN\nUser: Elena Rostova\nAdjustment: "Include yoga on Day 4"\n- Replaced circuit with 30 min Vinyasa restorative flow.`,
      nutritionTip: 'Focus on whole-food nutrient density and consistent electrolyte replenishment.',
      createdAt: '2026-09-30 17:45'
    }
  ]);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenerationProgress(25);
    setGenerationStep('Connecting to Gemini 3.8 Flash...');

    setTimeout(() => {
      setGenerationProgress(55);
      setGenerationStep('Synthesizing 7-day periodization...');
    }, 400);

    setTimeout(() => {
      setGenerationProgress(80);
      setGenerationStep('Balancing exercise volume & rest...');
    }, 800);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          userId,
          age: Number(age),
          weight: Number(weight),
          goal,
          intensity,
          equipment: userEquipment
        })
      });

      const data = await response.json();
      const planDays = data.seven_day_plan || activeDays;
      const nTip = data.nutrition_tip || `Target ~${Math.round(Number(weight) * 1.8)}g daily protein and 3.2L hydration.`;

      const formattedOriginal = planDays
        .map((d: any) => `[${d.day}] - ${d.focus}\n  Warm-up: ${d.warm_up}\n  Main Workout:\n${d.main_workout.map((e: any) => `    • ${e.exercise_name} — ${e.sets} sets x ${e.reps_or_duration} (Rest: ${e.rest})`).join('\n')}\n  Cool-down: ${d.cool_down}`)
        .join('\n----------------------------------------\n');

      setActiveDays(planDays);
      setNutritionTip(nTip);
      setOriginalPlanText(formattedOriginal);
      setUpdatedPlanText(null);
      setFeedbackApplied(false);
      setIsGenerating(false);

      const newId = storedRecords.length + 1;
      setCurrentRecordId(newId);
      const newRecord: StoredWorkout = {
        id: newId,
        userId,
        username,
        age: Number(age),
        weight: Number(weight),
        goal,
        intensity,
        equipment: userEquipment,
        originalPlan: formattedOriginal,
        updatedPlan: null,
        nutritionTip: nTip,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
      setStoredRecords([newRecord, ...storedRecords]);
      setActiveTab('result');
      grantXp(50, 'Gemini 7-Day Plan Synthesis');
      const eqLabel = userEquipment === 'bodyweight' ? 'Zero Equipment Calisthenics' : userEquipment === 'minimal' ? 'Minimal Home Gear' : 'Full Gym';
      speakCoach(`Welcome to your personalized 7-day ${goal} program, ${username}. Calibrated for ${eqLabel}. Day 1 is loaded. Check out your rest intervals and interactive video demo classes.`);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      setActiveTab('result');
      grantXp(50, 'Plan Synthesis Protocol');
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFeedback.trim()) return;

    setIsUpdating(true);
    setUpdatingProgress(30);
    setUpdatingStep('Analyzing modification directive with Gemini 3.8 Flash...');

    setTimeout(() => {
      setUpdatingProgress(70);
      setUpdatingStep('Rebalancing weekly split & volume...');
    }, 450);

    try {
      const response = await fetch('/api/customize-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPlan: updatedPlanText || originalPlanText,
          feedback: currentFeedback,
          goal,
          intensity
        })
      });

      const data = await response.json();
      const revised = data.revisedPlanText || `FITBUDDY REVISED WORKOUT PLAN\nAdjustment: "${currentFeedback}"\nRebalanced volume and integrated feedback smoothly into weekly split.`;

      setUpdatedPlanText(revised);
      setFeedbackApplied(true);
      setFeedbackMessage(currentFeedback);
      setIsUpdating(false);
      grantXp(40, 'Adaptive Plan Calibration');
      speakCoach(`Workout plan updated according to your instructions. Rebalancing weekly schedule.`);

      setStoredRecords(prev => prev.map(rec => {
        if (rec.id === currentRecordId) {
          return { ...rec, updatedPlan: revised };
        }
        return rec;
      }));
    } catch (err) {
      console.error(err);
      setIsUpdating(false);
      grantXp(40, 'Plan Revision Protocol');
    }
  };

  const toggleCheck = (dayIndex: number, exerciseIndex: number) => {
    const key = `${dayIndex}-${exerciseIndex}`;
    const nextState = !completedExercises[key];

    setCompletedExercises(prev => ({
      ...prev,
      [key]: nextState
    }));

    const day = activeDays[dayIndex];
    if (day && day.main_workout) {
      const ex = day.main_workout[exerciseIndex];
      if (nextState && ex) {
        grantXp(35, `${ex.exercise_name} Completed`);
      }

      const willBeAllDone = day.main_workout.every((_, idx) => {
        if (idx === exerciseIndex) return nextState;
        return !!completedExercises[`${dayIndex}-${idx}`];
      });

      const dayNumber = dayIndex + 1;
      if (willBeAllDone && !completedDays.includes(dayNumber)) {
        setCompletedDays(prev => [...prev, dayNumber]);
        setCompletedDayNumber(dayNumber);
        setShowCompletionModal(true);
        grantXp(200, `Day 0${dayNumber} Full Session Conquered`);
      } else if (!willBeAllDone && completedDays.includes(dayNumber)) {
        setCompletedDays(prev => prev.filter(d => d !== dayNumber));
      }
    }
  };

  const handleSwitchEquipmentMode = (newMode: EquipmentType) => {
    setUserEquipment(newMode);
    const adaptivePlan = getAdaptive7DayPlan(newMode, goal);
    const convertedDays: DayPlan[] = adaptivePlan.map(d => ({
      day: d.day,
      focus: d.focus,
      warm_up: d.warm_up,
      main_workout: d.main_workout.map(ex => ({
        exercise_name: ex.exercise_name,
        sets: ex.sets,
        reps_or_duration: ex.reps_or_duration,
        rest: ex.rest,
        equipment_needed: ex.equipment_needed,
        equipment_category: ex.equipment_category,
        form_cue: ex.form_cue,
        target_muscle: ex.target_muscle
      })),
      cool_down: d.cool_down
    }));

    setActiveDays(convertedDays);
    const formatted = convertedDays
      .map((d: any) => `[${d.day}] - ${d.focus}\n  Warm-up: ${d.warm_up}\n  Main Workout:\n${d.main_workout.map((e: any) => `    • ${e.exercise_name} — ${e.sets} sets x ${e.reps_or_duration} (Rest: ${e.rest})`).join('\n')}\n  Cool-down: ${d.cool_down}`)
      .join('\n----------------------------------------\n');
    setOriginalPlanText(formatted);
    grantXp(30, `Equipment Mode Switched: ${newMode.toUpperCase()}`);

    const label = newMode === 'bodyweight' ? 'Zero Equipment Calisthenics' : newMode === 'minimal' ? 'Minimal Home Gear' : 'Full Gym Equipment';
    speakCoach(`Switched active training environment to ${label}. All daily exercises, rest timers, and video demos have been calibrated.`);
  };

  const handleSwapSingleExercise = (dayIdx: number, exIdx: number, targetMode: EquipmentType) => {
    const day = activeDays[dayIdx];
    if (!day || !day.main_workout[exIdx]) return;
    const currentEx = day.main_workout[exIdx];
    
    // Look up alternative from the biomechanical equivalents matrix
    const alt = findAlternativeExercise(currentEx.exercise_name, targetMode);
    let newExerciseName = alt?.exercise_name;
    let newRest = alt?.rest || currentEx.rest;
    let newSets = alt?.sets || currentEx.sets;
    let newReps = alt?.reps_or_duration || currentEx.reps_or_duration;
    let formCue = alt?.form_cue;
    let targetMuscle = alt?.target_muscle;

    if (!newExerciseName) {
      if (targetMode === 'bodyweight') {
        newExerciseName = `${currentEx.exercise_name.replace(/barbell|dumbbell|cable|machine/gi, '').trim() || 'Bodyweight'} (Floor Calisthenics)`;
      } else if (targetMode === 'minimal') {
        newExerciseName = `Dumbbell / Band ${currentEx.exercise_name.replace(/barbell|cable|machine/gi, '').trim()}`;
      } else {
        newExerciseName = `Barbell ${currentEx.exercise_name.replace(/bodyweight|push-up|calisthenic/gi, '').trim()}`;
      }
    }

    const updatedWorkout = [...day.main_workout];
    updatedWorkout[exIdx] = {
      ...currentEx,
      exercise_name: newExerciseName,
      sets: newSets,
      reps_or_duration: newReps,
      rest: newRest,
      equipment_category: targetMode,
      equipment_needed: alt?.equipment_needed || (targetMode === 'bodyweight' ? 'Zero Equipment' : targetMode === 'minimal' ? 'Dumbbells / Bands' : 'Gym Gear'),
      form_cue: formCue,
      target_muscle: targetMuscle
    };

    const newDays = [...activeDays];
    newDays[dayIdx] = { ...day, main_workout: updatedWorkout };
    setActiveDays(newDays);

    grantXp(20, `Exercise Gear Swapped: ${newExerciseName}`);
    speakCoach(`Swapped exercise to ${newExerciseName}. Configured for ${targetMode === 'bodyweight' ? 'zero equipment' : targetMode === 'minimal' ? 'home gear' : 'full gym'}.`);
  };

  const goalOptions = [
    { id: 'Muscle Gain', title: 'Muscle Gain', desc: 'Progressive resistance training focused on hypertrophy and strength.' },
    { id: 'Weight Loss', title: 'Weight Loss', desc: 'Metabolic conditioning and lean preservation in a caloric deficit.' },
    { id: 'General Fitness', title: 'General Fitness', desc: 'Balanced conditioning, joint mobility and long-term energy.' },
    { id: 'Strength', title: 'Strength', desc: 'Compound movements with higher rest intervals and heavier loads.' },
    { id: 'Endurance', title: 'Endurance', desc: 'Cardiovascular stamina, sustained tempo and aerobic capacity.' }
  ];

  const intensityOptions = [
    { id: 'Beginner', title: 'Beginner', level: 'Level 1', desc: 'Foundational movements, moderate volume and generous recovery.' },
    { id: 'Intermediate', title: 'Intermediate', level: 'Level 2', desc: 'Structured periodization with balanced progressive overload.' },
    { id: 'Advanced', title: 'Advanced', level: 'Level 3', desc: 'Higher training density, complex lifts and intensive work sets.' }
  ];

  const filteredRecords = storedRecords.filter(r => 
    !adminSearch.trim() || 
    r.username.toLowerCase().includes(adminSearch.toLowerCase()) || 
    r.userId.toLowerCase().includes(adminSearch.toLowerCase()) ||
    r.goal.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const activeDay = activeDays[selectedDayIndex] || activeDays[0];
  const dayExercisesTotal = activeDay ? activeDay.main_workout.length : 0;
  const dayExercisesCompleted = activeDay 
    ? activeDay.main_workout.filter((_, idx) => !!completedExercises[`${selectedDayIndex}-${idx}`]).length 
    : 0;
  const weeklyCompletionPercent = Math.round((completedDays.length / 7) * 100);

  return (
    <div className="min-h-screen bg-[#07090d] text-[#f5f7fa] font-sans flex flex-col relative overflow-x-hidden">
      {/* Scrolltide.co Signature Scroll Progress Track */}
      <div className="scrolltide-progress-track" aria-hidden="true">
        <div 
          className="scrolltide-progress-bar"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Subtle Ambient Radial Light (Calm, Quiet, Minimal) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[radial-gradient(circle_350px_at_50%_0%,rgba(142,230,193,0.035),transparent_70%)] pointer-events-none z-0" aria-hidden="true"></div>
      
      {/* Cinematic Motion Graphics Canvas Background */}
      <CinematicMotionCanvas accentRgb={accentRgb} />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#07090d]/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div 
              className="w-7 h-7 rounded border border-white/[0.12] flex items-center justify-center transition-all duration-300"
              style={{ 
                backgroundColor: `rgba(${accentRgb}, 0.1)`, 
                color: currentAccentHex,
                borderColor: `rgba(${accentRgb}, 0.3)`
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight text-white">
              FITBUDDY
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {/* Live Cinematic Telemetry Badge */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.035] border border-white/[0.08] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
              <span className="text-[10px] font-mono tracking-wider text-[#a7adb7]">
                MOTION ENGINE • 60 FPS
              </span>
            </div>

            {/* Live AI Feature Diagnostics Suite */}
            <button
              type="button"
              onClick={() => setIsAiTestModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
              title="Live Test All AI Features (Gemini 3.8 Flash, Voice Coach, Kinematics)"
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live AI Test</span>
            </button>

            {/* Scalable Level & XP Badge */}
            <button
              type="button"
              onClick={() => setIsXpModalOpen(true)}
              className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.12] hover:border-[var(--accent)] transition cursor-pointer"
              title="Open Athletic Progression & Scalable XP Station"
            >
              <span className="text-base">{currentLevelStats.rank.badge}</span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-mono leading-none font-bold" style={{ color: currentAccentHex }}>
                  LVL {currentLevelStats.level}
                </span>
                <span className="text-[9px] font-mono text-[#a7adb7] leading-none mt-0.5">
                  {currentLevelStats.xpInCurrentLevel}/{currentLevelStats.xpNeededForNextLevel} XP
                </span>
              </div>
            </button>

            {/* Quick Equipment Environment Toggle / Indicator */}
            <button
              type="button"
              onClick={() => setShowEquipmentMatrixModal(true)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                userEquipment === 'bodyweight'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
                  : userEquipment === 'minimal'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
                  : 'bg-sky-500/15 text-sky-300 border-sky-500/40 hover:bg-sky-500/25'
              }`}
              title="Click to view & switch Equipment Setup (Bodyweight / Minimal / Full Gym)"
            >
              <span className="text-sm">
                {userEquipment === 'bodyweight' ? '🤸' : userEquipment === 'minimal' ? '⚡' : '🏋️'}
              </span>
              <span className="hidden md:inline font-mono font-bold text-[11px]">
                {userEquipment === 'bodyweight' ? 'No Equip' : userEquipment === 'minimal' ? 'Home Kit' : 'Full Gym'}
              </span>
            </button>

            {/* Quick Video Demo Class Studio Launcher */}
            <button
              type="button"
              onClick={() => openVideoDemoClass(activeDay?.main_workout[0]?.exercise_name || 'Barbell Bench Press')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.12] hover:border-[var(--accent)] transition cursor-pointer"
              title="Open Interactive Video Demo Class Studio"
            >
              <Video className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="hidden sm:inline">Video Class</span>
            </button>

            {/* Voice Coach Console & Persona Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCoachMenu(!showCoachMenu)}
                className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                  isVoiceCoachEnabled
                    ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-white'
                    : 'bg-white/[0.04] border-white/[0.08] text-[#6f7682]'
                }`}
                title="Voice Coach Settings & Persona"
              >
                {isVoiceCoachEnabled ? (
                  <Mic className="w-3.5 h-3.5 text-[var(--accent)]" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-[#6f7682]" />
                )}

                {/* Animated Voice Equalizer Soundwave Bars */}
                <div className="flex items-center gap-0.5 h-3">
                  <span className={`voice-wave-bar ${isCoachSpeaking ? 'speaking' : ''}`} style={{ height: isCoachSpeaking ? undefined : '5px' }} />
                  <span className={`voice-wave-bar ${isCoachSpeaking ? 'speaking' : ''}`} style={{ height: isCoachSpeaking ? undefined : '8px' }} />
                  <span className={`voice-wave-bar ${isCoachSpeaking ? 'speaking' : ''}`} style={{ height: isCoachSpeaking ? undefined : '4px' }} />
                  <span className={`voice-wave-bar ${isCoachSpeaking ? 'speaking' : ''}`} style={{ height: isCoachSpeaking ? undefined : '7px' }} />
                </div>

                <span className="text-[11px] font-mono font-medium hidden sm:inline">
                  {isVoiceCoachEnabled ? activeCoach.name : 'Muted'}
                </span>
              </button>

              {/* Voice Coach Dropdown Settings Panel */}
              {showCoachMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#0c1017] border border-white/[0.14] rounded-2xl p-3.5 shadow-2xl z-50 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                    <div className="flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span className="text-xs font-bold text-white">Voice Coach Console</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCoachMenu(false)}
                      className="text-[#6f7682] hover:text-white text-xs p-1"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Toggle On/Off */}
                  <div className="flex items-center justify-between bg-white/[0.03] p-2 rounded-xl border border-white/[0.06]">
                    <div>
                      <span className="text-xs font-semibold text-white block">Voice Coaching</span>
                      <span className="text-[10px] text-[#6f7682]">Speaks cues, timer alerts & demo classes</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !isVoiceCoachEnabled;
                        setIsVoiceCoachEnabled(next);
                        if (next) {
                          speakCoach(`Voice coach ${activeCoach.name} enabled.`);
                        } else {
                          window.speechSynthesis?.cancel();
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                        isVoiceCoachEnabled
                          ? 'bg-[var(--accent)] text-[#07090d]'
                          : 'bg-white/[0.1] text-[#a7adb7]'
                      }`}
                    >
                      {isVoiceCoachEnabled ? 'ACTIVE' : 'OFF'}
                    </button>
                  </div>

                  {/* Persona Selector */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6f7682] block">
                      Select Coach Persona:
                    </span>
                    <div className="space-y-1">
                      {COACH_PERSONAS.map((persona) => {
                        const isSelected = coachPersonaId === persona.id;
                        return (
                          <div
                            key={persona.id}
                            onClick={() => {
                              setCoachPersonaId(persona.id);
                              speakCoach(`Coach ${persona.name} here. Ready for today's session.`);
                            }}
                            className={`p-2 rounded-xl border cursor-pointer transition text-xs flex items-center justify-between ${
                              isSelected
                                ? 'bg-[var(--accent)]/15 border-[var(--accent)]/40 text-white'
                                : 'bg-white/[0.02] border-white/[0.06] text-[#a7adb7] hover:bg-white/[0.05]'
                            }`}
                          >
                            <div>
                              <span className="font-bold block text-white">{persona.name}</span>
                              <span className="text-[10px] text-[#6f7682]">{persona.specialty} • {persona.tagline}</span>
                            </div>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Test Audio Button */}
                  <button
                    type="button"
                    onClick={() => {
                      speakCoach(`FitBuddy Voice Engine active with ${activeCoach.name}. Rest timer counting down and video demo coaching ready.`);
                    }}
                    className="w-full py-1.5 rounded-lg text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.08] transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Test Voice Speech</span>
                  </button>
                </div>
              )}
            </div>

            {/* Interactive Random Color Shuffle Button (Scrolltide) */}
            <button
              type="button"
              onClick={changeRandomColor}
              className="btn-random-color"
              title="Shuffle Dynamic Random Accent Color"
              aria-label="Change random color"
            >
              <span
                className="random-color-indicator"
                style={{ backgroundColor: currentAccentHex, boxShadow: `0 0 8px ${currentAccentHex}` }}
              />
              <span className="text-[11px] font-semibold tracking-wide text-white">
                {paletteName || 'Random Color'}
              </span>
              <Shuffle className={`w-3.5 h-3.5 text-[var(--accent)] transition-transform duration-500 ${isShufflingColor ? 'rotate-180' : ''}`} />
            </button>

            <nav className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeTab === 'home'
                    ? 'bg-white/[0.08] text-white border border-white/[0.12]'
                    : 'text-[#a7adb7] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('result')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeTab === 'result'
                    ? 'bg-white/[0.08] text-white border border-white/[0.12]'
                    : 'text-[#a7adb7] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                7-Day Plan
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-white/[0.08] text-white border border-white/[0.12]'
                    : 'text-[#6f7682] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>Admin Console</span>
              </button>
              <button
                onClick={() => setActiveTab('deployment')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'deployment'
                    ? 'bg-white/[0.08] text-white border border-white/[0.12]'
                    : 'text-[#6f7682] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Deployment</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-5 py-8 relative z-10">
        
        {/* TAB 1: LANDING & ONBOARDING */}
        {activeTab === 'home' && (
          <div className="space-y-12 max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2 scrolltide-reveal in-view">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8ee6c1]/10 border border-[#8ee6c1]/25 text-[#8ee6c1] text-[11px] font-bold uppercase tracking-wider">
                  <span>AI-Assisted Fitness Planning</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                  Personalized training,<br />
                  built around you.
                </h1>
                <p className="text-[#a7adb7] text-sm sm:text-base leading-relaxed max-w-lg">
                  Generate a structured 7-day fitness plan using your goals, experience and training intensity. Grounded in exercise physiology with targeted recovery guidance.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#onboardingCard"
                    className="bg-[#f5f7fa] hover:bg-white text-[#07090d] font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition active:scale-95 text-xs sm:text-sm"
                  >
                    <span>Build My Plan</span>
                  </a>

                  {/* Audio Briefing / Tour Button */}
                  <button
                    type="button"
                    onClick={() => {
                      speakCoach(`Welcome to FitBuddy. I am ${activeCoach.name}, your biometric training voice coach. Enter your stats and goal to generate an adaptive 7-day training plan, complete with audible rest intervals and kinematic video masterclasses.`);
                    }}
                    className="bg-white/[0.04] hover:bg-white/[0.09] text-white font-semibold px-4 py-2.5 rounded-lg border border-white/[0.1] hover:border-[var(--accent)]/40 transition text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                    title="Listen to Voice Coach Introduction"
                  >
                    <Volume2 className="w-4 h-4 text-[var(--accent)]" />
                    <span>Coach Tour</span>
                  </button>

                  {/* Video Demo Class CTA */}
                  <button
                    type="button"
                    onClick={() => openVideoDemoClass('Barbell Bench Press')}
                    className="bg-[var(--accent)]/15 hover:bg-[var(--accent)]/25 text-white font-semibold px-4 py-2.5 rounded-lg border border-[var(--accent)]/35 transition text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                    title="Experience Interactive Kinematic Video Demo Class"
                  >
                    <Video className="w-4 h-4 text-[var(--accent)]" />
                    <span>Video Class Demo</span>
                  </button>

                  {/* Equipment Alternatives Matrix CTA */}
                  <button
                    type="button"
                    onClick={() => setShowEquipmentMatrixModal(true)}
                    className="bg-white/[0.04] hover:bg-white/[0.09] text-white font-semibold px-4 py-2.5 rounded-lg border border-white/[0.1] hover:border-emerald-500/40 transition text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                    title="Compare Zero Equipment vs Gym vs Home Gear"
                  >
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Gear Alternatives</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('admin')}
                    className="bg-white/[0.02] hover:bg-white/[0.05] text-[#a7adb7] font-semibold px-4 py-2.5 rounded-lg border border-white/[0.08] transition text-xs sm:text-sm"
                  >
                    View Stored Plans
                  </button>
                </div>
              </div>

              {/* Architectural Glass Visual (Cinematic Motion Graphics) */}
              <div className="lg:col-span-5 flex justify-center">
                <div 
                  className="ai-core-container relative w-80 h-80 rounded-full flex items-center justify-center cursor-pointer group select-none"
                  title="FitBuddy Intelligence Core"
                >
                  {/* Outer Orbital Compass Ring with SVG Telemetry & Degree Ticks */}
                  <svg className="absolute inset-0 w-full h-full animate-[spin_70s_linear_infinite]" viewBox="0 0 320 320">
                    <circle 
                      cx="160" 
                      cy="160" 
                      r="154" 
                      fill="none" 
                      stroke="rgba(255, 255, 255, 0.12)" 
                      strokeWidth="1" 
                      strokeDasharray="3 7"
                    />
                    <circle 
                      cx="160" 
                      cy="160" 
                      r="154" 
                      fill="none" 
                      stroke={currentAccentHex}
                      strokeOpacity="0.55"
                      strokeWidth="1.5" 
                      strokeDasharray="40 180"
                    />
                    {/* Cardinal Coordinate Ticks */}
                    <line x1="160" y1="2" x2="160" y2="10" stroke={currentAccentHex} strokeWidth="2" />
                    <line x1="318" y1="160" x2="310" y2="160" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                    <line x1="160" y1="318" x2="160" y2="310" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                    <line x1="2" y1="160" x2="10" y2="160" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  </svg>

                  {/* Cinematic Radar Telemetry Sweep */}
                  <div className="absolute inset-2 rounded-full overflow-hidden pointer-events-none cinematic-radar opacity-45">
                    <div 
                      className="w-full h-full"
                      style={{
                        background: `conic-gradient(from 0deg, rgba(${accentRgb}, 0.25) 0deg, transparent 65deg, transparent 360deg)`
                      }}
                    />
                  </div>

                  {/* Counter-rotating Inner Gyroscope Ring */}
                  <svg className="absolute inset-5 w-[280px] h-[280px] animate-[spin_40s_linear_infinite_reverse]" viewBox="0 0 280 280">
                    <circle 
                      cx="140" 
                      cy="140" 
                      r="132" 
                      fill="none" 
                      stroke="rgba(255, 255, 255, 0.08)" 
                      strokeWidth="1" 
                    />
                    <circle 
                      cx="272" 
                      cy="140" 
                      r="4" 
                      fill={currentAccentHex} 
                      style={{ filter: `drop-shadow(0 0 8px ${currentAccentHex})` }}
                    />
                    <circle 
                      cx="8" 
                      cy="140" 
                      r="2.5" 
                      fill="rgba(255, 255, 255, 0.6)" 
                    />
                  </svg>

                  {/* Pulsing Luminous Backing Aura */}
                  <div 
                    className="absolute w-48 h-48 rounded-full blur-2xl transition-all duration-700 opacity-80"
                    style={{ backgroundColor: `rgba(${accentRgb}, 0.22)` }}
                  ></div>

                  {/* Frosted Glass Core Orb with Biometric Harmonic Center */}
                  <div 
                    className="relative w-40 h-40 rounded-full bg-gradient-to-tr from-white/[0.09] via-[#0c0f16]/95 to-[#12161f]/95 border border-white/[0.18] shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center text-center p-3 backdrop-blur-2xl transition-all duration-500 group-hover:scale-105"
                    style={{ borderColor: `rgba(${accentRgb}, 0.35)` }}
                  >
                    <span 
                      className="text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300"
                      style={{ 
                        color: currentAccentHex,
                        textShadow: `0 0 14px rgba(${accentRgb}, 0.6)`
                      }}
                    >
                      FitBuddy
                    </span>
                    <span className="text-[9px] text-[#6f7682] uppercase tracking-wider font-mono mt-0.5">
                      Neural Engine
                    </span>

                    {/* Animated SVG EKG Biometric Wave */}
                    <div className="w-20 h-5 my-1 overflow-hidden flex items-center justify-center">
                      <svg viewBox="0 0 100 24" className="w-full h-full">
                        <path 
                          d="M0 12 L25 12 L35 4 L45 20 L55 8 L65 15 L75 12 L100 12"
                          fill="none"
                          stroke={currentAccentHex}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="cinematic-ekg-line"
                        />
                      </svg>
                    </div>

                    <span className="text-[8px] text-[#a7adb7] tracking-widest uppercase font-mono">
                      SYNC: 60 FPS
                    </span>
                  </div>

                  {/* Precision Floating Spatial HUD Satellites with Glass Surface */}
                  <div className="absolute top-1 -left-3 cinematic-float-1 bg-[#0b0e14]/90 border border-white/[0.14] rounded-full px-3 py-1 text-[10px] font-mono font-semibold text-[#a7adb7] shadow-xl backdrop-blur-md flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                    <span>VO₂ MAX • 54.2</span>
                  </div>
                  <div className="absolute bottom-2 -right-3 cinematic-float-2 bg-[#0b0e14]/90 border border-white/[0.14] rounded-full px-3 py-1 text-[10px] font-mono font-semibold text-[#a7adb7] shadow-xl backdrop-blur-md flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                    <span>RECOVERY • 98.4%</span>
                  </div>
                  <div className="absolute -top-3 right-6 cinematic-float-2 bg-[#0b0e14]/85 border border-white/[0.1] rounded-full px-2.5 py-0.5 text-[9px] font-mono text-[#6f7682] backdrop-blur-md">
                    PERIODIZATION 7D
                  </div>
                </div>
              </div>
            </div>

            {/* ONBOARDING FORM PANEL */}
            <div id="onboardingCard" className="bg-white/[0.035] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 scrolltide-reveal in-view">
              <div className="border-b border-white/[0.08] pb-4">
                <h2 className="text-xl font-bold text-white">Profile & Training Parameters</h2>
                <p className="text-[#6f7682] text-xs sm:text-sm mt-0.5">
                  Configure your athlete profile. Inputs are validated before generating your structured program.
                </p>
              </div>

              <form onSubmit={handleGeneratePlan} className="space-y-6">
                {/* 1. Biometric Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#a7adb7] uppercase tracking-wider mb-1.5">
                      Athlete ID *
                    </label>
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      required
                      placeholder="e.g. FB-1049"
                      className="w-full bg-[#0e1219]/60 border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#a7adb7] uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="e.g. Jordan Lee"
                      className="w-full bg-[#0e1219]/60 border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#a7adb7] uppercase tracking-wider mb-1.5">
                      Age (Years) *
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                      required
                      min="14"
                      max="100"
                      className="w-full bg-[#0e1219]/60 border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#a7adb7] uppercase tracking-wider mb-1.5">
                      Weight (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
                      required
                      min="30"
                      max="250"
                      className="w-full bg-[#0e1219]/60 border border-white/[0.1] focus:border-white/30 focus:ring-1 focus:ring-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                    />
                  </div>
                </div>

                {/* 2. Restrained Goal Cards (Monochrome by default, Accent when Selected) */}
                <div>
                  <label className="block text-[11px] font-bold text-[#a7adb7] uppercase tracking-wider mb-2">
                    Primary Fitness Goal *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    {goalOptions.map((opt) => {
                      const isSelected = goal === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setGoal(opt.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition relative ${
                            isSelected
                              ? 'bg-white/[0.08] border-[#8ee6c1]/40 shadow-sm'
                              : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className={`font-bold text-xs ${isSelected ? 'text-[#8ee6c1]' : 'text-white'}`}>
                            {opt.title}
                          </div>
                          <div className="text-[11px] text-[#6f7682] mt-1 leading-snug">
                            {opt.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Restrained Intensity Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-[#a7adb7] uppercase tracking-wider mb-2">
                    Training Intensity *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {intensityOptions.map((opt) => {
                      const isSelected = intensity === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setIntensity(opt.id)}
                          className={`p-3.5 rounded-lg border cursor-pointer transition relative ${
                            isSelected
                              ? 'bg-white/[0.08] border-[#8ee6c1]/40 shadow-sm'
                              : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.04]'
                          }`}
                        >
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#6f7682] block mb-0.5">
                            {opt.level}
                          </span>
                          <div className={`font-bold text-sm ${isSelected ? 'text-[#8ee6c1]' : 'text-white'}`}>
                            {opt.title}
                          </div>
                          <div className="text-[11px] text-[#6f7682] mt-1 leading-snug">
                            {opt.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Equipment Availability & Training Environment (Interactive & Attractive Colors) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-[11px] font-bold text-[#a7adb7] uppercase tracking-wider">
                        Available Equipment Setup *
                      </label>
                      <p className="text-[11px] text-[#6f7682] mt-0.5">
                        Different exercises for each setup, with identical rest timers, voice coaching, and 60 FPS video demos.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowEquipmentMatrixModal(true)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-[var(--accent)] border border-[var(--accent)]/30 transition cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Compare Gear Matrix</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {EQUIPMENT_OPTIONS.map((opt) => {
                      const isSelected = userEquipment === opt.id;
                      const isBodyweight = opt.id === 'bodyweight';
                      const isGym = opt.id === 'gym';
                      const isMinimal = opt.id === 'minimal';

                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            setUserEquipment(opt.id);
                            speakCoach(`${opt.title} selected. Program will be calibrated strictly for ${opt.id === 'bodyweight' ? 'calisthenics and zero gear' : opt.id === 'minimal' ? 'home dumbbells and bands' : 'full gym barbells and machines'}.`);
                          }}
                          className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? isBodyweight
                                ? 'bg-emerald-950/30 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/50'
                                : isMinimal
                                ? 'bg-amber-950/30 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
                                : 'bg-sky-950/30 border-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.25)] ring-1 ring-sky-400/50'
                              : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.04]'
                          }`}
                        >
                          {/* Top Badge & Radio Indicator */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl filter drop-shadow-sm">{opt.badge}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                              isSelected
                                ? isBodyweight
                                  ? 'border-emerald-400 bg-emerald-500 text-black'
                                  : isMinimal
                                  ? 'border-amber-400 bg-amber-500 text-black'
                                  : 'border-sky-400 bg-sky-500 text-black'
                                : 'border-white/20 bg-transparent'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>

                          {/* Title */}
                          <div className={`font-bold text-sm transition ${
                            isSelected
                              ? isBodyweight
                                ? 'text-emerald-300'
                                : isMinimal
                                ? 'text-amber-300'
                                : 'text-sky-300'
                              : 'text-white'
                          }`}>
                            {opt.title}
                          </div>

                          {/* Subtitle */}
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#6f7682] mt-0.5 mb-1.5">
                            {opt.subtitle}
                          </div>

                          {/* Description */}
                          <p className="text-[11px] text-[#8f96a3] leading-relaxed">
                            {opt.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#f5f7fa] hover:bg-white text-[#07090d] font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition active:scale-[0.99] text-sm shadow-md"
                >
                  <span>Build My Plan</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: 7-DAY DASHBOARD & TODAY'S WORKOUT */}
        {activeTab === 'result' && (
          <div className="space-y-6">
            {/* Dashboard Header */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8ee6c1] mb-1">
                7-Day Program • Personal Training Dashboard
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{username}</h1>
                  <div className="text-xs text-[#6f7682] mt-1">
                    Athlete ID: <span className="font-mono text-[#a7adb7]">{userId}</span> • {age} yrs • {weight} kg
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('home')}
                  className="text-xs bg-white/[0.04] hover:bg-white/[0.08] text-[#a7adb7] border border-white/[0.1] px-3 py-1.5 rounded-lg transition"
                >
                  Adjust Profile
                </button>
              </div>
            </div>

            {/* Minimal Metric Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/[0.035] border border-white/[0.08] rounded-xl p-3.5">
                <span className="text-[10px] font-bold text-[#6f7682] uppercase tracking-wider block">Goal</span>
                <span className="text-sm font-bold text-white block mt-0.5">{goal}</span>
              </div>
              <div className="bg-white/[0.035] border border-white/[0.08] rounded-xl p-3.5">
                <span className="text-[10px] font-bold text-[#6f7682] uppercase tracking-wider block">Intensity</span>
                <span className="text-sm font-bold text-white block mt-0.5">{intensity}</span>
              </div>
              <div className="bg-white/[0.035] border border-white/[0.08] rounded-xl p-3.5">
                <span className="text-[10px] font-bold text-[#6f7682] uppercase tracking-wider block">Duration</span>
                <span className="text-sm font-bold text-white block mt-0.5">7 Days</span>
              </div>
              <div className="bg-white/[0.035] border border-white/[0.08] rounded-xl p-3.5">
                <span className="text-[10px] font-bold text-[#6f7682] uppercase tracking-wider block">Sessions</span>
                <span className="text-sm font-bold text-white block mt-0.5">7 Scheduled</span>
              </div>
            </div>

            {/* Professional Progress Panel (No Fake Gamification, Authentic Consistency) */}
            <div className="bg-white/[0.035] border border-white/[0.08] rounded-2xl p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#a7adb7] uppercase tracking-wider block">Weekly Completion</span>
                  <div className="text-lg font-bold text-white">
                    {completedDays.length} / 7 sessions <span className="text-xs font-normal text-[#6f7682]">({weeklyCompletionPercent}%)</span>
                  </div>
                </div>
                <div className="text-xs text-[#6f7682]">
                  Day {selectedDayIndex + 1} of 7 Selected
                </div>
              </div>

              {/* Progress Line */}
              <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#8ee6c1] transition-all duration-300 rounded-full"
                  style={{ width: `${weeklyCompletionPercent}%` }}
                ></div>
              </div>

              {/* Mon - Sun Timeline Dots */}
              <div className="grid grid-cols-7 gap-2 pt-1">
                {activeDays.map((_, i) => {
                  const dayNum = i + 1;
                  const isDone = completedDays.includes(dayNum);
                  const isSelected = selectedDayIndex === i;
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedDayIndex(i)}
                      className={`p-2 rounded-lg border text-center cursor-pointer transition text-xs ${
                        isSelected
                          ? 'border-[#8ee6c1]/40 bg-[#8ee6c1]/10 text-[#8ee6c1]'
                          : isDone
                          ? 'border-white/[0.18] bg-white/[0.02] text-white'
                          : 'border-white/[0.08] bg-white/[0.01] text-[#6f7682] hover:border-white/[0.16]'
                      }`}
                    >
                      <span className="text-[10px] font-bold block mb-1">Day {dayNum}</span>
                      <div className={`w-2 h-2 rounded-full mx-auto ${
                        isDone ? 'bg-white' : isSelected ? 'bg-[#8ee6c1]' : 'bg-white/[0.15]'
                      }`}></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notification if feedback applied */}
            {feedbackApplied && (
              <div className="bg-[#8ee6c1]/10 border border-[#8ee6c1]/25 text-[#8ee6c1] rounded-xl p-3.5 text-xs">
                <strong>Plan Updated:</strong> Applied your instruction: <em>"{feedbackMessage}"</em>. Your baseline original plan is preserved below for direct comparison.
              </div>
            )}

            {/* INTERACTIVE EQUIPMENT ENVIRONMENT CONTROL CENTER */}
            <div className="bg-white/[0.035] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6f7682]">
                    Training Environment
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    userEquipment === 'bodyweight'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : userEquipment === 'minimal'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                  }`}>
                    {userEquipment === 'bodyweight' ? '🤸 100% Calisthenics' : userEquipment === 'minimal' ? '⚡ Dumbbells & Bands' : '🏋️ Full Gym Heavy'}
                  </span>
                </div>
                <p className="text-xs text-[#8f96a3] mt-0.5">
                  Seamlessly toggle exercises between Full Gym, Zero Equipment (Bodyweight), and Minimal Gear with identical timers, voice coaching, and 60 FPS video demos.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  type="button"
                  onClick={() => handleSwitchEquipmentMode('bodyweight')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    userEquipment === 'bodyweight'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/40'
                      : 'bg-white/[0.03] hover:bg-white/[0.08] text-[#a7adb7] hover:text-white border-white/[0.08]'
                  }`}
                  title="Switch all exercises to 100% Bodyweight / Zero Equipment"
                >
                  <span>🤸</span>
                  <span>Zero Equipment</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchEquipmentMode('minimal')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    userEquipment === 'minimal'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/40'
                      : 'bg-white/[0.03] hover:bg-white/[0.08] text-[#a7adb7] hover:text-white border-white/[0.08]'
                  }`}
                  title="Switch all exercises to Minimal Dumbbell & Band Gear"
                >
                  <span>⚡</span>
                  <span>Minimal Kit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchEquipmentMode('gym')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    userEquipment === 'gym'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-[0_0_12px_rgba(14,165,233,0.3)] ring-1 ring-sky-400/40'
                      : 'bg-white/[0.03] hover:bg-white/[0.08] text-[#a7adb7] hover:text-white border-white/[0.08]'
                  }`}
                  title="Switch all exercises to Full Commercial Gym Equipment"
                >
                  <span>🏋️</span>
                  <span>Full Gym</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowEquipmentMatrixModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.12] transition cursor-pointer"
                  title="Open side-by-side Equipment Matrix"
                >
                  <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span className="hidden sm:inline">Compare Gear</span>
                </button>
              </div>
            </div>

            {/* TODAY'S WORKOUT SPOTLIGHT PANEL (Primary Glass Focus Panel) */}
            {activeDay && (
              <div className="bg-white/[0.045] backdrop-blur-xl border border-white/[0.1] rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
                  {/* Day Tabs */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {activeDays.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedDayIndex(idx)}
                        className={`px-3 py-1 rounded text-xs font-mono font-semibold transition ${
                          selectedDayIndex === idx
                            ? 'bg-white/[0.1] text-[#8ee6c1] border border-[#8ee6c1]/30'
                            : 'text-[#6f7682] hover:text-white hover:bg-white/[0.03]'
                        }`}
                      >
                        Day 0{idx + 1}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs text-[#6f7682]">
                    Interactive Checklist Active
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6f7682] block mb-0.5">
                      Today's Focus
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {activeDay.day} — {activeDay.focus}
                    </h2>
                    
                    {/* Voice Coach & Teach Me Quick Actions */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          speakCoach(`Welcome to Day ${selectedDayIndex + 1} of your program: ${activeDay.focus}. Your warm-up is ${activeDay.warm_up}. Main workout consists of ${activeDay.main_workout.length} compound exercises with structured rest intervals. Let's make every rep count.`);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.09] text-white border border-white/[0.1] hover:border-[var(--accent)]/40 transition cursor-pointer"
                        title="Listen to Coach Voice Briefing for Today"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>Coach Audio Briefing</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openVideoDemoClass(activeDay.main_workout[0]?.exercise_name || 'Barbell Bench Press')}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--accent)]/15 hover:bg-[var(--accent)]/25 text-white border border-[var(--accent)]/40 transition cursor-pointer"
                        title="Generate video demo class for today's lead exercise"
                      >
                        <Video className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>Teach Me: Lead Exercise Class</span>
                      </button>
                    </div>
                  </div>

                  {/* Cinematic Biometric Waveform Telemetry Indicator */}
                  <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.08] backdrop-blur-md self-start sm:self-auto">
                    <div className="flex items-end gap-1 h-4">
                      {[60, 100, 40, 80, 50, 90, 70, 100, 45, 85].map((val, idx) => (
                        <div
                          key={idx}
                          className="w-1 rounded-full transition-all duration-300"
                          style={{
                            height: `${val}%`,
                            backgroundColor: currentAccentHex,
                            opacity: 0.4 + (idx % 3) * 0.28,
                            animation: `ambientDrift ${1.5 + (idx % 4) * 0.4}s ease-in-out infinite alternate`
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-[10px] font-mono leading-none">
                      <span className="text-[#a7adb7] block">METABOLIC METRICS</span>
                      <span className="font-bold mt-0.5 block" style={{ color: currentAccentHex }}>
                        HR TARGET: 135-155 BPM
                      </span>
                    </div>
                  </div>
                </div>

                {/* BUILT-IN WORKOUT STOPWATCH & REST INTERVAL TRACKER */}
                <div className="bg-[#0b0e14]/80 border border-white/[0.1] rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden transition-all duration-300">
                  {/* Rest completed alert banner */}
                  {restJustCompleted && (
                    <div className="mb-4 p-3 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/40 flex items-center justify-between text-xs animate-pulse">
                      <div className="flex items-center gap-2 text-white">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                        <span className="font-bold text-[var(--accent)]">Rest Interval Completed!</span>
                        <span className="text-[#a7adb7]">Ready for your next set of {activeExerciseResting || 'exercise'}.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRestJustCompleted(false)}
                        className="text-[11px] font-bold text-white hover:text-[var(--accent)] px-2 py-0.5 cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                    {/* Left: Mode & Active Info */}
                    <div className="flex-1 space-y-2 text-center md:text-left w-full">
                      <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                        <div className="flex p-0.5 rounded-lg bg-black/50 border border-white/[0.08]">
                          <button
                            type="button"
                            onClick={() => {
                              setTimerMode('rest');
                              setIsTimerActive(false);
                              setTimerSeconds(timerDuration);
                              setRestJustCompleted(false);
                            }}
                            className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                              timerMode === 'rest'
                                ? 'bg-white/[0.14] text-white shadow-sm'
                                : 'text-[#6f7682] hover:text-[#a7adb7]'
                            }`}
                          >
                            Rest Countdown
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTimerMode('stopwatch');
                              setIsTimerActive(false);
                              setTimerSeconds(0);
                              setRestJustCompleted(false);
                            }}
                            className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                              timerMode === 'stopwatch'
                                ? 'bg-white/[0.14] text-white shadow-sm'
                                : 'text-[#6f7682] hover:text-[#a7adb7]'
                            }`}
                          >
                            Stopwatch
                          </button>
                        </div>

                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-white/[0.04] text-[#a7adb7] border border-white/[0.06]">
                          {isTimerActive ? (timerMode === 'rest' ? 'Resting...' : 'Timing Set...') : 'Standby'}
                        </span>
                      </div>

                      <div className="text-xs text-[#a7adb7]">
                        {activeExerciseResting ? (
                          <span>Target Exercise: <strong className="text-white font-medium">{activeExerciseResting}</strong></span>
                        ) : (
                          <span>Tap any <strong className="text-[var(--accent)] font-medium">⏱️ Rest</strong> button below to time intervals directly</span>
                        )}
                      </div>

                      {/* Quick Preset Pills */}
                      {timerMode === 'rest' && (
                        <div className="flex items-center justify-center md:justify-start gap-1.5 pt-0.5 flex-wrap">
                          <span className="text-[10px] text-[#6f7682] font-mono mr-1">Quick Presets:</span>
                          {[30, 45, 60, 75, 90, 120].map((sec) => (
                            <button
                              key={sec}
                              type="button"
                              onClick={() => setPresetRest(sec)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                                timerDuration === sec && timerMode === 'rest'
                                  ? 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/40 font-bold'
                                  : 'bg-white/[0.03] text-[#a7adb7] hover:text-white border border-white/[0.08] hover:border-white/[0.2]'
                              }`}
                            >
                              {sec}s
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right: Digital Clock Display & Controls */}
                    <div className="flex items-center gap-3.5 shrink-0">
                      {/* Digital Clock with ambient border */}
                      <div className="relative flex items-center justify-center w-28 h-18 rounded-xl bg-black/60 border border-white/[0.14] shadow-inner">
                        <div className="text-center">
                          <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-tight text-white select-none">
                            {formatTimerDisplay(timerSeconds)}
                          </div>
                          <span className="text-[9px] font-mono uppercase tracking-wider text-[#6f7682] block -mt-0.5">
                            {timerMode === 'rest' ? 'Remaining' : 'Elapsed'}
                          </span>
                        </div>
                        {isTimerActive && (
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
                        )}
                      </div>

                      {/* Primary Action Buttons */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleToggleTimer}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md bg-[var(--accent)] text-[#07090d] hover:brightness-110 active:scale-95"
                          >
                            {isTimerActive ? (
                              <>
                                <Pause className="w-3.5 h-3.5" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Start</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={handleResetTimer}
                            className="p-2 rounded-xl text-xs font-semibold transition cursor-pointer bg-white/[0.06] hover:bg-white/[0.12] text-[#a7adb7] hover:text-white border border-white/[0.08]"
                            title="Reset timer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {timerMode === 'rest' && (
                          <button
                            type="button"
                            onClick={handleAdd15s}
                            className="px-2 py-1 rounded-lg text-[10px] font-mono transition text-[#a7adb7] hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-center cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Plus className="w-2.5 h-2.5" />
                            <span>15s</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#0e1219]/55 border border-white/[0.08] rounded-xl p-4 space-y-3">
                    <div>
                      <span className="font-bold text-[#a7adb7] uppercase text-[10px] tracking-wider block mb-1">
                        Dynamic Warm-Up (5–10 min)
                      </span>
                      <p className="text-[#a7adb7] leading-relaxed">{activeDay.warm_up}</p>
                    </div>
                    <div className="border-t border-white/[0.08] pt-3">
                      <span className="font-bold text-[#a7adb7] uppercase text-[10px] tracking-wider block mb-1">
                        Recovery & Cool-Down
                      </span>
                      <p className="text-[#6f7682] leading-relaxed">{activeDay.cool_down}</p>
                    </div>
                  </div>

                  <div className="bg-[#0e1219]/55 border border-white/[0.08] rounded-xl p-4">
                    <span className="font-bold text-[#a7adb7] uppercase text-[10px] tracking-wider block mb-2">
                      Main Workout Exercises (Tap ⏱️ to Time Rest)
                    </span>
                    <ul className="space-y-2">
                      {activeDay.main_workout.map((ex, i) => {
                        const isDone = !!completedExercises[`${selectedDayIndex}-${i}`];
                        const isThisRestActive = isTimerActive && activeExerciseResting === ex.exercise_name;
                        const eqCategory = ex.equipment_category || detectEquipmentCategory(ex.exercise_name, ex.equipment_needed);
                        const isBodyweight = eqCategory === 'bodyweight';
                        const isMinimal = eqCategory === 'minimal';
                        const isGym = eqCategory === 'gym';
                        const isSwapOpen = swappingExerciseKey === `${selectedDayIndex}-${i}`;

                        return (
                          <li
                            key={i}
                            className={`p-2.5 rounded-lg border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                              isThisRestActive
                                ? 'bg-[var(--accent)]/[0.07] border-[var(--accent)]/50 ring-1 ring-[var(--accent)]/30'
                                : isDone
                                ? 'bg-white/[0.02] border-white/[0.04] opacity-55'
                                : 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.16]'
                            }`}
                          >
                            <div 
                              onClick={() => toggleCheck(selectedDayIndex, i)}
                              className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 ${
                                isDone ? 'bg-[var(--accent)] border-[var(--accent)] text-[#07090d] font-bold' : 'border-white/20'
                              }`}>
                                {isDone && '✓'}
                              </div>
                              <div className="truncate">
                                <span className={`font-medium block truncate text-xs sm:text-sm ${isDone ? 'line-through text-[#6f7682]' : 'text-white'}`}>
                                  {ex.exercise_name}
                                </span>
                                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                                  <span className="text-[10px] font-mono text-[#6f7682]">
                                    {ex.sets} × {ex.reps_or_duration}
                                  </span>
                                  <span className="text-[#4a515c] text-[10px]">•</span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                                    isBodyweight 
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                      : isMinimal 
                                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                                      : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                                  }`}>
                                    {isBodyweight ? '🤸 Zero Gear' : isMinimal ? '⚡ Dumbbell/Band' : '🏋️ Full Gym'}
                                  </span>
                                  {ex.target_muscle && (
                                    <span className="text-[9px] text-[#6f7682] hidden md:inline">
                                      ({ex.target_muscle})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                              {/* Interactive Equipment Swap Dropdown Button */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSwappingExerciseKey(isSwapOpen ? null : `${selectedDayIndex}-${i}`);
                                  }}
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer border ${
                                    isSwapOpen
                                      ? 'bg-white/20 text-white border-white/40 ring-1 ring-white/30'
                                      : 'bg-white/[0.04] hover:bg-white/[0.09] text-[#a7adb7] hover:text-white border-white/[0.08]'
                                  }`}
                                  title="Swap equipment variant for this exercise (Zero Gear / Minimal / Gym)"
                                >
                                  <Shuffle className="w-3 h-3 text-[var(--accent)]" />
                                  <span className="hidden md:inline">Swap Gear</span>
                                </button>

                                {isSwapOpen && (
                                  <div 
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 top-full mt-1.5 z-40 w-60 rounded-xl bg-[#0c1017] border border-white/[0.14] p-2 shadow-2xl backdrop-blur-xl animate-fadeIn space-y-1.5"
                                  >
                                    <div className="text-[9px] font-bold uppercase tracking-wider text-[#6f7682] px-2 py-0.5 border-b border-white/[0.08] flex items-center justify-between">
                                      <span>Swap Equipment Option:</span>
                                      <button 
                                        onClick={() => setSwappingExerciseKey(null)}
                                        className="text-[#6f7682] hover:text-white"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleSwapSingleExercise(selectedDayIndex, i, 'bodyweight');
                                        setSwappingExerciseKey(null);
                                      }}
                                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-[11px] transition ${
                                        isBodyweight 
                                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' 
                                          : 'hover:bg-white/[0.06] text-[#b3b9c4]'
                                      }`}
                                    >
                                      <span className="flex items-center gap-1.5">
                                        <span>🤸</span> Zero Gear (Bodyweight)
                                      </span>
                                      {isBodyweight && <Check className="w-3 h-3 text-emerald-400" />}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleSwapSingleExercise(selectedDayIndex, i, 'minimal');
                                        setSwappingExerciseKey(null);
                                      }}
                                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-[11px] transition ${
                                        isMinimal 
                                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40' 
                                          : 'hover:bg-white/[0.06] text-[#b3b9c4]'
                                      }`}
                                    >
                                      <span className="flex items-center gap-1.5">
                                        <span>⚡</span> Minimal Kit (Dumbbell/Band)
                                      </span>
                                      {isMinimal && <Check className="w-3 h-3 text-amber-400" />}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleSwapSingleExercise(selectedDayIndex, i, 'gym');
                                        setSwappingExerciseKey(null);
                                      }}
                                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-[11px] transition ${
                                        isGym 
                                          ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40' 
                                          : 'hover:bg-white/[0.06] text-[#b3b9c4]'
                                      }`}
                                    >
                                      <span className="flex items-center gap-1.5">
                                        <span>🏋️</span> Full Gym Equipment
                                      </span>
                                      {isGym && <Check className="w-3 h-3 text-sky-400" />}
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Teach Me (Video Demo Class) Button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openVideoDemoClass(ex.exercise_name);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold bg-white/[0.05] hover:bg-[var(--accent)]/20 hover:text-[var(--accent)] text-white border border-white/[0.1] hover:border-[var(--accent)]/40 transition cursor-pointer"
                                title={`Open interactive video demo class for ${ex.exercise_name}`}
                              >
                                <Video className="w-3 h-3 text-[var(--accent)]" />
                                <span className="hidden sm:inline">Teach Me</span>
                              </button>

                              {/* Voice Coach Form Cue Button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const customCue = ex.form_cue ? `Coach ${activeCoach.name} form cue for ${ex.exercise_name}: ${ex.form_cue}` : `Coach ${activeCoach.name} form cue for ${ex.exercise_name}: Lock your core, keep your spine neutral, and control the eccentric tempo.`;
                                  speakCoach(customCue);
                                }}
                                className="p-1 rounded text-[11px] text-[#a7adb7] hover:text-[var(--accent)] bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition cursor-pointer"
                                title="Listen to Voice Coach form cue"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>

                              {/* Direct Exercise Rest Trigger Button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startExerciseRest(ex.exercise_name, ex.rest);
                                }}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition cursor-pointer ${
                                  isThisRestActive
                                    ? 'bg-[var(--accent)] text-[#07090d] font-bold shadow-[0_0_8px_var(--accent)]'
                                    : 'bg-white/[0.04] hover:bg-[var(--accent)]/20 hover:text-[var(--accent)] text-[#a7adb7] border border-white/[0.08]'
                                }`}
                                title={`Start ${ex.rest} rest countdown for ${ex.exercise_name}`}
                              >
                                <Timer className="w-3 h-3" />
                                <span>{isThisRestActive ? `${timerSeconds}s` : ex.rest}</span>
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* NUTRITION & RECOVERY CARD */}
            <div className="bg-white/[0.035] border border-white/[0.08] rounded-2xl p-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5 mb-3">
                <h3 className="font-bold text-white text-sm">Nutrition & Recovery Guidance</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6f7682]">Gemini Flash Protocol</span>
              </div>
              <p className="text-xs text-[#a7adb7] leading-relaxed bg-[#0e1219]/45 border-l-2 border-[#8ee6c1] p-3 rounded-r-lg">
                {nutritionTip}
              </p>
            </div>

            {/* REVISED PLAN CARD (IF FEEDBACK SUBMITTED) */}
            {updatedPlanText && (
              <div className="bg-white/[0.035] border border-[#8ee6c1]/30 rounded-2xl p-5 space-y-2.5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8ee6c1]">
                    Active Revision • SQLite Preserved
                  </span>
                  <h3 className="font-bold text-white text-base">Updated Workout Plan (Revised Based on Feedback)</h3>
                </div>
                <div className="bg-[#05070a] border border-white/[0.08] rounded-lg p-3 overflow-x-auto">
                  <pre className="text-xs font-mono text-[#a7adb7] leading-relaxed whitespace-pre-wrap">
                    {updatedPlanText}
                  </pre>
                </div>
              </div>
            )}

            {/* 7-DAY SCHEDULE CARDS GRID */}
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {updatedPlanText ? 'Original Baseline Workout Plan (Preserved)' : '7-Day Complete Schedule'}
                </h3>
                <p className="text-xs text-[#6f7682]">
                  Structured progression with targeted volume, intervals and daily recovery.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeDays.map((day, idx) => (
                  <div
                    key={idx}
                    className="bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.16] rounded-xl p-4 flex flex-col justify-between transition"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-2">
                        <span className="text-[11px] font-mono font-bold text-[#8ee6c1]">{day.day}</span>
                        {completedDays.includes(idx + 1) && (
                          <span className="text-[10px] font-bold text-white bg-white/[0.08] px-2 py-0.5 rounded">
                            Logged
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-xs mb-2.5">{day.focus}</h4>

                      <div className="space-y-2 text-[11px] text-[#a7adb7]">
                        <div>
                          <span className="text-[#6f7682] uppercase text-[9px] font-bold block mb-0.5">Warm-up</span>
                          <p className="text-[#6f7682] leading-tight">{day.warm_up}</p>
                        </div>
                        <div>
                          <span className="text-[#6f7682] uppercase text-[9px] font-bold block mb-1">Exercises</span>
                          <ul className="space-y-1">
                            {day.main_workout.map((ex, i) => (
                              <li key={i} className="flex justify-between items-center bg-white/[0.02] p-1 rounded">
                                <span className="truncate pr-2">{ex.exercise_name}</span>
                                <span className="text-[#6f7682] font-mono shrink-0">{ex.sets}×{ex.reps_or_duration}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CUSTOMIZE YOUR PLAN (FEEDBACK PANEL) */}
            <div className="bg-white/[0.035] border border-white/[0.08] rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="font-bold text-white text-base">Customize Your Plan</h3>
                <p className="text-xs text-[#6f7682]">
                  Tell FitBuddy what should change. Your original plan will remain preserved in SQLite.
                </p>
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#6f7682]">Suggested:</span>
                <button
                  type="button"
                  onClick={() => setCurrentFeedback('Add more cardio and one yoga recovery session')}
                  className="text-xs bg-white/[0.03] hover:bg-white/[0.06] text-[#a7adb7] border border-white/[0.08] px-2.5 py-1 rounded-full transition"
                >
                  Add cardio & yoga
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentFeedback('Include dedicated mobility work on Day 4')}
                  className="text-xs bg-white/[0.03] hover:bg-white/[0.06] text-[#a7adb7] border border-white/[0.08] px-2.5 py-1 rounded-full transition"
                >
                  Include mobility
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentFeedback('Reduce training volume and intensity')}
                  className="text-xs bg-white/[0.03] hover:bg-white/[0.06] text-[#a7adb7] border border-white/[0.08] px-2.5 py-1 rounded-full transition"
                >
                  Reduce intensity
                </button>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#a7adb7] uppercase tracking-wider mb-1.5">
                    Modification Instructions *
                  </label>
                  <textarea
                    rows={3}
                    value={currentFeedback}
                    onChange={(e) => setCurrentFeedback(e.target.value)}
                    required
                    placeholder="Example: reduce lower-body volume and add one recovery session."
                    className="w-full bg-[#0e1219]/60 border border-white/[0.1] focus:border-white/30 rounded-lg p-3 text-xs text-white placeholder-[#6f7682] outline-none transition"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="submit"
                    className="bg-[#f5f7fa] hover:bg-white text-[#07090d] font-bold px-5 py-2 rounded-lg text-xs transition"
                  >
                    <span>Update Plan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('home')}
                    className="text-xs bg-white/[0.04] hover:bg-white/[0.08] text-[#a7adb7] border border-white/[0.08] px-4 py-2 rounded-lg transition"
                  >
                    Create New Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('admin')}
                    className="text-xs bg-white/[0.04] hover:bg-white/[0.08] text-[#a7adb7] border border-white/[0.08] px-4 py-2 rounded-lg transition"
                  >
                    Admin Console
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: ADMIN VIEW (/view-all-users) */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8ee6c1]">
                  Database Audit & Administration
                </span>
                <h1 className="text-2xl font-bold text-white mt-0.5">User Program Registry</h1>
                <p className="text-xs text-[#6f7682]">
                  Inspect all generated 7-day periodization plans, baseline routines, and feedback revisions stored in SQLite.
                </p>
              </div>

              {/* Search Filter */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#6f7682] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder="Filter records..."
                  className="w-full bg-[#0e1219]/60 border border-white/[0.1] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#6f7682] outline-none focus:border-white/30 transition"
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/[0.035] border border-white/[0.08] rounded-xl p-3.5">
                <span className="text-[10px] font-bold text-[#6f7682] uppercase tracking-wider block">Total Registered Users</span>
                <span className="text-xl font-bold text-white block mt-0.5">{storedRecords.length}</span>
              </div>
              <div className="bg-white/[0.035] border border-white/[0.08] rounded-xl p-3.5">
                <span className="text-[10px] font-bold text-[#6f7682] uppercase tracking-wider block">Revised via Feedback</span>
                <span className="text-xl font-bold text-[#8ee6c1] block mt-0.5">
                  {storedRecords.filter(r => !!r.updatedPlan).length}
                </span>
              </div>
              <div className="bg-white/[0.035] border border-white/[0.08] rounded-xl p-3.5">
                <span className="text-[10px] font-bold text-[#6f7682] uppercase tracking-wider block">Baseline Only</span>
                <span className="text-xl font-bold text-white block mt-0.5">
                  {storedRecords.filter(r => !r.updatedPlan).length}
                </span>
              </div>
            </div>

            {/* Records */}
            <div className="space-y-3">
              {filteredRecords.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/[0.035] border border-white/[0.08] rounded-xl p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#6f7682]">#{item.id}</span>
                      <span className="font-bold text-white text-sm">{item.username}</span>
                      <span className="font-mono text-[11px] text-[#8ee6c1] bg-[#8ee6c1]/10 px-2 py-0.5 rounded border border-[#8ee6c1]/20">
                        {item.userId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.updatedPlan 
                          ? 'bg-[#8ee6c1]/10 text-[#8ee6c1] border border-[#8ee6c1]/25' 
                          : 'bg-white/[0.05] text-[#a7adb7] border border-white/[0.08]'
                      }`}>
                        {item.updatedPlan ? 'Revised' : 'Baseline'}
                      </span>
                      <span className="text-xs text-[#6f7682]">{item.createdAt}</span>
                    </div>
                  </div>

                  <div className="text-xs text-[#a7adb7]">
                    {item.age} yrs • {item.weight} kg • {item.goal} • {item.intensity}
                  </div>

                  <div className="text-xs text-[#a7adb7] bg-black/25 border-l-2 border-[#8ee6c1] p-2.5 rounded-r">
                    <span className="text-[9px] font-bold uppercase text-[#6f7682] block mb-0.5">Nutrition Tip</span>
                    {item.nutritionTip}
                  </div>

                  <details className="bg-black/30 border border-white/[0.06] p-2 rounded text-xs">
                    <summary className="font-bold text-[#a7adb7] cursor-pointer text-[11px]">
                      View Original Plan
                    </summary>
                    <pre className="mt-2 text-[10px] font-mono text-[#6f7682] max-h-32 overflow-y-auto whitespace-pre-wrap">
                      {item.originalPlan}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DEPLOYMENT MANUAL */}
        {activeTab === 'deployment' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8ee6c1]">
                FitBuddy Architecture & Operations
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">
                FastAPI Local Deployment & API Testing
              </h1>
              <p className="text-xs text-[#6f7682] mt-0.5">
                Run the full-stack FastAPI application with Uvicorn and test live endpoints.
              </p>
            </div>

            <div className="bg-white/[0.035] border border-white/[0.08] rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-white block">Local Launch Command:</span>
              <div className="bg-[#05070a] border border-white/[0.08] rounded-lg p-3 font-mono text-xs text-[#8ee6c1]">
                uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white/[0.035] border border-white/[0.08] rounded-xl p-4 space-y-2">
                <span className="font-bold text-white block">API Documentation</span>
                <p className="text-[#a7adb7]">Interactive Swagger UI & ReDoc endpoints:</p>
                <div className="space-y-1 font-mono text-[#8ee6c1]">
                  <div>/docs (Swagger UI)</div>
                  <div>/redoc (ReDoc)</div>
                </div>
              </div>

              <div className="bg-white/[0.035] border border-white/[0.08] rounded-xl p-4 space-y-2">
                <span className="font-bold text-white block">Core Endpoints</span>
                <p className="text-[#a7adb7]">Verified FastAPI routes:</p>
                <div className="space-y-1 font-mono text-[#a7adb7]">
                  <div>GET / (Home Form)</div>
                  <div>POST /generate-workout</div>
                  <div>POST /submit-feedback</div>
                  <div>GET /view-all-users</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* RESTRAINED SESSION COMPLETION DIALOG (No Confetti, No Emojis) */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-[#07090d]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0d1017] border border-white/[0.1] rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8ee6c1]">
              Session Complete
            </div>
            <h3 className="text-xl font-bold text-white">Day 0{completedDayNumber} Completed</h3>
            <p className="text-xs text-[#a7adb7] leading-relaxed">
              All scheduled exercises for Day 0{completedDayNumber} have been logged into your training log. Weekly consistency updated.
            </p>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 flex justify-around text-xs">
              <div>
                <span className="text-[#6f7682] block text-[10px] uppercase font-bold">Sessions</span>
                <span className="font-bold text-white text-sm">{completedDays.length} / 7</span>
              </div>
              <div className="border-r border-white/[0.08]"></div>
              <div>
                <span className="text-[#6f7682] block text-[10px] uppercase font-bold">Adherence</span>
                <span className="font-bold text-[#8ee6c1] text-sm">{weeklyCompletionPercent}%</span>
              </div>
            </div>

            <button
              onClick={() => setShowCompletionModal(false)}
              className="w-full bg-[#f5f7fa] hover:bg-white text-[#07090d] font-bold py-2.5 rounded-lg text-xs transition"
            >
              Continue Training
            </button>
          </div>
        </div>
      )}

      {/* SYSTEM STATUS OVERLAY */}
      {isGenerating && (
        <div className="fixed inset-0 bg-[#07090d]/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#0d1017] border border-white/[0.1] rounded-2xl p-6 text-center space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#8ee6c1]">Building Your Plan</div>
            <div className="text-base font-bold text-white">{generationStep}</div>
            <div className="w-full bg-white/[0.08] h-1 rounded-full overflow-hidden">
              <div 
                className="bg-[#8ee6c1] h-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-[#6f7682]">Processing biometric metrics and periodization</div>
          </div>
        </div>
      )}

      {/* SYSTEM UPDATE OVERLAY */}
      {isUpdating && (
        <div className="fixed inset-0 bg-[#07090d]/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#0d1017] border border-white/[0.1] rounded-2xl p-6 text-center space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#8ee6c1]">Updating Plan</div>
            <div className="text-base font-bold text-white">{updatingStep}</div>
            <div className="w-full bg-white/[0.08] h-1 rounded-full overflow-hidden">
              <div 
                className="bg-[#8ee6c1] h-full transition-all duration-300"
                style={{ width: `${updatingProgress}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-[#6f7682]">Rebalancing weekly schedule while preserving baseline</div>
          </div>
        </div>
      )}

      {/* Floating Live Voice Coach Speech Subtitles HUD */}
      {currentCoachSpeech && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[92%] bg-[#0c1017]/95 backdrop-blur-xl border border-[var(--accent)]/40 rounded-2xl p-3.5 shadow-[0_15px_35px_rgba(0,0,0,0.8)] flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div 
              className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `rgba(${accentRgb}, 0.2)`, color: currentAccentHex }}
            >
              <Mic className={`w-3.5 h-3.5 ${isCoachSpeaking ? 'animate-pulse' : ''}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold" style={{ color: currentAccentHex }}>
                <span>{activeCoach.name.toUpperCase()}</span>
                <span className="text-[#6f7682]">•</span>
                <span className="text-[#a7adb7]">{isCoachSpeaking ? 'SPEAKING' : 'AUDIO CUE'}</span>
              </div>
              <p className="text-xs text-white font-medium truncate sm:whitespace-normal">
                "{currentCoachSpeech}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => speakCoach(currentCoachSpeech, true)}
              className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs transition cursor-pointer"
              title="Replay Voice Cue"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentCoachSpeech(null);
                window.speechSynthesis?.cancel();
                setIsCoachSpeaking(false);
              }}
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#a7adb7] hover:text-white text-xs transition cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Scalable XP Reward Indicator Tokens */}
      <div className="fixed top-20 right-6 z-50 pointer-events-none flex flex-col gap-2">
        {floatingXpTokens.map((token) => (
          <div
            key={token.id}
            className="px-3.5 py-1.5 rounded-full bg-[#0c1017]/95 border text-white shadow-2xl flex items-center gap-2 animate-bounce font-mono text-xs"
            style={{ 
              borderColor: currentAccentHex,
              boxShadow: `0 0 15px rgba(${accentRgb}, 0.35)`
            }}
          >
            <Zap className="w-3.5 h-3.5 fill-current" style={{ color: currentAccentHex }} />
            <span className="font-bold" style={{ color: currentAccentHex }}>+{token.amount} XP</span>
            <span className="text-[#a7adb7] text-[10px] hidden sm:inline">({token.text})</span>
          </div>
        ))}
      </div>

      {/* Scalable XP & Level Progression Modal */}
      <XpLevelModal
        isOpen={isXpModalOpen}
        onClose={() => setIsXpModalOpen(false)}
        totalXp={totalXp}
        onGrantXp={(amt, src) => grantXp(amt, src)}
        xpHistory={xpHistory}
        accentRgb={accentRgb}
        currentAccentHex={currentAccentHex}
      />

      {/* Level Up Celebration Fanfare Modal */}
      <LevelUpCelebrationModal
        isOpen={isLevelUpModalOpen}
        onClose={() => setIsLevelUpModalOpen(false)}
        newLevel={newUnlockedLevel}
        accentRgb={accentRgb}
        currentAccentHex={currentAccentHex}
      />

      {/* Live AI Feature Diagnostics Modal */}
      <LiveAiTestModal
        isOpen={isAiTestModalOpen}
        onClose={() => setIsAiTestModalOpen(false)}
        accentRgb={accentRgb}
        currentAccentHex={currentAccentHex}
        onTestVoice={() => speakCoach(`Live AI test confirmed. Coach ${activeCoach.name} operational.`)}
      />

      {/* Video Demo Class Studio Modal */}
      <VideoDemoClassModal
        isOpen={isVideoDemoOpen}
        onClose={() => setIsVideoDemoOpen(false)}
        initialExerciseName={videoDemoExercise}
        accentRgb={accentRgb}
        currentAccentHex={currentAccentHex}
        coachPersona={activeCoach.name}
        onSpeak={(text) => speakCoach(text, false)}
        isVoiceCoachEnabled={isVoiceCoachEnabled}
        allExercises={activeDay?.main_workout.map(e => e.exercise_name) || []}
      />

      {/* Equipment Comparison Matrix Modal */}
      <EquipmentComparisonModal
        isOpen={showEquipmentMatrixModal}
        onClose={() => setShowEquipmentMatrixModal(false)}
        currentEquipment={userEquipment}
        onSelectEquipmentMode={(mode) => {
          handleSwitchEquipmentMode(mode);
          setShowEquipmentMatrixModal(false);
        }}
        onOpenVideoDemo={(name) => {
          setShowEquipmentMatrixModal(false);
          openVideoDemoClass(name);
        }}
        onSpeakCoach={(msg) => speakCoach(msg)}
        accentRgb={accentRgb}
        currentAccentHex={currentAccentHex}
      />

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#07090d] py-5 text-center text-xs text-[#4a515c]">
        FitBuddy • Naan Mudhalvan SkillWallet Project • Powered by Google Gemini
      </footer>
    </div>
  );
}
