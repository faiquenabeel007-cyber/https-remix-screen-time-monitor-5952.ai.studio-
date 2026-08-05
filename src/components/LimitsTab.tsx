import React from 'react';
import { ShieldAlert, Bell, Volume2, VolumeX, Sliders, Moon, AppWindow, Camera, Tv, Code, MessageSquare, BookOpen, GraduationCap } from 'lucide-react';
import { AppUsage, UserSettings } from '../types';
import { formatMinutes } from '../utils/helpers';

interface LimitsTabProps {
  apps: AppUsage[];
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onUpdateAppLimit: (appId: string, limitMinutes: number) => void;
  onTestAlarm: () => void;
}

export const LimitsTab: React.FC<LimitsTabProps> = ({
  apps,
  settings,
  onUpdateSettings,
  onUpdateAppLimit,
  onTestAlarm,
}) => {
  const overallHours = Math.floor(settings.overallDailyLimitMinutes / 60);
  const overallMins = settings.overallDailyLimitMinutes % 60;

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

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Daily Screen Limits & Alarm Engine</h2>
            <p className="text-xs text-slate-400">
              Configure overall allowance, individual app limits, and Web Audio warning alarms when caps are reached.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Overall Limit Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Overall Daily Screen Time Cap
            </h3>
            <span className="text-xs font-bold text-indigo-400 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">
              {formatMinutes(settings.overallDailyLimitMinutes)}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Adjust Daily Limit Slider:</span>
                <span className="text-slate-200 font-semibold">{overallHours}h {overallMins}m</span>
              </div>
              <input
                type="range"
                min="30"
                max="480"
                step="15"
                value={settings.overallDailyLimitMinutes}
                onChange={(e) => onUpdateSettings({ overallDailyLimitMinutes: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>30 mins</span>
                <span>4 hours</span>
                <span>8 hours</span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="space-y-1.5">
              <div className="text-xs text-slate-400 font-medium">Quick Presets:</div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '1.5 Hours', mins: 90 },
                  { label: '2.5 Hours', mins: 150 },
                  { label: '3.5 Hours', mins: 210 },
                  { label: '5 Hours', mins: 300 },
                ].map((preset) => (
                  <button
                    key={preset.mins}
                    onClick={() => onUpdateSettings({ overallDailyLimitMinutes: preset.mins })}
                    className={`py-1.5 rounded-lg text-xs font-medium border transition ${
                      settings.overallDailyLimitMinutes === preset.mins
                        ? 'bg-indigo-600 text-white border-indigo-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Web Audio Alarm Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-red-400" />
              Alarm Sound & Warning Settings
            </h3>
            
            {/* Alarm Master Toggle */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.alarmEnabled}
                onChange={(e) => onUpdateSettings({ alarmEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="space-y-4">
            
            {/* Alarm Sound Tone Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Limit Exceeded Alarm Tone:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'pulse_alarm', name: 'Pulse Alarm', desc: 'Alert tone' },
                  { id: 'gentle_chime', name: 'Gentle Chime', desc: 'Mindful' },
                  { id: 'digital_beep', name: 'Digital Beep', desc: 'Dual pitch' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => onUpdateSettings({ alarmSoundType: type.id as any })}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      settings.alarmSoundType === type.id
                        ? 'bg-red-500/20 text-red-200 border-red-500/50 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-semibold text-xs text-white">{type.name}</div>
                    <div className="text-[10px] text-slate-400">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Volume slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  {settings.soundVolume === 0 ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-red-400" />}
                  Alarm Volume
                </span>
                <span className="font-semibold text-slate-200">{Math.round(settings.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.soundVolume}
                onChange={(e) => onUpdateSettings({ soundVolume: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Test Alarm Sound Button */}
            <button
              onClick={onTestAlarm}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              <span>Test Alarm Sound Now</span>
            </button>

          </div>
        </div>

      </div>

      {/* App-by-App Limit Manager */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-100 text-sm">App-Specific Daily Limits</h3>
            <p className="text-xs text-slate-400">Set independent time caps for distraction-prone applications</p>
          </div>
          <span className="text-xs text-slate-400">
            {apps.filter(a => a.dailyLimitMinutes > 0).length} of {apps.length} restricted
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {apps.map((app) => (
            <div key={app.id} className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {renderAppIcon(app.iconName, app.color)}
                <div>
                  <div className="font-semibold text-xs text-white">{app.name}</div>
                  <div className="text-[10px] text-slate-400">
                    Used today: <span className="text-slate-200 font-medium">{formatMinutes(app.minutesUsed)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={app.dailyLimitMinutes}
                  onChange={(e) => onUpdateAppLimit(app.id, parseInt(e.target.value))}
                  className="bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                >
                  <option value={0}>No Limit</option>
                  <option value={15}>15 mins</option>
                  <option value={30}>30 mins</option>
                  <option value={45}>45 mins</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                  <option value={240}>4 hours</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Night Wind-Down Schedule */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Night Wind-Down Schedule</h3>
              <p className="text-xs text-slate-400">Automate screen restrictions to protect sleep quality</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.nightModeSchedule.enabled}
              onChange={(e) => onUpdateSettings({
                nightModeSchedule: { ...settings.nightModeSchedule, enabled: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <span className="text-slate-400">Active Quiet Hours:</span>
            <div className="font-bold text-slate-100 text-sm mt-0.5">10:00 PM – 6:00 AM</div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <span className="text-slate-400">Night Effect:</span>
            <div className="font-medium text-purple-300 text-sm mt-0.5">Strict Alarm & Grayscale Alert Prompt</div>
          </div>
        </div>
      </div>

    </div>
  );
};
