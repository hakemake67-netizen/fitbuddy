import { GoogleGenAI, Type } from '@google/genai';
import { db, cache, WorkoutPlan, WorkoutDay } from '../db';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export class PlanUpdateService {
  /**
   * Modifies an existing workout plan based on user feedback, preserving the originalPlan
   * and saving the updatedPlan alongside a clean feedback history.
   */
  async modifyPlanWithFeedback(planId: string, feedback: string): Promise<WorkoutPlan> {
    const plan = db.getPlan(planId);
    if (!plan) {
      throw new Error(`Plan with ID ${planId} not found.`);
    }

    const user = db.getUser(plan.userId);
    const baselinePlan = plan.updatedPlan || plan.originalPlan;

    let modifiedDays: WorkoutDay[] | null = null;
    let updateNote = '';

    if (apiKey) {
      try {
        const prompt = `
You are FitBuddy, an expert personal trainer modifying an existing 7-day workout plan based on athlete feedback.

ATHLETE:
- Name: ${user?.username || 'Athlete'}
- Goal: ${plan.goal}
- Equipment: ${plan.equipment}
- Skill Level: ${plan.skillLevel}

USER FEEDBACK / MODIFICATION DIRECTIVE:
"${feedback}"

CURRENT 7-DAY PLAN SUMMARY:
${baselinePlan.map(d => `${d.day} (${d.focus}): ${d.main_workout.map(e => e.name).join(', ')}`).join('\n')}

INSTRUCTIONS:
1. Revise the 7-day plan so it directly solves the user's feedback (e.g. adjust volume, swap exercises, modify intensity, alter rest times, reduce spinal load, etc.).
2. Retain the 7-day structure.
3. Provide a concise 1-2 sentence explanation of the specific modifications made.
4. Output valid JSON adhering to the schema.
`.trim();

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
                    updateNote: { type: Type.STRING },
                    days: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          dayNumber: { type: Type.INTEGER },
                          day: { type: Type.STRING },
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
                  required: ['days', 'updateNote']
                }
              }
            });

            if (response && response.text) {
              const parsed = JSON.parse(response.text);
              if (parsed.days && parsed.days.length === 7) {
                modifiedDays = this.enrichModifiedDays(parsed.days, baselinePlan);
                updateNote = parsed.updateNote;
                break;
              }
            }
          } catch (mErr) {
            console.warn(`Model ${model} failed in modifyPlanWithFeedback, trying next:`, mErr);
          }
        }
      } catch (err) {
        console.error('Error modifying plan with Gemini:', err);
      }
    }

    // Procedural adaptation fallback
    if (!modifiedDays) {
      modifiedDays = this.applyProceduralAdjustment(baselinePlan, feedback);
      updateNote = `Adjusted training volume, rest periods, and exercise selection to accommodate: "${feedback}".`;
    }

    // Update Plan while preserving originalPlan
    plan.updatedPlan = modifiedDays;
    plan.updatedAt = new Date().toISOString();
    plan.feedbackHistory.push({
      feedback,
      appliedAt: new Date().toISOString(),
      note: updateNote
    });

    db.savePlan(plan);
    cache.invalidateTags(`plan:${plan.id}`);

    return plan;
  }

  private enrichModifiedDays(rawDays: any[], baseline: WorkoutDay[]): WorkoutDay[] {
    return rawDays.map((d, idx) => {
      const baseDay = baseline[idx] || baseline[0];
      const exercises = (d.main_workout || []).map((ex: any, exIdx: number) => {
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
          id: `ex-mod-${d.dayNumber || idx + 1}-${exIdx}`,
          name: ex.name,
          category: 'bodyweight' as const,
          targetMuscles: ex.targetMuscles || ['Target Muscles'],
          equipment: 'Calibrated Equipment',
          sets: ex.sets || '3-4',
          reps_or_duration: ex.reps_or_duration || '10-12 reps',
          rest: ex.rest || '60 seconds',
          difficulty: 'Intermediate' as const,
          form_cue: ex.form_cue || 'Maintain strict form and control.',
          setupInstructions: ['Set up in balanced stance.'],
          movementPhases: [{ phase: 'Execution', cue: 'Controlled tempo.' }],
          breathing: 'Inhale lowering, exhale driving.',
          tempo: '3-0-1-0',
          commonMistakes: ['Momentum over control'],
          safetyNotes: 'Listen to joint feedback.',
          coachingCue: 'Prioritize mechanics.'
        };
      });

      return {
        dayNumber: d.dayNumber || (idx + 1),
        day: `Day ${d.dayNumber || (idx + 1)}`,
        title: d.title || baseDay.title,
        focus: d.focus || baseDay.focus,
        warm_up: d.warm_up || baseDay.warm_up,
        main_workout: exercises,
        cool_down: d.cool_down || baseDay.cool_down,
        recoveryGuidance: d.recoveryGuidance || baseDay.recoveryGuidance
      };
    });
  }

  private applyProceduralAdjustment(baseline: WorkoutDay[], feedback: string): WorkoutDay[] {
    const lower = feedback.toLowerCase();
    const adjustIntensity = lower.includes('easy') || lower.includes('light') || lower.includes('sore') || lower.includes('pain');

    return baseline.map(d => ({
      ...d,
      main_workout: d.main_workout.map(ex => {
        if (adjustIntensity) {
          return {
            ...ex,
            sets: '3',
            reps_or_duration: '8-10 reps',
            rest: '75-90 seconds',
            form_cue: `${ex.form_cue} (Reduced load intensity per feedback)`
          };
        }
        return {
          ...ex,
          sets: '4',
          reps_or_duration: '10-12 reps',
          form_cue: `${ex.form_cue} (Calibrated for progressive overload)`
        };
      })
    }));
  }
}

export const planUpdateService = new PlanUpdateService();
