const functions = require("firebase-functions");
const admin = require('firebase-admin');
const rp = require('request-promise');

admin.initializeApp();

exports.sortedStores = functions.https.onRequest((request, response) => {
  const lat = request.query.lat;
  const long = request.query.long;
  
  admin.database().ref('Hobbloo Data/Stores').once('value', async function (snapshot) {
    if (snapshot.val() != null)
      {let responselist = Object.values(snapshot.val())
      var origin_ = lat + "%2C" + long
      var destination_ = ""
      for(i=0;i<responselist.length;i++){
        x = responselist[i].geolocation
        x = x.replace("(","")
        x = x.replace(")","")
        y = x.split(", ")
        link = y[0] + "%2C" + y[1]
        if(i == 0){
          destination_ = destination_ + link
        }else{
          destination_ = destination_ + "%7C" + link
        }
      }
      var url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+ origin_ + "&destinations=" + destination_ + "&traffic_model=pessimistic&departure_time=now&key=AIzaSyBgcbT0-pSIYVGoJHAUeQZIAwqH7mdWp88"
      var options = {
        uri: url, // Automatically parses the JSON string in the response
      };
      return rp(options)
      .then(result => {
        var data = JSON.parse(result).rows
        var shopData = []
        var stores = responselist

        
        var users_address = JSON.parse(result).origin_addresses[0].split(", ")
        var users_country = users_address[users_address.length - 1]
        var users_state = users_address[users_address.length - 2]
        
        for(i=0;i<responselist.length;i++){
          store_address = JSON.parse(result).destination_addresses[i]
          x = store_address.split(", ")
          store_country = x[x.length - 1]
          store_state = x[x.length - 2]

          if (users_country == store_country & users_state == store_state){
            shopData.push({"users_address":  JSON.parse(result).origin_addresses[0], "users_state": users_state, "storeData": stores[i], "durationText": data[0].elements[i].duration_in_traffic.text, "durationValue": data[0].elements[i].duration_in_traffic.value})
          }
          
        }
        shopData.sort((a,b) => a.durationValue - b.durationValue)
        response.json(shopData);

      }).catch(err => {
          // API call failed...
          response.send(err);
      });
    }else{
      response.send([])
    }
  });


});


exports.availableCategories = functions.https.onRequest((request, response) => {
  const name = request.query.name;
  const address = request.query.address;
  
  admin.database().ref('Hobbloo Data/Stores/' + name + "-" + address + "/Inventory").once('value', async function (snapshot) {
    if(snapshot.val() != null){
      let availablelist = Object.keys(snapshot.val())
    admin.database().ref('Hobbloo Data/Categories').once('value', async function (snapshot) {
      if(snapshot.val() != null){
        let categorylist = Object.values(snapshot.val())
        var availableCategories = []
        for(i=0; i<categorylist.length; i++){
          if(availablelist.includes(categorylist[i].name)){
            availableCategories.push(categorylist[i])
          }
        }
        response.json(availableCategories)
      }else {
        response.json([])
      }
      
    })
  }else{
    response.json([])
  }
  });
  
});

exports.categoryRender = functions.https.onRequest((request, response) => {
  const name = request.query.name;
  const address = request.query.address;
  const category = request.query.category.replace(" and ", " & ")
  total_data = []
  catData = []
  admin.database().ref('Hobbloo Data/Stores/' + name + "-" + address + "/Inventory/" + category).once("value", async function (snapshot){
    if(snapshot.val() != null){
      let availableItems = Object.keys(snapshot.val())
      let availableItemsPrice = Object.values(snapshot.val())
      admin.database().ref('Hobbloo Data/Items').on("value", async function (snapshot){
        if(snapshot.val() != null){
          let itemList = Object.values(snapshot.val())
          for(i=0; i<availableItems.length;i++){
            for(var j=0; j<itemList.length; j++){
              if(availableItems[i] == itemList[j].name){
                let obj = {name: availableItems[i], price: Number(availableItemsPrice[i].price), info: itemList[j]}
                total_data.push(obj)
              }
            }
          }
        }
      })
      admin.database().ref('Hobbloo Data/Categories/' + category + '/Subcategories').once("value", async function (snapshot){
        if (snapshot.val() != null){
          let values = [];
          snapshot.forEach((child) => {
              values.push(child.val());
          });
          for(i=0;i<values.length;i++){
            catData.push(values[i].name)
          }
          let obj = catData.reduce((ac,a) => ({...ac, [a]: []}),{})
          for(var i=0; i<total_data.length; i++){
            for(var j=0; j < Object.keys(obj).length; j++){
              if(total_data[i].info.subcategory == Object.keys(obj)[j]){
                Object.values(obj)[j].push(total_data[i])
              }
            }
          }
          for(var prop in obj){
            if(obj[prop].length < 1){
              console.log("yes")
              delete obj[prop]
            }
          }
          response.json(obj)
        }else{
          response.json([])
        }
      })
    }
    else{
      response.json([])
    }
  })
  
});
