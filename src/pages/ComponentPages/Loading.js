import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ImageBackground, Dimensions } from 'react-native';
import firebase from 'firebase';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function Loading({navigation}) {

  useEffect(() => checkIfLoggedIn())

  const checkIfLoggedIn = () => {
      firebase.auth().onAuthStateChanged(function(user)
        {
            if(user)
            {
              //console.log(user.uid)
              navigation.navigate('MainNavi')
            }
             else {
                navigation.navigate('AuthNavigation')
            }
      })
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require("../../../assets/HOBBLOO/HOBBLOO5.png")} resizeMode="contain" style={{flex: 1, justifyContent: "center"}}>
      <ActivityIndicator style={{marginTop: screenHeight*0.2}} size="large" />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
