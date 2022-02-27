import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, FlatList, TouchableOpacity, ImageBackground, ScrollView, LogBox, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {Feather, Ionicons, FontAwesome} from "@expo/vector-icons"
import { Flow } from 'react-native-animated-spinkit'
import { resizeImage, numberFormat, addToCart, updateQuantity, saveItem, unsaveItem } from '../../Components/functions';
import firebase from "firebase"
import * as Haptics from 'expo-haptics';
import ItemCard from '../../Components/ItemCard';

const numColumns = 2
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function StoreCategory({route, navigation}) {

  const [categorydata, setCategorydata] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [cart, setCart] = useState([])
  const [fav, setFav] = useState([])
  const [cartdata, setCartdata] = useState([])
  const [select, setSelect] = useState(0)
  const [loading, setLoading] = useState(false)

  const {data, category, accent} = route.params;

  useEffect(() => {
    LogBox.ignoreAllLogs()
    navigation.setOptions({title: category})
    readCart()
    readFavItems()
    getCategoryData()
  }, []);

  const getCategoryData = async () => {
    setLoading(true)
    var catValue = category.replace(" & ", " and ")
    var url = "https://us-central1-hobbloo-4e226.cloudfunctions.net/categoryRender?name=" + data.storeData.name + "&address=" + data.storeData.address + "&category=" + catValue
    let response = await fetch(
      url, {
        headers: {}
      }
    );
    let json = await response.json();
    var all = "All " + category
    var subVal = [all]
    console.log(json)
    setSubcategories(subVal.concat(Object.keys(json)))
    setCategorydata(json)
    setLoading(false)
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

  return (
    <View style={{backgroundColor: APP_COLORS.background_color, flex: 1}}>
        <View style={{flexDirection: "row", backgroundColor: APP_COLORS.header, alignItems: "center", height: 50}}>
            <FlatList
                data={subcategories}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) =>
                <View style={{height: 50, justifyContent: "flex-end"}}>
                    <TouchableOpacity onPress={() => {getCategoryData(), setSelect(index)}} style={{alignItems: "center", marginBottom: 0, height: 40, backgroundColor: "transparent", marginHorizontal: 10, justifyContent: "center", borderColor: APP_COLORS.item_btn_text, paddingHorizontal: 5, borderBottomWidth: select == index? 3:0}}>
                        <Text style={{color: select == index? APP_COLORS.item_btn_text : APP_COLORS.item_button, fontWeight: select == index? "bold":"400", fontFamily: "Avenir"}}>{item}</Text>
                    </TouchableOpacity>
                </View>
                }
            />
        </View>
        {!loading? (<View style={{flex: 1, marginTop: 0}}>
            {select == 0 ? (
            <FlatList
                data={Object.keys(categorydata)}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) =>
                <View style={{minHeight: 50, width: screenWidth, justifyContent: "flex-end", paddingHorizontal: 0, marginTop: index == 0? 30:0, marginBottom: 50}}>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                      <Text style={{fontSize: 17, fontWeight: "bold", marginLeft: 10, fontFamily: "Avenir", color: APP_COLORS.back_text}}>{item}</Text>
                      <TouchableOpacity onPress={() => {getCategoryData(), setSelect(index + 1)}}><Text style={{fontSize: 15, marginRight: 20, fontWeight: "700", color: APP_COLORS.item_btn_text}}>See All</Text></TouchableOpacity>
                    </View>
                    <FlatList
                        data={Object.values(categorydata)[index].slice(0,20)}
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
            ):(
              <View style={{flex: 1, alignSelf: "center"}}>
                <ScrollView>
                  <Text style={{fontSize: 15, fontWeight: "700", marginLeft: 20, marginTop: 20, color: APP_COLORS.back_text}}>{Object.values(categorydata)[select - 1].length} {Object.keys(categorydata)[select - 1]}</Text>
                  <FlatList
                  data={Object.values(categorydata)[select - 1]}
                  renderItem={_renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={numColumns}
                  />
                </ScrollView>
              </View>
            )}
        </View>):(
          <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <Flow size={48} color={APP_COLORS.item_btn_text} />
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeefff",
  },
});
