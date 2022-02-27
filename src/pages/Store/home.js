import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, FlatList, TouchableOpacity, ImageBackground, ScrollView, LogBox } from 'react-native';
import {Feather, Ionicons, FontAwesome} from "@expo/vector-icons"
import { LinearGradient } from 'expo-linear-gradient';
import firebase from '../../../config'
import {resizeImage} from "../../Components/functions"
import Carousel from 'react-native-snap-carousel';

import ItemCard from '../../Components/ItemCard';

const numColumns = 2
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function StoreHome({route, navigation}) {

  const ref = useRef(null);

  const [available, setAvailable] = useState([])
  const [allitems, setAllitems] = useState([])
  const [avail, setAvail] = useState(["empty"])
  const [fetching, setFetching] = useState("")

  const [cart, setCart] = useState([])
  const [fav, setFav] = useState([])
  const [cartdata, setCartdata] = useState([])

  const {data, accent} = route.params;

  useEffect(() => {
    LogBox.ignoreAllLogs()
    readCart()
    readFavItems()
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
    var categories = []
    for(var i = 0; i < json.length; i++){
      categories.push(json[i].name)
    }
    await getCatData(categories)
    setAvailable(json)
    setFetching("empty")
  }

  const readCart = () => {
    firebase.database().ref("User Data/Customers/" + userid + "/cart/" + data.storeData.name + "-" + data.storeData.address + "/Items/").on('value', function (snapshot) {
      if (snapshot.val() != null){
        let responselist = Object.keys(snapshot.val())
        setCart(Object.keys(snapshot.val()))
        setCartdata(snapshot.val())
        checkCart()
        //console.log(responselist)
      }else{
        setCart([])
      }
    });
  }

  const readFavItems = () => {
    firebase.database().ref("User Data/Customers/" + userid + "/Favorites/Items/").on('value', function (snapshot) {
      if (snapshot.val() != null){
        let responselist = Object.values(snapshot.val())
        var arr = []
        for(var i = 0; i < responselist.length; i++){
          if(data.storeData.name == responselist[i].storeName && data.storeData.address == responselist[i].storeAddress){
            arr.push(responselist[i].itemInfo.name)
          }
        }
        setFav(arr)
      }else{
        setFav([])
      }
    });
  }

  const checkCart = () => {
    firebase.database().ref("User Data/Customers/" + userid + "/cart/" + data.storeData.name + "-" + data.storeData.address + "/Items/").on('value', function (snapshot) {
      if (snapshot.val() != null){
        return
      }else{
        let userRef = firebase.database().ref("User Data/Customers/" + userid + "/cart/" + data.storeData.name + "-" + data.storeData.address);
        userRef.remove()
      }
    });
  }

  const getCatData = async (categories) => {
    var all_items = []
    for(var i=0; i < categories.length; i++){
      var catValue = categories[i].replace(" & ", " and ")
      var url = "https://us-central1-hobbloo-4e226.cloudfunctions.net/categoryRender?name=" + data.storeData.name + "&address=" + data.storeData.address + "&category=" + catValue
      let response = await fetch(
        url, {
          headers: {}
        }
      );
      let json = await response.json();
      var json_merge = [].concat.apply([], Object.values(json))
      for(var j = 0; j < json_merge.length; j++){
        all_items.push(json_merge[j])
      }
    }
    setAllitems(all_items)
    
  }

  const _renderItem = ({item, index}) => {
    let {itemStyle, itemText, itemInvisible, btnStyle} = styles
    if (item.empty){
        return <View style={[itemStyle, itemInvisible]} />
    }
    return (
      <ItemCard
        item={item}
        navigation={navigation}
        cart={cart}
        fav={fav}
        cartdata={cartdata}
        data={data}
        sub={true}
        index={index}
      />
    )
  }

  const ListFooter = () => {
    //View to set in Footer
    return (
      <View style={{flex: 1, alignSelf: "center"}}>
        <ScrollView>
        <Text style={{fontSize: 15, fontWeight: "700", marginLeft: 20, marginTop: 20, color: APP_COLORS.back_text}}></Text>
        <FlatList
        data={allitems}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns}
        />
        </ScrollView>
      </View>
    );
  };

  const _Inventory = ({item, index}) => {
    return (
      <View style={{alignItems: "center", marginBottom: 10}}>
        <View style={styles.btn}>
          <TouchableOpacity onPress={() => navigation.navigate("StoreCategory",{data: data, category: item.name, accent: "#5936e3"})} style={{overflow: "hidden", borderRadius: 5}}>
          <ImageBackground resizeMode="cover" source={{uri: resizeImage(item.logoUrl)}} style={{height: screenHeight*0.13, width: screenWidth*0.9}} >
            <Text style={{fontSize: 17, color: "#fff", position: "absolute", bottom: 15, left: 15, fontWeight: "bold", fontFamily: "Avenir"}}>{item.name}</Text>
          </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>
    );
  }



  return (
    <View style={[styles.container, {backgroundColor: APP_COLORS.background_color}]}>
      
      {available.length > 0 ? (
      <ScrollView style={{height: screenHeight}}>
        <LinearGradient colors={[APP_COLORS.header,  APP_COLORS.header]} locations={[0.3, 1]} style={{width:screenWidth, height: screenHeight * 0.1, alignItems: "center", justifyContent: "center", flexDirection: "row", backgroundColor: "transparent"}}>
        <View style={{flexDirection: "row", backgroundColor: "transparent"}}>
          <TextInput style={styles.inputBox} placeholderTextColor='#A3A3A3' placeholder={"Search " + data.storeData.name + "..."} placeholderTextColor="#BDBDBD" />
          <View style={{backgroundColor: "transparent", width: screenWidth * 0.12, height: screenHeight * 0.05, position: "absolute", left: 0, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, alignItems: "center", justifyContent: "center", alignSelf: "center"}}>
            <Feather name="search" color="#A3A3A3" size={20} />
          </View>
        </View>
      </LinearGradient>
        <View style={{flexDirection: "row", alignItems: "center", width: screenWidth, alignSelf: "center", justifyContent: "space-between"}}>
          <Text style={{fontSize: 25, fontWeight: "bold", fontFamily: "Avenir", color: APP_COLORS.back_text, marginLeft: 10}}>Inventory</Text>
          {/* <TouchableOpacity><Text style={{fontSize: 15, fontFamily: "Avenir", color: APP_COLORS.back_text}}>See all items</Text></TouchableOpacity> */}
        </View>
        <View style={{alignItems: "center", justifyContent: "center"}}>
          <Carousel
            ref={ref}
            data={available}
            layout={'tinder'} 
            layoutCardOffset={`9`}
            firstItem={0}
            renderItem={_Inventory}
            removeClippedSubviews={false}
            sliderWidth={screenWidth}
            itemWidth={screenWidth}
            itemHeight={screenWidth * 0.9}
            enableSnap={true}
            loop={true}
            autoplay={true}
            enableMomentum={false}
            lockScrollWhileSnapping={true}
          />
        </View>

          <FlatList
            data={available}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            //ListFooterComponent={ListFooter}
            renderItem={({ item, index }) =>
            <View style={{minHeight: 50, width: screenWidth, justifyContent: "flex-end", paddingHorizontal: 0, marginTop: index == 0? 30:0, marginBottom: 50}}>
              <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <Text style={{fontSize: 17, fontWeight: "bold", marginLeft: 10, fontFamily: "Avenir", color: APP_COLORS.back_text}}>{item.name}</Text>
                <TouchableOpacity onPress={() => navigation.navigate("StoreCategory",{data: data, category: item.name, accent: "#5936e3"})} ><Text style={{fontSize: 15, marginRight: 20, fontWeight: "700", color: APP_COLORS.item_btn_text}}>See All</Text></TouchableOpacity>
              </View>
              <FlatList
                data={allitems.filter(x => x.info.category === item.name).slice(0,20)}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) =>
                <ItemCard
                  item={item}
                  navigation={navigation}
                  cart={cart}
                  fav={fav}
                  cartdata={cartdata}
                  data={data}
                  sub={false}
                  index={index}
                />
                }
              />
            </View>
                }
          />
      </ScrollView>):(
      <View style={{alignItems: "center", flex: 1, justifyContent: "center", backgroundColor: APP_COLORS.background_color}}>
        <FontAwesome name="shopping-basket" size={50} color="#A3A3A3" />
        <Text style={{color: "#A3A3A3", marginTop: 10, fontFamily: "Avenir"}}>{data.storeData.name} is {fetching}</Text>
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputBox: {
    width: screenWidth * 0.90,
    height: screenHeight * 0.05,
    backgroundColor: '#fff',
    borderRadius: 15,
    fontSize: 15,
    color: 'black',
    marginVertical: 10,
    paddingLeft: 45,
    borderWidth: 0,
    borderColor: "#A3A3A3",
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: 4,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 3,
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
