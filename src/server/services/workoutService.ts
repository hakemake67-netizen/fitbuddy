import { GoogleGenAI, Type } from '@google/genai';
import { db, cache, UserProfile, WorkoutPlan, WorkoutDay, ExerciseItem } from '../db';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export class WorkoutService {
  /**
   * Generates or fetches a cached 7-day periodized training plan.
   */
  async generate7DayPlan(userProfile: UserProfile): Promise<WorkoutPlan> {
    const cacheKey = `plan:generated:${userProfile.id}:${userProfile.goal}:${userProfile.equipment}:${userProfile.skillLevel}`;
    const cached = cache.get<WorkoutPlan>(cacheKey);
    if (cached) {
      return cached;
    }

    // Attempt Gemini Generation
    let generatedPlanDays: WorkoutDay[] | null = null;
    let nutritionTip = '';

    if (apiKey) {
      try {
        const prompt = this.buildPrompt(userProfile);
        const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

        for (const model of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model,
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    nutritionTip: { type: Type.STRING },
                    days: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          dayNumber: { type: Type.INTEGER },
                          title: { type: Type.STRING },
                          focus: { type: Type.STRING },
                          warm_up: { type: Type.STRING },
                          cool_down: { type: Type.STRING },
                          recoveryGuidance: { type: Type.STRING },
                          main_workout: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                name: { type: Type.STRING },
                                sets: { type: Type.STRING },
                                reps_or_duration: { type: Type.STRING },
                                rest: { type: Type.STRING },
                                form_cue: { type: Type.STRING },
                                targetMuscles: {
                                  type: Type.ARRAY,
                                  items: { type: Type.STRING }
                                }
                              },
                              required: ['name', 'sets', 'reps_or_duration', 'rest', 'form_cue', 'targetMuscles']
                            }
                          }
                        },
                        required: ['dayNumber', 'title', 'focus', 'warm_up', 'cool_down', 'main_workout']
                      }
                    }
                  },
                  required: ['days', 'nutritionTip']
                }
              }
            });

            if (response && response.text) {
              const parsed = JSON.parse(response.text);
              if (parsed.days && parsed.days.length === 7) {
                generatedPlanDays = this.formatDaysWithExercises(parsed.days, userProfile.equipment);
                nutritionTip = parsed.nutritionTip;
                break;
              }
            }
          } catch (err: any) {
            console.warn(`Model ${model} failed for plan generation:`, err?.message || err);
          }
        }
      } catch (err) {
        console.error('Gemini generation error, falling back to procedural plan:', err);
      }
    }

    // Procedural Fallback if Gemini unavailable or failed
    if (!generatedPlanDays) {
      generatedPlanDays = this.generateProceduralPlan(userProfile);
      nutritionTip = this.generateEvidenceBasedNutritionTip(userProfile);
    }

    const newPlan: WorkoutPlan = {
      id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      userId: userProfile.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      goal: userProfile.goal,
      equipment: userProfile.equipment,
      skillLevel: userProfile.skillLevel,
      originalPlan: generatedPlanDays,
      updatedPlan: null,
      feedbackHistory: [],
      nutritionTip,
      status: 'active'
    };

    // Save to Database and Cache
    db.savePlan(newPlan);
    cache.set(cacheKey, newPlan, 600, [`user:${userProfile.id}`, `plan:${newPlan.id}`]);

    return newPlan;
  }

  private buildPrompt(user: UserProfile): string {
    return `
You are FitBuddy, an elite personal trainer and exercise physiologist.
Create a structured, evidence-based 7-day workout plan based on these real biometrics:

ATHLETE:
- Name: ${user.username}
- Age: ${user.age}
- Body Weight: ${user.weight} ${user.weightUnit}
- Primary Goal: ${user.goal}
- Experience / Skill Level: ${user.skillLevel}
- Equipment: ${user.equipment.toUpperCase()} (${user.equipment === 'bodyweight' ? 'Zero gear / Calisthenics only' : user.equipment === 'minimal' ? 'Dumbbells and bands only' : 'Full gym barbells & machines'})
- Session Duration: ${user.sessionDuration}
- Priority Focus: ${user.focusAreas.join(', ')}
${user.injuryNotes ? `- Injury Guardrails: ${user.injuryNotes}` : ''}

REQUIREMENTS:
1. Days 1 through 7 (7 full days periodized split).
2. For each day:
   - dayNumber (1 to 7)
   - title (e.g. "Day 1 - Upper Body Push")
   - focus (e.g. "Chest, Shoulders & Triceps")
   - warm_up (5-8 min dynamic mobility)
   - main_workout (4-5 exercises with name, sets, reps_or_duration, rest, form_cue, targetMuscles)
   - cool_down (5 min static stretching)
   - recoveryGuidance (hydration, sleep, tissue recovery)
3. Ensure Day 4 or Day 7 has Active Recovery or Full Rest.
4. Output valid JSON adhering to the provided schema.
`.trim();
  }

  private formatDaysWithExercises(rawDays: any[], equipment: 'gym' | 'bodyweight' | 'minimal'): WorkoutDay[] {
    return rawDays.map((d, index) => {
      const dayNum = d.dayNumber || (index + 1);
      const exercises: ExerciseItem[] = (d.main_workout || []).map((ex: any, exIdx: number) => {
        const id = ex.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const existing = db.findExerciseByName(ex.name);
        if (existing) {
          return {
            ...existing,
            sets: ex.sets || existing.sets,
            reps_or_duration: ex.reps_or_duration || existing.reps_or_duration,
            rest: ex.rest || existing.rest,
            form_cue: ex.form_cue || existing.form_cue
          };
        }
        return {
          id: id || `ex-${dayNum}-${exIdx}`,
          name: ex.name,
          category: equipment,
          targetMuscles: ex.targetMuscles || ['Target Muscle Group'],
          equipment: equipment === 'bodyweight' ? 'Bodyweight' : equipment === 'minimal' ? 'Dumbbells / Bands' : 'Gym Gear',
          sets: ex.sets || '3-4',
          reps_or_duration: ex.reps_or_duration || '10-12 reps',
          rest: ex.rest || '60 seconds',
          difficulty: 'Intermediate',
          form_cue: ex.form_cue || 'Maintain strict mechanical control and neutral spine.',
          setupInstructions: ['Set up in active athletic stance.', 'Brace core before initiating.'],
          movementPhases: [
            { phase: 'Descent / Setup', cue: 'Controlled eccentric cadence.' },
            { phase: 'Ascent / Drive', cue: 'Drive through ground with deliberate tension.' }
          ],
          breathing: 'Inhale on the eccentric phase, exhale on concentric effort.',
          tempo: '3-0-1-0',
          commonMistakes: ['Rushing the repetition', 'Loss of core rigidity'],
          safetyNotes: 'Work within pain-free active range of motion.',
          coachingCue: 'Focus on mind-muscle connection over heavy load.'
        };
      });

      return {
        dayNumber: dayNum,
        day: `Day ${dayNum}`,
        title: d.title || `Day ${dayNum} - ${d.focus || 'Training Session'}`,
        focus: d.focus || 'Target Hypertrophy & Conditioning',
        warm_up: d.warm_up || '5-8 minutes dynamic arm circles, hip openers, and movement-specific activation',
        main_workout: exercises,
        cool_down: d.cool_down || '5 minutes static muscle stretch, deep parasympathetic breathing',
        recoveryGuidance: d.recoveryGuidance || 'Prioritize 7.5 to 8.5 hours of sleep and adequate hydration.'
      };
    });
  }

  private generateProceduralPlan(user: UserProfile): WorkoutDay[] {
    const eq = user.equipment;
    const isGain = user.goal.toLowerCase().includes('gain') || user.goal.toLowerCase().includes('muscle') || user.goal.toLowerCase().includes('strength');
    const skill = user.skillLevel;
    const defaultRest = skill === 'Beginner' ? '75-90 seconds' : skill === 'Advanced' ? '45-60 seconds' : '60 seconds';

    if (eq === 'bodyweight') {
      return [
        {
          dayNumber: 1,
          day: 'Day 1',
          title: 'Upper Body Push (Calisthenics)',
          focus: 'Chest, Shoulders & Triceps (Zero Equipment)',
          warm_up: '8 min dynamic arm circles, wrist mobility, wall push-up walkouts',
          main_workout: [
            db.getExercise('push-up')!,
            db.getExercise('elevated-pike-push-up')!,
            db.getExercise('plank')!
          ],
          cool_down: '5 min doorway pectoral stretch, overhead tricep stretch',
          recoveryGuidance: 'Rest 48 hours before next upper pushing workout.'
        },
        {
          dayNumber: 2,
          day: 'Day 2',
          title: 'Upper Body Pull & Posterior Chain',
          focus: 'Back, Latissimus Dorsi, Biceps & Core',
          warm_up: '7 min cat-cow stretches, bird-dogs, thoracic spine rotations',
          main_workout: [
            db.getExercise('pull-ups')!,
            db.getExercise('plank')!
          ],
          cool_down: '6 min child pose, cobra stretch, hanging decompression',
          recoveryGuidance: 'Support muscle recovery with high protein intake.'
        },
        {
          dayNumber: 3,
          day: 'Day 3',
          title: 'Lower Body Strength Foundation',
          focus: 'Quadriceps, Glutes, Hamstrings & Calves',
          warm_up: '8 min leg swings, bodyweight air squats, ankle mobility',
          main_workout: [
            db.getExercise('bodyweight-squat')!,
            db.getExercise('lunge')!
          ],
          cool_down: '7 min standing quad stretch, seated hamstring fold',
          recoveryGuidance: 'Elevate lower limbs and prioritize post-workout hydration.'
        },
        {
          dayNumber: 4,
          day: 'Day 4',
          title: 'Active Recovery & Mobility Flow',
          focus: 'Joint Decompression, Hip Mobility & Core Flow',
          warm_up: '5 min light brisk walking',
          main_workout: [
            {
              id: 'mobility-flow',
              name: "World's Greatest Stretch Flow",
              category: 'bodyweight',
              targetMuscles: ['Thoracic Spine', 'Hip Flexors'],
              equipment: 'Bodyweight',
              sets: '2',
              reps_or_duration: '8 reps/side',
              rest: '30 seconds',
              difficulty: 'Beginner',
              form_cue: 'Rotate chest towards ceiling with deliberate reach.',
              setupInstructions: ['Deep lunge position'],
              movementPhases: [{ phase: 'Reach', cue: 'Follow hand with eyes' }],
              breathing: 'Exhale on rotation',
              tempo: 'Hold 3s',
              commonMistakes: ['Rushing'],
              safetyNotes: 'Pain-free range only',
              coachingCue: 'Breathe into tight joints'
            },
            db.getExercise('plank')!
          ],
          cool_down: '5 min diaphragmatic box breathing',
          recoveryGuidance: 'Active recovery clears metabolic waste without fatigue.'
        },
        {
          dayNumber: 5,
          day: 'Day 5',
          title: 'Full-Body Functional Strength',
          focus: 'Compound Athletic Movement & High-Density Core',
          warm_up: '8 min jumping jacks, inchworms, air squats',
          main_workout: [
            db.getExercise('push-up')!,
            db.getExercise('bodyweight-squat')!,
            db.getExercise('lunge')!
          ],
          cool_down: '6 min downward dog to cobra flow',
          recoveryGuidance: 'Replenish glycogen stores with balanced carbohydrates.'
        },
        {
          dayNumber: 6,
          day: 'Day 6',
          title: 'Aerobic Threshold & Conditioning',
          focus: 'Cardiovascular Stamina & Core Density',
          warm_up: '6 min light jog or movement prep',
          main_workout: [
            {
              id: 'steady-intervals',
              name: 'Aerobic Pacing Intervals',
              category: 'bodyweight',
              targetMuscles: ['Cardiovascular System'],
              equipment: 'Bodyweight',
              sets: '1',
              reps_or_duration: '20-25 minutes',
              rest: 'Continuous',
              difficulty: 'Beginner',
              form_cue: 'Maintain conversational nasal breathing.',
              setupInstructions: ['Outdoor or treadmill pacing'],
              movementPhases: [{ phase: 'Steady', cue: 'Smooth rhythm' }],
              breathing: 'Rhythmic nasal breath',
              tempo: 'Continuous',
              commonMistakes: ['Spiking heart rate too high'],
              safetyNotes: 'Stay hydrated',
              coachingCue: 'Consistency over speed'
            },
            db.getExercise('plank')!
          ],
          cool_down: '7 min static stretching and mobility',
          recoveryGuidance: 'Drink 500ml water with a pinch of electrolytes.'
        },
        {
          dayNumber: 7,
          day: 'Day 7',
          title: 'Deep Recovery & Systemic Reset',
          focus: 'Central Nervous System Decompression & Weekly Reset',
          warm_up: 'Gentle 5-minute morning mobility',
          main_workout: [
            {
              id: 'nature-walk',
              name: 'Restorative Low-Intensity Walk',
              category: 'bodyweight',
              targetMuscles: ['Full Body Recovery'],
              equipment: 'None',
              sets: '1',
              reps_or_duration: '30-40 minutes',
              rest: 'Continuous',
              difficulty: 'Beginner',
              form_cue: 'Relax shoulders and breathe deeply.',
              setupInstructions: ['Comfortable shoes'],
              movementPhases: [{ phase: 'Walk', cue: 'Gentle pace' }],
              breathing: 'Deep belly breathing',
              tempo: 'Leisurely',
              commonMistakes: ['Treating rest as workout'],
              safetyNotes: 'Listen to body',
              coachingCue: 'Adaptation occurs in rest'
            }
          ],
          cool_down: 'Mental preparation and hydration check for week ahead',
          recoveryGuidance: 'Aim for 8 hours of uninterrupted sleep.'
        }
      ];
    }

    // Default Gym / Minimal Plan
    return [
      {
        dayNumber: 1,
        day: 'Day 1',
        title: 'Upper Body Push (Hypertrophy)',
        focus: 'Chest, Shoulders & Triceps',
        warm_up: '8 min dynamic shoulder dislocates, push-up walkouts, band pull-aparts',
        main_workout: [
          eq === 'gym' ? db.getExercise('bench-press')! : db.getExercise('dumbbell-floor-press')!,
          db.getExercise('push-up')!,
          db.getExercise('plank')!
        ],
        cool_down: '5 min chest doorway stretch, overhead tricep stretch',
        recoveryGuidance: 'Rest 48 hours before next upper pushing session.'
      },
      {
        dayNumber: 2,
        day: 'Day 2',
        title: 'Upper Body Pull & Posterior Chain',
        focus: 'Back, Latissimus Dorsi, Biceps & Rear Delts',
        warm_up: '7 min cat-cow, bird-dogs, band dislocates',
        main_workout: [
          db.getExercise('pull-ups')!,
          db.getExercise('romanian-deadlift')!
        ],
        cool_down: '6 min child pose, cobra stretch, hanging decompression',
        recoveryGuidance: 'Maintain consistent protein distribution across meals.'
      },
      {
        dayNumber: 3,
        day: 'Day 3',
        title: 'Lower Body Foundation & Quadriceps',
        focus: 'Quadriceps, Glutes & Calves',
        warm_up: '8 min leg swings, bodyweight air squats, ankle mobility',
        main_workout: [
          eq === 'gym' ? db.getExercise('barbell-squat')! : db.getExercise('bodyweight-squat')!,
          db.getExercise('lunge')!
        ],
        cool_down: '7 min standing quad stretch, hamstring fold, pigeon stretch',
        recoveryGuidance: 'Hydrate well and stretch hip flexors post-workout.'
      },
      {
        dayNumber: 4,
        day: 'Day 4',
        title: 'Active Recovery & Joint Mobility',
        focus: 'Thoracic Mobility & Core Stability Flow',
        warm_up: '5 min light brisk walk or easy cycle',
        main_workout: [
          {
            id: 'world-stretch',
            name: "World's Greatest Stretch Flow",
            category: 'bodyweight',
            targetMuscles: ['Thoracic Spine', 'Hips'],
            equipment: 'Bodyweight',
            sets: '2',
            reps_or_duration: '8 reps/side',
            rest: '30 seconds',
            difficulty: 'Beginner',
            form_cue: 'Open chest toward ceiling with full breath.',
            setupInstructions: ['Lunge position'],
            movementPhases: [{ phase: 'Rotate', cue: 'Eyes follow hand' }],
            breathing: 'Exhale on twist',
            tempo: 'Controlled hold',
            commonMistakes: ['Rushing'],
            safetyNotes: 'Gentle active range only',
            coachingCue: 'Lengthen the spine'
          },
          db.getExercise('plank')!
        ],
        cool_down: '5 min box breathing (4s in, 4s hold, 4s out, 4s hold)',
        recoveryGuidance: 'Active recovery promotes circulation without fatigue.'
      },
      {
        dayNumber: 5,
        day: 'Day 5',
        title: 'Full-Body Compound Strength',
        focus: 'Multi-Joint Functional Strength & Posture',
        warm_up: '8 min jumping jacks, inchworms, air squats',
        main_workout: [
          eq === 'gym' ? db.getExercise('bench-press')! : db.getExercise('dumbbell-floor-press')!,
          db.getExercise('bodyweight-squat')!,
          db.getExercise('romanian-deadlift')!
        ],
        cool_down: '6 min downward dog to cobra flow',
        recoveryGuidance: 'Refuel with complex carbohydrates and quality protein.'
      },
      {
        dayNumber: 6,
        day: 'Day 6',
        title: 'Cardiovascular Intervals & Core Power',
        focus: 'Aerobic Threshold & Midsection Stability',
        warm_up: '6 min light rower or cycle',
        main_workout: [
          {
            id: 'interval-cardio',
            name: 'Aerobic Conditioning Flow',
            category: 'bodyweight',
            targetMuscles: ['Cardiovascular System'],
            equipment: 'Cardio Gear / Bodyweight',
            sets: '1',
            reps_or_duration: '20-25 minutes',
            rest: 'Continuous',
            difficulty: 'Beginner',
            form_cue: 'Keep pacing steady at moderate intensity.',
            setupInstructions: ['Select rower, bike, or brisk incline walking'],
            movementPhases: [{ phase: 'Steady', cue: 'Consistent cadence' }],
            breathing: 'Rhythmic nasal inhalation',
            tempo: 'Zone 2 pace',
            commonMistakes: ['Starting too fast'],
            safetyNotes: 'Hydrate every 10 minutes',
            coachingCue: 'Smooth and sustainable effort'
          },
          db.getExercise('plank')!
        ],
        cool_down: '7 min full-body static stretches',
        recoveryGuidance: 'Rehydrate with water and essential minerals.'
      },
      {
        dayNumber: 7,
        day: 'Day 7',
        title: 'Complete Rest & Weekly Reset',
        focus: 'Tissue Repair, Sleep Optimization & Mental Reset',
        warm_up: 'Gentle 5-minute morning mobility stretch',
        main_workout: [
          {
            id: 'walk-reset',
            name: 'Gentle Outdoor Walk',
            category: 'bodyweight',
            targetMuscles: ['Full Body Recovery'],
            equipment: 'None',
            sets: '1',
            reps_or_duration: '30-40 minutes',
            rest: 'Continuous',
            difficulty: 'Beginner',
            form_cue: 'Relax shoulders and let the spine decompress.',
            setupInstructions: ['Comfortable walking shoes'],
            movementPhases: [{ phase: 'Walk', cue: 'Easy leisurely pace' }],
            breathing: 'Slow diaphragmatic breathing',
            tempo: 'Easy',
            commonMistakes: ['Turning rest into heavy exertion'],
            safetyNotes: 'Listen to your body',
            coachingCue: 'Growth and recovery happen here'
          }
        ],
        cool_down: 'Hydration reset and planning for upcoming week',
        recoveryGuidance: 'Prioritize 8 hours of quality sleep.'
      }
    ];
  }

  private generateEvidenceBasedNutritionTip(user: UserProfile): string {
    const isGain = user.goal.toLowerCase().includes('gain') || user.goal.toLowerCase().includes('muscle') || user.goal.toLowerCase().includes('strength');
    const proteinFactor = isGain ? 2.0 : 1.8;
    const proteinGrams = Math.round(user.weight * proteinFactor);
    const waterLiters = (user.weight * 0.045).toFixed(1);

    return `General nutrition guidance: Target approximately ${proteinGrams}g of daily protein (${proteinFactor}g per kg body weight) evenly distributed across 3-4 meals to support muscle recovery and lean mass retention. Maintain hydration around ${waterLiters}L of water daily. Consult a registered dietitian or physician for specialized nutrition advice.`;
  }
}

export const workoutService = new WorkoutService();
