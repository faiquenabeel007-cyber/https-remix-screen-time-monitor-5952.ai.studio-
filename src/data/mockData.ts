import { AppUsage, ConnectedDevice, MentalHealthInsight, UserSettings } from '../types';

export const DEFAULT_SETTINGS: UserSettings = {
  overallDailyLimitMinutes: 210, // 3h 30m default limit
  alarmEnabled: true,
  soundVolume: 0.8,
  snoozeCount: 0,
  cloudSyncEnabled: true,
  e2eEncryptionEnabled: true,
  nightModeSchedule: {
    enabled: true,
    startHour: 22, // 10 PM
    endHour: 6,   // 6 AM
  },
  alarmSoundType: 'pulse_alarm',
};

export const INITIAL_APPS: AppUsage[] = [
  {
    id: 'app-instagram',
    name: 'Instagram',
    category: 'Social',
    iconName: 'Camera',
    minutesUsed: 65,
    dailyLimitMinutes: 45, // Exceeded!
    pickups: 28,
    lastUsed: '10 mins ago',
    color: '#E1306C',
  },
  {
    id: 'app-youtube',
    name: 'YouTube',
    category: 'Entertainment',
    iconName: 'Tv',
    minutesUsed: 52,
    dailyLimitMinutes: 60,
    pickups: 14,
    lastUsed: '25 mins ago',
    color: '#FF0000',
  },
  {
    id: 'app-vscode',
    name: 'VS Code',
    category: 'Productivity',
    iconName: 'Code',
    minutesUsed: 110,
    dailyLimitMinutes: 240,
    pickups: 8,
    lastUsed: 'Just now',
    color: '#007ACC',
  },
  {
    id: 'app-twitter',
    name: 'X / Twitter',
    category: 'Social',
    iconName: 'MessageSquare',
    minutesUsed: 38,
    dailyLimitMinutes: 30, // Exceeded!
    pickups: 22,
    lastUsed: '1 hour ago',
    color: '#1DA1F2',
  },
  {
    id: 'app-kindle',
    name: 'Kindle Books',
    category: 'Reading',
    iconName: 'BookOpen',
    minutesUsed: 30,
    dailyLimitMinutes: 60,
    pickups: 3,
    lastUsed: '3 hours ago',
    color: '#FF9900',
  },
  {
    id: 'app-duolingo',
    name: 'Duolingo',
    category: 'Productivity',
    iconName: 'GraduationCap',
    minutesUsed: 15,
    dailyLimitMinutes: 20,
    pickups: 2,
    lastUsed: '5 hours ago',
    color: '#58CC02',
  },
];

export const INITIAL_DEVICES: ConnectedDevice[] = [
  {
    id: 'dev-1',
    name: 'iPhone 15 Pro',
    type: 'mobile',
    os: 'iOS 18.2',
    lastSynced: 'Just now',
    status: 'active',
    todayMinutes: 170,
    activeApp: 'Instagram',
    battery: 84,
  },
  {
    id: 'dev-2',
    name: 'MacBook Air M2',
    type: 'desktop',
    os: 'macOS Sequoia 15.1',
    lastSynced: '2 mins ago',
    status: 'synced',
    todayMinutes: 125,
    activeApp: 'VS Code',
    battery: 92,
  },
  {
    id: 'dev-3',
    name: 'iPad Pro 11"',
    type: 'tablet',
    os: 'iPadOS 18.1',
    lastSynced: '45 mins ago',
    status: 'synced',
    todayMinutes: 15,
    activeApp: 'Kindle Books',
    battery: 67,
  },
];

export const MENTAL_HEALTH_INSIGHTS: MentalHealthInsight[] = [
  {
    id: 'mh-1',
    type: 'warning',
    title: 'High Nighttime Screen Exposure',
    description: 'You spent 45 minutes on social media after 10:30 PM last night. Blue light suppression before bed improves deep REM sleep cycles by up to 28%.',
    metricTrigger: 'Late-night usage > 30m',
    actionLabel: 'Enable Night Wind-Down',
    actionType: 'detox',
  },
  {
    id: 'mh-2',
    type: 'warning',
    title: 'Frequent Micro-Pickups Detected',
    description: 'You unlocked your phone 75 times today (avg every 12 minutes). High frequency pickups indicate habitual dopamine check loops rather than conscious intent.',
    metricTrigger: 'Pickups > 60/day',
    actionLabel: 'Start 2-Min Box Breathing',
    actionType: 'breathing',
  },
  {
    id: 'mh-3',
    type: 'strategy',
    title: 'Continuous Focus Session Fatigue',
    description: 'Your continuous screen time reached 85 consecutive minutes without an eye or body pause. Try applying the 20-20-20 rule to lower digital eye strain.',
    metricTrigger: 'Session > 60m continuous',
    actionLabel: 'Launch Eye Rest Timer',
    actionType: 'eye-rest',
  },
  {
    id: 'mh-4',
    type: 'praise',
    title: 'Healthy Educational Balance',
    description: 'Reading & Duolingo accounted for 20% of your total screen time today! Keep prioritizing constructive learning habits over infinite scrolling.',
    metricTrigger: 'Productivity/Reading > 15%',
  },
];

export const HOURLY_USAGE_TODAY = [
  { hour: '6 AM', minutes: 5 },
  { hour: '8 AM', minutes: 25 },
  { hour: '10 AM', minutes: 40 },
  { hour: '12 PM', minutes: 35 },
  { hour: '2 PM', minutes: 50 },
  { hour: '4 PM', minutes: 65 },
  { hour: '6 PM', minutes: 55 },
  { hour: '8 PM', minutes: 35 },
  { hour: '10 PM', minutes: 0 },
];
