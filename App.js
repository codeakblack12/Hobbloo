import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import 'expo-dev-client';
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import Loading from './src/pages/ComponentPages/Loading';
import AuthNavigation from './src/pages/AuthNavi';
import MainNavi from './src/pages/MainNavi';

import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 1000)

export default function App() {
  
  return (
    <View style={styles.container}>
      <AppNavigator />
      <StatusBar style="auto" />
    </View>
  );
}

const AppSwitchNavigator = createSwitchNavigator({
  Loading:Loading,
  AuthNavigation:AuthNavigation,
  MainNavi:MainNavi,
})

const AppNavigator = createAppContainer(AppSwitchNavigator)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
