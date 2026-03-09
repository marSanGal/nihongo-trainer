import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { getPhraseById } from '../constants/phrases';
import {
  getRollingAverage,
  canUnlockNextBatch,
  getEncouragementMessage,
} from '../utils/progress';
import { BATCH_COUNT } from '../constants/phrases';
import { Rating } from '../types';
import { SessionStackParamList } from '../navigation';

type Props = NativeStackScreenProps<SessionStackParamList, 'Results'>;

export default function ResultsScreen({ navigation, route }: Props) {
  const { avgScore, ratings, flaggedPhrases, newStreak } = route.params;
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { dailySessions, progress } = state;

  const rollingAvg = useMemo(() => getRollingAverage(dailySessions), [dailySessions]);
  const eligible = useMemo(
    () => canUnlockNextBatch(dailySessions, progress.currentBatch, BATCH_COUNT),
    [dailySessions, progress.currentBatch]
  );

  const [expandedCategory, setExpandedCategory] = useState<Rating | null>(null);

  const gotItCount = Object.values(ratings).filter((r) => r === 'got_it').length;
  const almostCount = Object.values(ratings).filter((r) => r === 'almost').length;
  const stillCount = Object.values(ratings).filter((r) => r === 'still_learning').length;
  const total = Object.values(ratings).length;

  const phrasesByRating = useMemo(() => {
    const map: Record<Rating, typeof flaggedPhraseFull> = {
      got_it: [],
      almost: [],
      still_learning: [],
    };
    (Object.entries(ratings) as [string, Rating][]).forEach(([idStr, rating]) => {
      const p = getPhraseById(Number(idStr));
      if (p) map[rating].push(p);
    });
    return map;
  }, [ratings]);

  const flaggedPhraseFull = flaggedPhrases.map((id) => getPhraseById(id)).filter(Boolean);

  function handleUnlockNext() {
    dispatch({ type: 'UNLOCK_BATCH', payload: progress.currentBatch + 1 });
    navigation.getParent()?.navigate('Home');
  }

  function handleUnlockAnyway() {
    dispatch({ type: 'UNLOCK_BATCH', payload: progress.currentBatch + 1 });
    navigation.getParent()?.navigate('Home');
  }

  function handleGoHome() {
    navigation.getParent()?.navigate('Home');
  }

  const isStreakMilestone = newStreak > 0 && newStreak % 7 === 0;
  const encouragement = getEncouragementMessage(avgScore);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.title}>Session Complete! 🎉</Text>
        {isStreakMilestone && (
          <View style={styles.milestoneBanner}>
            <Text style={styles.milestoneText}>🔥 {newStreak} day streak! You're on a roll!</Text>
          </View>
        )}
        <Text style={styles.encouragement}>{encouragement}</Text>

        {/* Score card */}
        <View style={styles.scoreCard}>
          <Text style={styles.scorePercent}>{Math.round(avgScore * 100)}%</Text>
          <Text style={styles.scoreLabel}>today's score</Text>
          <View style={styles.scoreDivider} />
          <Text style={styles.rollingAvgText}>
            3-day average: {Math.round(rollingAvg * 100)}%
          </Text>
        </View>

        {/* Breakdown */}
        <View style={styles.breakdownRow}>
          {([
            { rating: 'got_it' as Rating, emoji: '😄', count: gotItCount, color: Colors.green, bg: '#E8F5EE', label: 'Got it' },
            { rating: 'almost' as Rating, emoji: '🙂', count: almostCount, color: Colors.purple, bg: '#F0EBF8', label: 'Almost' },
            { rating: 'still_learning' as Rating, emoji: '😕', count: stillCount, color: Colors.amber, bg: '#FEF3E2', label: 'Still learning' },
          ]).map(({ rating, emoji, count, color, bg, label }) => (
            <TouchableOpacity
              key={rating}
              style={[styles.breakdownItem, { backgroundColor: bg }, expandedCategory === rating && styles.breakdownItemActive]}
              onPress={() => setExpandedCategory(expandedCategory === rating ? null : rating)}
              activeOpacity={0.75}
            >
              <Text style={styles.breakdownEmoji}>{emoji}</Text>
              <Text style={[styles.breakdownNum, { color }]}>{count}</Text>
              <Text style={styles.breakdownLabel}>{label}</Text>
              {count > 0 && <Text style={[styles.breakdownTap, { color }]}>tap to see</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Expanded phrase list */}
        {expandedCategory && phrasesByRating[expandedCategory].length > 0 && (
          <View style={styles.expandedList}>
            {phrasesByRating[expandedCategory].map((p) => p && (
              <View key={p.id} style={styles.expandedPhrase}>
                <Text style={styles.expandedJapanese}>{p.japanese}</Text>
                <Text style={styles.expandedRomaji}>{p.romaji}</Text>
                <Text style={styles.expandedEnglish}>{p.english}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Streak */}
        <View style={styles.streakCard}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakText}>{newStreak} day streak!</Text>
          {newStreak > 1 && <Text style={styles.streakSub}>Keep it going!</Text>}
        </View>

        {/* Unlock section */}
        {progress.currentBatch < BATCH_COUNT && (
          <View style={styles.unlockSection}>
            {eligible ? (
              <>
                <Text style={styles.unlockTitle}>🎉 You've hit 80%!</Text>
                <Text style={styles.unlockDesc}>
                  Batch {progress.currentBatch + 1} is ready for you!
                </Text>
                <TouchableOpacity style={styles.unlockButton} onPress={handleUnlockNext}>
                  <Text style={styles.unlockButtonText}>Unlock Batch {progress.currentBatch + 1} 🔓</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleGoHome} style={styles.stayLink}>
                  <Text style={styles.stayLinkText}>I'll stay a bit longer</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.unlockHint}>
                  {dailySessions.length < 3
                    ? `Keep going! ${3 - dailySessions.length} more day${3 - dailySessions.length === 1 ? '' : 's'} needed before you can unlock the next batch.`
                    : `Keep your average above 80% to unlock the next batch!`}
                </Text>
                <TouchableOpacity onPress={handleUnlockAnyway} style={styles.unlockAnywayBtn}>
                  <Text style={styles.unlockAnywayText}>Unlock anyway (not recommended)</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Yesterday's misses */}
        {flaggedPhraseFull.length > 0 && (
          <View style={styles.missesSection}>
            <Text style={styles.missesTitle}>📚 Study these before tomorrow:</Text>
            {flaggedPhraseFull.map((p) =>
              p ? (
                <View key={p.id} style={styles.missCard}>
                  <Text style={styles.missJapanese}>{p.japanese}</Text>
                  <Text style={styles.missRomaji}>{p.romaji}</Text>
                  <Text style={styles.missEnglish}>{p.english}</Text>
                </View>
              ) : null
            )}
          </View>
        )}

        {/* Go home */}
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>See you tomorrow! 👋</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightPinkBg },
  container: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.primaryPink, textAlign: 'center', marginBottom: 8 },
  encouragement: { fontSize: 16, color: Colors.textMuted, textAlign: 'center', marginBottom: 20 },

  milestoneBanner: {
    backgroundColor: Colors.amber,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  milestoneText: { color: Colors.white, fontWeight: '700', fontSize: 16, textAlign: 'center' },

  scoreCard: {
    backgroundColor: Colors.primaryPink,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
  },
  scorePercent: { fontSize: 64, fontWeight: '900', color: Colors.white, lineHeight: 72 },
  scoreLabel: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 12 },
  scoreDivider: { width: 40, height: 2, backgroundColor: 'rgba(255,255,255,0.4)', marginBottom: 12 },
  rollingAvgText: { fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },

  breakdownRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  breakdownItem: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  breakdownItemActive: { borderColor: Colors.textMuted },
  breakdownEmoji: { fontSize: 24, marginBottom: 4 },
  breakdownNum: { fontSize: 28, fontWeight: '800' },
  breakdownLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', textAlign: 'center' },
  breakdownTap: { fontSize: 10, marginTop: 4, fontStyle: 'italic' },

  expandedList: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  expandedPhrase: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 12,
  },
  expandedJapanese: { fontSize: 20, fontWeight: '700', color: Colors.primaryPink, marginBottom: 2 },
  expandedRomaji: { fontSize: 13, color: Colors.purple, fontStyle: 'italic', marginBottom: 2 },
  expandedEnglish: { fontSize: 13, color: Colors.textMuted },

  streakCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  streakEmoji: { fontSize: 28 },
  streakText: { fontSize: 18, fontWeight: '700', color: Colors.textDark },
  streakSub: { fontSize: 14, color: Colors.textMuted },

  unlockSection: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  unlockTitle: { fontSize: 20, fontWeight: '800', color: Colors.green, marginBottom: 6 },
  unlockDesc: { fontSize: 14, color: Colors.textMuted, marginBottom: 16, textAlign: 'center' },
  unlockButton: {
    backgroundColor: Colors.green,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginBottom: 10,
  },
  unlockButtonText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  stayLink: { paddingVertical: 6 },
  stayLinkText: { color: Colors.textMuted, fontSize: 14 },
  unlockHint: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', marginBottom: 10 },
  unlockAnywayBtn: { paddingVertical: 6 },
  unlockAnywayText: { color: Colors.textMuted, fontSize: 13, textDecorationLine: 'underline' },

  missesSection: { marginBottom: 20 },
  missesTitle: { fontSize: 16, fontWeight: '700', color: Colors.textDark, marginBottom: 12 },
  missCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colors.amber,
  },
  missJapanese: { fontSize: 22, color: Colors.primaryPink, fontWeight: '700', marginBottom: 4 },
  missRomaji: { fontSize: 14, color: Colors.purple, fontStyle: 'italic', marginBottom: 4 },
  missEnglish: { fontSize: 14, color: Colors.textMuted },

  homeButton: {
    backgroundColor: Colors.purple,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  homeButtonText: { color: Colors.white, fontSize: 18, fontWeight: '700' },
});
