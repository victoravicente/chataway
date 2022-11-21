import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyB0jM7KzHomucjVUmnsJFKbmPq_96t-PoU",
    authDomain: "chataway-758b0.firebaseapp.com",
    projectId: "chataway-758b0",
    storageBucket: "chataway-758b0.appspot.com",
    messagingSenderId: "201352743674",
    appId: "1:201352743674:web:5c2572ae1ed824743a9743",
    measurementId: "G-YNCPXDGS2W"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const db = getFirestore();
export const auth = getAuth();