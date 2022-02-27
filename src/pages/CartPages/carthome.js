import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, LogBox, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import { resizeImage } from '../../Components/functions';
import firebase from "firebase"
import {Ionicons, FontAwesome} from "@expo/vector-icons"

const numColumns = 1
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function CartHome({navigation}) {

    const [cart, setCart] = useState([])

    useEffect(() => {
        LogBox.ignoreAllLogs()
        readCart()
    }, []);

    let trimString = function (string, length) {
        return string.length > length ? 
               string.substring(0, length) + '...' :
               string;
    };

    const readCart = () => {
        firebase.database().ref("User Data/Customers/" + userid + "/cart").on('value', function (snapshot) {
          if (snapshot.val() != null){
            let responselist = Object.keys(snapshot.val())
            setCart(Object.values(snapshot.val()))
            console.log(Object.values(snapshot.val()))
          }else{
            setCart([])
          }
        });
    }
    const _renderItem = ({item, index}) => {
        let {itemStyle, itemText, itemInvisible, btnStyle} = styles
        if (item.empty){
            return <View style={[itemStyle, itemInvisible]} />
        }
        return (
          <TouchableOpacity onPress={() => navigation.navigate("Cart", {data: item.items, storeName: item.storeName, storeAddress: item.storeAddress, storeLogo: item.storeLogo})} style={{backgroundColor: APP_COLORS.cart_card, width: screenWidth, minHeight: 80, marginTop: 5, flexDirection: "row", alignItems: "center", paddingVertical: 15}}>
              <Image resizeMode="contain" source={{uri: item.storeLogo ? resizeImage(item.storeLogo) : null}} style={{height: 50, width: 50, borderRadius: 25, borderWidth: 1, borderColor: "#f0f0f0", marginLeft: 10}} />
              <View style={{marginLeft: 10, width: screenWidth*0.7}}>
                  <Text style={{fontSize: 15, fontWeight: "600"}}>{item.storeName}</Text>
                  <Text style={{color: "#000", marginTop: 3, fontSize: 12}}>{item.storeAddress}</Text>
                  <Text style={{color: "#a0a0a0", marginTop: 3, fontSize: 12}}>{Object.keys(item.Items).length} items</Text>
              </View>
              <View style={{position: "absolute", right: 15}}><Ionicons size={25} name="chevron-forward-sharp" color="#000" /></View>
          </TouchableOpacity>
        )
    }
  return (
    <View style={[styles.container, {backgroundColor: APP_COLORS.background_color}]}>
        {cart.length > 0 ?
        (<FlatList
        data={cart}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns}
        />):(
            <View style={{alignItems: "center", flex: 1, justifyContent: "center"}}>
                <FontAwesome name="shopping-basket" size={50} color="#A3A3A3" />
                <Text style={{color: "#A3A3A3", marginTop: 10 }}>Your basket is empty.</Text>
            </View>
        )
        }
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f0f0',
      justifyContent: 'center',
      alignItems: "center"
    },
});
  