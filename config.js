import * as firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyA-UQGRZ0NabrizTDWWxv140TBOLwb-LhY",
    authDomain: "hobbloo-4e226.firebaseapp.com",
    projectId: "hobbloo-4e226",
    storageBucket: "hobbloo-4e226.appspot.com",
    messagingSenderId: "776904071122",
    appId: "1:776904071122:web:a89fd57c50be023bdb9a0b",
    measurementId: "G-VJYVB4NPL9"
};

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();