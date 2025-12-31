import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import VoiceCall from '../screens/VoiceCall';

// Define the type for the navigation stack
export type RootStackParamList = {
  Home: undefined;
  VoiceCall: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const Route: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Home Screen' }} 
        />
        <Stack.Screen 
          name="VoiceCall" 
          component={VoiceCall} 
          options={{ title: 'Voice Call' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Route;

