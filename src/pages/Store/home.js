import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, FlatList, TouchableOpacity, ImageBackground, ScrollView, LogBox } from 'react-native';
import {Feather, Ionicons, FontAwesome} from "@expo/vector-icons"
import { LinearGradient } from 'expo-linear-gradient';
import firebase from '../../../config'
import {resizeImage} from "../../Components/functions"

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function StoreHome({route, navigation}) {

  const [available, setAvailable] = useState([])
  const [avail, setAvail] = useState(["empty"])
  const [fetching, setFetching] = useState("")

  const {data, accent} = route.params;

  useEffect(() => {
    LogBox.ignoreAllLogs()
    getAvailableCategories()
  }, []);

  const getAvailableCategories = async () => {
    setFetching("loading...")
    var url = "https://us-central1-hobbloo-4e226.cloudfunctions.net/availableCategories?name=" + data.storeData.name + "&address=" + data.storeData.address
    let response = await fetch(
      url, {
        headers: {}
      }
    );
    let json = await response.json();
    setAvailable(json)
    setFetching("empty")
    
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[accent,  'transparent']} locations={[0.3, 1]} style={{width:screenWidth, height: screenHeight * 0.1, alignItems: "center", justifyContent: "center", flexDirection: "row", backgroundColor: "transparent"}}>
        <View style={{flexDirection: "row", backgroundColor: "transparent"}}>
          <TextInput style={styles.inputBox} placeholderTextColor='#A3A3A3' placeholder={"Search " + data.storeData.name + "..."} placeholderTextColor="#BDBDBD" />
          <View style={{backgroundColor: "transparent", width: screenWidth * 0.12, height: screenHeight * 0.05, position: "absolute", left: 0, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, alignItems: "center", justifyContent: "center", alignSelf: "center"}}>
            <Feather name="search" color="#A3A3A3" size={20} />
          </View>
        </View>
      </LinearGradient>
      {available.length > 0 ? (<ScrollView>
        <View style={{flexDirection: "row", alignItems: "center", width: screenWidth*0.9, alignSelf: "center", justifyContent: "space-between"}}>
          <Text style={{fontSize: 25, fontWeight: "600"}}>Inventory</Text>
          <TouchableOpacity><Text style={{fontSize: 15}}>See all items</Text></TouchableOpacity>
        </View>
        <FlatList
            data={available}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) =>
            <View style={{alignItems: "center", marginBottom: 20}}>
              <View style={styles.btn}>
                <TouchableOpacity onPress={() => navigation.navigate("StoreCategory",{data: data, category: item.name, accent: accent})} style={{overflow: "hidden", borderRadius: 5}}>
                <ImageBackground resizeMode="cover" source={{uri: resizeImage(item.logoUrl)}} style={{height: screenHeight*0.13, width: screenWidth*0.9}} >
                  <Text style={{fontSize: 17, color: "#fff", position: "absolute", bottom: 15, left: 15, fontWeight: "bold"}}>{item.name}</Text>
                </ImageBackground>
                </TouchableOpacity>
              </View>
            </View>
            }
          />
      </ScrollView>):(
      <View style={{alignItems: "center", flex: 1, justifyContent: "center"}}>
        <FontAwesome name="shopping-basket" size={50} color="#A3A3A3" />
        <Text style={{color: "#A3A3A3", marginTop: 10 }}>{data.storeData.name} is {fetching}</Text>
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputBox: {
    width: screenWidth * 0.90,
    height: screenHeight * 0.05,
    backgroundColor: '#fff',
    borderRadius: 5,
    fontSize: 12,
    color: 'black',
    marginVertical: 10,
    paddingLeft: 45,
},
btn: {
  alignItems: "center", 
  justifyContent: "center", 
  marginHorizontal:20, 
  height: screenHeight*0.13, 
  width: screenWidth*0.9, 
  backgroundColor: "#313131", 
  borderRadius: 5, 
  marginTop: 10,
  shadowColor: "black",
  shadowOpacity: 0.5,
  elevation: 8,
  shadowOffset: {width: 0, height: 3},
  shadowRadius: 5,
}
});
