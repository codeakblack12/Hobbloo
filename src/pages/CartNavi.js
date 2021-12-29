import * as React from 'react';
import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import {View, TouchableOpacity } from 'react-native';
import {Ionicons} from "@expo/vector-icons"

import Cart from './CartPages/cart';
import CartHome from './CartPages/carthome';


const Stack = createStackNavigator();

export default function CartNavi({navigation}) {
  return (
      <Stack.Navigator >
        <Stack.Screen
          name="CartHome"
          component={CartHome}
          options={{ title: 'Shops',
          headerLeft: () => (<View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity style={{marginLeft: 25}} onPress={() => navigation.goBack()}><Ionicons size={25} name="chevron-back-sharp" color="#000" /></TouchableOpacity>
            </View>),
        }}
        />
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{
          headerLeft: () => (<View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity style={{marginLeft: 20}} onPress={() => navigation.navigate("CartHome")}><Ionicons size={25} name="chevron-back-sharp" color="#000" /></TouchableOpacity>
            </View>),
        }}
        />
      </Stack.Navigator >
  );
};