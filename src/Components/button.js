import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Dimensions } from 'react-native';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function Button({text, style, onPress, btnDisable}) {
    if (style == "small") {
        return (
            <View>
                <TouchableOpacity disabled={btnDisable} style={styles.Smallbtn} onPress={onPress}>
                    <Text style={{color: '#fff'}}>{text}</Text>
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <View>
                <TouchableOpacity style={styles.Largebtn} onPress={onPress}>
                    <Text style={{color: '#fff', fontWeight: "bold"}}>{text}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
  Smallbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#29ABE2',
    width: screenWidth * 0.78,
    height: screenHeight * 0.06,
    borderRadius: 10 ,
    marginVertical: 10,
    alignSelf: "center",
    shadowOpacity: 0.3,
    elevation: 13
  },
  Largebtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#29ABE2',
    width: screenWidth * 0.5,
    height: screenHeight * 0.065,
    borderRadius: 10 ,
    marginVertical: 10,
    alignSelf: "center",
  },
  });