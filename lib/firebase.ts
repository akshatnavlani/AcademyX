// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSMCVdnMjuDmcXA5TZTkJgENT5yOhiE04",
  authDomain: "academyx-4d3bd.firebaseapp.com",
  projectId: "academyx-4d3bd",
  storageBucket: "academyx-4d3bd.firebasestorage.app",
  messagingSenderId: "602812781437",
  appId: "1:602812781437:web:c2e3022c6980dcf632f214",
  measurementId: "G-KJPQVL68WZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)