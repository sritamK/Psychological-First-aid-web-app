import { auth, db } from "../firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const wlcmName = document.getElementById("wlcmName");
    const userName = document.getElementById("userName");
    const userRoll = document.getElementById("userRoll");
    const userDept = document.getElementById("userDept");
    const userPhone = document.getElementById("userPhone");
    const userEmail = document.getElementById("userEmail");
    const categoriesDiv = document.getElementById("categories");
    const logoutBtn = document.getElementById("logoutBtn");

    const counselingCategories = [
        {
            name: "Stress Management",
            description: "if you often feel stressed, tense, tired, forgetful or overwhelmed by daily responsibilities"
        },
        {
            name: "Depression Help",
            description: "If you've been feeling persistently sad, unmotivated, or hopeless, this category can help you find support."
        },
        {
            name: "Anxiety Support",
            description: "Select this if you experience excessive worry, nervousness, or panic attacks affecting your daily life."
        },
        {
            name: "Academic Pressure",
            description: "If school or university stress is making it difficult for you to focus or sleep, this category is for you."
        },
        {
            name: "Social Issues",
            description: "For those struggling with social anxiety, friendships, or feeling disconnected from others."
        }
    ];





    // Load User Data if Signed In
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                wlcmName.textContent = userData.name;
                userName.textContent = userData.name;
                userRoll.textContent = userData.roll_no;
                userDept.textContent = userData.department;
                userPhone.textContent = userData.phone_No;
                userEmail.textContent = userData.email;
            } else {
                alert("User data not found!");
            }
        } else {
            window.location.href = "login.html"; // Redirect if not log in
        }
    });



    // Load Counseling Categories
    counselingCategories.forEach((category) => {
        const card = document.createElement("div");
        card.classList.add("category-card");

        
        card.innerHTML = `
            <h3>${category.name}</h3>
            <p>${category.description}</p>
            <button class="start-btn" data-category="${category.name}">Start</button>
        `;

        categoriesDiv.appendChild(card);
    });


     // Add Event Listeners for "Start" Buttons
    categoriesDiv.addEventListener("click", (event) => {
        if (event.target.classList.contains("start-btn")) {
            const selectedCategory = event.target.getAttribute("data-category");
            localStorage.setItem("selectedCategory", selectedCategory);
            window.location.href = "questionnaire.html";
        }
    });



    // Logout Function
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            alert("Logged Out Successfully");
            window.location.href = "../index.html";
            sessionStorage.clear()
        } catch (error) {
            console.error("Logout Error:", error);
        }
    });
});

