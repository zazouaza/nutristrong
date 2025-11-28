import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useStore';
import { api } from '../services/apiClient';
import { NeonButton } from '../components/DesignSystem';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

// Fix for framer-motion type issues
const MotionDiv = motion.div as any;
const MotionP = motion.p as any;

interface GenerationLoaderProps {
  onComplete: () => void;
  onFail: () => void;
}

export const GenerationLoader: React.FC<GenerationLoaderProps> = ({ onComplete, onFail }) => {
  const { tempProfile, setTempPlan, setPlan, resetOnboarding } = useAppStore();
  const [error, setError] = useState<string | null>(null);
  const [progressStep, setProgressStep] = useState(0);

  const steps = [
    "Analyzing biometrics...",
    "Calculating BMR & TDEE...",
    "Designing Macro Split...",
    "Generating Workout Routine...",
    "Compiling Shopping List..."
  ];

  useEffect(() => {
    // Progress simulation
    const interval = setInterval(() => {
      setProgressStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500); // Slower steps to match longer backend timeout

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const generateAndSave = async () => {
      if (!tempProfile) {
        setError("Missing profile data.");
        return;
      }

      try {
        // 1. Generate Plan (AI)
        const plan = await api.generatePlan(tempProfile);
        
        if (isMounted) {
            setTempPlan(plan);
            
            // 2. Save Plan (DB) - User is authenticated at this stage
            // We use the tempProfile + plan to save to backend
            await api.saveProfilePlan(tempProfile, plan);
            
            // 3. Update main store state and clear temp
            setPlan(plan);
            resetOnboarding();

            // Small delay for UX
            setTimeout(() => {
                if (isMounted) onComplete();
            }, 1000);
        }
      } catch (err: any) {
        if (isMounted) {
            console.error(err);
            setError("The neural engine encountered an anomaly.");
        }
      }
    };

    generateAndSave();

    return () => { isMounted = false; };
  }, [tempProfile, setTempPlan, setPlan, resetOnboarding, onComplete]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-obsidian text-center">
         <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
            <AlertTriangle size={32} />
         </div>
         <h2 className="text-2xl font-bold text-white mb-2">Generation Interrupted</h2>
         <p className="text-slate-400 mb-8 max-w-md">{error} Please try again.</p>
         <div className="flex gap-4">
             <NeonButton variant="ghost" onClick={onFail}>Back to Editing</NeonButton>
             <NeonButton onClick={() => window.location.reload()}>Retry <RefreshCw className="ml-2" size={16} /></NeonButton>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center relative overflow-hidden">
       {/* Pulse Effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 bg-neon-lime/10 rounded-full animate-ping opacity-20 duration-[3000ms]" />
        <div className="w-[500px] h-[500px] bg-neon-blue/10 rounded-full animate-pulse opacity-20 absolute" />
      </div>
      
      <div className="z-10 text-center space-y-12 max-w-lg w-full px-4">
        {/* Loader Graphic */}
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
          <MotionDiv 
            className="absolute inset-0 border-4 border-t-neon-lime border-r-neon-lime border-b-transparent border-l-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <MotionDiv 
            className="absolute inset-4 border-4 border-t-neon-blue border-l-neon-blue border-r-transparent border-b-transparent rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white tracking-wide animate-pulse">Constructing Protocol</h2>
          <div className="h-12 flex items-center justify-center">
             <MotionP 
                key={progressStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-neon-lime font-mono text-sm"
             >
                {">"} {steps[progressStep]}
             </MotionP>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
           <MotionDiv 
              className="h-full bg-gradient-to-r from-neon-lime to-neon-blue"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 15, ease: "linear" }}
           />
        </div>
      </div>
    </div>
  );
};