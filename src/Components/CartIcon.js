import React, {useEffect, useState, useLayoutEffect} from 'react';
import { StyleSheet, TouchableOpacity, Text, View, LogBox } from 'react-native';
import {FontAwesome} from "@expo/vector-icons"
import firebase from "firebase"
import * as Animatable from "react-native-animatable"

export default function CartIcon({navigation}) {

    const [cartAmt, setCartAmt] = useState(0)

    useLayoutEffect(() => {
        firebase.database().ref("User Data/Customers/" + userid + "/cart").on('value', function (snapshot) {
            if (snapshot.val() != null){
              let responselist = Object.values(snapshot.val() == null ? [] : snapshot.val())
              var j = 0
              for(var i = 0; i < responselist.length; i++){
                j = j + Object.values(responselist[i].Items == null ? [] : responselist[i].Items).length
              }
              setCartAmt(j)
            }else{
              setCartAmt(0)
              console.log(snapshot.val())
            }
        });
    }, [])

    const trim_number = (number) => {
        if(number > 99){
            return "99+"
        }else{
            return number
        }
    }

    const ScaleIn = {
        from: {
          scale: 0
        },
        to: {
          scale: 1
        },
    };

    const ScaleOut = {
        from: {
          scale: 1
        },
        to: {
          scale: 0
        },
    };


    return (
        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity onPress={() => navigation.navigate("CartNavi")} style={{marginRight: 25}}>
            <FontAwesome size={25} name="shopping-basket" color={APP_COLORS.back_text} />
            
            <Animatable.View animation={cartAmt > 0 ? ScaleIn : ScaleOut} duration={300} style={{position: "absolute", backgroundColor: APP_COLORS.item_button, minWidth: 25, height: 25, alignItems: "center", justifyContent: "center", borderRadius: 13, top: -10, right: -10,  alignSelf: 'center', padding: 4}}>
                <Text style={{fontSize: 12, fontWeight: "bold", fontFamily: "Avenir", color: APP_COLORS.item_btn_text}}>{trim_number(cartAmt)}</Text>
            </Animatable.View>
            </TouchableOpacity>
        </View>
        )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E3E3E3"
    }
});