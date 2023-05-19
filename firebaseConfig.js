import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDFy7dDKrRM_Jie_uqpREVTezr45bqyBr8",
  authDomain: "inventory-management-63d0a.firebaseapp.com",
  projectId: "inventory-management-63d0a",
  storageBucket: "inventory-management-63d0a.appspot.com",
  messagingSenderId: "424015473097",
  appId: "1:424015473097:web:467daaae117b93e5816018",
  measurementId: "G-9S8TLMS6S6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, updateDoc, doc, serverTimestamp };
