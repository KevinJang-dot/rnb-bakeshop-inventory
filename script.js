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
    addDoc,
    updateDoc,
    deleteDoc,
    doc
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

const loginPage =
    document.getElementById("loginPage");

const dashboardPage =
    document.getElementById("dashboardPage");

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

const logoutButton =
    document.getElementById("logoutButton");

const welcomeMessage =
    document.getElementById("welcomeMessage");


// PRODUCTS ELEMENTS

const productsButton =
    document.getElementById("productsButton");

const productsSection =
    document.getElementById("productsSection");

const productsList =
    document.getElementById("productsList");

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


// INVENTORY ELEMENTS

const inventoryButton =
    document.getElementById("inventoryButton");

const inventorySection =
    document.getElementById("inventorySection");

const inventoryList =
    document.getElementById("inventoryList");

const backFromInventoryButton =
    document.getElementById("backFromInventoryButton");


// LOGIN

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    loginMessage.textContent =
        "Logging in...";

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        loginMessage.textContent = "";

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

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

    inventorySection.style.display = "none";

    productsList.textContent =
        "Loading products...";

    try {

        await loadProducts();

    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );

        productsList.textContent =
            "Unable to load products.";

    }

});


// LOAD PRODUCTS

async function loadProducts() {

    const productsSnapshot =
        await getDocs(
            collection(db, "products")
        );

    productsList.innerHTML = "";

    if (productsSnapshot.empty) {

        productsList.textContent =
            "No products found.";

        return;

    }

    productsSnapshot.forEach(
        function(documentSnapshot) {

            const product =
                documentSnapshot.data();

            const productId =
                documentSnapshot.id;

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

                <button class="edit-product-button">
                    Edit
                </button>

                <button class="delete-product-button">
                    Delete
                </button>
            `;


            // EDIT BUTTON

            const editButton =
                productCard.querySelector(
                    ".edit-product-button"
                );

            editButton.addEventListener(
                "click",
                function() {

                    editProduct(
                        productId,
                        product
                    );

                }
            );


            // DELETE BUTTON

            const deleteButton =
                productCard.querySelector(
                    ".delete-product-button"
                );

            deleteButton.addEventListener(
                "click",
                function() {

                    deleteProduct(
                        productId
                    );

                }
            );


            productsList.appendChild(
                productCard
            );

        }
    );

}


// SHOW ADD PRODUCT FORM

addProductButton.addEventListener(
    "click",
    function() {

        addProductForm.style.display =
            "block";

        productMessage.textContent = "";

    }
);


// SAVE PRODUCT

saveProductButton.addEventListener(
    "click",
    async function() {

        const name =
            document.getElementById(
                "productName"
            ).value.trim();

        const category =
            document.getElementById(
                "productCategory"
            ).value.trim();

        const price =
            Number(
                document.getElementById(
                    "productPrice"
                ).value
            );

        const stock =
            Number(
                document.getElementById(
                    "productStock"
                ).value
            );

        const reorderLevel =
            Number(
                document.getElementById(
                    "productReorderLevel"
                ).value
            );


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


        if (
            price < 0 ||
            stock < 0 ||
            reorderLevel < 0
        ) {

            productMessage.textContent =
                "Values cannot be negative.";

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


            document.getElementById(
                "productName"
            ).value = "";

            document.getElementById(
                "productCategory"
            ).value = "";

            document.getElementById(
                "productPrice"
            ).value = "";

            document.getElementById(
                "productStock"
            ).value = "";

            document.getElementById(
                "productReorderLevel"
            ).value = "";


            await loadProducts();

        } catch (error) {

            console.error(
                "Error saving product:",
                error
            );

            productMessage.textContent =
                "Unable to save product.";

        }

    }
);


// EDIT PRODUCT

async function editProduct(
    productId,
    product
) {

    const newName =
        prompt(
            "Product Name:",
            product.name
        );

    if (newName === null) {
        return;
    }


    const newCategory =
        prompt(
            "Category:",
            product.category
        );

    if (newCategory === null) {
        return;
    }


    const newPrice =
        prompt(
            "Price:",
            product.price
        );

    if (newPrice === null) {
        return;
    }


    const newStock =
        prompt(
            "Stock:",
            product.stock
        );

    if (newStock === null) {
        return;
    }


    const newReorderLevel =
        prompt(
            "Reorder Level:",
            product.reorderLevel
        );

    if (newReorderLevel === null) {
        return;
    }


    const price =
        Number(newPrice);

    const stock =
        Number(newStock);

    const reorderLevel =
        Number(newReorderLevel);


    if (
        newName.trim() === "" ||
        newCategory.trim() === "" ||
        isNaN(price) ||
        isNaN(stock) ||
        isNaN(reorderLevel) ||
        price < 0 ||
        stock < 0 ||
        reorderLevel < 0
    ) {

        alert(
            "Please enter valid values."
        );

        return;

    }


    try {

        await updateDoc(
            doc(
                db,
                "products",
                productId
            ),
            {
                name: newName.trim(),
                category: newCategory.trim(),
                price: price,
                stock: stock,
                reorderLevel: reorderLevel
            }
        );


        alert(
            "Product updated successfully!"
        );

        await loadProducts();

    } catch (error) {

        console.error(
            "Error updating product:",
            error
        );

        alert(
            "Unable to update product."
        );

    }

}


// DELETE PRODUCT

async function deleteProduct(
    productId
) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this product?"
        );

    if (!confirmDelete) {
        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "products",
                productId
            )
        );


        alert(
            "Product deleted successfully!"
        );

        await loadProducts();

    } catch (error) {

        console.error(
            "Error deleting product:",
            error
        );

        alert(
            "Unable to delete product."
        );

    }

}


// CANCEL ADD PRODUCT

cancelProductButton.addEventListener(
    "click",
    function() {

        addProductForm.style.display =
            "none";

        productMessage.textContent = "";

    }
);


// BACK TO DASHBOARD FROM PRODUCTS

backToDashboardButton.addEventListener(
    "click",
    function() {

        productsSection.style.display =
            "none";

        addProductForm.style.display =
            "none";

    }
);


// ==================================================
// INVENTORY
// ==================================================


// SHOW INVENTORY

inventoryButton.addEventListener(
    "click",
    async function() {

        productsSection.style.display =
            "none";

        addProductForm.style.display =
            "none";

        inventorySection.style.display =
            "block";

        inventoryList.textContent =
            "Loading inventory...";


        try {

            await loadInventory();

        } catch (error) {

            console.error(
                "Error loading inventory:",
                error
            );

            inventoryList.textContent =
                "Unable to load inventory.";

        }

    }
);


// LOAD INVENTORY

async function loadInventory() {

    const productsSnapshot =
        await getDocs(
            collection(db, "products")
        );

    inventoryList.innerHTML = "";


    if (productsSnapshot.empty) {

        inventoryList.textContent =
            "No inventory records found.";

        return;

    }


    productsSnapshot.forEach(
        function(documentSnapshot) {

            const product =
                documentSnapshot.data();

            const productId =
                documentSnapshot.id;

            const stock =
                Number(product.stock);

            const reorderLevel =
                Number(product.reorderLevel);


            const inventoryCard =
                document.createElement("div");

            inventoryCard.className =
                "product-card";


            let stockStatus = "Stock Available";


            if (stock <= reorderLevel) {

                stockStatus =
                    "LOW STOCK";

            }


            inventoryCard.innerHTML = `
                <h3>${product.name}</h3>

                <p>
                    Category: ${product.category}
                </p>

                <p>
                    Current Stock: ${stock}
                </p>

                <p>
                    Reorder Level: ${reorderLevel}
                </p>

                <p>
                    Status: ${stockStatus}
                </p>

                <button class="stock-in-button">
                    Stock In
                </button>

                <button class="stock-out-button">
                    Stock Out
                </button>
            `;


            // STOCK IN

            const stockInButton =
                inventoryCard.querySelector(
                    ".stock-in-button"
                );

            stockInButton.addEventListener(
                "click",
                function() {

                    stockIn(
                        productId,
                        product
                    );

                }
            );


            // STOCK OUT

            const stockOutButton =
                inventoryCard.querySelector(
                    ".stock-out-button"
                );

            stockOutButton.addEventListener(
                "click",
                function() {

                    stockOut(
                        productId,
                        product
                    );

                }
            );


            inventoryList.appendChild(
                inventoryCard
            );

        }
    );

}


// STOCK IN

async function stockIn(
    productId,
    product
) {

    const quantity =
        prompt(
            "Enter quantity to add:",
            "1"
        );


    if (quantity === null) {
        return;
    }


    const amount =
        Number(quantity);


    if (
        isNaN(amount) ||
        amount <= 0 ||
        !Number.isInteger(amount)
    ) {

        alert(
            "Please enter a valid whole number."
        );

        return;

    }


    const newStock =
        Number(product.stock) + amount;


    try {

        await updateDoc(
            doc(
                db,
                "products",
                productId
            ),
            {
                stock: newStock
            }
        );


        alert(
            "Stock added successfully!"
        );


        await loadInventory();

    } catch (error) {

        console.error(
            "Error adding stock:",
            error
        );

        alert(
            "Unable to update stock."
        );

    }

}


// STOCK OUT

async function stockOut(
    productId,
    product
) {

    const quantity =
        prompt(
            "Enter quantity to remove:",
            "1"
        );


    if (quantity === null) {
        return;
    }


    const amount =
        Number(quantity);


    if (
        isNaN(amount) ||
        amount <= 0 ||
        !Number.isInteger(amount)
    ) {

        alert(
            "Please enter a valid whole number."
        );

        return;

    }


    const currentStock =
        Number(product.stock);


    if (amount > currentStock) {

        alert(
            "Stock Out cannot be greater than current stock."
        );

        return;

    }


    const newStock =
        currentStock - amount;


    try {

        await updateDoc(
            doc(
                db,
                "products",
                productId
            ),
            {
                stock: newStock
            }
        );


        alert(
            "Stock removed successfully!"
        );


        await loadInventory();

    } catch (error) {

        console.error(
            "Error removing stock:",
            error
        );

        alert(
            "Unable to update stock."
        );

    }

}


// BACK TO DASHBOARD FROM INVENTORY

backFromInventoryButton.addEventListener(
    "click",
    function() {

        inventorySection.style.display =
            "none";

    }
);


// LOGOUT

logoutButton.addEventListener(
    "click",
    async function() {

        try {

            await signOut(auth);

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    }
);
