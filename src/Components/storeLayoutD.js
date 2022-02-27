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

export default function StoreLayoutD({item, navigation, index, stores}) {

    const tabBarheight = useBottomTabBarHeight();

    const StoreNavigate = (item, accent) => {
        navigation.navigate("StoreNavigation",{data: item, accent: accent})
    }

    const randColor = () => {
        var colors = ["#F89F4B"]
        var random = Math.floor(Math.random() * colors.length);
        return colors[random]
    }

    return (
        <TouchableOpacity style={[styles.btnStyle, {backgroundColor: randColor(), marginBottom: index == stores.length - 1? tabBarheight + 20:0}]}>
            <View style={{height: screenHeight*0.17, width: screenWidth*0.85, borderRadius: 15, overflow: "hidden"}}>
                <ImageBackground defaultSource={require('../../assets/art/placeholder-store.png')} resizeMode="cover" source={{uri: resizeImage(item.storeData.logoUrl)}} style={{height: screenHeight*0.17, width: screenWidth*0.85}} >
                </ImageBackground>
            </View>
            <View style={{width: screenWidth*0.82, alignItems: "flex-start", marginTop: 10}}>
                <Text style={{color:"#fff", fontSize: 17, fontWeight: "bold"}}>{item.storeData.name}</Text>
                <Text style={{color:"#fff", fontSize: 12, fontWeight: "bold", marginTop: 5}}>{item.durationText}</Text>
            </View>
        </TouchableOpacity>
        )
}
const styles = StyleSheet.create({
    btnStyle: {
        alignItems: "center", 
        justifyContent: "flex-start", 
        marginHorizontal:20, 
        height: screenHeight*0.25, 
        width: screenWidth*0.85,
        marginTop: 20, 
        borderRadius: 15,
        shadowColor: "black",
        shadowOpacity: 0.4,
        elevation: 8,
        shadowOffset: {width: 0, height: 1},
        shadowRadius: 2,
    },
})