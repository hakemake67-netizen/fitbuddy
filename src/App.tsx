import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import DashboardOverview from './components/DashboardOverview';
import MyPlanView from './components/MyPlanView';
import PlanGenerator from './components/PlanGenerator';
import WorkoutView from './components/WorkoutView';
import DemoClassesCatalog from './components/DemoClassesCatalog';
import DemoClassModal from './components/DemoClassModal';
import LiveCoach from './components/LiveCoach';
import ProgressView from './components/ProgressView';
import ProfileView from './components/ProfileView';
import AdminView from './components/AdminView';
import CinematicOnboarding from './components/CinematicOnboarding';
import OnboardingFlow from './components/OnboardingFlow';
import { UserProfile, WorkoutPlan, NavTab, ActiveWorkoutState, UserSettings } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Detect whether user needs the cinematic video intro
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return localStorage.getItem('fitbuddy_intro_seen') !== 'true';
    } catch (e) {
      return false;
    }
  });

  // Detect whether user needs the guided step-by-step onboarding flow
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    try {
      return localStorage.getItem('fitbuddy_onboarded') !== 'true';
    } catch (e) {
      return false;
    }
  });

  // Active User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('fitbuddy_active_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
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
      injuryNotes: ''
    };
  });

  // Application Settings (Section 11)
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('fitbuddy_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      voiceCoachEnabled: true,
      reducedMotion: false,
      theme: 'dark'
    };
  });

  const handleUpdateSettings = (updated: UserSettings) => {
    setSettings(updated);
    try {
      localStorage.setItem('fitbuddy_settings', JSON.stringify(updated));
    } catch (e) {}
  };

  // Active Workout Plan
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(true);

  // Selected Day Index (0 to 6)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Active Workout State for Exact Resumption (Section 4)
  const [activeWorkoutState, setActiveWorkoutState] = useState<ActiveWorkoutState | null>(() => {
    try {
      const saved = localStorage.getItem(`fitbuddy_session_${user.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // Flag to auto-open focused session when clicking "Continue Workout"
  const [autoOpenSession, setAutoOpenSession] = useState<boolean>(false);

  // Modal States
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [demoExerciseName, setDemoExerciseName] = useState<string>('Standard Push-Up');
  const [isCoachModalOpen, setIsCoachModalOpen] = useState<boolean>(false);

  // Fetch or load initial user plan and session state
  useEffect(() => {
    setIsLoadingPlan(true);
    fetch(`/api/users/${user.id}/active-plan`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('No plan found');
      })
      .then((data) => {
        if (data.plan) {
          setPlan(data.plan);
        }
      })
      .catch(() => {
        fetch('/api/workouts/plan-101')
          .then((r) => r.json())
          .then((d) => {
            if (d.plan) setPlan(d.plan);
          })
          .catch((err) => console.error('Error fetching fallback plan:', err));
      })
      .finally(() => {
        setIsLoadingPlan(false);
      });

    // Check remote session state
    fetch(`/api/users/${user.id}/session-state`)
      .then((r) => r.json())
      .then((d) => {
        if (d.state) setActiveWorkoutState(d.state);
      })
      .catch(() => {});
  }, [user.id]);

  // Persist user changes to localStorage and server
  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
    try {
      localStorage.setItem('fitbuddy_active_user', JSON.stringify(updated));
    } catch (e) {}

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).catch((e) => console.error('User sync warning:', e));
  };

  // Toggle Weight Unit (KG <-> LBS)
  const handleToggleUnit = () => {
    const nextUnit = user.weightUnit === 'kg' ? 'lbs' : 'kg';
    const nextWeight = nextUnit === 'lbs' 
      ? Math.round(user.weight * 2.20462 * 10) / 10 
      : Math.round((user.weight / 2.20462) * 10) / 10;

    const updated: UserProfile = {
      ...user,
      weightUnit: nextUnit,
      weight: nextWeight
    };
    handleUpdateUser(updated);
  };

  const handlePlanCreated = (newPlan: WorkoutPlan, updatedUser: UserProfile) => {
    setPlan(newPlan);
    handleUpdateUser(updatedUser);
    setSelectedDayIndex(0);
    setActiveTab('plan');
  };

  const handleOnboardingComplete = (newPlan: WorkoutPlan, updatedUser: UserProfile) => {
    setPlan(newPlan);
    handleUpdateUser(updatedUser);
    setSelectedDayIndex(0);
    setShowOnboarding(false);
    setActiveTab('home');
  };

  const handleOpenDemoClass = (exerciseName: string) => {
    setDemoExerciseName(exerciseName);
    setIsDemoModalOpen(true);
  };

  const handleStartExerciseFromDemo = (exerciseName: string) => {
    setIsDemoModalOpen(false);
    if (plan) {
      const activeRoutine = plan.updatedPlan || plan.originalPlan;
      const lower = exerciseName.toLowerCase();
      const dayIdx = activeRoutine.findIndex((d) =>
        d.main_workout.some((ex) => ex.name.toLowerCase().includes(lower) || lower.includes(ex.name.toLowerCase()))
      );
      if (dayIdx >= 0) {
        setSelectedDayIndex(dayIdx);
      }
    }
    setAutoOpenSession(true);
    setActiveTab('workout');
  };

  // Handler for [ CONTINUE WORKOUT ] from Home Dashboard (Section 4)
  const handleContinueWorkout = () => {
    if (activeWorkoutState && activeWorkoutState.dayNumber) {
      setSelectedDayIndex(Math.max(0, activeWorkoutState.dayNumber - 1));
    } else {
      setSelectedDayIndex(0);
    }
    setAutoOpenSession(true);
    setActiveTab('workout');
  };

  const activeRoutine = plan ? (plan.updatedPlan || plan.originalPlan) : [];
  const currentDay = activeRoutine[selectedDayIndex] || activeRoutine[0] || null;

  return (
    <div className={`min-h-screen flex flex-col bg-[#07090e] text-[#f1f5f9] selection:bg-emerald-500/20 selection:text-emerald-300 ${
      settings.reducedMotion ? 'motion-reduce' : ''
    }`}>
      {/* 1. First-time Cinematic Intro */}
      {showIntro && (
        <CinematicOnboarding
          onComplete={() => {
            setShowIntro(false);
          }}
        />
      )}

      {/* 2. Step-by-Step Guided Onboarding Flow */}
      {!showIntro && showOnboarding && (
        <OnboardingFlow
          initialUser={user}
          onComplete={handleOnboardingComplete}
          onCancel={() => setShowOnboarding(false)}
        />
      )}

      {/* Universal Primary Navigation (Section 1: Home · My Plan · Workouts · Coach · Progress · Profile) */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setAutoOpenSession(false);
          setActiveTab(tab);
        }}
        user={user}
        onToggleUnit={handleToggleUnit}
        onOpenCoachModal={() => setIsCoachModalOpen(true)}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12">
        {/* TAB: HOME (Sections 2 & 3 & 4) */}
        {activeTab === 'home' && (
          <DashboardOverview
            user={user}
            plan={plan}
            activeWorkoutState={activeWorkoutState}
            onBuildPlan={() => setActiveTab('generate')}
            onContinueWorkout={handleContinueWorkout}
            onViewPlan={() => setActiveTab('plan')}
            onOpenCoach={() => setIsCoachModalOpen(true)}
            onOpenDemoClass={handleOpenDemoClass}
          />
        )}

        {/* TAB: MY PLAN (Section 5) */}
        {activeTab === 'plan' && (
          <MyPlanView
            plan={plan}
            user={user}
            onSelectDayAndStart={(dayIdx) => {
              setSelectedDayIndex(dayIdx);
              setAutoOpenSession(false);
              setActiveTab('workout');
            }}
            onBuildPlan={() => setActiveTab('generate')}
            onOpenCoach={() => setIsCoachModalOpen(true)}
            onPlanUpdated={(updated) => setPlan(updated)}
          />
        )}

        {/* TAB: WORKOUTS (Active day session & execution) */}
        {activeTab === 'workout' && plan && (
          <WorkoutView
            plan={plan}
            user={user}
            selectedDayIndex={selectedDayIndex}
            onSelectDayIndex={setSelectedDayIndex}
            onOpenDemoClass={handleOpenDemoClass}
            onOpenCoach={() => setIsCoachModalOpen(true)}
            onPlanUpdated={(updated) => setPlan(updated)}
            initialSessionState={activeWorkoutState}
            initialOpenSession={autoOpenSession}
            onSessionStateChange={(st) => setActiveWorkoutState(st)}
          />
        )}

        {activeTab === 'workout' && !plan && !isLoadingPlan && (
          <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-[#0c1017] border border-white/[0.08] text-center space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-white">No Active Workout Plan</h2>
            <p className="text-xs text-slate-400">
              Build a personalized 7-day fitness plan based on your goals and experience.
            </p>
            <button
              onClick={() => setActiveTab('generate')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              BUILD MY PLAN
            </button>
          </div>
        )}

        {/* TAB: PROGRESS (Sections 6, 7, 8) */}
        {activeTab === 'progress' && (
          <ProgressView
            user={user}
            plan={plan}
            onNavigateToWorkout={() => setActiveTab('workout')}
          />
        )}

        {/* TAB: PROFILE & SETTINGS (Sections 9, 10, 11) */}
        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            settings={settings}
            onUpdateUser={handleUpdateUser}
            onUpdateSettings={handleUpdateSettings}
            onRequestRegeneratePlan={() => setActiveTab('generate')}
            onReplayIntro={() => setShowIntro(true)}
          />
        )}

        {/* TAB: ADMIN (Sections 17 & 18: Protected by passkey gate) */}
        {activeTab === 'admin' && (
          <AdminView />
        )}

        {/* UTILITY TABS: Plan Generator & Demo Classes Catalog */}
        {activeTab === 'generate' && (
          <PlanGenerator
            initialUser={user}
            onPlanCreated={handlePlanCreated}
            onSelectExerciseDemo={handleOpenDemoClass}
            onLaunchGuidedOnboarding={() => setShowOnboarding(true)}
          />
        )}

        {activeTab === 'demos' && (
          <DemoClassesCatalog onOpenDemoClass={handleOpenDemoClass} />
        )}
      </main>

      {/* Reusable Exercise Demo Class Modal (Kinematics & Technique) */}
      <DemoClassModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        exerciseName={demoExerciseName}
        onStartExercise={handleStartExerciseFromDemo}
      />

      {/* Live AI Coach Modal (Section 12: Context-aware companion) */}
      <LiveCoach
        isOpen={isCoachModalOpen}
        onClose={() => setIsCoachModalOpen(false)}
        user={user}
        activePlan={plan}
        currentDayNumber={activeWorkoutState ? activeWorkoutState.dayNumber : selectedDayIndex + 1}
        currentExerciseName={
          activeWorkoutState?.exerciseName || 
          currentDay?.main_workout?.[0]?.name || 
          'Standard Push-Up'
        }
        currentSetNumber={activeWorkoutState?.currentSet}
      />

      {/* Footer with Discreet Admin Portal Link */}
      <footer className="border-t border-white/[0.06] py-6 text-xs text-slate-500 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>FITBUDDY · Intelligent Fitness Platform</span>
            <span>·</span>
            <span className="font-mono text-[11px] text-slate-600">No fabricated data</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Discreet Admin Link (Section 1: Keep Admin separate, not in primary nav) */}
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className="text-slate-600 hover:text-slate-400 font-mono text-[11px] transition cursor-pointer"
            >
              Admin Portal
            </button>
            <span className="font-mono text-[11px] text-slate-600">Powered by Google Gemini</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
