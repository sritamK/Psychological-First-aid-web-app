import { auth, db } from "../firebase-config.js"; // ✅ Import only from firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
// import { firebaseConfig } from "../firebase-config.js"; // Make sure you have this file

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

const emailInput = document.getElementById("email");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");

resetBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();

  if (!email) {
    message.textContent = "Please enter your email.";
    message.style.color = "red";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent!");
    message.textContent = "Password reset email sent! Check your inbox.";
    message.style.color = "green";
  } catch (error) {
    console.error("Error sending reset email:", error);
    message.textContent = "Failed to send reset email. Please check your email or try again.";
    message.style.color = "red";
  }
});
