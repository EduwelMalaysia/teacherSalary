// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDQ5Zh_zCAU7eI9JdNhuk_6S2q_2hGhhY",
  authDomain: "teachersalary-2cdcf.firebaseapp.com",
  projectId: "teachersalary-2cdcf",
  storageBucket: "teachersalary-2cdcf.firebasestorage.app",
  messagingSenderId: "309798709589",
  appId: "1:309798709589:web:d61525c1e5bf28fe1527dc",
  measurementId: "G-2ZWY7L02J7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);