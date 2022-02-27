import React, {useEffect, useState, useLayoutEffect} from 'react';
import { StyleSheet, Text, View, LogBox, FlatList, Dimensions, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import firebase from "firebase"
import {Ionicons, FontAwesome} from "@expo/vector-icons"
import { resizeImage, numberFormat } from '../../Components/functions';
import Dialog from "react-native-dialog";
import * as Haptics from 'expo-haptics';
import { saveBasket, updateQuantity } from '../../Components/functions';

const numColumns = 1
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function Cart({route, navigation}) {
  const {storeName, storeAddress, storeLogo} = route.params;
  const [cart, setCart] = useState([])
  const [dialogvisible, setDialogvisible] = useState(false);
  const [name, setName] = useState("")
  const [issaved, setIssaved] = useState(false)

  useLayoutEffect(() => {
    //readFavBaskets()
    readCart()
  }, []);

  useEffect(() => {
    LogBox.ignoreAllLogs()
    navigation.setOptions({
      title: storeName + " Basket",
      headerRight: () => (
        <TouchableOpacity onPress={() => setDialogvisible(true)} style={{marginRight: 25}}>
          <FontAwesome size={23} name= {"heart-o"} color={APP_COLORS.item_btn_text} />
        </TouchableOpacity>
      )
    })
  }, []);

  let trimString = function (string, length) {
    return string.length > length ? 
           string.substring(0, length) + '...' :
           string;
  };

  const _renderItem = ({item, index}) => {
    let {itemStyle, itemText, itemInvisible, btnStyle} = styles
    if (item.empty){
        return <View style={[itemStyle, itemInvisible]} />
    }
    return (
      <View style={{backgroundColor: APP_COLORS.cart_card, width: screenWidth * 0.95, minHeight: 120, marginTop: 5, flexDirection: "row", alignItems: "center", paddingVertical: 10, marginBottom: index == cart.length - 1 ? 100 : 0, borderBottomWidth: 1, borderColor: "rgba(60,19,97,0.2)"}}>
         <Image resizeMode="contain" source={{uri: resizeImage(item.logo)}} style={{height: screenWidth * 0.22, width: screenWidth * 0.22, marginLeft: 10}} />
         <View style={{marginLeft: 15, width: screenWidth * 0.5}}>
            <Text style={{fontSize: 13, fontWeight: "600"}}>{trimString(item.name, 100)}</Text>
            <Text style={{color: "#a0a0a0", marginTop: 3, fontSize: 11}}>{numberFormat(item.price)} / unit</Text>
            <View style={{width: screenWidth * 0.2, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10}}>
                <TouchableOpacity onPress={() => updateQuantity(item.name, item.quantity, item.quantity == 1 ? "trash-o" : "minus", storeName, storeAddress)}>
                    <FontAwesome size={16} name={item.quantity == 1 ? "trash-o" : "minus"} color="#000" />
                </TouchableOpacity>
                <View style={{width: 40, height: 40, borderRadius: 5, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#8a8a8a"}}>
                    <Text style={{fontSize: 13}}>{item.quantity}</Text>
                </View>
                <TouchableOpacity onPress={() => updateQuantity(item.name, item.quantity, "plus", storeName, storeAddress)}>
                    <FontAwesome size={16} name="plus" color="#000" />
                </TouchableOpacity>
            </View>
         </View>
         <View style={{flexDirection: "row", width: screenWidth*0.3, position: "absolute", right: 0, alignItems: "center", justifyContent: "center"}}>
            <Text style={{fontSize: 13, fontWeight: "600", marginLeft: 5}}>{numberFormat(item.quantity * item.price)}</Text>
         </View>
      </View>
    )
}

  const readCart = () => {
    firebase.database().ref("User Data/Customers/" + userid + "/cart/" + storeName + "-" + storeAddress + "/Items/").on('value', function (snapshot) {
      if (snapshot.val() != null){
        let responselist = Object.keys(snapshot.val())
        setCart(Object.values(snapshot.val()))
        checkCart()
        //console.log(Object.values(snapshot.val()))
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

const handleCancel = () => {
  setDialogvisible(false);
};

 const getCheckout = (item) => {
    var checkout = 0
    for(var i = 0; i < item.length; i++){
        var value = item[i].price * item[i].quantity
        checkout = checkout + value
    }
    return checkout
 }

  return (
    <View style={[styles.container, {backgroundColor: APP_COLORS.background_color}]}>
        <Dialog.Container visible={dialogvisible} contentStyle={{width: screenWidth * 0.8, marginBottom: 80}} onBackdropPress={handleCancel}>
          <Dialog.Title style={{fontSize: 15, textAlign: "left", fontFamily: "Avenir", color: APP_COLORS.back_text, fontWeight: "bold"}}>Basket Name</Dialog.Title>
          <Dialog.Description style={{fontSize: 12, textAlign: "left", fontFamily: "Avenir", color: APP_COLORS.back_text}}>
              Give your basket a personalized name
          </Dialog.Description>
          <Dialog.Input style={{fontFamily: "Avenir"}} onChangeText={text => setName(text)} autoFocus={true}></Dialog.Input>
          <Dialog.Button bold onPress={() => setDialogvisible(false)} label="Cancel" />
          <Dialog.Button onPress={() => {saveBasket(name, cart, storeName, storeAddress, storeLogo), setDialogvisible(false)}} label="Ok" />
        </Dialog.Container>
        {cart.length > 0 ?
        (<FlatList
        data={cart}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        />):(
            <View style={{alignItems: "center", flex: 1, justifyContent: "center"}}>
                <FontAwesome name="shopping-basket" size={50} color="#A3A3A3" />
                <Text style={{color: "#A3A3A3", marginTop: 10 }}>Your basket is empty.</Text>
            </View>
        )
        }
        <TouchableOpacity onPress={() => navigation.navigate("Checkout", {storeName: storeName, storeAddress: storeAddress, storeLogo: storeLogo})} activeOpacity={0.7} style={{width: screenWidth*0.8, height: 70, backgroundColor: APP_COLORS.checkout_btn, position: "absolute", bottom: 20, borderRadius: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <View style={{marginLeft: 15}}>
                <Text style={{fontSize: 14, fontWeight: "500", color: "#fff"}}>Checkout</Text>
                <Text style={{fontSize: 22, fontWeight: "700", marginTop: 10, color: "#fff"}}>{numberFormat(getCheckout(cart))}</Text>
            </View>
            <View style={{position: "absolute", right: 5}}><Ionicons size={30} name="chevron-forward-sharp" color="#fff" /></View>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: "center"
    },
});
  