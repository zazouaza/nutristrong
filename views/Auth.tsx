import React, { useState } from 'react';
import { useAuthStore } from '../store/useStore';
import { GlassCard, NeonButton, Input } from '../components/DesignSystem';
import { Zap, ArrowRight, Lock, Mail, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { api } from '../services/apiClient';

// Fix for framer-motion type issues
const MotionDiv = motion.div as any;

interface AuthProps {
  mode: 'login' | 'register';
  onSuccess: () => void;
  onRegisterClick?: () => void; // Used in Login mode to go to Onboarding
  onLoginClick?: () => void;    // Used in Register mode to go to Login
}

export const AuthView: React.FC<AuthProps> = ({ mode, onSuccess, onRegisterClick, onLoginClick }) => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        // --- LOGIN ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        
        if (data.session) {
           login(data.user);
           api.setToken(data.session.access_token);
           onSuccess(); 
        }
      } else {
        // --- REGISTER ---
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        
        if (data.session) {
           login(data.user);
           api.setToken(data.session.access_token);
           onSuccess(); // Goes to Generation
        } else if (data.user && !data.session) {
            setError("Please check your email to confirm your account.");
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-obsidian relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[100%] bg-neon-lime/5 blur-[150px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-50%] right-[-20%] w-[100%] h-[100%] bg-neon-purple/5 blur-[150px] rounded-full animate-pulse pointer-events-none" />

      <MotionDiv 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-neon-lime rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(212,255,0,0.3)]">
            <Zap size={32} className="text-obsidian" strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tighter mb-2">
            Nutri<span className="text-neon-lime">Strong</span>
          </h1>
          <p className="text-slate-400">The operating system for your body.</p>
        </div>

        <GlassCard className="border-t-4 border-t-neon-lime">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
                {mode === 'login' ? 'Welcome Back' : 'Final Step'}
            </h2>
            <p className="text-slate-400 text-sm">
                {mode === 'login' 
                    ? 'Enter your credentials to access your dashboard.' 
                    : 'Create your account to generate and save your personalized plan.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
            
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <Input 
                  placeholder="Email Address" 
                  className="pl-12" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <Input 
                  placeholder="Password" 
                  className="pl-12" 
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <NeonButton type="submit" className="w-full mt-6" loading={loading}>
              {mode === 'login' ? 'Initialize Session' : 'Generate My Plan'} <ArrowRight size={18} />
            </NeonButton>
          </form>

          <div className="mt-6 text-center">
             {mode === 'login' ? (
                 <button onClick={onRegisterClick} className="text-slate-400 hover:text-white text-sm transition-colors">
                    Don't have an account? <span className="text-neon-lime font-bold">Start Onboarding</span>
                 </button>
             ) : (
                 <button onClick={onLoginClick} className="text-slate-400 hover:text-white text-sm transition-colors">
                    Already have an account? <span className="text-neon-lime font-bold">Log In</span>
                 </button>
             )}
          </div>
        </GlassCard>
      </MotionDiv>
    </div>
  );
};