export interface AvatarProfile {
  id: string;
  userId: string;
  heightCm?: number;
  heightUnit?: 'cm' | 'in';
  weightKg?: number;
  weightUnit?: 'kg' | 'lbs';
  genderPresentation: 'masculine' | 'feminine' | 'neutral';
  bodyBuild: 'lean' | 'athletic' | 'medium' | 'muscular' | 'stocky';
  skinToneHex: string;
  hairColorHex: string;
  hairStyle: 'short' | 'buzz' | 'medium' | 'long' | 'tied';
  topColorHex: string;
  bottomColorHex: string;
  shoesColorHex: string;
  shoulderWidthScale: number; // 0.85 to 1.25
  chestScale: number; // 0.85 to 1.25
  waistScale: number; // 0.85 to 1.25
  hipScale: number; // 0.85 to 1.25
  limbThicknessScale: number; // 0.85 to 1.25
  heightScale: number; // 0.88 to 1.15
  photoAnalyzedAt?: string;
  isApproximateEstimate: boolean;
  notes?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  age: number;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height?: number;
  heightUnit?: 'cm' | 'in';
  avatar?: AvatarProfile;
  goal: string;
  intensity: 'Beginner' | 'Intermediate' | 'Advanced';
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: 'gym' | 'bodyweight' | 'minimal';
  sessionDuration: string;
  focusAreas: string[];
  injuryNotes?: string;
  createdAt?: string;
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
  howToPerform?: {
    startingPosition: string;
    movement: string;
    returnPosition: string;
  };
  setupInstructions?: string[];
  movementPhases?: { phase: string; cue: string }[];
  breathing?: string;
  tempo?: string;
  commonMistakes?: string[];
  safetyNotes?: string;
  coachingCue?: string;
  modelPose?: 'chest' | 'quads' | 'core' | 'back' | 'shoulders' | 'posterior';
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

export type CoachState = 
  | 'IDLE' 
  | 'REQUESTING_MIC' 
  | 'LISTENING' 
  | 'PROCESSING' 
  | 'SPEAKING' 
  | 'ERROR' 
  | 'PAUSED' 
  | 'ENDED';

export interface WorkoutHistoryItem {
  date: string;
  dayNumber: number;
  title: string;
  focus: string;
  exercisesCompleted: number;
  totalExercises: number;
  completed: boolean;
  completedAt: string;
}

export interface ActiveWorkoutState {
  userId: string;
  planId: string;
  dayNumber: number;
  exerciseIndex: number;
  exerciseName: string;
  currentSet: number;
  totalSets: number;
  isPaused: boolean;
  sessionDurationSecs: number;
  lastUpdated: string;
}

export interface UserSettings {
  voiceCoachEnabled: boolean;
  reducedMotion: boolean;
  theme: 'dark';
}

export type NavTab = 'home' | 'plan' | 'workout' | 'coach' | 'progress' | 'profile' | 'admin' | 'generate' | 'demos';

