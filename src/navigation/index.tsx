import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Rating } from '../types';

// Root stack params
export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Progress: undefined;
  Session: undefined;
};

// Session stack params
export type SessionStackParamList = {
  SessionEntry: undefined;
  WarmUp: { phraseIds: number[] };
  Lesson: undefined;
  Practice: { phraseIds: number[] };
  Transition: undefined;
  Quiz: undefined;
  Results: {
    avgScore: number;
    ratings: Record<number, Rating>;
    flaggedPhrases: number[];
    newStreak: number;
  };
};

import HomeScreen from '../screens/HomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SessionEntryScreen from '../screens/SessionEntryScreen';
import WarmUpScreen from '../screens/WarmUpScreen';
import LessonScreen from '../screens/LessonScreen';
import PracticeScreen from '../screens/PracticeScreen';
import TransitionScreen from '../screens/TransitionScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultsScreen from '../screens/ResultsScreen';
import { useAppState } from '../context/AppContext';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const SessionStack = createNativeStackNavigator<SessionStackParamList>();

function SessionNavigator() {
  return (
    <SessionStack.Navigator screenOptions={{ headerShown: false }}>
      <SessionStack.Screen name="SessionEntry" component={SessionEntryScreen} />
      <SessionStack.Screen name="WarmUp" component={WarmUpScreen} />
      <SessionStack.Screen name="Lesson" component={LessonScreen} />
      <SessionStack.Screen name="Practice" component={PracticeScreen} />
      <SessionStack.Screen name="Transition" component={TransitionScreen} />
      <SessionStack.Screen name="Quiz" component={QuizScreen} />
      <SessionStack.Screen name="Results" component={ResultsScreen} />
    </SessionStack.Navigator>
  );
}

export default function AppNavigator() {
  const state = useAppState();

  if (!state.isLoaded) return null;

  const initialRoute = state.settings.setupComplete ? 'Home' : 'Onboarding';

  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Progress" component={ProgressScreen} />
        <RootStack.Screen name="Session" component={SessionNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
