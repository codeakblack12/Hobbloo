
const readStoreData = (lat, long) => {
    firebase.database().ref('Hobbloo Data/Stores').on('value', function (snapshot) {
      if (snapshot.val() != null)
        {let responselist = Object.values(snapshot.val())
        generateLink(lat, long, responselist)
      }else{
        return []
      }
    });
}

const generateLink = (lat, long, stores) => {
  
  var origin_ = lat + "%2C" + long
  var destination_ = ""
  for(i=0;i<stores.length;i++){
    x = stores[i].geolocation
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
  var url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+ origin_ + "&destinations=" + destination_ + "&key=AIzaSyBgcbT0-pSIYVGoJHAUeQZIAwqH7mdWp88"

  ShopDistance(url, stores)

}

const ShopDistance = async (url, stores) => {

    var url = url
    let response = await fetch(
    url, {
        headers: {},
    }
    );
    let json = await response.json();
    var data = json.rows
    var shopData = []
    for(i=0;i<stores.length;i++){
    shopData.push({"name": stores[i].name, "logo": stores[i].logoUrl, "durationText": data[0].elements[i].duration.text, "durationValue": data[0].elements[i].duration.value})
    }
    shopData.sort((a,b) => a.durationValue - b.durationValue)
    return shopData
}

const faker = require('faker');

// Initialize products array
const products = [];

// Max number of products
const LIMIT = 100;

// Push a new product to the array
for (let i = 0; i < LIMIT; i++) {
  products.push({
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
  });
}

exports.sortedStores = functions.https.onCall((data, context) => {
    //const { latitude = 6.4275044, longitude = 3.4535936 } = data;
    //var SortesStores = readStoreData(latitude, longitude)
    return products
});