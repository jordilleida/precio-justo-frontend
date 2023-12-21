import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAbHIF0AD7cHdrEMHzCIIKD1ZEAwzxVJ40",
    authDomain: "jordi-4bbc6.firebaseapp.com",
    databaseURL: "https://jordi-4bbc6.firebaseio.com",
    projectId: "jordi-4bbc6",
    storageBucket: "jordi-4bbc6.appspot.com",
    messagingSenderId: "128667081220",
    appId: "1:128667081220:web:f4071a40a941b88a7ff351"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
