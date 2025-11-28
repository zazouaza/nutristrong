import React, { useState } from 'react';
import { ComprehensivePlan, DailyMealPlan } from '../types';
import { GlassCard, PageHeader, NeonButton, Tabs, Modal, Badge } from '../components/DesignSystem';
import { Clock, RefreshCw } from 'lucide-react';

export const MealsView: React.FC<{ plan: ComprehensivePlan }> = ({ plan }) => {
  const safeMeals = plan.weeklyMeals && plan.weeklyMeals.length > 0 
    ? plan.weeklyMeals.filter(m => !!m) 
    : [];

  if (safeMeals.length === 0) {
      safeMeals.push({ dayName: 'Monday', breakfast: null, lunch: null, dinner: null, snack: null } as unknown as DailyMealPlan);
  }

  const [activeDay, setActiveDay] = useState(safeMeals[0].dayName);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const currentMealPlan = safeMeals.find(d => d.dayName === activeDay) || safeMeals[0];
  const dayNames = safeMeals.map(d => d.dayName);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader 
         title="Nutrition Protocol" 
         subtitle="Precision fueling for optimal performance."
         action={
            <NeonButton variant="secondary" onClick={() => setIsRegenerating(true)}>
               <RefreshCw size={16} /> Regenerate
            </NeonButton>
         }
      />

      <Tabs tabs={dayNames} activeTab={activeDay} onChange={setActiveDay} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
         {['breakfast', 'lunch', 'dinner', 'snack'].map((type, idx) => {
            const meal = currentMealPlan ? currentMealPlan[type as keyof DailyMealPlan] : null;
            // Handle if meal is missing or struct is incomplete
            if (typeof meal === 'string' || !meal || !meal.macros) {
                return (
                    <GlassCard key={idx} className="group border-l-4 border-l-white/10 opacity-50">
                        <Badge variant="lime" className="mb-2">{type}</Badge>
                        <p className="text-slate-500">No meal assigned.</p>
                    </GlassCard>
                );
            }

            return (
               <GlassCard key={idx} className="group border-l-4 border-l-neon-lime hover:border-l-neon-blue">
                  <div className="flex justify-between items-start mb-4">
                     <Badge variant="lime">{type}</Badge>
                     <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                        <Clock size={12} />
                        <span>{meal.calories} kcal</span>
                     </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-lime transition-colors">
                     {meal.name}
                  </h3>
                  
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                     {meal.ingredients?.join(' • ')}
                  </p>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                     <div className="text-center">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Protein</div>
                        <div className="text-sm font-bold text-white">{meal.macros.protein}g</div>
                     </div>
                     <div className="w-px h-8 bg-white/10" />
                     <div className="text-center">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Carbs</div>
                        <div className="text-sm font-bold text-white">{meal.macros.carbs}g</div>
                     </div>
                     <div className="w-px h-8 bg-white/10" />
                     <div className="text-center">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Fats</div>
                        <div className="text-sm font-bold text-white">{meal.macros.fats}g</div>
                     </div>
                  </div>
               </GlassCard>
            );
         })}
      </div>

      <Modal isOpen={isRegenerating} onClose={() => setIsRegenerating(false)} title="Regenerate Protocol">
         <p className="text-slate-400 mb-6">
            Adjust your preferences to generate a new nutrition strategy. This will replace the current week's plan.
         </p>
         <div className="flex justify-end gap-4">
            <NeonButton variant="ghost" onClick={() => setIsRegenerating(false)}>Cancel</NeonButton>
            <NeonButton onClick={() => setIsRegenerating(false)}>Confirm Generation</NeonButton>
         </div>
      </Modal>
    </div>
  );
};