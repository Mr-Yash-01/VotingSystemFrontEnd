// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtBaWCtGSrpj8xHBJIgkHH_KzcKhewA90",
  authDomain: "votingsystem-d1679.firebaseapp.com",
  projectId: "votingsystem-d1679",
  storageBucket: "votingsystem-d1679.appspot.com",
  messagingSenderId: "477844331627",
  appId: "1:477844331627:web:ac3ead0883549f9167652e",
  databaseURL:"https://votingsystem-d1679-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);