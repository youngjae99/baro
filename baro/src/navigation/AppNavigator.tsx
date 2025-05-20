import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

// 스크린 임포트는 나중에 추가할 예정
const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>{/* 스크린들은 나중에 추가할 예정 */}</Stack.Navigator>
    </NavigationContainer>
  );
};
