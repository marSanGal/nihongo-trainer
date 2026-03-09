export type Rating = 'still_learning' | 'almost' | 'got_it';

export interface Settings {
  departureDate: string; // ISO date string e.g. "2026-04-27"
  setupComplete: boolean;
}

export interface Progress {
  currentBatch: number;
  unlockedPhrases: number[];
  unseenBatchPhrases: number[]; // phrases unlocked but not yet seen in Lesson screen
  streak: number;
  lastSessionDate: string | null;
}

export interface PhraseStats {
  totalSeen: number;
  gotItCount: number;
  almostCount: number;
  stillLearningCount: number;
  lastRating: Rating | null;
  failedStreak: number; // consecutive days rated still_learning
  lastSeenDate: string | null;
}

export interface DailySession {
  date: string;
  averageScore: number; // 0–1, fraction of got_it ratings
  flaggedPhrases: number[]; // phrase ids rated still_learning
}

export interface AppState {
  settings: Settings;
  progress: Progress;
  phraseStats: Record<string, PhraseStats>;
  dailySessions: DailySession[];
  todayFlagged: number[];
  isLoaded: boolean;
}

export type AppAction =
  | { type: 'LOAD_STATE'; payload: Omit<AppState, 'isLoaded'> }
  | { type: 'SET_DEPARTURE_DATE'; payload: string }
  | { type: 'COMPLETE_SETUP' }
  | { type: 'UNLOCK_BATCH'; payload: number }
  | { type: 'MARK_BATCH_SEEN'; payload: number[] }
  | { type: 'RATE_PHRASE'; payload: { phraseId: number; rating: Rating; date: string } }
  | { type: 'SAVE_SESSION'; payload: DailySession }
  | { type: 'UPDATE_STREAK'; payload: { streak: number; lastSessionDate: string } };
