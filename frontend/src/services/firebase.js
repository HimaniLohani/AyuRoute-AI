import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-Yy6ygIUulIVFfpcMML6AfGSaYzFyA-E",
  authDomain: "ayuroute-ai.firebaseapp.com",
  projectId: "ayuroute-ai",
  storageBucket: "ayuroute-ai.firebasestorage.app",
  messagingSenderId: "823679096555",
  appId: "1:823679096555:web:7ea4c442edfd46a73d90ae",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const logoutWithGoogle = () => signOut(auth);