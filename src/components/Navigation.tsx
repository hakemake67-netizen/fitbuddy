import React from 'react';
import { 
  Home, 
  Layers, 
  Dumbbell, 
  Mic, 
  TrendingUp, 
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { UserProfile, NavTab } from '../types';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  user: UserProfile;
  onToggleUnit: () => void;
  onOpenCoachModal: () => void;
  onReplayIntro?: () => void;
}

export default function Navigation({
  activeTab,
  onSelectTab,
  user,
  onToggleUnit,
  onOpenCoachModal,
  onReplayIntro,
}: NavigationProps) {
  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DESKTOP PRIMARY TOP NAVIGATION (FITBUDDY · Home · My Plan · Workouts · Coach · Progress · Profile) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/[0.08] bg-[#07090e]/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center text-emerald-400 font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              FITBUDDY
            </span>
          </div>

          {/* Primary Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-400">
            <button
              onClick={() => onSelectTab('home')}
              className={`transition cursor-pointer ${
                activeTab === 'home' ? 'text-emerald-400 font-bold' : 'hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onSelectTab('plan')}
              className={`transition cursor-pointer ${
                activeTab === 'plan' ? 'text-emerald-400 font-bold' : 'hover:text-white'
              }`}
            >
              My Plan
            </button>
            <button
              onClick={() => onSelectTab('workout')}
              className={`transition cursor-pointer ${
                activeTab === 'workout' ? 'text-emerald-400 font-bold' : 'hover:text-white'
              }`}
            >
              Workouts
            </button>
            <button
              onClick={onOpenCoachModal}
              className={`transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'coach' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-300 text-slate-300'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              <span>Coach</span>
            </button>
            <button
              onClick={() => onSelectTab('progress')}
              className={`transition cursor-pointer ${
                activeTab === 'progress' ? 'text-emerald-400 font-bold' : 'hover:text-white'
              }`}
            >
              Progress
            </button>
            <button
              onClick={() => onSelectTab('profile')}
              className={`transition cursor-pointer ${
                activeTab === 'profile' ? 'text-emerald-400 font-bold' : 'hover:text-white'
              }`}
            >
              Profile
            </button>
          </nav>

          {/* Actions: Unit Switcher + Coach button + Profile trigger */}
          <div className="flex items-center gap-3">
            {/* KG / LBS Unit Switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/[0.08] text-xs font-mono">
              <button
                type="button"
                onClick={onToggleUnit}
                className={`px-2 py-0.5 rounded transition ${
                  user.weightUnit === 'kg' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                KG
              </button>
              <button
                type="button"
                onClick={onToggleUnit}
                className={`px-2 py-0.5 rounded transition ${
                  user.weightUnit === 'lbs' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                LBS
              </button>
            </div>

            {/* Quick Live Coach Trigger Button */}
            <button
              onClick={onOpenCoachModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Coach</span>
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={() => onSelectTab('profile')}
              className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition"
              title={`${user.username} - View Profile`}
            >
              {user.username ? user.username.slice(0, 2).toUpperCase() : 'ME'}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MOBILE BOTTOM NAVIGATION (Home · My Plan · Workouts · Coach · Progress · Profile) */}
      {/* ========================================================================= */}
      <nav 
        aria-label="Mobile Bottom Navigation" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07090e]/95 backdrop-blur-xl border-t border-white/[0.08] px-2 py-1.5"
      >
        <div className="grid grid-cols-6 items-center max-w-lg mx-auto">
          {/* 1. Home */}
          <button
            onClick={() => onSelectTab('home')}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              activeTab === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] tracking-tight mt-0.5">Home</span>
          </button>

          {/* 2. My Plan */}
          <button
            onClick={() => onSelectTab('plan')}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              activeTab === 'plan' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-[10px] tracking-tight mt-0.5">My Plan</span>
          </button>

          {/* 3. Workouts */}
          <button
            onClick={() => onSelectTab('workout')}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              activeTab === 'workout' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span className="text-[10px] tracking-tight mt-0.5">Workouts</span>
          </button>

          {/* 4. Coach */}
          <button
            onClick={onOpenCoachModal}
            className="flex flex-col items-center justify-center py-1 text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span className="text-[10px] tracking-tight mt-0.5 font-bold">Coach</span>
          </button>

          {/* 5. Progress */}
          <button
            onClick={() => onSelectTab('progress')}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              activeTab === 'progress' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] tracking-tight mt-0.5">Progress</span>
          </button>

          {/* 6. Profile */}
          <button
            onClick={() => onSelectTab('profile')}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              activeTab === 'profile' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span className="text-[10px] tracking-tight mt-0.5">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
}
