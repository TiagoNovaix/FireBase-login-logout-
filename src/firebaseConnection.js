import {initializeApp} from 'firebase/app'
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyAbLSYDBL8_zwVvh-QF6q5v0i5WRiaVaFw",
    authDomain: "teste-1-97720.firebaseapp.com",
    projectId: "teste-1-97720",
    storageBucket: "teste-1-97720.appspot.com",
    messagingSenderId: "718366834126",
    appId: "1:718366834126:web:523eddd1ffc3261dbc7f9f",
    measurementId: "G-CS5KMHVHBN"
  };


  const firebaseApp = initializeApp(firebaseConfig)

  const db = getFirestore(firebaseApp)
  const auth = getAuth(firebaseApp)

  export {db, auth}