import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


// FIREBASE CONFIGURATION

const firebaseConfig = {
  apiKey: "AIzaSyBQ4HJ0J6WB9HWLzDvVsMZ46YQvH3Iiqy0",
  authDomain: "rnb-bakeshop-inventory-system.firebaseapp.com",
  projectId: "rnb-bakeshop-inventory-system",
  storageBucket: "rnb-bakeshop-inventory-system.firebasestorage.app",
  messagingSenderId: "206716423570",
  appId: "1:206716423570:web:9cc4fa420cb88c5fb3c54b"
};


// INITIALIZE FIREBASE

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// GET HTML ELEMENTS

const loginPage = document.getElementById("loginPage");

const dashboardPage = document.getElementById("dashboardPage");

const loginForm = document.getElementById("loginForm");

const loginMessage = document.getElementById("loginMessage");

const logoutButton = document.getElementById("logoutButton");

const welcomeMessage = document.getElementById("welcomeMessage");


// LOGIN

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    loginMessage.textContent = "Logging in...";


    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        loginMessage.textContent = "";

    } catch (error) {

        console.error(error);

        loginMessage.textContent =
            "Invalid email or password.";

    }

});


// CHECK AUTHENTICATION

onAuthStateChanged(auth, function(user) {

    if (user) {

        // USER IS LOGGED IN

        loginPage.style.display = "none";

        dashboardPage.style.display = "block";

        welcomeMessage.textContent =
            "Welcome, " + user.email + "!";

    } else {

        // USER IS NOT LOGGED IN

        loginPage.style.display = "flex";

        dashboardPage.style.display = "none";

    }

});


// LOGOUT

logoutButton.addEventListener("click", async function() {

    try {

        await signOut(auth);

    } catch (error) {

        console.error(error);

    }

});
