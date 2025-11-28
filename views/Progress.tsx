import React from 'react';
import { PageHeader, GlassCard, NeonButton } from '../components/DesignSystem';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Camera, Ruler, Plus, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Fix for framer-motion type issues
const MotionDiv = motion.div as any;

const data = [
  { name: 'Wk 1', weight: 80 },
  { name: 'Wk 2', weight: 79.5 },
  { name: 'Wk 3', weight: 78.8 },
  { name: 'Wk 4', weight: 78.2 },
  { name: 'Wk 5', weight: 77.5 },
  { name: 'Wk 6', weight: 76.8 },
  { name: 'Wk 7', weight: 76.2 },
];

export const ProgressView: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader 
        title="Evolution Metrics" 
        subtitle="Visualizing your physiological adaptation."
        action={
          <NeonButton variant="secondary" size="sm">
            <Share2 size={16} /> Share Report
          </NeonButton>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Graph */}
        <GlassCard className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Body Mass Trajectory</h3>
            <div className="flex gap-2">
               <span className="text-xs font-bold px-2 py-1 bg-white/5 rounded text-slate-400">1M</span>
               <span className="text-xs font-bold px-2 py-1 bg-neon-lime/20 text-neon-lime rounded">3M</span>
               <span className="text-xs font-bold px-2 py-1 bg-white/5 rounded text-slate-400">ALL</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4FF00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4FF00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F1115', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#D4FF00' }}
                />
                <Area type="monotone" dataKey="weight" stroke="#D4FF00" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Quick Actions & Recent */}
        <div className="space-y-6">
           <GlassCard className="bg-gradient-to-br from-neon-blue/10 to-transparent border-neon-blue/20">
              <h3 className="text-lg font-bold text-white mb-4">Update Metrics</h3>
              <div className="space-y-3">
                 <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue group-hover:scale-110 transition-transform">
                       <Ruler size={20} />
                    </div>
                    <div className="text-left">
                       <div className="text-sm font-bold text-white">Log Measurements</div>
                       <div className="text-xs text-slate-400">Update waist, chest, arms</div>
                    </div>
                    <Plus size={16} className="ml-auto text-slate-500" />
                 </button>
                 
                 <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple group-hover:scale-110 transition-transform">
                       <Camera size={20} />
                    </div>
                    <div className="text-left">
                       <div className="text-sm font-bold text-white">Upload Physique Photo</div>
                       <div className="text-xs text-slate-400">AI Body Fat Analysis</div>
                    </div>
                    <Plus size={16} className="ml-auto text-slate-500" />
                 </button>
              </div>
           </GlassCard>

           <GlassCard>
              <h3 className="text-lg font-bold text-white mb-4">AI Insight</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                 Based on your trend, you are losing approximately <span className="text-neon-lime font-bold">0.6kg</span> per week. This is an optimal rate for muscle retention. Suggested: Increase protein by 10g/day to further support recovery.
              </p>
           </GlassCard>
        </div>
      </div>
      
      {/* Gallery Placeholder */}
      <h3 className="text-xl font-bold text-white mt-8 mb-4">Physique Timeline</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[1,2,3,4].map(i => (
            <MotionDiv 
               key={i} 
               whileHover={{ scale: 1.05 }}
               className="aspect-[3/4] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative group overflow-hidden cursor-pointer"
            >
               <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-all" />
               <Camera className="text-slate-600 group-hover:text-white transition-colors" size={32} />
               <div className="absolute bottom-3 left-3 text-xs font-bold text-slate-400 group-hover:text-neon-lime">Oct {10 + i}</div>
            </MotionDiv>
         ))}
      </div>
    </div>
  );
};