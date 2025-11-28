import React, { useState, useEffect } from 'react';
import { ComprehensivePlan, DailyWorkout, Exercise } from '../types';
import { GlassCard, NeonButton, PageHeader, Badge } from '../components/DesignSystem';
import { Timer, CheckCircle, Circle, Play, Pause, RotateCcw, ArrowLeft, Dumbbell } from 'lucide-react';

interface ActiveSessionViewProps {
    plan: ComprehensivePlan;
    onExit: () => void;
}

export const ActiveSessionView: React.FC<ActiveSessionViewProps> = ({ plan, onExit }) => {
    // Determine today's workout
    // In a real app, this would use the actual date. For now, we default to the first one or a "Today" logic.
    const todayWorkout = (plan.weeklyWorkouts && plan.weeklyWorkouts.length > 0)
        ? plan.weeklyWorkouts[0]
        : { dayName: 'Today', focus: 'Rest', durationMinutes: 0, exercises: [] as Exercise[] };

    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [completedExercises, setCompletedExercises] = useState<number[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleExercise = (index: number) => {
        setCompletedExercises(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const progress = todayWorkout.exercises.length > 0
        ? Math.round((completedExercises.length / todayWorkout.exercises.length) * 100)
        : 0;

    return (
        <div className="animate-fade-in space-y-6 pb-20">
            {/* Header / Timer Bar */}
            <div className="sticky top-0 z-50 bg-charcoal/90 backdrop-blur-md border-b border-white/10 -mx-4 px-4 py-4 mb-6 flex justify-between items-center">
                <button onClick={onExit} className="text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </button>

                <div className="flex flex-col items-center">
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Session Time</div>
                    <div className="text-3xl font-black text-white font-mono">{formatTime(elapsedSeconds)}</div>
                </div>

                <div className="w-6" /> {/* Spacer for centering */}
            </div>

            <div className="flex justify-between items-end px-2">
                <div>
                    <Badge variant="purple" className="mb-2">{todayWorkout.dayName}</Badge>
                    <h1 className="text-3xl font-bold text-white">{todayWorkout.focus}</h1>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-neon-purple">{progress}%</div>
                    <div className="text-xs text-slate-500 uppercase">Complete</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className="h-full bg-neon-purple transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Exercises List */}
            <div className="space-y-4">
                {todayWorkout.exercises.map((ex, idx) => {
                    const isCompleted = completedExercises.includes(idx);
                    return (
                        <GlassCard
                            key={idx}
                            className={`transition-all duration-300 ${isCompleted ? 'opacity-50 border-neon-purple/20 bg-neon-purple/5' : ''}`}
                            onClick={() => toggleExercise(idx)}
                        >
                            <div className="flex items-start gap-4 cursor-pointer">
                                <div className={`mt-1 transition-colors ${isCompleted ? 'text-neon-purple' : 'text-slate-600'}`}>
                                    {isCompleted ? <CheckCircle size={24} fill="currentColor" className="text-neon-purple" /> : <Circle size={24} />}
                                </div>

                                <div className="flex-1">
                                    <h3 className={`text-lg font-bold ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                                        {ex.name}
                                    </h3>
                                    <div className="flex gap-4 mt-2 text-sm">
                                        <span className="text-slate-400"><strong className="text-slate-200">{ex.sets}</strong> Sets</span>
                                        <span className="text-slate-400"><strong className="text-slate-200">{ex.reps}</strong> Reps</span>
                                    </div>
                                    {ex.description && (
                                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{ex.description}</p>
                                    )}
                                </div>
                            </div>
                        </GlassCard>
                    );
                })}

                {todayWorkout.exercises.length === 0 && (
                    <div className="text-center py-10 text-slate-500">
                        <Dumbbell size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No exercises scheduled for this session.</p>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-charcoal/90 backdrop-blur-md border-t border-white/10 flex gap-4 justify-center">
                <NeonButton
                    variant="secondary"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="w-16 h-16 rounded-full flex items-center justify-center p-0"
                >
                    {isTimerRunning ? <Pause size={24} /> : <Play size={24} />}
                </NeonButton>

                <NeonButton
                    className="flex-1 h-16 text-lg font-bold uppercase tracking-widest"
                    onClick={onExit}
                >
                    Finish Session
                </NeonButton>
            </div>
        </div>
    );
};
