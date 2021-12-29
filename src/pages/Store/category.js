import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, FlatList, TouchableOpacity, ImageBackground, ScrollView, LogBox, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {Feather, Ionicons, FontAwesome} from "@expo/vector-icons"
import { Flow } from 'react-native-animated-spinkit'
import { resizeImage, numberFormat } from '../../Components/functions';
import firebase from "firebase"
import * as Haptics from 'expo-haptics';

const numColumns = 2
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function StoreCategory({route, navigation}) {

  const [categorydata, setCategorydata] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [cart, setCart] = useState([])
  const [cartdata, setCartdata] = useState([])
  const [select, setSelect] = useState(0)
  const [loading, setLoading] = useState(false)

  const {data, category, accent} = route.params;

  useEffect(() => {
    LogBox.ignoreAllLogs()
    navigation.setOptions({title: category})
    readCart()
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
        console.log(responselist)
      }else{
        setCart([])
      }
    });
  }

  const addToCart = (item, qty) => {
    try {
      firebase
          .database()
          .ref("User Data/Customers/" + userid + "/cart/" + data.storeData.name + "-" + data.storeData.address)
          .update({
          storeName: data.storeData.name,
          storeAddress: data.storeData.address,
          storeLogo: data.storeData.logoUrl,
          }).then(() => {
            try {
              firebase
                  .database()
                  .ref("User Data/Customers/" + userid + "/cart/" + data.storeData.name + "-" + data.storeData.address + "/Items/" + item.name)
                  .set({
                  name: item.name,
                  price: item.price,
                  quantity: qty,
                  logo: item.info.logoUrl
                  }).then(() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                  //alert(item.name + " added to cart!")
                  }).catch((error) => {
                  alert(error)
              });
            } catch (e){
                console.log(e);
            }
          }).catch((error) => {
      });
    } catch(e){
        console.log(e);
    }
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

  const updateQuantity = (item, qty, val) => {
    if(val == "plus"){
      var quant = qty + 1
    }
    else{
      var quant = qty - 1
    }

    if(qty == 1 & val == "trash-o"){
      let userRef = firebase.database().ref("User Data/Customers/" + userid + "/cart/" + data.storeData.name + "-" + data.storeData.address + "/Items/" + item.name);
      userRef.remove()
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      checkCart()
      return
    }

    try {
      firebase
          .database()
          .ref("User Data/Customers/" + userid + "/cart/" + data.storeData.name + "-" + data.storeData.address + "/Items/" + item.name)
          .update({
          quantity: quant,
          }).then(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
          }).catch((error) => {
          alert(error)
      });
    } catch (e) {
        console.log(e);
    }
  }

  let trimString = function (string, length) {
    return string.length > length ? 
           string.substring(0, length) + '...' :
           string;
    };


  const _renderItem = ({item, index}) => {
    let {itemStyle, itemText, itemInvisible, btnStyle} = styles
    if (item.empty){
        return <View style={[itemStyle, itemInvisible]} />
    }
    return (
      <View style={{marginHorizontal: 20, width: screenWidth*0.4, alignItems: "center", marginTop: index == 0? 40:0, justifyContent: "flex-end", marginBottom: 40}}>
          <TouchableOpacity onPress={() => navigation.navigate("StoreItem",{data: item, accent: accent, storeName: data.storeData.name, storeAddress: data.storeData.address, storeLogo: data.storeData.logoUrl})}>
            <Image resizeMode="contain" source={{uri: resizeImage(item.info.logoUrl)}} style={{height: screenHeight*0.15, width: screenWidth*0.3}} />
            
            <View style={{height: 50, width: screenWidth*0.38, justifyContent: "flex-start"}}>
                <Text style={{fontSize: 12, textAlign: "left", fontWeight: "600", marginBottom: 3}}>{numberFormat(item.price)} </Text>
                <Text style={{fontSize: 11, textAlign: "left"}}>{trimString(item.name, 50 )}</Text>
            </View>
          </TouchableOpacity>
          {/*<TouchableOpacity style={{top: 0, right: 0, position: "absolute"}}><Ionicons name="ios-heart-outline" color={accent} size={30} /></TouchableOpacity>*/}
          {cart.includes(item.name) ? (
          <View style={{width: screenWidth*0.4, backgroundColor: "#f0f0f0", height: screenHeight*0.05, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 5}}>
              {cartdata[item.name] ? (
                <TouchableOpacity onPress={() => updateQuantity(item, cartdata[item.name].quantity, cartdata[item.name].quantity == 1 ? "trash-o" : "minus")}>
                    <FontAwesome size={20} name={cartdata[item.name].quantity == 1 ? "trash-o" : "minus"} color={accent} />
                </TouchableOpacity>):(
                <TouchableOpacity onPress={() => updateQuantity(item, cartdata[item.name].quantity, "minus")}>
                  <FontAwesome size={20} name="minus" color={accent} />
                </TouchableOpacity>
              )}
              <Text style={{fontSize: 20}}>{ cartdata[item.name] ? (cartdata[item.name].quantity):("")}</Text>
              <TouchableOpacity onPress={() => updateQuantity(item, cartdata[item.name].quantity, "plus")}>
                  <FontAwesome size={20} name="plus" color={accent} />
              </TouchableOpacity>
          </View>
          ):(
          <TouchableOpacity onPress={() => addToCart(item, 1)} style={{width: screenWidth*0.4, height: screenHeight*0.05, backgroundColor: accent, alignItems: "center", borderRadius: 10, justifyContent: "center", marginTop: 5, flexDirection: "row"}}>
              <Text style={{color: "#fff", fontWeight: "bold"}}>Add to basket </Text>
              {/*<FontAwesome size={15} name="shopping-basket" color="#fff" />*/}
          </TouchableOpacity>)}
      </View>
    )
  }

  return (
    <View show style={styles.container}>
        <View style={{flexDirection: "row", backgroundColor: accent, alignItems: "center", height: 50}}>
            <FlatList
                data={subcategories}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) =>
                <View style={{height: 50, justifyContent: "flex-end"}}>
                    <TouchableOpacity onPress={() => {getCategoryData(), setSelect(index)}} style={{alignItems: "center", marginBottom: 0, height: 40, backgroundColor: "transparent", marginHorizontal: 10, justifyContent: "center", paddingHorizontal: 5, borderBottomWidth: select == index? 3:0}}>
                        <Text style={{color: select == index? "#000":"#fff", fontWeight: select == index? "bold":"400"}}>{item}</Text>
                    </TouchableOpacity>
                </View>
                }
            />
        </View>
        {!loading? (<View style={{flex: 1, marginTop: 0}}>
            {select == 0 ? (<FlatList
                data={Object.keys(categorydata)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
                <View style={{minHeight: 50, width: screenWidth, justifyContent: "flex-end", paddingHorizontal: 0, marginTop: index == 0? 30:0, marginBottom: 50}}>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                      <Text style={{fontSize: 17, fontWeight: "bold", marginLeft: 10}}>{item}</Text>
                      <TouchableOpacity onPress={() => {getCategoryData(), setSelect(index + 1)}}><Text style={{fontSize: 15, marginRight: 20, fontWeight: "700", color: accent}}>See All</Text></TouchableOpacity>
                    </View>
                    <FlatList
                        data={Object.values(categorydata)[index].slice(0,20)}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) =>
                        <View style={{marginHorizontal: 10, width: screenWidth*0.4, alignItems: "center", marginTop: 10, justifyContent: "flex-end"}}>
                            <TouchableOpacity onPress={() => navigation.navigate("StoreItem",{data: item, accent: accent, storeName: data.storeData.name, storeAddress: data.storeData.address, storeLogo: data.storeData.logoUrl})}>
                              <Image resizeMode="contain" source={{uri: resizeImage(item.info.logoUrl)}} style={{height: screenHeight*0.15, width: screenWidth*0.3}} />
                              
                              <View style={{height: 50, width: screenWidth*0.38, justifyContent: "flex-start"}}>
                                  <Text style={{fontSize: 12, textAlign: "left", fontWeight: "600", marginBottom: 3}}>{numberFormat(item.price)} </Text>
                                  <Text style={{fontSize: 11, textAlign: "left"}}>{trimString(item.name, 50 )}</Text>
                              </View>
                            </TouchableOpacity>
                            {/*<TouchableOpacity style={{top: 0, right: 0, position: "absolute"}}><Ionicons name="ios-heart-outline" color={accent} size={30} /></TouchableOpacity>*/}
                            {cart.includes(item.name) ? (
                            <View style={{width: screenWidth*0.4, backgroundColor: "#f0f0f0", height: screenHeight*0.05, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 5}}>
                                {cartdata[item.name] ? (
                                <TouchableOpacity onPress={() => updateQuantity(item, cartdata[item.name].quantity, cartdata[item.name].quantity == 1 ? "trash-o" : "minus")}>
                                    <FontAwesome size={20} name={cartdata[item.name].quantity == 1 ? "trash-o" : "minus"} color={accent} />
                                </TouchableOpacity>):(
                                <TouchableOpacity onPress={() => updateQuantity(item, cartdata[item.name].quantity, "minus")}>
                                  <FontAwesome size={20} name="minus" color={accent} />
                                </TouchableOpacity>
                                )}
                                <Text style={{fontSize: 20}}>{ cartdata[item.name] ? (cartdata[item.name].quantity):("")}</Text>
                                <TouchableOpacity onPress={() => updateQuantity(item, cartdata[item.name].quantity, "plus")}>
                                    <FontAwesome size={20} name="plus" color={accent} />
                                </TouchableOpacity>
                            </View>
                            ):(
                            <TouchableOpacity onPress={() => addToCart(item, 1)} style={{width: screenWidth*0.4, height: screenHeight*0.05, backgroundColor: accent, alignItems: "center", borderRadius: 10, justifyContent: "center", marginTop: 5, flexDirection: "row"}}>
                                <Text style={{color: "#fff", fontWeight: "bold"}}>Add to basket </Text>
                                {/*<FontAwesome size={15} name="shopping-basket" color="#fff" />*/}
                            </TouchableOpacity>)}
                        </View>
                        }
                    />
                </View>
                }
            />):(
              <View style={{flex: 1, alignSelf: "center"}}>
                <ScrollView>
                  <Text style={{fontSize: 15, fontWeight: "700", marginLeft: 20, marginTop: 20}}>{Object.values(categorydata)[select - 1].length} {Object.keys(categorydata)[select - 1]}</Text>
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
            <Flow size={48} color={accent} />
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
});
