import React, {useEffect, useState, useLayoutEffect, useRef} from 'react';
import { StyleSheet, Text, View, LogBox, FlatList, Dimensions, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import firebase from "firebase"
import {Ionicons, FontAwesome} from "@expo/vector-icons"
import { resizeImage, numberFormat } from '../../Components/functions';
import * as Location from 'expo-location';
import { Flow } from 'react-native-animated-spinkit'
import Icon from 'react-native-vector-icons/FontAwesome';

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { Modalize } from 'react-native-modalize';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import RadioButtonRN from 'radio-buttons-react-native';


import { RectButton, Swipeable } from 'react-native-gesture-handler';

const numColumns = 1
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function Checkout({route, navigation}) {
  const {storeName, storeAddress, storeLogo} = route.params;
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState([])

  const [address, setAddress] = useState("")
  const [deliveryTime, setDeliveryTime] = useState(0)
  const [deliveryFee, setDeliveryFee] = useState(0)

  const [date, setDate ] = useState(new Date())
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(true);

  const [payment, setPayment] = useState(false);
  const [paymentM, setPaymentM] = useState("Pay on Delivery");
  

  //Date Picker Stuff

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    setDate(date)
    hideDatePicker();
  };

  //Modal Stuff

  const modalizeRef = useRef(null);

  const onOpen = (payment) => {
    setPayment(payment)
    setTimeout(()=>{modalizeRef.current?.open();}, 10);
    navigation.setOptions({
        headerStyle: {backgroundColor: "rgba(0, 0, 0, 0.25)"},
    })
    
  };
  const onClosed = () => {
    
    setTimeout(()=>{setPayment(false)}, 500); 
    navigation.setOptions({
        headerStyle: {backgroundColor: APP_COLORS.background_color},
    })
  };

  const data = [
    {
      label: 'Pay on Delivery'
     },
     {
      label: 'Wallet'
     },
     {
      label: 'Card Payment'
     },
     {
      label: 'Bank Transfer'
     }
    ];

  useLayoutEffect(() => {
    //readFavBaskets()
    readCart()
  }, []);

  useEffect(() => {
    LogBox.ignoreAllLogs()
    navigation.setOptions({
      title: "Checkout",
    })
  }, []);

  const GetCheckoutInfo = async (items) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        return;
    }
    var pinlocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced});
    var param = pinlocation.coords.latitude + "&long=" + pinlocation.coords.longitude + "&name=" + storeName + "&address=" + storeAddress + "&numItems=" + items.length

    var url = "https://us-central1-hobbloo-4e226.cloudfunctions.net/CheckoutInfo?lat=" + param 
    let response = await fetch(
    url, {
        headers: {},
    }
    );
    let resp = await response.json();
    setAddress(resp.name)
    setDeliveryFee(resp.DeliveryFee)
    setDeliveryTime(resp.DeliveryTime)
    setLoading(false)
  }

  const UpdateCheckoutInfo = async (lat, long) => {
    setLoading(true)
    var param = lat + "&long=" + long + "&name=" + storeName + "&address=" + storeAddress + "&numItems=" + cart.length

    var url = "https://us-central1-hobbloo-4e226.cloudfunctions.net/CheckoutInfo?lat=" + param 
    let response = await fetch(
    url, {
        headers: {},
    }
    );
    let resp = await response.json();
    setAddress(resp.name)
    setDeliveryFee(resp.DeliveryFee)
    setDeliveryTime(resp.DeliveryTime)
    setLoading(false)
  }

  let trimString = function (string, length) {
    return string.length > length ? 
           string.substring(0, length) + '...' :
           string;
  };

  const secondsToHms = (d) => {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay //+ sDisplay; 
  }

  const deleteSwipe = () => {
    return (
        <View style={{backgroundColor: "red", width: screenWidth * 0.95, minHeight: 150, marginTop: 5, flexDirection: "row", alignItems: "center", paddingVertical: 10, marginBottom: 0, borderBottomWidth: 1, borderColor: "rgba(60,19,97,0.2)"}}>
            <Text style={{color: "#fff", marginTop: 5, fontFamily: Platform.OS == "ios" ? APP_COLORS.IOS_Font : APP_COLORS.Android_Font}}>Delete</Text>
        </View>
    )
}

const renderLeftActions = () => {
    return (
    <View style={{flex: 1, backgroundColor: APP_COLORS.background_color, width: screenWidth * 0.95, minHeight: 150, marginTop: 5, justifyContent: "center", alignItems: "center", paddingVertical: 10, marginBottom: 0, borderBottomWidth: 1, borderColor: "rgba(60,19,97,0.2)"}}>
        <FontAwesome size={40} name= "sticky-note-o" color="gray" />
        <Text style={{color: "gray", marginTop: 5, fontFamily: "Avenir"}}>You have no remarks on this item!</Text>
    </View>
    );
};

const updateRef = ref => {
    _swipeableRow = ref;
  };


  const _renderItem = ({item, index}) => {
    let {itemStyle, itemText, itemInvisible, btnStyle} = styles
    if (item.empty){
        return <View style={[itemStyle, itemInvisible]} />
    }
    return (
    <Swipeable
    friction={2}
    leftThreshold={30}
    rightThreshold={40}
    renderRightActions={renderLeftActions}> 
      <View style={{flex: 1, backgroundColor: APP_COLORS.background_color, width: screenWidth * 0.95, minHeight: 150, marginTop: 5, flexDirection: "row", alignItems: "center", paddingVertical: 10, marginBottom: 0, borderBottomWidth: 1, borderColor: "rgba(60,19,97,0.2)"}}>
         <View>
          <Image resizeMode="contain" source={{uri: item.logo ? resizeImage(item.logo) : null}} style={{height: screenWidth * 0.22, width: screenWidth * 0.22, marginLeft: 10}} />
         </View>
         <View style={{marginLeft: 15, width: screenWidth * 0.5}}>
            
            <Text style={{fontSize: 14, fontWeight: "bold", fontFamily: "Avenir", marginTop: 3}}>{item.name}</Text>
            <Text style={{fontSize: 12, fontWeight: "600", fontFamily: "Avenir", marginTop: 3}}>{numberFormat(item.price)} x {item.quantity} = {numberFormat(item.quantity * item.price)}</Text>
            
         </View>
         <View style={{ width: screenWidth*0.15, position: "absolute", right: 0, alignItems: "center", justifyContent: "center"}}>
              <TouchableOpacity>
                <FontAwesome size={20} name= "sticky-note-o" color={APP_COLORS.item_btn_text} />
                <Text style={{fontSize: 10, fontWeight: "bold", fontFamily: "Avenir", position: "absolute", alignSelf: "center", top: 4, bottom: 4}}>{item.remarks.length > 0 ? item.remarks.length : ""}</Text>
              </TouchableOpacity>
         </View>
      </View>
    </Swipeable>
    )
}

  const readCart = async () => {
    setLoading(true)
    firebase.database().ref("User Data/Customers/" + userid + "/cart/" + storeName + "-" + storeAddress + "/Items/").on('value', function async (snapshot) {
      if (snapshot.val() != null){
        let responselist = Object.keys(snapshot.val())
        var processed_cart = []
        for(var i = 0; i < responselist.length; i++){
            var prev_item = Object.values(snapshot.val())[i]
            var new_item = {"name": prev_item.name,"price": prev_item.price,"logo": prev_item.logo, "quantity": prev_item.quantity,"remarks": []}
            processed_cart.push(new_item)
        }
        //setCart(Object.values(snapshot.val()))
        setCart(processed_cart)
        checkCart()
        GetCheckoutInfo(Object.keys(snapshot.val()))
    }else{
        setCart([])
        setLoading(false)
    }
    });
}

const checkCart = () => {
  firebase.database().ref("User Data/Customers/" + userid + "/cart/" + storeName + "-" + storeAddress + "/Items/").on('value', function (snapshot) {
    if (snapshot.val() != null){
      return
    }else{
      let userRef = firebase.database().ref("User Data/Customers/" + userid + "/cart/" + storeName + "-" + storeAddress);
      userRef.remove()
    }
  });
}

 const getCheckout = (item) => {
    var checkout = 0
    for(var i = 0; i < item.length; i++){
        var value = item[i].price * item[i].quantity
        checkout = checkout + value
    }
    return checkout
 }

 const ListHeader = () => {
    //View to set in Header
    return (
      <View style={styles.headerFooterStyle}>
        <View style={{width: "100%", alignSelf: "center", marginTop: 20}}>
            <Text style={{fontSize: 23, fontWeight: "bold", fontFamily: "Avenir", color: APP_COLORS.back_text}}>Confirm Order</Text>
        </View>
        <View style={{width: "100%", alignSelf: "center", marginTop: 20}}>
            <View style={{backgroundColor: APP_COLORS.checkout_details_back, width: "100%", paddingVertical: 10, marginBottom: 10, borderRadius: 5, flexDirection: "row", alignItems: "center"}}>
                <View style={{marginLeft: 5}}>
                    <Text style={{fontSize: 14, fontWeight: "bold", fontFamily: "Avenir", marginTop: 3}}>Delivery</Text>
                    <Text style={{fontSize: 14, fontWeight: "600", fontFamily: "Avenir", marginTop: 5}}>Estimated delivery in {secondsToHms(deliveryTime)}</Text>
                </View>
            </View>
            <View style={{backgroundColor: APP_COLORS.checkout_details_back, width: "100%", paddingVertical: 10, marginBottom: 10, borderRadius: 5, flexDirection: "row", alignItems: "center"}}>
                <View style={{marginLeft: 5, width: "80%"}}>
                    <Text style={{fontSize: 14, fontWeight: "bold", fontFamily: "Avenir", marginTop: 3}}>Delivery Location</Text>
                    <Text numberOfLines={2} style={{fontSize: 14, fontWeight: "600", fontFamily: "Avenir", marginTop: 5}}>{address}</Text>
                </View>
                <TouchableOpacity onPress={() => onOpen(false)} style={{position: "absolute", right: 20}}>
                    <Text style={{fontSize: 14, fontWeight: "600", fontFamily: "Avenir", marginTop: 5}}>Edit</Text>
                </TouchableOpacity>
            </View>
            <View style={{backgroundColor: APP_COLORS.checkout_details_back, width: "100%", paddingVertical: 10, marginBottom: 10, borderRadius: 5, flexDirection: "row", alignItems: "center"}}>
                <View style={{marginLeft: 5}}>
                    <Text style={{fontSize: 14, fontWeight: "bold", fontFamily: "Avenir", marginTop: 3}}>Payment Method</Text>
                    <Text style={{fontSize: 14, fontWeight: "600", fontFamily: "Avenir", marginTop: 5}}>{paymentM}</Text>
                </View>
                <TouchableOpacity onPress={() => onOpen(true)} style={{position: "absolute", right: 20}}>
                    <Text style={{fontSize: 14, fontWeight: "600", fontFamily: "Avenir", marginTop: 5}}>Edit</Text>
                </TouchableOpacity>
            </View>
            <View>
            <View style={{backgroundColor: APP_COLORS.checkout_details_back, width: "100%", paddingVertical: 10, marginBottom: 10, borderRadius: 5, flexDirection: "row", alignItems: "center"}}>
                <View style={{marginLeft: 5}}>
                    <Text style={{fontSize: 14, fontWeight: "bold", fontFamily: "Avenir", marginTop: 3}}>Scheduled Delivery</Text>
                    <Text style={{fontSize: 14, fontWeight: "600", fontFamily: "Avenir", marginTop: 3}}>{date.toDateString()}</Text>
                </View>
                <TouchableOpacity onPress={showDatePicker} style={{position: "absolute", right: 20}}>
                    <Text style={{fontSize: 14, fontWeight: "600", fontFamily: "Avenir", marginTop: 5}}>Edit</Text>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        date={date}
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        display="inline"
                        minimumDate={new Date()}
                        maximumDate={new Date().setDate(new Date().getDate() + 7)}
                    />
                </TouchableOpacity>
            </View>
            
            </View>
            {/* <View style={{backgroundColor: APP_COLORS.checkout_details_back, width: "100%", paddingVertical: 10, marginBottom: 10, borderRadius: 5, flexDirection: "row", alignItems: "center"}}>
                <View style={{marginLeft: 5}}>
                    <Text style={{fontSize: 14, fontWeight: "bold", fontFamily: "Avenir", marginTop: 3}}>Available Time</Text>
                    <Text style={{fontSize: 14, fontWeight: "600", fontFamily: "Avenir", marginTop: 5}}>12pm - 3pm</Text>
                </View>
                <TouchableOpacity style={{position: "absolute", right: 20}}>
                    <Text style={{fontSize: 14, fontWeight: "600", fontFamily: "Avenir", marginTop: 5}}>Edit</Text>
                </TouchableOpacity>
            </View> */}
            
        </View>
        <View style={{width: "100%", alignSelf: "center", marginVertical: 10}}>
            <Text style={{fontSize: 20, fontWeight: "bold", fontFamily: "Avenir", color: APP_COLORS.back_text}}>Items</Text>
        </View>
      </View>
    );
  };

const ListFooter = () => {
    //View to set in Footer
    return (
      <View style={[styles.headerFooterStyle, {marginBottom: 100, paddingVertical: 30, borderBottomWidth: 0}]}>
        <View style={{backgroundColor: "transparent", width: "100%", paddingVertical: 10, marginBottom: 10, borderRadius: 5, flexDirection: "row", alignItems: "center"}}>
            <View style={{position: "absolute", left: 10}}>
                <Text style={{fontSize: 17, fontWeight: "bold", fontFamily: "Avenir", marginTop: 3}}>Subtotal</Text>
            </View>
            <View style={{position: "absolute", right: 10}}>
                <Text style={{fontSize: 17, fontWeight: "600", fontFamily: "Avenir", marginTop: 3}}>{numberFormat(getCheckout(cart))}</Text>
            </View>
        </View>
        <View style={{backgroundColor: "transparent", width: "100%", paddingVertical: 10, marginBottom: 10, borderRadius: 5, flexDirection: "row", alignItems: "center"}}>
            <View style={{position: "absolute", left: 10}}>
                <Text style={{fontSize: 17, fontWeight: "bold", fontFamily: "Avenir", marginTop: 3}}>Delivery Fee</Text>
            </View>
            <View style={{position: "absolute", right: 10}}>
                <Text style={{fontSize: 17, fontWeight: "600", fontFamily: "Avenir", marginTop: 3}}>{numberFormat(deliveryFee)}</Text>
            </View>
        </View>
      </View>
    );
  };

const renderHeader = () => (
    <View style={styles.modal__header}>
      <Text style={styles.modal__headerText}>{payment ? "Payment Method" : "Delivery Location"}</Text>
    </View>
);


  return (
    <View style={[styles.container, {backgroundColor: APP_COLORS.background_color}]}>
        <Modalize onClose = {() => onClosed()} snapPoint={ payment? 400 : 350} modalHeight={payment ? 400 : 700} ref={modalizeRef} overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0.25)'}} HeaderComponent={renderHeader}>
        {!payment ? 
        (<GooglePlacesAutocomplete
            placeholder='Search'
            onPress={(data, details) => {
                // 'details' is provided when fetchDetails = true
                //setAddress(data.description);
                modalizeRef.current?.close();
                console.log(details.geometry)
                UpdateCheckoutInfo(details.geometry.location.lat, details.geometry.location.lng)
                //console.log(details.geometry)
            }}
            query={{
                key: 'AIzaSyBgcbT0-pSIYVGoJHAUeQZIAwqH7mdWp88',
                language: 'en',
            }}
            styles={{
                textInput: {
                    height: screenHeight * 0.05,
                    backgroundColor: '#fff',
                    borderRadius: 0,
                    fontSize: 15,
                    color: 'black',
                    marginHorizontal: 15,
                    paddingHorizontal: 0
                },
                predefinedPlacesDescription: {
                  color: '#blue',
                },
            }}
            enablePoweredByContainer={false}
            keepResultsAfterBlur={true}
            fetchDetails={true}
        />):
        (
            <RadioButtonRN
            data={data}
            selectedBtn={(e) => setPaymentM(e.label)}
            icon={
                <Icon
                name="check-circle"
                size={25}
                color={APP_COLORS.item_btn_text}
                />
            }
            boxStyle={{width: "95%", alignSelf: "center", borderWidth: 0}}
            boxActiveBgColor={APP_COLORS.item_button}
            />
        )
        }
        </Modalize>
        {
        !loading ?
        (<View style={[styles.container, {backgroundColor: APP_COLORS.background_color}]}>
        {cart.length > 0 ?
        (
        <FlatList
        data={cart}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        />
        
        ):(
            <View style={{alignItems: "center", flex: 1, justifyContent: "center"}}>
                <FontAwesome name="shopping-basket" size={50} color="#A3A3A3" />
                <Text style={{color: "#A3A3A3", marginTop: 10 }}>Your basket is empty.</Text>
            </View>
        )
        }
        <TouchableOpacity activeOpacity={0.7} style={{width: screenWidth*0.8, height: 70, backgroundColor: APP_COLORS.checkout_btn, position: "absolute", bottom: 20, borderRadius: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <View style={{marginLeft: 15}}>
                <Text style={{fontSize: 14, fontWeight: "500", color: "#fff"}}>Yes, looks good!</Text>
                <Text style={{fontSize: 22, fontWeight: "700", marginTop: 10, color: "#fff"}}>{numberFormat(getCheckout(cart) + deliveryFee)}</Text>
            </View>
            <View style={{position: "absolute", right: 5}}><Ionicons size={30} name="chevron-forward-sharp" color="#fff" /></View>
        </TouchableOpacity>
        </View>) : 
        (
            <View><Flow size={48} color={APP_COLORS.item_btn_text} style={{alignSelf: "center"}} /><Text style={{marginTop: 10, color: "#8A8A8A"}}>Preparing Order</Text></View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: "center"
    },
    headerFooterStyle: {
        width: '100%',
        borderBottomWidth: 1,
        backgroundColor: 'transparent',
        borderColor: "rgba(60,19,97,0.2)"
    },
    textStyle: {
        textAlign: 'center',
        color: '#000',
        fontSize: 18,
        padding: 7,
    },
    modal__header: {
        paddingVertical: 15,
        marginHorizontal: 15,
    
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
      },
    
    modal__headerText: {
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: "Avenir"
    },
    
});
  