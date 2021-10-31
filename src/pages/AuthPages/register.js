import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ImageBackground } from 'react-native';
import PasswordInput from '../../Components/passwordinput';
import Button from '../../Components/button';
//import {firebaseConfig} from "../../../config";
import firebase from 'firebase';
import Link from '../../Components/link';


var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function RegisterPage({navigation}) {
    const [fname,setFname] = useState("");
    const [lname,setLname] = useState("");
    const [phone,setPhone] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [cpassword,setCpassword] = useState("");
    const [loading, setLoading] = useState(false)

    const RegisterUser = () => {
        setLoading(true)
        if(fname == "" || lname == "" || phone == "" || email == "" || password == "" || cpassword == ""){
            alert("Please complete all fields!")
        }else if(password !== cpassword){
            alert("Both passwords do not match!")
        }else{
            firebase.auth().createUserWithEmailAndPassword(email.toLowerCase(), password).then(function(result){
                console.log("User Registered!")
                firebase
                    .database()
                    .ref('User Data/Customers/' + result.user.uid)
                    .set({
                        email: email.toLowerCase(),
                        first_name: fname.toLowerCase(),
                        last_name: lname.toLowerCase(),
                        phone_number: phone,
                        everify: result.user.emailVerified,
                        date_created: Date.now()
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
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} enabled>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
        
        <TextInput style={styles.inputBox} placeholderTextColor='#A3A3A3' placeholder="First Name" onChangeText={text => setFname(text.replace(/\s/g, ''))}/>
        <TextInput style={styles.inputBox} placeholderTextColor='#A3A3A3' placeholder="Last Name" onChangeText={text => setLname(text.replace(/\s/g, ''))}/>
        <TextInput style={styles.inputBox} placeholderTextColor='#A3A3A3' placeholder="Phone Number" keyboardType="phone-pad" onChangeText={text => setPhone(text.replace(/\s/g, ''))}/>
        <TextInput style={styles.inputBox} placeholderTextColor='#A3A3A3' placeholder="E-mail" onChangeText={text => setEmail(text.replace(/\s/g, ''))} />
        <PasswordInput placeholder="Password" onCT={text => setPassword(text.replace(/\s/g, ''))}/>
        <PasswordInput placeholder="Confirm Password" onCT={text => setCpassword(text.replace(/\s/g, ''))}/>
        <View style={{marginTop: 50}}>
            <Button onPress={() => RegisterUser()} btnDisable={loading} text={ !loading?("Register"):(<ActivityIndicator size="small" />)} style="large"/>
        </View>
        <Link Btext="Already have an account? " Ltext="Log in" style="l" onPress={() => navigation.navigate("LoginPage")}/>

    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    marginVertical: 10,
    borderColor: "#BDBDBD",
    borderWidth: 1
},
});
