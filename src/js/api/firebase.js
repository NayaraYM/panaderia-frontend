import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    addDoc, 
    doc, 
    updateDoc, 
    deleteDoc 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAHEJZutY3q2bpHs_8BHJAqAUsGq8lzg7g",
    authDomain: "panaderia-dulcehorno.firebaseapp.com",
    projectId: "panaderia-dulcehorno",
    storageBucket: "panaderia-dulcehorno.firebasestorage.app",
    messagingSenderId: "86224049939",
    appId: "1:86224049939:web:ce0e18015701946c92ace6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export { collection, getDocs, addDoc, doc, updateDoc, deleteDoc };