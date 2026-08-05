import React from 'react';
import { Clock, ShieldAlert, Smartphone, Cloud, HeartPulse, Lock, Bell, Pause, Play, AlertTriangle } from 'lucide-react';
import { formatMinutes } from '../utils/helpers';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalMinutesUsed: number;
  overallDailyLimit: number;
  isTimerRunning: boolean;
  setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  hasExceededLimit: boolean;
  onTriggerTestAlarm: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalMinutesUsed,
  overallDailyLimit,
  isTimerRunning,
  setIsTimerRunning,
  hasExceededLimit,
  onTriggerTestAlarm,
}) => {
  const percentUsed = Math.round((totalMinutesUsed / overallDailyLimit) * 100);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          
          {/* Logo & App Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Clock className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg text-white tracking-tight">Screen Time Monitor</h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Live E2EE
                  </span>
                </div>
                <p className="text-xs text-slate-400">Digital Wellbeing & Daily Limit Engine</p>
              </div>
            </div>

            {/* Mobile Timer Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                  isTimerRunning 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Quick Header Stats & Controls */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 bg-slate-800/80 p-2 sm:p-2.5 rounded-xl border border-slate-700/60 text-xs">
            {/* Total Screen Time */}
            <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-900/60 rounded-lg border border-slate-700/40">
              <div className="text-slate-400">Today:</div>
              <div className="font-semibold text-slate-100">{formatMinutes(totalMinutesUsed)}</div>
              <div className="text-slate-500">/ {formatMinutes(overallDailyLimit)}</div>
            </div>

            {/* Limit Warning Badge */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium border transition ${
              hasExceededLimit
                ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                : percentUsed >= 80
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {hasExceededLimit ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>Limit Exceeded!</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{percentUsed}% Used</span>
                </>
              )}
            </div>

            {/* Test Alarm Sound Trigger */}
            <button
              onClick={onTriggerTestAlarm}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 transition"
              title="Test the Web Audio limit alarm sound"
            >
              <Bell className="w-3.5 h-3.5 text-indigo-400" />
              <span>Test Alarm</span>
            </button>

            {/* Live Session Simulator Toggle */}
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium border transition ${
                isTimerRunning 
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40' 
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pause Auto-Tick</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Simulate Active Use</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 pt-1 border-t border-slate-800 text-xs font-medium scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Usage Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('limits')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === 'limits'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Daily Limits & Alarm</span>
            {hasExceededLimit && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('wellbeing')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === 'wellbeing'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>Mental Health & Tips</span>
          </button>

          <button
            onClick={() => setActiveTab('multidevice')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === 'multidevice'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Multi-Device Insights</span>
          </button>

          <button
            onClick={() => setActiveTab('cloudsync')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === 'cloudsync'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Cloud Storage & Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === 'privacy'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy & Encryption</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
