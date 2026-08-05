import React, { useState } from 'react';
import { 
  Clock, Smartphone, AlertTriangle, Play, Pause, Plus, RotateCcw, 
  BarChart3, Camera, Tv, Code, MessageSquare, BookOpen, GraduationCap, AppWindow,
  Sliders, ShieldCheck, Flame
} from 'lucide-react';
import { AppUsage, AppCategory } from '../types';
import { formatMinutes, getProgressColorClass } from '../utils/helpers';
import { HOURLY_USAGE_TODAY } from '../data/mockData';

interface DashboardTabProps {
  apps: AppUsage[];
  totalMinutesUsed: number;
  overallDailyLimit: number;
  isTimerRunning: boolean;
  setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  activeAppId: string;
  setActiveAppId: (id: string) => void;
  onAddMinutesToApp: (appId: string, mins: number) => void;
  onResetUsage: () => void;
  onNavigateToLimits: () => void;
  onNavigateToBreathing: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  apps,
  totalMinutesUsed,
  overallDailyLimit,
  isTimerRunning,
  setIsTimerRunning,
  activeAppId,
  setActiveAppId,
  onAddMinutesToApp,
  onResetUsage,
  onNavigateToLimits,
  onNavigateToBreathing,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Calculations
  const overallPercentage = Math.round((totalMinutesUsed / overallDailyLimit) * 100);
  const totalPickups = apps.reduce((acc, a) => acc + a.pickups, 0);

  // Group by category
  const categories: AppCategory[] = ['Social', 'Entertainment', 'Productivity', 'Games', 'Reading', 'Utilities'];
  const categoryTotals = categories.map((cat) => {
    const categoryApps = apps.filter(a => a.category === cat);
    const mins = categoryApps.reduce((sum, a) => sum + a.minutesUsed, 0);
    return {
      category: cat,
      minutes: mins,
      percentage: totalMinutesUsed > 0 ? Math.round((mins / totalMinutesUsed) * 100) : 0,
    };
  }).filter(c => c.minutes > 0);

  // Exceeded apps
  const exceededApps = apps.filter(a => a.dailyLimitMinutes > 0 && a.minutesUsed >= a.dailyLimitMinutes);

  // Filtered apps list
  const filteredApps = selectedCategoryFilter === 'All'
    ? apps
    : apps.filter(a => a.category === selectedCategoryFilter);

  // Helper for app icon
  const renderAppIcon = (iconName: string, color: string) => {
    const props = { className: 'w-4 h-4 text-white' };
    let icon = <AppWindow {...props} />;
    if (iconName === 'Camera') icon = <Camera {...props} />;
    if (iconName === 'Tv') icon = <Tv {...props} />;
    if (iconName === 'Code') icon = <Code {...props} />;
    if (iconName === 'MessageSquare') icon = <MessageSquare {...props} />;
    if (iconName === 'BookOpen') icon = <BookOpen {...props} />;
    if (iconName === 'GraduationCap') icon = <GraduationCap {...props} />;

    return (
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: color }}>
        {icon}
      </div>
    );
  };

  const activeApp = apps.find(a => a.id === activeAppId) || apps[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner Alert if Exceeded */}
      {exceededApps.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border border-red-500/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-red-200">
                {exceededApps.length} App{exceededApps.length > 1 ? 's' : ''} Exceeded Daily Allowance!
              </div>
              <div className="text-xs text-red-300/80">
                {exceededApps.map(a => a.name).join(', ')} reached limit. Take a break or review settings.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onNavigateToBreathing}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow transition"
            >
              Start Breathing
            </button>
            <button
              onClick={onNavigateToLimits}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition"
            >
              Adjust Limits
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Screen Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Total Screen Time</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatMinutes(totalMinutesUsed)}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
              <span>Cap: {formatMinutes(overallDailyLimit)}</span>
              <span className={overallPercentage >= 100 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                {overallPercentage}%
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getProgressColorClass(overallPercentage).bar}`}
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Device Pickups */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Total Pickups</span>
            <Smartphone className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {totalPickups} <span className="text-xs font-normal text-slate-400">unlocks</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Avg ~{Math.round(totalPickups / 14)} unlocks / hour awake
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
            <Flame className="w-3.5 h-3.5" />
            <span>High pickup frequency</span>
          </div>
        </div>

        {/* Most Used App */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Top App Today</span>
            <BarChart3 className="w-4 h-4 text-emerald-400" />
          </div>
          {apps.length > 0 && (
            <div>
              <div className="flex items-center gap-2">
                {renderAppIcon(apps[0].iconName, apps[0].color)}
                <div>
                  <div className="text-base font-bold text-white">{apps[0].name}</div>
                  <div className="text-xs text-slate-400">{formatMinutes(apps[0].minutesUsed)} used</div>
                </div>
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Category: <span className="text-slate-200 font-medium">{apps[0].category}</span>
              </div>
            </div>
          )}
        </div>

        {/* Alarm & Limits Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Enforcement Status</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {exceededApps.length === 0 ? (
                <span className="text-emerald-400">Within Limits</span>
              ) : (
                <span className="text-red-400">{exceededApps.length} Violations</span>
              )}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {apps.filter(a => a.dailyLimitMinutes > 0).length} apps have daily limits active
            </div>
          </div>
          <button
            onClick={onNavigateToLimits}
            className="w-full py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition flex items-center justify-center gap-1"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manage Daily Limits</span>
          </button>
        </div>

      </div>

      {/* Interactive Usage Simulation Sandbox */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400" />
              Live Screen Usage Simulator & Test Console
            </h3>
            <p className="text-xs text-slate-400">
              Select an app and add active minutes or run auto-ticker to test daily limits and Web Audio alarms in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                isTimerRunning
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isTimerRunning ? 'Pause Ticker' : 'Start Auto-Tick (+1m/s)'}</span>
            </button>

            <button
              onClick={onResetUsage}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
              title="Reset today's usage statistics"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
          
          {/* Active App Selection */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs text-slate-400 font-medium">Active App:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {apps.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setActiveAppId(a.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                    activeAppId === a.id
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
                  <span>{a.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Manual Add Minutes */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-slate-400">Add to {activeApp.name}:</span>
            <button
              onClick={() => onAddMinutesToApp(activeApp.id, 5)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition flex items-center gap-1"
            >
              <Plus className="w-3 h-3 text-emerald-400" />
              <span>+5m</span>
            </button>
            <button
              onClick={() => onAddMinutesToApp(activeApp.id, 15)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition flex items-center gap-1"
            >
              <Plus className="w-3 h-3 text-emerald-400" />
              <span>+15m</span>
            </button>
            <button
              onClick={() => onAddMinutesToApp(activeApp.id, 30)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition flex items-center gap-1"
            >
              <Plus className="w-3 h-3 text-emerald-400" />
              <span>+30m</span>
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Chart & Category Breakdown Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hourly Timeline */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Today's Hourly Screen Usage Timeline</h3>
              <p className="text-xs text-slate-400">Distribution of active minutes across awake hours</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              Peak: 4 PM - 6 PM
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2">
            {HOURLY_USAGE_TODAY.map((item, index) => {
              const maxVal = 70;
              const heightPercent = Math.round((item.minutes / maxVal) * 100);
              const isPeak = item.minutes >= 55;

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group relative">
                  
                  {/* Hover Tooltip */}
                  <div className="absolute -top-8 bg-slate-800 text-white text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                    {item.minutes} mins
                  </div>

                  {/* Bar */}
                  <div className="w-full bg-slate-800 rounded-t-md h-36 flex items-end overflow-hidden p-0.5">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-500 ${
                        isPeak 
                          ? 'bg-gradient-to-t from-indigo-600 to-cyan-400 shadow-md shadow-cyan-900/40' 
                          : 'bg-indigo-600/70 group-hover:bg-indigo-500'
                      }`}
                      style={{ height: `${Math.max(heightPercent, 4)}%` }}
                    />
                  </div>

                  {/* Hour label */}
                  <span className="text-[10px] text-slate-400 font-medium group-hover:text-slate-200">
                    {item.hour}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-100 text-sm">Category Breakdown</h3>
            <p className="text-xs text-slate-400">Time split by application domain</p>
          </div>

          <div className="space-y-3">
            {categoryTotals.map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{cat.category}</span>
                  <div className="text-right">
                    <span className="text-slate-100 font-bold">{formatMinutes(cat.minutes)}</span>
                    <span className="text-slate-500 ml-1">({cat.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Detailed App Usage Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-slate-100 text-sm">App Statistics & Limits</h3>
            <p className="text-xs text-slate-400">Detailed breakdown of active apps and limit statuses</p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  selectedCategoryFilter === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Application</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Time Used</th>
                <th className="px-4 py-3">Daily Limit</th>
                <th className="px-4 py-3">Pickups</th>
                <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredApps.map((app) => {
                const limitMinutes = app.dailyLimitMinutes;
                const percentage = limitMinutes > 0 ? Math.round((app.minutesUsed / limitMinutes) * 100) : 0;
                const colorConfig = getProgressColorClass(percentage);
                const isExceeded = limitMinutes > 0 && app.minutesUsed >= limitMinutes;

                return (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition">
                    
                    {/* App name & Icon */}
                    <td className="px-4 py-3 font-medium text-slate-100">
                      <div className="flex items-center gap-2.5">
                        {renderAppIcon(app.iconName, app.color)}
                        <div>
                          <div className="font-semibold text-white">{app.name}</div>
                          <div className="text-[11px] text-slate-400">Last used {app.lastUsed}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                        {app.category}
                      </span>
                    </td>

                    {/* Time used */}
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-100">{formatMinutes(app.minutesUsed)}</div>
                      {limitMinutes > 0 && (
                        <div className="w-24 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full ${colorConfig.bar}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      )}
                    </td>

                    {/* Limit status */}
                    <td className="px-4 py-3">
                      {limitMinutes === 0 ? (
                        <span className="text-slate-500 font-medium">No limit set</span>
                      ) : (
                        <div className="space-y-0.5">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${colorConfig.badge}`}>
                            {isExceeded ? 'ALARM EXCEEDED' : `${formatMinutes(limitMinutes)} (${percentage}%)`}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Pickups */}
                    <td className="px-4 py-3 font-medium text-slate-300">
                      {app.pickups} pickups
                    </td>

                    {/* Quick actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onAddMinutesToApp(app.id, 10)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-[11px] font-medium transition"
                          title="Add 10 minutes to test limit alarm"
                        >
                          +10m
                        </button>
                        <button
                          onClick={onNavigateToLimits}
                          className="px-2 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-[11px] font-medium transition"
                        >
                          Limit
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
