import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Platform, Image } from 'react-native';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function StoreCategories() {

  const MIN_HEIGHT = Platform.OS == "ios" ? 90 : 55;
  const MAX_HEIGHT = 350

  return (
    <View style={{flex: 1}}>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});


import React, {useState} from 'react';
import {createStackNavigator} from "@react-navigation/stack";

import StoresPage from '../HomePages/Stores';
import StoreCategories from "../HomePages/StoreCategories"

const Stack = createStackNavigator();

export default function Home() {

  return (
    <Stack.Navigator
      initialRouteName="StoresPage"
      /*
      screenOptions={{
        headerMode: 'screen',
        headerTintColor: "#575757",
        headerStyle: { backgroundColor: '#FFF5F5' },
      }}
      */
    >
      <Stack.Screen
        name="StoresPage"
        component={StoresPage}
        options={{
          title: '',
          headerStyle: {shadowOpacity: 0}
        }}
      />
      <Stack.Screen
        name="StoreCategories"
        component={StoreCategories}
        options={{
          title: '',
        }}
      />
      
    </Stack.Navigator>
    
  );
}