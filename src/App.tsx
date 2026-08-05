import React, { useState, useEffect, useRef } from 'react';
import { AppUsage, UserSettings, ConnectedDevice, SyncLogEntry } from './types';
import { DEFAULT_SETTINGS, INITIAL_APPS, INITIAL_DEVICES } from './data/mockData';
import { alarmAudio } from './utils/audio';

// Components
import { Header } from './components/Header';
import { DashboardTab } from './components/DashboardTab';
import { LimitsTab } from './components/LimitsTab';
import { MultiDeviceTab } from './components/MultiDeviceTab';
import { CloudSyncTab } from './components/CloudSyncTab';
import { MentalHealthTab } from './components/MentalHealthTab';
import { PrivacyTab } from './components/PrivacyTab';
import { AlarmModal } from './components/AlarmModal';

const LOCAL_STORAGE_APPS_KEY = 'screentime_apps_v1';
const LOCAL_STORAGE_SETTINGS_KEY = 'screentime_settings_v1';

export default function App() {
  // State from LocalStorage or defaults
  const [apps, setApps] = useState<AppUsage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_APPS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_APPS;
    } catch {
      return INITIAL_APPS;
    }
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [devices, setDevices] = useState<ConnectedDevice[]>(INITIAL_DEVICES);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [activeAppId, setActiveAppId] = useState<string>('app-instagram');
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [snoozedUntil, setSnoozedUntil] = useState<number | null>(null);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<string>('Just now');
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);

  // Sync logs
  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>([
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      deviceId: 'iPhone 15 Pro',
      action: 'PUSH_DELTA_SYNC',
      bytesTransferred: 1420,
      status: 'success',
      ciphertextPreview: 'e2ee_8f9a2b1c4d...aef0',
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
      deviceId: 'MacBook Air M2',
      action: 'PULL_LIMITS_UPDATE',
      bytesTransferred: 850,
      status: 'success',
      ciphertextPreview: 'e2ee_3c4d5e6f7a...110b',
    },
  ]);

  // Persist Apps to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_APPS_KEY, JSON.stringify(apps));
    } catch {
      // ignore
    }
  }, [apps]);

  // Persist Settings to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Calculations
  const totalMinutesUsed = apps.reduce((sum, a) => sum + a.minutesUsed, 0);
  const overallExceeded = settings.overallDailyLimitMinutes > 0 && totalMinutesUsed >= settings.overallDailyLimitMinutes;
  const exceededApps = apps.filter(a => a.dailyLimitMinutes > 0 && a.minutesUsed >= a.dailyLimitMinutes);
  const hasExceededLimit = overallExceeded || exceededApps.length > 0;

  // Social minutes calculation for mental health score
  const socialMinutes = apps.filter(a => a.category === 'Social').reduce((s, a) => s + a.minutesUsed, 0);
  const totalPickups = apps.reduce((sum, a) => sum + a.pickups, 0);

  // Auto Alarm Trigger Evaluation
  const prevExceededRef = useRef<boolean>(false);
  useEffect(() => {
    const isSnoozed = snoozedUntil !== null && Date.now() < snoozedUntil;

    if (hasExceededLimit && settings.alarmEnabled && !isSnoozed) {
      if (!prevExceededRef.current) {
        setIsAlarmModalOpen(true);
        if (!isSoundMuted) {
          alarmAudio.playAlarm(settings.alarmSoundType, settings.soundVolume);
        }
      }
    } else {
      if (isSnoozed || !hasExceededLimit) {
        alarmAudio.stopAlarm();
      }
    }
    prevExceededRef.current = hasExceededLimit;
  }, [hasExceededLimit, settings.alarmEnabled, settings.alarmSoundType, settings.soundVolume, snoozedUntil, isSoundMuted]);

  // Live usage timer tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setApps(prevApps => prevApps.map(app => {
          if (app.id === activeAppId) {
            return {
              ...app,
              minutesUsed: app.minutesUsed + 1,
              lastUsed: 'Just now',
            };
          }
          return app;
        }));

        // Also update active device minutes
        setDevices(prevDevs => prevDevs.map(d => {
          if (d.status === 'active') {
            return { ...d, todayMinutes: d.todayMinutes + 1 };
          }
          return d;
        }));
      }, 1000); // Ticks 1 minute per second for real-time simulation
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, activeAppId]);

  // Handlers
  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleUpdateAppLimit = (appId: string, limitMinutes: number) => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, dailyLimitMinutes: limitMinutes } : a));
  };

  const handleAddMinutesToApp = (appId: string, mins: number) => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, minutesUsed: a.minutesUsed + mins, lastUsed: 'Just now' } : a));
  };

  const handleResetUsage = () => {
    setApps(INITIAL_APPS.map(a => ({ ...a, minutesUsed: 0 })));
    alarmAudio.stopAlarm();
    setIsAlarmModalOpen(false);
  };

  const handleTriggerTestAlarm = () => {
    setIsAlarmModalOpen(true);
    alarmAudio.playAlarm(settings.alarmSoundType, settings.soundVolume);
  };

  const handleSnoozeAlarm = (minutes: number) => {
    setSnoozedUntil(Date.now() + minutes * 60 * 1000);
    alarmAudio.stopAlarm();
    setIsAlarmModalOpen(false);
  };

  const handleExtendLimit = (appId?: string, addMinutes = 30) => {
    if (appId) {
      setApps(prev => prev.map(a => a.id === appId ? { ...a, dailyLimitMinutes: a.dailyLimitMinutes + addMinutes } : a));
    } else {
      setSettings(prev => ({ ...prev, overallDailyLimitMinutes: prev.overallDailyLimitMinutes + addMinutes }));
    }
    alarmAudio.stopAlarm();
    setIsAlarmModalOpen(false);
  };

  const handleSyncAllDevices = () => {
    const now = new Date().toLocaleTimeString();
    setLastSyncTimestamp(now);
    setSyncLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: now,
        deviceId: 'iPhone 15 Pro',
        action: 'MANUAL_FULL_SYNC',
        bytesTransferred: 2140,
        status: 'success',
        ciphertextPreview: 'e2ee_9a8b7c6d5e...4321',
      },
      ...prev,
    ]);
  };

  const handleExportBackup = () => {
    const backupObj = {
      exportDate: new Date().toISOString(),
      version: '1.0-e2ee',
      settings,
      apps,
      devices,
    };
    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `screentime-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (jsonContent: string) => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (parsed.apps && Array.isArray(parsed.apps)) {
        setApps(parsed.apps);
      }
      if (parsed.settings) {
        setSettings(parsed.settings);
      }
    } catch (err) {
      console.error("Failed to parse imported backup", err);
    }
  };

  const handleClearAllLocalData = () => {
    localStorage.removeItem(LOCAL_STORAGE_APPS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_SETTINGS_KEY);
    setApps(INITIAL_APPS.map(a => ({ ...a, minutesUsed: 0 })));
    setSettings(DEFAULT_SETTINGS);
    alarmAudio.stopAlarm();
    setIsAlarmModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Sticky Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalMinutesUsed={totalMinutesUsed}
        overallDailyLimit={settings.overallDailyLimitMinutes}
        isTimerRunning={isTimerRunning}
        setIsTimerRunning={setIsTimerRunning}
        hasExceededLimit={hasExceededLimit}
        onTriggerTestAlarm={handleTriggerTestAlarm}
      />

      {/* Main Tab Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardTab
            apps={apps}
            totalMinutesUsed={totalMinutesUsed}
            overallDailyLimit={settings.overallDailyLimitMinutes}
            isTimerRunning={isTimerRunning}
            setIsTimerRunning={setIsTimerRunning}
            activeAppId={activeAppId}
            setActiveAppId={setActiveAppId}
            onAddMinutesToApp={handleAddMinutesToApp}
            onResetUsage={handleResetUsage}
            onNavigateToLimits={() => setActiveTab('limits')}
            onNavigateToBreathing={() => setActiveTab('wellbeing')}
          />
        )}

        {activeTab === 'limits' && (
          <LimitsTab
            apps={apps}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onUpdateAppLimit={handleUpdateAppLimit}
            onTestAlarm={handleTriggerTestAlarm}
          />
        )}

        {activeTab === 'multidevice' && (
          <MultiDeviceTab
            devices={devices}
            onSyncAllDevices={handleSyncAllDevices}
            lastSyncTimestamp={lastSyncTimestamp}
          />
        )}

        {activeTab === 'cloudsync' && (
          <CloudSyncTab
            syncLogs={syncLogs}
            onTriggerSync={handleSyncAllDevices}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
            isOfflineSimulated={isOfflineSimulated}
            setIsOfflineSimulated={setIsOfflineSimulated}
          />
        )}

        {activeTab === 'wellbeing' && (
          <MentalHealthTab
            totalMinutesUsed={totalMinutesUsed}
            pickups={totalPickups}
            socialMinutes={socialMinutes}
            onNavigateToLimits={() => setActiveTab('limits')}
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacyTab
            onClearAllLocalData={handleClearAllLocalData}
            sampleDataObj={{ apps, settings, totalMinutesUsed }}
          />
        )}
      </main>

      {/* Exceeded Limit Alarm Popup Modal */}
      <AlarmModal
        isOpen={isAlarmModalOpen}
        exceededApps={exceededApps}
        overallExceeded={overallExceeded}
        totalMinutesUsed={totalMinutesUsed}
        overallDailyLimit={settings.overallDailyLimitMinutes}
        onSnooze={handleSnoozeAlarm}
        onExtendLimit={handleExtendLimit}
        onStartBreathing={() => setActiveTab('wellbeing')}
        onDismiss={() => {
          alarmAudio.stopAlarm();
          setIsAlarmModalOpen(false);
        }}
        isSoundMuted={isSoundMuted}
        onToggleMuteSound={() => {
          if (!isSoundMuted) {
            alarmAudio.stopAlarm();
            setIsSoundMuted(true);
          } else {
            setIsSoundMuted(false);
            alarmAudio.playAlarm(settings.alarmSoundType, settings.soundVolume);
          }
        }}
      />

    </div>
  );
}
