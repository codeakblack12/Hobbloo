import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, LogBox, Text, View, Dimensions, Button, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground, TextInput, ScrollView } from 'react-native';
import { SimpleLineIcons, MaterialIcons, Fontisto, Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import ImageColors from 'react-native-image-colors'
import {resizeImage} from "../../Components/functions"
import ContentLoader from "react-native-easy-content-loader";
import {getUserdata, firstUppercase, getGreeting} from "../../Components/functions"

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;


export default function StoresPage({navigation}) {

  const tabBarheight = useBottomTabBarHeight();

  const [stores, setStores] = useState([]);
  const [fetching, setFetching] = useState(false)
  const [design, setDesign] = useState(false)

  const [userdata, setUserdata] = useState([]);
  GLOBAL.userdata = userdata
  GLOBAL.setUserdata = setUserdata

  const [userid, setUserid] = useState("");
  GLOBAL.userid = userid
  GLOBAL.setUserid = setUserid

  GLOBAL.design = design
  GLOBAL.setDesign = setDesign

  const randColor = () => {
    var colors = ["#EC3539", "#F16136", "#007A3E", "#DA2418", "#D41F42", "#008080", "#1E90FF", "#4B0082", "#800080", "#8B4513"]
    /*var colors = ['#FF6633', "#EC3539", '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
    */
    var random = Math.floor(Math.random() * colors.length);
    return colors[random]
  }
  

  useEffect(() => {
    LogBox.ignoreAllLogs()
    PinLocation()
  }, []);

  const picColor = async (uri) => {
    await ImageColors.getColors(uri, {
      fallback: '#228B22',
      cache: true,
    })
    console.log("entered")
  }



const PinLocation = async () => {
  setFetching(true)
  getUserdata()
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      setFetching(false)
      return;
  }
  var pinlocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced});
  var url = "https://us-central1-hobbloo-4e226.cloudfunctions.net/sortedStores?lat=" + pinlocation.coords.latitude + "&long=" + pinlocation.coords.longitude
    let response = await fetch(
      url, {
        headers: {},
      }
    );
    let json = await response.json();
  //console.log(json)
  setStores(json)
  setFetching(false)
}

const layoutChange = () => {
  console.log(design)
  if(design){
    setDesign(false)
  }else{
    setDesign(true)
  }
}

const StoreNavigate = (item, accent) => {
  navigation.navigate("StoreNavigation",{data: item, accent: accent})
}

  return (
    <View style={[styles.container, {marginBottom: 0}]}>
      {design? (<View style={styles.container}>
          {fetching? (<View><ActivityIndicator size="large" color="#29ABE2"/><Text style={{marginTop: 10, color: "#8A8A8A"}}>Fetching stores</Text></View>):(
          <ScrollView>
          <View style={{width: screenWidth * 0.85, alignSelf: "center", marginVertical: 20}}><Text style={{fontSize: 25, fontWeight: "500"}}>Good morning, {userdata.last_name}</Text></View>
          <View style={{alignItems: "center"}}>
            <View style={{width:screenWidth, height: screenHeight * 0.09, backgroundColor: 'transparent', alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
              <View style={{flexDirection: "row"}}>
                <TextInput style={[styles.inputBox, {width: screenWidth * 0.85}]} placeholderTextColor='#A3A3A3' placeholder="Search..." placeholderTextColor="#BDBDBD"/>
                <View style={{backgroundColor: "transparent", width: screenWidth * 0.12, height: screenHeight * 0.05, position: "absolute", left: 0, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, alignItems: "center", justifyContent: "center", alignSelf: "center"}}>
                  <Feather name="search" color="#A3A3A3" size={20} />
                </View>
              </View>
            </View>
          <FlatList
            data={stores}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) =>
              <TouchableOpacity style={[styles.btnStyle, {backgroundColor: randColor(), marginBottom: index == stores.length - 1? tabBarheight + 20:0}]}>
                <View style={{height: screenHeight*0.17, width: screenWidth*0.85, borderRadius: 15, overflow: "hidden"}}>
                  <ImageBackground resizeMode="cover" source={{uri: item.storeData.logoUrl}} style={{height: screenHeight*0.17, width: screenWidth*0.85}} >
                  </ImageBackground>
                </View>
                <View style={{width: screenWidth*0.82, alignItems: "flex-start", marginTop: 10}}>
                  <Text style={{color:"#fff", fontSize: 17, fontWeight: "bold"}}>{item.storeData.name}</Text>
                  <Text style={{color:"#fff", fontSize: 12, fontWeight: "bold", marginTop: 5}}>{item.durationText}</Text>
                </View>
              </TouchableOpacity>
            }
          /></View>
        </ScrollView>)}
      </View>):(
        <View>
          {fetching? (<View><ActivityIndicator size="large" color="#29ABE2"/><Text style={{marginTop: 10, color: "#8A8A8A"}}>Fetching stores</Text></View>):(
          <ScrollView>
          <View style={{width: screenWidth * 0.90, alignSelf: "center", marginVertical: 20}}>{userdata.first_name ? (<Text style={{fontSize: 23, fontWeight: "bold"}}>{getGreeting()}, {firstUppercase(userdata.first_name)}</Text>):(<Text></Text>)}</View>
          <View style={{alignItems: "center"}}>
            <View style={{width:screenWidth, height: screenHeight * 0.09, backgroundColor: 'transparent', alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
              <View style={{flexDirection: "row"}}>
                <TextInput style={styles.inputBox} placeholderTextColor='#A3A3A3' placeholder="Search..." placeholderTextColor="#BDBDBD"/>
                <View style={{backgroundColor: "transparent", width: screenWidth * 0.12, height: screenHeight * 0.05, position: "absolute", left: 0, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, alignItems: "center", justifyContent: "center", alignSelf: "center"}}>
                  <Feather name="search" color="#A3A3A3" size={20} />
                </View>
              </View>
            </View>
            {stores.length > 0? (<View style={{width: screenWidth * 0.90, alignSelf: "center", marginTop: 10}}><Text style={{fontSize: 15, fontWeight: "bold"}}>Your closest store</Text></View>):(<View/>)}
            {stores.length > 0? (<TouchableOpacity onPress={() => StoreNavigate(stores[0], randColor())} activeOpacity={0.6} style={[styles.pbtnStyle, {backgroundColor: randColor()}]}>
                <View style={{height: screenHeight*0.15, width: screenHeight*0.15, borderRadius: 15, overflow: "hidden", backgroundColor: "#fff", marginRight: 5}}>
                  <ImageBackground resizeMode="contain" source={{uri: resizeImage(stores[0].storeData.logoUrl)}} style={{height: screenHeight*0.15, width: screenHeight*0.15}} >
                  </ImageBackground>
                </View>
                <View style={{width: screenWidth*0.5, alignItems: "flex-start", marginTop: 10}}>
                  <Text style={{color:"#fff", fontSize: 13, fontWeight: "bold"}}>{stores[0].storeData.name}</Text>
                  <Text style={{color:"#fff", fontSize: 11, fontWeight: "500", flexWrap: "wrap", marginTop: 5}}>{stores[0].storeData.address}</Text>
                  <Text style={{color:"#fff", fontSize: 10, fontWeight: "bold", marginTop: 5}}>{stores[0].durationText}</Text>
                </View>
            </TouchableOpacity>):(<View/>)}

            {stores.length > 1? (<View style={{width: screenWidth * 0.90, alignSelf: "center", marginTop: 30, marginBottom: 0}}><Text style={{fontSize: 15, fontWeight: "bold"}}>More stores in {stores[0].users_state}</Text></View>):(<View/>)}
            
            <FlatList
            data={stores.slice(1)}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: tabBarheight + 20 }}
            renderItem={({ item, index }) =>
              <TouchableOpacity onPress={() => StoreNavigate(item, randColor())} activeOpacity={0.6} style={[styles.pbtnStyle, {backgroundColor: randColor()}]}>
                <View style={{height: screenHeight*0.15, width: screenHeight*0.15, borderRadius: 15, overflow: "hidden", backgroundColor: "#fff", marginRight: 5}}>
                  <ImageBackground resizeMode="contain" source={{uri: resizeImage(item.storeData.logoUrl)}} style={{height: screenHeight*0.15, width: screenHeight*0.15}} >
                  </ImageBackground>
                </View>
                <View style={{width: screenWidth*0.5, alignItems: "flex-start", marginTop: 10}}>
                  <Text style={{color:"#fff", fontSize: 13, fontWeight: "bold"}}>{item.storeData.name}</Text>
                  <Text style={{color:"#fff", fontSize: 11, fontWeight: "500", flexWrap: "wrap", marginTop: 5}}>{item.storeData.address}</Text>
                  <Text style={{color:"#fff", fontSize: 10, fontWeight: "bold", marginTop: 5}}>{item.durationText}</Text>
                </View>
              </TouchableOpacity>
            }
          /></View>
          </ScrollView>)}
        </View>
      )
      }
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
  pbtnStyle: {
    alignItems: "flex-start", 
    justifyContent: "flex-start", 
    marginHorizontal:20, 
    height: screenHeight*0.15, 
    width: screenWidth*0.90,
    marginTop: 20, 
    borderRadius: 15, 
    shadowColor: "black",
    shadowOpacity: 0.4,
    elevation: 8,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 3,
    flexDirection: "row"
  },
  inputBox: {
    width: screenWidth * 0.90,
    height: screenHeight * 0.05,
    backgroundColor: '#eaeaea',
    borderRadius: 5,
    fontSize: 15,
    color: 'black',
    marginVertical: 10,
    paddingLeft: 45,
    borderWidth: 0,
    borderColor: "#A3A3A3"
},
});
