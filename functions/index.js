const functions = require("firebase-functions");
const admin = require('firebase-admin');
const rp = require('request-promise');

admin.initializeApp();

exports.sortedStores = functions.https.onRequest((request, response) => {
  const lat = request.query.lat;
  const long = request.query.long;
  
  admin.database().ref('Hobbloo Data/Stores').on('value', async function (snapshot) {
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
