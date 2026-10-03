import { ExerciseItem } from '../types';

export interface GoalEducation {
  id: string;
  title: string;
  explanation: string;
  focus: string;
  sampleWorkout: string;
  recoveryGuidance: string;
  nutritionGuidance: string;
  recommendedExercises: string[];
}

export interface FocusAreaEducation {
  id: string;
  title: string;
  explanation: string;
  keyMuscles: string[];
  recommendedExercises: string[];
  coachingGuidance: string;
}

export const GOALS_EDUCATION: Record<string, GoalEducation> = {
  'Muscle Gain': {
    id: 'Muscle Gain',
    title: 'Hypertrophy & Muscle Gain',
    explanation: 'Progressive mechanical tension and metabolic stress across 8-12 rep ranges to stimulate myofibrillar protein synthesis.',
    focus: 'Compound compound lifts, 60-90s rest, high motor-unit recruitment, and structured progressive overload.',
    sampleWorkout: 'Barbell Bench Press (4x8-10), Incline Dumbbell Press (3x10), Tricep Dips (3x12), Cable Extensions (3x15).',
    recoveryGuidance: 'Allow 48-72 hours between targeting the same muscle group. Sleep 7.5-8.5 hours for growth hormone release.',
    nutritionGuidance: 'Target 1.8-2.0g protein/kg bodyweight daily in a mild 200-300 kcal surplus.',
    recommendedExercises: ['bench-press', 'barbell-squat', 'pull-ups', 'romanian-deadlift']
  },
  'Weight Loss': {
    id: 'Weight Loss',
    title: 'Fat Loss & Conditioning',
    explanation: 'Sustained energy expenditure through high-density resistance training to preserve lean muscle tissue while losing fat.',
    focus: 'Compound circuits, controlled rest intervals (45-60s), metabolic conditioning, and daily caloric deficit.',
    sampleWorkout: 'Goblet Squats (4x12), Push-Ups (3x15), Dumbbell Rows (3x12), Mountain Climbers (3x40s).',
    recoveryGuidance: 'Active walking and low-intensity mobility to enhance recovery without adding systemic fatigue.',
    nutritionGuidance: 'Aim for a 300-500 kcal deficit with high protein (2.0-2.2g/kg) to prevent muscle loss.',
    recommendedExercises: ['bodyweight-squat', 'push-up', 'lunge', 'plank']
  },
  'Strength': {
    id: 'Strength',
    title: 'Maximum Force Production & Neural Drive',
    explanation: 'Maximizing central nervous system efficiency and motor-unit synchronization using heavy loads (80-90% 1RM).',
    focus: 'Lower rep ranges (3-6 reps), longer rest intervals (2-3 minutes), and multi-joint athletic movements.',
    sampleWorkout: 'Barbell Squat (5x5), Barbell Bench Press (5x5), Romanian Deadlift (3x6).',
    recoveryGuidance: 'CNS recovery requires full 48-72 hour rest windows and ample electrolyte replenishment.',
    nutritionGuidance: 'Eucaloric or slight surplus with ample complex carbohydrates around heavy training sessions.',
    recommendedExercises: ['barbell-squat', 'bench-press', 'romanian-deadlift', 'pull-ups']
  },
  'General Fitness': {
    id: 'General Fitness',
    title: 'Functional Longevity & Health',
    explanation: 'Balanced development of aerobic capacity, joint mobility, muscular endurance, and core stability.',
    focus: 'Full-body functional movements, balance, posture alignment, and cardiovascular intervals.',
    sampleWorkout: 'Bodyweight Air Squats (3x15), Push-Ups (3x12), Inverted Rows (3x10), Forearm Plank (3x45s).',
    recoveryGuidance: 'Daily movement, gentle morning mobility, and consistent 7-8 hours sleep.',
    nutritionGuidance: 'Balanced whole-food intake with ~1.6g protein/kg body weight and consistent hydration.',
    recommendedExercises: ['push-up', 'bodyweight-squat', 'plank', 'lunge']
  },
  'Endurance': {
    id: 'Endurance',
    title: 'Aerobic Threshold & Stamina',
    explanation: 'Increasing mitochondrial density, capillary recruitment, and lactate threshold for sustained performance.',
    focus: 'Higher repetitions (15-25 reps), shorter rest (30-45s), and steady-state cardiovascular work.',
    sampleWorkout: 'Air Squats (3x20), Push-Ups (3x15), Walking Lunges (3x15/leg), 25 min Aerobic Flow.',
    recoveryGuidance: 'Refuel glycogen stores promptly post-workout and maintain electrolyte balance.',
    nutritionGuidance: 'Higher carbohydrate proportion (50-60% of daily calories) to sustain training volume.',
    recommendedExercises: ['bodyweight-squat', 'lunge', 'push-up', 'plank']
  }
};

export const FOCUS_AREAS_EDUCATION: Record<string, FocusAreaEducation> = {
  'Full Body': {
    id: 'Full Body',
    title: 'Full Body Compound Synergy',
    explanation: 'Trains major muscle chains in single sessions for maximum hormonal response and systemic balance.',
    keyMuscles: ['Chest', 'Back', 'Quadriceps', 'Hamstrings', 'Core'],
    recommendedExercises: ['push-up', 'bodyweight-squat', 'romanian-deadlift', 'plank'],
    coachingGuidance: 'Ensure proper warm-up of both shoulder girdle and hip capsules before loading.'
  },
  'Chest': {
    id: 'Chest',
    title: 'Pectoralis Major & Serratus Complex',
    explanation: 'Develops pressing power, shoulder stability, and horizontal adduction strength.',
    keyMuscles: ['Pectoralis Major', 'Pectoralis Minor', 'Anterior Deltoid', 'Serratus'],
    recommendedExercises: ['bench-press', 'push-up', 'dumbbell-floor-press'],
    coachingGuidance: 'Keep shoulder blades retracted and packed down against the ribcage to isolate chest fibers.'
  },
  'Back': {
    id: 'Back',
    title: 'Latissimus Dorsi & Posterior Chain',
    explanation: 'Reinforces posture, scapular retraction, spinal integrity, and pulling strength.',
    keyMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Trapezius', 'Erector Spinae'],
    recommendedExercises: ['pull-ups', 'romanian-deadlift'],
    coachingGuidance: 'Initiate every pull by depressing the scapulae rather than bending at the elbows first.'
  },
  'Arms': {
    id: 'Arms',
    title: 'Biceps & Triceps Kinetics',
    explanation: 'Strengthens elbow flexion and extension mechanics for heavy compound stabilization.',
    keyMuscles: ['Biceps Brachii', 'Brachialis', 'Triceps Brachii (All 3 Heads)'],
    recommendedExercises: ['push-up', 'pull-ups', 'dumbbell-floor-press'],
    coachingGuidance: 'Avoid swinging the torso; keep upper arms locked in plane.'
  },
  'Legs': {
    id: 'Legs',
    title: 'Quadriceps, Hamstrings & Glutes',
    explanation: 'The foundation of athletic power, locomotion, and metabolic capacity.',
    keyMuscles: ['Quadriceps Femoris', 'Gluteus Maximus', 'Biceps Femoris', 'Gastrocnemius'],
    recommendedExercises: ['barbell-squat', 'bodyweight-squat', 'romanian-deadlift', 'lunge'],
    coachingGuidance: 'Distribute foot pressure evenly across the tripod of the foot, tracking knees over toes.'
  },
  'Core': {
    id: 'Core',
    title: 'Anterior & Anti-Rotational Core',
    explanation: 'Transfers force between lower and upper extremities while protecting the lumbar spine.',
    keyMuscles: ['Rectus Abdominis', 'Transverse Abdominis', 'Obliques', 'Quadratus Lumborum'],
    recommendedExercises: ['plank'],
    coachingGuidance: 'Prioritize intra-abdominal bracing over excessive lumbar flexion.'
  },
  'Mobility': {
    id: 'Mobility',
    title: 'Joint Decompression & Movement Quality',
    explanation: 'Restores active range of motion, alleviates joint stiffness, and prevents overuse injuries.',
    keyMuscles: ['Thoracic Spine', 'Hip Flexors', 'Ankle Dorsiflexors', 'Glenohumeral Capsule'],
    recommendedExercises: ['lunge', 'bodyweight-squat'],
    coachingGuidance: 'Coordinate slow diaphragmatic breathing with every rotational movement.'
  }
};

export const EXERCISE_CLASSES: Record<string, ExerciseItem> = {
  'push-up': {
    id: 'push-up',
    name: 'Push-Up',
    category: 'bodyweight',
    targetMuscles: ['Chest (Pectoralis Major)', 'Anterior Deltoids', 'Triceps Brachii'],
    equipment: 'Bodyweight',
    sets: '3-4 sets',
    reps_or_duration: '10-15 reps',
    rest: '60 seconds',
    difficulty: 'Beginner',
    form_cue: 'Maintain a rigid kinetic plank line; lower sternum to floor with elbows tucked at 45 degrees.',
    setupInstructions: [
      'Place hands firmly on the ground slightly wider than shoulder-width.',
      'Align wrists directly beneath shoulders and spread fingers for ground grip.',
      'Extend legs straight back, resting on balls of feet.',
      'Engage glutes and core so your body forms a straight line from ears to ankles.'
    ],
    movementPhases: [
      { phase: 'Setup & Lockout', cue: 'Push palms through floor, hollow body, chin tucked.' },
      { phase: 'Eccentric (Lowering)', cue: 'Lower torso under control over 3 seconds, keeping elbows at 45 degrees.' },
      { phase: 'Isometric Pause', cue: 'Hover 1 inch off the floor without sagging hips.' },
      { phase: 'Concentric (Drive)', cue: 'Press forcefully through palms back to full elbow lockout.' }
    ],
    breathing: 'Inhale deeply as you descend; exhale forcefully as you drive through the floor.',
    tempo: '3-1-1-0 (3s Lower, 1s Pause, 1s Drive, 0s Rest at top)',
    commonMistakes: [
      'Sagging hips putting hyperextension stress on the lumbar spine.',
      'Flaring elbows out to 90 degrees in a T-shape, risking shoulder impingement.',
      'Craning the neck forward to reach the floor early.'
    ],
    safetyNotes: 'If wrists feel strained, use push-up grips or perform on knuckles with neutral wrists.',
    coachingCue: 'Imagine pushing the floor away from your chest, rather than lifting your body.',
    modelPose: 'chest',
    howToPerform: {
      startingPosition: 'Place hands firmly on the ground slightly wider than shoulder-width. Extend legs straight back on toes, engaging core and glutes into a rigid horizontal plank line.',
      movement: 'Lower your sternum under strict control over 3 seconds until your chest hovers 1 inch above the floor, keeping elbows tucked at a 45-degree angle.',
      returnPosition: 'Drive through your palms forcefully back to full arm extension without shrugging your shoulders or losing abdominal tension.'
    }
  },
  'bench-press': {
    id: 'bench-press',
    name: 'Bench Press',
    category: 'gym',
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps Brachii'],
    equipment: 'Olympic Barbell & Flat Bench',
    sets: '4 sets',
    reps_or_duration: '8-10 reps',
    rest: '75-90 seconds',
    difficulty: 'Intermediate',
    form_cue: 'Retract shoulder blades into bench, plant heels firmly, touch mid-chest, press upward in slight arc.',
    setupInstructions: [
      'Lie flat on the bench with eyes aligned directly beneath the racked barbell.',
      'Plant feet flat on the floor, driving through heels for stable leg drive.',
      'Retract and depress shoulder blades, pinning them securely into the bench padding.',
      'Grip the bar slightly wider than shoulder-width with thumbs fully wrapped around.'
    ],
    movementPhases: [
      { phase: 'Unrack & Settle', cue: 'Lift bar over chest line, lock lats, take 360-degree breath.' },
      { phase: 'Controlled Lowering', cue: 'Lower bar to lower sternum over 3 seconds with elbows at 45 degrees.' },
      { phase: 'Touch & Turnaround', cue: 'Touch chest softly without bouncing off ribs.' },
      { phase: 'Drive & Lockout', cue: 'Drive feet into ground, press bar upward and slightly back over shoulders.' }
    ],
    breathing: 'Deep diaphragmatic inhale and core brace before descent; exhale past the sticking point on ascent.',
    tempo: '3-1-1-0',
    commonMistakes: [
      'Bouncing the heavy barbell off the sternum.',
      'Lifting glutes off the bench to force heavy weight.',
      'Unequal lockout between arms.'
    ],
    safetyNotes: 'Always use collars and keep safety spotter arms set at chest height.',
    coachingCue: 'Bend the bar in half with your hands to engage lats and stabilize shoulders.',
    modelPose: 'chest',
    howToPerform: {
      startingPosition: 'Lie flat on bench with eyes under bar. Retract and pack shoulder blades firmly into padding, feet planted flat on floor.',
      movement: 'Lower the barbell under control to your lower sternum over 3 seconds, keeping elbows tucked at 45 degrees.',
      returnPosition: 'Drive feet into floor and press bar up and slightly back over shoulder joints until elbows are locked out.'
    }
  },
  'squat': {
    id: 'squat',
    name: 'Squat',
    category: 'bodyweight',
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Adductors'],
    equipment: 'Bodyweight or Barbell',
    sets: '3-4 sets',
    reps_or_duration: '12-15 reps',
    rest: '60-90 seconds',
    difficulty: 'Beginner',
    form_cue: 'Hinge hips backward, keep knees tracking over second toes, hit parallel depth with upright chest.',
    setupInstructions: [
      'Stand tall with feet shoulder-width apart, toes turned outward 10-20 degrees.',
      'Evenly distribute weight across the tripod of each foot.',
      'Keep chest proud and eyes fixed on a spot 6-8 feet forward on the floor.'
    ],
    movementPhases: [
      { phase: 'Hinge & Descent', cue: 'Break simultaneously at hips and knees, descending over 3 seconds.' },
      { phase: 'Parallel Depth', cue: 'Thighs reach parallel with floor, knees tracking outward.' },
      { phase: 'Drive Ascent', cue: 'Push through midfoot, driving hips and chest up at the same rate.' }
    ],
    breathing: 'Inhale into abdomen on descent; exhale forcefully standing up.',
    tempo: '3-1-1-0',
    commonMistakes: [
      'Knees collapsing inward (valgus collapse).',
      'Heels rising off the floor.',
      'Excessive forward lean causing lower back rounding.'
    ],
    safetyNotes: 'Never let knees cave inward; elevate heels slightly on small plates if ankle mobility is restricted.',
    coachingCue: 'Spread the floor apart with your feet as you descend into the hole.',
    modelPose: 'quads',
    howToPerform: {
      startingPosition: 'Stand upright with feet shoulder-width apart, toes flared out 15 degrees, arms clasped or extended for balance.',
      movement: 'Hinge hips back and bend knees, tracking knees outward over toes until thighs reach parallel depth.',
      returnPosition: 'Drive firmly through midfoot to return to full standing height, squeezing glutes at the top.'
    }
  },
  'lunge': {
    id: 'lunge',
    name: 'Lunge',
    category: 'bodyweight',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    equipment: 'Bodyweight or Dumbbells',
    sets: '3 sets',
    reps_or_duration: '10-12 reps per leg',
    rest: '60 seconds',
    difficulty: 'Beginner',
    form_cue: 'Step back into a clean 90-degree knee bend, keep torso upright, drive through front heel.',
    setupInstructions: [
      'Stand upright with feet hip-width apart and hands on hips or holding dumbbells.',
      'Take a controlled step backward about 2 to 3 feet.',
      'Keep torso vertical and core engaged.'
    ],
    movementPhases: [
      { phase: 'Step & Lower', cue: 'Drop rear knee until it hovers 1 inch above the floor.' },
      { phase: 'Transition', cue: 'Both knees at 90-degree angles; front shin vertical.' },
      { phase: 'Return Drive', cue: 'Drive through front heel to step back to starting position.' }
    ],
    breathing: 'Inhale stepping back; exhale driving forward to standing.',
    tempo: '2-1-1-0',
    commonMistakes: [
      'Front knee shooting far past toes.',
      'Leaning torso forward over thighs.',
      'Walking on a tightrope (step backward along railroad tracks for stability).'
    ],
    safetyNotes: 'Reverse lunges place less shearing force on the patellar tendon than forward lunges.',
    coachingCue: 'Keep front shin vertical and load the front glute.',
    modelPose: 'quads',
    howToPerform: {
      startingPosition: 'Stand tall with feet hip-width apart and hands at your sides or on hips with proud chest.',
      movement: 'Step one foot straight back 2-3 feet and lower your rear knee until it hovers 1 inch off floor with both knees bent at 90 degrees.',
      returnPosition: 'Drive through the front heel to return cleanly to standing position.'
    }
  },
  'plank': {
    id: 'plank',
    name: 'Plank',
    category: 'bodyweight',
    targetMuscles: ['Rectus Abdominis', 'Transverse Abdominis', 'Glutes', 'Serratus'],
    equipment: 'Bodyweight (Floor/Mat)',
    sets: '3 sets',
    reps_or_duration: '45-60 seconds',
    rest: '45 seconds',
    difficulty: 'Beginner',
    form_cue: 'Elbows under shoulders, contract glutes, pull elbows toward toes to create maximal abdominal bracing.',
    setupInstructions: [
      'Rest on forearms with elbows directly under shoulders.',
      'Tuck pelvis into slight posterior tilt and squeeze glutes hard.',
      'Create a rigid plank line from crown to heels.'
    ],
    movementPhases: [
      { phase: 'Active Tension', cue: 'Pull elbows toward toes and toes toward elbows isometrically.' },
      { phase: 'Continuous Breathing', cue: 'Shallow nasal breaths while keeping abdominal wall rock-solid.' }
    ],
    breathing: 'Continuous rhythmic shallow breathing into ribcage without letting stomach relax.',
    tempo: 'Isometric tension hold',
    commonMistakes: [
      'Lower back arching with sagging hips.',
      'Hips piked high in the air.',
      'Holding breath until dizzy.'
    ],
    safetyNotes: 'Drop to knees if lower back feels pressure or strain.',
    coachingCue: 'Focus on 30 seconds of high tension rather than 2 minutes of lazy holding.',
    modelPose: 'core',
    howToPerform: {
      startingPosition: 'Rest on forearms directly under shoulders with fists relaxed, feet together on balls of feet.',
      movement: 'Engage glutes and tuck pelvis into posterior tilt, creating a straight bridge line from head to heels.',
      returnPosition: 'Hold static tension for prescribed duration with steady nasal breathing, never allowing hips to drop.'
    }
  },
  'deadlift': {
    id: 'deadlift',
    name: 'Deadlift',
    category: 'gym',
    targetMuscles: ['Hamstrings', 'Gluteus Maximus', 'Erector Spinae', 'Latissimus Dorsi'],
    equipment: 'Barbell & Weight Plates',
    sets: '4 sets',
    reps_or_duration: '6-8 reps',
    rest: '90-120 seconds',
    difficulty: 'Advanced',
    form_cue: 'Hinge at the hips, pull slack out of bar, drive floor away with legs, lock out hips.',
    setupInstructions: [
      'Stand with feet hip-width apart, bar over midfoot (1 inch from shins).',
      'Hinge hips back, bend knees slightly, grip bar outside legs.',
      'Pull chest proud, pull slack out of bar until it clicks, engage lats.'
    ],
    movementPhases: [
      { phase: 'Setup & Slack Pull', cue: 'Lock lats, wedge hips, create full-body tension.' },
      { phase: 'Floor Push', cue: 'Push floor away with legs; bar travels vertically in contact with shins.' },
      { phase: 'Lockout', cue: 'Squeeze glutes to stand tall without hyperextending lower back.' },
      { phase: 'Return Hinge', cue: 'Hinge hips backward until bar passes knees, then lower to floor.' }
    ],
    breathing: 'Deep intra-abdominal breath and brace before lift; exhale once past knees on descent.',
    tempo: '1-0-2-0 (Controlled eccentric lowering)',
    commonMistakes: [
      'Rounding the lumbar spine under load.',
      'Letting the bar drift away from the shins.',
      'Hyperextending the back at the top.'
    ],
    safetyNotes: 'Never lift with a rounded lower spine. Lower bar with controlled hip hinge.',
    coachingCue: 'Push the world away with your feet.',
    modelPose: 'posterior',
    howToPerform: {
      startingPosition: 'Stand with bar over midfoot, feet hip-width apart. Hinge hips back, bend knees slightly, grip bar firmly, and lock lats.',
      movement: 'Drive the floor away with your legs, keeping the bar close to your shins until hips and knees reach full extension.',
      returnPosition: 'Hinge hips backward to lower the bar back to the floor with a flat spine.'
    }
  },
  'shoulder-press': {
    id: 'shoulder-press',
    name: 'Shoulder Press',
    category: 'gym',
    targetMuscles: ['Anterior & Lateral Deltoids', 'Triceps Brachii', 'Upper Trapezius'],
    equipment: 'Dumbbells or Barbell',
    sets: '3-4 sets',
    reps_or_duration: '10-12 reps',
    rest: '60 seconds',
    difficulty: 'Intermediate',
    form_cue: 'Keep core braced, press dumbbells directly overhead without hyperextending lumbar spine.',
    setupInstructions: [
      'Sit tall on upright bench or stand with feet shoulder-width apart.',
      'Hold dumbbells at shoulder level with palms facing slightly inward (neutral or semi-pronated).',
      'Brace abdominal wall.'
    ],
    movementPhases: [
      { phase: 'Starting Position', cue: 'Dumbbells resting at ear level, elbows forward at 30 degrees.' },
      { phase: 'Concentric Press', cue: 'Press overhead in smooth path until arms reach full extension.' },
      { phase: 'Controlled Lowering', cue: 'Lower dumbbells over 3 seconds back to shoulder level.' }
    ],
    breathing: 'Inhale at bottom; exhale pressing upward.',
    tempo: '3-0-1-0',
    commonMistakes: [
      'Excessive arch in lower back.',
      'Flaring elbows completely out to sides.',
      'Using leg bounce on strict overhead presses.'
    ],
    safetyNotes: 'Keep elbows slightly in front of shoulders (scapular plane) to prevent impingement.',
    coachingCue: 'Finish with your biceps aligned next to your ears.',
    modelPose: 'shoulders',
    howToPerform: {
      startingPosition: 'Hold dumbbells at shoulder height with elbows slightly in front of shoulders and core braced.',
      movement: 'Press dumbbells vertically in a smooth line overhead until arms are fully extended without overarching the lower back.',
      returnPosition: 'Lower the weights under strict control over 3 seconds back to shoulder level.'
    }
  },
  'pull-up': {
    id: 'pull-up',
    name: 'Pull-Up',
    category: 'bodyweight',
    targetMuscles: ['Latissimus Dorsi', 'Biceps Brachii', 'Rhomboids', 'Forearms'],
    equipment: 'Pull-Up Bar',
    sets: '3-4 sets',
    reps_or_duration: '6-10 reps',
    rest: '90 seconds',
    difficulty: 'Intermediate',
    form_cue: 'Initiate by packing your shoulder blades down and back, pull chest toward bar without swinging.',
    setupInstructions: [
      'Grip the pull-up bar slightly wider than shoulder-width with palms facing away (overhand grip).',
      'Hang with full arm extension, engaging your shoulder girdle into an active hang.',
      'Brace your abdominal wall and point your toes slightly forward.'
    ],
    movementPhases: [
      { phase: 'Active Hang & Depress', cue: 'Depress and retract scapulae without bending elbows yet.' },
      { phase: 'Concentric Drive', cue: 'Drive elbows down and back into your ribs to pull chest toward bar.' },
      { phase: 'Top Squeeze', cue: 'Clear chin over bar and hold chest high for a micro-pause.' },
      { phase: 'Controlled Lowering', cue: 'Lower over 3 seconds to full active hang.' }
    ],
    breathing: 'Inhale deeply at the bottom; exhale forcefully as you drive elbows down to pull upward.',
    tempo: '3-0-1-1',
    commonMistakes: [
      'Kicking legs or using momentum (kipping) on strict strength sets.',
      'Failing to reach full arm extension at the bottom.',
      'Shrugging shoulders into ears at the top of the movement.'
    ],
    safetyNotes: 'Use a resistance band under feet or an assisted machine if strict bodyweight reps break form.',
    coachingCue: 'Imagine pulling your elbows down into your back pockets.',
    modelPose: 'back',
    howToPerform: {
      startingPosition: 'Grip bar overhand slightly wider than shoulder-width. Hang in an active hang with lats engaged and core tight.',
      movement: 'Pull your chest toward the bar by driving your elbows down and back until your chin clears the bar.',
      returnPosition: 'Lower yourself under control over 3 seconds until arms are fully extended back in an active hang.'
    }
  },
  'dumbbell-row': {
    id: 'dumbbell-row',
    name: 'Dumbbell Row',
    category: 'minimal',
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Rear Deltoids', 'Biceps'],
    equipment: 'Dumbbells & Flat Bench',
    sets: '3-4 sets',
    reps_or_duration: '10-12 reps per arm',
    rest: '60 seconds',
    difficulty: 'Beginner',
    form_cue: 'Keep spine flat, pull dumbbell toward your hip pocket, pause and squeeze back muscles.',
    setupInstructions: [
      'Place one knee and same-side hand firmly on a flat bench.',
      'Plant the opposite foot flat on the floor for lateral stability.',
      'Grip dumbbell with neutral grip, arm hanging straight down with a flat back.'
    ],
    movementPhases: [
      { phase: 'Scapular Set', cue: 'Flatten spine parallel to bench and lock core.' },
      { phase: 'Row to Hip', cue: 'Pull dumbbell toward your hip crease, keeping elbow tucked.' },
      { phase: 'Peak Contraction', cue: 'Squeeze latissimus and rhomboid hard at top.' },
      { phase: 'Eccentric Stretch', cue: 'Lower weight slowly over 3 seconds, feeling deep lat stretch.' }
    ],
    breathing: 'Inhale as weight descends; exhale as you row the dumbbell toward your hip.',
    tempo: '3-1-1-1',
    commonMistakes: [
      'Rotating the entire torso to jerk the dumbbell upward.',
      'Pulling dumbbell to shoulder/neck instead of hip crease.',
      'Rounding the upper spine under load.'
    ],
    safetyNotes: 'Keep the spine neutral throughout; do not let the dumbbell pull you into spinal flexion.',
    coachingCue: 'Lead with your elbow, not your wrist or bicep.',
    modelPose: 'back',
    howToPerform: {
      startingPosition: 'Rest knee and hand on bench, other foot on floor. Back flat, arm hanging with dumbbell.',
      movement: 'Row dumbbell up and back toward your hip crease, driving elbow toward the ceiling.',
      returnPosition: 'Lower dumbbell smoothly under full control until arm is fully extended.'
    }
  },
  'glute-bridge': {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    category: 'bodyweight',
    targetMuscles: ['Gluteus Maximus', 'Hamstrings', 'Transverse Abdominis'],
    equipment: 'Bodyweight or Dumbbell',
    sets: '3 sets',
    reps_or_duration: '15-20 reps',
    rest: '45-60 seconds',
    difficulty: 'Beginner',
    form_cue: 'Drive through heels, squeeze glutes to form straight diagonal line from knees to shoulders, avoid lumbar hyperextension.',
    setupInstructions: [
      'Lie flat on your back on an exercise mat with knees bent and feet flat on floor hip-width apart.',
      'Position heels about 6-8 inches away from your glutes.',
      'Rest arms flat on the floor at your sides with palms down.'
    ],
    movementPhases: [
      { phase: 'Setup & Posterior Tilt', cue: 'Flatten lower back against floor and brace core.' },
      { phase: 'Concentric Drive', cue: 'Drive through heels and push hips upward toward ceiling.' },
      { phase: 'Peak Contraction', cue: 'Hold at top for 2 seconds, squeezing glutes forcefully.' },
      { phase: 'Controlled Lowering', cue: 'Lower hips over 2 seconds until hovering just off floor.' }
    ],
    breathing: 'Inhale at bottom; exhale as you drive hips up into full extension.',
    tempo: '2-2-1-0',
    commonMistakes: [
      'Hyperextending the lower back rather than extending through hips.',
      'Pushing through toes instead of driving through heels.',
      'Letting knees cave inward during the drive.'
    ],
    safetyNotes: 'Tuck chin slightly to keep cervical spine neutral and prevent rib flare.',
    coachingCue: 'Lock out your hips with glutes, never your lower back.',
    modelPose: 'posterior',
    howToPerform: {
      startingPosition: 'Lie on your back with knees bent at 90 degrees, feet flat on floor hip-width apart.',
      movement: 'Drive firmly through heels to lift hips toward ceiling until thighs and torso align straight.',
      returnPosition: 'Pause for 2 seconds at peak contraction, then lower hips under control back to the mat.'
    }
  }
};

export function getExerciseDemoData(query: string): ExerciseItem {
  if (!query) return EXERCISE_CLASSES['push-up'];
  const lower = query.toLowerCase();

  // 1. Direct key match
  for (const [key, item] of Object.entries(EXERCISE_CLASSES)) {
    if (lower === key || lower.includes(key) || key.includes(lower)) {
      return item;
    }
  }

  // 2. Name match
  for (const item of Object.values(EXERCISE_CLASSES)) {
    if (item.name.toLowerCase() === lower || lower.includes(item.name.toLowerCase())) {
      return item;
    }
  }

  // 3. Keyword heuristic match
  if (lower.includes('push') || lower.includes('press') && lower.includes('floor')) {
    return EXERCISE_CLASSES['push-up'];
  }
  if (lower.includes('bench') || (lower.includes('chest') && lower.includes('press'))) {
    return EXERCISE_CLASSES['bench-press'];
  }
  if (lower.includes('squat')) {
    return EXERCISE_CLASSES['squat'];
  }
  if (lower.includes('lunge') || lower.includes('split squat')) {
    return EXERCISE_CLASSES['lunge'];
  }
  if (lower.includes('plank') || lower.includes('core hold')) {
    return EXERCISE_CLASSES['plank'];
  }
  if (lower.includes('deadlift') || lower.includes('rdl') || lower.includes('hinge')) {
    return EXERCISE_CLASSES['deadlift'];
  }
  if (lower.includes('shoulder') || lower.includes('overhead') || lower.includes('military')) {
    return EXERCISE_CLASSES['shoulder-press'];
  }
  if (lower.includes('pull') || lower.includes('chin') || lower.includes('lat')) {
    return EXERCISE_CLASSES['pull-up'];
  }
  if (lower.includes('row')) {
    return EXERCISE_CLASSES['dumbbell-row'];
  }
  if (lower.includes('bridge') || lower.includes('thrust') || lower.includes('glute')) {
    return EXERCISE_CLASSES['glute-bridge'];
  }

  // Fallback to push-up
  return EXERCISE_CLASSES['push-up'];
}
