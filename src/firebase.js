// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsBzSIc5CGjTPDPx7tY6kljWiT3zh1lfI",
  authDomain: "chequeapp-2400e.firebaseapp.com",
  projectId: "chequeapp-2400e",
  storageBucket: "chequeapp-2400e.appspot.com",
  messagingSenderId: "164780501323",
  appId: "1:164780501323:web:9559f179d33e9d3ab9e0ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(); 
