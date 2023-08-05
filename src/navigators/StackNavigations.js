import React, {useEffect, useState} from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import Start from '../screens/Start';
import Login from '../screens/Login';
import Questions from '../screens/Questions';
import Results from '../screens/Results';
import {MMKV} from 'react-native-mmkv';

export default function StackNavigations() {
  const Stack = createStackNavigator();
  const storage = new MMKV();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
      initialRouteName={'start'}>
      <Stack.Screen name="start" component={Start} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="questions" component={Questions} />
      <Stack.Screen name="results" component={Results} />
    </Stack.Navigator>
  );
}
