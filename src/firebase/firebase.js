// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDx2LWwHyc6fz9n8GnK_xplDGIpKy5h7gc",
  authDomain: "bingo-2004b.firebaseapp.com",
  projectId: "bingo-2004b",
  storageBucket: "bingo-2004b.appspot.com",
  messagingSenderId: "176871753719",
  appId: "1:176871753719:web:7cbd6a1fe0a3e57a0e90f2",
  measurementId: "G-4LGPL5VNR6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const database = getDatabase(app);

export { app, db, database, analytics };
