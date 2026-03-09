import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { getPhrasesByIds } from '../constants/phrases';
import { SessionStackParamList } from '../navigation';

type Props = NativeStackScreenProps<SessionStackParamList, 'Lesson'>;

export default function LessonScreen({ navigation }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const unseenPhrases = getPhrasesByIds(state.progress.unseenBatchPhrases);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const phrase = unseenPhrases[index];

  function handleReveal() {
    setRevealed(true);
  }

  function handleNext() {
    if (index < unseenPhrases.length - 1) {
      setIndex(index + 1);
      setRevealed(false);
    } else {
      // All phrases seen — mark them as seen, then Practice with ALL unlocked phrases
      dispatch({ type: 'MARK_BATCH_SEEN', payload: state.progress.unseenBatchPhrases });
      navigation.navigate('Practice', { phraseIds: state.progress.unlockedPhrases });
    }
  }

  if (!phrase) {
    // No unseen phrases — skip straight to Practice
    navigation.navigate('Practice', { phraseIds: state.progress.unlockedPhrases });
    return null;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Progress indicator */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((index + 1) / unseenPhrases.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {index + 1} / {unseenPhrases.length} new phrases
        </Text>

        <Text style={styles.sectionLabel}>📖 New Phrases</Text>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.categoryLabel}>{phrase.category}</Text>

          <Text style={styles.englishText}>{phrase.english}</Text>

          {!revealed ? (
            <TouchableOpacity style={styles.revealButton} onPress={handleReveal} activeOpacity={0.8}>
              <Text style={styles.revealButtonText}>Tap to see Japanese 👆</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.japaneseContainer}>
              <Text style={styles.japaneseText}>{phrase.japanese}</Text>
              <Text style={styles.romajiText}>{phrase.romaji}</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomArea}>
          {revealed && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.nextButtonText}>
                {index < unseenPhrases.length - 1 ? 'Got it, next →' : 'Start practice! 🎯'}
              </Text>
            </TouchableOpacity>
          )}
          <Text style={styles.hint}>No pressure — just absorb it! 🌸</Text>
        </View>
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
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primaryPink,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 16,
  },

  sectionLabel: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primaryPink,
    textAlign: 'center',
    marginBottom: 24,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    flex: 1,
    shadowColor: Colors.primaryPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
    fontWeight: '600',
  },
  englishText: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 36,
  },
  revealButton: {
    backgroundColor: Colors.lightPinkBg,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  revealButtonText: {
    color: Colors.primaryPink,
    fontSize: 16,
    fontWeight: '600',
  },
  japaneseContainer: { alignItems: 'center' },
  japaneseText: {
    fontSize: 36,
    color: Colors.primaryPink,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 48,
  },
  romajiText: {
    fontSize: 18,
    color: Colors.purple,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  bottomArea: { paddingTop: 24, alignItems: 'center' },
  nextButton: {
    backgroundColor: Colors.primaryPink,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginBottom: 12,
    shadowColor: Colors.primaryPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    width: '100%',
    alignItems: 'center',
  },
  nextButtonText: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  hint: { fontSize: 14, color: Colors.textMuted },
});
