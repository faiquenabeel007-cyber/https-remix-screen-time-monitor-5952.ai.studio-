export type AppCategory = 'Social' | 'Entertainment' | 'Productivity' | 'Games' | 'Reading' | 'Utilities';

export interface AppUsage {
  id: string;
  name: string;
  category: AppCategory;
  iconName: string; // Lucide icon identifier
  minutesUsed: number;
  dailyLimitMinutes: number; // 0 means no specific limit
  pickups: number;
  lastUsed: string;
  color: string;
}

export interface CategoryUsage {
  category: AppCategory;
  minutes: number;
  color: string;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet' | 'wearable';
  os: string;
  lastSynced: string;
  status: 'active' | 'synced' | 'offline';
  todayMinutes: number;
  activeApp?: string;
  battery: number;
}

export interface MentalHealthInsight {
  id: string;
  type: 'warning' | 'tip' | 'praise' | 'strategy';
  title: string;
  description: string;
  metricTrigger: string;
  actionLabel?: string;
  actionType?: 'breathing' | 'detox' | 'limit' | 'eye-rest';
}

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  deviceId: string;
  action: string;
  bytesTransferred: number;
  status: 'success' | 'conflict_resolved' | 'pending';
  ciphertextPreview: string;
}

export interface UserSettings {
  overallDailyLimitMinutes: number;
  alarmEnabled: boolean;
  soundVolume: number; // 0 to 1
  snoozeCount: number;
  cloudSyncEnabled: boolean;
  e2eEncryptionEnabled: boolean;
  nightModeSchedule: {
    enabled: boolean;
    startHour: number;
    endHour: number;
  };
  alarmSoundType: 'gentle_chime' | 'pulse_alarm' | 'digital_beep';
}
