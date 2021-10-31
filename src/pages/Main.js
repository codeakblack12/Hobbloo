import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {FontAwesome5, AntDesign, Feather} from "@expo/vector-icons"


//Main Pages Import
import HomePage from './MainPages/home';
import SearchPage from './MainPages/search';
import CartPage from './MainPages/cart';
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
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        tabBarActiveTintColor: "#29ABE2",
      }}
      >
        <Tab.Screen name="HomePage" component={HomePage} options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" color={color} size={22} />
        ),
        title: "",
        headerLeft: () => (<View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        <TouchableOpacity style={{marginLeft: 25}} onPress={() => layoutChange()}><AntDesign size={25} name="appstore-o" color="#000" /></TouchableOpacity>
        </View>)
        }} />
        <Tab.Screen name="SearchPage" component={SearchPage} options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="search" color={color} size={22} />
        )
        }} />
        <Tab.Screen name="CartPage" component={CartPage}  options={{
          tabBarLabel: "Cart",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="shopping-cart" color={color} size={22} />
        ),
        title: "Cart"
        }}/>
        <Tab.Screen name="FavoritePage" component={FavoritePage} options={{
          tabBarLabel: "Favorite",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="heart" color={color} size={22} />
        )
        }} />
        <Tab.Screen name="ProfilePage" component={ProfilePage} options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-alt" color={color} size={22} />
        ),
        title: "",
        headerStyle: {shadowColor: "transparent"},
        }} />
        
      </Tab.Navigator>
     </NavigationContainer>
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
