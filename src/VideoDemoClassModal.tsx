import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  X, 
  Clock, 
  SlidersHorizontal, 
  CheckCircle2, 
  Eye, 
  Sparkles,
  Zap,
  Activity,
  Layers,
  ChevronDown
} from 'lucide-react';

interface VideoDemoClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExerciseName: string;
  accentRgb: string;
  currentAccentHex: string;
  coachPersona: string;
  onSpeak: (text: string) => void;
  isVoiceCoachEnabled: boolean;
  allExercises?: string[];
}

export type ClassDuration = 30 | 60 | 120 | 180;
export type CameraAngle = 'side' | 'front' | 'heatmap';

interface ExerciseDetail {
  name: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  tempo: string;
  keyCues: string[];
  commonMistakes: string;
  voiceScript: { timePercent: number; script: string }[];
}

const EXERCISE_KNOWLEDGE_BASE: Record<string, ExerciseDetail> = {
  'Bench Press': {
    name: 'Barbell Bench Press',
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoids'],
    secondaryMuscles: ['Triceps Brachii', 'Serratus Anterior'],
    equipment: 'Olympic Barbell & Flat Bench',
    tempo: '3-1-1-0 (Eccentric 3s, Pause 1s, Drive 1s)',
    keyCues: [
      'Retract and pin shoulder blades down into the bench',
      'Maintain steady five-point contact: feet, glutes, upper back, head',
      'Lower bar with control to lower sternum at a 45° elbow angle',
      'Drive through the floor and press bar up in a gentle arc'
    ],
    commonMistakes: 'Bouncing bar off chest or flaring elbows out at 90 degrees.',
    voiceScript: [
      { timePercent: 0, script: 'Welcome to your technique masterclass. Set your feet flat, pull your scapulae together, and grip the bar firmly.' },
      { timePercent: 20, script: 'Begin the eccentric descent. Three seconds down to your lower sternum. Keep elbows tucked at 45 degrees.' },
      { timePercent: 50, script: 'Brief pause on the chest without resting the weight. Maintain maximum abdominal tension.' },
      { timePercent: 75, script: 'Explode up! Drive through your feet and press the bar vertically over your shoulders.' },
      { timePercent: 95, script: 'Excellent execution. Lock out with control and prepare for the next rep.' }
    ]
  },
  'Squat': {
    name: 'Barbell Back Squat',
    targetMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Erector Spinae', 'Abdominals'],
    equipment: 'Power Rack & Barbell',
    tempo: '3-1-1-0 (Descent 3s, Hole Pause 1s, Ascent 1s)',
    keyCues: [
      'Set feet shoulder-width apart, toes angled out 15 to 30 degrees',
      'Take a deep 360-degree diaphragmatic breath and brace core',
      'Hinge hips back slightly as knees track in line with toes',
      'Hit parallel depth with neutral spine before driving out of the hole'
    ],
    commonMistakes: 'Knees caving inward (valgus collapse) or rounding the lumbar spine.',
    voiceScript: [
      { timePercent: 0, script: 'Welcome to the squat technique lab. Secure the barbell on your upper traps and unrack with balance.' },
      { timePercent: 20, script: 'Take your breath and brace. Break at hips and knees simultaneously. Track knees over toes.' },
      { timePercent: 50, script: 'Reach parallel depth. Keep your chest proud and drive your knees outward.' },
      { timePercent: 75, script: 'Drive up through the midfoot! Squeeze glutes and extend hips forward to lockout.' },
      { timePercent: 95, script: 'Clean repetition. Reset your breathing at the top.' }
    ]
  },
  'Deadlift': {
    name: 'Romanian & Conventional Deadlift',
    targetMuscles: ['Hamstrings', 'Gluteus Maximus', 'Erector Spinae'],
    secondaryMuscles: ['Latissimus Dorsi', 'Forearms', 'Traps'],
    equipment: 'Olympic Barbell & Plates',
    tempo: '2-1-1-0 (Hinge 2s, Stretch 1s, Lockout 1s)',
    keyCues: [
      'Barbell positioned directly over the midfoot',
      'Hinge hips backwards while keeping shins relatively vertical',
      'Engage lats to drag the barbell along your thighs and shins',
      'Drive hips forward to stand tall; do not hyperextend lumbar'
    ],
    commonMistakes: 'Rounding the lower back or letting the barbell drift away from the body.',
    voiceScript: [
      { timePercent: 0, script: 'Deadlift masterclass active. Line the bar over your midfoot and lock your lats back.' },
      { timePercent: 25, script: 'Push your hips straight back. Feel the stretch load into your hamstrings and glutes.' },
      { timePercent: 55, script: 'Bottom of the hinge reached. Keep spine neutral and chin tucked.' },
      { timePercent: 80, script: 'Drive through your heels! Push the floor away and finish standing tall.' }
    ]
  },
  'Shoulder Press': {
    name: 'Overhead Dumbbell Press',
    targetMuscles: ['Anterior & Lateral Deltoids'],
    secondaryMuscles: ['Triceps', 'Upper Trapezius', 'Core'],
    equipment: 'Dumbbells or Barbell',
    tempo: '3-0-1-0 (Lower 3s, Explode 1s)',
    keyCues: [
      'Grip dumbbells with neutral or slight angled wrist',
      'Brace core and squeeze glutes to prevent lower back arching',
      'Press dumbbells overhead in a smooth vertical path',
      'Lower weights under control back to ear level'
    ],
    commonMistakes: 'Arching the lower back excessively or pushing weights too far forward.',
    voiceScript: [
      { timePercent: 0, script: 'Overhead press demo initiated. Lock your core and bring dumbbells to collarbone height.' },
      { timePercent: 25, script: 'Press vertically overhead without hyperextending your lumbar spine.' },
      { timePercent: 60, script: 'Full extension at the top. Biceps finish right beside your ears.' },
      { timePercent: 85, script: 'Lower with a controlled 3-second tempo back to starting position.' }
    ]
  },
  'Pull-Up': {
    name: 'Strict Pull-Up / Chin-Up',
    targetMuscles: ['Latissimus Dorsi', 'Biceps Brachii'],
    secondaryMuscles: ['Rhomboids', 'Rear Deltoids', 'Core'],
    equipment: 'Pull-Up Bar',
    tempo: '2-1-1-1 (Pull 1s, Hold 1s, Lower 2s, Hang 1s)',
    keyCues: [
      'Start from a dead hang with engaged active shoulders',
      'Initiate pull by depressing and retracting shoulder blades',
      'Drive elbows down towards back pockets until chin clears bar',
      'Lower smoothly to full elbow extension under control'
    ],
    commonMistakes: 'Kicking legs or using momentum instead of pure lat engagement.',
    voiceScript: [
      { timePercent: 0, script: 'Pull-up technique session. Full extension at the bottom with active scapular tension.' },
      { timePercent: 30, script: 'Depress shoulders and pull elbows down hard. Guide chin cleanly over the bar.' },
      { timePercent: 65, script: 'Hold peak contraction for one full beat. Feel maximum lat engagement.' },
      { timePercent: 90, script: 'Descend smoothly with complete eccentric control. Do not drop.' }
    ]
  },
  'Lunge': {
    name: 'Walking Lunges / Split Squat',
    targetMuscles: ['Quadriceps', 'Glutes'],
    secondaryMuscles: ['Adductors', 'Calves', 'Core Stabilizers'],
    equipment: 'Bodyweight or Dumbbells',
    tempo: '2-1-1-0',
    keyCues: [
      'Take a balanced stride keeping torso tall and core braced',
      'Lower hips straight down until back knee is just above floor',
      'Keep front knee tracked over second toe, not caving inward',
      'Drive forcefully through front heel to return to standing'
    ],
    commonMistakes: 'Short stride causing front heel to elevate or torso collapsing forward.',
    voiceScript: [
      { timePercent: 0, script: 'Lunge masterclass. Stride forward with an upright posture and locked core.' },
      { timePercent: 35, script: 'Lower straight down into a 90-degree knee bend. Keep weight centered on front heel.' },
      { timePercent: 75, script: 'Push through the floor with your lead leg and step smoothly into the next rep.' }
    ]
  },
  'Push-Up': {
    name: 'Deficit Bodyweight Push-Up / Floor Push-Up',
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoids'],
    secondaryMuscles: ['Triceps Brachii', 'Core Plank Stabilizers', 'Serratus Anterior'],
    equipment: 'Zero Equipment (Bodyweight / Floor)',
    tempo: '3-1-1-0 (3s Descent, 1s Bottom Pause, Explode Up)',
    keyCues: [
      'Set hands slightly wider than shoulder-width, fingers spread for ground stability',
      'Lock core, glutes, and quads to create a completely rigid kinetic plank',
      'Lower chest down with a strict 3-second descent, elbows tucked at a 45° angle',
      'Hover 1 inch off the floor without sagging hips, then drive palms into the floor'
    ],
    commonMistakes: 'Sagging hips (hyperextended lumbar) or elbows flaring out to 90 degrees.',
    voiceScript: [
      { timePercent: 0, script: 'Bodyweight push-up calibration. Establish a rigid plank line from head to heels.' },
      { timePercent: 25, script: 'Control the descent. Three full seconds down, keeping elbows tucked close to your ribs.' },
      { timePercent: 55, script: 'Hover chest just above the floor. Maintain abdominal tension.' },
      { timePercent: 80, script: 'Drive the floor away! Push up with power and finish with locked triceps.' }
    ]
  },
  'Pike Push-Up': {
    name: 'Elevated Pike Push-Ups',
    targetMuscles: ['Anterior & Lateral Deltoids', 'Upper Trapezius'],
    secondaryMuscles: ['Triceps Brachii', 'Clavicular Pec', 'Core Stabilizers'],
    equipment: 'Zero Equipment (Floor or Chair)',
    tempo: '3-1-1-0 (Controlled Descent)',
    keyCues: [
      'Walk feet forward into an inverted V-pike position with hips elevated high',
      'Keep head in line with arms; gaze gently towards your toes',
      'Lower top of head forward between your hands forming a tripod angle',
      'Press through palms and shoulders to return to the inverted V apex'
    ],
    commonMistakes: 'Flattening out into a standard pushup or not pushing head through arms at the top.',
    voiceScript: [
      { timePercent: 0, script: 'Pike push-up session. Elevate your hips high into an inverted V shape.' },
      { timePercent: 30, script: 'Lower the crown of your head forward in a controlled triangular path.' },
      { timePercent: 65, script: 'Press up firmly through your shoulders and drive your head back between your biceps.' }
    ]
  },
  'Inverted Row': {
    name: 'Inverted Table Rows / Towel Rows',
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Mid Trapezius'],
    secondaryMuscles: ['Biceps Brachii', 'Posterior Deltoid', 'Forearms'],
    equipment: 'Zero Equipment (Sturdy Table or Towel around Door)',
    tempo: '2-1-1-0 (Pull 1s, Squeeze 1s, Lower 2s)',
    keyCues: [
      'Grip edge of table with overhand grip or hold secure towel anchor',
      'Keep heels on floor and body in a rigid straight diagonal plank',
      'Pull chest up to touch the table edge by driving elbows behind your torso',
      'Squeeze shoulder blades together forcefully before lowering under control'
    ],
    commonMistakes: 'Sagging hips or initiating pull with arms instead of retracting scapulae.',
    voiceScript: [
      { timePercent: 0, script: 'Inverted row masterclass. Keep your body straight like an iron plank.' },
      { timePercent: 30, script: 'Retract your shoulder blades and pull your chest cleanly up to the anchor.' },
      { timePercent: 65, script: 'Squeeze your mid-back firmly for one beat.' },
      { timePercent: 85, script: 'Lower smoothly to full extension with continuous control.' }
    ]
  },
  'Goblet Squat': {
    name: 'Dumbbell / Kettlebell Goblet Squat',
    targetMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Core Bracing', 'Adductors', 'Upper Back'],
    equipment: 'Single Dumbbell or Kettlebell (Minimal Gear)',
    tempo: '3-1-1-0 (Descent 3s, Pause 1s, Drive 1s)',
    keyCues: [
      'Hold weight vertically against upper sternum with palms cupping the bell',
      'Keep elbows pointing downward inside the knees as you descend',
      'Break at hips and knees simultaneously, reaching parallel depth',
      'Drive through midfoot, keeping chest proud and spine neutral'
    ],
    commonMistakes: 'Letting weight pull chest forward or elbows resting on knees at bottom.',
    voiceScript: [
      { timePercent: 0, script: 'Goblet squat practice. Cup the dumbbell firmly against your collarbone.' },
      { timePercent: 25, script: 'Sit down between your hips. Keep your chest tall and elbows inside your knees.' },
      { timePercent: 55, script: 'Pause in the hole. Do not bounce.' },
      { timePercent: 80, script: 'Drive up through your heels and stand tall with glutes engaged.' }
    ]
  },
  'Floor Press': {
    name: 'Dumbbell Floor Press with Glute Bridge',
    targetMuscles: ['Pectoralis Major', 'Triceps Brachii'],
    secondaryMuscles: ['Anterior Deltoids', 'Glutes', 'Core'],
    equipment: 'Pair of Dumbbells (Minimal Gear)',
    tempo: '3-1-1-0',
    keyCues: [
      'Lie flat on back with knees bent, feet flat on the floor',
      'Optionally elevate hips into a glute bridge for decline pec emphasis',
      'Lower dumbbells until upper arms gently touch the floor at 45° angle',
      'Press dumbbells up without clanking weights at the top'
    ],
    commonMistakes: 'Bouncing triceps hard off the floor instead of a controlled touch-and-go.',
    voiceScript: [
      { timePercent: 0, script: 'Dumbbell floor press. Plant your feet flat and press dumbbells over your chest.' },
      { timePercent: 30, script: 'Lower with a controlled 3-second tempo until your triceps lightly kiss the floor.' },
      { timePercent: 65, script: 'Brief dead-stop pause, then explode upward into full extension.' }
    ]
  }
};

export default function VideoDemoClassModal({
  isOpen,
  onClose,
  initialExerciseName,
  accentRgb,
  currentAccentHex,
  coachPersona,
  onSpeak,
  isVoiceCoachEnabled,
  allExercises = []
}: VideoDemoClassModalProps) {
  // Duration of Video Demo Class (User-chosen suitable time)
  const [selectedDuration, setSelectedDuration] = useState<ClassDuration>(60);
  const [activeExercise, setActiveExercise] = useState<string>(initialExerciseName || 'Barbell Bench Press');
  
  // Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTimeSecs, setCurrentTimeSecs] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [cameraAngle, setCameraAngle] = useState<CameraAngle>('side');
  const [audioNarrationEnabled, setAudioNarrationEnabled] = useState<boolean>(true);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');

  // Class Focus Objective
  const [classFocus, setClassFocus] = useState<'form' | 'tempo' | 'hypertrophy'>('form');

  // Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastSpokenPercentRef = useRef<number>(-1);

  // Match exercise in knowledge base
  const getExerciseDetail = (name: string): ExerciseDetail => {
    const lower = name.toLowerCase();
    for (const key of Object.keys(EXERCISE_KNOWLEDGE_BASE)) {
      if (lower.includes(key.toLowerCase())) {
        return EXERCISE_KNOWLEDGE_BASE[key];
      }
    }
    // Fallback dynamic entry
    return {
      name: name,
      targetMuscles: ['Target Muscle Group', 'Primary Kinetic Chain'],
      secondaryMuscles: ['Stabilizers', 'Core Bracing'],
      equipment: 'Standard Studio Resistance Equipment',
      tempo: '3-1-1-0 Controlled Execution',
      keyCues: [
        'Lock spinal alignment and maintain 360-degree intra-abdominal pressure',
        'Execute controlled 3-second eccentric phase to build mechanical tension',
        'Pause momentarily at full active range of motion',
        'Drive through the concentric phase with explosive intent'
      ],
      commonMistakes: 'Rushing repetitions and using momentum instead of tension.',
      voiceScript: [
        { timePercent: 0, script: `Welcome to your ${name} technique class with Coach ${coachPersona}. Let's dial in perfect form.` },
        { timePercent: 25, script: 'Focus on your setup. Core braced, joints stacked, tempo controlled.' },
        { timePercent: 55, script: 'Reach peak range of motion without sacrificing joint stability.' },
        { timePercent: 85, script: 'Drive through the concentric phase with full control.' }
      ]
    };
  };

  const exerciseInfo = getExerciseDetail(activeExercise);

  // Sync initial exercise
  useEffect(() => {
    if (initialExerciseName) {
      setActiveExercise(initialExerciseName);
      setCurrentTimeSecs(0);
      lastSpokenPercentRef.current = -1;
      setIsPlaying(true);
    }
  }, [initialExerciseName, isOpen]);

  // Video Time Progression Timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTimeSecs((prev) => {
        const next = prev + 0.25 * playbackSpeed;
        if (next >= selectedDuration) {
          // Loop or pause at end
          return 0;
        }
        return next;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, playbackSpeed, selectedDuration]);

  // Voice Narration Synchronization
  useEffect(() => {
    if (!isOpen || !audioNarrationEnabled || !isVoiceCoachEnabled) return;

    const currentPercent = (currentTimeSecs / selectedDuration) * 100;
    
    // Find closest script item that hasn't been spoken yet
    const scriptToSpeak = exerciseInfo.voiceScript.find(item => {
      return (
        currentPercent >= item.timePercent &&
        item.timePercent > lastSpokenPercentRef.current &&
        currentPercent - item.timePercent < 15
      );
    });

    if (scriptToSpeak) {
      lastSpokenPercentRef.current = scriptToSpeak.timePercent;
      setCurrentSubtitle(scriptToSpeak.script);
      onSpeak(scriptToSpeak.script);
    }
  }, [currentTimeSecs, isOpen, audioNarrationEnabled, isVoiceCoachEnabled, exerciseInfo, selectedDuration]);

  // Reset spoken state when rewinding
  const handleSeek = (newSecs: number) => {
    setCurrentTimeSecs(newSecs);
    lastSpokenPercentRef.current = ((newSecs - 2) / selectedDuration) * 100;
  };

  // Determine current exercise movement phase based on rep cycle (each rep is ~4.5 seconds)
  const repCycleTime = 4.5 / playbackSpeed;
  const currentRepSeconds = currentTimeSecs % repCycleTime;
  const repPhaseRatio = currentRepSeconds / repCycleTime;
  const totalRepsCompleted = Math.floor(currentTimeSecs / repCycleTime);

  let phaseLabel = 'ECCENTRIC (LOWERING)';
  let phaseColor = '#38bdf8'; // Blue
  let phaseProgress = 0; // 0 to 1

  if (repPhaseRatio < 0.5) {
    // Eccentric (3s)
    phaseLabel = 'ECCENTRIC (3s CONTROLLED DESCENT)';
    phaseColor = '#38bdf8';
    phaseProgress = repPhaseRatio / 0.5;
  } else if (repPhaseRatio < 0.65) {
    // Isometric Pause (1s)
    phaseLabel = 'ISOMETRIC (1s BOTTOM PAUSE)';
    phaseColor = '#fbbf24';
    phaseProgress = (repPhaseRatio - 0.5) / 0.15;
  } else if (repPhaseRatio < 0.88) {
    // Concentric (1s)
    phaseLabel = 'CONCENTRIC (EXPLOSIVE DRIVE)';
    phaseColor = currentAccentHex;
    phaseProgress = (repPhaseRatio - 0.65) / 0.23;
  } else {
    // Lockout
    phaseLabel = 'PEAK TENSION LOCKOUT';
    phaseColor = '#a78bfa';
    phaseProgress = 1;
  }

  // 60 FPS Canvas Kinematic Video Animation Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isOpen) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear with dark cinema background
      ctx.fillStyle = '#080c14';
      ctx.fillRect(0, 0, width, height);

      // Floor grid perspective
      ctx.save();
      const horizonY = height * 0.72;
      
      // Radial spotlight on floor
      const radial = ctx.createRadialGradient(
        width / 2, horizonY + 20, 10,
        width / 2, horizonY + 20, width * 0.45
      );
      radial.addColorStop(0, `rgba(${accentRgb}, 0.22)`);
      radial.addColorStop(0.5, `rgba(${accentRgb}, 0.05)`);
      radial.addColorStop(1, 'transparent');
      ctx.fillStyle = radial;
      ctx.fillRect(0, horizonY - 40, width, height - horizonY + 40);

      // Perspective floor lines
      ctx.strokeStyle = `rgba(${accentRgb}, 0.15)`;
      ctx.lineWidth = 1;
      for (let x = -width; x < width * 2; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(width / 2 + (x - width / 2) * 0.25, horizonY);
        ctx.stroke();
      }

      // Horizon line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();
      ctx.restore();

      // Kinematic calculations: Normalized cycle (0 to 1)
      // Sine wave motion matching rep phase
      let cycle = 0;
      if (repPhaseRatio < 0.5) {
        cycle = Math.sin((repPhaseRatio / 0.5) * (Math.PI / 2)); // 0 -> 1
      } else if (repPhaseRatio < 0.65) {
        cycle = 1; // hold bottom
      } else if (repPhaseRatio < 0.88) {
        cycle = 1 - Math.sin(((repPhaseRatio - 0.65) / 0.23) * (Math.PI / 2)); // 1 -> 0
      } else {
        cycle = 0; // top
      }

      // Render Athlete Biomechanical Skeleton & Muscle Mesh
      ctx.save();
      const centerX = width / 2;
      const groundY = horizonY;

      const isBench = activeExercise.toLowerCase().includes('bench');
      const isSquat = activeExercise.toLowerCase().includes('squat');
      const isDeadlift = activeExercise.toLowerCase().includes('deadlift');
      const isPress = activeExercise.toLowerCase().includes('press') || activeExercise.toLowerCase().includes('shoulder');
      const isPullUp = activeExercise.toLowerCase().includes('pull');

      // DRAW EXERCISE KINEMATICS
      if (isBench) {
        // Flat Bench Press Kinematics
        const benchY = groundY - 50;
        const benchWidth = 260;
        const benchHeight = 22;

        // Draw bench structure
        ctx.fillStyle = '#1e2430';
        ctx.fillRect(centerX - benchWidth / 2, benchY, benchWidth, benchHeight);
        ctx.fillStyle = '#11151f';
        ctx.fillRect(centerX - benchWidth / 2 + 30, benchY + benchHeight, 18, 50);
        ctx.fillRect(centerX + benchWidth / 2 - 48, benchY + benchHeight, 18, 50);

        // Athlete Body (Lying down)
        const torsoY = benchY - 14;
        const headX = centerX - 85;
        const hipsX = centerX + 40;
        const chestX = centerX - 25;

        // Head
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(headX, torsoY - 6, 14, 0, Math.PI * 2);
        ctx.fill();

        // Torso / Spine
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(headX + 10, torsoY);
        ctx.lineTo(hipsX, torsoY);
        ctx.stroke();

        // Active Muscle Heatmap: Pectorals & Triceps
        if (cameraAngle === 'heatmap') {
          ctx.strokeStyle = `rgba(${accentRgb}, ${0.5 + (1 - cycle) * 0.5})`;
          ctx.lineWidth = 18;
          ctx.beginPath();
          ctx.moveTo(chestX - 25, torsoY);
          ctx.lineTo(chestX + 20, torsoY);
          ctx.stroke();
        }

        // Legs (Bent 90 degrees to floor)
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(hipsX, torsoY);
        ctx.lineTo(hipsX + 45, torsoY + 25);
        ctx.lineTo(hipsX + 45, groundY);
        ctx.stroke();

        // Arms & Barbell
        // Barbell vertical travel: top Y is torsoY - 95, bottom Y is torsoY - 20
        const barY = (torsoY - 95) + cycle * 75;
        const barX = chestX;

        // Arms (Shoulder -> Elbow -> Hand)
        const shoulderX = chestX - 10;
        const shoulderY = torsoY - 6;
        const handX = barX;
        const handY = barY;
        const elbowX = shoulderX + (handX - shoulderX) * 0.5 + (cycle * 22);
        const elbowY = shoulderY + (handY - shoulderY) * 0.5 + (cycle * 24);

        ctx.strokeStyle = cameraAngle === 'heatmap' ? `rgba(${accentRgb}, 0.9)` : '#cbd5e1';
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Olympic Barbell with bumper plates
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(barX - 110, barY);
        ctx.lineTo(barX + 110, barY);
        ctx.stroke();

        // Weights
        ctx.fillStyle = currentAccentHex;
        ctx.fillRect(barX - 105, barY - 30, 14, 60);
        ctx.fillRect(barX - 90, barY - 26, 10, 52);
        ctx.fillRect(barX + 80, barY - 26, 10, 52);
        ctx.fillRect(barX + 91, barY - 30, 14, 60);

        // Vertical Bar Path Tracer
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = `rgba(${accentRgb}, 0.7)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(barX, torsoY - 105);
        ctx.lineTo(barX, torsoY - 15);
        ctx.stroke();
        ctx.setLineDash([]);

        // Biomechanical Angle Overlay
        const elbowAngle = Math.round(175 - cycle * 85);
        ctx.fillStyle = currentAccentHex;
        ctx.font = '11px monospace';
        ctx.fillText(`ELBOW: ${elbowAngle}°`, elbowX - 40, elbowY + 20);

      } else if (isSquat) {
        // Barbell Back Squat Kinematics
        // Standing height: head at groundY - 200, bottom squat: head at groundY - 130
        const squatDepth = cycle * 65;
        const hipDepth = cycle * 75;

        const hipX = centerX - (cycle * 28);
        const hipY = (groundY - 105) + hipDepth;

        const kneeX = centerX + 20 + (cycle * 14);
        const kneeY = groundY - 55;

        const ankleX = centerX + 10;
        const ankleY = groundY - 6;

        // Torso tilts slightly forward during squat
        const torsoAngle = 0.15 + cycle * 0.25;
        const shoulderX = hipX + Math.sin(torsoAngle) * 90;
        const shoulderY = hipY - Math.cos(torsoAngle) * 90;

        const headX = shoulderX + Math.sin(torsoAngle) * 22;
        const headY = shoulderY - Math.cos(torsoAngle) * 22;

        // Head
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(headX, headY, 14, 0, Math.PI * 2);
        ctx.fill();

        // Spine / Torso
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(headX, headY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.lineTo(hipX, hipY);
        ctx.stroke();

        // Active Muscle Heatmap: Quads & Glutes
        if (cameraAngle === 'heatmap') {
          ctx.strokeStyle = `rgba(${accentRgb}, ${0.5 + cycle * 0.5})`;
          ctx.lineWidth = 22;
          ctx.beginPath();
          ctx.moveTo(hipX, hipY);
          ctx.lineTo(kneeX, kneeY);
          ctx.stroke();
        }

        // Thigh & Shin
        ctx.strokeStyle = cameraAngle === 'heatmap' ? `rgba(${accentRgb}, 0.85)` : '#cbd5e1';
        ctx.lineWidth = 11;
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(ankleX, ankleY);
        ctx.stroke();

        // Barbell on shoulders
        const barX = shoulderX;
        const barY = shoulderY + 4;
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(barX - 100, barY);
        ctx.lineTo(barX + 100, barY);
        ctx.stroke();

        // Bumper Plates
        ctx.fillStyle = currentAccentHex;
        ctx.fillRect(barX - 95, barY - 32, 14, 64);
        ctx.fillRect(barX + 81, barY - 32, 14, 64);

        // Bar Path Line
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = `rgba(${accentRgb}, 0.7)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ankleX, groundY - 210);
        ctx.lineTo(ankleX, groundY - 10);
        ctx.stroke();
        ctx.setLineDash([]);

        // Live Joint Angle Annotation
        const kneeAngle = Math.round(170 - cycle * 80);
        ctx.fillStyle = currentAccentHex;
        ctx.font = '11px monospace';
        ctx.fillText(`KNEE: ${kneeAngle}° (PARALLEL)`, kneeX + 15, kneeY - 5);

      } else {
        // Universal Biomechanical Athlete Movement (Overhead Press / Hinges / General)
        const travel = cycle * 60;
        const hipX = centerX;
        const hipY = groundY - 100;
        const kneeX = centerX;
        const kneeY = groundY - 50;
        const ankleX = centerX;
        const ankleY = groundY - 6;

        const shoulderX = centerX;
        const shoulderY = groundY - 170;
        const headX = centerX;
        const headY = groundY - 198;

        // Head
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(headX, headY, 14, 0, Math.PI * 2);
        ctx.fill();

        // Torso
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(headX, headY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.lineTo(hipX, hipY);
        ctx.stroke();

        // Legs
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX - 18, kneeY);
        ctx.lineTo(ankleX - 18, ankleY);
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX + 18, kneeY);
        ctx.lineTo(ankleX + 18, ankleY);
        ctx.stroke();

        // Arms moving vertically
        const handY = isPullUp 
          ? (groundY - 240) + cycle * 55 
          : (groundY - 230) + cycle * 55;

        ctx.strokeStyle = cameraAngle === 'heatmap' ? `rgba(${accentRgb}, 0.9)` : '#cbd5e1';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(shoulderX - 18, shoulderY);
        ctx.lineTo(shoulderX - 35, (shoulderY + handY) / 2);
        ctx.lineTo(shoulderX - 35, handY);

        ctx.moveTo(shoulderX + 18, shoulderY);
        ctx.lineTo(shoulderX + 35, (shoulderY + handY) / 2);
        ctx.lineTo(shoulderX + 35, handY);
        ctx.stroke();

        // Dumbbells / Weight
        ctx.fillStyle = currentAccentHex;
        ctx.fillRect(shoulderX - 44, handY - 12, 18, 24);
        ctx.fillRect(shoulderX + 26, handY - 12, 18, 24);
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isOpen, activeExercise, repPhaseRatio, cameraAngle, accentRgb, currentAccentHex, playbackSpeed]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const progressPercent = (currentTimeSecs / selectedDuration) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-[#07090d]/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0b0e15] border border-white/[0.14] rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[95vh] relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* TOP HEADER: Exercise Title, Time Selector & Close */}
        <div className="px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-inner"
              style={{ 
                backgroundColor: `rgba(${accentRgb}, 0.15)`, 
                color: currentAccentHex,
                border: `1px solid rgba(${accentRgb}, 0.35)` 
              }}
            >
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold" style={{ color: currentAccentHex }}>
                  TEACH ME • INTERACTIVE VIDEO DEMO CLASS
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/[0.06] text-[#a7adb7]">
                  60 FPS KINEMATICS
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                {exerciseInfo.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Suitable Time / Duration Selector */}
            <div className="flex items-center gap-1 bg-black/50 border border-white/[0.08] p-1 rounded-xl">
              <span className="text-[10px] font-mono text-[#6f7682] px-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Class Length:</span>
              </span>
              {[
                { sec: 30, label: '30s Form Drill' },
                { sec: 60, label: '60s Masterclass' },
                { sec: 120, label: '2m Follow-Along' },
                { sec: 180, label: '3m Studio Class' },
              ].map(({ sec, label }) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    setSelectedDuration(sec as ClassDuration);
                    setCurrentTimeSecs(0);
                    lastSpokenPercentRef.current = -1;
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition cursor-pointer ${
                    selectedDuration === sec
                      ? 'bg-white/[0.16] text-white shadow-sm font-bold border border-white/[0.15]'
                      : 'text-[#6f7682] hover:text-[#a7adb7]'
                  }`}
                  style={{
                    borderColor: selectedDuration === sec ? currentAccentHex : undefined,
                    color: selectedDuration === sec ? currentAccentHex : undefined
                  }}
                >
                  {sec}s
                </button>
              ))}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-[#a7adb7] hover:text-white transition cursor-pointer"
              title="Close Video Demo Class"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MAIN BODY: VIDEO VIEWPORT + INTERACTIVE HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* LEFT: 60 FPS Dynamic Video Canvas Player (Cols 8) */}
          <div className="lg:col-span-8 p-4 sm:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#07090d]">
            
            {/* Viewfinder Video Frame */}
            <div className="video-demo-viewport relative aspect-video w-full rounded-xl overflow-hidden flex flex-col justify-between p-3 sm:p-4">
              <div className="absolute inset-0 video-viewfinder-grid pointer-events-none opacity-40" />

              {/* Top Viewport HUD Overlay */}
              <div className="relative z-10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-mono text-[11px] font-bold text-white tracking-wider">
                    DEMO REC • {formatTime(currentTimeSecs)} / {formatTime(selectedDuration)}
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/[0.08] text-[10px] font-mono text-[#a7adb7]">
                    REP {totalRepsCompleted + 1}
                  </span>
                </div>

                {/* Perspective View Angle Selector */}
                <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md border border-white/[0.1] p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setCameraAngle('side')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                      cameraAngle === 'side' ? 'bg-white/[0.15] text-white font-bold' : 'text-[#6f7682] hover:text-white'
                    }`}
                  >
                    Side View
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraAngle('heatmap')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition cursor-pointer flex items-center gap-1 ${
                      cameraAngle === 'heatmap' ? 'bg-[var(--accent)]/20 text-[var(--accent)] font-bold' : 'text-[#6f7682] hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Muscle Heatmap</span>
                  </button>
                </div>
              </div>

              {/* The Kinematic 60 FPS Canvas */}
              <canvas
                ref={canvasRef}
                width={720}
                height={405}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />

              {/* Movement Phase Real-time Pill */}
              <div className="relative z-10 self-start mt-auto mb-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/[0.12] shadow-lg">
                  <span 
                    className="w-2 h-2 rounded-full animate-ping"
                    style={{ backgroundColor: phaseColor }}
                  />
                  <div className="text-[11px] font-mono font-bold" style={{ color: phaseColor }}>
                    {phaseLabel}
                  </div>
                </div>
              </div>

              {/* Voice Coach Live Subtitle Banner Overlay */}
              {currentSubtitle && (
                <div className="relative z-10 p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/[0.14] text-xs text-center text-white shadow-2xl transition-all">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[var(--accent)] mb-0.5">
                    <Volume2 className="w-3 h-3" />
                    <span>COACH {coachPersona.toUpperCase()} AUDIO COACHING</span>
                  </div>
                  <p className="leading-snug font-medium text-slate-100">
                    "{currentSubtitle}"
                  </p>
                </div>
              )}
            </div>

            {/* Video Controls Bar */}
            <div className="mt-3.5 space-y-2">
              {/* Scrubbable Progress Bar */}
              <div 
                className="relative w-full h-2 bg-white/[0.08] hover:h-3 rounded-full cursor-pointer transition-all overflow-hidden"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  handleSeek(ratio * selectedDuration);
                }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-100"
                  style={{ 
                    width: `${progressPercent}%`, 
                    backgroundColor: currentAccentHex,
                    boxShadow: `0 0 10px ${currentAccentHex}`
                  }}
                />
              </div>

              {/* Bottom Control Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md bg-[var(--accent)] text-[#07090d] hover:brightness-110 active:scale-95 transition"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSeek(0)}
                    className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-[#a7adb7] hover:text-white border border-white/[0.08] transition cursor-pointer"
                    title="Restart Video Class"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  {/* Playback Speed */}
                  <div className="flex items-center bg-black/40 border border-white/[0.08] p-0.5 rounded-lg text-[10px] font-mono">
                    {[0.5, 1.0, 1.5].map((speed) => (
                      <button
                        key={speed}
                        type="button"
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-2 py-0.5 rounded transition cursor-pointer ${
                          playbackSpeed === speed ? 'bg-white/[0.15] text-white font-bold' : 'text-[#6f7682] hover:text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Voice Audio Narration Toggle */}
                  <button
                    type="button"
                    onClick={() => setAudioNarrationEnabled(!audioNarrationEnabled)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition cursor-pointer border ${
                      audioNarrationEnabled && isVoiceCoachEnabled
                        ? 'bg-[var(--accent)]/15 border-[var(--accent)]/35 text-[var(--accent)] font-semibold'
                        : 'bg-white/[0.04] border-white/[0.08] text-[#6f7682]'
                    }`}
                  >
                    {audioNarrationEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                    <span>Coach Audio {audioNarrationEnabled ? 'On' : 'Muted'}</span>
                  </button>

                  <span className="font-mono text-[#a7adb7] text-xs">
                    {formatTime(currentTimeSecs)} / {formatTime(selectedDuration)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: BIOMECHANICAL ANALYSIS & FORM HUD (Cols 4) */}
          <div className="lg:col-span-4 p-4 sm:p-5 space-y-4 bg-[#0d1017] overflow-y-auto">
            
            {/* Quick Exercise Switcher */}
            {allExercises.length > 1 && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6f7682] uppercase tracking-wider block">
                  Select Exercise to Teach:
                </label>
                <select
                  value={activeExercise}
                  onChange={(e) => {
                    setActiveExercise(e.target.value);
                    setCurrentTimeSecs(0);
                    lastSpokenPercentRef.current = -1;
                  }}
                  className="w-full bg-[#11151f] border border-white/[0.1] rounded-lg p-2 text-xs text-white outline-none focus:border-[var(--accent)] transition cursor-pointer"
                >
                  {allExercises.map((name, i) => (
                    <option key={i} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Target Muscle Activation Card */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-[#8ee6c1]">
                  Kinetic Muscle Loading
                </span>
                <span className="text-[10px] font-mono text-[#6f7682]">
                  {exerciseInfo.equipment}
                </span>
              </div>
              <div className="space-y-1.5">
                <div>
                  <span className="text-[10px] text-[#6f7682] block">Primary Drivers:</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {exerciseInfo.targetMuscles.map((m, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--accent)]/15 border border-[var(--accent)]/30"
                        style={{ color: currentAccentHex }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[#6f7682] block">Stabilizers:</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {exerciseInfo.secondaryMuscles.map((m, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-white/[0.05] text-[#a7adb7]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Precision Checklist */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3.5 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-[#a7adb7] block">
                Form Precision Criteria (Coach {coachPersona})
              </span>
              <ul className="space-y-1.5 text-xs text-[#cbd5e1]">
                {exerciseInfo.keyCues.map((cue, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
                    <span className="leading-snug">{cue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes to Avoid */}
            <div className="bg-red-500/[0.07] border border-red-500/25 rounded-xl p-3 text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">
                Avoid Common Form Fault:
              </span>
              <p className="text-red-200/90 leading-relaxed text-[11px]">
                {exerciseInfo.commonMistakes}
              </p>
            </div>

            {/* Tempo Metronome Guide */}
            <div className="bg-black/40 border border-white/[0.08] rounded-xl p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#a7adb7] uppercase">Prescribed Tempo</span>
                <span className="font-mono text-white text-[11px] font-bold" style={{ color: currentAccentHex }}>
                  {exerciseInfo.tempo}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
                <div className="bg-white/[0.04] p-1 rounded">
                  <span className="text-[#6f7682] block text-[8px]">ECCENTRIC</span>
                  <span className="font-bold text-white">3s</span>
                </div>
                <div className="bg-white/[0.04] p-1 rounded">
                  <span className="text-[#6f7682] block text-[8px]">PAUSE</span>
                  <span className="font-bold text-white">1s</span>
                </div>
                <div className="bg-white/[0.04] p-1 rounded">
                  <span className="text-[#6f7682] block text-[8px]">CONCENTRIC</span>
                  <span className="font-bold text-white">1s</span>
                </div>
                <div className="bg-white/[0.04] p-1 rounded">
                  <span className="text-[#6f7682] block text-[8px]">LOCK</span>
                  <span className="font-bold text-white">0s</span>
                </div>
              </div>
            </div>

            {/* Quick Test Voice Audio Button */}
            <button
              type="button"
              onClick={() => {
                onSpeak(`Demonstrating proper form for ${exerciseInfo.name}. Keep your core braced and maintain tension throughout the range of motion.`);
              }}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-[#a7adb7] hover:text-white border border-white/[0.08] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Listen to Coach Form Overview</span>
            </button>
          </div>
        </div>

        {/* BOTTOM MODAL BAR */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-[#07090d] flex items-center justify-between text-xs text-[#6f7682]">
          <span>FitBuddy Biomechanical AI Class Engine • Interactive Demonstration</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold transition cursor-pointer"
          >
            Finished Learning
          </button>
        </div>
      </div>
    </div>
  );
}
