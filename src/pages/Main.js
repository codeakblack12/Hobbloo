import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesome5, AntDesign, Feather, MaterialIcons, FontAwesome} from "@expo/vector-icons"

import { BlurView } from 'expo-blur';

//Main Pages Import
import HomePage from './MainPages/home';
import SearchPage from './MainPages/search';
import ProfilePage from './MainPages/profile';
import FavoritePage from './MainPages/favorite';

const Tab = createBottomTabNavigator();

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function MainPage({navigation}) {

  const layoutChange = () => {
    if(design){
      setDesign(false)
    }else{
      setDesign(true)
    }
  }

  return (
      <Tab.Navigator screenOptions={{
        //tabBarAllowFontScaling: true,
        //headerShadowVisible: false,
        tabBarActiveTintColor: "#29ABE2",
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
            <FontAwesome5 name="home" color={color} size={20} />
        ),
        title: <TouchableOpacity style={{flexDirection: "row"}}><Text>{"Stores close to your Location"/* + json[0].users_state*/}</Text><MaterialIcons size={20} name="keyboard-arrow-down" color="#000" /></TouchableOpacity>,
        headerStyle: {shadowColor: "transparent"},
        headerLeft: () => (<View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        <TouchableOpacity style={{marginLeft: 25}} onPress={() => layoutChange()}><AntDesign size={25} name="appstore-o" color="#000" /></TouchableOpacity>
        </View>),
        headerRight: () => (<View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        <TouchableOpacity onPress={() => navigation.navigate("CartNavi")} style={{marginRight: 25}}><FontAwesome size={25} name="shopping-basket" color="#000" />{/*<View style={{position: "absolute", backgroundColor: "#29ABE2", width: 21, height: 21, alignItems: "center", justifyContent: "center", borderRadius: 11, top: -10, right: -10}}><Text style={{fontSize: 10}}>0</Text></View>*/}</TouchableOpacity>
        </View>),
        }} />
        <Tab.Screen name="SearchPage" component={SearchPage} options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="search" color={color} size={20} />
        )
        }} />
        <Tab.Screen name="FavoritePage" component={FavoritePage} options={{
          tabBarLabel: "Favorite",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="heart" color={color} size={20} />
        )
        }} />
        <Tab.Screen name="ProfilePage" component={ProfilePage} options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-alt" color={color} size={20} />
        ),
        title: "",
        headerStyle: {shadowColor: "transparent"},
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
