// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDSG1-d4VFTjVgNz9TtYoQi-BCC7hEaKkM",
    authDomain: "tasksplitter-dbfe0.firebaseapp.com",
    projectId: "tasksplitter-dbfe0",
    storageBucket: "tasksplitter-dbfe0.appspot.com",
    messagingSenderId: "593640905153",
    appId: "1:593640905153:web:e0368b84e6d7d56b70b740",
    measurementId: "G-2WC1M0DL9B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);