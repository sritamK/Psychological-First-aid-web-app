import { auth, db } from "../firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("adminLoginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Check if the user is an admin
                const adminRef = doc(db, "admins", user.uid);
                const adminSnap = await getDoc(adminRef);

                if (adminSnap.exists() && adminSnap.data().role === "admin") {
                    alert("Admin Login Successful!");
                    window.location.href = "admin-dashboard.html";
                } else {
                    alert("Access Denied! You are not an admin.");
                    auth.signOut();
                }
            } catch (error) {
                alert("Error: " + error.message);
            }
        });
    }
});

