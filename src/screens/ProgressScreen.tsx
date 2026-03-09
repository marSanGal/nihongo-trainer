import React, { useState } from 'react';
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
import { useAppState } from '../context/AppContext';
import { PHRASES, Category } from '../constants/phrases';
import { getRollingAverage } from '../utils/progress';
import { Rating } from '../types';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Progress'>;

const CATEGORIES: Category[] = [
  'Basic Phrases',
  'Navigating the City',
  'Restaurants & Shopping',
  'Convenience Store & Photos',
];

function getPhraseStatus(
  phraseId: number,
  unlockedPhrases: number[],
  phraseStats: Record<string, any>
): { emoji: string; label: string } {
  if (!unlockedPhrases.includes(phraseId)) return { emoji: '🔒', label: 'Locked' };
  const stats = phraseStats[String(phraseId)];
  if (!stats || stats.totalSeen === 0) return { emoji: '📖', label: 'New' };
  const ratio = stats.gotItCount / stats.totalSeen;
  if (ratio >= 0.7) return { emoji: '⭐', label: 'Confident' };
  return { emoji: '📖', label: 'Learning' };
}

export default function ProgressScreen({ navigation }: Props) {
  const state = useAppState();
  const { progress, phraseStats, dailySessions } = state;
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const rollingAvg = getRollingAverage(dailySessions);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Progress</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statNumber}>{progress.streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statNumber}>{Math.round(rollingAvg * 100)}%</Text>
            <Text style={styles.statLabel}>3-day avg</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📖</Text>
            <Text style={styles.statNumber}>{progress.unlockedPhrases.length}</Text>
            <Text style={styles.statLabel}>Unlocked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📅</Text>
            <Text style={styles.statNumber}>{dailySessions.length}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
        </View>

        {/* Phrases by category */}
        {CATEGORIES.map((category) => {
          const phrasesInCat = PHRASES.filter((p) => p.category === category);
          return (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {phrasesInCat.map((phrase) => {
                const status = getPhraseStatus(phrase.id, progress.unlockedPhrases, phraseStats);
                const isExpanded = expandedId === phrase.id;
                const isLocked = !progress.unlockedPhrases.includes(phrase.id);

                return (
                  <TouchableOpacity
                    key={phrase.id}
                    style={[styles.phraseRow, isLocked && styles.phraseRowLocked]}
                    onPress={() => {
                      if (!isLocked) setExpandedId(isExpanded ? null : phrase.id);
                    }}
                    activeOpacity={isLocked ? 1 : 0.7}
                  >
                    <View style={styles.phraseRowTop}>
                      <Text style={styles.phraseStatusEmoji}>{status.emoji}</Text>
                      <View style={styles.phraseTextGroup}>
                        <Text
                          style={[styles.phraseEnglish, isLocked && styles.phraseTextLocked]}
                          numberOfLines={1}
                        >
                          {isLocked ? '—————' : phrase.english}
                        </Text>
                        {!isLocked && !isExpanded && (
                          <>
                            <Text style={styles.phraseJapaneseSmall} numberOfLines={1}>
                              {phrase.japanese}
                            </Text>
                            <Text style={styles.phraseRomajiSmall} numberOfLines={1}>
                              {phrase.romaji}
                            </Text>
                          </>
                        )}
                      </View>
                      {!isLocked && (
                        <Text style={styles.expandArrow}>{isExpanded ? '▲' : '▼'}</Text>
                      )}
                    </View>

                    {isExpanded && !isLocked && (
                      <View style={styles.phraseExpanded}>
                        <Text style={styles.phraseJapaneseLarge}>{phrase.japanese}</Text>
                        <Text style={styles.phraseRomaji}>{phrase.romaji}</Text>
                        <Text style={styles.phraseEnglishFull}>{phrase.english}</Text>
                        {phraseStats[String(phrase.id)] && (
                          <View style={styles.phraseStatRow}>
                            <Text style={styles.phraseStat}>
                              😄 {phraseStats[String(phrase.id)].gotItCount}
                            </Text>
                            <Text style={styles.phraseStat}>
                              🙂 {phraseStats[String(phrase.id)].almostCount}
                            </Text>
                            <Text style={styles.phraseStat}>
                              😕 {phraseStats[String(phrase.id)].stillLearningCount}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightPinkBg },
  container: { padding: 24, paddingBottom: 40 },
  backBtn: { marginBottom: 8 },
  backBtnText: { fontSize: 16, color: Colors.purple, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: Colors.primaryPink, marginBottom: 20 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statEmoji: { fontSize: 20, marginBottom: 2 },
  statNumber: { fontSize: 18, fontWeight: '800', color: Colors.textDark },
  statLabel: { fontSize: 10, color: Colors.textMuted, textAlign: 'center', marginTop: 2 },

  categorySection: { marginBottom: 24 },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.purple,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },

  phraseRow: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  phraseRowLocked: { opacity: 0.5 },
  phraseRowTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  phraseStatusEmoji: { fontSize: 20, width: 28 },
  phraseTextGroup: { flex: 1 },
  phraseEnglish: { fontSize: 15, fontWeight: '600', color: Colors.textDark },
  phraseTextLocked: { color: Colors.textMuted },
  phraseJapaneseSmall: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  phraseRomajiSmall: { fontSize: 11, color: Colors.textMuted, fontStyle: 'italic', marginTop: 1 },
  expandArrow: { fontSize: 12, color: Colors.textMuted },

  phraseExpanded: { marginTop: 14, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 14 },
  phraseJapaneseLarge: { fontSize: 28, color: Colors.primaryPink, fontWeight: '700', marginBottom: 6, textAlign: 'center' },
  phraseRomaji: { fontSize: 16, color: Colors.purple, fontStyle: 'italic', textAlign: 'center', marginBottom: 8 },
  phraseEnglishFull: { fontSize: 16, color: Colors.textDark, textAlign: 'center', marginBottom: 10 },
  phraseStatRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  phraseStat: { fontSize: 13, color: Colors.textMuted },
});
