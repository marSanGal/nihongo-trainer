import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Phrase } from '../constants/phrases';

interface FlashCardProps {
  phrase: Phrase;
  cardType: 'en_to_jp' | 'jp_to_en';
  revealed: boolean;
  onReveal: () => void;
}

export default function FlashCard({ phrase, cardType, revealed, onReveal }: FlashCardProps) {
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: revealed ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [revealed]);

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '90deg'],
  });

  const backRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['90deg', '90deg', '0deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5],
    outputRange: [1, 1, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.51],
    outputRange: [0, 0, 1],
  });

  const frontContent =
    cardType === 'en_to_jp' ? (
      <View style={styles.face}>
        <Text style={styles.typeHint}>English → Japanese</Text>
        <Text style={styles.primaryText}>{phrase.english}</Text>
        <Text style={styles.tapHint}>Tap to reveal 👆</Text>
      </View>
    ) : (
      <View style={styles.face}>
        <Text style={styles.typeHint}>Japanese → English</Text>
        <Text style={styles.japaneseText}>{phrase.japanese}</Text>
        <Text style={styles.romajiText}>{phrase.romaji}</Text>
        <Text style={styles.tapHint}>Tap to reveal 👆</Text>
      </View>
    );

  const backContent =
    cardType === 'en_to_jp' ? (
      <View style={styles.face}>
        <Text style={styles.typeHint}>Japanese → English</Text>
        <Text style={styles.japaneseText}>{phrase.japanese}</Text>
        <Text style={styles.romajiText}>{phrase.romaji}</Text>
        <Text style={styles.englishBack}>{phrase.english}</Text>
      </View>
    ) : (
      <View style={styles.face}>
        <Text style={styles.typeHint}>English → Japanese</Text>
        <Text style={styles.primaryText}>{phrase.english}</Text>
      </View>
    );

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={!revealed ? onReveal : undefined}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.card,
          styles.cardFront,
          { opacity: frontOpacity, transform: [{ rotateY: frontRotate }] },
        ]}
      >
        {frontContent}
      </Animated.View>
      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          { opacity: backOpacity, transform: [{ rotateY: backRotate }] },
        ]}
      >
        {backContent}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  card: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primaryPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  cardFront: {
    backgroundColor: Colors.white,
  },
  cardBack: {
    backgroundColor: '#FFF8FF',
  },
  face: { alignItems: 'center', width: '100%' },
  typeHint: {
    fontSize: 12,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 24,
    fontWeight: '600',
  },
  primaryText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 24,
  },
  japaneseText: {
    fontSize: 36,
    color: Colors.primaryPink,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 48,
    marginBottom: 12,
  },
  romajiText: {
    fontSize: 18,
    color: Colors.purple,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  englishBack: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  tapHint: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 8,
  },
});
