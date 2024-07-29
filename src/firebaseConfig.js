import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKr9FVz1vI1nysqniO-HVVtWScEe-MLUU",
  authDomain: "login-app-tasks.firebaseapp.com",
  projectId: "login-app-tasks",
  storageBucket: "login-app-tasks.appspot.com",
  messagingSenderId: "291432179714",
  appId: "1:291432179714:web:d25f8562db652c532adf1b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
