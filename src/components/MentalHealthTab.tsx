import React, { useState, useEffect } from 'react';
import { HeartPulse, Brain, Eye, Sparkles, AlertCircle, Play, Pause, CheckCircle2, Moon, Sun, ArrowRight, ShieldCheck } from 'lucide-react';
import { MentalHealthInsight } from '../types';
import { MENTAL_HEALTH_INSIGHTS } from '../data/mockData';

interface MentalHealthTabProps {
  totalMinutesUsed: number;
  pickups: number;
  socialMinutes: number;
  onNavigateToLimits: () => void;
}

export const MentalHealthTab: React.FC<MentalHealthTabProps> = ({
  totalMinutesUsed,
  pickups,
  socialMinutes,
  onNavigateToLimits,
}) => {
  // Box Breathing State
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(120); // 2 minutes
  const [phaseSeconds, setPhaseSeconds] = useState(4); // 4-4-4-4 technique

  // Eye Rest State
  const [isEyeRestActive, setIsEyeRestActive] = useState(false);
  const [eyeRestSeconds, setEyeRestSeconds] = useState(20);

  // Box Breathing Loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isBreathingActive && breathSecondsLeft > 0) {
      interval = setInterval(() => {
        setBreathSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsBreathingActive(false);
            return 0;
          }
          return prev - 1;
        });

        setPhaseSeconds((prev) => {
          if (prev <= 1) {
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'Inhale') return 'Hold';
              if (currentPhase === 'Hold') return 'Exhale';
              if (currentPhase === 'Exhale') return 'Rest';
              return 'Inhale';
            });
            return 4; // Reset phase counter to 4 seconds
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathingActive, breathSecondsLeft]);

  // Eye Rest Loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isEyeRestActive && eyeRestSeconds > 0) {
      interval = setInterval(() => {
        setEyeRestSeconds((prev) => {
          if (prev <= 1) {
            setIsEyeRestActive(false);
            return 20;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEyeRestActive, eyeRestSeconds]);

  // Dynamic Wellbeing Score calculation (100 base)
  let wellbeingScore = 100;
  if (totalMinutesUsed > 240) wellbeingScore -= 25;
  else if (totalMinutesUsed > 180) wellbeingScore -= 15;
  if (pickups > 60) wellbeingScore -= 20;
  if (socialMinutes > 90) wellbeingScore -= 20;
  wellbeingScore = Math.max(wellbeingScore, 20);

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Mental Health & Digital Wellbeing Hub</h2>
              <p className="text-xs text-slate-400">
                Pattern-based psychological insights, dopamine regulation tools, and eye strain relief.
              </p>
            </div>
          </div>

          {/* Score Badge */}
          <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <Brain className="w-5 h-5 text-indigo-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Digital Wellbeing Score</div>
              <div className="text-lg font-bold text-white">
                {wellbeingScore}/100{' '}
                <span className={`text-xs font-semibold ${
                  wellbeingScore >= 80 ? 'text-emerald-400' : wellbeingScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  ({wellbeingScore >= 80 ? 'Optimal' : wellbeingScore >= 60 ? 'Moderate Fatigue' : 'High Screen Overload'})
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Excessive screen time disrupts sleep-regulating melatonin, triggers cortisol spikes from continuous task notifications, and weakens sustained attention spans. Use these pattern-driven tools to protect your mental focus and emotional calm.
        </p>
      </div>

      {/* Interactive Wellbeing Tools: Box Breathing & Eye Rest */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tool 1: 2-Minute Box Breathing Exercise */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-slate-100 text-sm">2-Minute Box Breathing</h3>
                <p className="text-[11px] text-slate-400">4s Inhale • 4s Hold • 4s Exhale • 4s Hold</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (isBreathingActive) {
                  setIsBreathingActive(false);
                } else {
                  setBreathSecondsLeft(120);
                  setPhaseSeconds(4);
                  setBreathPhase('Inhale');
                  setIsBreathingActive(true);
                }
              }}
              className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition ${
                isBreathingActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
              }`}
            >
              {isBreathingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isBreathingActive ? 'Pause' : 'Start Session'}</span>
            </button>
          </div>

          {/* Animated Breath Visualizer */}
          <div className="flex flex-col items-center justify-center py-6 space-y-4 bg-slate-800/40 rounded-xl border border-slate-700/40">
            <div className="relative flex items-center justify-center w-32 h-32">
              
              {/* Outer Pulsing Ring */}
              <div
                className={`absolute inset-0 rounded-full border-4 border-emerald-500/30 transition-all duration-1000 ${
                  isBreathingActive && breathPhase === 'Inhale' 
                    ? 'scale-125 border-emerald-400 shadow-lg shadow-emerald-900/50' 
                    : isBreathingActive && breathPhase === 'Exhale'
                    ? 'scale-75 border-teal-500'
                    : 'scale-100'
                }`}
              />

              <div className="text-center z-10">
                <div className="text-sm font-bold text-emerald-300 uppercase tracking-widest">{breathPhase}</div>
                <div className="text-2xl font-extrabold text-white">{phaseSeconds}s</div>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Session Remaining: {Math.floor(breathSecondsLeft / 60)}m {breathSecondsLeft % 60}s
            </div>
          </div>
        </div>

        {/* Tool 2: 20-20-20 Eye Strain Rest */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-bold text-slate-100 text-sm">20-20-20 Eye Fatigue Relief</h3>
                <p className="text-[11px] text-slate-400">Look 20 feet away for 20 seconds to relax ciliary muscles</p>
              </div>
            </div>

            <button
              onClick={() => {
                setEyeRestSeconds(20);
                setIsEyeRestActive(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow transition flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Start 20s Rest</span>
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-6 space-y-3 bg-slate-800/40 rounded-xl border border-slate-700/40">
            <div className={`text-4xl font-extrabold transition-all ${isEyeRestActive ? 'text-cyan-400 scale-110' : 'text-slate-500'}`}>
              {eyeRestSeconds}s
            </div>
            <p className="text-xs text-slate-300 text-center max-w-xs px-4">
              {isEyeRestActive 
                ? 'Focus your gaze on a distant wall or window object outside.' 
                : 'Click button above when you feel eye dryness or strain after long reading sessions.'}
            </p>
          </div>
        </div>

      </div>

      {/* Pattern-Driven Mental Health Recommendations */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            Tailored Mental Health Advice Based on Usage Patterns
          </h3>
          <p className="text-xs text-slate-400">Automated psychological recommendations generated from your daily screen telemetry</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MENTAL_HEALTH_INSIGHTS.map((insight) => (
            <div key={insight.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    insight.type === 'warning'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : insight.type === 'praise'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}>
                    {insight.metricTrigger}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-white">{insight.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{insight.description}</p>
              </div>

              {insight.actionLabel && (
                <div className="pt-2">
                  <button
                    onClick={onNavigateToLimits}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
                  >
                    <span>{insight.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Digital Wellbeing Habit Guidelines */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          4 Pillars for Sustainable Digital Health
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
            <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-indigo-400" />
              1-Hr Screen Buffer
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Stop device interaction 60 minutes before bed to allow pineal melatonin synthesis.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
            <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" />
              Morning Sunlight First
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Avoid checking notifications for the first 20 minutes after waking; get natural sunlight.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
            <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              App Notification Purge
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Disable non-human push notifications (marketing, social badges, game alerts).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
            <div className="font-semibold text-purple-300 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-400" />
              Intentional Micro-Breaks
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Take 2-minute posture & breathing resets between continuous work blocks.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
