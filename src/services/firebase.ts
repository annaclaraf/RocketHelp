import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBH68oZH9SbugqfPQPbzP358bn_gXHRKos",
  authDomain: "rockethelp-c88ec.firebaseapp.com",
  projectId: "rockethelp-c88ec",
  storageBucket: "rockethelp-c88ec.appspot.com",
  messagingSenderId: "897780086572",
  appId: "1:897780086572:web:2b78bef4ecb9dfaa7f1e89"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

