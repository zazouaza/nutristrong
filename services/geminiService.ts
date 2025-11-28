import { UserProfile, ComprehensivePlan } from "../types";
import { api } from "./apiClient";

export const generatePlan = async (profile: UserProfile): Promise<ComprehensivePlan> => {
  // In a real scenario, we get the token from Supabase Auth state
  // const session = supabase.auth.getSession();
  // api.setToken(session.access_token);
  
  // For now, assuming the backend might allow unauthenticated gen or handles dev mode
  // Or assuming the user is already logged in via the Auth flow.
  
  try {
    const plan = await api.generatePlan(profile);
    return plan;
  } catch (error) {
    console.error("Backend Generation Error:", error);
    throw error;
  }
};