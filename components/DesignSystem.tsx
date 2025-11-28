import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { X, Loader2 } from 'lucide-react';

// Fix for framer-motion type issues
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;
const MotionH1 = motion.h1 as any;
const MotionP = motion.p as any;

// --- Base Components ---

export const GlassCard: React.FC<{ 
  children: React.ReactNode, 
  className?: string,
  onClick?: () => void
}> = ({ children, className, onClick }) => (
  <MotionDiv 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "glass-panel rounded-3xl p-6 relative overflow-hidden transition-all duration-300",
      "hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]",
      className
    )}
    onClick={onClick}
  >
    {children}
  </MotionDiv>
);

export const NeonButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}> = ({ children, variant = 'primary', size = 'md', className, onClick, disabled, loading, type = "button" }) => {
  const variants = {
    primary: "bg-neon-lime text-obsidian shadow-[0_0_20px_rgba(212,255,0,0.4)] hover:shadow-[0_0_30px_rgba(212,255,0,0.6)] hover:bg-[#E5FF40]",
    secondary: "bg-white/10 text-white border border-white/10 hover:bg-white/20 hover:border-white/30",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <MotionButton
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "rounded-xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {loading && <Loader2 className="animate-spin" size={16} />}
      {children}
    </MotionButton>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className, value, ...props }) => (
  <div className="space-y-2">
    {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
    <input
      value={value ?? ''} // Ensure value is never null/undefined
      className={cn(
        "w-full bg-charcoal/50 border border-white/10 text-white rounded-xl px-4 py-3.5",
        "focus:outline-none focus:border-neon-lime/50 focus:ring-1 focus:ring-neon-lime/50",
        "transition-all duration-300 placeholder:text-slate-600",
        className
      )}
      {...props}
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string, options: string[] }> = ({ label, options, className, ...props }) => (
  <div className="space-y-2">
    {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
    <div className="relative">
      <select
        className={cn(
          "w-full bg-charcoal/50 border border-white/10 text-white rounded-xl px-4 py-3.5 appearance-none",
          "focus:outline-none focus:border-neon-lime/50 focus:ring-1 focus:ring-neon-lime/50",
          "transition-all duration-300",
          className
        )}
        {...props}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
    </div>
  </div>
);

// --- Structural Components ---

export const Badge: React.FC<{ children: React.ReactNode, variant?: 'lime' | 'blue' | 'purple' | 'red', className?: string }> = ({ children, variant = 'lime', className }) => {
  const styles = {
    lime: 'bg-neon-lime/10 text-neon-lime border-neon-lime/20',
    blue: 'bg-neon-blue/10 text-neon-blue border-neon-blue/20',
    purple: 'bg-neon-purple/10 text-neon-purple border-neon-purple/20',
    red: 'bg-red-500/10 text-red-500 border-red-500/20'
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider", styles[variant], className)}>
      {children}
    </span>
  );
};

export const Tabs: React.FC<{ 
  tabs: string[], 
  activeTab: string, 
  onChange: (tab: string) => void 
}> = ({ tabs, activeTab, onChange }) => (
  <div className="flex bg-charcoal/50 p-1 rounded-xl border border-white/10 w-fit">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={cn(
          "px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden",
          activeTab === tab ? "text-white shadow-lg" : "text-slate-400 hover:text-white"
        )}
      >
        {activeTab === tab && (
          <MotionDiv 
            layoutId="activeTab"
            className="absolute inset-0 bg-white/10 rounded-lg"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative z-10">{tab}</span>
      </button>
    ))}
  </div>
);

export const Modal: React.FC<{ 
  isOpen: boolean, 
  onClose: () => void, 
  children: React.ReactNode,
  title?: string 
}> = ({ isOpen, onClose, children, title }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <MotionDiv 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          onClick={onClose}
        />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <MotionDiv 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-lg glass-panel rounded-3xl p-8 pointer-events-auto border-neon-lime/20 box-shadow-glow"
          >
            <div className="flex justify-between items-center mb-6">
              {title && <h3 className="text-xl font-bold text-white">{title}</h3>}
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            {children}
          </MotionDiv>
        </div>
      </>
    )}
  </AnimatePresence>
);

export const PageHeader: React.FC<{ title: string, subtitle?: string, action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
    <div>
      <MotionH1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl font-bold text-white tracking-tight"
      >
        {title}
      </MotionH1>
      {subtitle && (
        <MotionP 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 mt-2"
        >
          {subtitle}
        </MotionP>
      )}
    </div>
    {action && (
      <MotionDiv
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {action}
      </MotionDiv>
    )}
  </div>
);