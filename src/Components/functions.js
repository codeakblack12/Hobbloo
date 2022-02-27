import firebase from "firebase"
import * as Haptics from 'expo-haptics';

export const resizeImage = (url) => {
    var new_url = url.replace("https://firebasestorage.googleapis.com/v0/b/hobbloo-4e226.appspot.com/", "https://ik.imagekit.io/13avkwpfpv6/")
    return new_url
}

export const numberFormat = (value) =>{
    return new Intl.NumberFormat('en-NG', {style: 'currency',currency: 'NGN'}).format(value);
}

export const Initials = (name) => {
  var names = name.split(" ");
  return names[0][0].toUpperCase() + names[1][0].toUpperCase()
}

export const getUserdata = () => {

    firebase.auth().onAuthStateChanged(function(user)
          {
              if(user)
              {
                setUserid(user.uid)
                firebase.database().ref('User Data/Customers/' + user.uid).once('value', function (snapshot) {
                  if (snapshot.val() != null)
                  {
                  let responselist = snapshot.val()
                  setUserdata(responselist)
                  }
                });
                // firebase.database().ref("User Data/Customers/" + user.uid + "/cart/").once('value', function (snapshot) {
                //   if (snapshot.val() != null){
                //     let responselist = Object.values(snapshot.val())
                //     var j = 0
                //     for(var i = 0; i < responselist.length; i++){
                //       //console.log(responselist[i].items)
                //       j = j + Object.values(responselist[i].Items).length
                //     }
                //     setCartAmt(j)
                //   }else{
                //     console.log("nothing in cart")
                //   }
                // });
              }
               else {
                setUserdata([])
              }
    })
  }
  
export const firstUppercase = (str) => {
    const str2 = str.charAt(0).toUpperCase() + str.slice(1);
    return str2
  }
  
export const getGreeting = () => {
    var hr = new Date().getHours();
    if (hr < 12) {
      return 'Good morning'
    } else if (hr < 16) {
      return 'Good afternoon'
    } else {
      return 'Good evening'
    }
  }

export const getComment = () => {
    var hr = new Date().getHours();
    if (hr < 12) {
      var comment = [
        "Start the day with a fart just like any other day!",
        "The morning sun is calling you.",
        "Have a cup of coffee and start your engines ",
        "Life is full of stress and troubles. If you want to have a good day, don’t get off your bed. Shop with Hobbloo",
        "You have a message: wake up you lazy 😴",
        "Please wake up and be thankful for an assistant like me! 😏",
        "I heard you’re having a tough time with your alarm clock.",
        "Keep the dream alive: Hit the snooze button.",
        "When reality and your dreams collide, typically it’s just your alarm clock going off.",
      ]
      var random = Math.floor(Math.random() * comment.length);
      return comment[random]
    } else if (hr < 16) {
      var comment = [
        "I want to use this afternoon to say I appreciate your effort in supporting me to grow.",
        "The afternoon is not only the middle of the day it is the time to complete our essential task and go ahead in life.",
        "Be bright like the afternoon sun and let everyone who sees you feel inspired by all the great things you do.",
        "Are you stuck again on an afternoon with nothing to do? Order from Hobbloo.",
        "If you can spend a perfectly useless afternoon in a perfectly useless manner, you have learned how to live."

      ]
      var random = Math.floor(Math.random() * comment.length);
      return comment[random]
    } else {
      var comment = [
        "Evening is the time for peace where there is no tension to cease.",
        "Have a relaxing Evening.",
        "May this evening be your dream evening.",
        "I hope you had a good and productive day.",
        "Thank you for making my evenings so beautiful and full of love.",
        "No matter how bad your day has been, the beauty of the setting sun will make everything serene.",
        "Your heartbeat sounds like music to my ears."
      ]
      var random = Math.floor(Math.random() * comment.length);
      return comment[random]
    }
}

//Server Functions

export const saveBasket = (name, cart, storeName, storeAddress, storeLogo) => {
  const storeInfo = {
    storeName: storeName,
    storeAddress: storeAddress,
    storeLogo: storeLogo
  }
  try {
    firebase
        .database()
        .ref("User Data/Customers/" + userid + "/Favorites/Baskets/" + name )
        .set({
        storeInfo: storeInfo,
        items: cart,
        name: name
        }).then(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          }).catch((error) => {
          alert(error)
        });
  } catch(e){
      console.log(e);
  }
}

export const addToCart = (name, price, qty, logo, storeName, storeAddress, storeLogo) => {
  try {
    firebase
        .database()
        .ref("User Data/Customers/" + userid + "/cart/" + storeName + "-" + storeAddress)
        .update({
        storeName: storeName,
        storeAddress: storeAddress,
        storeLogo: storeLogo,
        }).then(() => {
          try {
            firebase
                .database()
                .ref("User Data/Customers/" + userid + "/cart/" + storeName + "-" + storeAddress + "/Items/" + name)
                .set({
                name: name,
                price: price,
                quantity: qty,
                logo: logo
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

export const updateQuantity = (name, qty, val, storeName, storeAddress) => {

  if(val == "plus"){
    var quant = qty + 1
  }
  else{
    var quant = qty - 1
  }

  if(qty == 1 & val == "trash-o"){
    let userRef = firebase.database().ref("User Data/Customers/" + userid + "/cart/" + storeName + "-" + storeAddress + "/Items/" + name);
    userRef.remove()
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    //checkCart()
    return
  }

  try {
    firebase
        .database()
        .ref("User Data/Customers/" + userid + "/cart/" + storeName + "-" + storeAddress + "/Items/" + name)
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

export const saveItem = ( item, storeName, storeAddress, storeLogo ) => {
  try {
    firebase
        .database()
        .ref("User Data/Customers/" + userid + "/Favorites/Items/" + item.name + "-" + storeName + "-" + storeAddress )
        .set({
        storeName: storeName,
        storeAddress: storeAddress,
        storeLogo: storeLogo,
        itemInfo: item,
        }).then(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        }).catch((error) => {
          alert(error)
        });
  } catch(e){
      console.log(e);
  }
}

export const unsaveItem = (name, storeName, storeAddress) => {
  try {
    let userRef = firebase.database().ref("User Data/Customers/" + userid + "/Favorites/Items/" + name + "-" + storeName + "-" + storeAddress );
    userRef.remove()
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    return

  } catch(e){
      console.log(e);
  }
}