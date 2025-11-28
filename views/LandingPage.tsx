import React from 'react';
import { NeonButton, GlassCard } from '../components/DesignSystem';
import { Brain, Dumbbell, Utensils, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
    onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
    return (
        <div className="min-h-screen bg-charcoal text-white overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-neon-purple rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(189,0,255,0.5)]">
                            <Zap className="text-white" fill="currentColor" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter italic">NUTRI<span className="text-neon-purple">STRONG</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={onLogin} className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
                            LOG IN
                        </button>
                        <NeonButton size="sm" onClick={onGetStarted}>
                            GET STARTED
                        </NeonButton>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-neon-purple/20 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-neon-lime animate-pulse" />
                        <span className="text-xs font-bold text-neon-lime tracking-widest uppercase">AI-Powered Evolution</span>
                    </div>

                    <h1 className="text-5xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
                        UNLEASH YOUR <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink">GENETIC POTENTIAL</span>
                    </h1>

                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Stop guessing. Start evolving. NutriStrong analyzes your unique profile to generate hyper-personalized nutrition and training protocols that adapt to your progress in real-time.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <NeonButton size="lg" className="w-full sm:w-auto px-12 h-16 text-lg" onClick={onGetStarted}>
                            START YOUR TRANSFORMATION <ArrowRight className="ml-2" />
                        </NeonButton>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <GlassCard className="p-8 hover:border-neon-blue/50 transition-colors group">
                        <div className="w-16 h-16 rounded-2xl bg-neon-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                            <Brain className="text-neon-blue w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Adaptive AI Intelligence</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Our engine learns from your feedback, adjusting calories and volume weekly to ensure you never hit a plateau.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-8 hover:border-neon-purple/50 transition-colors group">
                        <div className="w-16 h-16 rounded-2xl bg-neon-purple/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                            <Dumbbell className="text-neon-purple w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Hypertrophy Programming</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Science-based split routines designed for maximum muscle fiber recruitment and recovery optimization.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-8 hover:border-neon-lime/50 transition-colors group">
                        <div className="w-16 h-16 rounded-2xl bg-neon-lime/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                            <Utensils className="text-neon-lime w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Precision Nutrition</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Macro-perfect meal plans generated instantly. Swap meals, track intake, and hit your targets effortlessly.
                        </p>
                    </GlassCard>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-20 border-t border-white/5 bg-black/20">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-4">Built for Serious Athletes</h2>
                    <p className="text-slate-500">
                        Join thousands of users who have optimized their performance with NutriStrong.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 border-t border-white/10 text-center text-slate-600 text-sm">
                <p>&copy; {new Date().getFullYear()} NutriStrong AI. All rights reserved.</p>
            </footer>
        </div>
    );
};
