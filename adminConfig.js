import * as firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyAOPowa4toZr9AhE6uAGKccsJVEozpK640",
    authDomain: "hobblooadmin.firebaseapp.com",
    projectId: "hobblooadmin",
    storageBucket: "hobblooadmin.appspot.com",
    messagingSenderId: "749981396227",
    appId: "1:749981396227:web:3a6004e6634b8bac724d36",
    measurementId: "G-P8DCQBYGDG"
};

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

