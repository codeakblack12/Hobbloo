import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, FlatList, TouchableOpacity, ImageBackground, ScrollView, LogBox, Image } from 'react-native';
import {Feather, Ionicons, FontAwesome} from "@expo/vector-icons"
import {resizeImage, numberFormat} from "../../Components/functions"
import firebase from "firebase"
import * as Haptics from 'expo-haptics';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function StoreItem({route, navigation}) {

  const {data, accent, storeName, storeAddress, storeLogo} = route.params;
  
  const [cart, setCart] = useState([])
  const [cartdata, setCartdata] = useState([])
  useEffect(() => {
    LogBox.ignoreAllLogs()
    readCart()
    navigation.setOptions({title: data.name})
  }, []);

  const readCart = () => {
    firebase.database().ref("User Data/Customers/" + userid + "/cart/" + storeName + "-" + storeAddress + "/Items/").on('value', function (snapshot) {
      if (snapshot.val() != null){
        let responselist = Object.keys(snapshot.val())
        setCart(Object.keys(snapshot.val()))
        setCartdata(snapshot.val())
        console.log(responselist)
      }else{
        setCart([])
      }
    });
  }

  const addToCart = (item, qty) => {
    try {
      firebase
          .database()
          .ref("User Data/Customers/" + userid + "/cart/" + storeName + "-" + storeAddress)
          .update({
          storeName: storeName,
          storeAddress: storeAddress,
          storeLogo: storeLogo,
          }).then(() => {
            try {
              firebase
                  .database()
                  .ref("User Data/Customers/" + userid + "/cart/" + storeName + "-" + storeAddress + "/Items/" + item.name)
                  .set({
                  name: item.name,
                  price: item.price,
                  quantity: qty,
                  logo: storeLogo
                  }).then(() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                  //alert(item.name + " added to cart!")
                  }).catch((error) => {
                  alert(error)
              });
            } catch (e){
                console.log(e);
            }
          }).catch((error) => {
      });
    } catch(e){
        console.log(e);
    }
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

  const updateQuantity = (item, qty, val) => {
    if(val == "plus"){
      var quant = qty + 1
    }
    else{
      var quant = qty - 1
    }

    if(qty == 1 & val == "trash-o"){
      let userRef = firebase.database().ref("User Data/Customers/" + userid + "/cart/" + storeName + "-" + storeAddress + "/Items/" + item.name);
      userRef.remove()
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      checkCart()
      return
    }

    try {
      firebase
          .database()
          .ref("User Data/Customers/" + userid + "/cart/" + storeName + "-" + storeAddress + "/Items/" + item.name)
          .update({
          quantity: quant,
          }).then(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
          }).catch((error) => {
          alert(error)
      });
    } catch (e) {
        console.log(e);
    }
  }

  return (
    <View style={styles.container}>
        <View style={{alignItems: "center"}}>
            <Image resizeMode="contain" source={{uri: resizeImage(data.info.logoUrl)}} style={{height: screenHeight*0.3, width: screenWidth*0.6}} />
            <Text style={{fontSize: 18, fontWeight: "700", textAlign: "center"}}>{data.name}</Text>
            <Text style={{fontSize: 16, fontWeight: "700", textAlign: "center", marginTop: 10}}>{numberFormat(data.price)}</Text>
        </View>
        <View style={{width: screenWidth, height: screenHeight*0.13, backgroundColor: "transparent", position: "absolute", bottom: 0, flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
            {cart.includes(data.name) ?
            (<View style={{width: screenWidth*0.46, backgroundColor: "#f0f0f0", height: screenHeight*0.06, borderRadius: 7, flexDirection: "row", alignItems: "center", justifyContent: "space-around"}}>
              {cartdata[data.name] ? (
              <TouchableOpacity onPress={() => updateQuantity(data, cartdata[data.name].quantity, cartdata[data.name].quantity == 1 ? "trash-o" : "minus")}>
                  <FontAwesome size={20} name={cartdata[data.name].quantity == 1 ? "trash-o" : "minus"} color={accent} />
              </TouchableOpacity>):(
              <TouchableOpacity onPress={() => updateQuantity(data, cartdata[data.name].quantity, "minus")}>
                <FontAwesome size={20} name="minus" color={accent} />
              </TouchableOpacity>
              )}
              <Text style={{fontSize: 20}}>{ cartdata[data.name] ? (cartdata[data.name].quantity):("")}</Text>
              <TouchableOpacity onPress={() => updateQuantity(data, cartdata[data.name].quantity, "plus")}>
                  <FontAwesome size={20} name="plus" color={accent} />
              </TouchableOpacity>
            </View>):
            (<TouchableOpacity onPress={() => addToCart(data, 1)} style={{width: screenWidth*0.46, backgroundColor: accent, height: screenHeight*0.06, borderRadius: 7, flexDirection: "row", alignItems: "center", justifyContent: "space-around"}}>
              <Text style={{color: "#fff", fontWeight: "bold"}}>Add to basket </Text>
            </TouchableOpacity>)
            }
        </View>
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
