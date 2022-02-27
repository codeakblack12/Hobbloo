import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import 'expo-dev-client';
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import Loading from './src/pages/ComponentPages/Loading';
import AuthNavigation from './src/pages/AuthNavi';
import MainNavi from './src/pages/MainNavi';
import { getUserdata } from './src/Components/functions';

import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 1000)

export default function App() {

  GLOBAL.APP_COLORS = {
    background_color: "#fff",//"#efeeee",
    back_text: "#000",
    back_text_sub: "#8c8c8c",
    checkout_details_back: "#efeeee",
    shop_card: ["#6615e7", '#c027f8'],
    tab_active: "#200E32",
    tab_inactive: "#a9a9a9",
    header: "#fff",
    header_text: "#000",
    item_button: "#bca0dc",//"#6615e7",
    item_btn_text: "#3c1361",
    link_btn_tint: "#6615e7",
    cart_card: "transparent",
    checkout_btn: "rgba(60,19,97,0.7)"
  }

  const [userid, setUserid] = useState("");
  GLOBAL.userid = userid
  GLOBAL.setUserid = setUserid


  useLayoutEffect(() => {
    getUserdata()
  }, []);
  
  
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
