/**
 * Scalable Experience Points (XP) & Level Progression Engine
 * Scales smoothly from Level 1 to Level 50+ using an exponential polynomial curve.
 */

export interface AthleticRank {
  minLevel: number;
  maxLevel: number;
  title: string;
  badge: string;
  perk: string;
  colorHex: string;
  gradient: string;
}

export const ATHLETIC_RANKS: AthleticRank[] = [
  { 
    minLevel: 1, 
    maxLevel: 2, 
    title: 'Novice Recruit', 
    badge: '🥉', 
    perk: 'Base rest interval countdowns unlocked',
    colorHex: '#94a3b8',
    gradient: 'from-slate-600 to-slate-400'
  },
  { 
    minLevel: 3, 
    maxLevel: 4, 
    title: 'Kinetic Initiate', 
    badge: '🥈', 
    perk: '30s & 60s Video Masterclass form checks',
    colorHex: '#2dd4bf',
    gradient: 'from-teal-500 to-emerald-400'
  },
  { 
    minLevel: 5, 
    maxLevel: 7, 
    title: 'Conditioned Athlete', 
    badge: '🥇', 
    perk: 'Dynamic voice coach personalized cadence cues',
    colorHex: '#38bdf8',
    gradient: 'from-sky-500 to-blue-600'
  },
  { 
    minLevel: 8, 
    maxLevel: 10, 
    title: 'Hypertrophy Specialist', 
    badge: '💎', 
    perk: 'Advanced tempo metronome & joint arc analysis',
    colorHex: '#c084fc',
    gradient: 'from-purple-500 to-indigo-500'
  },
  { 
    minLevel: 11, 
    maxLevel: 14, 
    title: 'Biomechanics Vanguard', 
    badge: '⚡', 
    perk: 'Muscle activation heatmap & vertical bar tracer',
    colorHex: '#fbbf24',
    gradient: 'from-amber-400 to-yellow-500'
  },
  { 
    minLevel: 15, 
    maxLevel: 19, 
    title: 'Titanium Operator', 
    badge: '🛡️', 
    perk: 'Elite rest load periodization & high-density splits',
    colorHex: '#fb7185',
    gradient: 'from-rose-500 to-red-500'
  },
  { 
    minLevel: 20, 
    maxLevel: 999, 
    title: 'Apex Titanium Legend', 
    badge: '👑', 
    perk: 'Complete mastery over kinetic volume and recovery',
    colorHex: '#8ee6c1',
    gradient: 'from-emerald-400 via-teal-300 to-cyan-400'
  }
];

export interface XpHistoryEntry {
  id: string;
  source: string;
  amount: number;
  timestamp: string;
}

/**
 * Calculates cumulative XP required to reach a specific level.
 * Formula: Scalable exponential curve.
 */
export function getCumulativeXpForLevel(level: number): number {
  if (level <= 1) return 0;
  // Level 2: 120 XP, Level 3: 280 XP, Level 4: 490 XP, Level 5: 760 XP, etc.
  return Math.floor(60 * Math.pow(level - 1, 1.45) + 60 * (level - 1));
}

/**
 * Calculates user level and progress based on total XP.
 */
export function calculateLevelFromXp(totalXp: number) {
  let level = 1;
  while (getCumulativeXpForLevel(level + 1) <= totalXp) {
    level++;
  }

  const currentLevelBaseXp = getCumulativeXpForLevel(level);
  const nextLevelXp = getCumulativeXpForLevel(level + 1);
  const xpInCurrentLevel = totalXp - currentLevelBaseXp;
  const xpNeededForNextLevel = nextLevelXp - currentLevelBaseXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100)));

  const rank = ATHLETIC_RANKS.find(r => level >= r.minLevel && level <= r.maxLevel) || ATHLETIC_RANKS[ATHLETIC_RANKS.length - 1];

  return {
    level,
    totalXp,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    nextLevelTotalXp: nextLevelXp,
    progressPercent,
    rank
  };
}

/**
 * Plays a cheerful gamified XP sound chime using Web Audio API
 */
export function playXpGainChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.08); // G5
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.16); // C6

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  } catch (e) {}
}

/**
 * Plays celebratory fanfare chime for Level Up
 */
export function playLevelUpFanfare() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const notes = [
      { f: 523.25, t: 0.0, d: 0.12 }, // C5
      { f: 659.25, t: 0.1, d: 0.12 }, // E5
      { f: 783.99, t: 0.2, d: 0.14 }, // G5
      { f: 1046.5, t: 0.32, d: 0.35 }  // C6
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, now + n.t);
      gain.gain.setValueAtTime(0.2, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });
  } catch (e) {}
}
