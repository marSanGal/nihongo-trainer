import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { getPhraseById } from '../constants/phrases';
import { Rating } from '../types';
import {
  buildQuizQueue,
  pickCardType,
  calcSessionScore,
  calcStreak,
  getEncouragementMessage,
} from '../utils/progress';
import FlashCard from '../components/FlashCard';
import { SessionStackParamList } from '../navigation';

type Props = NativeStackScreenProps<SessionStackParamList, 'Quiz'>;

export default function QuizScreen({ navigation }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { progress, phraseStats, todayFlagged } = state;

  const queue = useMemo(() => {
    const ids = buildQuizQueue(progress.unlockedPhrases, phraseStats, todayFlagged);
    return ids.map((phraseId) => ({ phraseId, cardType: pickCardType() as 'en_to_jp' | 'jp_to_en' }));
  }, []);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionRatings, setSessionRatings] = useState<Record<number, Rating>>({});

  const today = new Date().toISOString().split('T')[0];
  const current = queue[index];
  const phrase = current ? getPhraseById(current.phraseId) : null;

  function handleReveal() {
    setRevealed(true);
  }

  function handleRate(rating: Rating) {
    if (!current) return;

    const phraseId = current.phraseId;
    dispatch({ type: 'RATE_PHRASE', payload: { phraseId, rating, date: today } });
    const newRatings = { ...sessionRatings, [phraseId]: rating };
    setSessionRatings(newRatings);

    if (index < queue.length - 1) {
      setIndex(index + 1);
      setRevealed(false);
    } else {
      finishSession(newRatings);
    }
  }

  function finishSession(ratings: Record<number, Rating>) {
    const avgScore = calcSessionScore(ratings);
    const flagged = Object.entries(ratings)
      .filter(([, r]) => r === 'still_learning')
      .map(([id]) => Number(id));

    dispatch({
      type: 'SAVE_SESSION',
      payload: { date: today, averageScore: avgScore, flaggedPhrases: flagged },
    });

    const newStreak = calcStreak(progress.streak, progress.lastSessionDate);
    dispatch({
      type: 'UPDATE_STREAK',
      payload: { streak: newStreak, lastSessionDate: today },
    });

    navigation.navigate('Results', {
      avgScore,
      ratings,
      flaggedPhrases: flagged,
      newStreak,
    });
  }

  if (!phrase || !current) return null;

  const tricky = phraseStats[String(current.phraseId)]?.failedStreak >= 3;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((index + 1) / queue.length) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {index + 1} / {queue.length}
        </Text>

        {tricky && (
          <View style={styles.trickyBanner}>
            <Text style={styles.trickyText}>This one's tricky — take an extra look 👀</Text>
          </View>
        )}

        <View style={styles.cardContainer}>
          <FlashCard
            phrase={phrase}
            cardType={current.cardType}
            revealed={revealed}
            onReveal={handleReveal}
          />
        </View>

        {revealed && (
          <View style={styles.ratingRow}>
            <TouchableOpacity
              style={[styles.rateBtn, styles.stillLearningBtn]}
              onPress={() => handleRate('still_learning')}
            >
              <Text style={styles.rateEmoji}>😕</Text>
              <Text style={styles.rateBtnText}>Still{'\n'}learning</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rateBtn, styles.almostBtn]}
              onPress={() => handleRate('almost')}
            >
              <Text style={styles.rateEmoji}>🙂</Text>
              <Text style={styles.rateBtnText}>Almost</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rateBtn, styles.gotItBtn]}
              onPress={() => handleRate('got_it')}
            >
              <Text style={styles.rateEmoji}>😄</Text>
              <Text style={styles.rateBtnText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightPinkBg },
  container: { flex: 1, padding: 24 },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.primaryPink, borderRadius: 3 },
  progressText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', marginBottom: 16 },
  trickyBanner: {
    backgroundColor: Colors.amber,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  trickyText: { color: Colors.white, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  cardContainer: { flex: 1 },
  ratingRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 20,
    paddingBottom: 8,
  },
  rateBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  stillLearningBtn: { backgroundColor: '#FEF3E2' },
  almostBtn: { backgroundColor: '#F0EBF8' },
  gotItBtn: { backgroundColor: '#E8F5EE' },
  rateEmoji: { fontSize: 26, marginBottom: 4 },
  rateBtnText: { fontSize: 11, fontWeight: '600', color: Colors.textDark, textAlign: 'center' },
});
