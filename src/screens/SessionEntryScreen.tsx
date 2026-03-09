import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppState } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { SessionStackParamList } from '../navigation';

type Props = NativeStackScreenProps<SessionStackParamList, 'SessionEntry'>;

export default function SessionEntryScreen({ navigation }: Props) {
  const state = useAppState();
  const { todayFlagged, progress } = state;

  const hasWarmUp = todayFlagged.length > 0;
  const hasUnseen = progress.unseenBatchPhrases.length > 0;

  useEffect(() => {
    if (hasWarmUp) {
      navigation.replace('WarmUp', { phraseIds: todayFlagged });
    } else if (hasUnseen) {
      navigation.replace('Lesson');
    } else {
      navigation.replace('Practice', { phraseIds: progress.unlockedPhrases });
    }
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primaryPink} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightPinkBg,
  },
});
