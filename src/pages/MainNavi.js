import React, {useEffect, useState} from 'react';
import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer, useNavigationContainerRef} from '@react-navigation/native';
import MainPage from './Main';
import StoreNavigation from './Store/StoreNavigation';
import CartNavi from './CartNavi';
import StoreItem from './Store/item';
import BasketList from './FavoritePages/basket';
import {Ionicons} from "@expo/vector-icons"
import {View, TouchableOpacity} from 'react-native';

import CartIcon from '../Components/CartIcon';
const Stack = createStackNavigator();

export default function MainNavi({navigation}) {

  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen
          name="MainPage"
          component={MainPage}
          options={{ title: '',headerShown: false }}
        />
        <Stack.Screen
          name="StoreNavigation"
          component={StoreNavigation}
          options={{ headerShown: false, gestureDirection: "vertical", headerMode: "screen", cardStyleInterpolator: Platform.OS === "ios" ? CardStyleInterpolators.forVerticalIOS : CardStyleInterpolators.forFadeFromBottomAndroid }}
        />
        <Stack.Screen
          name="CartNavi"
          component={CartNavi}
          options={{ title: '',headerShown: false,
         }}
        />
        <Stack.Screen
          name="StoreItem"
          component={StoreItem}
          options={{ title: "", presentation: "modal",
          headerTitleStyle: {fontSize: 13, color: APP_COLORS.back_text},
          headerStyle: {backgroundColor: APP_COLORS.background_color},
          headerLeft: () => (<View></View>),
          }}
        />
        <Stack.Screen
          name="BasketList"
          component={BasketList}
          options={{ title: "",
            gestureDirection: "vertical", headerMode: "screen", cardStyleInterpolator: Platform.OS === "ios" ? CardStyleInterpolators.forVerticalIOS : CardStyleInterpolators.forFadeFromBottomAndroid,
            headerShown: true, headerTitleAllowFontScaling: true, headerStyle: {backgroundColor: APP_COLORS.header},
            headerTitleStyle: {color: APP_COLORS.header_text},
          }}
        />
      </Stack.Navigator >
    </NavigationContainer>
  );
};