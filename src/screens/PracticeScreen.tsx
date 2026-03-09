import React, { useState, useMemo, useRef, useEffect } from 'react';
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
import { PHRASES, getPhraseById, Phrase } from '../constants/phrases';
import { pickCardType, shuffleArray } from '../utils/progress';
import { useAppState } from '../context/AppContext';
import { SessionStackParamList } from '../navigation';

type Props = NativeStackScreenProps<SessionStackParamList, 'Practice'>;
type CardType = 'en_to_jp' | 'jp_to_en';
type AnswerState = 'idle' | 'correct' | 'wrong';

interface QueueItem {
  phraseId: number;
  cardType: CardType;
}

interface Option {
  text: string;      // the value used for answer matching
  romaji?: string;   // shown below Japanese options
}

function buildOptions(correct: Phrase, cardType: CardType, allPhrases: Phrase[]): Option[] {
  if (cardType === 'en_to_jp') {
    const correctOpt: Option = { text: correct.japanese, romaji: correct.romaji };
    const wrongOpts: Option[] = shuffleArray(
      allPhrases.filter((p) => p.id !== correct.id)
    )
      .slice(0, 3)
      .map((p) => ({ text: p.japanese, romaji: p.romaji }));
    return shuffleArray([correctOpt, ...wrongOpts]);
  } else {
    const correctOpt: Option = { text: correct.english };
    const wrongOpts: Option[] = shuffleArray(
      allPhrases.filter((p) => p.id !== correct.id)
    )
      .slice(0, 3)
      .map((p) => ({ text: p.english }));
    return shuffleArray([correctOpt, ...wrongOpts]);
  }
}

function buildQueue(phraseIds: number[]): QueueItem[] {
  return shuffleArray(phraseIds).map((id) => ({
    phraseId: id,
    cardType: pickCardType() as CardType,
  }));
}

export default function PracticeScreen({ navigation, route }: Props) {
  const { phraseIds } = route.params;
  const state = useAppState();

  const allUnlocked = useMemo(
    () => PHRASES.filter((p) => state.progress.unlockedPhrases.includes(p.id)),
    [state.progress.unlockedPhrases]
  );

  const CORRECT_TO_PASS = 2;
  const totalToPass = phraseIds.length;

  const [queue, setQueue] = useState<QueueItem[]>(() => buildQueue(phraseIds));
  const [queueIndex, setQueueIndex] = useState(0);
  // tracks how many times each phrase has been answered correctly
  const [correctCounts, setCorrectCounts] = useState<Record<number, number>>({});

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [options, setOptions] = useState<Option[]>([]);

  const feedbackAnim = useRef(new Animated.Value(0)).current;

  const current = queue[queueIndex];
  const phrase = current ? getPhraseById(current.phraseId) : null;

  useEffect(() => {
    if (!phrase || !current) return;
    setOptions(buildOptions(phrase, current.cardType, allUnlocked));
    setSelectedAnswer(null);
    setAnswerState('idle');
  }, [queueIndex, queue]);

  function flashFeedback() {
    feedbackAnim.setValue(0);
    Animated.sequence([
      Animated.timing(feedbackAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(feedbackAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start();
  }

  function handleAnswer(answer: string) {
    if (answerState !== 'idle' || !phrase || !current) return;

    const correctAnswer =
      current.cardType === 'en_to_jp' ? phrase.japanese : phrase.english;
    const isCorrect = answer === correctAnswer;

    setSelectedAnswer(answer);
    setAnswerState(isCorrect ? 'correct' : 'wrong');
    flashFeedback();

    setTimeout(() => {
      if (isCorrect) {
        const newCounts = { ...correctCounts, [current.phraseId]: (correctCounts[current.phraseId] ?? 0) + 1 };
        setCorrectCounts(newCounts);

        const isPassed = newCounts[current.phraseId] >= CORRECT_TO_PASS;
        const remaining = phraseIds.filter((id) => (newCounts[id] ?? 0) < CORRECT_TO_PASS);

        if (remaining.length === 0) {
          navigation.navigate('Transition');
          return;
        }

        advanceQueue(newCounts, remaining);
      } else {
        const remaining = phraseIds.filter((id) => (correctCounts[id] ?? 0) < CORRECT_TO_PASS);
        advanceQueue(correctCounts, remaining);
      }
    }, isCorrect ? 900 : 1600);
  }

  function advanceQueue(counts: Record<number, number>, remaining: number[]) {
    const nextIndex = queueIndex + 1;
    if (nextIndex < queue.length) {
      setQueueIndex(nextIndex);
    } else {
      setQueue(buildQueue(remaining));
      setQueueIndex(0);
    }
  }

  if (!phrase || !current) return null;

  const correctAnswer =
    current.cardType === 'en_to_jp' ? phrase.japanese : phrase.english;
  const correctRomaji =
    current.cardType === 'en_to_jp' ? phrase.romaji : undefined;
  const passedCount = phraseIds.filter((id) => (correctCounts[id] ?? 0) >= CORRECT_TO_PASS).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Progress bar */}
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>🎯 Practice</Text>
          <Text style={styles.progressCount}>{passedCount} / {totalToPass} passed</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(passedCount / totalToPass) * 100}%` }]} />
        </View>

        {/* Question card */}
        <View style={styles.card}>
          <Text style={styles.directionHint}>
            {current.cardType === 'en_to_jp' ? 'English → Japanese' : 'Japanese → English'}
          </Text>
          <Text style={styles.question}>
            {current.cardType === 'en_to_jp' ? phrase.english : phrase.japanese}
          </Text>
          {current.cardType === 'jp_to_en' && (
            <Text style={styles.questionSub}>{phrase.romaji}</Text>
          )}
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {options.map((option) => {
            const isSelected = selectedAnswer === option.text;
            const isCorrectOption = option.text === correctAnswer;

            let btnStyle = styles.optionBtn;
            let textStyle = styles.optionText;
            let romajiStyle = styles.optionRomaji;

            if (answerState !== 'idle') {
              if (isCorrectOption) {
                btnStyle = { ...styles.optionBtn, ...styles.optionCorrect };
                textStyle = { ...styles.optionText, ...styles.optionTextCorrect };
                romajiStyle = { ...styles.optionRomaji, color: Colors.green };
              } else if (isSelected) {
                btnStyle = { ...styles.optionBtn, ...styles.optionWrong };
                textStyle = { ...styles.optionText, ...styles.optionTextWrong };
              } else {
                btnStyle = { ...styles.optionBtn, ...styles.optionDimmed };
              }
            }

            return (
              <TouchableOpacity
                key={option.text}
                style={btnStyle}
                onPress={() => handleAnswer(option.text)}
                activeOpacity={answerState === 'idle' ? 0.75 : 1}
                disabled={answerState !== 'idle'}
              >
                <Text style={textStyle} numberOfLines={2}>{option.text}</Text>
                {option.romaji && (
                  <Text style={romajiStyle} numberOfLines={1}>{option.romaji}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feedback */}
        {answerState !== 'idle' && (
          <View style={[
            styles.feedbackBanner,
            answerState === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong,
          ]}>
            <Text style={styles.feedbackText}>
              {answerState === 'correct'
                ? '✓ Correct! 🎉'
                : `✗ ${correctAnswer}`}
            </Text>
            {answerState === 'wrong' && correctRomaji && (
              <Text style={styles.feedbackRomaji}>{correctRomaji}</Text>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightPinkBg },
  container: { flex: 1, padding: 20 },

  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: { fontSize: 14, fontWeight: '700', color: Colors.purple },
  progressCount: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.purple, borderRadius: 4 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.primaryPink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  directionHint: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 14,
  },
  question: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: 36,
  },
  questionSub: {
    fontSize: 16,
    color: Colors.purple,
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },

  optionsContainer: { gap: 10, flex: 1 },
  optionBtn: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCorrect: { backgroundColor: '#E8F5EE', borderColor: Colors.green },
  optionWrong: { backgroundColor: '#FEE8E8', borderColor: '#D63333' },
  optionDimmed: { opacity: 0.45 },
  optionText: {
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: '700' as const,
    textAlign: 'center' as const,
  },
  optionTextCorrect: { color: Colors.green, fontWeight: '700' as const },
  optionTextWrong: { color: '#D63333', fontWeight: '700' as const },
  optionRomaji: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic' as const,
    marginTop: 2,
    textAlign: 'center' as const,
  },

  feedbackBanner: {
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  feedbackCorrect: { backgroundColor: '#E8F5EE' },
  feedbackWrong: { backgroundColor: '#FEE8E8' },
  feedbackText: { fontSize: 15, fontWeight: '700', color: Colors.textDark },
  feedbackRomaji: { fontSize: 13, color: Colors.textMuted, fontStyle: 'italic', marginTop: 2 },
});
