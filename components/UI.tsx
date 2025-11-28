import React from 'react';

export const Card: React.FC<{ children: React.ReactNode, className?: string, style?: React.CSSProperties }> = ({ children, className = "", style }) => (
  <div className={`glass-panel rounded-2xl p-6 ${className} transition-all duration-300 hover:border-white/20`} style={style}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode, color?: 'lime' | 'blue' | 'purple' }> = ({ children, color = 'lime' }) => {
  const colors = {
    lime: 'bg-neon-lime/10 text-neon-lime border-neon-lime/20',
    blue: 'bg-neon-blue/10 text-neon-blue border-neon-blue/20',
    purple: 'bg-neon-purple/10 text-neon-purple border-neon-purple/20',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[color]} uppercase tracking-wider`}>
      {children}
    </span>
  );
};

export const NeonButton: React.FC<{ 
  onClick?: () => void, 
  children: React.ReactNode, 
  variant?: 'primary' | 'secondary',
  disabled?: boolean,
  className?: string
}> = ({ onClick, children, variant = 'primary', disabled = false, className = '' }) => {
  const baseClass = "px-6 py-3 rounded-xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-neon-lime text-obsidian shadow-[0_0_20px_rgba(212,255,0,0.3)] hover:shadow-[0_0_30px_rgba(212,255,0,0.5)] hover:bg-[#E5FF40] disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 disabled:opacity-50"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClass} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const InputGroup: React.FC<{ 
  label: string, 
  value: string | number, 
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
  type?: string,
  placeholder?: string,
  options?: string[],
  name?: string
}> = ({ label, value, onChange, type = "text", placeholder, options, name }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    {options ? (
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-charcoal/50 border border-white/10 text-white rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:border-neon-lime/50 transition-colors"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
      </div>
    ) : (
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-charcoal/50 border border-white/10 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-neon-lime/50 transition-colors placeholder:text-slate-600"
      />
    )}
  </div>
);

export const StatCard: React.FC<{ label: string, value: string, subtext?: string, icon?: React.ElementType, delay?: number }> = ({ label, value, subtext, icon: Icon, delay = 0 }) => (
  <Card className={`animate-fade-in`} style={{ animationDelay: `${delay}ms` }}>
    <div className="flex justify-between items-start mb-2">
      <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</span>
      {Icon && <Icon size={16} className="text-neon-lime" />}
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    {subtext && <div className="text-xs text-slate-500">{subtext}</div>}
  </Card>
);