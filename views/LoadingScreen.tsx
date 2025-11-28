import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center relative overflow-hidden">
       {/* Pulse Effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 bg-neon-lime/20 rounded-full animate-ping opacity-20" />
      </div>
      
      <div className="z-10 text-center space-y-8">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-neon-lime border-r-neon-lime border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-wide animate-pulse">Analyzing Bio-Data...</h2>
          <p className="text-slate-500 text-sm">Constructing metabolic profile & training matrix</p>
        </div>
      </div>
    </div>
  );
};
