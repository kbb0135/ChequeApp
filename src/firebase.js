// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: "AIzaSyAtFE5-R73RlJI0FuLnAlo-ON9_7T5DSCQ",
  // authDomain: "chequeapp-ea7f5.firebaseapp.com",
  // projectId: "chequeapp-ea7f5",
  // storageBucket: "chequeapp-ea7f5.appspot.com",
  // messagingSenderId: "413782922435",
  // appId: "1:413782922435:web:438408a9edcf5d33617e76"
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,

};

// Initialize Firebase
console.log(firebaseConfig)
const app = initializeApp(firebaseConfig);
console.log(app)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(); 
