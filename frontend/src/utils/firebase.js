// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsKJN7XnVUoO4NipaI3gI4h_dQku8LiI8",
  authDomain: "pixihub-f7951.firebaseapp.com",
  projectId: "pixihub-f7951",
  storageBucket: "pixihub-f7951.appspot.com",
  messagingSenderId: "1070579961907",
  appId: "1:1070579961907:web:d009e15d37e94736d19346",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { app, storage };
