import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity, ScrollView, Alert } from 'react-native';
import {FontAwesome5, Feather, MaterialIcons, MaterialCommunityIcons, FontAwesome, Ionicons, SimpleLineIcons} from "@expo/vector-icons"
import firebase from 'firebase';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { firstUppercase, Initials } from '../../Components/functions';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;



export default function ProfilePage() {
    const tabBarheight = useBottomTabBarHeight();

    const LogOutbutton = () => {
        Alert.alert(
          'Log Out',
          'Are you sure you want to log out?',
          [
            {text: 'yes', onPress: () => firebase.auth().signOut()},
            {text: 'no', onPress: () => console.log('Still logged In!')},
            
          ]
        );
    }

    
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: "#fff", marginBottom: tabBarheight}}>
        <View style={styles.container}>
            <View style={{flexDirection: "row", alignItems: "center", marginVertical: 40, width: screenWidth*0.95, justifyContent: "flex-start"}}>
                {/*<View style={{borderWidth: 1, borderColor: "#4e4d4d", width: (screenWidth/2)}}/>*/}
                <View style={{width: 80, height: 80, borderRadius: 40, borderWidth: 7, borderColor: "#29ABE2", alignItems: "center", justifyContent: "center"}}>
                    <Text style={{fontSize: 25, fontWeight: "bold"}}>{Initials(userdata.first_name + " " + userdata.last_name)}</Text>      
                </View>
                <Text style={{fontSize: 16, marginLeft: 10, fontWeight: "bold"}}>{firstUppercase(userdata.first_name)} {firstUppercase(userdata.last_name)}</Text>
                {/*<View style={{borderWidth: 1, borderColor: "#4e4d4d", width: (screenWidth/2)}}/>*/}
            </View>
            <TouchableOpacity style={styles.btn}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Feather name="shopping-bag" size={22} />
                    <Text style={styles.btnText}>My orders</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={30} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <FontAwesome5 name="user" size={22} />
                    <Text style={styles.btnText}>My details</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={30} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <MaterialCommunityIcons name="folder-key-outline" size={22} />
                    <Text style={styles.btnText}>Change Password</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={30} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <MaterialCommunityIcons name="wallet-outline" size={22} />
                    <Text style={styles.btnText}>E-wallet/Payment method</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={30} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <MaterialCommunityIcons name="history" size={22} />
                    <Text style={styles.btnText}>Order History</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={30} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <MaterialCommunityIcons name="bell-ring-outline" size={22} />
                    <Text style={styles.btnText}>Notifications</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={30} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Feather name="users" size={22} />
                    <Text style={styles.btnText}>Contact preferences</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={30} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <MaterialCommunityIcons name="ticket-confirmation-outline" size={22} />
                    <Text style={styles.btnText}>Gift cards and vouchers</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={30} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Feather name="phone-call" size={22} />
                    <Text style={styles.btnText}>Need help?</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={30} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Feather name="star" size={22} />
                    <Text style={styles.btnText}>Rate the app</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={30} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <FontAwesome name="pencil-square-o" size={22} />
                    <Text style={styles.btnText}>Help improve the app</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={30} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => LogOutbutton()}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Ionicons name="log-out-outline" size={22} />
                    <Text style={styles.btnText}>Sign out</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={30} />
            </TouchableOpacity>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: "center",
    justifyContent: "flex-start",

  },
  btn: {
    width: screenWidth*0.95,
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
    height: 85,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  btnText: {
    fontSize: 15, 
    marginLeft: 10, 
    fontWeight: "500"
  }
});
