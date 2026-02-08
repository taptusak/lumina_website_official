import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBC7uiEbicGQ8zA_LH7dASy7WTvnMN4nu0",
  authDomain: "lumina-website-official.firebaseapp.com",
  projectId: "lumina-website-official",
  storageBucket: "lumina-website-official.firebasestorage.app",
  messagingSenderId: "1047310177233",
  appId: "1:1047310177233:web:d908c349a746d4bd0dc6f0",
  measurementId: "G-K3BM9GQR0L"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
