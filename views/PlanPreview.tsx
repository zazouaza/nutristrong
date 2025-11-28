import React from 'react';
import { useAppStore } from '../store/useStore';
import { NeonButton, GlassCard, Badge } from '../components/DesignSystem';
import { ArrowRight, Utensils, Dumbbell, ArrowLeft } from 'lucide-react';

interface PlanPreviewProps {
  onProceed: () => void; // Goes to Auth (Register)
  onBack: () => void;    // Goes back to Onboarding
}

export const PlanPreview: React.FC<PlanPreviewProps> = ({ onProceed, onBack }) => {
  const { tempPlan, tempProfile } = useAppStore();

  if (!tempPlan || !tempProfile) return null;

  // Safety variables - use optional chaining and defaults
  const sampleMeal = tempPlan.weeklyMeals?.[0]?.breakfast;
  // Ensure we check if the array exists and has elements
  const sampleWorkout = (tempPlan.weeklyWorkouts && tempPlan.weeklyWorkouts.length > 0) 
    ? tempPlan.weeklyWorkouts[0] 
    : null;

  return (
    <div className="min-h-screen bg-obsidian text-white p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8 pb-24 pt-8">
         {/* Back Button */}
         <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={20} /> Back to adjustments
         </button>

         {/* Header */}
         <div className="text-center py-6">
            <Badge variant="lime" className="mb-4">Protocol Ready</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
               Your <span className="text-neon-lime">NutriStrong</span> Blueprint
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto">
               Based on your biometrics, we have engineered a {tempProfile.goal.toLowerCase().replace('_',' ')} strategy designed to yield maximum results.
            </p>
         </div>

         {/* Core Metrics */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard className="text-center py-6 border-t-4 border-t-neon-blue">
               <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Daily Target</div>
               <div className="text-3xl font-bold text-white">{tempPlan.dailyCalories || 0}</div>
               <div className="text-xs text-neon-blue font-bold">KCAL</div>
            </GlassCard>
            <GlassCard className="text-center py-6 border-t-4 border-t-neon-lime">
               <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Protein</div>
               <div className="text-3xl font-bold text-white">{tempPlan.macroTarget?.protein || 0}g</div>
               <div className="text-xs text-neon-lime font-bold">BUILD</div>
            </GlassCard>
            <GlassCard className="text-center py-6 border-t-4 border-t-neon-purple">
               <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Carbs</div>
               <div className="text-3xl font-bold text-white">{tempPlan.macroTarget?.carbs || 0}g</div>
               <div className="text-xs text-neon-purple font-bold">FUEL</div>
            </GlassCard>
            <GlassCard className="text-center py-6 border-t-4 border-t-orange-500">
               <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Fats</div>
               <div className="text-3xl font-bold text-white">{tempPlan.macroTarget?.fats || 0}g</div>
               <div className="text-xs text-orange-500 font-bold">HORMONE</div>
            </GlassCard>
         </div>

         {/* Previews */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Meal Sample */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 mb-2">
                  <Utensils className="text-neon-lime" size={20} />
                  <h3 className="font-bold text-xl">Nutrition Sample</h3>
               </div>
               <GlassCard className="p-0 overflow-hidden">
                  {sampleMeal ? (
                      <>
                        <div className="bg-white/5 p-4 border-b border-white/5">
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Breakfast</span>
                                <Badge variant="lime">{sampleMeal.calories} kcal</Badge>
                            </div>
                        </div>
                        <div className="p-4 space-y-2">
                            <div className="font-medium text-lg">{sampleMeal.name}</div>
                            <div className="text-sm text-slate-400">{sampleMeal.ingredients?.join(', ')}</div>
                        </div>
                      </>
                  ) : (
                      <div className="p-6 text-slate-500 italic">No meal preview available.</div>
                  )}
               </GlassCard>
            </div>

            {/* Workout Sample */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 mb-2">
                  <Dumbbell className="text-neon-purple" size={20} />
                  <h3 className="font-bold text-xl">Training Sample</h3>
               </div>
               <GlassCard className="p-0 overflow-hidden">
                   {sampleWorkout ? (
                       <>
                         <div className="bg-white/5 p-4 border-b border-white/5">
                            <div className="flex justify-between items-center">
                                <span className="font-bold">{sampleWorkout.focus || "Session"}</span>
                                <Badge variant="purple">{sampleWorkout.durationMinutes || 45} min</Badge>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            {sampleWorkout.exercises?.slice(0, 2).map((ex, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                                <span className="text-sm font-medium">{ex.name}</span>
                                <span className="text-xs text-slate-400">{ex.sets} x {ex.reps}</span>
                                </div>
                            ))}
                        </div>
                       </>
                   ) : (
                       <div className="p-6 text-slate-500 italic">No workout preview available.</div>
                   )}
               </GlassCard>
            </div>
         </div>

         <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center text-slate-400 text-sm">
            <p>This is a temporary preview. To permanently access your full 7-day meal plan, shopping list, and progress tracker, please create an account.</p>
         </div>

         {/* Call to Action */}
         <div className="fixed bottom-0 left-0 w-full p-6 bg-obsidian/90 backdrop-blur-xl border-t border-white/10 z-50">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
               <div className="hidden md:block">
                  <div className="text-sm font-bold text-white">Ready to begin?</div>
                  <div className="text-xs text-slate-400">Save this plan and initialize your dashboard.</div>
               </div>
               <NeonButton onClick={onProceed} className="w-full md:w-auto text-lg px-8 shadow-[0_0_30px_rgba(212,255,0,0.3)]">
                  Save Plan & Create Account <ArrowRight />
               </NeonButton>
            </div>
         </div>
      </div>
    </div>
  );
};