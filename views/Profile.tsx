import React, { useState, useEffect } from 'react';
import { PageHeader, GlassCard, NeonButton, Input, Select } from '../components/DesignSystem';
import { useAuthStore, useAppStore } from '../store/useStore';
import { UserProfile, Gender, GoalType } from '../types';
import { api } from '../services/apiClient';
import { RefreshCw, Save, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Fix for framer-motion type issues
const MotionDiv = motion.div as any;

// Helper to ensure data is clean before sending to backend
const sanitizeProfile = (data: UserProfile): UserProfile => {
  return {
    ...data,
    age: Number(data.age) || 25,
    heightCm: Number(data.heightCm) || 170,
    weightKg: Number(data.weightKg) || 70,
    gender: data.gender || Gender.MALE,
    goal: data.goal || GoalType.LOSE_FAT,
    activityLevel: data.activityLevel || 'Active',
    dietaryRestrictions: data.dietaryRestrictions || '',
    allergies: data.allergies || ''
  };
};

export const ProfileView: React.FC = () => {
  const { profile, setProfile } = useAuthStore();
  const { setPlan } = useAppStore();
  
  // Initialize from global store if available, otherwise defaults
  const [formData, setFormData] = useState<UserProfile>(profile || {
    age: 25,
    gender: Gender.MALE,
    heightCm: 175,
    weightKg: 75,
    goal: GoalType.LOSE_FAT,
    activityLevel: 'Active',
    dietaryRestrictions: '',
    allergies: ''
  });

  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!profile); // Only load if no profile
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  // Fetch latest data on mount to ensure we have the DB version
  useEffect(() => {
    let isMounted = true;
    const fetchProfileData = async () => {
      try {
        const data = await api.getProfile();
        if (isMounted && data) {
          console.log("Profile Data Fetched:", data);
          setProfile(data);
          setFormData(data);
        }
      } catch (error) {
        console.error("Failed to load profile data", error);
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    };

    fetchProfileData();

    return () => { isMounted = false; };
  }, [setProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'age' || name === 'heightCm' || name === 'weightKg') ? value : value
    }));
  };

  const handleSaveAndRegenerate = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // Clean the data first
      const cleanData = sanitizeProfile(formData);

      // 1. Generate new plan based on updated profile
      const newPlan = await api.generatePlan(cleanData);
      
      // 2. Save profile and plan to backend
      await api.saveProfilePlan(cleanData, newPlan);
      
      // 3. Update global state
      setProfile(cleanData);
      setPlan(newPlan);
      
      setMessage({ type: 'success', text: 'Profile updated and new plan generated successfully!' });
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message && error.message.includes('connect to server') 
        ? 'Could not connect to backend. Is the server running on port 3001?' 
        : (error.message || 'Failed to update. Please try again.');
        
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-neon-lime" size={48} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <PageHeader 
        title="Physiological Profile" 
        subtitle="Update your biometrics to recalibrate the AI engine."
      />

      {message && (
        <MotionDiv 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border flex items-center gap-3 ${message.type === 'success' ? 'bg-neon-lime/10 border-neon-lime text-neon-lime' : 'bg-red-500/10 border-red-500 text-red-500'}`}
        >
            {message.type === 'error' && <AlertTriangle size={18} />}
            {message.text}
        </MotionDiv>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard>
           <h3 className="text-xl font-bold text-white mb-6">Biometrics</h3>
           <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
                 <Select 
                    label="Gender" 
                    name="gender" 
                    options={Object.values(Gender)} 
                    value={formData.gender} 
                    onChange={handleChange} 
                 />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <Input label="Height (cm)" name="heightCm" type="number" value={formData.heightCm} onChange={handleChange} />
                 <Input label="Weight (kg)" name="weightKg" type="number" value={formData.weightKg} onChange={handleChange} />
              </div>
           </div>
        </GlassCard>

        <GlassCard>
           <h3 className="text-xl font-bold text-white mb-6">Objectives & Lifestyle</h3>
           <div className="space-y-4">
              <Select 
                 label="Primary Goal" 
                 name="goal" 
                 options={Object.values(GoalType)} 
                 value={formData.goal} 
                 onChange={handleChange} 
              />
              <Select 
                 label="Activity Level" 
                 name="activityLevel" 
                 options={['Sedentary', 'Lightly Active', 'Active', 'Athlete']} 
                 value={formData.activityLevel} 
                 onChange={handleChange} 
              />
           </div>
        </GlassCard>

        <GlassCard className="md:col-span-2">
           <h3 className="text-xl font-bold text-white mb-6">Nutrition Constraints</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                 label="Dietary Preferences" 
                 name="dietaryRestrictions" 
                 placeholder="e.g. Keto, Vegan" 
                 value={formData.dietaryRestrictions || ''} 
                 onChange={handleChange} 
              />
              <Input 
                 label="Allergies" 
                 name="allergies" 
                 placeholder="e.g. Peanuts, Dairy" 
                 value={formData.allergies || ''} 
                 onChange={handleChange} 
              />
           </div>
        </GlassCard>
      </div>

      <div className="flex justify-end pt-4">
         <NeonButton onClick={handleSaveAndRegenerate} loading={loading} size="lg">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} /> Update & Regenerate Plan
         </NeonButton>
      </div>
    </div>
  );
};