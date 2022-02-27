import React, {useEffect} from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from '@react-navigation/native';
import { StyleSheet, Text, View, ActivityIndicator, ImageBackground, Dimensions, Image, TouchableOpacity } from 'react-native';
import {FontAwesome5, AntDesign, Feather, MaterialIcons, FontAwesome, Ionicons} from "@expo/vector-icons"
import { SearchBar, Icon } from 'react-native-elements';
import {resizeImage} from "../../Components/functions"

import CartIcon from '../../Components/CartIcon';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

import StoreHome from './home';
import StoreCategory from './category';
import StoreItem from './item';

const Stack = createStackNavigator();

export default function StoreNavigation({route, navigation}) {
  
const {data, accent} = route.params;

  return (
    <Stack.Navigator >
        <Stack.Screen
          name="StoreHome"
          initialParams={{data: data, accent: accent}}
          component={StoreHome}
          options={{ title: 
          <View style={{alignSelf: "center", alignItems: "center", justifyContent: "center"}}>
            <Image style={styles.tinyLogo} source={{uri: resizeImage(data.storeData.logoUrl)}} resizeMode="contain" />
            {/*<Text>{data.storeData.name}</Text>*/}
          </View>, 
            headerShown: true, headerTitleAllowFontScaling: true, headerStyle: {shadowColor: "transparent", backgroundColor: APP_COLORS.header},
            headerRight: () => (
            <CartIcon 
              navigation={navigation}
            />
            ),
            headerLeft: () => (<View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity style={{marginLeft: 25}} onPress={() => navigation.goBack()}><FontAwesome size={25} name="close" color={APP_COLORS.header_text} /></TouchableOpacity>
            </View>),
          }}
        />
        <Stack.Screen
          name="StoreCategory"
          component={StoreCategory}
          options={{ title: "",
            headerShown: true, headerTitleAllowFontScaling: true, headerStyle: {shadowColor: "transparent", backgroundColor: APP_COLORS.header},
            headerTitleStyle: {color: APP_COLORS.header_text},
            headerRight: () => (
            <CartIcon 
              navigation={navigation}
            />
            ),
            headerLeft: () => (<View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity style={{marginLeft: 25}} onPress={() => navigation.navigate("StoreHome")}><Ionicons size={25} name="chevron-back-sharp" color={APP_COLORS.header_text}  /></TouchableOpacity>
            </View>),
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
    </Stack.Navigator >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "#A0A0A0",
    backgroundColor: "#fff"
  },
});
