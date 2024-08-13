// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJt5n-M25-rafU1liLOex7iF6ASRtfXIc",
  authDomain: "petadvisor-2f7f7.firebaseapp.com",
  projectId: "petadvisor-2f7f7",
  storageBucket: "petadvisor-2f7f7.appspot.com",
  messagingSenderId: "665888104307",
  appId: "1:665888104307:web:cf9a2d747238e34620af06",
  measurementId: "G-JG97VCBN70"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };