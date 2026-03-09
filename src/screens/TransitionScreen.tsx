import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { SessionStackParamList } from '../navigation';

type Props = NativeStackScreenProps<SessionStackParamList, 'Transition'>;

export default function TransitionScreen({ navigation }: Props) {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View
        style={[styles.container, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}
      >
        <Text style={styles.emoji}>🏆</Text>
        <Text style={styles.title}>Practice complete!</Text>
        <Text style={styles.subtitle}>
          You nailed every phrase. Now let's see how you do for real!
        </Text>

        <View style={styles.divider} />

        <Text style={styles.hint}>
          Same cards, but now you rate yourself instead of multiple choice.{'\n'}
          Be honest — it helps you learn faster! 😄
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('Quiz')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Start the quiz! 🎌</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightPinkBg },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emoji: { fontSize: 80, marginBottom: 16 },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primaryPink,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 32,
  },
  divider: {
    width: 48,
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: 24,
  },
  hint: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  button: {
    backgroundColor: Colors.primaryPink,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 48,
    shadowColor: Colors.primaryPink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
});
