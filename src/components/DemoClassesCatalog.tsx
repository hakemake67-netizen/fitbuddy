import React, { useState } from 'react';
import { 
  Video, 
  Dumbbell, 
  Target, 
  Layers, 
  ChevronRight, 
  Sparkles, 
  Play, 
  Activity,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { ExerciseItem } from '../types';
import { 
  EXERCISE_CLASSES, 
  GOALS_EDUCATION, 
  FOCUS_AREAS_EDUCATION 
} from '../data/exerciseDatabase';

interface DemoClassesCatalogProps {
  onOpenDemoClass: (exerciseName: string) => void;
}

export default function DemoClassesCatalog({ onOpenDemoClass }: DemoClassesCatalogProps) {
  const [activeTab, setActiveTab] = useState<'exercises' | 'goals' | 'focus'>('exercises');
  const [filterCategory, setFilterCategory] = useState<'all' | 'bodyweight' | 'gym' | 'minimal'>('all');

  const exercisesList = Object.values(EXERCISE_CLASSES);
  const filteredExercises = filterCategory === 'all'
    ? exercisesList
    : exercisesList.filter((e) => e.category === filterCategory);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#0c1017] space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span className="font-bold uppercase tracking-wider">BIOMECHANICAL MASTERCLASSES</span>
          <span>·</span>
          <span className="text-slate-400">Technique Library</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Unique Exercise Demo Classes & Knowledge</h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Every exercise features an individual kinematic demo class with setup cues, joint angles, breathing rhythm, tempo, and injury mitigation rules.
        </p>
      </div>

      {/* Main Tabs (Exercises, Goals, Focus Areas) */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'exercises'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            Exercise Demo Classes
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'goals'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            Training Goals Knowledge
          </button>
          <button
            onClick={() => setActiveTab('focus')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'focus'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            Muscle Focus Areas
          </button>
        </div>

        {/* Equipment Filter for Exercises Tab */}
        {activeTab === 'exercises' && (
          <div className="flex items-center p-0.5 rounded-xl bg-black/40 border border-white/[0.08] text-[11px]">
            {(['all', 'bodyweight', 'gym', 'minimal'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium capitalize transition cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Gears' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: UNIQUE EXERCISE DEMO CLASSES */}
      {activeTab === 'exercises' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] hover:border-emerald-500/40 transition flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 capitalize">
                    {exercise.category}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                    {exercise.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                  {exercise.name} Demo Class
                </h3>

                <p className="text-xs text-slate-400 italic line-clamp-2">
                  "{exercise.coachingCue}"
                </p>

                <div className="pt-2 border-t border-white/[0.04] space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Target Muscles</span>
                  <div className="flex flex-wrap gap-1">
                    {exercise.targetMuscles.map((m, i) => (
                      <span key={i} className="text-[10px] text-slate-300 bg-white/[0.03] px-2 py-0.5 rounded">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenDemoClass(exercise.name)}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/25"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Launch {exercise.name} Demo Class</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: GOALS EDUCATIONAL CONTENT */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          {Object.values(GOALS_EDUCATION).map((g) => (
            <div
              key={g.id}
              className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-3"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">{g.title}</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">Target Objective</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{g.explanation}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Plan Focus</span>
                  <p className="text-slate-300 text-[11px] mt-0.5">{g.focus}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Recovery Protocol</span>
                  <p className="text-slate-300 text-[11px] mt-0.5">{g.recoveryGuidance}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Nutrition Strategy</span>
                  <p className="text-slate-300 text-[11px] mt-0.5">{g.nutritionGuidance}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  Sample: {g.sampleWorkout}
                </span>
                <div className="flex gap-2">
                  {g.recommendedExercises.map((exId) => (
                    <button
                      key={exId}
                      onClick={() => onOpenDemoClass(exId)}
                      className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-mono transition cursor-pointer"
                    >
                      Demo {exId}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: FOCUS AREAS EDUCATIONAL CONTENT */}
      {activeTab === 'focus' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(FOCUS_AREAS_EDUCATION).map((area) => (
            <div
              key={area.id}
              className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <h3 className="text-base font-bold text-white">{area.title}</h3>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">Anatomical Focus</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{area.explanation}</p>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Key Muscles</span>
                  <div className="flex flex-wrap gap-1">
                    {area.keyMuscles.map((m, i) => (
                      <span key={i} className="text-[10px] text-slate-300 bg-white/[0.03] px-2 py-0.5 rounded">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase block">Coaching Directive</span>
                  <p className="text-slate-300 text-[11px] mt-0.5">{area.coachingGuidance}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Related Demo Classes:</span>
                <div className="flex gap-2">
                  {area.recommendedExercises.map((exId) => (
                    <button
                      key={exId}
                      onClick={() => onOpenDemoClass(exId)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono transition cursor-pointer"
                    >
                      {exId}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
