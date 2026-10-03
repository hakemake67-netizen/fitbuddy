import React, { useState } from 'react';
import { 
  User, 
  Edit3, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Eye, 
  Moon, 
  Check, 
  X, 
  Sparkles, 
  RefreshCw,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { UserProfile, UserSettings } from '../types';
import ThreeRealisticHumanModel from './ThreeRealisticHumanModel';

interface ProfileViewProps {
  user: UserProfile;
  settings: UserSettings;
  onUpdateUser: (updated: UserProfile) => void;
  onUpdateSettings: (settings: UserSettings) => void;
  onRequestRegeneratePlan: () => void;
  onReplayIntro?: () => void;
  onOpenAvatarModal: () => void;
}

export default function ProfileView({
  user,
  settings,
  onUpdateUser,
  onUpdateSettings,
  onRequestRegeneratePlan,
  onReplayIntro,
  onOpenAvatarModal,
}: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showRegenPrompt, setShowRegenPrompt] = useState<boolean>(false);
  const [pendingUserUpdate, setPendingUserUpdate] = useState<UserProfile | null>(null);

  // Form Edit State
  const [formData, setFormData] = useState({
    username: user.username,
    age: user.age,
    weight: user.weight,
    weightUnit: user.weightUnit,
    goal: user.goal,
    skillLevel: user.skillLevel,
    equipment: user.equipment,
    sessionDuration: user.sessionDuration || '45-60 min'
  });

  const handleOpenEdit = () => {
    setFormData({
      username: user.username,
      age: user.age,
      weight: user.weight,
      weightUnit: user.weightUnit,
      goal: user.goal,
      skillLevel: user.skillLevel,
      equipment: user.equipment,
      sessionDuration: user.sessionDuration || '45-60 min'
    });
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      username: formData.username.trim() || 'Athlete',
      age: Number(formData.age) || 28,
      weight: Number(formData.weight) || 70,
      weightUnit: formData.weightUnit,
      goal: formData.goal,
      skillLevel: formData.skillLevel,
      intensity: formData.skillLevel,
      equipment: formData.equipment,
      sessionDuration: formData.sessionDuration
    };

    setIsEditing(false);

    // Check if goal, experience, or equipment changed
    const majorChange = 
      updated.goal !== user.goal || 
      updated.skillLevel !== user.skillLevel || 
      updated.equipment !== user.equipment;

    if (majorChange) {
      setPendingUserUpdate(updated);
      setShowRegenPrompt(true);
    } else {
      onUpdateUser(updated);
    }
  };

  const handleConfirmKeepPlan = () => {
    if (pendingUserUpdate) {
      onUpdateUser(pendingUserUpdate);
    }
    setShowRegenPrompt(false);
    setPendingUserUpdate(null);
  };

  const handleConfirmRegeneratePlan = () => {
    if (pendingUserUpdate) {
      onUpdateUser(pendingUserUpdate);
    }
    setShowRegenPrompt(false);
    setPendingUserUpdate(null);
    onRequestRegeneratePlan();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
            ATHLETE PROFILE & SETTINGS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal training preferences and application settings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenEdit}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition cursor-pointer flex items-center gap-2 self-start sm:self-auto shadow"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>EDIT PROFILE</span>
        </button>
      </div>

      {/* ======================================================================= */}
      {/* 9. PROFILE DETAILS CARD                                                 */}
      {/* ======================================================================= */}
      <div className="rounded-2xl p-6 sm:p-8 border border-white/[0.08] bg-[#0c1017] space-y-6">
        <div className="flex items-center gap-4 border-b border-white/[0.06] pb-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-extrabold text-xl flex items-center justify-center">
            {user.username.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{user.username}</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Goal: <span className="text-emerald-400 font-semibold">{user.goal}</span>
            </p>
          </div>
        </div>

        {/* Profile Attributes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
            <span className="text-slate-400 font-mono block">Age</span>
            <span className="text-sm font-bold text-white">{user.age} years</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
            <span className="text-slate-400 font-mono block">Weight</span>
            <span className="text-sm font-bold text-white">{user.weight} {user.weightUnit}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
            <span className="text-slate-400 font-mono block">Goal</span>
            <span className="text-sm font-bold text-emerald-400">{user.goal}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
            <span className="text-slate-400 font-mono block">Experience</span>
            <span className="text-sm font-bold text-white capitalize">{user.skillLevel}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
            <span className="text-slate-400 font-mono block">Equipment</span>
            <span className="text-sm font-bold text-white capitalize">{user.equipment}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
            <span className="text-slate-400 font-mono block">Session Duration</span>
            <span className="text-sm font-bold text-white">{user.sessionDuration || '45-60 min'}</span>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 10b. PERSONAL REALISTIC 3D HUMAN AVATAR CARD                            */}
      {/* ======================================================================= */}
      <div className="rounded-2xl p-6 sm:p-8 border border-white/[0.08] bg-[#0c1017] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                PERSONAL 3D HUMAN AVATAR
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/25">
                {user.avatar ? 'Calibrated' : 'Ready to Create'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {user.avatar ? 'Your 3D Avatar' : 'Personal Realistic 3D Human Avatar'}
            </h2>
            <p className="text-xs text-slate-400">
              {user.avatar 
                ? 'Your calibrated 3D human model is ready and active across all exercise demo classes.' 
                : 'Upload a personal photo and physical measurements to generate your realistic 3D human fitness model.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAvatarModal}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition cursor-pointer flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-emerald-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>{user.avatar ? 'CUSTOMIZE 3D AVATAR' : 'GENERATE MY AVATAR'}</span>
          </button>
        </div>

        {user.avatar ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* 3D Mini Interactive Viewport */}
            <div className="md:col-span-5 h-[280px] rounded-2xl overflow-hidden border border-white/[0.1] shadow-xl relative">
              <ThreeRealisticHumanModel
                avatar={user.avatar}
                exerciseType="IDLE"
                showControls={false}
                interactiveOrbit={true}
                className="w-full h-full"
              />
              <span className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-slate-400">
                Drag to rotate 360°
              </span>
            </div>

            {/* Avatar Profile Specs */}
            <div className="md:col-span-7 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                  <span className="text-slate-400 font-mono text-[11px] block">Body Build</span>
                  <span className="text-sm font-bold text-white capitalize">{user.avatar.bodyBuild}</span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                  <span className="text-slate-400 font-mono text-[11px] block">Skin Undertone</span>
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: user.avatar.skinToneHex }}
                    />
                    <span className="text-xs font-mono font-bold text-slate-200">{user.avatar.skinToneHex}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                  <span className="text-slate-400 font-mono text-[11px] block">Hair Styling</span>
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: user.avatar.hairColorHex }}
                    />
                    <span className="text-xs font-mono capitalize text-slate-200">{user.avatar.hairStyle}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                  <span className="text-slate-400 font-mono text-[11px] block">Kinematic Rig</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">Fully Articulated</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="text-[11px]">Applied to Demo Classes & Exercise Simulations</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenAvatarModal}
                  className="text-[11px] font-mono font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <strong className="text-sm font-bold text-white block">
                No 3D Avatar Created Yet
              </strong>
              <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                FitBuddy uses realistic 3D human models with natural human anatomy and exercise kinematics. Upload a photo or enter measurements to see your personalized 3D avatar execute squats, push-ups, lunges, and more.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenAvatarModal}
              className="px-5 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition cursor-pointer shrink-0"
            >
              CREATE 3D AVATAR
            </button>
          </div>
        )}
      </div>

      {/* ======================================================================= */}
      {/* 11. SETTINGS (Voice Coach, Motion, Theme)                               */}
      {/* ======================================================================= */}
      <div className="rounded-2xl p-6 sm:p-8 border border-white/[0.08] bg-[#0c1017] space-y-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          Application Settings
        </h2>

        <div className="space-y-3.5 text-xs">
          {/* Setting 1: Voice Coach */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 font-bold text-white">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Voice Coach Speech Playback</span>
              </div>
              <p className="text-slate-400">
                Spoken voice feedback during interactive live coaching sessions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onUpdateSettings({ ...settings, voiceCoachEnabled: !settings.voiceCoachEnabled })}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs transition cursor-pointer ${
                settings.voiceCoachEnabled
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'bg-white/[0.06] text-slate-400 hover:text-white'
              }`}
            >
              {settings.voiceCoachEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Setting 2: Motion */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 font-bold text-white">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Interface Animations</span>
              </div>
              <p className="text-slate-400">
                Reduce cinematic background transitions and visual motion effects.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onUpdateSettings({ ...settings, reducedMotion: !settings.reducedMotion })}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs transition cursor-pointer ${
                settings.reducedMotion
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-white/[0.06] text-slate-300 hover:text-white'
              }`}
            >
              {settings.reducedMotion ? 'REDUCED MOTION' : 'STANDARD'}
            </button>
          </div>

          {/* Setting 3: Theme */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 font-bold text-white">
                <Moon className="w-4 h-4 text-emerald-400" />
                <span>Color Theme</span>
              </div>
              <p className="text-slate-400">
                Cinematic dark obsidian environment with natural green accents.
              </p>
            </div>

            <span className="px-3 py-1.5 rounded-lg bg-black/40 text-slate-300 font-mono font-bold text-xs border border-white/[0.08]">
              DARK
            </span>
          </div>

          {/* Intro Replay option */}
          {onReplayIntro && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onReplayIntro}
                className="text-xs text-slate-400 hover:text-emerald-400 transition cursor-pointer"
              >
                Replay First-Time Welcome Intro
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================================= */}
      {/* EDIT PROFILE MODAL                                                      */}
      {/* ======================================================================= */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#090d14] border border-white/[0.1] shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Edit Athlete Profile
              </h2>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-medium block">Name</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium block">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
                    min="14"
                    max="100"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium block">Weight ({formData.weightUnit})</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium block">Fitness Goal</label>
                <select
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  className="w-full rounded-xl bg-[#090d14] border border-white/[0.08] px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
                >
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="General Fitness">General Fitness</option>
                  <option value="Strength">Strength</option>
                  <option value="Endurance">Endurance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium block">Experience</label>
                  <select
                    value={formData.skillLevel}
                    onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value as any })}
                    className="w-full rounded-xl bg-[#090d14] border border-white/[0.08] px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium block">Equipment</label>
                  <select
                    value={formData.equipment}
                    onChange={(e) => setFormData({ ...formData, equipment: e.target.value as any })}
                    className="w-full rounded-xl bg-[#090d14] border border-white/[0.08] px-3.5 py-2.5 text-white outline-none focus:border-emerald-500 capitalize"
                  >
                    <option value="gym">Gym Equipment</option>
                    <option value="bodyweight">No Equipment (Bodyweight)</option>
                    <option value="minimal">Home / Minimal Gear</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium block">Session Duration</label>
                <select
                  value={formData.sessionDuration}
                  onChange={(e) => setFormData({ ...formData, sessionDuration: e.target.value })}
                  className="w-full rounded-xl bg-[#090d14] border border-white/[0.08] px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
                >
                  <option value="30-45 min">30-45 min</option>
                  <option value="45-60 min">45-60 min</option>
                  <option value="60-75 min">60-75 min</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.06] text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* REGENERATION CONFIRMATION PROMPT (Section 9)                            */}
      {/* ======================================================================= */}
      {showRegenPrompt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0a0e16] border border-white/[0.1] shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-bold text-white">Profile Updated</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              You changed key training preferences. Would you like to keep your existing 7-day workout plan, or generate a new plan matching your updated goal and equipment?
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleConfirmKeepPlan}
                className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 font-bold text-xs transition"
              >
                KEEP EXISTING PLAN
              </button>
              <button
                type="button"
                onClick={handleConfirmRegeneratePlan}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition shadow"
              >
                GENERATE NEW PLAN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
