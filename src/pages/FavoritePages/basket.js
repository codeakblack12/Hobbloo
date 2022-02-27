import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, Button, FlatList, Image, TouchableOpacity } from 'react-native';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import {FontAwesome, Ionicons} from "@expo/vector-icons"
import { resizeImage, numberFormat } from '../../Components/functions';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import firebase from "firebase"
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import CartIcon from '../../Components/CartIcon';
const numColumns = 1
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function BasketList({route}) {

  const {data} = route.params;
  
  const [fav, setFav] = useState([])

  const navigation = useNavigation();

  useEffect(() => {
      console.log(data)
    navigation.setOptions({
        title: data.name,
        headerRight: () => (
        <CartIcon 
            navigation={navigation}
        />
            ),
        headerLeft: () => (
        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity style={{marginLeft: 25}} onPress={() => navigation.goBack()}><Ionicons size={25} name="chevron-back-sharp" color={APP_COLORS.header_text}  /></TouchableOpacity>
        </View>),
    })
    
    readFavItems()
  }, []);

  const readFavItems = () => {
    firebase.database().ref("User Data/Customers/" + userid + "/Favorites/Items/").on('value', function (snapshot) {
      if (snapshot.val() != null){
        let responselist = Object.values(snapshot.val())
        setFav(Object.values(snapshot.val()))
      }else{
        setFav([])
      }
    });
  }

  const unsaveItem = (item) => {
    try {
      let userRef = firebase.database().ref("User Data/Customers/" + userid + "/Favorites/Items/" + item.itemName + "-" + item.storeName + "-" + item.storeAddress );
      userRef.remove()
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      return

    } catch(e){
        console.log(e);
    }
  }

  const _renderItem = ({item, index}) => {
    let {itemStyle, itemText, itemInvisible, btnStyle} = styles
    if (item.empty){
        return <View style={[itemStyle, itemInvisible]} />
    }
    return (
      <View style={{backgroundColor: APP_COLORS.cart_card, width: screenWidth * 0.95, minHeight: 150, marginTop: 5, flexDirection: "row", alignItems: "center", paddingVertical: 10, marginBottom: 0, borderBottomWidth: 1, borderColor: "rgba(60,19,97,0.2)"}}>
         <TouchableWithoutFeedback onPress={() => navigation.navigate("StoreItem", {name: item.name, price: item.price, accent: APP_COLORS.item_button, storeName: data.storeInfo.storeName, storeAddress: data.storeInfo.storeAddress, storeLogo: null})}>
          <Image resizeMode="contain" source={{uri: resizeImage(item.logo)}} style={{height: screenWidth * 0.22, width: screenWidth * 0.22, marginLeft: 10}} />
         </TouchableWithoutFeedback>
         <TouchableWithoutFeedback onPress={() => navigation.navigate("StoreItem", {name: item.name, price: item.price, accent: APP_COLORS.item_button, storeName: data.storeInfo.storeName, storeAddress: data.storeInfo.storeAddress, storeLogo: data.storeInfo.storeLogo})} style={{marginLeft: 15, width: screenWidth * 0.5}}>
            <Text style={{fontSize: 14, fontWeight: "bold", marginTop: 3}}>{numberFormat(item.price)}</Text>
            <Text style={{fontSize: 12, fontWeight: "600", fontFamily: "Avenir", marginTop: 3}}>{item.name}</Text>

         </TouchableWithoutFeedback>
         {/* <View style={{ width: screenWidth*0.15, position: "absolute", right: 0, alignItems: "center", justifyContent: "center"}}>
              <TouchableOpacity onPress={() => unsaveItem(item)} >
                <FontAwesome size={20} name= "heart" color={APP_COLORS.item_btn_text} />
              </TouchableOpacity>
         </View> */}
      </View>
    )
}

  return (
    <View style={[styles.container, {backgroundColor: APP_COLORS.background_color}]}>
        <FlatList
        data={data.items}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
