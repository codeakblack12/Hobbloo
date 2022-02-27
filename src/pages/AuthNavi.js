import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer, useNavigationContainerRef} from '@react-navigation/native';
import {firebaseConfig} from "../../config";
import LoginPage from './AuthPages/login';
import RegisterPage from './AuthPages/register';


const Stack = createStackNavigator();

export default function AuthNavigation() {
    const navigationRef = useNavigationContainerRef();
    
  return (
    <NavigationContainer ref={navigationRef}>
    <Stack.Navigator
      initialRouteName="LoginPage"
      screenOptions={{
        headerMode: 'screen',
        headerTintColor: "#FFF",
        headerStyle: { backgroundColor: APP_COLORS.header },
      }}
    >
      <Stack.Screen
        name="LoginPage"
        component={LoginPage}
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="RegisterPage"
        component={RegisterPage}
        options={{
          title: 'Create Account',
        }}
      />
    </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
