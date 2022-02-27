import React, {useEffect, useState, useLayoutEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, FlatList, TouchableOpacity, ImageBackground, ScrollView, LogBox, Image } from 'react-native';
import {Feather, Ionicons, FontAwesome} from "@expo/vector-icons"
import {resizeImage, numberFormat} from "../../Components/functions"
import firebase from "firebase"
import * as Haptics from 'expo-haptics';
import { saveItem, unsaveItem, addToCart, updateQuantity } from '../../Components/functions';
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function StoreItem({route, navigation}) {

  const {name, price, accent, storeName, storeAddress, storeLogo} = route.params;
  
  const [cart, setCart] = useState([])
  const [cartdata, setCartdata] = useState([])
  const [saved, setSaved] = useState(false)
  const [data, setData] = useState([])
  const [info, setInfo] = useState({})

  useLayoutEffect(() => {
    console.log(name)
    getItemInfo()
    navigation.setOptions({title: name})
  }, []);

  useEffect(() => {
    LogBox.ignoreAllLogs()
    readCart()
    readFavItems()
  }, []);

  const getItemInfo = () => {
    firebase.database().ref("Hobbloo Data/Items/" + name ).once('value', function (snapshot) {
      if (snapshot.val() != null){
        let responselist = Object.keys(snapshot.val())
        setData(snapshot.val())
        let data = {
          info: snapshot.val(),
          name: name,
          price: price
        }
        setInfo(data)
      }else{
        setData([])
      }
    });
  }

  const readCart = () => {
    firebase.database().ref("User Data/Customers/" + userid + "/cart/" + storeName + "-" + storeAddress + "/Items/").on('value', function (snapshot) {
      if (snapshot.val() != null){
        let responselist = Object.keys(snapshot.val())
        setCart(Object.keys(snapshot.val()))
        setCartdata(snapshot.val())
        checkCart()
        console.log(responselist)
      }else{
        setCart([])
      }
    });
  }

  const checkCart = () => {
    firebase.database().ref("User Data/Customers/" + userid + "/cart/" + storeName + "-" + storeAddress + "/Items/").on('value', function (snapshot) {
      if (snapshot.val() != null){
        return
      }else{
        let userRef = firebase.database().ref("User Data/Customers/" + userid + "/cart/" + storeName + "-" + storeAddress);
        userRef.remove()
      }
    });
  }

  


  const readFavItems = () => {
    firebase.database().ref("User Data/Customers/" + userid + "/Favorites/Items/").on('value', function (snapshot) {
      if (snapshot.val() != null){
        let responselist = Object.values(snapshot.val())
        console.log(responselist)
        console.log(name)
        console.log(storeAddress)
        console.log(storeName)
        for(var i = 0; i < responselist.length; i++){
          if(name == responselist[i].itemInfo.name && storeName == responselist[i].storeName && storeAddress == responselist[i].storeAddress){
            setSaved(true)
            return
          }
          else{
            setSaved(false)
          }
        }
      }else{
        setSaved(false)
      }
    });
  }

  const saveItem = (item) => {
    try {
      firebase
          .database()
          .ref("User Data/Customers/" + userid + "/Favorites/Items/" + item.name + "-" + storeName + "-" + storeAddress )
          .set({
          storeName: storeName,
          storeAddress: storeAddress,
          storeLogo: storeLogo,
          //itemName: item.name,
          //itemPrice: item.price,
          itemInfo: item
          }).then(() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            }).catch((error) => {
            alert(error)
          });
    } catch(e){
        console.log(e);
    }
  }

  // const unsaveItem = (item) => {
  //   try {
  //     let userRef = firebase.database().ref("User Data/Customers/" + userid + "/Favorites/Items/" + item.name + "-" + storeName + "-" + storeAddress);
  //     userRef.remove()
  //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  //     return

  //   } catch(e){
  //       console.log(e);
  //   }
  // }

  return (
    <View style={[styles.container, {backgroundColor: APP_COLORS.background_color}]}>
      <ScrollView showsVerticalScrollIndicator={false} ho>
        <View style={{alignItems: "center", width: "100%", marginBottom: 100}}>
            <Image resizeMode="contain"  defaultSource={require('../../../assets/art/item.png')} source={{uri: data.logoUrl ? resizeImage(data.logoUrl) : null}} style={{height: screenHeight*0.3, width: screenWidth*0.6}} />
            <View style={{width: screenWidth, height: screenHeight*0.1, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
              {cart.includes(name) ?
              (<View style={{width: screenWidth*0.46, backgroundColor: "#f0f0f0", height: screenHeight*0.06, borderRadius: 7, flexDirection: "row", alignItems: "center", justifyContent: "space-around"}}>
                {cartdata[name] ? (
                <TouchableOpacity onPress={() => updateQuantity(name, cartdata[name].quantity, cartdata[name].quantity == 1 ? "trash-o" : "minus", storeName, storeAddress)}>
                    <FontAwesome size={20} name={cartdata[name].quantity == 1 ? "trash-o" : "minus"} color={APP_COLORS.item_button} />
                </TouchableOpacity>):(
                <TouchableOpacity onPress={() => updateQuantity(name, cartdata[name].quantity, "minus", storeName, storeAddress)}>
                  <FontAwesome size={20} name="minus" color={APP_COLORS.item_button} />
                </TouchableOpacity>
                )}
                <Text style={{fontSize: 20}}>{ cartdata[name] ? (cartdata[name].quantity):("")}</Text>
                <TouchableOpacity onPress={() => updateQuantity(name, cartdata[name].quantity, "plus", storeName, storeAddress)}>
                    <FontAwesome size={20} name="plus" color={APP_COLORS.item_button} />
                </TouchableOpacity>
              </View>):
              (<TouchableOpacity onPress={() => addToCart(name, price, 1, data.logoUrl, storeName, storeAddress, storeLogo)} style={{width: screenWidth*0.46, backgroundColor: APP_COLORS.item_button, height: screenHeight*0.06, borderRadius: 7, flexDirection: "row", alignItems: "center", justifyContent: "space-around"}}>
                <Text style={{color: APP_COLORS.item_btn_text, fontWeight: "bold", fontFamily: "Avenir"}}>Add to basket </Text>
              </TouchableOpacity>)
              }

              <TouchableOpacity onPress={() => saved ? unsaveItem(name, storeName, storeAddress) : saveItem(info, storeName, storeAddress, storeLogo)} style={{width: screenWidth*0.4, backgroundColor: APP_COLORS.background_color, height: screenHeight*0.06, borderRadius: 7, flexDirection: "row", alignItems: "center", justifyContent: "space-around"}}>
                <Text style={{color: APP_COLORS.item_btn_text, fontWeight: "bold", fontFamily: "Avenir", fontSize: 18}}>{saved ? "Saved" : "Save"} <FontAwesome size={20} name= { saved ? "heart" : "heart-o"} color={APP_COLORS.item_btn_text} /></Text>
              </TouchableOpacity>
            </View>
            <View style={{width: "100%", alignItems: "flex-start", marginTop: 30, flexDirection: "row"}}>
              <View style={{width: "90%", marginLeft: 20}}>
                <Text style={{fontSize: 20, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text, fontFamily: "Avenir"}}>{numberFormat(price)}</Text>
                <Text numberOfLines={3} style={{fontSize: 15, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text_sub, fontFamily: "Avenir"}}>{name}</Text>
              </View>
              <View style={{width: "5%", height: 50, alignItems: "center", justifyContent: "center"}}>
                {/*<TouchableOpacity>
                  <FontAwesome size={25} name="heart-o" color={APP_COLORS.item_button} />
                </TouchableOpacity>*/}
              </View>
            </View>
            <View style={{width: "100%", paddingHorizontal: 20, marginTop: 20}}>
              {/*Nutritional facts*/}
              <Text style={{fontSize: 20, fontWeight: "bold", textAlign: "left", color: APP_COLORS.item_button, fontFamily: "Avenir"}}>Nutritional Facts</Text>
              <View style={{marginTop: 10}}>
                <View>
                  {/*Header*/}
                  <View style={{flexDirection: "row"}}>
                    <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text, fontFamily: "Avenir"}}>Serving Size: </Text>
                    <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text_sub, fontFamily: "Avenir"}}>--</Text>
                  </View>
                  <View style={{flexDirection: "row"}}>
                    <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text, fontFamily: "Avenir"}}>Serving Weight: </Text>
                    <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text_sub, fontFamily: "Avenir"}}>--</Text>
                  </View>
                </View>
                <View style={{marginTop: 20}}>
                  {/*Body*/}
                  <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 15}}>
                    <Text style={{fontSize: 17, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text, fontFamily: "Avenir"}}>Nutrient</Text>
                    <Text style={{fontSize: 17, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text, fontFamily: "Avenir"}}>Amount Per Serving</Text>
                  </View>

                  <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                    <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text_sub, fontFamily: "Avenir"}}>Calories</Text>
                    <View style={{flexDirection: "row", width: 50, justifyContent: "space-between"}}>
                      <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text_sub, fontFamily: "Avenir"}}></Text>
                      <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text_sub, fontFamily: "Avenir"}}>--</Text>
                    </View>
                  </View>

                  <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                    <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text_sub, fontFamily: "Avenir"}}>Total Fat</Text>
                    <View style={{flexDirection: "row", width: 100, justifyContent: "space-between"}}>
                      <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text_sub, fontFamily: "Avenir"}}>--</Text>
                      <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text_sub, fontFamily: "Avenir"}}>--</Text>
                    </View>
                  </View>

                  <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                    <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text_sub, fontFamily: "Avenir"}}>Total Carbohydrate</Text>
                    <View style={{flexDirection: "row", width: 100, justifyContent: "space-between"}}>
                      <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text_sub, fontFamily: "Avenir"}}>--</Text>
                      <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text_sub, fontFamily: "Avenir"}}>--</Text>
                    </View>
                  </View>

                  <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                    <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text_sub, fontFamily: "Avenir"}}>Total Protein</Text>
                    <View style={{flexDirection: "row", width: 100, justifyContent: "space-between"}}>
                      <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text_sub, fontFamily: "Avenir"}}>--</Text>
                      <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "left", color: APP_COLORS.back_text_sub, fontFamily: "Avenir"}}>--</Text>
                    </View>
                  </View>

                </View>
              </View>
            </View>
        </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: "center"
  },
});
