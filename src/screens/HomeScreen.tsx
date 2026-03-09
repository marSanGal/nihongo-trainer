import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { useAppState } from '../context/AppContext';
import {
  getDaysUntilDeparture,
  getPaceIndicator,
  getRollingAverage,
  canUnlockNextBatch,
} from '../utils/progress';
import { BATCH_COUNT, TOTAL_PHRASES } from '../constants/phrases';
import { RootStackParamList } from '../navigation';
import { clearAllData } from '../storage/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const PACE_CONFIG = {
  ahead: { emoji: '🚀', label: 'Ahead of schedule', color: Colors.green },
  on_track: { emoji: '✅', label: 'On track', color: Colors.purple },
  behind: { emoji: '🌱', label: 'Take your time', color: Colors.amber },
};

export default function HomeScreen({ navigation }: Props) {
  const state = useAppState();
  const { settings, progress, dailySessions } = state;

  const daysLeft = useMemo(
    () => getDaysUntilDeparture(settings.departureDate),
    [settings.departureDate]
  );

  const rollingAvg = useMemo(() => getRollingAverage(dailySessions), [dailySessions]);

  const pace = useMemo(
    () =>
      settings.departureDate
        ? getPaceIndicator(progress.currentBatch, settings.departureDate)
        : 'on_track',
    [progress.currentBatch, settings.departureDate]
  );

  const paceConfig = PACE_CONFIG[pace];

  const canUnlock = useMemo(
    () => canUnlockNextBatch(dailySessions, progress.currentBatch, BATCH_COUNT),
    [dailySessions, progress.currentBatch]
  );

  const hasUnseenPhrases = progress.unseenBatchPhrases.length > 0;

  function handleStartSession() {
    navigation.navigate('Session');
  }

  function handleViewProgress() {
    navigation.navigate('Progress');
  }

  function handleReset() {
    Alert.alert('Reset app data', 'This will delete all progress and start over.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await clearAllData();
          navigation.replace('Onboarding');
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.flag}>🇯🇵</Text>
          <Text style={styles.title}>Nihongo Trainer</Text>
        </View>

        {/* Countdown card */}
        <View style={[styles.card, styles.countdownCard]}>
          <Text style={styles.countdownNumber}>{daysLeft}</Text>
          <Text style={styles.countdownLabel}>days until Japan ✈️</Text>
          <View style={styles.paceRow}>
            <Text style={[styles.paceText, { color: paceConfig.color }]}>
              {paceConfig.emoji} {paceConfig.label}
            </Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statNumber}>{progress.streak}</Text>
            <Text style={styles.statLabel}>day streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📖</Text>
            <Text style={styles.statNumber}>{progress.unlockedPhrases.length}</Text>
            <Text style={styles.statLabel}>of {TOTAL_PHRASES} phrases</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statNumber}>{Math.round(rollingAvg * 100)}%</Text>
            <Text style={styles.statLabel}>3-day avg</Text>
          </View>
        </View>

        {/* Unlock nudge */}
        {canUnlock && progress.currentBatch < BATCH_COUNT && (
          <View style={styles.unlockBanner}>
            <Text style={styles.unlockBannerText}>
              🎉 You're crushing it! Batch {progress.currentBatch + 1} is ready to unlock!
            </Text>
          </View>
        )}

        {/* New phrases nudge */}
        {hasUnseenPhrases && (
          <View style={styles.newBanner}>
            <Text style={styles.newBannerText}>
              ✨ New phrases waiting for you in today's session!
            </Text>
          </View>
        )}

        {/* Main CTA */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartSession}
          activeOpacity={0.85}
        >
          <Text style={styles.startButtonText}>Start Today's Session 🎌</Text>
        </TouchableOpacity>

        {/* Progress link */}
        <TouchableOpacity style={styles.progressLink} onPress={handleViewProgress}>
          <Text style={styles.progressLinkText}>View all phrases →</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetLink} onPress={handleReset}>
          <Text style={styles.resetLinkText}>⚙️ Change departure date / Reset</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightPinkBg },
  container: { padding: 24, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 24 },
  flag: { fontSize: 48, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.primaryPink },

  card: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  countdownCard: {
    backgroundColor: Colors.primaryPink,
    alignItems: 'center',
  },
  countdownNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: Colors.white,
    lineHeight: 72,
  },
  countdownLabel: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  paceRow: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  paceText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statEmoji: { fontSize: 24, marginBottom: 4 },
  statNumber: { fontSize: 22, fontWeight: '800', color: Colors.textDark },
  statLabel: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', marginTop: 2 },

  unlockBanner: {
    backgroundColor: Colors.green,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  unlockBannerText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },

  newBanner: {
    backgroundColor: Colors.purple,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  newBannerText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  startButton: {
    backgroundColor: Colors.primaryPink,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.primaryPink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  startButtonText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '800',
  },

  progressLink: { alignItems: 'center', paddingVertical: 8 },
  progressLinkText: { fontSize: 16, color: Colors.purple, fontWeight: '600' },
  resetLink: { alignItems: 'center', paddingVertical: 8, marginTop: 8 },
  resetLinkText: { fontSize: 13, color: Colors.textMuted },
});
