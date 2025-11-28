import React from 'react';
import { ComprehensivePlan } from '../types';
import { GlassCard, NeonButton, PageHeader, Badge } from '../components/DesignSystem';
import { Flame, Trophy, TrendingUp, Calendar, PlayCircle, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardProps {
   plan: ComprehensivePlan;
   onStartSession: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ plan, onStartSession }) => {
   const macros = [
      { name: 'Protein', value: plan.macroTarget?.protein || 0, color: '#00E0FF' },
      { name: 'Carbs', value: plan.macroTarget?.carbs || 0, color: '#D4FF00' },
      { name: 'Fats', value: plan.macroTarget?.fats || 0, color: '#BD00FF' },
   ];

   const activityData = [
      { name: 'M', cal: 400 },
      { name: 'T', cal: 450 },
      { name: 'W', cal: 300 },
      { name: 'T', cal: 500 },
      { name: 'F', cal: 420 },
      { name: 'S', cal: 600 },
      { name: 'S', cal: 200 },
   ];

   // Safety check: Ensure we have a workout to display, and the specific element is defined
   const todayWorkout = (plan.weeklyWorkouts && Array.isArray(plan.weeklyWorkouts) && plan.weeklyWorkouts.length > 0 && plan.weeklyWorkouts[0])
      ? plan.weeklyWorkouts[0]
      : {
         dayName: 'Today',
         focus: 'Rest & Recovery',
         durationMinutes: 0,
         exercises: []
      };

   return (
      <div className="space-y-8 animate-fade-in">
         <PageHeader
            title="Command Center"
            subtitle="Your daily performance overview."
         />

         {/* Hero Section */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Macro Ring (Apple Watch Style) */}
            <GlassCard className="lg:col-span-1 flex flex-col items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
               <h3 className="absolute top-6 left-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Nutrition</h3>

               <div className="h-48 w-48 relative my-4">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={macros} innerRadius={65} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none" cornerRadius={10}>
                           {macros.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                     </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-3xl font-bold text-white">{plan.dailyCalories || 0}</span>
                     <span className="text-xs font-bold text-slate-500 uppercase">Kcal Left</span>
                  </div>
               </div>

               <div className="flex gap-6 mt-2">
                  <div className="text-center"><div className="text-xs text-slate-500 uppercase">Pro</div><div className="text-lg font-bold text-neon-blue">{plan.macroTarget?.protein || 0}g</div></div>
                  <div className="text-center"><div className="text-xs text-slate-500 uppercase">Carb</div><div className="text-lg font-bold text-neon-lime">{plan.macroTarget?.carbs || 0}g</div></div>
                  <div className="text-center"><div className="text-xs text-slate-500 uppercase">Fat</div><div className="text-lg font-bold text-neon-purple">{plan.macroTarget?.fats || 0}g</div></div>
               </div>
            </GlassCard>

            {/* Workout Hero */}
            <GlassCard className="lg:col-span-2 relative overflow-hidden flex flex-col justify-between group">
               <div className="absolute right-0 top-0 w-80 h-80 bg-neon-purple/10 blur-[100px] rounded-full group-hover:bg-neon-purple/20 transition-all duration-700 pointer-events-none" />

               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <Badge variant="purple">Today's Training</Badge>
                        <h2 className="text-3xl font-bold text-white mt-2">{todayWorkout.focus || "Active Recovery"}</h2>
                        <p className="text-slate-400 mt-1">{todayWorkout.durationMinutes || 0} Minutes • {todayWorkout.exercises?.length || 0} Exercises</p>
                     </div>
                     <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white">
                        <TrendingUp size={20} />
                     </div>
                  </div>
               </div>

               <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {todayWorkout.exercises && todayWorkout.exercises.length > 0 ? (
                     todayWorkout.exercises.slice(0, 4).map((ex, i) => (
                        <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
                           <div className="text-xs text-slate-400 mb-1">{ex.sets} x {ex.reps}</div>
                           <div className="text-sm font-bold text-slate-200 line-clamp-1">{ex.name}</div>
                        </div>
                     ))
                  ) : (
                     <div className="col-span-4 text-slate-500 text-sm italic">Rest and recover today.</div>
                  )}
               </div>

               <NeonButton className="mt-6 self-start group" disabled={!todayWorkout.exercises || todayWorkout.exercises.length === 0} onClick={onStartSession}>
                  Start Session <PlayCircle size={18} className="group-hover:scale-110 transition-transform" />
               </NeonButton>
            </GlassCard>
         </div>

         {/* Secondary Stats */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <GlassCard className="p-4 flex flex-col gap-2">
               <Flame className="text-orange-500" />
               <div className="text-2xl font-bold text-white">2,450</div>
               <div className="text-xs text-slate-500 uppercase">Calories Burned</div>
            </GlassCard>
            <GlassCard className="p-4 flex flex-col gap-2">
               <Trophy className="text-neon-lime" />
               <div className="text-2xl font-bold text-white">85%</div>
               <div className="text-xs text-slate-500 uppercase">Goal Completion</div>
            </GlassCard>
            <GlassCard className="p-4 flex flex-col gap-2">
               <Calendar className="text-blue-400" />
               <div className="text-2xl font-bold text-white">Day 1</div>
               <div className="text-xs text-slate-500 uppercase">Of 12 Week Program</div>
            </GlassCard>
            <GlassCard className="p-4 flex flex-col gap-2 relative overflow-hidden">
               <div className="absolute inset-0 bg-neon-lime/5" />
               <div className="h-[60px] w-full mt-auto absolute bottom-0 left-0 right-0">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={activityData}>
                        <Bar dataKey="cal" fill="#D4FF00" radius={[2, 2, 0, 0]} opacity={0.5} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
               <div className="relative z-10">
                  <div className="text-2xl font-bold text-white">Active</div>
                  <div className="text-xs text-slate-500 uppercase">Status</div>
               </div>
            </GlassCard>
         </div>
      </div>
   );
};