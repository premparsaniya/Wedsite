import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue, child, update, orderByKey } from "firebase/database";
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from "firebase/storage";

const { VITE_FIRE_API_KEY, VITE_FIRE_AUTH_DOM, VITE_FIRE_DB_URL, VITE_FIRE_PRJ_ID, VITE_FIRE_STG_BKT, VITE_FIRE_MSG_ID, VITE_FIRE_APP_ID, VITE_FIRE_MESG_ID } = import.meta.env;

const firebaseConfig = {
    apiKey: VITE_FIRE_API_KEY,
    authDomain: VITE_FIRE_AUTH_DOM,
    databaseURL: VITE_FIRE_DB_URL,
    projectId: VITE_FIRE_PRJ_ID,
    storageBucket: VITE_FIRE_STG_BKT,
    messagingSenderId: VITE_FIRE_MSG_ID,
    appId: VITE_FIRE_APP_ID,
    measurementId: VITE_FIRE_MESG_ID,
};

const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);

export { db, ref, set, onValue, push, child, storageRef, getStorage, uploadString, getDownloadURL, update, orderByKey };