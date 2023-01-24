import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgKREbk2WREvjdBOx8QQKWWndNfaF_rjc",
  authDomain: "linkedin-clone-d72e7.firebaseapp.com",
  projectId: "linkedin-clone-d72e7",
  storageBucket: "linkedin-clone-d72e7.appspot.com",
  messagingSenderId: "84470021767",
  appId: "1:84470021767:web:061c9f52510873d2320222",
  measurementId: "G-J98L03NVJM"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db  = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };