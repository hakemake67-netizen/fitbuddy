import React from 'react';
import { 
  Scale, 
  Droplets, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Apple, 
  HeartPulse,
  Info
} from 'lucide-react';
import { UserProfile, WorkoutPlan } from '../types';

interface NutritionViewProps {
  user: UserProfile;
  plan: WorkoutPlan | null;
}

export default function NutritionView({ user, plan }: NutritionViewProps) {
  const isGain = user.goal.toLowerCase().includes('gain') || user.goal.toLowerCase().includes('muscle') || user.goal.toLowerCase().includes('strength');
  const proteinFactor = isGain ? 2.0 : 1.8;
  const targetProteinGrams = Math.round(user.weight * proteinFactor);
  const waterLiters = (user.weight * 0.045).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#0c1017] space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span className="font-bold uppercase tracking-wider">EVIDENCE-BASED NUTRITION</span>
          <span>·</span>
          <span className="text-slate-400">{user.goal} Target</span>
        </div>
        <h1 className="text-2xl font-bold text-white">General Sports Nutrition & Hydration</h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Practical macro distribution and fluid replenishment to support recovery, tissue remodeling, and athletic readiness.
        </p>
      </div>

      {/* Medical / Healthcare Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-200">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>General nutrition guidance:</strong> The metrics provided here are general educational estimates based on exercise physiology standards. Consult a registered dietitian, physician, or healthcare provider for individualized medical nutrition therapy.
        </p>
      </div>

      {/* Core Nutritional Targets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Daily Protein Target */}
        <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Daily Protein</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            ~{targetProteinGrams} <span className="text-sm font-normal text-slate-400">grams/day</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Calculated at {proteinFactor}g per kg body weight ({user.weight}kg) distributed across 3-4 meals to maximize muscle protein synthesis.
          </p>
        </div>

        {/* Daily Hydration Target */}
        <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Hydration Volume</span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            ~{waterLiters} <span className="text-sm font-normal text-slate-400">liters/day</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Baseline daily fluid intake. Increase by 500ml on intensive training days to offset sweat rate and maintain intracellular volume.
          </p>
        </div>

        {/* Sleep & Growth Hormone Target */}
        <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Nocturnal Sleep</span>
            <HeartPulse className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            7.5 – 8.5 <span className="text-sm font-normal text-slate-400">hours/night</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Essential for central nervous system restoration, testosterone/HGH secretion, and cognitive motor recovery.
          </p>
        </div>
      </div>

      {/* Plan-Specific Nutrition Tip */}
      {plan?.nutritionTip && (
        <div className="rounded-2xl p-5 border border-white/[0.08] bg-[#0c1017] space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
            Plan-Specific Recovery Guidance
          </span>
          <p className="text-xs text-slate-300 leading-relaxed p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            {plan.nutritionTip}
          </p>
        </div>
      )}

      {/* Practical Meal Timing & Nutrient Timing Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5 border border-white/[0.08] bg-[#0c1017] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Pre-Workout Fueling (1-2 Hours Prior)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Consume easily digestible carbohydrates (e.g. oats, banana, rice cakes) to saturate glycogen stores.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Pair with 20-30g lean protein to minimize intra-workout amino acid degradation.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Keep dietary fat low prior to training to avoid delayed gastric emptying.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl p-5 border border-white/[0.08] bg-[#0c1017] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Post-Workout Recovery (Within 90 Mins)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Consume 25-40g high-leucine protein (chicken breast, eggs, whey, Greek yogurt, or tofu/legumes).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Replenish carbohydrates according to training volume to re-synthesize depleted glycogen.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Hydrate with water and electrolytes (sodium, potassium, magnesium) to restore balance.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
