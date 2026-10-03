import React from 'react';
import { Trophy, Sparkles, Award, ArrowRight, Zap } from 'lucide-react';
import { ATHLETIC_RANKS } from './xpSystem';

interface LevelUpCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  accentRgb: string;
  currentAccentHex: string;
}

export default function LevelUpCelebrationModal({
  isOpen,
  onClose,
  newLevel,
  accentRgb,
  currentAccentHex
}: LevelUpCelebrationModalProps) {
  if (!isOpen) return null;

  const rank = ATHLETIC_RANKS.find(r => newLevel >= r.minLevel && newLevel <= r.maxLevel) || ATHLETIC_RANKS[ATHLETIC_RANKS.length - 1];

  return (
    <div className="fixed inset-0 z-50 bg-[#07090d]/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-[#0e121a] border border-white/[0.18] rounded-3xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Ambient Glow */}
        <div 
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ backgroundColor: currentAccentHex }}
        />

        {/* Animated Badge Icon */}
        <div className="relative mx-auto w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shadow-2xl border bg-black/60"
          style={{ 
            borderColor: `rgba(${accentRgb}, 0.5)`,
            boxShadow: `0 0 35px rgba(${accentRgb}, 0.35)`
          }}
        >
          <span>{rank.badge}</span>
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[var(--accent)] animate-ping" />
        </div>

        <div className="space-y-1 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/35 text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LEVEL UP ACHIEVED!</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-tight pt-1">
            LEVEL {newLevel} UNLOCKED
          </h2>

          <p className="text-sm font-semibold" style={{ color: currentAccentHex }}>
            PROMOTED TO: {rank.title.toUpperCase()}
          </p>
        </div>

        {/* Perk Unlocked Card */}
        <div className="bg-black/50 border border-white/[0.08] rounded-2xl p-4 text-xs text-left space-y-1.5 relative">
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-white uppercase">
            <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>New Athletic Attribute Activated:</span>
          </div>
          <p className="text-[#cbd5e1] leading-relaxed">
            {rank.perk}
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl text-sm font-bold bg-[var(--accent)] text-[#07090d] hover:brightness-110 active:scale-95 transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Continue Training</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
