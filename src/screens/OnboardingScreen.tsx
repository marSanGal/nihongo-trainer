import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { useAppDispatch } from '../context/AppContext';
import { getDaysUntilDeparture } from '../utils/progress';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const [dateText, setDateText] = useState('');
  const [error, setError] = useState('');

  function handleDateChange(text: string) {
    setDateText(text);
    setError('');
  }

  function handleStart() {
    // Accept YYYY-MM-DD or DD/MM/YYYY
    let iso = dateText.trim();
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(iso)) {
      const [dd, mm, yyyy] = iso.split('/');
      iso = `${yyyy}-${mm}-${dd}`;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
      setError('Please enter a date like 27/04/2026 or 2026-04-27');
      return;
    }
    const days = getDaysUntilDeparture(iso);
    if (days <= 0) {
      setError('Departure date must be in the future!');
      return;
    }
    dispatch({ type: 'SET_DEPARTURE_DATE', payload: iso });
    dispatch({ type: 'COMPLETE_SETUP' });
    navigation.replace('Home');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.flag}>🇯🇵</Text>
        <Text style={styles.title}>Nihongo Trainer</Text>
        <Text style={styles.subtitle}>
          Learn 32 essential Japanese travel phrases before your trip!
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>When are you flying? ✈️</Text>
          <Text style={styles.cardDesc}>
            Enter your departure date and we'll keep you on track.
          </Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="27/04/2026 or 2026-04-27"
            placeholderTextColor={Colors.textMuted}
            value={dateText}
            onChangeText={handleDateChange}
            keyboardType="default"
            autoCapitalize="none"
          />
          {!!error && <Text style={styles.error}>{error}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.button, !dateText && styles.buttonDisabled]}
          onPress={handleStart}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Let's start! 🚀</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          No account needed — all progress stays on your phone 🔒
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.lightPinkBg },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 40,
  },
  flag: { fontSize: 72, marginBottom: 12 },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primaryPink,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    marginBottom: 24,
    shadowColor: Colors.primaryPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.textDark,
    backgroundColor: Colors.lightPinkBg,
  },
  inputError: {
    borderColor: Colors.primaryPink,
  },
  error: {
    color: Colors.primaryPink,
    fontSize: 13,
    marginTop: 8,
  },
  button: {
    backgroundColor: Colors.primaryPink,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginBottom: 20,
    shadowColor: Colors.primaryPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  note: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
