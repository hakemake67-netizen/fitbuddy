import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Zap, 
  Sparkles, 
  X, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  Shield, 
  Flame,
  Clock
} from 'lucide-react';
import { ATHLETIC_RANKS, calculateLevelFromXp, XpHistoryEntry } from './xpSystem';

interface XpLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalXp: number;
  onGrantXp: (amount: number, source: string) => void;
  xpHistory: XpHistoryEntry[];
  accentRgb: string;
  currentAccentHex: string;
}

export default function XpLevelModal({
  isOpen,
  onClose,
  totalXp,
  onGrantXp,
  xpHistory,
  accentRgb,
  currentAccentHex
}: XpLevelModalProps) {
  const [customXpInput, setCustomXpInput] = useState<string>('150');

  if (!isOpen) return null;

  const stats = calculateLevelFromXp(totalXp);

  const handleCustomGrant = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customXpInput, 10);
    if (!isNaN(val) && val > 0) {
      onGrantXp(val, 'Manual Scalable Calibration');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07090d]/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0b0e15] border border-white/[0.14] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg border"
              style={{ 
                backgroundColor: `rgba(${accentRgb}, 0.15)`,
                borderColor: `rgba(${accentRgb}, 0.35)`
              }}
            >
              <span>{stats.rank.badge}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold" style={{ color: currentAccentHex }}>
                ATHLETIC PROGRESSION HEADQUARTERS
              </span>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Level {stats.level} — {stats.rank.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-[#a7adb7] hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 space-y-6 overflow-y-auto">
          
          {/* Main XP Status Card */}
          <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/[0.1] rounded-2xl p-5 space-y-4 relative overflow-hidden shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-[#a7adb7] uppercase tracking-wider block">
                  CUMULATIVE EXPERIENCE
                </span>
                <div className="text-3xl font-extrabold text-white flex items-baseline gap-1.5 mt-0.5">
                  <span>{totalXp.toLocaleString()}</span>
                  <span className="text-sm font-normal text-[#8ee6c1]">XP</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-[#a7adb7] uppercase tracking-wider block">
                  NEXT RANK TARGET
                </span>
                <span className="text-sm font-mono text-white font-bold block mt-0.5">
                  {stats.xpInCurrentLevel} / {stats.xpNeededForNextLevel} XP
                </span>
              </div>
            </div>

            {/* Scalable Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-black/60 rounded-full border border-white/[0.1] overflow-hidden p-0.5">
                <div 
                  className="h-full rounded-full transition-all duration-500 shadow-md"
                  style={{ 
                    width: `${stats.progressPercent}%`,
                    backgroundColor: currentAccentHex,
                    boxShadow: `0 0 12px ${currentAccentHex}`
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-[#6f7682]">
                <span>Level {stats.level}</span>
                <span>{stats.progressPercent}% Completed</span>
                <span>Level {stats.level + 1}</span>
              </div>
            </div>

            {/* Active Rank Perk */}
            <div className="flex items-center gap-2 bg-black/40 border border-white/[0.08] p-2.5 rounded-xl text-xs">
              <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0" />
              <span className="text-[#a7adb7]">Active Tier Perk: <strong className="text-white">{stats.rank.perk}</strong></span>
            </div>
          </div>

          {/* GIVE SCALABLE XP STATION (Interactive Testing & Rewards) */}
          <div className="bg-[#07090d] border border-white/[0.1] rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[var(--accent)]" />
                <h3 className="font-bold text-white text-sm">Scalable XP Station (Live Calibration)</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent)]">
                SCALABLE REWARDS
              </span>
            </div>

            <p className="text-xs text-[#a7adb7]">
              XP scales exponentially as you train. Test the scalable progression engine instantly:
            </p>

            {/* Quick Scalable XP Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {[
                { amount: 35, label: '+35 XP (Form Rep)' },
                { amount: 60, label: '+60 XP (Video Class)' },
                { amount: 150, label: '+150 XP (Heavy Set)' },
                { amount: 350, label: '+350 XP (Full Session)' },
              ].map(({ amount, label }) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => onGrantXp(amount, label)}
                  className="p-2 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-[var(--accent)]/20 hover:text-[var(--accent)] text-white border border-white/[0.08] hover:border-[var(--accent)]/40 transition active:scale-95 cursor-pointer text-center"
                >
                  <span className="font-mono font-bold block">{label.split(' ')[0]}</span>
                  <span className="text-[10px] text-[#6f7682] block truncate">{label.slice(label.indexOf('('))}</span>
                </button>
              ))}
            </div>

            {/* Custom Scalable XP Input Form */}
            <form onSubmit={handleCustomGrant} className="flex items-center gap-2 pt-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={customXpInput}
                  onChange={(e) => setCustomXpInput(e.target.value)}
                  placeholder="Enter custom XP amount"
                  className="w-full bg-[#11151f] border border-white/[0.1] focus:border-[var(--accent)] rounded-xl px-3 py-2 text-xs font-mono text-white outline-none transition"
                />
                <span className="absolute right-3 top-2 text-xs font-mono text-[#6f7682]">XP</span>
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--accent)] text-[#07090d] hover:brightness-110 active:scale-95 transition cursor-pointer shrink-0"
              >
                Grant Scalable XP
              </button>
            </form>
          </div>

          {/* Athletic Rank Ladder */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#a7adb7]">
              Athletic Rank Journey & Tiers
            </h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {ATHLETIC_RANKS.map((rank, i) => {
                const isCurrent = stats.level >= rank.minLevel && stats.level <= rank.maxLevel;
                const isCompleted = stats.level > rank.maxLevel;
                return (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition ${
                      isCurrent
                        ? 'bg-[var(--accent)]/15 border-[var(--accent)]/40 text-white shadow-sm'
                        : isCompleted
                        ? 'bg-white/[0.02] border-white/[0.04] text-[#6f7682]'
                        : 'bg-white/[0.02] border-white/[0.06] text-[#a7adb7]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{rank.badge}</span>
                      <div>
                        <span className="font-bold block text-white">
                          Levels {rank.minLevel}–{rank.maxLevel > 100 ? '∞' : rank.maxLevel}: {rank.title}
                        </span>
                        <span className="text-[10px] text-[#6f7682]">{rank.perk}</span>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--accent)] text-[#07090d]">
                        CURRENT
                      </span>
                    )}
                    {isCompleted && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent XP Activity Log */}
          {xpHistory.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-[#6f7682] block">
                Recent XP Grants:
              </span>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {xpHistory.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between text-xs bg-white/[0.02] p-2 rounded-lg">
                    <span className="text-[#a7adb7]">{entry.source}</span>
                    <span className="font-mono font-bold" style={{ color: currentAccentHex }}>
                      +{entry.amount} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-[#07090d] flex items-center justify-between text-xs">
          <span className="text-[#6f7682]">FitBuddy Scalable XP Progression v2.5</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
