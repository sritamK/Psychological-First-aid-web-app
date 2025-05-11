import { auth, db } from "../firebase-config.js"; // ✅ Import only from firebase-config.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const roll = document.getElementById("rollNo").value.trim().toUpperCase(); // Normalize roll number
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();




            try {
                // Fetch student data from Firestore
                const studentRef = doc(db, "students", roll);
                const studentSnap = await getDoc(studentRef);

                if (!studentSnap.exists()) {
                    console.error("❌ Roll Number NOT FOUND in Firestore!");
                    alert("Invalid Roll Number!");
                    return;
                }


                const studentData = studentSnap.data();

        
                //checks if the 'email'field equal
                const mail = studentData.email;
                // console.log(names);
                if (mail != email) {
                    console.error("❌ Wrong 'email' field!", names);
                    alert("Error: Your student data is incomplete in Firestore.");
                    return;
                }



                // Registering user in Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user; // Ensure user is assigned

                console.log("🎉 User Registered:", user);

                // 🔐 Wait until Firebase confirms the user is fully authenticated
                await new Promise((resolve) => {
                    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
                        if (firebaseUser && firebaseUser.uid === user.uid) {
                            resolve();
                            unsubscribe();
                        }
                    });
                });
                // console.log("Is user signed in?", auth.currentUser?.uid);

                console.log("Student Data Retrieved");

                // console.log("UID:", user.uid);
                // console.log("Will try to write to users/" + user.uid);



                // Saveing user data in Firestore
                await setDoc(doc(db, "users", user.uid), {
                    roll_no: roll,
                    name: name,
                    email: email,
                    phone_No: studentData.phone_No,
                    department: studentData.department
                });

                alert("🎉 Registration Successful!");
                window.location.href = "login.html";

            } catch (error) {
                console.error("❌ Error:", error.message);
                alert("Error: " + error.message);
            }
        });

    }

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                alert("✅ Login Successful!");
                window.location.href = "dashboard.html";
            } catch (error) {
                console.error("🚨 Login Error:", error);
                alert("Error: " + error.message);
            }
        });
    }
});
