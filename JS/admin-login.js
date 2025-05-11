import { auth, db } from "../firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
    const adminLoginForm = document.getElementById("adminLoginForm");

    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = document.getElementById("adminEmail").value.trim();
            const password = document.getElementById("adminPassword").value.trim();

            try {
                // Authenticate admin
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Check if admin exists in Firestore
                const adminRef = doc(db, "admins", user.uid);
                const adminSnap = await getDoc(adminRef);

                if (!adminSnap.exists()) {
                    alert("❌Access Denied! You are not an admin.");
                    return;
                }

                // Admin is verified, redirect to admin dashboard
                alert("✅Admin Login Successful!");
                window.location.href = "admin-dashboard.html";

            } catch (error) {
                console.error("❌Admin Login Error:", error);
                alert("Error: " + error.message);
            }
        });
    }
});
