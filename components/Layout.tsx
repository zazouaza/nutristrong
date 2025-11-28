import React from 'react';
import { 
  Activity, 
  Utensils, 
  Dumbbell, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Zap,
  User
} from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick 
}: { 
  icon: React.ElementType, 
  label: string, 
  isActive: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
      ${isActive 
        ? 'bg-neon-lime/10 text-neon-lime border border-neon-lime/20' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
  >
    <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(212,255,0,0.5)]' : 'group-hover:scale-110'}`} />
    <span className="font-medium tracking-wide text-sm">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, onLogout }) => {
  return (
    <div className="min-h-screen flex bg-obsidian text-slate-100 font-sans selection:bg-neon-lime/30 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col fixed h-full border-r border-white/5 bg-charcoal/50 backdrop-blur-xl z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neon-lime flex items-center justify-center shadow-[0_0_15px_rgba(212,255,0,0.4)]">
            <Zap size={18} className="text-obsidian" strokeWidth={3} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Nutri<span className="text-neon-lime">Strong</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem 
            icon={Activity} 
            label="Dashboard" 
            isActive={currentView === AppView.DASHBOARD} 
            onClick={() => setView(AppView.DASHBOARD)} 
          />
          <NavItem 
            icon={Utensils} 
            label="Meal Plan" 
            isActive={currentView === AppView.MEALS} 
            onClick={() => setView(AppView.MEALS)} 
          />
          <NavItem 
            icon={Dumbbell} 
            label="Workouts" 
            isActive={currentView === AppView.WORKOUTS} 
            onClick={() => setView(AppView.WORKOUTS)} 
          />
          <NavItem 
            icon={ShoppingCart} 
            label="Shopping List" 
            isActive={currentView === AppView.SHOPPING} 
            onClick={() => setView(AppView.SHOPPING)} 
          />
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
           <NavItem 
            icon={User} 
            label="Profile" 
            isActive={currentView === AppView.PROFILE} 
            onClick={() => setView(AppView.PROFILE)} 
          />
           <NavItem 
            icon={Settings} 
            label="Settings" 
            isActive={currentView === AppView.SETTINGS} 
            onClick={() => setView(AppView.SETTINGS)} 
          />
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 relative overflow-y-auto">
        <div className="absolute top-0 left-0 w-full h-96 bg-subtle-mesh opacity-40 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Mobile Nav Overlay (Simplified for brevity) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-charcoal/90 backdrop-blur-xl border-t border-white/10 p-4 flex justify-around z-50">
        <Activity size={24} className={currentView === AppView.DASHBOARD ? 'text-neon-lime' : 'text-slate-500'} onClick={() => setView(AppView.DASHBOARD)} />
        <Utensils size={24} className={currentView === AppView.MEALS ? 'text-neon-lime' : 'text-slate-500'} onClick={() => setView(AppView.MEALS)} />
        <Dumbbell size={24} className={currentView === AppView.WORKOUTS ? 'text-neon-lime' : 'text-slate-500'} onClick={() => setView(AppView.WORKOUTS)} />
        <User size={24} className={currentView === AppView.PROFILE ? 'text-neon-lime' : 'text-slate-500'} onClick={() => setView(AppView.PROFILE)} />
      </div>
    </div>
  );
};