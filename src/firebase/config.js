import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- IMPORTANT ---
// This configuration is a placeholder. In a real environment, these values would be provided.
// For this example, we'll use placeholder values.
const firebaseConfigString = typeof __firebase_config !== 'undefined' 
    ? __firebase_config 
    : JSON.stringify({
        apiKey: "AIzaSyBqM_X62hTog1kLiTLotLF7lBsT1AjMoCs",
        authDomain: "chat-app-89534.firebaseapp.com",
        projectId: "chat-app-89534",
        storageBucket: "chat-app-89534.firebasestorage.app",
        messagingSenderId: "568672121180",
        appId: "1:568672121180:web:4712642b9dcbe167a4d199",
        measurementId: "G-WM3BPBYHPE"
    });
    
const firebaseConfig = JSON.parse(firebaseConfigString);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
