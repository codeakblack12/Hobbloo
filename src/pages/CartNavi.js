import * as React from 'react';
import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import {View, TouchableOpacity } from 'react-native';
import {Ionicons, FontAwesome} from "@expo/vector-icons"

import Cart from './CartPages/cart';
import CartHome from './CartPages/carthome';
import Checkout from './CartPages/checkout';

const Stack = createStackNavigator();

export default function CartNavi({navigation}) {
  return (
      <Stack.Navigator >
        <Stack.Screen
          name="CartHome"
          component={CartHome}
          options={{ title: 'Shops',
          headerStyle: {backgroundColor: APP_COLORS.background_color},
          headerLeft: () => (<View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity style={{marginLeft: 25}} onPress={() => navigation.goBack()}><Ionicons size={25} name="chevron-back-sharp" color="#000" /></TouchableOpacity>
            </View>),
        }}
        />
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{
          headerStyle: {backgroundColor: APP_COLORS.background_color},
          headerLeft: () => (<View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity style={{marginLeft: 20}} onPress={() => navigation.navigate("CartHome")}><Ionicons size={25} name="chevron-back-sharp" color="#000" /></TouchableOpacity>
            </View>),
        }}
        />
        <Stack.Screen
          name="Checkout"
          component={Checkout}
          options={{
          headerStyle: {backgroundColor: APP_COLORS.background_color},
          headerLeft: () => (<View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity style={{marginLeft: 20}} onPress={() => navigation.goBack()}><Ionicons size={25} name="chevron-back-sharp" color="#000" /></TouchableOpacity>
            </View>),
        }}
        />
      </Stack.Navigator >
  );
};