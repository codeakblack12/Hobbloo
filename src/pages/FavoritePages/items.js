import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Dimensions, Button, FlatList, Image, TouchableOpacity } from 'react-native';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import {FontAwesome} from "@expo/vector-icons"
import { resizeImage, numberFormat } from '../../Components/functions';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import firebase from "firebase"
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { unsaveItem } from '../../Components/functions';
const numColumns = 1
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function FavoriteItems() {

  const tabBarheight = useBottomTabBarHeight();

  const [fav, setFav] = useState([])

  const navigation = useNavigation();

  useEffect(() => {
    readFavItems()
  }, []);

  const readFavItems = () => {
    firebase.database().ref("User Data/Customers/" + userid + "/Favorites/Items/").on('value', function (snapshot) {
      if (snapshot.val() != null){
        let responselist = Object.values(snapshot.val())
        setFav(Object.values(snapshot.val()))
        //console.log(Object.values(snapshot.val()))
      }else{
        setFav([])
      }
    });
  }

  const _renderItem = ({item, index}) => {
    let {itemStyle, itemText, itemInvisible, btnStyle} = styles
    if (item.empty){
        return <View style={[itemStyle, itemInvisible]} />
    }
    return (
      <View style={{backgroundColor: APP_COLORS.cart_card, width: screenWidth * 0.95, minHeight: 150, marginTop: 5, flexDirection: "row", alignItems: "center", paddingVertical: 10, marginBottom: index == fav.length - 1 ? tabBarheight : 0, borderBottomWidth: 1, borderColor: "rgba(60,19,97,0.2)"}}>
         <TouchableWithoutFeedback onPress={() => navigation.navigate("StoreItem", {name: item.itemInfo.name, price: item.itemInfo.price, accent: APP_COLORS.item_button, storeName: item.storeName, storeAddress: item.storeAddress, storeLogo: item.storeLogo})}>
          <Image resizeMode="contain" source={{uri: item.itemInfo.info.logoUrl ? resizeImage(item.itemInfo.info.logoUrl) : null}} style={{height: screenWidth * 0.22, width: screenWidth * 0.22, marginLeft: 10}} />
         </TouchableWithoutFeedback>
         <TouchableWithoutFeedback onPress={() => navigation.navigate("StoreItem", {name: item.itemInfo.name, price: item.itemInfo.price, accent: APP_COLORS.item_button, storeName: item.storeName, storeAddress: item.storeAddress, storeLogo: item.storeLogo})} style={{marginLeft: 15, width: screenWidth * 0.5}}>
            <Text style={{fontSize: 14, fontWeight: "bold", marginTop: 3}}>{numberFormat(item.itemInfo.price)}</Text>
            <Text style={{fontSize: 12, fontWeight: "600", fontFamily: "Avenir", marginTop: 3}}>{item.itemInfo.name}</Text>

            <Text style={{color: "#a0a0a0", marginTop: 3, fontSize: 11, fontFamily: "Avenir"}}>{item.storeName}</Text>
            <Text style={{color: "#a0a0a0", marginTop: 3, fontSize: 11, fontFamily: "Avenir"}}>{item.storeAddress}</Text>
            
         </TouchableWithoutFeedback>
         <View style={{ width: screenWidth*0.15, position: "absolute", right: 0, alignItems: "center", justifyContent: "center"}}>
              <TouchableOpacity onPress={() => unsaveItem(item.itemInfo.name, item.storeName, item.storeAddress)} >
                <FontAwesome size={20} name= "heart" color={APP_COLORS.item_btn_text} />
              </TouchableOpacity>
         </View>
      </View>
    )
}

  return (
    <View style={[styles.container, {backgroundColor: APP_COLORS.background_color}]}>
        {fav.length > 0 ?
        (<FlatList
        data={fav}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        />):(
            <View style={{alignItems: "center", flex: 1, justifyContent: "center"}}>
                <FontAwesome name="heart" size={50} color="#A3A3A3" />
                <Text style={{color: "#A3A3A3", marginTop: 10 }}>Your don't have any favourite item.</Text>
            </View>
        )
        }
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
