import * as React from 'react';
import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer, useNavigationContainerRef} from '@react-navigation/native';
import MainPage from './Main';
import StoreNavigation from './Store/StoreNavigation';
import CartNavi from './CartNavi';
import {FontAwesome} from "@expo/vector-icons"

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
      </Stack.Navigator >
    </NavigationContainer>
  );
};