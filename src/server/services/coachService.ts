import { GoogleGenAI } from '@google/genai';
import { db, CoachSession, CoachMessage, UserProfile, WorkoutPlan } from '../db';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export class CoachService {
  /**
   * Responds to a user coach prompt while maintaining persistent multi-turn session context.
   */
  async processCoachMessage(
    userId: string,
    message: string,
    currentDay: number,
    currentExerciseName: string,
    currentSet?: number
  ): Promise<{ reply: string; session: CoachSession }> {
    const user = db.getUser(userId);
    const activePlan = db.getUserActivePlan(userId);
    const session = db.getOrCreateCoachSession(userId, currentDay, currentExerciseName);
    const completions = db.getUserCompletions(userId);

    // Save user message to session history
    const userMsg: CoachMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    db.appendCoachMessage(userId, userMsg);

    const systemPrompt = this.buildCoachSystemPrompt(user, activePlan, currentDay, currentExerciseName, completions, currentSet);

    let replyText = '';

    if (apiKey) {
      try {
        const contents = session.history.slice(-8).map(m => ({
          role: m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
        for (const model of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model,
              contents,
              config: {
                systemInstruction: systemPrompt,
                temperature: 0.7,
              }
            });

            if (response && response.text) {
              replyText = response.text.trim();
              break;
            }
          } catch (err: any) {
            console.warn(`Model ${model} failed in coachService:`, err?.message || err);
          }
        }
      } catch (err) {
        console.error('Error generating coach response from Gemini:', err);
      }
    }

    if (!replyText) {
      replyText = this.generateFallbackCoachResponse(message, user, currentDay, currentExerciseName);
    }

    // Clean formatting for spoken voice (strip markdown, asterisks, emojis)
    const cleanedReply = replyText.replace(/[*_#`~]/g, '').trim();

    const modelMsg: CoachMessage = {
      role: 'model',
      content: cleanedReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedSession = db.appendCoachMessage(userId, modelMsg);

    return {
      reply: cleanedReply,
      session: updatedSession
    };
  }

  private buildCoachSystemPrompt(
    user: UserProfile | null,
    plan: WorkoutPlan | null,
    currentDay: number,
    currentExercise: string,
    completions: any[],
    currentSet?: number
  ): string {
    const athleteName = user?.username || 'Athlete';
    const goal = user?.goal || 'General Fitness';
    const equipment = user?.equipment || 'gym';
    const skill = user?.skillLevel || 'Intermediate';
    const injuries = user?.injuryNotes || 'None reported';
    const completedCount = completions.length;

    return `
You are the dedicated FitBuddy Live Coach, an expert in biomechanics and athletic performance.
You are speaking directly with ${athleteName}.

CURRENT ATHLETE STATE:
- Goal: ${goal}
- Skill Level: ${skill}
- Equipment: ${equipment.toUpperCase()}
- Injury Notes: ${injuries}
- Current Training Day: Day ${currentDay} of 7
- Current Exercise: ${currentExercise}
${currentSet ? `- Current Set: Set ${currentSet}` : ''}
- Completed Exercises Logged: ${completedCount}

COACHING RULES:
1. Speak in a natural, authoritative, supportive voice suitable for real-time speech synthesis.
2. DO NOT use emojis.
3. DO NOT use technical AI terminology or mention model names.
4. DO NOT use markdown symbols like asterisks, hashtags, or bullet asterisks since this will be read aloud.
5. Reference the athlete's current exercise (${currentExercise}) and Day ${currentDay} context directly.
6. Provide actionable biomechanical cues, form regressions, or tempo advice.
7. Keep responses concise (2 to 4 sentences).
`.trim();
  }

  private generateFallbackCoachResponse(
    message: string,
    user: UserProfile | null,
    currentDay: number,
    currentExercise: string
  ): string {
    const lower = message.toLowerCase();
    const skill = user?.skillLevel || 'Intermediate';

    if (lower.includes('difficult') || lower.includes('hard') || lower.includes('cannot')) {
      return `You are currently performing ${currentExercise} on Day ${currentDay}. Since your current plan is set to ${skill} intensity, reduce the load or incline height only if you can maintain strict spinal alignment. Otherwise, perform a controlled eccentric variation with a two second pause.`;
    }

    if (lower.includes('pain') || lower.includes('hurt') || lower.includes('sore')) {
      return `Stop ${currentExercise} immediately if you feel sharp or localized joint pain. Verify that your core is actively braced and your joints remain stacked. Switch to a pain-free bodyweight regression or take extra recovery today.`;
    }

    if (lower.includes('rest') || lower.includes('timer') || lower.includes('break')) {
      return `For your current session on Day ${currentDay}, maintain a strict rest period of 60 to 75 seconds between working sets to allow ATP replenishment while sustaining metabolic tension.`;
    }

    return `Keep focused on ${currentExercise}. Maintain a controlled three-second lowering tempo, brace your abdominal wall, and complete your prescribed repetitions with deliberate intent.`;
  }
}

export const coachService = new CoachService();
