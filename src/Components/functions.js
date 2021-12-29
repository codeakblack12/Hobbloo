import firebase from "firebase"

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
                firebase.database().ref('User Data/Customers/' + user.uid).once('value', function (snapshot) {
                  if (snapshot.val() != null)
                  {
                  let responselist = snapshot.val()
                  setUserid(user.uid)
                  setUserdata(responselist)
                  }
                });
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
    hr = new Date().getHours();
    if (hr < 12) {
      return 'Good morning'
    } else if (hr < 18) {
      return 'Good afternoon'
    } else {
      return 'Good evening'
    }
  }