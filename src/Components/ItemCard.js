import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import {FontAwesome} from "@expo/vector-icons"
import { resizeImage, numberFormat, addToCart, updateQuantity, saveItem, unsaveItem } from './functions';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function ItemCard({item, navigation, cart, fav, cartdata, data, sub, index}) {

    return (
        <View style={{marginHorizontal: sub ? 20 : 10, width: screenWidth*0.4, alignItems: "center", marginTop: sub ? (index == 0? 40:0):(10), justifyContent: "flex-end", alignItems: "flex-start", marginBottom: sub ? 40 : 0}}>
            <TouchableOpacity style={{marginLeft: 3}} onPress={() => navigation.navigate("StoreItem",{name: item.name, price: item.price, accent: APP_COLORS.item_button, storeName: data.storeData.name, storeAddress: data.storeData.address, storeLogo: data.storeData.logoUrl})}>
                <Image  defaultSource={require('../../assets/art/item.png')} resizeMode="contain" source={{uri: resizeImage(item.info.logoUrl)}} style={{height: screenHeight*0.15, width: screenWidth*0.3}} />
                <View style={{flexDirection: "row"}}>
                <View style={{height: 50, width: screenWidth*0.3, justifyContent: "flex-start"}}>
                    <Text style={{fontSize: 12, textAlign: "left", fontWeight: "bold", marginBottom: 3, fontFamily: "Avenir", color: APP_COLORS.back_text}}>{numberFormat(item.price)} </Text>
                    <Text numberOfLines={2} style={{fontSize: 11, textAlign: "left", fontFamily: "Avenir", color: APP_COLORS.back_text}}>{item.name}</Text>
                </View>
                <TouchableOpacity onPress={() => fav.includes(item.name) ? unsaveItem(item.name, data.storeData.name, data.storeData.address) : saveItem(item, data.storeData.name, data.storeData.address, data.storeData.logoUrl)}>
                    <FontAwesome size={20} name={ fav.includes(item.name) ? "heart" : "heart-o"}color={APP_COLORS.item_btn_text} />
                </TouchableOpacity>
                </View>
            </TouchableOpacity>
            {/*<TouchableOpacity style={{top: 0, right: 0, position: "absolute"}}><Ionicons name="ios-heart-outline" color={accent} size={30} /></TouchableOpacity>*/}
            {cart.includes(item.name) ? (
            <View style={{width: screenWidth*0.4, backgroundColor: "#fff", height: screenHeight*0.05, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 5}}>
                {cartdata[item.name] ? (
                <TouchableOpacity onPress={() => updateQuantity(item.name, cartdata[item.name].quantity, cartdata[item.name].quantity == 1 ? "trash-o" : "minus", data.storeData.name, data.storeData.address)}>
                    <FontAwesome size={20} name={cartdata[item.name].quantity == 1 ? "trash-o" : "minus"} color={APP_COLORS.item_button} />
                </TouchableOpacity>):(
                <TouchableOpacity onPress={() => updateQuantity(item.name, cartdata[item.name].quantity, "minus", data.storeData.name, data.storeData.address)}>
                    <FontAwesome size={20} name="minus" color={APP_COLORS.item_button} />
                </TouchableOpacity>
                )}
                <Text style={{fontSize: 20, fontFamily: "Avenir"}}>{ cartdata[item.name] ? (cartdata[item.name].quantity):("")}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.name, cartdata[item.name].quantity, "plus", data.storeData.name, data.storeData.address)}>
                    <FontAwesome size={20} name="plus" color={APP_COLORS.item_button} />
                </TouchableOpacity>
            </View>
            ):(
            <TouchableOpacity onPress={() => addToCart(item.name, item.price, 1, item.info.logoUrl, data.storeData.name, data.storeData.address, data.storeData.logoUrl)} style={{width: screenWidth*0.4, height: screenHeight*0.05, backgroundColor: APP_COLORS.item_button, alignItems: "center", borderRadius: 10, justifyContent: "center", marginTop: 5, flexDirection: "row"}}>
                <Text style={{color: APP_COLORS.item_btn_text, fontWeight: "bold", fontFamily: "Avenir"}}>Add to basket </Text>
                {/*<FontAwesome size={15} name="shopping-basket" color="#fff" />*/}
            </TouchableOpacity>)}
        </View>
        )
}
const styles = StyleSheet.create({
    
})