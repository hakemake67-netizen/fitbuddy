import fs from 'fs';
import path from 'path';

// ============================================================================
// FITBUDDY DATA MODELS
// ============================================================================

export interface UserProfile {
  id: string;
  username: string;
  age: number;
  weight: number; // in kg
  weightUnit: 'kg' | 'lbs';
  height?: number;
  heightUnit?: 'cm' | 'in';
  avatar?: any;
  goal: string; // 'Muscle Gain' | 'Weight Loss' | 'Strength' | 'General Fitness' | 'Endurance'
  intensity: 'Beginner' | 'Intermediate' | 'Advanced';
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: 'gym' | 'bodyweight' | 'minimal';
  sessionDuration: string; // '30 min' | '45 min' | '60 min' | '75 min'
  focusAreas: string[];
  injuryNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: 'bodyweight' | 'gym' | 'minimal';
  targetMuscles: string[];
  equipment: string;
  sets: string;
  reps_or_duration: string;
  rest: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  form_cue: string;
  setupInstructions: string[];
  movementPhases: { phase: string; cue: string }[];
  breathing: string;
  tempo: string;
  commonMistakes: string[];
  safetyNotes: string;
  coachingCue: string;
}

export interface WorkoutDay {
  dayNumber: number;
  day: string;
  title: string;
  focus: string;
  warm_up: string;
  main_workout: ExerciseItem[];
  cool_down: string;
  recoveryGuidance?: string;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  goal: string;
  equipment: 'gym' | 'bodyweight' | 'minimal';
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  originalPlan: WorkoutDay[];
  updatedPlan: WorkoutDay[] | null;
  feedbackHistory: Array<{ feedback: string; appliedAt: string; note: string }>;
  nutritionTip: string;
  status: 'active' | 'archived';
}

export interface WorkoutCompletion {
  id: string;
  userId: string;
  planId: string;
  dayNumber: number;
  exerciseId: string;
  exerciseName: string;
  completed: boolean;
  completedAt: string;
}

export interface CoachMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface CoachSession {
  id: string;
  userId: string;
  startedAt: string;
  lastActiveAt: string;
  currentDay: number;
  currentExercise: string;
  history: CoachMessage[];
}

// ============================================================================
// REDIS-COMPATIBLE IN-MEMORY CACHING LAYER
// ============================================================================

interface CacheEntry<T> {
  value: T;
  expiresAt: number | null; // null = never expires
  tags: string[];
}

export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private hits = 0;
  private misses = 0;

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }
    this.hits++;
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds: number = 300, tags: string[] = []): void {
    const expiresAt = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
    this.cache.set(key, { value, expiresAt, tags });
  }

  del(key: string): void {
    this.cache.delete(key);
  }

  invalidateTags(tag: string): void {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key);
      }
    }
  }

  flushAll(): void {
    this.cache.clear();
  }

  getStats() {
    return {
      keysCount: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRatio: this.hits + this.misses > 0 ? (this.hits / (this.hits + this.misses)).toFixed(2) : '0.00'
    };
  }
}

export const cache = new CacheService();

// ============================================================================
// INDEXED IN-MEMORY & PERSISTENT DATABASE ENGINE
// ============================================================================

class FitBuddyDatabase {
  private dataDir = path.resolve(process.cwd(), 'data');
  private dbFilePath = path.resolve(process.cwd(), 'data', 'fitbuddy_store.json');

  public users = new Map<string, UserProfile>();
  public plans = new Map<string, WorkoutPlan>();
  public completions: WorkoutCompletion[] = [];
  public coachSessions = new Map<string, CoachSession>();
  public exercises = new Map<string, ExerciseItem>();
  public workoutSessionStates = new Map<string, any>();

  // Indices for sub-millisecond retrieval
  private userPlanIndex = new Map<string, string[]>(); // userId -> planIds
  private completionIndex = new Map<string, WorkoutCompletion>(); // `${userId}:${planId}:${dayNumber}:${exerciseId}` -> completion
  private exerciseCategoryIndex = new Map<string, string[]>(); // category -> exerciseIds

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    this.seedExercises();
    this.loadFromDisk();
  }

  private saveToDisk() {
    try {
      const state = {
        users: Array.from(this.users.entries()),
        plans: Array.from(this.plans.entries()),
        completions: this.completions,
        coachSessions: Array.from(this.coachSessions.entries()),
        workoutSessionStates: Array.from(this.workoutSessionStates.entries()),
      };
      fs.writeFileSync(this.dbFilePath, JSON.stringify(state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database to disk:', err);
    }
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(this.dbFilePath)) {
        const raw = fs.readFileSync(this.dbFilePath, 'utf-8');
        const state = JSON.parse(raw);
        if (state.users) {
          for (const [id, user] of state.users) {
            this.users.set(id, user);
          }
        }
        if (state.plans) {
          for (const [id, plan] of state.plans) {
            this.plans.set(id, plan);
            this.indexPlan(plan);
          }
        }
        if (state.completions) {
          this.completions = state.completions;
          for (const c of this.completions) {
            const key = `${c.userId}:${c.planId}:${c.dayNumber}:${c.exerciseId}`;
            this.completionIndex.set(key, c);
          }
        }
        if (state.coachSessions) {
          for (const [id, session] of state.coachSessions) {
            this.coachSessions.set(id, session);
          }
        }
        if (state.workoutSessionStates) {
          for (const [id, sessionState] of state.workoutSessionStates) {
            this.workoutSessionStates.set(id, sessionState);
          }
        }
      } else {
        this.seedInitialUserAndPlan();
      }
    } catch (err) {
      console.error('Failed to load database from disk:', err);
      this.seedInitialUserAndPlan();
    }
  }

  private indexPlan(plan: WorkoutPlan) {
    const list = this.userPlanIndex.get(plan.userId) || [];
    if (!list.includes(plan.id)) {
      list.push(plan.id);
      this.userPlanIndex.set(plan.userId, list);
    }
  }

  private seedExercises() {
    const defaultExercises: ExerciseItem[] = [
      {
        id: 'push-up',
        name: 'Standard Push-Up',
        category: 'bodyweight',
        targetMuscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps'],
        equipment: 'Bodyweight',
        sets: '3-4',
        reps_or_duration: '10-15 reps',
        rest: '60 seconds',
        difficulty: 'Beginner',
        form_cue: 'Keep core braced like a rigid plank, lower chest to floor with elbows at 45 degrees.',
        setupInstructions: [
          'Place hands on the floor slightly wider than shoulder-width.',
          'Form a straight kinetic line from the back of your head through hips to heels.',
          'Brace glutes and abdomen tightly to protect the lumbar spine.'
        ],
        movementPhases: [
          { phase: 'Eccentric (Descent)', cue: 'Lower torso under control for 2-3 seconds until chest is 1 inch from floor.' },
          { phase: 'Isometric Pause', cue: 'Hold tension for 1 second at the bottom without resting on the floor.' },
          { phase: 'Concentric (Ascent)', cue: 'Push palms through the floor to full arm extension without shrugging.' }
        ],
        breathing: 'Inhale on the descent; exhale forcefully through pursed lips as you press upward.',
        tempo: '3-1-1-0 (3s Lower, 1s Pause, 1s Drive)',
        commonMistakes: [
          'Sagging lower back caused by relaxed abdominal wall.',
          'Flaring elbows outward at 90 degrees, stressing anterior shoulder capsule.',
          'Dropping the head forward instead of lowering the sternum.'
        ],
        safetyNotes: 'If wrist discomfort occurs, perform on fists or using push-up stands.',
        coachingCue: 'Imagine pushing the floor away from your chest rather than pushing yourself up.'
      },
      {
        id: 'bench-press',
        name: 'Barbell Bench Press',
        category: 'gym',
        targetMuscles: ['Pectoralis Major', 'Triceps Brachii', 'Anterior Deltoids'],
        equipment: 'Barbell & Flat Bench',
        sets: '4',
        reps_or_duration: '8-10 reps',
        rest: '75-90 seconds',
        difficulty: 'Intermediate',
        form_cue: 'Retract scapulae, plant feet flat, touch mid-sternum, drive bar up in a slight arc.',
        setupInstructions: [
          'Lie flat with eyes directly under the racked barbell.',
          'Grip the bar slightly wider than shoulder-width with thumbs wrapped.',
          'Pin shoulder blades down and back into the bench padding, planting heels firmly.'
        ],
        movementPhases: [
          { phase: 'Unrack & Settle', cue: 'Lift bar over chest line, lock lats, take 360-degree diaphragmatic breath.' },
          { phase: 'Eccentric Descent', cue: 'Lower bar smoothly to lower sternum over 3 seconds.' },
          { phase: 'Concentric Press', cue: 'Drive feet into ground and press bar back over shoulder joints.' }
        ],
        breathing: 'Deep diaphragmatic inhale and intra-abdominal brace before descent; exhale past sticking point.',
        tempo: '3-1-1-0',
        commonMistakes: [
          'Bouncing the barbell off the ribs.',
          'Lifting glutes off the bench during heavy effort.',
          'Uneven lockout between left and right arms.'
        ],
        safetyNotes: 'Always use collars and keep safety spotter arms set at chest height.',
        coachingCue: 'Bend the bar in half with your hands to engage lats and stabilize shoulders.'
      },
      {
        id: 'bodyweight-squat',
        name: 'Bodyweight Air Squat',
        category: 'bodyweight',
        targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings'],
        equipment: 'Bodyweight',
        sets: '3-4',
        reps_or_duration: '15-20 reps',
        rest: '60 seconds',
        difficulty: 'Beginner',
        form_cue: 'Hinge hips backward, keep knees tracking over second toes, maintain proud chest.',
        setupInstructions: [
          'Stand with feet shoulder-width apart, toes turned outward 10-20 degrees.',
          'Keep weight distributed across the tripod of each foot (heel, base of big toe, base of pinky toe).',
          'Extend arms forward or clasp hands at chest height for balance.'
        ],
        movementPhases: [
          { phase: 'Descent', cue: 'Initiate by unlocking hips and knees simultaneously. Lower until thighs break parallel.' },
          { phase: 'Bottom Transition', cue: 'Maintain upright posture with neutral spine, no hip wink.' },
          { phase: 'Ascent', cue: 'Drive through midfoot to stand tall, contracting glutes at apex.' }
        ],
        breathing: 'Inhale on the way down; exhale as you stand up.',
        tempo: '3-1-1-0',
        commonMistakes: [
          'Knees caving inward (valgus collapse).',
          'Heels lifting off the floor.',
          'Excessive forward torso lean.'
        ],
        safetyNotes: 'Work within your active mobility range; elevate heels slightly if ankle dorsiflexion is restricted.',
        coachingCue: 'Spread the floor apart with your feet as you descend.'
      },
      {
        id: 'barbell-squat',
        name: 'Barbell Back Squat',
        category: 'gym',
        targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Erector Spinae'],
        equipment: 'Barbell & Squat Rack',
        sets: '4',
        reps_or_duration: '8-10 reps',
        rest: '90-120 seconds',
        difficulty: 'Advanced',
        form_cue: 'Brace core with Valsalva maneuver, descend to parallel with upright torso, drive out of hole.',
        setupInstructions: [
          'Rest bar across upper trapezius (high bar) or rear delts (low bar).',
          'Unrack with both feet underneath, take two clean steps backward.',
          'Inhale into belly, brace core 360 degrees.'
        ],
        movementPhases: [
          { phase: 'Eccentric', cue: 'Break at hips and knees, descend under total control for 3 seconds.' },
          { phase: 'Hole Pause', cue: 'Reach parallel depth, maintain rigid thoracic tension.' },
          { phase: 'Drive', cue: 'Accelerate upward through the floor, keeping hips and chest rising at the same rate.' }
        ],
        breathing: 'Full diaphragmatic breath before descent, hold brace through the turnaround, exhale at top.',
        tempo: '3-0-1-0',
        commonMistakes: [
          'Good-morning squat: hips shoot up before shoulders.',
          'Loss of lumbar neutrality in the bottom position.',
          'Looking up at ceiling, hyperextending cervical spine.'
        ],
        safetyNotes: 'Never squat without safety pins set at proper height in the power rack.',
        coachingCue: 'Keep the weight centered over your midfoot throughout the entire rep.'
      },
      {
        id: 'romanian-deadlift',
        name: 'Romanian Deadlift',
        category: 'gym',
        targetMuscles: ['Hamstrings', 'Gluteus Maximus', 'Erector Spinae'],
        equipment: 'Barbell or Dumbbells',
        sets: '3-4',
        reps_or_duration: '10-12 reps',
        rest: '75 seconds',
        difficulty: 'Intermediate',
        form_cue: 'Hinge at the hips, push glutes to rear wall, keep bar close to shins with soft knees.',
        setupInstructions: [
          'Hold weight with overhand grip at hip height, feet hip-width apart.',
          'Soften knees slightly and keep them fixed at that angle throughout the lift.',
          'Pack lats to lock the bar against the thighs.'
        ],
        movementPhases: [
          { phase: 'Hip Hinge Descent', cue: 'Slide hips backward while keeping spine flat until deep hamstring stretch is felt.' },
          { phase: 'Peak Stretch', cue: 'Pause for 1 second just below knee level without rounding back.' },
          { phase: 'Hip Extension', cue: 'Squeeze glutes forward to return to standing position.' }
        ],
        breathing: 'Inhale and brace at the top; exhale as you extend hips forward.',
        tempo: '3-1-1-0',
        commonMistakes: [
          'Squatting instead of hinging at the hips.',
          'Letting the weight drift away from the legs.',
          'Rounding the upper and lower back.'
        ],
        safetyNotes: 'Lower the weight only as far as your hamstring flexibility allows with a neutral spine.',
        coachingCue: 'Think about shutting a car door behind you with your hips.'
      },
      {
        id: 'plank',
        name: 'RKC Forearm Plank',
        category: 'bodyweight',
        targetMuscles: ['Rectus Abdominis', 'Transverse Abdominis', 'Glutes'],
        equipment: 'Bodyweight (Floor/Mat)',
        sets: '3',
        reps_or_duration: '45-60 seconds',
        rest: '45 seconds',
        difficulty: 'Beginner',
        form_cue: 'Elbows under shoulders, contract glutes, pull elbows toward toes to maximize abdominal tension.',
        setupInstructions: [
          'Rest on forearms with elbows directly under shoulders.',
          'Tuck pelvis into slight posterior pelvic tilt.',
          'Engage quadriceps and squeeze glutes hard.'
        ],
        movementPhases: [
          { phase: 'Isometric Contraction', cue: 'Actively draw elbows toward toes and toes toward elbows without moving.' },
          { phase: 'Rhythmic Breathing', cue: 'Breathe shallowly through the nose while holding maximum core tension.' }
        ],
        breathing: 'Continuous rhythmic breathing into the ribcage while keeping stomach wall braced.',
        tempo: 'Isometric hold',
        commonMistakes: [
          'Sagging hips putting strain on lower back.',
          'Hips piked high in the air, releasing abdominal recruitment.',
          'Holding breath until dizzy.'
        ],
        safetyNotes: 'Drop to knees if lumbar spine begins to feel compressive strain.',
        coachingCue: 'Aim for maximum tension for 30 seconds rather than a lazy hold for 2 minutes.'
      },
      {
        id: 'dumbbell-floor-press',
        name: 'Dumbbell Floor Press',
        category: 'minimal',
        targetMuscles: ['Pectoralis Major', 'Triceps', 'Anterior Deltoids'],
        equipment: 'Pair of Dumbbells',
        sets: '4',
        reps_or_duration: '10-12 reps',
        rest: '60 seconds',
        difficulty: 'Beginner',
        form_cue: 'Lie on floor, press dumbbells from triceps contact, control descent to protect shoulders.',
        setupInstructions: [
          'Lie on back with knees bent and feet flat on the floor.',
          'Hold dumbbells with elbows resting on the ground at a 45-degree angle from torso.',
          'Keep wrists stacked directly above elbows.'
        ],
        movementPhases: [
          { phase: 'Concentric Press', cue: 'Press dumbbells up and together above chest until arms are extended.' },
          { phase: 'Peak Squeeze', cue: 'Squeeze chest muscles for 1 second at top.' },
          { phase: 'Controlled Lowering', cue: 'Lower until triceps lightly touch the floor, preventing joint bounce.' }
        ],
        breathing: 'Inhale lowering down; exhale pressing up.',
        tempo: '3-0-1-0',
        commonMistakes: [
          'Letting elbows slam into the floor.',
          'Bouncing arms off the ground.'
        ],
        safetyNotes: 'Ideal alternative for individuals with shoulder impingement on traditional bench press.',
        coachingCue: 'Rest lightly on the floor before pressing to eliminate momentum.'
      },
      {
        id: 'lunge',
        name: 'Walking or Reverse Lunge',
        category: 'bodyweight',
        targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
        equipment: 'Bodyweight or Dumbbells',
        sets: '3',
        reps_or_duration: '10-12 reps/leg',
        rest: '60 seconds',
        difficulty: 'Beginner',
        form_cue: 'Step back into deep 90-degree knee bend, keep torso upright, drive through front heel.',
        setupInstructions: [
          'Stand tall with feet together and hands on hips or holding dumbbells.',
          'Step one foot straight back about two to three feet.',
          'Lower rear knee toward the floor while front knee tracks over midfoot.'
        ],
        movementPhases: [
          { phase: 'Step & Lower', cue: 'Drop back knee until it hovers 1-2 inches above the ground.' },
          { phase: 'Drive Return', cue: 'Push through front heel to return to standing position.' }
        ],
        breathing: 'Inhale stepping back; exhale driving forward to standing.',
        tempo: '2-1-1-0',
        commonMistakes: [
          'Front knee drifting far past toes or collapsing inward.',
          'Torso collapsing forward.'
        ],
        safetyNotes: 'Reverse lunges place significantly less shearing force on the knee joint than forward lunges.',
        coachingCue: 'Keep the front shin vertical and load the front glute.'
      },
      {
        id: 'elevated-pike-push-up',
        name: 'Elevated Pike Push-Up',
        category: 'bodyweight',
        targetMuscles: ['Anterior & Lateral Deltoids', 'Upper Chest', 'Triceps'],
        equipment: 'Bodyweight (Floor / Sturdy Chair)',
        sets: '3-4',
        reps_or_duration: '8-12 reps',
        rest: '60 seconds',
        difficulty: 'Intermediate',
        form_cue: 'Pike hips high into inverted V, lower crown of head forward between hands on a tripod path.',
        setupInstructions: [
          'Place hands on floor shoulder-width apart, feet elevated on bench or floor.',
          'Walk hands back until hips are piked directly over shoulders in an inverted V.',
          'Keep core braced and look slightly between hands.'
        ],
        movementPhases: [
          { phase: 'Descent', cue: 'Lower crown of head forward in front of fingertips, forming a triangle.' },
          { phase: 'Bottom Hover', cue: 'Pause 1 second without resting head on floor.' },
          { phase: 'Press & Lock', cue: 'Push diagonally backward through palms to return to pike apex.' }
        ],
        breathing: 'Inhale lowering; exhale pressing back to inverted lockout.',
        tempo: '3-1-1-0',
        commonMistakes: [
          'Letting hips drop flat into regular push-up.',
          'Flaring elbows out horizontally.'
        ],
        safetyNotes: 'Progress from floor pike to elevated feet only when wrist and shoulder stability allows.',
        coachingCue: 'Push your head through your arms at the top of every rep.'
      },
      {
        id: 'pull-ups',
        name: 'Strict Pull-Ups or Inverted Rows',
        category: 'bodyweight',
        targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Biceps'],
        equipment: 'Pull-Up Bar or Inverted Bar',
        sets: '3-4',
        reps_or_duration: '6-10 reps',
        rest: '90 seconds',
        difficulty: 'Intermediate',
        form_cue: 'Depress scapulae first, drive elbows toward ribs, pull chest to bar with zero swing.',
        setupInstructions: [
          'Hang with overhand grip slightly wider than shoulder-width.',
          'Engage core and pull shoulder blades down and back before bending elbows.'
        ],
        movementPhases: [
          { phase: 'Scapular Depress', cue: 'Pull shoulders down away from ears.' },
          { phase: 'Concentric Pull', cue: 'Drive elbows down to hips until chin clears bar.' },
          { phase: 'Eccentric Negative', cue: 'Lower over 3 full seconds back to complete dead hang.' }
        ],
        breathing: 'Exhale pulling up; inhale descending.',
        tempo: '3-0-1-1',
        commonMistakes: [
          'Kipping or swinging legs.',
          'Incomplete range of motion (half reps).'
        ],
        safetyNotes: 'Maintain active shoulder engagement at bottom of rep to protect rotator cuff.',
        coachingCue: 'Think about driving your elbows into your back pockets.'
      }
    ];

    for (const ex of defaultExercises) {
      this.exercises.set(ex.id, ex);
      const catList = this.exerciseCategoryIndex.get(ex.category) || [];
      catList.push(ex.id);
      this.exerciseCategoryIndex.set(ex.category, catList);
    }
  }

  private seedInitialUserAndPlan() {
    const defaultUser: UserProfile = {
      id: 'athlete-101',
      username: 'Alex Morgan',
      age: 28,
      weight: 74,
      weightUnit: 'kg',
      goal: 'Muscle Gain',
      intensity: 'Intermediate',
      skillLevel: 'Intermediate',
      equipment: 'gym',
      sessionDuration: '45-60 min',
      focusAreas: ['Chest', 'Back', 'Legs', 'Core'],
      injuryNotes: 'None',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.set(defaultUser.id, defaultUser);

    const defaultPlan: WorkoutPlan = {
      id: 'plan-101',
      userId: defaultUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      goal: defaultUser.goal,
      equipment: defaultUser.equipment,
      skillLevel: defaultUser.skillLevel,
      nutritionTip: 'General nutrition guidance: Target ~135g-150g daily protein (1.8-2.0g/kg body weight) distributed across 3-4 meals to stimulate muscle protein synthesis. Drink 3.0-3.5L of water daily. Consult a registered dietitian for individual dietary requirements.',
      status: 'active',
      updatedPlan: null,
      feedbackHistory: [],
      originalPlan: [
        {
          dayNumber: 1,
          day: 'Day 1',
          title: 'Upper Body Push (Hypertrophy)',
          focus: 'Chest, Shoulders & Triceps',
          warm_up: '8 min dynamic shoulder dislocates, arm circles, and push-up walkouts',
          main_workout: [
            this.exercises.get('bench-press') || {
              id: 'bench-press',
              name: 'Barbell Bench Press',
              category: 'gym',
              targetMuscles: ['Chest', 'Triceps'],
              equipment: 'Barbell',
              sets: '4',
              reps_or_duration: '8-10 reps',
              rest: '75 seconds',
              difficulty: 'Intermediate',
              form_cue: 'Retract scapulae, touch sternum, drive through floor.',
              setupInstructions: ['Lie on bench', 'Grip bar'],
              movementPhases: [{ phase: 'Descent', cue: 'Lower to sternum' }],
              breathing: 'Inhale down, exhale up',
              tempo: '3-0-1-0',
              commonMistakes: ['Bouncing bar'],
              safetyNotes: 'Use safety spotters',
              coachingCue: 'Push floor away'
            },
            {
              id: 'overhead-press',
              name: 'Overhead Dumbbell Press',
              category: 'gym',
              targetMuscles: ['Shoulders', 'Triceps'],
              equipment: 'Dumbbells',
              sets: '3',
              reps_or_duration: '10 reps',
              rest: '60 seconds',
              difficulty: 'Intermediate',
              form_cue: 'Keep core braced, press overhead without excessive lumbar arch.',
              setupInstructions: ['Sit tall on bench', 'Hold dumbbells at shoulder height'],
              movementPhases: [{ phase: 'Press', cue: 'Drive weights overhead' }],
              breathing: 'Exhale pressing up',
              tempo: '2-0-1-0',
              commonMistakes: ['Arching lower back'],
              safetyNotes: 'Lower safely to knees',
              coachingCue: 'Finish with biceps by ears'
            },
            this.exercises.get('push-up') || {
              id: 'push-up',
              name: 'Standard Push-Up',
              category: 'bodyweight',
              targetMuscles: ['Chest', 'Triceps'],
              equipment: 'Bodyweight',
              sets: '3',
              reps_or_duration: '12-15 reps',
              rest: '60 seconds',
              difficulty: 'Beginner',
              form_cue: 'Rigid plank line, 3-second descent.',
              setupInstructions: ['Hands shoulder width'],
              movementPhases: [{ phase: 'Lower', cue: 'Lower under control' }],
              breathing: 'Inhale down, exhale up',
              tempo: '3-1-1-0',
              commonMistakes: ['Sagging hips'],
              safetyNotes: 'Maintain neutral neck',
              coachingCue: 'Push floor away'
            },
            this.exercises.get('plank') || {
              id: 'plank',
              name: 'RKC Forearm Plank',
              category: 'bodyweight',
              targetMuscles: ['Core'],
              equipment: 'Bodyweight',
              sets: '3',
              reps_or_duration: '45 seconds',
              rest: '45 seconds',
              difficulty: 'Beginner',
              form_cue: 'Squeeze glutes and draw elbows toward toes.',
              setupInstructions: ['Forearms on floor'],
              movementPhases: [{ phase: 'Hold', cue: 'Maximum core tension' }],
              breathing: 'Controlled nasal breathing',
              tempo: 'Isometric',
              commonMistakes: ['Sagging back'],
              safetyNotes: 'Do not hold breath',
              coachingCue: 'Lock the ribcage to pelvis'
            }
          ],
          cool_down: '5 min doorway pectoral stretch, cross-body shoulder stretch, deep box breathing',
          recoveryGuidance: 'Rest 48 hours before another heavy pressing session. Hydrate with electrolyte-rich water.'
        },
        {
          dayNumber: 2,
          day: 'Day 2',
          title: 'Upper Body Pull & Posterior Chain',
          focus: 'Latissimus Dorsi, Rhomboids & Biceps',
          warm_up: '7 min cat-cow, bird-dogs, band pull-aparts, dead hangs',
          main_workout: [
            this.exercises.get('pull-ups') || {
              id: 'pull-ups',
              name: 'Strict Pull-Ups',
              category: 'bodyweight',
              targetMuscles: ['Lats', 'Biceps'],
              equipment: 'Pull-Up Bar',
              sets: '4',
              reps_or_duration: '8-10 reps',
              rest: '90 seconds',
              difficulty: 'Intermediate',
              form_cue: 'Scapulae down first, pull chest to bar.',
              setupInstructions: ['Grip bar'],
              movementPhases: [{ phase: 'Pull', cue: 'Drive elbows down' }],
              breathing: 'Exhale pulling',
              tempo: '3-0-1-0',
              commonMistakes: ['Swinging'],
              safetyNotes: 'Avoid violent drops',
              coachingCue: 'Lead with sternum'
            },
            this.exercises.get('romanian-deadlift') || {
              id: 'romanian-deadlift',
              name: 'Romanian Deadlift',
              category: 'gym',
              targetMuscles: ['Hamstrings', 'Glutes'],
              equipment: 'Barbell',
              sets: '3',
              reps_or_duration: '10-12 reps',
              rest: '75 seconds',
              difficulty: 'Intermediate',
              form_cue: 'Hinge hips to rear wall, keep bar close to shins.',
              setupInstructions: ['Hip width stance'],
              movementPhases: [{ phase: 'Hinge', cue: 'Feel deep hamstring stretch' }],
              breathing: 'Inhale down, exhale up',
              tempo: '3-1-1-0',
              commonMistakes: ['Rounding back'],
              safetyNotes: 'Keep bar tight to legs',
              coachingCue: 'Shut door with hips'
            }
          ],
          cool_down: '6 min child pose, cobra stretch, hanging decompression',
          recoveryGuidance: 'Support upper back recovery with adequate lean protein and adequate sleep.'
        },
        {
          dayNumber: 3,
          day: 'Day 3',
          title: 'Lower Body Foundation & Quadriceps',
          focus: 'Quadriceps, Glutes & Calves',
          warm_up: '8 min leg swings, bodyweight air squats, ankle mobility drills',
          main_workout: [
            this.exercises.get('barbell-squat') || this.exercises.get('bodyweight-squat')!,
            this.exercises.get('lunge') || {
              id: 'lunge',
              name: 'Walking Lunges',
              category: 'bodyweight',
              targetMuscles: ['Quadriceps', 'Glutes'],
              equipment: 'Bodyweight',
              sets: '3',
              reps_or_duration: '12 reps/leg',
              rest: '60 seconds',
              difficulty: 'Beginner',
              form_cue: 'Upright torso, drop back knee straight down.',
              setupInstructions: ['Feet together'],
              movementPhases: [{ phase: 'Step', cue: '90 degree angles' }],
              breathing: 'Inhale down, exhale up',
              tempo: '2-1-1-0',
              commonMistakes: ['Front knee collapse'],
              safetyNotes: 'Maintain stable base',
              coachingCue: 'Drive through front heel'
            }
          ],
          cool_down: '7 min standing quad stretch, seated hamstring fold, pigeon stretch',
          recoveryGuidance: 'Elevate legs post-session and perform light mobility.'
        },
        {
          dayNumber: 4,
          day: 'Day 4',
          title: 'Active Recovery & Joint Mobility',
          focus: 'Thoracic Mobility, Hip Decompression & Core Flow',
          warm_up: '5 min light brisk walk or easy stationary cycle',
          main_workout: [
            {
              id: 'mobility-flow',
              name: "World's Greatest Stretch Flow",
              category: 'bodyweight',
              targetMuscles: ['Thoracic Spine', 'Hip Flexors', 'Hamstrings'],
              equipment: 'Bodyweight (Floor)',
              sets: '2',
              reps_or_duration: '8 reps/side',
              rest: '30 seconds',
              difficulty: 'Beginner',
              form_cue: 'Lunge forward, plant inner palm, rotate opposite arm toward ceiling.',
              setupInstructions: ['Start in deep lunge position'],
              movementPhases: [{ phase: 'Rotation', cue: 'Follow hand with eyes toward ceiling' }],
              breathing: 'Exhale on thoracic rotation',
              tempo: 'Controlled hold',
              commonMistakes: ['Rushing the stretch'],
              safetyNotes: 'Move only within pain-free active range',
              coachingCue: 'Open through the thoracic cage'
            },
            this.exercises.get('plank')!
          ],
          cool_down: '5 min diaphragmatic box breathing (4s in, 4s hold, 4s out, 4s hold)',
          recoveryGuidance: 'Active recovery promotes blood flow to repair micro-tears without imposing central nervous fatigue.'
        },
        {
          dayNumber: 5,
          day: 'Day 5',
          title: 'Full-Body Compound Power',
          focus: 'Athletic Conditioning & Multi-Joint Synergy',
          warm_up: '8 min jumping jacks, inchworms, bodyweight air squats',
          main_workout: [
            this.exercises.get('bench-press') || this.exercises.get('push-up')!,
            this.exercises.get('bodyweight-squat')!,
            this.exercises.get('romanian-deadlift')!
          ],
          cool_down: '6 min downward dog to cobra flow, kneeling hip flexor stretch',
          recoveryGuidance: 'Ensure post-workout hydration and refuel glycogen stores.'
        },
        {
          dayNumber: 6,
          day: 'Day 6',
          title: 'Aerobic Threshold & Core Power',
          focus: 'Cardiovascular Conditioning & Deep Core Stability',
          warm_up: '6 min easy jog or rower warm-up, dynamic torso twists',
          main_workout: [
            {
              id: 'cardio-intervals',
              name: 'Steady-State Aerobic / Interval Flow',
              category: 'bodyweight',
              targetMuscles: ['Cardiovascular System', 'Full Body'],
              equipment: 'Bodyweight or Cardio Machine',
              sets: '1',
              reps_or_duration: '20-25 minutes',
              rest: 'Continuous',
              difficulty: 'Beginner',
              form_cue: 'Maintain Zone 2 heart rate where nasal breathing is possible.',
              setupInstructions: ['Select running, rowing, or brisk incline walking'],
              movementPhases: [{ phase: 'Pacing', cue: 'Smooth consistent cadence' }],
              breathing: 'Rhythmic nasal inhalation',
              tempo: 'Continuous steady pacing',
              commonMistakes: ['Sprinting too early'],
              safetyNotes: 'Stay hydrated',
              coachingCue: 'Keep effort conversational'
            },
            this.exercises.get('plank')!
          ],
          cool_down: '7 min static stretching and gentle foam rolling',
          recoveryGuidance: 'Focus on electrolyte rehydration.'
        },
        {
          dayNumber: 7,
          day: 'Day 7',
          title: 'Complete Rest & Systemic Reset',
          focus: 'Central Nervous System Recovery & Weekly Reflection',
          warm_up: 'Gentle 5-minute morning mobility stretch',
          main_workout: [
            {
              id: 'restorative-walk',
              name: 'Gentle Nature Walk & Tissue Reset',
              category: 'bodyweight',
              targetMuscles: ['Full Body Recovery'],
              equipment: 'None',
              sets: '1',
              reps_or_duration: '30 minutes easy pace',
              rest: 'Continuous',
              difficulty: 'Beginner',
              form_cue: 'Relax shoulders, take deep diaphragmatic breaths, allow muscles to decompress.',
              setupInstructions: ['Comfortable walking shoes'],
              movementPhases: [{ phase: 'Walk', cue: 'Gentle leisurely pace' }],
              breathing: 'Deep relaxed breathing',
              tempo: 'Slow pace',
              commonMistakes: ['Turning rest into high-intensity workout'],
              safetyNotes: 'Listen to your body',
              coachingCue: 'Rest is where adaptation and growth occur'
            }
          ],
          cool_down: 'Hydration reset and mental preparation for the upcoming training cycle',
          recoveryGuidance: 'Sleep 8 hours to allow growth hormone secretion and tissue remodeling.'
        }
      ]
    };

    this.plans.set(defaultPlan.id, defaultPlan);
    this.indexPlan(defaultPlan);
    this.saveToDisk();
  }

  // User Operations
  getUser(userId: string): UserProfile | null {
    return this.users.get(userId) || null;
  }

  upsertUser(profile: Partial<UserProfile> & { id: string; username: string }): UserProfile {
    const existing = this.users.get(profile.id);
    const updated: UserProfile = {
      id: profile.id,
      username: profile.username || existing?.username || 'Athlete',
      age: profile.age || existing?.age || 26,
      weight: profile.weight || existing?.weight || 72,
      weightUnit: profile.weightUnit || existing?.weightUnit || 'kg',
      height: profile.height ?? existing?.height,
      heightUnit: profile.heightUnit || existing?.heightUnit || 'cm',
      avatar: profile.avatar ?? existing?.avatar,
      goal: profile.goal || existing?.goal || 'Muscle Gain',
      intensity: profile.intensity || existing?.intensity || 'Intermediate',
      skillLevel: profile.skillLevel || existing?.skillLevel || 'Intermediate',
      equipment: profile.equipment || existing?.equipment || 'gym',
      sessionDuration: profile.sessionDuration || existing?.sessionDuration || '45-60 min',
      focusAreas: profile.focusAreas || existing?.focusAreas || ['Chest', 'Back', 'Legs', 'Core'],
      injuryNotes: profile.injuryNotes ?? existing?.injuryNotes ?? '',
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.set(updated.id, updated);
    this.saveToDisk();
    cache.invalidateTags(`user:${updated.id}`);
    return updated;
  }

  saveUserAvatar(userId: string, avatarData: any): UserProfile | null {
    const user = this.users.get(userId);
    if (!user) return null;
    user.avatar = avatarData;
    user.updatedAt = new Date().toISOString();
    this.users.set(userId, user);
    this.saveToDisk();
    cache.invalidateTags(`user:${userId}`);
    return user;
  }

  getUserAvatar(userId: string): any | null {
    const user = this.users.get(userId);
    return user?.avatar || null;
  }

  getAllUsers(): UserProfile[] {
    return Array.from(this.users.values());
  }

  // Plan Operations
  getPlan(planId: string): WorkoutPlan | null {
    return this.plans.get(planId) || null;
  }

  getUserActivePlan(userId: string): WorkoutPlan | null {
    const planIds = this.userPlanIndex.get(userId);
    if (!planIds || planIds.length === 0) return null;
    // Find active plan or most recent
    for (let i = planIds.length - 1; i >= 0; i--) {
      const plan = this.plans.get(planIds[i]);
      if (plan && plan.status === 'active') return plan;
    }
    return this.plans.get(planIds[planIds.length - 1]) || null;
  }

  savePlan(plan: WorkoutPlan): WorkoutPlan {
    this.plans.set(plan.id, plan);
    this.indexPlan(plan);
    this.saveToDisk();
    cache.invalidateTags(`plan:${plan.id}`);
    cache.invalidateTags(`user:${plan.userId}`);
    return plan;
  }

  getAllPlans(): WorkoutPlan[] {
    return Array.from(this.plans.values());
  }

  // Completion Operations
  toggleCompletion(userId: string, planId: string, dayNumber: number, exerciseId: string, exerciseName: string): { completed: boolean; completion: WorkoutCompletion } {
    const key = `${userId}:${planId}:${dayNumber}:${exerciseId}`;
    const existing = this.completionIndex.get(key);

    if (existing) {
      // Toggle off
      existing.completed = !existing.completed;
      existing.completedAt = new Date().toISOString();
      this.saveToDisk();
      cache.invalidateTags(`progress:${userId}`);
      return { completed: existing.completed, completion: existing };
    }

    // Toggle on (new completion)
    const newCompletion: WorkoutCompletion = {
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId,
      planId,
      dayNumber,
      exerciseId,
      exerciseName,
      completed: true,
      completedAt: new Date().toISOString()
    };
    this.completions.push(newCompletion);
    this.completionIndex.set(key, newCompletion);
    this.saveToDisk();
    cache.invalidateTags(`progress:${userId}`);
    return { completed: true, completion: newCompletion };
  }

  getUserCompletions(userId: string): WorkoutCompletion[] {
    return this.completions.filter(c => c.userId === userId && c.completed);
  }

  // Exercises Library
  getAllExercises(): ExerciseItem[] {
    return Array.from(this.exercises.values());
  }

  getExercise(id: string): ExerciseItem | null {
    return this.exercises.get(id) || null;
  }

  findExerciseByName(name: string): ExerciseItem | null {
    const lower = name.toLowerCase();
    for (const ex of this.exercises.values()) {
      if (ex.name.toLowerCase() === lower || lower.includes(ex.name.toLowerCase()) || ex.name.toLowerCase().includes(lower)) {
        return ex;
      }
    }
    return null;
  }

  // Coach Sessions
  getOrCreateCoachSession(userId: string, currentDay: number = 1, currentExercise: string = 'Push-Up'): CoachSession {
    const existing = this.coachSessions.get(userId);
    if (existing) {
      existing.currentDay = currentDay;
      existing.currentExercise = currentExercise;
      existing.lastActiveAt = new Date().toISOString();
      return existing;
    }
    const newSession: CoachSession = {
      id: `coach-${userId}`,
      userId,
      startedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      currentDay,
      currentExercise,
      history: [
        {
          role: 'model',
          content: "I'm ready. Tell me what you need.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    this.coachSessions.set(userId, newSession);
    this.saveToDisk();
    return newSession;
  }

  appendCoachMessage(userId: string, message: CoachMessage): CoachSession {
    const session = this.getOrCreateCoachSession(userId);
    session.history.push(message);
    if (session.history.length > 30) {
      session.history = session.history.slice(-30);
    }
    session.lastActiveAt = new Date().toISOString();
    this.saveToDisk();
    return session;
  }

  // Active Workout Session State (for "Continue Workout" exact resumption)
  getWorkoutSessionState(userId: string): any | null {
    return this.workoutSessionStates.get(userId) || null;
  }

  saveWorkoutSessionState(userId: string, state: any): any {
    const updated = {
      ...state,
      userId,
      lastUpdated: new Date().toISOString()
    };
    this.workoutSessionStates.set(userId, updated);
    this.saveToDisk();
    return updated;
  }

  clearWorkoutSessionState(userId: string): void {
    this.workoutSessionStates.delete(userId);
    this.saveToDisk();
  }
}

export const db = new FitBuddyDatabase();
