document.getElementById("loginForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("loginMessage");

    if (email === "" || password === "") {
        message.textContent = "Please enter your email and password.";
        return;
    }

    message.textContent = "Login system will be connected to Firebase.";

});
