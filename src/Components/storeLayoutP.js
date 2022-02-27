import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, LogBox, Text, View, Dimensions, Button, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground, TextInput, ScrollView, Image } from 'react-native';
import { SimpleLineIcons, MaterialIcons, Fontisto, Ionicons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import ImageColors from 'react-native-image-colors'
import {resizeImage} from "./functions"
import ContentLoader from "react-native-easy-content-loader";
import {getUserdata, firstUppercase, getGreeting, getComment} from "./functions"
import { LinearGradient } from 'expo-linear-gradient';
import { Flow } from 'react-native-animated-spinkit'

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function StoreLayoutP({item, navigation}) {

    const StoreNavigate = (item, accent) => {
        navigation.navigate("StoreNavigation",{data: item, accent: accent})
    }

    const randColor = () => {
        var colors = ["#F89F4B"]
        var random = Math.floor(Math.random() * colors.length);
        return colors[random]
    }

    return (
        <TouchableOpacity
        onPress={() => StoreNavigate(item, randColor())}
        activeOpacity={0.6}
        style={{shadowColor: "black",
        shadowOpacity: 0.5,
        elevation: 8,
        shadowOffset: {width: 0, height: 3},
        shadowRadius: 5,}}>
            <LinearGradient locations={[0.6, 1.0]} start={[0,0]} end={[1,0]} colors={APP_COLORS.shop_card} style={styles.pbtnStyle}>
                  <View style={{height: screenHeight*0.15, width: screenHeight*0.15, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, overflow: "hidden", backgroundColor: "#fff", marginRight: 5}}>
                    <ImageBackground resizeMode="contain" defaultSource={require('../../assets/art/placeholder-store.png')}  source={{uri: resizeImage(item.storeData.logoUrl)}} style={{height: screenHeight*0.15, width: screenHeight*0.15}} >
                    </ImageBackground>
                  </View>
                  <View style={{width: screenWidth*0.5, alignItems: "flex-start", marginTop: 10, marginLeft: 5}}>
                    <Text style={{color:"#fff", fontSize: 14, fontWeight: "bold"}}>{item.storeData.name}</Text>
                    <Text style={{color:"#fff", fontSize: 12, fontWeight: "500", flexWrap: "wrap", marginTop: 5, fontFamily: "Avenir"}}>{item.storeData.address}</Text>
                    <Text style={{color:"#fff", fontSize: 10, fontWeight: "bold", marginTop: 5, fontFamily: "Avenir"}}>{item.durationText}</Text>
                  </View>
            </LinearGradient>
        </TouchableOpacity>
        )
}
const styles = StyleSheet.create({
    pbtnStyle: {
        alignItems: "flex-start", 
        justifyContent: "flex-start", 
        marginHorizontal:20, 
        height: screenHeight*0.15, 
        width: screenWidth*0.90,
        marginTop: 20, 
        borderRadius: 15, 
        shadowColor: "black",
        shadowOpacity: 0.4,
        elevation: 8,
        shadowOffset: {width: 0, height: 1},
        shadowRadius: 3,
        flexDirection: "row"
    },
})