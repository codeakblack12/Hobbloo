import { StatusBar } from 'expo-status-bar';
import React, {useLayoutEffect, useState} from 'react';
import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesome5, AntDesign, Feather, MaterialIcons, FontAwesome} from "@expo/vector-icons"
import { useFonts } from 'expo-font';

import { getUserdata } from '../Components/functions';

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';


import { BlurView } from 'expo-blur';

import CartIcon from '../Components/CartIcon';

//Main Pages Import
import HomePage from './MainPages/home';
import SearchPage from './MainPages/search';
import ProfilePage from './MainPages/profile';
import FavoritePage from './MainPages/favorite';

const Tab = createBottomTabNavigator();

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

const Icon = createIconSetFromIcoMoon(
  require('../../assets/icomoon/selection.json'),
  'IcoMoon',
  'fonts/icomoon.ttf'
);

export default function MainPage({navigation}) {

  useLayoutEffect(() => {
    getUserdata()
    //readCart()
  }, []);

  const layoutChange = () => {
    if(design){
      setDesign(false)
    }else{
      setDesign(true)
    }
  }

  const [fontsLoaded] = useFonts({ IcoMoon: require('../../assets/icomoon/fonts/icomoon.ttf') });
  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
        <Tab.Navigator screenOptions={{
          //tabBarAllowFontScaling: true,
          //headerShadowVisible: false,
          headerTintColor: APP_COLORS.back_text,
          tabBarActiveTintColor: APP_COLORS.tab_active,
          tabBarInactiveTintColor: APP_COLORS.tab_inactive,
          tabBarStyle: { position: 'absolute'},
          tabBarBackground: () => (
            <BlurView tint="light" intensity={90} style={StyleSheet.absoluteFill} />
          ),
        }}
        >
        <Tab.Screen name="HomePage" component={HomePage} options={{
          //headerTransparent: true,
          //headerBlurEffect: "systemMaterialDark",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="Home1" color={color} size={25} />
        ),
        title: <TouchableOpacity style={{flexDirection: "row"}}><Text style={{color: APP_COLORS.back_text}}>{"Stores close to your Location"/* + json[0].users_state*/}</Text><MaterialIcons size={20} name="keyboard-arrow-down" color={APP_COLORS.back_text} /></TouchableOpacity>,
        headerStyle: {shadowColor: "transparent", backgroundColor: APP_COLORS.background_color},
        headerLeft: () => (<View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        <TouchableOpacity style={{marginLeft: 25}} onPress={() => layoutChange()}><AntDesign size={25} name="appstore-o" color={APP_COLORS.back_text} /></TouchableOpacity>
        </View>),
        headerRight: () => (
        <CartIcon 
          navigation={navigation}
        />
        ),
        }} />
        {/* <Tab.Screen name="SearchPage" component={SearchPage} options={{
          tabBarLabel: "Explore",
          headerStyle: {backgroundColor: APP_COLORS.background_color},
          tabBarIcon: ({ color, size }) => (
            <Icon name="Search1" color={color} size={25} />
        )
        }} /> */}
        <Tab.Screen name="FavoritePage" component={FavoritePage} options={{
          tabBarLabel: "Favourite",
          title: "Favourite",
          headerStyle: {backgroundColor: APP_COLORS.background_color},
          tabBarIcon: ({ color, size }) => (
            <Icon name="Heart1" color={color} size={20} />
        )
        }} />
        <Tab.Screen name="ProfilePage" component={ProfilePage} options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Icon name="Profile1" color={color} size={25} />
        ),
        title: "",
        headerStyle: {shadowColor: "transparent", backgroundColor: APP_COLORS.background_color},
        }} />
        
      </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: "center",
    justifyContent: "center"
  },
});
