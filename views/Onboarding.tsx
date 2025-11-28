import React, { useState, useEffect } from 'react';
import { UserProfile, Gender, GoalType } from '../types';
import { NeonButton, GlassCard } from '../components/DesignSystem';
import { Zap, Activity, Flame, Dumbbell, ChevronRight, Scale, Ruler, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useStore';

// Fix for framer-motion type issues
const MotionDiv = motion.div as any;

interface OnboardingProps {
  onComplete: () => void; // Triggered after lifestyle, goes to Register
  onLoginClick: () => void; // Goes to Login
}

const STEPS = {
  PHYSICAL: 1,
  GOALS: 2,
  LIFESTYLE: 3
};

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onLoginClick }) => {
  const [step, setStep] = useState(STEPS.PHYSICAL);
  const { tempProfile, setTempProfile } = useAppStore();
  
  // Initialize local state from persisted store or defaults
  const [profile, setProfile] = useState<UserProfile>(tempProfile || {
    age: 25,
    gender: Gender.MALE,
    heightCm: 175,
    weightKg: 75,
    goal: GoalType.LOSE_FAT,
    activityLevel: 'Active',
    dietaryRestrictions: '',
    allergies: ''
  });

  // Sync back to store whenever profile changes
  useEffect(() => {
    setTempProfile(profile);
  }, [profile, setTempProfile]);

  const handleNext = () => {
    if (step < STEPS.LIFESTYLE) {
      setStep(step + 1);
    } else {
      onComplete(); // Transition to Register view
    }
  };

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const variants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-obsidian relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon-lime/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neon-blue/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header with Login Link */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neon-lime flex items-center justify-center">
              <Zap size={18} className="text-obsidian" strokeWidth={3} />
            </div>
            <span className="font-bold text-white tracking-wide hidden md:inline">NutriStrong AI</span>
         </div>
         <button onClick={onLoginClick} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            Already have an account? <span className="text-neon-lime">Log In</span> <LogIn size={16} />
         </button>
      </div>

      <div className="w-full max-w-2xl z-10 mt-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-white tracking-wide uppercase text-sm">Calibration Sequence</span>
            <span className="text-neon-lime font-mono">0{step} / 03</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <MotionDiv 
                className="h-full bg-neon-lime shadow-[0_0_10px_rgba(212,255,0,0.5)]"
                initial={{ width: '0%' }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === STEPS.PHYSICAL && (
            <MotionDiv key="physical" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-8">
              <div className="text-center mb-8">
                 <h2 className="text-4xl font-bold text-white mb-2">Biometrics</h2>
                 <p className="text-slate-400">Calibrating physiological baseline.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Height */}
                 <GlassCard className="p-8 flex flex-col items-center justify-center relative group hover:border-neon-lime/30">
                    <Ruler size={32} className="text-slate-500 mb-4 group-hover:text-neon-lime transition-colors" />
                    <div className="text-5xl font-bold text-white mb-2">{profile.heightCm} <span className="text-lg text-slate-500">cm</span></div>
                    <input 
                      type="range" min="140" max="220" value={profile.heightCm} 
                      onChange={(e) => updateProfile('heightCm', Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neon-lime mt-4"
                    />
                    <label className="text-xs font-bold text-slate-500 uppercase mt-4 tracking-widest">Height</label>
                 </GlassCard>

                 {/* Weight */}
                 <GlassCard className="p-8 flex flex-col items-center justify-center relative group hover:border-neon-blue/30">
                    <Scale size={32} className="text-slate-500 mb-4 group-hover:text-neon-blue transition-colors" />
                    <div className="text-5xl font-bold text-white mb-2">{profile.weightKg} <span className="text-lg text-slate-500">kg</span></div>
                    <input 
                      type="range" min="40" max="150" value={profile.weightKg} 
                      onChange={(e) => updateProfile('weightKg', Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neon-blue mt-4"
                    />
                    <label className="text-xs font-bold text-slate-500 uppercase mt-4 tracking-widest">Weight</label>
                 </GlassCard>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <GlassCard className="p-4">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Gender</label>
                    <div className="flex gap-2">
                       {Object.values(Gender).map(g => (
                          <button
                             key={g}
                             onClick={() => updateProfile('gender', g)}
                             className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${profile.gender === g ? 'bg-white text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                          >
                             {g}
                          </button>
                       ))}
                    </div>
                 </GlassCard>
                 <GlassCard className="p-4 flex flex-col justify-center">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Age</label>
                    <input 
                       type="number" value={profile.age} onChange={(e) => updateProfile('age', Number(e.target.value))}
                       className="bg-transparent text-3xl font-bold text-white focus:outline-none w-full border-b border-white/10 focus:border-neon-lime pb-2 transition-colors"
                    />
                 </GlassCard>
              </div>

              <NeonButton onClick={handleNext} className="w-full py-6 text-lg">Next Phase <ChevronRight /></NeonButton>
            </MotionDiv>
          )}

          {step === STEPS.GOALS && (
            <MotionDiv key="goals" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-8">
               <div className="text-center mb-8">
                 <h2 className="text-4xl font-bold text-white mb-2">Objectives</h2>
                 <p className="text-slate-400">Define your target outcome.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 {[
                    { type: GoalType.LOSE_FAT, icon: Flame, desc: "Maximize caloric burn, retain lean mass.", color: "text-orange-500", border: "hover:border-orange-500/50" },
                    { type: GoalType.GAIN_MUSCLE, icon: Dumbbell, desc: "Hypertrophy focused surplus & volume.", color: "text-neon-lime", border: "hover:border-neon-lime/50" },
                    { type: GoalType.MAINTAIN, icon: Activity, desc: "Metabolic homeostasis & conditioning.", color: "text-neon-blue", border: "hover:border-neon-blue/50" },
                    { type: GoalType.ATHLETIC_PERFORMANCE, icon: Zap, desc: "Explosive power & endurance optimization.", color: "text-neon-purple", border: "hover:border-neon-purple/50" },
                 ].map((goal) => (
                    <button
                       key={goal.type}
                       onClick={() => updateProfile('goal', goal.type)}
                       className={`w-full p-6 rounded-2xl border transition-all duration-300 flex items-center gap-6 text-left group relative overflow-hidden
                          ${profile.goal === goal.type 
                             ? 'bg-white/10 border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                             : `bg-white/5 border-white/5 text-slate-400 ${goal.border} hover:bg-white/10`
                          }`}
                    >
                       <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center ${goal.color} ${profile.goal === goal.type ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                          <goal.icon size={24} />
                       </div>
                       <div>
                          <h3 className={`text-lg font-bold ${profile.goal === goal.type ? 'text-white' : 'text-slate-200'}`}>{goal.type}</h3>
                          <p className="text-sm text-slate-500">{goal.desc}</p>
                       </div>
                    </button>
                 ))}
              </div>

              <div className="flex gap-4">
                 <NeonButton variant="ghost" onClick={() => setStep(step - 1)} className="flex-1">Back</NeonButton>
                 <NeonButton onClick={handleNext} className="flex-[2] py-6 text-lg">Next Phase <ChevronRight /></NeonButton>
              </div>
            </MotionDiv>
          )}

          {step === STEPS.LIFESTYLE && (
             <MotionDiv key="lifestyle" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-8">
               <div className="text-center mb-8">
                 <h2 className="text-4xl font-bold text-white mb-2">Lifestyle Matrix</h2>
                 <p className="text-slate-400">Calculating Total Daily Energy Expenditure (TDEE).</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  {['Sedentary', 'Lightly Active', 'Active', 'Athlete'].map((level) => (
                     <button
                        key={level}
                        onClick={() => updateProfile('activityLevel', level)}
                        className={`p-6 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-3
                           ${profile.activityLevel === level 
                              ? 'bg-neon-lime/10 border-neon-lime text-neon-lime' 
                              : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                           }`}
                     >
                        <Activity size={32} className={profile.activityLevel === level ? 'animate-pulse' : ''} />
                        <span className="font-bold">{level}</span>
                     </button>
                  ))}
               </div>

               <GlassCard className="p-6">
                  <h3 className="font-bold text-white mb-4">Dietary Constraints</h3>
                  <div className="space-y-4">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Preferences</label>
                        <input 
                           placeholder="e.g. Keto, Vegan, Paleo..." 
                           value={profile.dietaryRestrictions}
                           onChange={(e) => updateProfile('dietaryRestrictions', e.target.value)}
                           className="w-full bg-charcoal/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-neon-lime outline-none transition-colors"
                        />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Allergies</label>
                        <input 
                           placeholder="e.g. Peanuts, Shellfish..." 
                           value={profile.allergies}
                           onChange={(e) => updateProfile('allergies', e.target.value)}
                           className="w-full bg-charcoal/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-neon-lime outline-none transition-colors"
                        />
                     </div>
                  </div>
               </GlassCard>

               <div className="flex gap-4">
                 <NeonButton variant="ghost" onClick={() => setStep(step - 1)} className="flex-1">Back</NeonButton>
                 <NeonButton onClick={handleNext} className="flex-[2] py-6 text-lg">Next: Create Account <ChevronRight /></NeonButton>
              </div>
             </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};