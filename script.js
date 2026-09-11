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


// PRODUCTS

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


// INVENTORY

const inventoryButton =
    document.getElementById("inventoryButton");

const inventorySection =
    document.getElementById("inventorySection");

const inventoryList =
    document.getElementById("inventoryList");

const backFromInventoryButton =
    document.getElementById("backFromInventoryButton");


// SUPPLIERS

const suppliersButton =
    document.getElementById("suppliersButton");

const suppliersSection =
    document.getElementById("suppliersSection");

const suppliersList =
    document.getElementById("suppliersList");

const backFromSuppliersButton =
    document.getElementById("backFromSuppliersButton");

const addSupplierButton =
    document.getElementById("addSupplierButton");

const addSupplierForm =
    document.getElementById("addSupplierForm");

const saveSupplierButton =
    document.getElementById("saveSupplierButton");

const cancelSupplierButton =
    document.getElementById("cancelSupplierButton");

const supplierMessage =
    document.getElementById("supplierMessage");


// REPORTS

const reportsButton =
    document.getElementById("reportsButton");

const reportsSection =
    document.getElementById("reportsSection");

const backFromReportsButton =
    document.getElementById("backFromReportsButton");

const totalProducts =
    document.getElementById("totalProducts");

const totalStock =
    document.getElementById("totalStock");

const lowStockProducts =
    document.getElementById("lowStockProducts");

const totalSuppliers =
    document.getElementById("totalSuppliers");

const reportList =
    document.getElementById("reportList");


// ==================================================
// LOGIN
// ==================================================

loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const email =
            document.getElementById("email")
                .value
                .trim();

        const password =
            document.getElementById("password")
                .value;

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

    }
);


// ==================================================
// AUTHENTICATION STATE
// ==================================================

onAuthStateChanged(
    auth,
    function(user) {

        if (user) {

            loginPage.style.display =
                "none";

            dashboardPage.style.display =
                "block";

            welcomeMessage.textContent =
                "Welcome, " + user.email + "!";

        } else {

            loginPage.style.display =
                "flex";

            dashboardPage.style.display =
                "none";

        }

    }
);


// ==================================================
// PRODUCTS
// ==================================================


// SHOW PRODUCTS

productsButton.addEventListener(
    "click",
    async function() {

        productsSection.style.display =
            "block";

        inventorySection.style.display =
            "none";

        suppliersSection.style.display =
            "none";

        reportsSection.style.display =
            "none";

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

    }
);


// LOAD PRODUCTS

async function loadProducts() {

    const productsSnapshot =
        await getDocs(
            collection(
                db,
                "products"
            )
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

                <p>
                    Category: ${product.category}
                </p>

                <p>
                    Price: ₱${product.price}
                </p>

                <p>
                    Stock: ${product.stock}
                </p>

                <p>
                    Reorder Level: ${product.reorderLevel}
                </p>

                <button class="edit-product-button">
                    Edit
                </button>

                <button class="delete-product-button">
                    Delete
                </button>
            `;


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
                collection(
                    db,
                    "products"
                ),
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


// CANCEL PRODUCT FORM

cancelProductButton.addEventListener(
    "click",
    function() {

        addProductForm.style.display =
            "none";

        productMessage.textContent = "";

    }
);


// BACK FROM PRODUCTS

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

        suppliersSection.style.display =
            "none";

        reportsSection.style.display =
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
            collection(
                db,
                "products"
            )
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


            let stockStatus =
                "Stock Available";


            if (
                stock <= reorderLevel
            ) {

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


// BACK FROM INVENTORY

backFromInventoryButton.addEventListener(
    "click",
    function() {

        inventorySection.style.display =
            "none";

    }
);


// ==================================================
// SUPPLIERS
// ==================================================


// SHOW SUPPLIERS

suppliersButton.addEventListener(
    "click",
    async function() {

        productsSection.style.display =
            "none";

        inventorySection.style.display =
            "none";

        reportsSection.style.display =
            "none";

        addProductForm.style.display =
            "none";

        suppliersSection.style.display =
            "block";

        suppliersList.textContent =
            "Loading suppliers...";


        try {

            await loadSuppliers();

        } catch (error) {

            console.error(
                "Error loading suppliers:",
                error
            );

            suppliersList.textContent =
                "Unable to load suppliers.";

        }

    }
);


// LOAD SUPPLIERS

async function loadSuppliers() {

    const suppliersSnapshot =
        await getDocs(
            collection(
                db,
                "suppliers"
            )
        );


    suppliersList.innerHTML = "";


    if (suppliersSnapshot.empty) {

        suppliersList.textContent =
            "No suppliers found.";

        return;

    }


    suppliersSnapshot.forEach(
        function(documentSnapshot) {

            const supplier =
                documentSnapshot.data();

            const supplierId =
                documentSnapshot.id;


            const supplierCard =
                document.createElement("div");

            supplierCard.className =
                "product-card";


            supplierCard.innerHTML = `
                <h3>
                    ${supplier.name}
                </h3>

                <p>
                    Contact Person:
                    ${supplier.contact}
                </p>

                <p>
                    Phone:
                    ${supplier.phone}
                </p>

                <p>
                    Address:
                    ${supplier.address}
                </p>

                <button class="edit-supplier-button">
                    Edit
                </button>

                <button class="delete-supplier-button">
                    Delete
                </button>
            `;


            const editButton =
                supplierCard.querySelector(
                    ".edit-supplier-button"
                );


            editButton.addEventListener(
                "click",
                function() {

                    editSupplier(
                        supplierId,
                        supplier
                    );

                }
            );


            const deleteButton =
                supplierCard.querySelector(
                    ".delete-supplier-button"
                );


            deleteButton.addEventListener(
                "click",
                function() {

                    deleteSupplier(
                        supplierId
                    );

                }
            );


            suppliersList.appendChild(
                supplierCard
            );

        }
    );

}


// SHOW ADD SUPPLIER FORM

addSupplierButton.addEventListener(
    "click",
    function() {

        addSupplierForm.style.display =
            "block";

        supplierMessage.textContent = "";

    }
);


// SAVE SUPPLIER

saveSupplierButton.addEventListener(
    "click",
    async function() {

        const name =
            document.getElementById(
                "supplierName"
            ).value.trim();

        const contact =
            document.getElementById(
                "supplierContact"
            ).value.trim();

        const phone =
            document.getElementById(
                "supplierPhone"
            ).value.trim();

        const address =
            document.getElementById(
                "supplierAddress"
            ).value.trim();


        if (
            name === "" ||
            contact === "" ||
            phone === "" ||
            address === ""
        ) {

            supplierMessage.textContent =
                "Please complete all fields.";

            return;

        }


        supplierMessage.textContent =
            "Saving supplier...";


        try {

            await addDoc(
                collection(
                    db,
                    "suppliers"
                ),
                {
                    name: name,
                    contact: contact,
                    phone: phone,
                    address: address
                }
            );


            supplierMessage.textContent =
                "Supplier added successfully!";


            document.getElementById(
                "supplierName"
            ).value = "";

            document.getElementById(
                "supplierContact"
            ).value = "";

            document.getElementById(
                "supplierPhone"
            ).value = "";

            document.getElementById(
                "supplierAddress"
            ).value = "";


            await loadSuppliers();

        } catch (error) {

            console.error(
                "Error saving supplier:",
                error
            );

            supplierMessage.textContent =
                "Unable to save supplier.";

        }

    }
);


// EDIT SUPPLIER

async function editSupplier(
    supplierId,
    supplier
) {

    const newName =
        prompt(
            "Supplier Name:",
            supplier.name
        );


    if (newName === null) {
        return;
    }


    const newContact =
        prompt(
            "Contact Person:",
            supplier.contact
        );


    if (newContact === null) {
        return;
    }


    const newPhone =
        prompt(
            "Phone Number:",
            supplier.phone
        );


    if (newPhone === null) {
        return;
    }


    const newAddress =
        prompt(
            "Address:",
            supplier.address
        );


    if (newAddress === null) {
        return;
    }


    if (
        newName.trim() === "" ||
        newContact.trim() === "" ||
        newPhone.trim() === "" ||
        newAddress.trim() === ""
    ) {

        alert(
            "Please complete all fields."
        );

        return;

    }


    try {

        await updateDoc(
            doc(
                db,
                "suppliers",
                supplierId
            ),
            {
                name: newName.trim(),
                contact: newContact.trim(),
                phone: newPhone.trim(),
                address: newAddress.trim()
            }
        );


        alert(
            "Supplier updated successfully!"
        );


        await loadSuppliers();

    } catch (error) {

        console.error(
            "Error updating supplier:",
            error
        );

        alert(
            "Unable to update supplier."
        );

    }

}


// DELETE SUPPLIER

async function deleteSupplier(
    supplierId
) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this supplier?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "suppliers",
                supplierId
            )
        );


        alert(
            "Supplier deleted successfully!"
        );


        await loadSuppliers();

    } catch (error) {

        console.error(
            "Error deleting supplier:",
            error
        );

        alert(
            "Unable to delete supplier."
        );

    }

}


// CANCEL SUPPLIER FORM

cancelSupplierButton.addEventListener(
    "click",
    function() {

        addSupplierForm.style.display =
            "none";

        supplierMessage.textContent = "";

    }
);


// BACK FROM SUPPLIERS

backFromSuppliersButton.addEventListener(
    "click",
    function() {

        suppliersSection.style.display =
            "none";

        addSupplierForm.style.display =
            "none";

    }
);


// ==================================================
// REPORTS
// ==================================================


// SHOW REPORTS

reportsButton.addEventListener(
    "click",
    async function() {

        productsSection.style.display =
            "none";

        inventorySection.style.display =
            "none";

        suppliersSection.style.display =
            "none";

        addProductForm.style.display =
            "none";

        reportsSection.style.display =
            "block";

        reportList.textContent =
            "Loading report...";


        try {

            await loadReports();

        } catch (error) {

            console.error(
                "Error loading reports:",
                error
            );

            reportList.textContent =
                "Unable to load reports.";

        }

    }
);


// LOAD REPORTS

async function loadReports() {

    // GET PRODUCTS

    const productsSnapshot =
        await getDocs(
            collection(
                db,
                "products"
            )
        );


    // GET SUPPLIERS

    const suppliersSnapshot =
        await getDocs(
            collection(
                db,
                "suppliers"
            )
        );


    let productCount = 0;

    let stockCount = 0;

    let lowStockCount = 0;


    reportList.innerHTML = "";


    // CREATE REPORT TABLE

    const table =
        document.createElement("table");


    table.style.width =
        "100%";

    table.style.borderCollapse =
        "collapse";


    const headerRow =
        document.createElement("tr");


    headerRow.innerHTML = `
        <th style="border: 1px solid #ccc; padding: 10px;">
            Product
        </th>

        <th style="border: 1px solid #ccc; padding: 10px;">
            Category
        </th>

        <th style="border: 1px solid #ccc; padding: 10px;">
            Stock
        </th>

        <th style="border: 1px solid #ccc; padding: 10px;">
            Reorder Level
        </th>

        <th style="border: 1px solid #ccc; padding: 10px;">
            Status
        </th>
    `;


    table.appendChild(
        headerRow
    );


    productsSnapshot.forEach(
        function(documentSnapshot) {

            const product =
                documentSnapshot.data();


            const stock =
                Number(product.stock);

            const reorderLevel =
                Number(product.reorderLevel);


            productCount++;

            stockCount += stock;


            let status =
                "Available";


            if (
                stock <= reorderLevel
            ) {

                lowStockCount++;

                status =
                    "LOW STOCK";

            }


            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td style="border: 1px solid #ccc; padding: 10px;">
                    ${product.name}
                </td>

                <td style="border: 1px solid #ccc; padding: 10px;">
                    ${product.category}
                </td>

                <td style="border: 1px solid #ccc; padding: 10px;">
                    ${stock}
                </td>

                <td style="border: 1px solid #ccc; padding: 10px;">
                    ${reorderLevel}
                </td>

                <td style="border: 1px solid #ccc; padding: 10px;">
                    ${status}
                </td>
            `;


            table.appendChild(
                row
            );

        }
    );


    // UPDATE SUMMARY

    totalProducts.textContent =
        productCount;


    totalStock.textContent =
        stockCount;


    lowStockProducts.textContent =
        lowStockCount;


    totalSuppliers.textContent =
        suppliersSnapshot.size;


    // SHOW TABLE

    if (
        productsSnapshot.empty
    ) {

        reportList.textContent =
            "No products available for reporting.";

        return;

    }


    reportList.appendChild(
        table
    );

}


// BACK FROM REPORTS

backFromReportsButton.addEventListener(
    "click",
    function() {

        reportsSection.style.display =
            "none";

    }
);


// ==================================================
// LOGOUT
// ==================================================

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
