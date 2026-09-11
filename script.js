import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


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

const db = getFirestore(app);


// GET HTML ELEMENTS

const loginPage = document.getElementById("loginPage");
const dashboardPage = document.getElementById("dashboardPage");

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

const logoutButton = document.getElementById("logoutButton");
const welcomeMessage = document.getElementById("welcomeMessage");

const productsButton = document.getElementById("productsButton");
const productsSection = document.getElementById("productsSection");
const productsList = document.getElementById("productsList");

const backToDashboardButton =
    document.getElementById("backToDashboardButton");

const addProductButton =
    document.getElementById("addProductButton");

const addProductForm =
    document.getElementById("addProductForm");

const saveProductButton =
    document.getElementById("saveProductButton");

const cancelProductButton =
    document.getElementById("cancelProductButton");

const productMessage =
    document.getElementById("productMessage");


// LOGIN

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    loginMessage.textContent = "Logging in...";

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        loginMessage.textContent = "";

    } catch (error) {

        console.error("Login error:", error);

        loginMessage.textContent =
            "Invalid email or password.";

    }

});


// AUTHENTICATION STATE

onAuthStateChanged(auth, function(user) {

    if (user) {

        loginPage.style.display = "none";

        dashboardPage.style.display = "block";

        welcomeMessage.textContent =
            "Welcome, " + user.email + "!";

    } else {

        loginPage.style.display = "flex";

        dashboardPage.style.display = "none";

    }

});


// SHOW PRODUCTS

productsButton.addEventListener("click", async function() {

    productsSection.style.display = "block";

    productsList.textContent = "Loading products...";

    try {

        await loadProducts();

    } catch (error) {

        console.error("Error loading products:", error);

        productsList.textContent =
            "Unable to load products.";

    }

});


// LOAD PRODUCTS FROM FIRESTORE

async function loadProducts() {

    const productsSnapshot = await getDocs(
        collection(db, "products")
    );

    productsList.innerHTML = "";

    if (productsSnapshot.empty) {

        productsList.textContent =
            "No products found.";

        return;

    }

    productsSnapshot.forEach(function(documentSnapshot) {

        const product = documentSnapshot.data();

        const productCard =
            document.createElement("div");

        productCard.className =
            "product-card";

        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>Category: ${product.category}</p>
            <p>Price: ₱${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <p>Reorder Level: ${product.reorderLevel}</p>
        `;

        productsList.appendChild(productCard);

    });

}


// SHOW ADD PRODUCT FORM

addProductButton.addEventListener("click", function() {

    addProductForm.style.display = "block";

    productMessage.textContent = "";

});


// SAVE PRODUCT

saveProductButton.addEventListener("click", async function() {

    const name =
        document.getElementById("productName").value.trim();

    const category =
        document.getElementById("productCategory").value.trim();

    const price =
        Number(document.getElementById("productPrice").value);

    const stock =
        Number(document.getElementById("productStock").value);

    const reorderLevel =
        Number(document.getElementById("productReorderLevel").value);


    // VALIDATION

    if (
        name === "" ||
        category === "" ||
        isNaN(price) ||
        isNaN(stock) ||
        isNaN(reorderLevel)
    ) {

        productMessage.textContent =
            "Please complete all fields.";

        return;

    }


    productMessage.textContent =
        "Saving product...";


    try {

        await addDoc(
            collection(db, "products"),
            {
                name: name,
                category: category,
                price: price,
                stock: stock,
                reorderLevel: reorderLevel
            }
        );


        productMessage.textContent =
            "Product added successfully!";


        // CLEAR FORM

        document.getElementById("productName").value = "";

        document.getElementById("productCategory").value = "";

        document.getElementById("productPrice").value = "";

        document.getElementById("productStock").value = "";

        document.getElementById("productReorderLevel").value = "";


        // REFRESH PRODUCT LIST

        await loadProducts();


    } catch (error) {

        console.error("Error saving product:", error);

        productMessage.textContent =
            "Unable to save product.";

    }

});


// CANCEL ADD PRODUCT

cancelProductButton.addEventListener("click", function() {

    addProductForm.style.display = "none";

    productMessage.textContent = "";

});


// BACK TO DASHBOARD

backToDashboardButton.addEventListener("click", function() {

    productsSection.style.display = "none";

    addProductForm.style.display = "none";

});


// LOGOUT

logoutButton.addEventListener("click", async function() {

    try {

        await signOut(auth);

    } catch (error) {

        console.error("Logout error:", error);

    }

});
