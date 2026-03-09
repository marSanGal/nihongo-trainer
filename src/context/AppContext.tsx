import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { AppState, AppAction, PhraseStats, Rating } from '../types';
import {
  loadAppState,
  saveSettings,
  saveProgress,
  savePhraseStats,
  saveDailySessions,
  saveTodayFlagged,
} from '../storage/storage';

const initialState: AppState = {
  settings: { departureDate: '', setupComplete: false },
  progress: {
    currentBatch: 1,
    unlockedPhrases: [1, 2, 3, 4],
    unseenBatchPhrases: [1, 2, 3, 4],
    streak: 0,
    lastSessionDate: null,
  },
  phraseStats: {},
  dailySessions: [],
  todayFlagged: [],
  isLoaded: false,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload, isLoaded: true };

    case 'SET_DEPARTURE_DATE':
      return {
        ...state,
        settings: { ...state.settings, departureDate: action.payload },
      };

    case 'COMPLETE_SETUP':
      return {
        ...state,
        settings: { ...state.settings, setupComplete: true },
      };

    case 'UNLOCK_BATCH': {
      const batch = action.payload;
      const newPhrases = require('../constants/phrases').PHRASES.filter(
        (p: { batch: number }) => p.batch === batch
      ).map((p: { id: number }) => p.id);
      return {
        ...state,
        progress: {
          ...state.progress,
          currentBatch: batch,
          unlockedPhrases: [...state.progress.unlockedPhrases, ...newPhrases],
          unseenBatchPhrases: [...state.progress.unseenBatchPhrases, ...newPhrases],
        },
      };
    }

    case 'MARK_BATCH_SEEN': {
      const seenIds = action.payload;
      return {
        ...state,
        progress: {
          ...state.progress,
          unseenBatchPhrases: state.progress.unseenBatchPhrases.filter(
            (id) => !seenIds.includes(id)
          ),
        },
      };
    }

    case 'RATE_PHRASE': {
      const { phraseId, rating, date } = action.payload;
      const key = String(phraseId);
      const existing: PhraseStats = state.phraseStats[key] ?? {
        totalSeen: 0,
        gotItCount: 0,
        almostCount: 0,
        stillLearningCount: 0,
        lastRating: null,
        failedStreak: 0,
        lastSeenDate: null,
      };

      const wasFailedYesterday = state.todayFlagged.includes(phraseId);
      const failedStreak =
        rating === 'still_learning'
          ? (wasFailedYesterday ? existing.failedStreak + 1 : 1)
          : 0;

      const updated: PhraseStats = {
        totalSeen: existing.totalSeen + 1,
        gotItCount: existing.gotItCount + (rating === 'got_it' ? 1 : 0),
        almostCount: existing.almostCount + (rating === 'almost' ? 1 : 0),
        stillLearningCount: existing.stillLearningCount + (rating === 'still_learning' ? 1 : 0),
        lastRating: rating,
        failedStreak,
        lastSeenDate: date,
      };

      return {
        ...state,
        phraseStats: { ...state.phraseStats, [key]: updated },
      };
    }

    case 'SAVE_SESSION': {
      const session = action.payload;
      const existing = state.dailySessions.filter((s) => s.date !== session.date);
      const updated = [...existing, session].slice(-30); // keep last 30 days
      const newFlagged = session.flaggedPhrases;
      return {
        ...state,
        dailySessions: updated,
        todayFlagged: newFlagged,
      };
    }

    case 'UPDATE_STREAK':
      return {
        ...state,
        progress: {
          ...state.progress,
          streak: action.payload.streak,
          lastSessionDate: action.payload.lastSessionDate,
        },
      };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load persisted state on mount
  useEffect(() => {
    loadAppState().then((persisted) => {
      dispatch({ type: 'LOAD_STATE', payload: persisted });
    });
  }, []);

  // Persist on state changes
  useEffect(() => {
    if (!state.isLoaded) return;
    saveSettings(state.settings);
    saveProgress(state.progress);
    savePhraseStats(state.phraseStats);
    saveDailySessions(state.dailySessions);
    saveTodayFlagged(state.todayFlagged);
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used inside AppProvider');
  return ctx.state;
}

export function useAppDispatch() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppDispatch must be used inside AppProvider');
  return ctx.dispatch;
}
