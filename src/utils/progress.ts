import { DailySession, PhraseStats, Rating } from '../types';
import { PHRASES, getPhrasesByBatch } from '../constants/phrases';

/** Calculate 3-day rolling average score (fraction of got_it ratings) */
export function getRollingAverage(sessions: DailySession[]): number {
  if (sessions.length === 0) return 0;
  const recent = sessions.slice(-3);
  const avg = recent.reduce((sum, s) => sum + s.averageScore, 0) / recent.length;
  return avg;
}

/** Check if user is eligible to unlock next batch (80% threshold over at least 3 days) */
export function canUnlockNextBatch(
  sessions: DailySession[],
  currentBatch: number,
  totalBatches: number
): boolean {
  if (currentBatch >= totalBatches) return false;
  if (sessions.length < 3) return false;
  const avg = getRollingAverage(sessions);
  return avg >= 0.8;
}

/** Get the pace indicator based on current batch vs expected batch for today's date */
export function getPaceIndicator(
  currentBatch: number,
  departureDate: string
): 'ahead' | 'on_track' | 'behind' {
  const today = new Date();
  const departure = new Date(departureDate);
  const totalDays = Math.max(
    1,
    Math.floor((departure.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );
  // 7 weeks = 49 days total; each week = 1 batch
  const weeksRemaining = totalDays / 7;
  const batchesRemaining = 7 - currentBatch;

  if (batchesRemaining <= weeksRemaining - 1) return 'ahead';
  if (batchesRemaining <= weeksRemaining) return 'on_track';
  return 'behind';
}

/** Calculate days until departure */
export function getDaysUntilDeparture(departureDate: string): number {
  if (!departureDate) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const departure = new Date(departureDate);
  departure.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((departure.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}

/** Build a weighted card queue for the quiz session */
export function buildQuizQueue(
  unlockedPhraseIds: number[],
  phraseStats: Record<string, PhraseStats>,
  todayFlagged: number[]
): number[] {
  const queue: number[] = [];

  for (const id of unlockedPhraseIds) {
    const stats = phraseStats[String(id)];
    let weight = 2; // default

    if (!stats || stats.lastRating === null) {
      weight = 2;
    } else if (stats.lastRating === 'got_it') {
      weight = 1;
    } else if (stats.lastRating === 'almost') {
      weight = 2;
    } else {
      weight = stats.failedStreak >= 3 ? 4 : 3;
    }

    // Flagged from yesterday — boost
    if (todayFlagged.includes(id)) {
      weight = Math.max(weight, 3);
    }

    for (let i = 0; i < weight; i++) {
      queue.push(id);
    }
  }

  return shuffleArray(queue);
}

/** Shuffle array in-place (Fisher-Yates) */
export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Calculate session average score from a rating map */
export function calcSessionScore(ratings: Record<number, Rating>): number {
  const values = Object.values(ratings);
  if (values.length === 0) return 0;
  const gotItCount = values.filter((r) => r === 'got_it').length;
  return gotItCount / values.length;
}

/** Update streak given the last session date */
export function calcStreak(currentStreak: number, lastSessionDate: string | null): number {
  if (!lastSessionDate) return 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last = new Date(lastSessionDate);
  last.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return currentStreak; // already did session today
  if (diffDays === 1) return currentStreak + 1;
  return 1; // streak broken
}

/** Get an encouraging message based on average score */
export function getEncouragementMessage(avg: number): string {
  if (avg >= 0.9) return "Incredible! You're on fire! 🔥";
  if (avg >= 0.8) return 'Amazing work! Japan is getting closer! 🇯🇵';
  if (avg >= 0.7) return "Great session! Keep it up! 💪";
  if (avg >= 0.5) return "Good effort! Every session counts! 🌸";
  return "Practice makes perfect! You've got this! 🌱";
}

/** Build a deduplicated queue from a phrase id list (for warm-up and practice) */
export function buildSimpleQueue(phraseIds: number[]): number[] {
  return shuffleArray([...new Set(phraseIds)]);
}

/** Determine card type: 'en_to_jp' or 'jp_to_en' based on 70/30 ratio */
export function pickCardType(): 'en_to_jp' | 'jp_to_en' {
  return Math.random() < 0.7 ? 'en_to_jp' : 'jp_to_en';
}
