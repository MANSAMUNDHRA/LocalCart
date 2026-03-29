import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBt4LVFK98zh7epNZJiOcjDae11piVGQzc",
    authDomain: "localcart-4f39f.firebaseapp.com",
    projectId: "localcart-4f39f",
    storageBucket: "localcart-4f39f.appspot.com", // Fixed from .firebasestorage.app
    messagingSenderId: "884159900744",
    appId: "1:884159900744:web:4619e5e6547a916724bc7d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth safely for React Native to avoid AsyncStorage crashes
let auth: ReturnType<typeof getAuth>;
try {
    // If AsyncStorage isn't installed, getAuth logs a huge warning or crashes.
    // We use initializeAuth to safely boot it in memory if persistence fails.
    auth = initializeAuth(app);
} catch (e) {
    auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
