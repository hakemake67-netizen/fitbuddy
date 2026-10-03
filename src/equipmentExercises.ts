/**
 * Equipment-Specific Exercise Mapping & Routine Generator
 * Provides distinct exercises for users with Full Gym, Zero Equipment (Bodyweight), or Minimal Home Gear
 * with identical features (Timer, Voice Coach, 60 FPS Video Kinematics, Scalable XP).
 */

export type EquipmentType = 'gym' | 'bodyweight' | 'minimal';

export interface ExerciseItem {
  exercise_name: string;
  sets: string;
  reps_or_duration: string;
  rest: string;
  equipment_needed: string;
  equipment_category: EquipmentType;
  form_cue: string;
  target_muscle: string;
}

export interface DayWorkoutPlan {
  day: string;
  focus: string;
  warm_up: string;
  main_workout: ExerciseItem[];
  cool_down: string;
}

export interface EquipmentOption {
  id: EquipmentType;
  title: string;
  subtitle: string;
  badge: string;
  iconName: string;
  colorHex: string;
  accentClass: string;
  description: string;
  idealFor: string;
}

export const EQUIPMENT_OPTIONS: EquipmentOption[] = [
  {
    id: 'gym',
    title: 'Full Gym Equipment',
    subtitle: 'Barbells, Dumbbells, Benches & Machines',
    badge: '🏋️',
    iconName: 'Dumbbell',
    colorHex: '#38bdf8',
    accentClass: 'border-sky-500/40 bg-sky-500/10 text-sky-400',
    description: 'Heavy compound lifts with olympic barbells, cables, power racks, and adjustable dumbbells.',
    idealFor: 'Commercial gym members & fully equipped home gyms'
  },
  {
    id: 'bodyweight',
    title: 'Zero Equipment (Bodyweight)',
    subtitle: 'Pure Calisthenics & Gravity Leverage',
    badge: '🤸',
    iconName: 'Zap',
    colorHex: '#8ee6c1',
    accentClass: 'border-[#8ee6c1]/40 bg-[#8ee6c1]/10 text-[#8ee6c1]',
    description: '100% equipment-free workouts using biomechanical leverage, tempo tension, and floor movements.',
    idealFor: 'Home workouts, hotel travel, outdoor parks, or zero-gear training'
  },
  {
    id: 'minimal',
    title: 'Minimal Equipment (Home Gym)',
    subtitle: 'Dumbbells & Resistance Bands Only',
    badge: '⚡',
    iconName: 'Layers',
    colorHex: '#fbbf24',
    accentClass: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    description: 'Compact home workouts using a pair of dumbbells and loop/tube resistance bands.',
    idealFor: 'Apartment living, portable gear kits, and minimal setups'
  }
];

// Direct 1-to-1 alternative mapping between gym, bodyweight, and minimal equipment
export const EXERCISE_EQUIVALENTS: Record<string, { bodyweight: ExerciseItem; minimal: ExerciseItem; gym: ExerciseItem }> = {
  'bench_press': {
    gym: {
      exercise_name: 'Barbell Bench Press',
      sets: '4',
      reps_or_duration: '8-10 reps',
      rest: '75 seconds',
      equipment_needed: 'Olympic Barbell & Flat Bench',
      equipment_category: 'gym',
      form_cue: 'Pin shoulder blades into bench, lower bar to sternum at 45° elbow angle, drive through feet.',
      target_muscle: 'Pectoralis Major & Triceps'
    },
    bodyweight: {
      exercise_name: 'Deficit Bodyweight Push-Ups (3s Tempo)',
      sets: '4',
      reps_or_duration: '12-15 reps',
      rest: '60 seconds',
      equipment_needed: 'Zero Equipment (Floor / Books for Deficit)',
      equipment_category: 'bodyweight',
      form_cue: 'Lock core like a rigid plank, lower chest to floor with 3-second descent, explode up.',
      target_muscle: 'Pectoralis Major & Serratus'
    },
    minimal: {
      exercise_name: 'Dumbbell Floor Press with Bridge',
      sets: '4',
      reps_or_duration: '10-12 reps',
      rest: '60 seconds',
      equipment_needed: 'Pair of Dumbbells',
      equipment_category: 'minimal',
      form_cue: 'Press dumbbells from floor lockout, pause lightly on triceps touch, squeeze chest at peak.',
      target_muscle: 'Chest & Triceps'
    }
  },
  'shoulder_press': {
    gym: {
      exercise_name: 'Overhead Dumbbell / Barbell Press',
      sets: '3',
      reps_or_duration: '10 reps',
      rest: '60 seconds',
      equipment_needed: 'Dumbbells or Barbell',
      equipment_category: 'gym',
      form_cue: 'Brace core, press vertically without hyperextending lumbar spine, biceps finish at ears.',
      target_muscle: 'Anterior & Lateral Deltoids'
    },
    bodyweight: {
      exercise_name: 'Elevated Pike Push-Ups',
      sets: '3',
      reps_or_duration: '10-12 reps',
      rest: '60 seconds',
      equipment_needed: 'Zero Equipment (Floor or Chair for Feet)',
      equipment_category: 'bodyweight',
      form_cue: 'Hips high in inverted V-shape, lower top of head forward between hands, push through shoulders.',
      target_muscle: 'Deltoids & Upper Trapezius'
    },
    minimal: {
      exercise_name: 'Kneeling Banded / Dumbbell Overhead Press',
      sets: '3',
      reps_or_duration: '12 reps',
      rest: '60 seconds',
      equipment_needed: 'Resistance Band or Light Dumbbells',
      equipment_category: 'minimal',
      form_cue: 'Maintain tall kneeling posture, press overhead against continuous elastic band tension.',
      target_muscle: 'Shoulders & Core Stability'
    }
  },
  'squats': {
    gym: {
      exercise_name: 'Barbell Back Squats',
      sets: '4',
      reps_or_duration: '10 reps',
      rest: '90 seconds',
      equipment_needed: 'Power Rack & Olympic Barbell',
      equipment_category: 'gym',
      form_cue: 'Break at hips and knees, track knees over second toe, reach parallel depth with proud chest.',
      target_muscle: 'Quadriceps & Gluteus Maximus'
    },
    bodyweight: {
      exercise_name: '1.5-Rep Bodyweight Squats / Pistol Progressions',
      sets: '4',
      reps_or_duration: '15-18 reps',
      rest: '60 seconds',
      equipment_needed: 'Zero Equipment (Bodyweight)',
      equipment_category: 'bodyweight',
      form_cue: 'Descend to full depth, pulse halfway up, return to bottom, then drive fully up for 1 rep.',
      target_muscle: 'Quadriceps, Glutes & Adductors'
    },
    minimal: {
      exercise_name: 'Goblet Squat with Heavy Dumbbell',
      sets: '4',
      reps_or_duration: '12 reps',
      rest: '75 seconds',
      equipment_needed: 'Single Dumbbell or Heavy Band',
      equipment_category: 'minimal',
      form_cue: 'Hold dumbbell vertically against upper chest, keep elbows inside knees at bottom of squat.',
      target_muscle: 'Quads & Glutes'
    }
  },
  'deadlift': {
    gym: {
      exercise_name: 'Romanian Barbell Deadlifts',
      sets: '3',
      reps_or_duration: '10 reps',
      rest: '75 seconds',
      equipment_needed: 'Barbell & Weight Plates',
      equipment_category: 'gym',
      form_cue: 'Hinge hips backwards with soft knee bend, bar glides down shins, feel deep hamstring stretch.',
      target_muscle: 'Hamstrings, Glutes & Spinal Erectors'
    },
    bodyweight: {
      exercise_name: 'Single-Leg Bodyweight Romanian Deadlifts',
      sets: '3',
      reps_or_duration: '12 reps/leg',
      rest: '45 seconds',
      equipment_needed: 'Zero Equipment (Floor)',
      equipment_category: 'bodyweight',
      form_cue: 'Balance on one leg, hinge forward sending rear leg straight back like a lever, spine neutral.',
      target_muscle: 'Hamstrings, Glute Medius & Ankle Stabilizers'
    },
    minimal: {
      exercise_name: 'Banded Good Mornings / Dumbbell RDL',
      sets: '3',
      reps_or_duration: '12 reps',
      rest: '60 seconds',
      equipment_needed: 'Resistance Loop Band or Pair of Dumbbells',
      equipment_category: 'minimal',
      form_cue: 'Stand on band with loop around neck/traps, hinge back against band tension, snap hips to lock.',
      target_muscle: 'Posterior Chain'
    }
  },
  'pull_ups_lat': {
    gym: {
      exercise_name: 'Lat Pulldowns or Weighted Pull-Ups',
      sets: '4',
      reps_or_duration: '8-10 reps',
      rest: '90 seconds',
      equipment_needed: 'Cable Lat Pulldown Machine or Pull-Up Bar',
      equipment_category: 'gym',
      form_cue: 'Depress shoulder blades first, drive elbows toward rear pockets, squeeze lats hard at bottom.',
      target_muscle: 'Latissimus Dorsi & Biceps'
    },
    bodyweight: {
      exercise_name: 'Inverted Table Rows / Doorway Towel Pulls',
      sets: '4',
      reps_or_duration: '12-15 reps',
      rest: '60 seconds',
      equipment_needed: 'Zero Equipment (Sturdy Table or Towel around Door)',
      equipment_category: 'bodyweight',
      form_cue: 'Lie under table, grasp edge, pull chest to underside of table keeping body in straight plank.',
      target_muscle: 'Lats, Rhomboids & Biceps'
    },
    minimal: {
      exercise_name: 'Banded Kneeling Lat Pulldowns / Dumbbell Rows',
      sets: '4',
      reps_or_duration: '12-15 reps',
      rest: '60 seconds',
      equipment_needed: 'High Anchor Resistance Band or Dumbbells',
      equipment_category: 'minimal',
      form_cue: 'Anchor band high over door, pull elbows down along ribcage, pause for 1 second contraction.',
      target_muscle: 'Lats & Mid-Back'
    }
  },
  'triceps_extension': {
    gym: {
      exercise_name: 'Overhead Cable Triceps Extensions',
      sets: '3',
      reps_or_duration: '12-15 reps',
      rest: '45 seconds',
      equipment_needed: 'Cable Machine & Rope Attachment',
      equipment_category: 'gym',
      form_cue: 'Lock elbows close to temples, extend forearms forward, flare rope apart at peak lockout.',
      target_muscle: 'Triceps (Long Head)'
    },
    bodyweight: {
      exercise_name: 'Chair / Sofa Bodyweight Triceps Dips',
      sets: '3',
      reps_or_duration: '12-15 reps',
      rest: '45 seconds',
      equipment_needed: 'Zero Equipment (Chair or Sofa)',
      equipment_category: 'bodyweight',
      form_cue: 'Lower hips directly down next to chair, press through palms to full elbow lockout.',
      target_muscle: 'Triceps Brachii'
    },
    minimal: {
      exercise_name: 'Overhead Dumbbell Triceps Extension',
      sets: '3',
      reps_or_duration: '12 reps',
      rest: '45 seconds',
      equipment_needed: 'Single Dumbbell or Band',
      equipment_category: 'minimal',
      form_cue: 'Hold dumbbell vertically behind head with both palms under plate, extend up smoothly.',
      target_muscle: 'Triceps (Long Head)'
    }
  },
  'biceps_curl': {
    gym: {
      exercise_name: 'Incline Dumbbell Biceps Curls',
      sets: '3',
      reps_or_duration: '10-12 reps',
      rest: '60 seconds',
      equipment_needed: 'Adjustable Incline Bench & Dumbbells',
      equipment_category: 'gym',
      form_cue: 'Let arms hang vertically for deep long-head stretch, supinate wrists forcefully at contraction.',
      target_muscle: 'Biceps Brachii'
    },
    bodyweight: {
      exercise_name: 'Doorframe Towel Biceps Curls / Isometric Curl',
      sets: '3',
      reps_or_duration: '12-15 reps',
      rest: '45 seconds',
      equipment_needed: 'Zero Equipment (Doorframe or Towel under Foot)',
      equipment_category: 'bodyweight',
      form_cue: 'Loop towel under foot, pull upward into maximum isometric contraction for 5 seconds per rep.',
      target_muscle: 'Biceps & Forearms'
    },
    minimal: {
      exercise_name: 'Resistance Band Hammer Curls',
      sets: '3',
      reps_or_duration: '15 reps',
      rest: '45 seconds',
      equipment_needed: 'Resistance Loop or Tube Band',
      equipment_category: 'minimal',
      form_cue: 'Step on center of band, neutral palms facing each other, squeeze biceps against rising band tension.',
      target_muscle: 'Biceps & Brachialis'
    }
  },
  'lunges': {
    gym: {
      exercise_name: 'Walking Dumbbell / Barbell Lunges',
      sets: '3',
      reps_or_duration: '12 steps/leg',
      rest: '60 seconds',
      equipment_needed: 'Dumbbells or Olympic Barbell',
      equipment_category: 'gym',
      form_cue: 'Keep chest tall, drop back knee straight down, drive through front heel.',
      target_muscle: 'Quadriceps, Glutes & Hamstrings'
    },
    bodyweight: {
      exercise_name: 'Alternating Reverse Lunges with Bottom Pulse',
      sets: '3',
      reps_or_duration: '14 steps/leg',
      rest: '45 seconds',
      equipment_needed: 'Zero Equipment (Bodyweight)',
      equipment_category: 'bodyweight',
      form_cue: 'Step back, pulse 2 inches up and down at bottom to maximize time-under-tension, drive to standing.',
      target_muscle: 'Quadriceps & Gluteus Maximus'
    },
    minimal: {
      exercise_name: 'Dumbbell Goblet Reverse Lunges',
      sets: '3',
      reps_or_duration: '12 steps/leg',
      rest: '60 seconds',
      equipment_needed: 'Single Dumbbell or Kettlebell',
      equipment_category: 'minimal',
      form_cue: 'Hold dumbbell vertically at chest, step back with controlled tempo, front knee stays stable.',
      target_muscle: 'Quads & Glutes'
    }
  }
};

/**
 * Determines whether an exercise name belongs to bodyweight, minimal, or gym
 */
export function detectEquipmentCategory(name: string, equipment_needed?: string): EquipmentType {
  const text = (name + ' ' + (equipment_needed || '')).toLowerCase();
  if (
    text.includes('bodyweight') || 
    text.includes('calisthenic') || 
    text.includes('zero equipment') || 
    text.includes('floor') || 
    text.includes('push-up') || 
    text.includes('pushup') || 
    text.includes('air squat') || 
    text.includes('inverted table') || 
    text.includes('burpee') || 
    text.includes('bear crawl') || 
    text.includes('hollow body')
  ) {
    return 'bodyweight';
  }
  if (
    text.includes('band') || 
    text.includes('dumbbell') || 
    text.includes('goblet') || 
    text.includes('minimal') || 
    text.includes('home gear')
  ) {
    return 'minimal';
  }
  return 'gym';
}

/**
 * Finds the direct alternative exercise for a target equipment mode
 */
export function findAlternativeExercise(currentName: string, targetEquipment: EquipmentType): ExerciseItem | null {
  const lower = currentName.toLowerCase();
  
  for (const key of Object.keys(EXERCISE_EQUIVALENTS)) {
    const entry = EXERCISE_EQUIVALENTS[key];
    const isMatch = 
      entry.gym.exercise_name.toLowerCase().includes(lower) || 
      entry.bodyweight.exercise_name.toLowerCase().includes(lower) || 
      entry.minimal.exercise_name.toLowerCase().includes(lower) ||
      lower.includes(key.replace('_', ' ')) ||
      (key === 'bench_press' && (lower.includes('bench') || lower.includes('push-up') || lower.includes('press') && lower.includes('chest'))) ||
      (key === 'shoulder_press' && (lower.includes('overhead') || lower.includes('pike') || lower.includes('shoulder'))) ||
      (key === 'squats' && (lower.includes('squat'))) ||
      (key === 'deadlift' && (lower.includes('deadlift') || lower.includes('rdl') || lower.includes('good morning'))) ||
      (key === 'pull_ups_lat' && (lower.includes('pull') || lower.includes('row') || lower.includes('lat'))) ||
      (key === 'triceps_extension' && (lower.includes('triceps') || lower.includes('dip'))) ||
      (key === 'biceps_curl' && (lower.includes('curl') || lower.includes('biceps'))) ||
      (key === 'lunges' && (lower.includes('lunge') || lower.includes('split')));

    if (isMatch) {
      return entry[targetEquipment];
    }
  }

  return null;
}

/**
 * Generates an adaptive 7-day routine tailored strictly to the equipment mode:
 * 'gym' (barbell/machines), 'bodyweight' (calisthenics/zero gear), or 'minimal' (dumbbells/bands)
 */
export function getAdaptive7DayPlan(equipment: EquipmentType, goal = 'Muscle Gain'): DayWorkoutPlan[] {
  if (equipment === 'bodyweight') {
    return [
      {
        day: 'Day 1 – Bodyweight Upper Push',
        focus: 'Chest, Shoulders & Triceps (Zero Equipment Calisthenics)',
        warm_up: '8 min arm circles, wrist mobility drills, seal jacks, plank walkouts',
        main_workout: [
          {
            exercise_name: 'Deficit Bodyweight Push-Ups (3s Tempo)',
            sets: '4',
            reps_or_duration: '12-15 reps',
            rest: '60 seconds',
            equipment_needed: 'Zero Equipment (Floor / Books for Deficit)',
            equipment_category: 'bodyweight',
            form_cue: 'Lock core like a rigid plank, lower chest to floor with 3-second descent, explode up.',
            target_muscle: 'Pectoralis Major & Serratus'
          },
          {
            exercise_name: 'Elevated Pike Push-Ups',
            sets: '3',
            reps_or_duration: '10-12 reps',
            rest: '60 seconds',
            equipment_needed: 'Zero Equipment (Floor or Chair for Feet)',
            equipment_category: 'bodyweight',
            form_cue: 'Hips high in inverted V-shape, lower top of head forward between hands, push through shoulders.',
            target_muscle: 'Deltoids & Upper Trapezius'
          },
          {
            exercise_name: 'Chair / Sofa Bodyweight Triceps Dips',
            sets: '3',
            reps_or_duration: '12-15 reps',
            rest: '45 seconds',
            equipment_needed: 'Sturdy Chair, Sofa, or Low Ledge',
            equipment_category: 'bodyweight',
            form_cue: 'Grip edge of chair, lower hips close to frame, press up through palms to full elbow lockout.',
            target_muscle: 'Triceps Brachii'
          },
          {
            exercise_name: 'Diamond Push-Ups or Knee Diamond Holds',
            sets: '3',
            reps_or_duration: '10-12 reps',
            rest: '45 seconds',
            equipment_needed: 'Zero Equipment (Floor)',
            equipment_category: 'bodyweight',
            form_cue: 'Hands touching under chest in diamond shape, elbows tucked close to ribcage.',
            target_muscle: 'Inner Chest & Triceps'
          }
        ],
        cool_down: '5 min chest doorway stretch, overhead triceps stretch, deep nasal breathing'
      },
      {
        day: 'Day 2 – Bodyweight Upper Pull & Core',
        focus: 'Back, Scapular Retractors, Biceps & Hollow Body Tension',
        warm_up: '7 min cat-cow stretches, bird-dogs, shoulder shrugs, and wrist rotations',
        main_workout: [
          {
            exercise_name: 'Inverted Table Rows / Doorway Towel Pulls',
            sets: '4',
            reps_or_duration: '12-15 reps',
            rest: '60 seconds',
            equipment_needed: 'Zero Equipment (Sturdy Table or Towel around Door)',
            equipment_category: 'bodyweight',
            form_cue: 'Lie under table, grasp edge, pull chest to underside of table keeping body in straight plank.',
            target_muscle: 'Lats, Rhomboids & Biceps'
          },
          {
            exercise_name: 'Prone Cobra Lat & Rear Delt Squeezes',
            sets: '3',
            reps_or_duration: '15 reps (2s hold)',
            rest: '45 seconds',
            equipment_needed: 'Zero Equipment (Floor / Mat)',
            equipment_category: 'bodyweight',
            form_cue: 'Lie prone, elevate chest, rotate thumbs to ceiling and pinch shoulder blades together.',
            target_muscle: 'Rhomboids, Lower Traps & Rear Delts'
          },
          {
            exercise_name: 'Hollow Body Hold & Rock Progressions',
            sets: '3',
            reps_or_duration: '45 seconds hold',
            rest: '45 seconds',
            equipment_needed: 'Zero Equipment (Floor)',
            equipment_category: 'bodyweight',
            form_cue: 'Press lumbar spine flush into floor, arms overhead, legs hovered 6 inches off ground.',
            target_muscle: 'Transverse Abdominis & Deep Core'
          },
          {
            exercise_name: 'Bear Crawl Isometric Hover Hold',
            sets: '3',
            reps_or_duration: '40 seconds',
            rest: '45 seconds',
            equipment_needed: 'Zero Equipment (Floor)',
            equipment_category: 'bodyweight',
            form_cue: 'Hands under shoulders, knees under hips hovered 1 inch above floor, back flat as a table.',
            target_muscle: 'Core, Quads & Scapular Stabilizers'
          }
        ],
        cool_down: '6 min child pose, cobra stretch, gentle spinal rotation'
      },
      {
        day: 'Day 3 – Calisthenic Lower Body Strength',
        focus: 'Quadriceps, Glute Strength & Single-Leg Stability',
        warm_up: '8 min leg swings, bodyweight air squats, ankle mobility drills',
        main_workout: [
          {
            exercise_name: '1.5-Rep Bodyweight Squats / Tempo Air Squats',
            sets: '4',
            reps_or_duration: '15-18 reps',
            rest: '60 seconds',
            equipment_needed: 'Zero Equipment (Bodyweight)',
            equipment_category: 'bodyweight',
            form_cue: 'Descend to full depth, pulse halfway up, return to bottom, then drive fully up for 1 rep.',
            target_muscle: 'Quadriceps, Glutes & Adductors'
          },
          {
            exercise_name: 'Single-Leg Bodyweight Romanian Deadlifts',
            sets: '3',
            reps_or_duration: '12 reps/leg',
            rest: '45 seconds',
            equipment_needed: 'Zero Equipment (Floor)',
            equipment_category: 'bodyweight',
            form_cue: 'Balance on one leg, hinge forward sending rear leg straight back like a lever, spine neutral.',
            target_muscle: 'Hamstrings, Glute Medius & Ankle Stabilizers'
          },
          {
            exercise_name: 'Bulgarian Split Squats (Foot on Couch/Chair)',
            sets: '3',
            reps_or_duration: '12 reps/leg',
            rest: '60 seconds',
            equipment_needed: 'Zero Equipment (Chair / Bed Edge for Rear Foot)',
            equipment_category: 'bodyweight',
            form_cue: 'Rear foot elevated, lower hips straight down, drive through front heel.',
            target_muscle: 'Quadriceps & Glute Max'
          },
          {
            exercise_name: 'Single-Leg Elevated Glute Bridges',
            sets: '3',
            reps_or_duration: '15 reps/leg',
            rest: '45 seconds',
            equipment_needed: 'Zero Equipment (Floor or Low Step)',
            equipment_category: 'bodyweight',
            form_cue: 'One heel planted, drive hips to ceiling, hold 1 second glute contraction at peak.',
            target_muscle: 'Gluteus Maximus & Hamstrings'
          }
        ],
        cool_down: '7 min standing quad stretch, hamstring fold, seated pigeon stretch'
      },
      {
        day: 'Day 4 – Active Mobility & Decompression Flow',
        focus: 'Thoracic Mobility & Calisthenic Core Stability',
        warm_up: '5 min light brisk shadow-boxing or marching in place',
        main_workout: [
          {
            exercise_name: 'World’s Greatest Stretch Flow',
            sets: '2',
            reps_or_duration: '8 reps/side',
            rest: '30 seconds',
            equipment_needed: 'Zero Equipment (Floor)',
            equipment_category: 'bodyweight',
            form_cue: 'Deep lunge with elbow to instep, reach arm to ceiling opening thoracic spine.',
            target_muscle: 'Hip Flexors & Thoracic Spine'
          },
          {
            exercise_name: 'Dead Bugs with Intra-Abdominal Bracing',
            sets: '3',
            reps_or_duration: '12 reps/side',
            rest: '30 seconds',
            equipment_needed: 'Zero Equipment (Floor)',
            equipment_category: 'bodyweight',
            form_cue: 'Opposite arm and leg extend while lower back stays pinned to floor.',
            target_muscle: 'Core Anti-Extension'
          },
          {
            exercise_name: 'Side Plank Holds with Hip Dips',
            sets: '3',
            reps_or_duration: '30s/side',
            rest: '30 seconds',
            equipment_needed: 'Zero Equipment (Floor)',
            equipment_category: 'bodyweight',
            form_cue: 'Forearm grounded, hips lifted in a straight line from neck to heels.',
            target_muscle: 'Obliques & Quadratus Lumborum'
          },
          {
            exercise_name: 'Outdoor Brisk Walking or Light Jog',
            sets: '1',
            reps_or_duration: '25-30 minutes',
            rest: 'Continuous',
            equipment_needed: 'Zero Equipment (Outdoors / Indoors)',
            equipment_category: 'bodyweight',
            form_cue: 'Zone 2 steady aerobic pace, relaxed breathing.',
            target_muscle: 'Aerobic Heart Base'
          }
        ],
        cool_down: '5 min diaphragmatic box breathing (4s in, 4s hold, 4s out)'
      },
      {
        day: 'Day 5 – Full-Body Functional Calisthenics',
        focus: 'Compound Bodyweight Power & Athletic Conditioning',
        warm_up: '8 min jumping jacks, inchworms, and bodyweight air squats',
        main_workout: [
          {
            exercise_name: 'Explosive Jump Squats / Broad Jumps',
            sets: '4',
            reps_or_duration: '10-12 reps',
            rest: '60 seconds',
            equipment_needed: 'Zero Equipment (Floor)',
            equipment_category: 'bodyweight',
            form_cue: 'Sink to parallel, explode vertically into air, land softly absorbing through heels.',
            target_muscle: 'Explosive Legs & Glutes'
          },
          {
            exercise_name: 'Push-Up to Side Plank Rotations',
            sets: '3',
            reps_or_duration: '12 reps total',
            rest: '60 seconds',
            equipment_needed: 'Zero Equipment (Floor)',
            equipment_category: 'bodyweight',
            form_cue: 'Complete push-up, rotate into side plank with arm extended to ceiling.',
            target_muscle: 'Chest, Shoulders & Rotational Core'
          },
          {
            exercise_name: 'High-Tempo Mountain Climbers',
            sets: '3',
            reps_or_duration: '40s on / 20s off',
            rest: '45 seconds',
            equipment_needed: 'Zero Equipment (Floor)',
            equipment_category: 'bodyweight',
            form_cue: 'Drive knees toward chest in rhythmic cadence, hips low and shoulders over wrists.',
            target_muscle: 'Metabolic Conditioning & Hip Flexors'
          },
          {
            exercise_name: 'Burpees with Floor Chest Touch',
            sets: '3',
            reps_or_duration: '10-12 reps',
            rest: '60 seconds',
            equipment_needed: 'Zero Equipment (Floor)',
            equipment_category: 'bodyweight',
            form_cue: 'Drop chest to floor, snap feet under hips, jump with hands clapping overhead.',
            target_muscle: 'Full Body Power'
          }
        ],
        cool_down: '6 min downward dog to cobra flow, kneeling hip flexor stretch'
      },
      {
        day: 'Day 6 – Bodyweight Cardio & Core Density',
        focus: 'Aerobic Threshold & Isometric Core Endurance',
        warm_up: '6 min dynamic high knees, butt kicks, arm hugs',
        main_workout: [
          {
            exercise_name: 'Shadow Boxing or Fast Jumping Jacks',
            sets: '1',
            reps_or_duration: '20 minutes (1m fast / 1m easy)',
            rest: 'Active recovery',
            equipment_needed: 'Zero Equipment (Floor)',
            equipment_category: 'bodyweight',
            form_cue: 'Keep light on toes, rotate hips into punches, maintain rapid cadence.',
            target_muscle: 'Cardiovascular Stamina'
          },
          {
            exercise_name: 'Bicycle Crunches (Controlled Tempo)',
            sets: '3',
            reps_or_duration: '20 total reps',
            rest: '45 seconds',
            equipment_needed: 'Zero Equipment (Floor)',
            equipment_category: 'bodyweight',
            form_cue: 'Touch opposite elbow to knee, hold 1-second pause on each twist.',
            target_muscle: 'Obliques & Rectus Abdominis'
          },
          {
            exercise_name: 'Reverse Crunches to Candle Stick Lift',
            sets: '3',
            reps_or_duration: '12-15 reps',
            rest: '45 seconds',
            equipment_needed: 'Zero Equipment (Floor)',
            equipment_category: 'bodyweight',
            form_cue: 'Roll pelvis off floor, reach feet toward ceiling without swinging legs.',
            target_muscle: 'Lower Abdominals'
          },
          {
            exercise_name: 'Plank Shoulder Taps',
            sets: '3',
            reps_or_duration: '20 taps total',
            rest: '30 seconds',
            equipment_needed: 'Zero Equipment (Floor)',
            equipment_category: 'bodyweight',
            form_cue: 'Tap opposite shoulder without letting hips sway side to side.',
            target_muscle: 'Anti-Rotational Core'
          }
        ],
        cool_down: '7 min full-body static stretches and deep breathing'
      },
      {
        day: 'Day 7 – Calisthenic Recovery & Reset',
        focus: 'Joint Decompression, Fascia Release & System Rest',
        warm_up: 'Gentle 5-minute morning mobility stretch',
        main_workout: [
          {
            exercise_name: 'Gentle Outdoor Walk in Nature',
            sets: '1',
            reps_or_duration: '35-45 minutes light pace',
            rest: 'Continuous',
            equipment_needed: 'Zero Equipment (Outdoors)',
            equipment_category: 'bodyweight',
            form_cue: 'Brisk nasal-breathing walk, let shoulders drop and relax.',
            target_muscle: 'Systemic Recovery'
          },
          {
            exercise_name: 'Full Body Passive Floor Stretch Circuit',
            sets: '1',
            reps_or_duration: '15 minutes',
            rest: 'Continuous',
            equipment_needed: 'Zero Equipment (Floor / Mat)',
            equipment_category: 'bodyweight',
            form_cue: 'Hold each stretch (Pigeon, Child Pose, Hamstring Fold) for 60-90 seconds.',
            target_muscle: 'Fascial Relaxation'
          }
        ],
        cool_down: 'Hydration reset and mental preparation for the upcoming training cycle'
      }
    ];
  }

  if (equipment === 'minimal') {
    return [
      {
        day: 'Day 1 – Minimal Gear Upper Push',
        focus: 'Chest, Shoulders & Triceps (Dumbbells & Bands Only)',
        warm_up: '8 min band pull-aparts, arm circles, push-up walkouts',
        main_workout: [
          {
            exercise_name: 'Dumbbell Floor Press with Bridge',
            sets: '4',
            reps_or_duration: '10-12 reps',
            rest: '60 seconds',
            equipment_needed: 'Pair of Dumbbells',
            equipment_category: 'minimal',
            form_cue: 'Press dumbbells from floor lockout, pause lightly on triceps touch, squeeze chest at peak.',
            target_muscle: 'Chest & Triceps'
          },
          {
            exercise_name: 'Kneeling Banded / Dumbbell Overhead Press',
            sets: '3',
            reps_or_duration: '12 reps',
            rest: '60 seconds',
            equipment_needed: 'Resistance Band or Light Dumbbells',
            equipment_category: 'minimal',
            form_cue: 'Maintain tall kneeling posture, press overhead against continuous elastic band tension.',
            target_muscle: 'Shoulders & Core Stability'
          },
          {
            exercise_name: 'Standing Resistance Band Chest Flyes',
            sets: '3',
            reps_or_duration: '15 reps',
            rest: '45 seconds',
            equipment_needed: 'Door-Anchored Resistance Band',
            equipment_category: 'minimal',
            form_cue: 'Hug hands together in wide arc, feel continuous tension across inner chest.',
            target_muscle: 'Pectoralis Major'
          },
          {
            exercise_name: 'Overhead Banded / Dumbbell Triceps Extensions',
            sets: '3',
            reps_or_duration: '12-15 reps',
            rest: '45 seconds',
            equipment_needed: 'Single Dumbbell or Band',
            equipment_category: 'minimal',
            form_cue: 'Keep elbows pointing toward ceiling, extend forearm fully at top.',
            target_muscle: 'Triceps Long Head'
          }
        ],
        cool_down: '5 min chest doorway stretch, overhead triceps stretch, deep breathing'
      },
      {
        day: 'Day 2 – Minimal Gear Upper Pull & Back',
        focus: 'Back, Latissimus Dorsi, Biceps & Rear Delts (Dumbbells & Bands)',
        warm_up: '7 min cat-cow stretches, bird-dogs, and light band pull-aparts',
        main_workout: [
          {
            exercise_name: 'Bent-Over Dumbbell Rows (Neutral Grip)',
            sets: '4',
            reps_or_duration: '10-12 reps',
            rest: '60 seconds',
            equipment_needed: 'Pair of Dumbbells',
            equipment_category: 'minimal',
            form_cue: 'Torso hinged at 45 degrees, pull elbows to hips, squeeze shoulder blades.',
            target_muscle: 'Latissimus Dorsi & Rhomboids'
          },
          {
            exercise_name: 'Resistance Band High-Anchor Lat Pulldowns',
            sets: '3',
            reps_or_duration: '15 reps (1s pause)',
            rest: '45 seconds',
            equipment_needed: 'Resistance Band Anchored High',
            equipment_category: 'minimal',
            form_cue: 'Kneel down, pull handles to chest, focus on contracting lats.',
            target_muscle: 'Lats & Upper Back'
          },
          {
            exercise_name: 'Standing Dumbbell Hammer Biceps Curls',
            sets: '3',
            reps_or_duration: '12 reps',
            rest: '45 seconds',
            equipment_needed: 'Pair of Dumbbells',
            equipment_category: 'minimal',
            form_cue: 'Palms facing each other, curl up without swinging elbows forward.',
            target_muscle: 'Brachialis & Biceps'
          },
          {
            exercise_name: 'Band Pull-Aparts for Rear Delts & Posture',
            sets: '3',
            reps_or_duration: '20 reps',
            rest: '30 seconds',
            equipment_needed: 'Resistance Loop or Tube Band',
            equipment_category: 'minimal',
            form_cue: 'Arms straight, pull band horizontally across chest pinching scapulae.',
            target_muscle: 'Rear Delts & Posture'
          }
        ],
        cool_down: '6 min child pose, cobra stretch, hanging decompression'
      },
      {
        day: 'Day 3 – Minimal Gear Lower Body Strength',
        focus: 'Quads, Hamstrings & Posterior Chain (Dumbbells & Bands)',
        warm_up: '8 min leg swings, bodyweight air squats, ankle mobility drills',
        main_workout: [
          {
            exercise_name: 'Goblet Squat with Heavy Dumbbell',
            sets: '4',
            reps_or_duration: '12 reps',
            rest: '75 seconds',
            equipment_needed: 'Single Dumbbell or Heavy Band',
            equipment_category: 'minimal',
            form_cue: 'Hold dumbbell vertically against upper chest, keep elbows inside knees at bottom of squat.',
            target_muscle: 'Quads & Glutes'
          },
          {
            exercise_name: 'Banded Good Mornings / Dumbbell RDL',
            sets: '3',
            reps_or_duration: '12 reps',
            rest: '60 seconds',
            equipment_needed: 'Resistance Loop Band or Pair of Dumbbells',
            equipment_category: 'minimal',
            form_cue: 'Stand on band with loop around neck/traps, hinge back against band tension, snap hips to lock.',
            target_muscle: 'Posterior Chain'
          },
          {
            exercise_name: 'Walking Lunges with Dumbbells in Hands',
            sets: '3',
            reps_or_duration: '12 steps/leg',
            rest: '60 seconds',
            equipment_needed: 'Pair of Dumbbells',
            equipment_category: 'minimal',
            form_cue: 'Torso upright, step forward with control, push through front heel.',
            target_muscle: 'Quads, Glutes & Balance'
          },
          {
            exercise_name: 'Standing Dumbbell Calf Raises on Ledge',
            sets: '3',
            reps_or_duration: '15-20 reps',
            rest: '45 seconds',
            equipment_needed: 'Dumbbell & Low Step',
            equipment_category: 'minimal',
            form_cue: 'Full stretch at bottom, rise high onto balls of feet, hold 1 second.',
            target_muscle: 'Gastrocnemius & Soleus'
          }
        ],
        cool_down: '7 min standing quad stretch, hamstring fold, seated pigeon stretch'
      },
      {
        day: 'Day 4 – Active Recovery & Banded Mobility',
        focus: 'Thoracic Mobility & Core Stability Flow',
        warm_up: '5 min light brisk treadmill walk or easy stationary cycle',
        main_workout: [
          {
            exercise_name: 'Banded Shoulder Pass-Throughs & Dislocates',
            sets: '2',
            reps_or_duration: '12 reps',
            rest: '30 seconds',
            equipment_needed: 'Light Resistance Band',
            equipment_category: 'minimal',
            form_cue: 'Wide grip on band, rotate smoothly over head and behind back.',
            target_muscle: 'Shoulder Capsule & Mobility'
          },
          {
            exercise_name: 'World’s Greatest Stretch Flow',
            sets: '2',
            reps_or_duration: '8 reps/side',
            rest: '30 seconds',
            equipment_needed: 'Zero Equipment (Floor)',
            equipment_category: 'minimal',
            form_cue: 'Deep lunge with elbow to instep, reach arm to ceiling opening thoracic spine.',
            target_muscle: 'Hip Flexors & Thoracic Spine'
          },
          {
            exercise_name: 'Dead Bugs with Band Resistance',
            sets: '3',
            reps_or_duration: '12 reps',
            rest: '45 seconds',
            equipment_needed: 'Light Resistance Band',
            equipment_category: 'minimal',
            form_cue: 'Anchor band overhead, pull down while executing leg lowers.',
            target_muscle: 'Deep Core Bracing'
          },
          {
            exercise_name: 'Zone 2 Steady Walk or Easy Cycle',
            sets: '1',
            reps_or_duration: '25-30 minutes',
            rest: 'Continuous',
            equipment_needed: 'Sneakers',
            equipment_category: 'minimal',
            form_cue: 'Nasal breathing, low intensity aerobic base.',
            target_muscle: 'Cardiovascular Recovery'
          }
        ],
        cool_down: '5 min diaphragmatic box breathing (4s in, 4s hold, 4s out)'
      },
      {
        day: 'Day 5 – Full-Body Dumbbell Complex',
        focus: 'Functional Strength & Conditioning',
        warm_up: '8 min jumping jacks, inchworms, and bodyweight air squats',
        main_workout: [
          {
            exercise_name: 'Dumbbell Swings / Kettlebell Movement',
            sets: '4',
            reps_or_duration: '15 reps',
            rest: '60 seconds',
            equipment_needed: 'Single Dumbbell',
            equipment_category: 'minimal',
            form_cue: 'Snap hips forward, propel dumbbell with glute drive, not arm lifting.',
            target_muscle: 'Glutes, Hamstrings & Core'
          },
          {
            exercise_name: 'Dumbbell Thrusters (Squat to Overhead Press)',
            sets: '3',
            reps_or_duration: '10 reps',
            rest: '75 seconds',
            equipment_needed: 'Pair of Dumbbells',
            equipment_category: 'minimal',
            form_cue: 'Squat deeply, use momentum out of bottom to press weights directly overhead.',
            target_muscle: 'Quads, Shoulders & Cardio'
          },
          {
            exercise_name: 'Dumbbell Renegade Rows in Plank',
            sets: '3',
            reps_or_duration: '10 reps total',
            rest: '60 seconds',
            equipment_needed: 'Pair of Dumbbells',
            equipment_category: 'minimal',
            form_cue: 'Row dumbbell to hip while maintaining rigid push-up plank position.',
            target_muscle: 'Back & Anti-Rotation Core'
          },
          {
            exercise_name: 'Mountain Climbers on Dumbbell Handles',
            sets: '3',
            reps_or_duration: '40s on / 20s rest',
            rest: '45 seconds',
            equipment_needed: 'Pair of Hex Dumbbells',
            equipment_category: 'minimal',
            form_cue: 'Neutral wrists on dumbbell handles, drive knees in rapid tempo.',
            target_muscle: 'Core & Conditioning'
          }
        ],
        cool_down: '6 min downward dog to cobra flow, kneeling hip flexor stretch'
      },
      {
        day: 'Day 6 – Minimal Gear Cardio & Core',
        focus: 'Cardiovascular Conditioning & Target Core',
        warm_up: '6 min light jog or jumping rope, dynamic torso twists',
        main_workout: [
          {
            exercise_name: 'Jump Rope or Fast Bodyweight Cardio',
            sets: '1',
            reps_or_duration: '20 minutes (1m fast / 1m easy)',
            rest: 'Active recovery',
            equipment_needed: 'Jump Rope or Bodyweight',
            equipment_category: 'minimal',
            form_cue: 'Light on balls of feet, turn rope from wrists, keep rhythm.',
            target_muscle: 'Aerobic Power & Calves'
          },
          {
            exercise_name: 'Russian Twists with Single Dumbbell',
            sets: '3',
            reps_or_duration: '20 total twists',
            rest: '45 seconds',
            equipment_needed: 'Single Light Dumbbell',
            equipment_category: 'minimal',
            form_cue: 'Feet elevated, rotate shoulders side to side with dumbbell.',
            target_muscle: 'Obliques'
          },
          {
            exercise_name: 'Banded Side Plank Holds',
            sets: '3',
            reps_or_duration: '30s per side',
            rest: '30 seconds',
            equipment_needed: 'Mini Resistance Band around Knees',
            equipment_category: 'minimal',
            form_cue: 'Lift top knee against band tension in clamshell while holding side plank.',
            target_muscle: 'Glute Medius & Core'
          }
        ],
        cool_down: '7 min full-body static stretches and foam rolling'
      },
      {
        day: 'Day 7 – Rest & Recovery Reset',
        focus: 'Deep Recovery, Joint Decompression & Nutrition Reset',
        warm_up: 'Gentle 5-minute morning mobility stretch',
        main_workout: [
          {
            exercise_name: 'Gentle Outdoor Walk in Nature',
            sets: '1',
            reps_or_duration: '30-45 minutes light pace',
            rest: 'Continuous',
            equipment_needed: 'Zero Equipment',
            equipment_category: 'minimal',
            form_cue: 'Gentle restorative pace, focus on natural deep breathing.',
            target_muscle: 'Nervous System Recovery'
          },
          {
            exercise_name: 'Full Body Banded Assisted Stretches',
            sets: '1',
            reps_or_duration: '15 minutes',
            rest: 'Continuous',
            equipment_needed: 'Long Resistance Band',
            equipment_category: 'minimal',
            form_cue: 'Loop band around feet for deep hamstring and groin relaxation.',
            target_muscle: 'Flexibility'
          }
        ],
        cool_down: 'Hydration reset and preparation for next cycle'
      }
    ];
  }

  // Default: Full Gym Equipment
  return [
    {
      day: 'Day 1 – Upper Body Push (Gym Compound)',
      focus: 'Chest, Shoulders & Triceps (Barbells & Machines)',
      warm_up: '8 min dynamic arm circles, shoulder band pull-aparts, push-up walkouts',
      main_workout: [
        {
          exercise_name: 'Barbell Bench Press',
          sets: '4',
          reps_or_duration: '8-10 reps',
          rest: '75 seconds',
          equipment_needed: 'Olympic Barbell & Flat Bench',
          equipment_category: 'gym',
          form_cue: 'Pin shoulder blades into bench, lower bar to sternum at 45° elbow angle, drive through feet.',
          target_muscle: 'Pectoralis Major & Triceps'
        },
        {
          exercise_name: 'Overhead Dumbbell / Barbell Press',
          sets: '3',
          reps_or_duration: '10 reps',
          rest: '60 seconds',
          equipment_needed: 'Dumbbells or Barbell',
          equipment_category: 'gym',
          form_cue: 'Brace core, press vertically without hyperextending lumbar spine, biceps finish at ears.',
          target_muscle: 'Anterior & Lateral Deltoids'
        },
        {
          exercise_name: 'Incline Dumbbell Flyes',
          sets: '3',
          reps_or_duration: '12 reps',
          rest: '60 seconds',
          equipment_needed: 'Incline Bench & Dumbbells',
          equipment_category: 'gym',
          form_cue: 'Wide elbow arc, feel deep chest stretch, squeeze pectorals at top.',
          target_muscle: 'Upper Chest'
        },
        {
          exercise_name: 'Overhead Cable Triceps Extensions',
          sets: '3',
          reps_or_duration: '12-15 reps',
          rest: '45 seconds',
          equipment_needed: 'Cable Pulley Machine & Rope Attachment',
          equipment_category: 'gym',
          form_cue: 'Flared rope spread at lockout, elbows fixed in position.',
          target_muscle: 'Triceps Long Head'
        }
      ],
      cool_down: '5 min chest doorway stretch, overhead triceps stretch, deep nasal breathing'
    },
    {
      day: 'Day 2 – Upper Body Pull & Posterior Chain',
      focus: 'Back, Latissimus Dorsi, Biceps & Core Stabilizers',
      warm_up: '7 min cat-cow stretches, bird-dogs, and light band pull-aparts',
      main_workout: [
        {
          exercise_name: 'Lat Pulldowns or Weighted Pull-Ups',
          sets: '4',
          reps_or_duration: '8-10 reps',
          rest: '90 seconds',
          equipment_needed: 'Cable Lat Pulldown Machine or Pull-Up Bar',
          equipment_category: 'gym',
          form_cue: 'Depress shoulder blades first, drive elbows toward rear pockets, squeeze lats hard at bottom.',
          target_muscle: 'Latissimus Dorsi & Biceps'
        },
        {
          exercise_name: 'Bent-Over Barbell Rows',
          sets: '3',
          reps_or_duration: '10 reps',
          rest: '75 seconds',
          equipment_needed: 'Olympic Barbell & Plates',
          equipment_category: 'gym',
          form_cue: 'Hinged at 45°, pull bar into lower ribcage, keep spine rigid.',
          target_muscle: 'Rhomboids & Mid-Back'
        },
        {
          exercise_name: 'Incline Dumbbell Biceps Curls',
          sets: '3',
          reps_or_duration: '12 reps',
          rest: '60 seconds',
          equipment_needed: 'Incline Bench & Dumbbells',
          equipment_category: 'gym',
          form_cue: 'Let arms hang back for full stretch, supinate wrists at top.',
          target_muscle: 'Biceps Brachii'
        },
        {
          exercise_name: 'Plank Hold with Intra-Abdominal Bracing',
          sets: '3',
          reps_or_duration: '45-60 seconds',
          rest: '45 seconds',
          equipment_needed: 'Zero Equipment (Mat)',
          equipment_category: 'gym',
          form_cue: 'Squeeze glutes and abs, create full-body tension.',
          target_muscle: 'Core Stability'
        }
      ],
      cool_down: '6 min child pose, cobra stretch, hanging bar decompression'
    },
    {
      day: 'Day 3 – Lower Body Strength Foundation',
      focus: 'Quadriceps, Gluteus Maximus & Hamstring Hypertrophy',
      warm_up: '8 min leg swings, bodyweight air squats, ankle mobility drills',
      main_workout: [
        {
          exercise_name: 'Barbell Back Squats',
          sets: '4',
          reps_or_duration: '10 reps',
          rest: '90 seconds',
          equipment_needed: 'Power Rack & Olympic Barbell',
          equipment_category: 'gym',
          form_cue: 'Break at hips and knees, track knees over second toe, reach parallel depth with proud chest.',
          target_muscle: 'Quadriceps & Gluteus Maximus'
        },
        {
          exercise_name: 'Romanian Barbell Deadlifts',
          sets: '3',
          reps_or_duration: '10 reps',
          rest: '75 seconds',
          equipment_needed: 'Barbell & Weight Plates',
          equipment_category: 'gym',
          form_cue: 'Hinge hips backwards with soft knee bend, bar glides down shins, feel deep hamstring stretch.',
          target_muscle: 'Hamstrings, Glutes & Spinal Erectors'
        },
        {
          exercise_name: 'Walking Lunges with Dumbbells',
          sets: '3',
          reps_or_duration: '12 steps/leg',
          rest: '60 seconds',
          equipment_needed: 'Pair of Dumbbells',
          equipment_category: 'gym',
          form_cue: 'Torso upright, step forward with control, push through front heel.',
          target_muscle: 'Quads & Glutes'
        },
        {
          exercise_name: 'Standing Machine Calf Raises',
          sets: '3',
          reps_or_duration: '15-20 reps',
          rest: '45 seconds',
          equipment_needed: 'Calf Raise Machine / Step',
          equipment_category: 'gym',
          form_cue: 'Full stretch at bottom, drive up onto toes with 1s pause.',
          target_muscle: 'Calves'
        }
      ],
      cool_down: '7 min standing quad stretch, hamstring fold, seated pigeon stretch'
    },
    {
      day: 'Day 4 – Active Recovery & Joint Decompression',
      focus: 'Thoracic Mobility & Core Stability Flow',
      warm_up: '5 min light brisk treadmill walk or easy stationary cycle',
      main_workout: [
        {
          exercise_name: 'Thoracic Spine Foam Rolling & Rotations',
          sets: '2',
          reps_or_duration: '10 reps/side',
          rest: '30 seconds',
          equipment_needed: 'Foam Roller',
          equipment_category: 'gym',
          form_cue: 'Support head, roll mid-upper back, gently extend over roller.',
          target_muscle: 'Thoracic Spine'
        },
        {
          exercise_name: 'World’s Greatest Stretch Flow',
          sets: '2',
          reps_or_duration: '8 reps/side',
          rest: '30 seconds',
          equipment_needed: 'Zero Equipment (Floor)',
          equipment_category: 'gym',
          form_cue: 'Deep lunge with elbow to instep, reach arm to ceiling opening thoracic spine.',
          target_muscle: 'Hip Flexors & Thoracic Spine'
        },
        {
          exercise_name: 'Dead Bugs with Core Bracing',
          sets: '3',
          reps_or_duration: '12 reps',
          rest: '45 seconds',
          equipment_needed: 'Zero Equipment (Floor)',
          equipment_category: 'gym',
          form_cue: 'Press lumbar into ground, extend opposite limbs smoothly.',
          target_muscle: 'Deep Core'
        },
        {
          exercise_name: 'Zone 2 Steady Walk or Swim',
          sets: '1',
          reps_or_duration: '25-30 minutes',
          rest: 'Continuous',
          equipment_needed: 'Treadmill / Pool',
          equipment_category: 'gym',
          form_cue: 'Zone 2 conversational heart rate, pure aerobic recovery.',
          target_muscle: 'Heart & Lymphatic Recovery'
        }
      ],
      cool_down: '5 min diaphragmatic box breathing (4s in, 4s hold, 4s out)'
    },
    {
      day: 'Day 5 – Full-Body Functional Strength',
      focus: 'Compound Athletic Strength & Dynamic Conditioning',
      warm_up: '8 min jumping jacks, inchworms, and bodyweight air squats',
      main_workout: [
        {
          exercise_name: 'Kettlebell / Dumbbell Swings',
          sets: '4',
          reps_or_duration: '15 reps',
          rest: '60 seconds',
          equipment_needed: 'Kettlebell or Dumbbell',
          equipment_category: 'gym',
          form_cue: 'Snap hips forward, propel weight with glute drive, not arms.',
          target_muscle: 'Posterior Chain'
        },
        {
          exercise_name: 'Dumbbell Thrusters (Squat to Overhead Press)',
          sets: '3',
          reps_or_duration: '10 reps',
          rest: '75 seconds',
          equipment_needed: 'Pair of Dumbbells',
          equipment_category: 'gym',
          form_cue: 'Deep squat into explosive overhead pressing lockout.',
          target_muscle: 'Full Body'
        },
        {
          exercise_name: 'Renegade Rows with Controlled Pace',
          sets: '3',
          reps_or_duration: '10 reps total',
          rest: '60 seconds',
          equipment_needed: 'Pair of Hex Dumbbells',
          equipment_category: 'gym',
          form_cue: 'Keep hips square, row dumbbell smoothly to hip.',
          target_muscle: 'Back & Core'
        },
        {
          exercise_name: 'Mountain Climbers (Controlled Cadence)',
          sets: '3',
          reps_or_duration: '40s on / 20s rest',
          rest: '45 seconds',
          equipment_needed: 'Floor / Mat',
          equipment_category: 'gym',
          form_cue: 'Steady pace, drive knees forward without bouncing hips.',
          target_muscle: 'Metabolic Core'
        }
      ],
      cool_down: '6 min downward dog to cobra flow, kneeling hip flexor stretch'
    },
    {
      day: 'Day 6 – Cardiovascular Intervals & Core Power',
      focus: 'Aerobic Threshold & High-Density Core',
      warm_up: '6 min light jog or rowing machine, dynamic torso twists',
      main_workout: [
        {
          exercise_name: 'Interval Cardio (Rower, Bike, or Treadmill)',
          sets: '1',
          reps_or_duration: '20 minutes (1m fast / 1m easy)',
          rest: 'Active recovery',
          equipment_needed: 'Rower, Bike, or Treadmill',
          equipment_category: 'gym',
          form_cue: '1 minute high intensity followed by 1 minute active recovery.',
          target_muscle: 'Cardiovascular Engine'
        },
        {
          exercise_name: 'Hanging Knee Raises or Reverse Crunches',
          sets: '3',
          reps_or_duration: '12-15 reps',
          rest: '45 seconds',
          equipment_needed: 'Pull-Up Bar or Floor Mat',
          equipment_category: 'gym',
          form_cue: 'Curl knees up to chest, avoid excessive swinging.',
          target_muscle: 'Lower Abs'
        },
        {
          exercise_name: 'Russian Twists with Medicine Ball',
          sets: '3',
          reps_or_duration: '20 total twists',
          rest: '45 seconds',
          equipment_needed: 'Medicine Ball or Dumbbell',
          equipment_category: 'gym',
          form_cue: 'Rotate through upper torso, tap ball lightly beside hips.',
          target_muscle: 'Obliques'
        },
        {
          exercise_name: 'Side Plank Holds',
          sets: '3',
          reps_or_duration: '30s per side',
          rest: '30 seconds',
          equipment_needed: 'Floor Mat',
          equipment_category: 'gym',
          form_cue: 'Hips high, straight line from shoulders to ankles.',
          target_muscle: 'Lateral Core'
        }
      ],
      cool_down: '7 min full-body static stretches and foam rolling'
    },
    {
      day: 'Day 7 – Complete Rest & Weekly Physiological Reset',
      focus: 'Deep Recovery, Joint Decompression & Nutrition Reset',
      warm_up: 'Gentle 5-minute morning mobility stretch',
      main_workout: [
        {
          exercise_name: 'Gentle Outdoor Walk in Nature',
          sets: '1',
          reps_or_duration: '30-45 minutes light pace',
          rest: 'Continuous',
          equipment_needed: 'Zero Equipment (Outdoors)',
          equipment_category: 'gym',
          form_cue: 'Low heart rate, relaxed breathing.',
          target_muscle: 'Nervous System Recovery'
        },
        {
          exercise_name: 'Full Body Foam Rolling & Myofascial Release',
          sets: '1',
          reps_or_duration: '15 minutes',
          rest: 'Continuous',
          equipment_needed: 'Foam Roller',
          equipment_category: 'gym',
          form_cue: 'Roll quads, IT band, lats, and calves with deep breathing.',
          target_muscle: 'Fascia'
        }
      ],
      cool_down: 'Hydration reset and mental preparation for the upcoming training cycle'
    }
  ];
}
