import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { getPhraseById } from '../constants/phrases';
import { Rating } from '../types';
import { buildSimpleQueue, pickCardType } from '../utils/progress';
import FlashCard from '../components/FlashCard';
import { SessionStackParamList } from '../navigation';
import { useAppState } from '../context/AppContext';

type Props = NativeStackScreenProps<SessionStackParamList, 'WarmUp'>;

export default function WarmUpScreen({ navigation, route }: Props) {
  const { phraseIds } = route.params;
  const state = useAppState();
  const { progress } = state;

  const queue = useMemo(() => {
    return buildSimpleQueue(phraseIds).map((id) => ({
      phraseId: id,
      cardType: pickCardType() as 'en_to_jp' | 'jp_to_en',
    }));
  }, [phraseIds]);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const current = queue[index];
  const phrase = current ? getPhraseById(current.phraseId) : null;

  function handleReveal() {
    setRevealed(true);
  }

  function handleNext() {
    if (index < queue.length - 1) {
      setIndex(index + 1);
      setRevealed(false);
    } else {
      // Done with warm-up — go to Lesson if unseen phrases, else Practice
      if (progress.unseenBatchPhrases.length > 0) {
        navigation.replace('Lesson');
      } else {
        navigation.replace('Practice', { phraseIds: progress.unlockedPhrases });
      }
    }
  }

  if (!phrase || !current) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((index + 1) / queue.length) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{index + 1} / {queue.length}</Text>

        <Text style={styles.sectionLabel}>🔁 Yesterday's Misses</Text>
        <Text style={styles.sectionSub}>Let's warm up with the ones you missed!</Text>

        <View style={styles.cardContainer}>
          <FlashCard
            phrase={phrase}
            cardType={current.cardType}
            revealed={revealed}
            onReveal={handleReveal}
          />
        </View>

        {revealed && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {index < queue.length - 1 ? 'Next →' : "Let's continue! 💪"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightPinkBg },
  container: { flex: 1, padding: 24 },
  progressBar: { height: 6, backgroundColor: Colors.border, borderRadius: 3, marginBottom: 8, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.amber, borderRadius: 3 },
  progressText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', marginBottom: 16 },
  sectionLabel: { fontSize: 22, fontWeight: '800', color: Colors.amber, textAlign: 'center', marginBottom: 4 },
  sectionSub: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', marginBottom: 20 },
  cardContainer: { flex: 1 },
  nextButton: {
    backgroundColor: Colors.amber,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: { color: Colors.white, fontSize: 18, fontWeight: '700' },
});
