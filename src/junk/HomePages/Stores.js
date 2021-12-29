import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground } from 'react-native';
//import firebase from "../../../adminConfig"
import firebase from 'firebase';
import * as Location from 'expo-location';
//import functions from '@react-native-firebase/functions';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;


export default function StoresPage({navigation}) {


  const [stores, setStores] = useState([]);
  const [fetching, setFetching] = useState(false)

  const randColor = () => {
    //var colors = ["#EC3539", "#F16136", "#007A3E", "#DA2418", "#D41F42", "#008080", "#1E90FF", "#4B0082", "#800080", "#FF00FF", "#8B4513"]
    var colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

    var random = Math.floor(Math.random() * colors.length);
    return colors[random]
  }
  

  useEffect(() => {
    navigation.setOptions({ title: '', headerStyle: {height: 70, shadowOpacity: 0}})
    PinLocation()
  }, []);

const PinLocation = async () => {
  setFetching(true)
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      setFetching(false)
      return;
  }
  var pinlocation = await Location.getCurrentPositionAsync({});
  var url = "https://us-central1-hobbloo-4e226.cloudfunctions.net/sortedStores?lat=" + pinlocation.coords.latitude + "&long=" + pinlocation.coords.longitude
    let response = await fetch(
      url, {
        headers: {},
      }
    );
    let json = await response[0].json();
  console.log(json)
  setStores(json)
  setFetching(false)
}

  return (
    <View style={styles.container}>
        {fetching? (<View><ActivityIndicator size="large" color="#29ABE2"/><Text style={{marginTop: 10, color: "#8A8A8A"}}>Fetching stores</Text></View>):(
        <FlatList
          data={stores}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            <TouchableOpacity style={[styles.btnStyle, {backgroundColor: randColor()}]}>
              <View style={{height: screenHeight*0.17, width: screenWidth*0.85, borderRadius: 15, overflow: "hidden"}}>
                <ImageBackground resizeMode="cover" source={{uri: item.logo}} style={{height: screenHeight*0.17, width: screenWidth*0.85}} >
                </ImageBackground>
              </View>
              <View style={{width: screenWidth*0.82, alignItems: "flex-start", marginTop: 10}}>
                <Text style={{color:"#fff", fontSize: 17, fontWeight: "bold"}}>{item.name}</Text>
                <Text style={{color:"#fff", fontSize: 12, fontWeight: "bold", marginTop: 5}}>{item.durationText}</Text>
              </View>
            </TouchableOpacity>
          }
        />)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: "center",
    justifyContent: "center",
  },
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
});
