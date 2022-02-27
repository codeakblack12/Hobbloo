import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Dimensions, Button, FlatList, Image, TouchableOpacity } from 'react-native';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import {FontAwesome} from "@expo/vector-icons"
import { resizeImage, numberFormat } from '../../Components/functions';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import firebase from "firebase"
import { SliderBox } from "react-native-image-slider-box";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const numColumns = 1
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function FavoriteBaskets() {

  const tabBarheight = useBottomTabBarHeight();

  const [fav, setFav] = useState([])

  const navigation = useNavigation();

  useEffect(() => {
    //navigation.setOptions({title: storeName + " Basket"})
    readFavBaskets()
  }, []);

  const readFavBaskets = () => {
    firebase.database().ref("User Data/Customers/" + userid + "/Favorites/Baskets/").on('value', function (snapshot) {
      if (snapshot.val() != null){
        let responselist = Object.values(snapshot.val())
        //console.log(responselist)
        setFav(Object.values(snapshot.val()))
      }else{
        setFav([])
      }
    });
  }

  const unsaveItem = (name) => {
    try {
      let userRef = firebase.database().ref("User Data/Customers/" + userid + "/Favorites/Baskets/" + name );
      userRef.remove()
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      return

    } catch(e){
        console.log(e);
    }
  }

  const getImageArray = (item) => {
    var arr = []
    for(var i = 0; i < item.length; i++){
      arr.push(resizeImage(item[i].logo))
    }
    return arr
  }

  const _renderItem = ({item, index}) => {
    let {itemStyle, itemText, itemInvisible, btnStyle} = styles
    if (item.empty){
        return <View style={[itemStyle, itemInvisible]} />
    }
    return (
      <View style={{backgroundColor: APP_COLORS.cart_card, width: screenWidth * 0.95, minHeight: 150, marginTop: 5, flexDirection: "row", alignItems: "center", paddingVertical: 10, marginBottom: index == fav.length - 1 ? tabBarheight : 0, borderBottomWidth: 1, borderColor: "rgba(60,19,97,0.2)"}}>
         <SliderBox 
          images={getImageArray(item.items)} 
          sliderBoxHeight={screenWidth * 0.22}
          parentWidth={screenWidth * 0.22}
          dotColor="transparent"
          autoplay
          circleLoop
          resizeMode={'contain'}
          ImageComponentStyle={{height: screenWidth * 0.22, width: screenWidth * 0.22, marginLeft: 10, marginTop: 10}}
          inactiveDotColor="transparent"
          imageLoadingColor="transparent" />

         {/* <Image resizeMode="contain" source={{uri: resizeImage(item.items[0].logo)}} style={{height: screenWidth * 0.22, width: screenWidth * 0.22, marginLeft: 10}} /> */}
         <TouchableWithoutFeedback onPress={() => navigation.navigate("BasketList", {data: item})} style={{marginLeft: 15, width: screenWidth * 0.5}}>
            <Text style={{fontSize: 14, fontWeight: "bold", marginTop: 3}}>{item.name}</Text>

            <Text style={{color: "#a0a0a0", marginTop: 3, fontSize: 11, fontFamily: "Avenir"}}>{item.storeInfo.storeName}</Text>
            <Text style={{color: "#a0a0a0", marginTop: 3, fontSize: 11, fontFamily: "Avenir"}}>{item.storeInfo.storeAddress}</Text>
            
         </TouchableWithoutFeedback>
         <View style={{ width: screenWidth*0.15, position: "absolute", right: 0, alignItems: "center", justifyContent: "center"}}>
              <TouchableOpacity onPress={() => unsaveItem(item.name)}>
                <FontAwesome size={20} name= "heart" color={APP_COLORS.item_btn_text} />
              </TouchableOpacity>
         </View>
      </View>
    )
}

  return (
    <View style={[styles.container, {backgroundColor: APP_COLORS.background_color}]}>
        {fav.length > 0 ?
        (<FlatList
        data={fav}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        />):(
            <View style={{alignItems: "center", flex: 1, justifyContent: "center", marginBottom: 50}}>
                <FontAwesome name="heart" size={50} color="#A3A3A3" />
                <Text style={{color: "#A3A3A3", marginTop: 10 }}>Your don't have any Basket saved.</Text>
            </View>
        )
        }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});