import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile, ComprehensivePlan } from '../types';

interface AuthState {
  user: any | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  login: (user: any) => void;
  logout: () => void;
  setProfile: (profile: UserProfile) => void;
}

interface AppState {
  // Persisted Onboarding Data
  tempProfile: UserProfile | null;
  tempPlan: ComprehensivePlan | null;
  
  // Real App Data (hydrated from DB)
  plan: ComprehensivePlan | null;

  // Actions
  setTempProfile: (profile: UserProfile) => void;
  setTempPlan: (plan: ComprehensivePlan) => void;
  setPlan: (plan: ComprehensivePlan) => void;
  resetOnboarding: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, profile: null, isAuthenticated: false }),
  setProfile: (profile) => set({ profile }),
}));

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      tempProfile: null,
      tempPlan: null,
      plan: null,
      setTempProfile: (profile) => set({ tempProfile: profile }),
      setTempPlan: (plan) => set({ tempPlan: plan }),
      setPlan: (plan) => set({ plan }),
      resetOnboarding: () => set({ tempProfile: null, tempPlan: null }),
    }),
    {
      name: 'nutristrong-onboarding-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);