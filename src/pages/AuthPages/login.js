import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, ActivityIndicator, Image } from 'react-native';
import PasswordInput from '../../Components/passwordinput';
import Button from '../../Components/button';
import {firebaseConfig} from "../../../config";
import firebase from 'firebase';
import Link from '../../Components/link';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function LoginPage({navigation}) {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loading, setLoading] = useState(false)

    const ResetPassword = () => {
        if(email == ""){
            alert("Please fill in your email address!")
        }
        else{
            var auth = firebase.auth();
            auth.sendPasswordResetEmail(email.toLowerCase()).then(function() {
            // Email sent.
            alert("A password reset email has been sent to "+ email)
            }).catch(function(errorr) {
            // An error happened.
                alert(errorr)
            });
        }
    }

    const LoginUser = () => {
        setLoading(true)
        if (email == "" || password == ""){
            alert("Please complete all fields!")
        }else{
            firebase.auth().signInWithEmailAndPassword(email, password).then(function(result){
                console.log("User signed in!")
                firebase
                    .database()
                    .ref('User Data/Customers/' + result.user.uid).update({
                        everify: result.user.emailVerified,
                        last_logged_in: Date.now()
                    })
            })
            
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage)
              });
        }
        setLoading(false)
    }

  return (
    <View style={[styles.container, {backgroundColor: APP_COLORS.background_color}]}>
        <Image style={{width: 250, height: 125}} resizeMode="contain" source={require("../../../assets/logos/IMG_0325.png")}/>
        <TextInput style={styles.inputBox} placeholderTextColor='#A3A3A3' placeholder="E-mail" onChangeText={text => setEmail(text.replace(/\s/g, ''))}/>
        <PasswordInput placeholder="Password" onCT={text => setPassword(text.replace(/\s/g, ''))}/>
        <View style={{alignItems: "flex-start", width: screenWidth * 0.78}}>
            <Link Btext="" Ltext="Forgot password?" style="s" onPress={() => ResetPassword()}/>
        </View>
        <View style={{marginTop: 50}}>
            <Button onPress={() => LoginUser()} btnDisable={loading} text={ !loading?("Log in"):(<ActivityIndicator size="small" />)} style="large"/>
        </View>
        <Link Btext="Don't have an account? " Ltext="Sign Up now" style="l" onPress={() => navigation.navigate("RegisterPage")}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  inputBox: {
    width: screenWidth * 0.78,
    height: screenHeight * 0.06,
    backgroundColor: '#f8f8ff',
    borderRadius: 10,
    paddingLeft:20,
    fontSize: 15,
    color: '#575757',
    marginVertical: 40,
    borderWidth: 1,
    borderColor: "#BDBDBD",
},
});
