import React, { useState } from 'react';
import { ComprehensivePlan } from '../types';
import { GlassCard, PageHeader, NeonButton, Tabs, Badge } from '../components/DesignSystem';
import { Timer, Dumbbell, Play, BarChart2 } from 'lucide-react';

export const WorkoutsView: React.FC<{ plan: ComprehensivePlan; onStartSession: () => void }> = ({ plan, onStartSession }) => {
   // Ensure we have at least a dummy structure if plan is incomplete or contains undefined entries
   const safeWorkouts = plan.weeklyWorkouts && plan.weeklyWorkouts.length > 0
      ? plan.weeklyWorkouts.filter(w => !!w) // Filter out null/undefined
      : [];

   // Fallback if filter resulted in empty array
   if (safeWorkouts.length === 0) {
      safeWorkouts.push({ dayName: 'Monday', focus: 'Rest Day', durationMinutes: 0, exercises: [] });
   }

   const [activeDay, setActiveDay] = useState(safeWorkouts[0].dayName);

   // Robust fallback: if find fails, use index 0. If that somehow fails, use a hardcoded default.
   const workout = safeWorkouts.find(w => w.dayName === activeDay) || safeWorkouts[0] || {
      dayName: 'Default',
      focus: 'Rest',
      durationMinutes: 0,
      exercises: []
   };

   const dayNames = safeWorkouts.map(w => w.dayName);

   // Safe access to focus property
   const isRestDay = !workout.focus || workout.focus.toLowerCase().includes('rest') || !workout.exercises || workout.exercises.length === 0;

   return (
      <div className="animate-fade-in space-y-8">
         <PageHeader
            title="Training Matrix"
            subtitle="Hypertrophy and performance programming."
         />

         <Tabs tabs={dayNames} activeTab={activeDay} onChange={setActiveDay} />

         {/* Hero Card */}
         <div className="relative rounded-3xl overflow-hidden bg-charcoal border border-white/10 p-8 min-h-[250px] flex items-end">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 opacity-50" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

            <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-end gap-6">
               <div>
                  <Badge variant="purple" className="mb-2">{workout.dayName}</Badge>
                  <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                     {workout.focus || "Rest Day"}
                  </h2>
                  {!isRestDay && (
                     <div className="flex gap-6 mt-4 text-slate-300 font-medium">
                        <div className="flex items-center gap-2"><Timer size={18} className="text-neon-purple" /> {workout.durationMinutes} min</div>
                        <div className="flex items-center gap-2"><Dumbbell size={18} className="text-neon-purple" /> {workout.exercises.length} exercises</div>
                     </div>
                  )}
               </div>
               {!isRestDay && <NeonButton size="lg" className="w-full md:w-auto" onClick={onStartSession}>Start Workout <Play size={20} fill="currentColor" /></NeonButton>}
            </div>
         </div>

         {/* Exercises */}
         {!isRestDay ? (
            <div className="grid grid-cols-1 gap-4">
               {workout.exercises.map((ex, idx) => (
                  <GlassCard key={idx} className="flex flex-col md:flex-row md:items-center gap-6 group hover:border-neon-purple/40">
                     <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-lg text-slate-500 group-hover:text-neon-purple group-hover:bg-neon-purple/10 transition-colors shrink-0">
                        {idx + 1}
                     </div>

                     <div className="flex-1">
                        <h4 className="text-xl font-bold text-white group-hover:text-neon-purple transition-colors">{ex.name}</h4>
                        <p className="text-slate-400 text-sm mt-1">{ex.description}</p>
                     </div>

                     <div className="flex gap-4 shrink-0 mt-2 md:mt-0">
                        <div className="px-4 py-2 rounded-lg bg-obsidian/50 border border-white/5 text-center min-w-[80px]">
                           <div className="text-xs text-slate-500 uppercase font-bold">Sets</div>
                           <div className="text-lg font-bold text-white">{ex.sets}</div>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-obsidian/50 border border-white/5 text-center min-w-[80px]">
                           <div className="text-xs text-slate-500 uppercase font-bold">Reps</div>
                           <div className="text-lg font-bold text-white">{ex.reps}</div>
                        </div>
                     </div>
                  </GlassCard>
               ))}
            </div>
         ) : (
            <GlassCard className="text-center py-20 border-dashed">
               <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
                  <BarChart2 size={32} />
               </div>
               <h3 className="text-2xl font-bold text-white">Active Recovery</h3>
               <p className="text-slate-400 max-w-md mx-auto mt-2">
                  Today is dedicated to adaptation. Prioritize sleep, hydration, and mobility work to prepare for tomorrow's intensity.
               </p>
            </GlassCard>
         )}
      </div>
   );
};