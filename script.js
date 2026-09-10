import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

// YOUR FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyBQ4HJ0J6WB9HWLzDvVsMZ46YQvH3Iiqy0",
  authDomain: "rnb-bakeshop-inventory-system.firebaseapp.com",
  projectId: "rnb-bakeshop-inventory-system",
  storageBucket: "rnb-bakeshop-inventory-system.firebasestorage.app",
  messagingSenderId: "206716423570",
  appId: "1:206716423570:web:9cc4fa420cb88c5fb3c54b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login
document.getElementById("loginForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("loginMessage");

    message.textContent = "Logging in...";

    try {

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        message.textContent = "Login successful!";

        console.log("Logged in user:", user.email);

    } catch (error) {

        console.error(error);

        message.textContent = "Invalid email or password.";

    }

});
