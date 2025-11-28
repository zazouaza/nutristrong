import React from 'react';
import { PageHeader, GlassCard } from '../components/DesignSystem';
import { useAuthStore } from '../store/useStore';
import { Shield, Mail, Key } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader 
        title="Account Settings" 
        subtitle="Manage your credentials and preferences."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
           <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Shield size={20} className="text-neon-lime" /> Account Info
           </h3>
           <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                 <div className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-2"><Mail size={12} /> Email Address</div>
                 <div className="text-white font-mono">{user?.email || 'user@example.com'}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                 <div className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-2"><Key size={12} /> User ID</div>
                 <div className="text-slate-400 font-mono text-sm">{user?.id || '---'}</div>
              </div>
           </div>
        </GlassCard>

        <GlassCard>
            <h3 className="text-xl font-bold text-white mb-6">Preferences</h3>
            <p className="text-slate-400 text-sm mb-4">
                Application settings and notification preferences are managed here.
                (Currently read-only).
            </p>
             <div className="flex items-center justify-between p-3 border-b border-white/5">
                <span className="text-slate-300">Dark Mode</span>
                <span className="text-neon-lime font-bold text-sm">ALWAYS ON</span>
            </div>
             <div className="flex items-center justify-between p-3 border-b border-white/5">
                <span className="text-slate-300">Units</span>
                <span className="text-white font-bold text-sm">Metric (kg/cm)</span>
            </div>
        </GlassCard>
      </div>
    </div>
  );
};