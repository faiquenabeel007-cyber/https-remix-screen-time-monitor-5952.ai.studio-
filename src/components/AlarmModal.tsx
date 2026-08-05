import React from 'react';
import { Volume2, VolumeX, ShieldAlert, Clock, Sparkles, HeartPulse, CheckCircle } from 'lucide-react';
import { AppUsage } from '../types';
import { formatMinutes } from '../utils/helpers';

interface AlarmModalProps {
  isOpen: boolean;
  exceededApps: AppUsage[];
  overallExceeded: boolean;
  totalMinutesUsed: number;
  overallDailyLimit: number;
  onSnooze: (minutes: number) => void;
  onExtendLimit: (appId?: string, addMinutes?: number) => void;
  onStartBreathing: () => void;
  onDismiss: () => void;
  isSoundMuted: boolean;
  onToggleMuteSound: () => void;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({
  isOpen,
  exceededApps,
  overallExceeded,
  totalMinutesUsed,
  overallDailyLimit,
  onSnooze,
  onExtendLimit,
  onStartBreathing,
  onDismiss,
  isSoundMuted,
  onToggleMuteSound,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-red-500/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl shadow-red-950/50 text-slate-100 relative overflow-hidden">
        
        {/* Pulsing red top border accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

        {/* Top Header Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center animate-bounce">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-red-400">Daily Allowance Exceeded</span>
              <h2 className="text-xl font-bold text-white">Screen Limit Alarm</h2>
            </div>
          </div>

          <button
            onClick={onToggleMuteSound}
            className={`p-2 rounded-xl border transition ${
              isSoundMuted 
                ? 'bg-slate-800 text-slate-400 border-slate-700' 
                : 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
            }`}
            title={isSoundMuted ? "Unmute Alarm Sound" : "Mute Alarm Sound"}
          >
            {isSoundMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Main Exceeded Limit Details */}
        <div className="space-y-3 my-5">
          {overallExceeded && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-3">
              <Clock className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-red-200">Overall Daily Screen Allowance Reached</div>
                <div className="text-xs text-red-300/80 mt-0.5">
                  You have used <strong className="text-red-100">{formatMinutes(totalMinutesUsed)}</strong> today out of your preset <strong className="text-red-100">{formatMinutes(overallDailyLimit)}</strong> cap.
                </div>
              </div>
            </div>
          )}

          {exceededApps.length > 0 && (
            <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/60 space-y-2">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">App Limit Violations:</div>
              {exceededApps.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-700/40 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: app.color }} />
                    <span className="font-medium text-slate-200">{app.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-red-400 font-bold">{formatMinutes(app.minutesUsed)}</span>
                    <span className="text-slate-500"> / {formatMinutes(app.dailyLimitMinutes)} limit</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-slate-400 leading-relaxed">
            Exceeding screen time limits triggers dopamine fatigue, delays sleep, and increases digital eye strain. Take a moment to pause or engage in a quick break.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          
          {/* Start Digital Detox Break */}
          <button
            onClick={() => {
              onStartBreathing();
              onDismiss();
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-md transition"
          >
            <HeartPulse className="w-4 h-4" />
            <span>2-Min Box Breathing</span>
          </button>

          {/* Snooze 15 Mins */}
          <button
            onClick={() => onSnooze(15)}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Snooze Alarm 15m</span>
          </button>

          {/* Extend Limit by 30 mins */}
          <button
            onClick={() => onExtendLimit(undefined, 30)}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 font-medium text-xs transition"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Extend Limit +30m</span>
          </button>

          {/* Acknowledge & Dismiss */}
          <button
            onClick={onDismiss}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium text-xs transition"
          >
            <CheckCircle className="w-4 h-4 text-slate-400" />
            <span>Acknowledge & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
