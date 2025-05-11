import { auth } from "../firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const signInBtn = document.querySelector(".cta .register");
    const HomeLink = document.getElementById("HomeLink");
    const dashBordLink = document.getElementById("dashBordLink");


    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is logged in, hide the Sign In button
            if(HomeLink) {
                HomeLink.style.display = "none";
            }
            if(dashBordLink) {
                dashBordLink.style.display = "flex";
            }
            if (signInBtn) {
                signInBtn.style.display = "none";
            }
        } else {
            // No user is logged in, show the Sign In button
            if (signInBtn) {
                signInBtn.style.display = "inline-block";
            }
            if(HomeLink) {
                HomeLink.style.display = "flex";
            }
            if(dashBordLink) {
                dashBordLink.style.display = "none";
            }
        }
    });
});
