import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db, cache, WorkoutPlan, UserProfile } from './src/server/db';
import { workoutService } from './src/server/services/workoutService';
import { planUpdateService } from './src/server/services/planUpdateService';
import { coachService } from './src/server/services/coachService';
import { avatarService } from './src/server/services/avatarService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// ============================================================================
// CORE API CONTRACT & CACHED ROUTES
// ============================================================================

// 1. Health & Cache Telemetry
app.get('/api/health', (req, res) => {
  const cacheStats = cache.getStats();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cache: cacheStats,
    usersCount: db.users.size,
    plansCount: db.plans.size,
    completionsCount: db.completions.length,
    exercisesCount: db.exercises.size
  });
});

// 2. User Profile Routes
app.get('/api/users/:id', (req, res) => {
  const cacheKey = `user:${req.params.id}`;
  let user = cache.get<UserProfile>(cacheKey);
  if (!user) {
    user = db.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    cache.set(cacheKey, user, 300, [`user:${req.params.id}`]);
  }
  res.json({ user });
});

app.post('/api/users', (req, res) => {
  try {
    const { id, username, age, weight, weightUnit, goal, intensity, skillLevel, equipment, sessionDuration, focusAreas, injuryNotes } = req.body;
    if (!id || !username) {
      return res.status(400).json({ error: 'User ID and username are required' });
    }
    const user = db.upsertUser({
      id,
      username,
      age: Number(age) || 26,
      weight: Number(weight) || 72,
      weightUnit: weightUnit || 'kg',
      goal: goal || 'Muscle Gain',
      intensity: intensity || 'Intermediate',
      skillLevel: skillLevel || 'Intermediate',
      equipment: equipment || 'gym',
      sessionDuration: sessionDuration || '45-60 min',
      focusAreas: Array.isArray(focusAreas) ? focusAreas : ['Full Body'],
      injuryNotes: injuryNotes || ''
    });
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save user profile' });
  }
});

// 3. Workout Plan Routes
app.post('/api/workouts/generate', async (req, res) => {
  try {
    const { userId, username, age, weight, weightUnit, goal, skillLevel, equipment, sessionDuration, focusAreas, injuryNotes } = req.body;
    
    // Upsert or retrieve user profile
    const profile = db.upsertUser({
      id: userId || 'FB-1001',
      username: username || 'Athlete',
      age: Number(age) || 26,
      weight: Number(weight) || 72,
      weightUnit: weightUnit || 'kg',
      goal: goal || 'Muscle Gain',
      intensity: skillLevel || 'Intermediate',
      skillLevel: skillLevel || 'Intermediate',
      equipment: equipment || 'gym',
      sessionDuration: sessionDuration || '45-60 min',
      focusAreas: Array.isArray(focusAreas) ? focusAreas : ['Full Body'],
      injuryNotes: injuryNotes || ''
    });

    const plan = await workoutService.generate7DayPlan(profile);
    res.json({ success: true, plan, user: profile });
  } catch (err: any) {
    console.error('Error generating workout plan:', err);
    res.status(500).json({ error: err.message || 'Plan generation failed' });
  }
});

app.get('/api/workouts/:id', (req, res) => {
  const cacheKey = `plan:${req.params.id}`;
  let plan = cache.get<WorkoutPlan>(cacheKey);
  if (!plan) {
    plan = db.getPlan(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }
    cache.set(cacheKey, plan, 300, [`plan:${req.params.id}`]);
  }
  res.json({ plan });
});

app.get('/api/users/:id/active-plan', (req, res) => {
  const cacheKey = `user:${req.params.id}:active-plan`;
  let plan = cache.get<WorkoutPlan>(cacheKey);
  if (!plan) {
    plan = db.getUserActivePlan(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'No active plan for user' });
    }
    cache.set(cacheKey, plan, 300, [`user:${req.params.id}`, `plan:${plan.id}`]);
  }
  res.json({ plan });
});

app.post('/api/workouts/update', async (req, res) => {
  try {
    const { planId, feedback } = req.body;
    if (!planId || !feedback || !feedback.trim()) {
      return res.status(400).json({ error: 'Plan ID and feedback instruction are required' });
    }

    const updatedPlan = await planUpdateService.modifyPlanWithFeedback(planId, feedback.trim());
    res.json({ success: true, plan: updatedPlan });
  } catch (err: any) {
    console.error('Error updating workout plan:', err);
    res.status(500).json({ error: err.message || 'Failed to update plan' });
  }
});

// 4. Exercise Completion Routes
app.post('/api/exercises/complete', (req, res) => {
  try {
    const { userId, planId, dayNumber, exerciseId, exerciseName } = req.body;
    if (!userId || !planId || dayNumber === undefined || !exerciseId) {
      return res.status(400).json({ error: 'Missing required completion fields' });
    }

    const result = db.toggleCompletion(
      userId,
      planId,
      Number(dayNumber),
      exerciseId,
      exerciseName || 'Exercise'
    );
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to log completion' });
  }
});

// 5. Exercises Library & Unique Demo Classes
app.get('/api/exercises', (req, res) => {
  const cacheKey = 'exercises:all';
  let exercises = cache.get(cacheKey);
  if (!exercises) {
    exercises = db.getAllExercises();
    cache.set(cacheKey, exercises, 600, ['exercises']);
  }
  res.json({ exercises });
});

app.get('/api/exercises/:id', (req, res) => {
  const exercise = db.getExercise(req.params.id) || db.findExerciseByName(req.params.id);
  if (!exercise) {
    return res.status(404).json({ error: 'Exercise demo class not found' });
  }
  res.json({ exercise });
});

// 6. Coach Session & Messages
app.post('/api/coach/session', (req, res) => {
  const { userId, currentDay, currentExercise } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  const session = db.getOrCreateCoachSession(
    userId,
    Number(currentDay) || 1,
    currentExercise || 'General'
  );
  res.json({ session });
});

app.post('/api/coach/message', async (req, res) => {
  try {
    const { userId, message, currentDay, currentExercise, currentSet } = req.body;
    if (!userId || !message || !message.trim()) {
      return res.status(400).json({ error: 'User ID and message are required' });
    }

    const result = await coachService.processCoachMessage(
      userId,
      message.trim(),
      Number(currentDay) || 1,
      currentExercise || 'Exercise',
      currentSet ? Number(currentSet) : undefined
    );
    res.json({ success: true, reply: result.reply, session: result.session });
  } catch (err: any) {
    console.error('Error in coach conversation:', err);
    res.status(500).json({ error: err.message || 'Coach processing failed' });
  }
});

// 7. Active Workout Session State (for exact resumption / "CONTINUE WORKOUT")
app.get('/api/users/:id/session-state', (req, res) => {
  const state = db.getWorkoutSessionState(req.params.id);
  res.json({ state });
});

app.post('/api/users/:id/session-state', (req, res) => {
  const state = db.saveWorkoutSessionState(req.params.id, req.body);
  res.json({ success: true, state });
});

app.delete('/api/users/:id/session-state', (req, res) => {
  db.clearWorkoutSessionState(req.params.id);
  res.json({ success: true });
});

// 7b. Personalized 3D Human Avatar Endpoints
app.post('/api/avatar/generate', async (req, res) => {
  try {
    const { userId, imageBase64, mimeType, height, heightUnit, weight, weightUnit, genderPreference } = req.body;
    const avatar = await avatarService.generateAvatar({
      userId: userId || 'FB-1001',
      imageBase64,
      mimeType,
      height: height ? Number(height) : undefined,
      heightUnit,
      weight: weight ? Number(weight) : undefined,
      weightUnit,
      genderPreference
    });

    res.json({ success: true, avatar });
  } catch (err: any) {
    console.error('Error generating 3D avatar:', err);
    res.status(500).json({ error: err.message || 'Failed to generate 3D avatar' });
  }
});

app.post('/api/users/:id/avatar', (req, res) => {
  try {
    const user = db.saveUserAvatar(req.params.id, req.body.avatar);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, avatar: user.avatar, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save avatar' });
  }
});

app.get('/api/users/:id/avatar', (req, res) => {
  const avatar = db.getUserAvatar(req.params.id);
  res.json({ avatar });
});

// 8. Progress Tracking & Actual User Analytics
app.get('/api/progress/:userId', (req, res) => {
  const { userId } = req.params;
  const cacheKey = `progress:${userId}`;
  let data = cache.get(cacheKey);

  if (!data) {
    const user = db.getUser(userId);
    const plan = db.getUserActivePlan(userId);
    const completions = db.getUserCompletions(userId);

    // Group completions by dayNumber
    const completionsByDay: Record<number, number> = {};
    const completionsByDayList: Record<number, typeof completions> = {};
    for (const c of completions) {
      completionsByDay[c.dayNumber] = (completionsByDay[c.dayNumber] || 0) + 1;
      if (!completionsByDayList[c.dayNumber]) completionsByDayList[c.dayNumber] = [];
      completionsByDayList[c.dayNumber].push(c);
    }

    // Calculate completed days (if day has >= 3 exercises completed)
    const completedDaysCount = Object.values(completionsByDay).filter(count => count >= 3).length;

    // Build real completed workouts history (Section 6)
    const activeRoutine = plan ? (plan.updatedPlan || plan.originalPlan) : [];
    const workoutHistory = Object.entries(completionsByDayList).map(([dayNumStr, items]) => {
      const dayNum = Number(dayNumStr);
      const dayPlan = activeRoutine.find(d => d.dayNumber === dayNum);
      const latestItem = items[items.length - 1];
      const dateObj = latestItem ? new Date(latestItem.completedAt) : new Date();
      const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase();
      
      return {
        date: dateFormatted,
        dayNumber: dayNum,
        title: dayPlan ? dayPlan.title : `Day ${dayNum} Routine`,
        focus: dayPlan ? dayPlan.focus : 'Full Body',
        exercisesCompleted: items.length,
        totalExercises: dayPlan ? dayPlan.main_workout.length : Math.max(items.length, 4),
        completed: items.length >= 3,
        completedAt: latestItem?.completedAt || new Date().toISOString()
      };
    }).sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    data = {
      user,
      planId: plan?.id || null,
      totalCompletionsCount: completions.length,
      completedDaysCount,
      totalPlanDays: activeRoutine.length || 7,
      completionsByDay,
      recentCompletions: completions.slice(-10).reverse(),
      workoutHistory,
      planHistory: plan?.feedbackHistory || []
    };

    cache.set(cacheKey, data, 60, [`progress:${userId}`, `user:${userId}`]);
  }

  res.json(data);
});

// ============================================================================
// 9. ADMIN PORTAL & SECURITY BOUNDARY (Sections 17 & 18)
// ============================================================================
const ADMIN_SECRET_KEY = process.env.ADMIN_KEY || 'fitbuddy-admin-2026';

const requireAdminAuth: express.RequestHandler = (req, res, next) => {
  const authHeader = req.headers['x-admin-key'] || req.headers['authorization'];
  if (!authHeader) {
    res.status(401).json({ error: 'Unauthorized: Admin authorization required' });
    return;
  }
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  if (token !== ADMIN_SECRET_KEY) {
    res.status(403).json({ error: 'Forbidden: Invalid admin credentials' });
    return;
  }
  next();
};

// Admin authentication endpoint
app.post('/api/admin/login', (req, res) => {
  const { key } = req.body;
  if (!key || key !== ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: 'Invalid admin passkey' });
  }
  res.json({ success: true, token: ADMIN_SECRET_KEY });
});

// Admin Dashboard stats
app.get('/api/admin/dashboard', requireAdminAuth, (req, res) => {
  const allUsers = db.getAllUsers();
  const allPlans = db.getAllPlans();
  const allCompletions = db.completions;
  
  let feedbackCount = 0;
  let updatedPlansCount = 0;
  for (const p of allPlans) {
    if (p.updatedPlan) updatedPlansCount++;
    if (p.feedbackHistory) feedbackCount += p.feedbackHistory.length;
  }

  res.json({
    totalUsers: allUsers.length,
    totalPlans: allPlans.length,
    updatedPlansCount,
    totalCompletions: allCompletions.length,
    feedbackCount
  });
});

// Admin Users view
app.get('/api/admin/users', requireAdminAuth, (req, res) => {
  const users = db.getAllUsers().map((u) => {
    const activePlan = db.getUserActivePlan(u.id);
    return {
      userId: u.id,
      name: u.username,
      goal: u.goal,
      experience: u.skillLevel || u.intensity,
      equipment: u.equipment,
      weight: `${u.weight} ${u.weightUnit}`,
      age: u.age,
      planStatus: activePlan ? (activePlan.updatedPlan ? 'Updated' : 'Original') : 'No Plan',
      createdAt: u.createdAt || new Date().toISOString()
    };
  });
  res.json({ users });
});

// Admin Plans view
app.get('/api/admin/plans', requireAdminAuth, (req, res) => {
  const plans = db.getAllPlans().map((p) => {
    const user = db.getUser(p.userId);
    return {
      id: p.id,
      userId: p.userId,
      userName: user ? user.username : 'Unknown Athlete',
      goal: p.goal,
      equipment: p.equipment,
      skillLevel: p.skillLevel,
      originalPlan: p.originalPlan,
      updatedPlan: p.updatedPlan,
      feedbackCount: p.feedbackHistory?.length || 0,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      status: p.status
    };
  });
  res.json({ plans });
});

// Admin Feedback view
app.get('/api/admin/feedback', requireAdminAuth, (req, res) => {
  const feedbackList: Array<{
    userFeedback: string;
    relatedPlanId: string;
    userName: string;
    updatedPlanSummary: string;
    appliedAt: string;
  }> = [];

  const allPlans = db.getAllPlans();
  for (const plan of allPlans) {
    const user = db.getUser(plan.userId);
    if (plan.feedbackHistory && plan.feedbackHistory.length > 0) {
      for (const item of plan.feedbackHistory) {
        feedbackList.push({
          userFeedback: item.feedback,
          relatedPlanId: plan.id,
          userName: user ? user.username : 'Athlete',
          updatedPlanSummary: item.note || 'Plan updated with progressive modifications.',
          appliedAt: item.appliedAt
        });
      }
    }
  }

  // Sort newest first
  feedbackList.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

  res.json({ feedback: feedbackList });
});

// ============================================================================
// SERVER INITIALIZATION & VITE MIDDLEWARE
// ============================================================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`FitBuddy Platform operational on http://0.0.0.0:${port}`);
  });
}

startServer();
