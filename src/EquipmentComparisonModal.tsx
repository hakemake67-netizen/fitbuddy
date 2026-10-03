import React from 'react';
import { 
  X, 
  Dumbbell, 
  Zap, 
  Layers, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Volume2, 
  Video, 
  Timer,
  ChevronRight,
  ShieldCheck,
  Flame,
  Info
} from 'lucide-react';
import { 
  EquipmentType, 
  EQUIPMENT_OPTIONS, 
  EXERCISE_EQUIVALENTS, 
  ExerciseItem 
} from './equipmentExercises';

interface EquipmentComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEquipment: EquipmentType;
  onSelectEquipmentMode: (mode: EquipmentType) => void;
  onSwapSingleExercise?: (dayIdx: number, exIdx: number, newEx: ExerciseItem) => void;
  onOpenVideoDemo: (exName: string) => void;
  onSpeakCoach: (text: string) => void;
  accentRgb: string;
  currentAccentHex: string;
}

export default function EquipmentComparisonModal({
  isOpen,
  onClose,
  currentEquipment,
  onSelectEquipmentMode,
  onOpenVideoDemo,
  onSpeakCoach,
  accentRgb,
  currentAccentHex
}: EquipmentComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0c1017] border border-white/[0.12] shadow-2xl overflow-hidden"
        style={{
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(${accentRgb}, 0.12)`
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: `rgba(${accentRgb}, 0.12)`,
                borderColor: `rgba(${accentRgb}, 0.35)`,
                color: currentAccentHex
              }}
            >
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Equipment Adaptive Matrix
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Equal Gains • Any Setup
                </span>
              </div>
              <p className="text-xs text-[#8f96a3]">
                Direct biomechanical equivalents for users with Full Gym gear, Zero Equipment (Bodyweight), or Minimal Home Kits.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8f96a3] hover:text-white hover:bg-white/[0.08] transition"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Equipment Switcher Cards */}
        <div className="p-6 border-b border-white/[0.08] bg-black/40">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#6f7682] mb-3">
            Select Your Global Training Environment:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {EQUIPMENT_OPTIONS.map((opt) => {
              const isSelected = currentEquipment === opt.id;
              const isBodyweight = opt.id === 'bodyweight';
              const isGym = opt.id === 'gym';
              const isMinimal = opt.id === 'minimal';

              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    onSelectEquipmentMode(opt.id);
                    onSpeakCoach(`Switched active training environment to ${opt.title}. All routines, timers, and kinematics updated.`);
                  }}
                  className={`group relative text-left p-4 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? isBodyweight
                        ? 'bg-emerald-950/40 border-emerald-500/60 ring-2 ring-emerald-500/30'
                        : isMinimal
                        ? 'bg-amber-950/40 border-amber-500/60 ring-2 ring-amber-500/30'
                        : 'bg-sky-950/40 border-sky-500/60 ring-2 ring-sky-500/30'
                      : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{opt.badge}</span>
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                        <Check className="w-3 h-3 text-emerald-400" /> Active Plan
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#6f7682] group-hover:text-white transition">
                        Switch →
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-sm text-white mb-0.5">{opt.title}</div>
                  <div className="text-[11px] text-[#8f96a3] line-clamp-2 leading-relaxed">
                    {opt.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Matrix Comparison Table */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Movement-for-Movement Biomechanical Equivalents
            </h3>
            <span className="text-xs text-[#6f7682]">
              All variations share identical Rest Timers, Form Demos & Scalable XP
            </span>
          </div>

          <div className="border border-white/[0.08] rounded-xl overflow-hidden divide-y divide-white/[0.06]">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-white/[0.03] text-[11px] font-bold uppercase tracking-wider text-[#6f7682] py-2.5 px-4">
              <div className="col-span-3">Target Muscle / Movement</div>
              <div className="col-span-3 text-sky-400 flex items-center gap-1.5">
                <span>🏋️</span> Full Gym Option
              </div>
              <div className="col-span-3 text-emerald-400 flex items-center gap-1.5">
                <span>🤸</span> Zero Equipment (Bodyweight)
              </div>
              <div className="col-span-3 text-amber-400 flex items-center gap-1.5">
                <span>⚡</span> Minimal Kit (Dumbbells/Bands)
              </div>
            </div>

            {/* Rows */}
            {Object.entries(EXERCISE_EQUIVALENTS).map(([key, eq]) => {
              const categoryTitle = key
                .split('_')
                .map(s => s.charAt(0).toUpperCase() + s.slice(1))
                .join(' ');

              return (
                <div 
                  key={key} 
                  className="grid grid-cols-12 p-4 text-xs gap-3 hover:bg-white/[0.02] transition items-center"
                >
                  {/* Category Column */}
                  <div className="col-span-3">
                    <span className="font-bold text-white block text-sm mb-1">{categoryTitle}</span>
                    <span className="text-[11px] text-[#8f96a3] block leading-tight">
                      {eq.gym.target_muscle}
                    </span>
                  </div>

                  {/* Full Gym Column */}
                  <div className={`col-span-3 p-3 rounded-lg border transition ${
                    currentEquipment === 'gym' 
                      ? 'bg-sky-500/10 border-sky-500/40 text-white' 
                      : 'bg-white/[0.015] border-white/[0.06] text-[#b3b9c4]'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sky-300">{eq.gym.exercise_name}</span>
                      <button
                        onClick={() => onOpenVideoDemo(eq.gym.exercise_name)}
                        className="text-[#6f7682] hover:text-sky-300 transition p-0.5"
                        title="Watch 60 FPS Video Demo Class"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-[#8f96a3] mb-1">
                      {eq.gym.sets} sets × {eq.gym.reps_or_duration}
                    </div>
                    <p className="text-[10px] text-[#6f7682] line-clamp-2">
                      💡 {eq.gym.form_cue}
                    </p>
                  </div>

                  {/* Bodyweight Column */}
                  <div className={`col-span-3 p-3 rounded-lg border transition ${
                    currentEquipment === 'bodyweight' 
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-white' 
                      : 'bg-white/[0.015] border-white/[0.06] text-[#b3b9c4]'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-300">{eq.bodyweight.exercise_name}</span>
                      <button
                        onClick={() => onOpenVideoDemo(eq.bodyweight.exercise_name)}
                        className="text-[#6f7682] hover:text-emerald-300 transition p-0.5"
                        title="Watch 60 FPS Video Demo Class"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-[#8f96a3] mb-1">
                      {eq.bodyweight.sets} sets × {eq.bodyweight.reps_or_duration}
                    </div>
                    <p className="text-[10px] text-[#6f7682] line-clamp-2">
                      💡 {eq.bodyweight.form_cue}
                    </p>
                  </div>

                  {/* Minimal Column */}
                  <div className={`col-span-3 p-3 rounded-lg border transition ${
                    currentEquipment === 'minimal' 
                      ? 'bg-amber-500/10 border-amber-500/40 text-white' 
                      : 'bg-white/[0.015] border-white/[0.06] text-[#b3b9c4]'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-amber-300">{eq.minimal.exercise_name}</span>
                      <button
                        onClick={() => onOpenVideoDemo(eq.minimal.exercise_name)}
                        className="text-[#6f7682] hover:text-amber-300 transition p-0.5"
                        title="Watch 60 FPS Video Demo Class"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-[#8f96a3] mb-1">
                      {eq.minimal.sets} sets × {eq.minimal.reps_or_duration}
                    </div>
                    <p className="text-[10px] text-[#6f7682] line-clamp-2">
                      💡 {eq.minimal.form_cue}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Biomechanical Guarantee Card */}
          <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.08] flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">
                Science-Backed Hypertrophy & Motor Unit Recruitment
              </h4>
              <p className="text-xs text-[#8f96a3] leading-relaxed">
                Whether you lift an Olympic barbell in a commercial gym or push against floor gravity with 3-second deficit tempo push-ups at home, mechanical tension on your muscle fibers remains identical when performed to technical fatigue. Every movement includes full voice cues, rest interval timers, and 60 FPS cinematic kinematics.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-black/40">
          <div className="flex items-center gap-2 text-xs text-[#8f96a3]">
            <span>Active Environment:</span>
            <span className="font-bold text-white capitalize px-2 py-0.5 rounded-full bg-white/[0.08] border border-white/[0.1]">
              {currentEquipment === 'bodyweight' ? '🤸 Zero Equipment (Bodyweight)' : currentEquipment === 'minimal' ? '⚡ Minimal Kit (Home Gym)' : '🏋️ Full Gym Equipment'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-black transition"
            style={{ backgroundColor: currentAccentHex }}
          >
            Done & Return to Workout
          </button>
        </div>
      </div>
    </div>
  );
}
