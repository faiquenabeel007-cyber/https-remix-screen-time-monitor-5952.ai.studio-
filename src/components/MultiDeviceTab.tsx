import React, { useState } from 'react';
import { Smartphone, Laptop, Tablet, RefreshCw, CheckCircle2, Cpu, Shield, Layers, Zap, Info } from 'lucide-react';
import { ConnectedDevice } from '../types';
import { formatMinutes } from '../utils/helpers';

interface MultiDeviceTabProps {
  devices: ConnectedDevice[];
  onSyncAllDevices: () => void;
  lastSyncTimestamp: string;
}

export const MultiDeviceTab: React.FC<MultiDeviceTabProps> = ({
  devices,
  onSyncAllDevices,
  lastSyncTimestamp,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const totalCombinedMinutes = devices.reduce((sum, d) => sum + d.todayMinutes, 0);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      onSyncAllDevices();
      setIsSyncing(false);
    }, 1000);
  };

  const getDeviceIcon = (type: string) => {
    if (type === 'mobile') return <Smartphone className="w-5 h-5 text-cyan-400" />;
    if (type === 'desktop') return <Laptop className="w-5 h-5 text-indigo-400" />;
    return <Tablet className="w-5 h-5 text-purple-400" />;
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Multi-Device Cross-Platform Insights</h2>
              <p className="text-xs text-slate-400">
                Unified screen time tracking across iOS, macOS, Android, and Web clients.
              </p>
            </div>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing...' : 'Sync All Devices'}</span>
          </button>
        </div>

        {/* Sync Summary Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Last synchronized: <strong className="text-slate-200">{lastSyncTimestamp}</strong></span>
          </div>
          <div>
            Total Aggregated Screen Time Today: <strong className="text-white text-sm">{formatMinutes(totalCombinedMinutes)}</strong>
          </div>
        </div>
      </div>

      {/* Connected Device Cards Grid */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          Active Connected Devices ({devices.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {devices.map((device) => {
            const devicePercent = Math.round((device.todayMinutes / Math.max(totalCombinedMinutes, 1)) * 100);

            return (
              <div key={device.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">{device.name}</div>
                      <div className="text-[11px] text-slate-400">{device.os}</div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                    device.status === 'active' 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {device.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Today Screen Time:</span>
                    <span className="font-bold text-white">{formatMinutes(device.todayMinutes)}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${devicePercent}%` }} />
                  </div>
                  <div className="text-[10px] text-slate-500 text-right">{devicePercent}% of total day</div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Active App: <strong className="text-slate-200">{device.activeApp || 'Idle'}</strong></span>
                  <span>Battery: <strong className="text-slate-200">{device.battery}%</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How Multi-Device Synchronization & Aggregation Works */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            How Multi-Device Sync Architecture Achieves Better Insights
          </h3>
          <p className="text-xs text-slate-400">
            A guide to seamless cross-device aggregation, overlap deduplication, and unified alarm triggers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-xs text-cyan-300">
              <Zap className="w-4 h-4" />
              1. Session Overlap Deduplication
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When you play audio on your phone while typing on your MacBook, standard timers double-count screen time. Our multi-device engine uses <strong>time-stamped active focus vectors</strong> to ensure overlapping active sessions on multiple screens are merged into an accurate unified timeline.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-xs text-indigo-300">
              <Shield className="w-4 h-4" />
              2. Unified Cross-Device Daily Allowances
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Setting a 45-minute social media limit enforced on your phone alone leaves a loophole on your iPad or laptop. Multi-device sync sums usage across all client nodes in real-time, instantly triggering the Web Audio alarm on whatever active screen you are currently looking at.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-xs text-emerald-300">
              <Layers className="w-4 h-4" />
              3. Cross-Platform Client Extensions
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Integrates with <strong>Apple Screen Time API</strong> (iOS/macOS), <strong>Digital Wellbeing API</strong> (Android), and lightweight Web/Browser Extension listeners to record granular app switches without battery drain.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-xs text-purple-300">
              <Info className="w-4 h-4" />
              4. Holistic Pickups & Context Switching
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Provides aggregated pickup metrics across all hardware (e.g. 45 unlocks on iPhone + 30 wake events on Mac = 75 total unlocks), revealing total daily task interruptions.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
