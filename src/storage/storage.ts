import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Settings, Progress, PhraseStats, DailySession } from '../types';

const KEYS = {
  SETTINGS: '@nihongo:settings',
  PROGRESS: '@nihongo:progress',
  PHRASE_STATS: '@nihongo:phraseStats',
  DAILY_SESSIONS: '@nihongo:dailySessions',
  TODAY_FLAGGED: '@nihongo:todayFlagged',
};

const defaultSettings: Settings = {
  departureDate: '',
  setupComplete: false,
};

const defaultProgress: Progress = {
  currentBatch: 1,
  unlockedPhrases: [1, 2, 3, 4], // Batch 1 unlocked by default
  unseenBatchPhrases: [1, 2, 3, 4],
  streak: 0,
  lastSessionDate: null,
};

export async function loadAppState(): Promise<Omit<AppState, 'isLoaded'>> {
  try {
    const [settingsRaw, progressRaw, phraseStatsRaw, sessionsRaw, flaggedRaw] =
      await Promise.all([
        AsyncStorage.getItem(KEYS.SETTINGS),
        AsyncStorage.getItem(KEYS.PROGRESS),
        AsyncStorage.getItem(KEYS.PHRASE_STATS),
        AsyncStorage.getItem(KEYS.DAILY_SESSIONS),
        AsyncStorage.getItem(KEYS.TODAY_FLAGGED),
      ]);

    return {
      settings: settingsRaw ? JSON.parse(settingsRaw) : defaultSettings,
      progress: progressRaw ? JSON.parse(progressRaw) : defaultProgress,
      phraseStats: phraseStatsRaw ? JSON.parse(phraseStatsRaw) : {},
      dailySessions: sessionsRaw ? JSON.parse(sessionsRaw) : [],
      todayFlagged: flaggedRaw ? JSON.parse(flaggedRaw) : [],
    };
  } catch {
    return {
      settings: defaultSettings,
      progress: defaultProgress,
      phraseStats: {},
      dailySessions: [],
      todayFlagged: [],
    };
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

export async function saveProgress(progress: Progress): Promise<void> {
  await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
}

export async function savePhraseStats(stats: Record<string, PhraseStats>): Promise<void> {
  await AsyncStorage.setItem(KEYS.PHRASE_STATS, JSON.stringify(stats));
}

export async function saveDailySessions(sessions: DailySession[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.DAILY_SESSIONS, JSON.stringify(sessions));
}

export async function saveTodayFlagged(flagged: number[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.TODAY_FLAGGED, JSON.stringify(flagged));
}

export async function clearAllData(): Promise<void> {
  for (const key of Object.values(KEYS)) {
    await AsyncStorage.removeItem(key);
  }
}
