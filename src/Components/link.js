import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Dimensions } from 'react-native';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function Link({Btext, Ltext, style, onPress}) {
    if (style == "s") {
        return (
            <View style={{flexDirection:"row", marginTop: 10}}>
            <Text style={{fontSize: 12, color: APP_COLORS.link_btn_tint}}>{Btext}</Text>
            <TouchableOpacity style={{alignSelf:"flex-start"}} onPress={onPress}>
                <Text style={{color: APP_COLORS.link_btn_tint, alignSelf:"flex-start", fontSize: 12, fontWeight: "bold"}}>{Ltext}</Text>
            </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <View style={{flexDirection:"row", marginTop: 20}}>
              <Text style={{fontSize: 13, color: APP_COLORS.link_btn_tint}}>{Btext}</Text>
              <TouchableOpacity style={{alignSelf:"flex-start"}} onPress={onPress}>
                  <Text style={{color: APP_COLORS.link_btn_tint, alignSelf:"flex-start", fontSize: 13, fontWeight: "bold"}}>{Ltext}</Text>
              </TouchableOpacity>
            </View>
        )
    }
}