import { auth, db } from "../firebase-config.js";
import { collection, onSnapshot, query, orderBy, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
// import { } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";



document.addEventListener("DOMContentLoaded", async function () {

    const notificationBell = document.getElementById("notificationBell");
    const notificationList = document.getElementById("notificationList");
    const notificationBadge = document.getElementById("notificationBadge");


    // Toggle notification dropdown
    notificationBell.addEventListener("click", () => {
        notificationList.style.display = notificationList.style.display === "none" ? "block" : "none";
        // notificationBadge.style.display = "none";
    });

    notificationList.addEventListener('click', async () => {
        window.location.href = "admin-results.html";
    });

    let unseenCount = 0;

    // Real-time listener for new results
    const resultsQuery = query(collection(db, "results"), orderBy("createdAt", "desc"));

    onSnapshot(resultsQuery, (snapshot) => {
        // Clear existing notifications
        notificationList.innerHTML = "";

        unseenCount = 0;

        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const data = change.doc.data();
                const item = document.createElement("div");
                item.classList.add("notification-item");
                item.textContent = `${data.category} response submitted (${data.resultType})`;

                notificationList.appendChild(item);
                unseenCount++;
            }
        });

        if (unseenCount > 0) {
            notificationBadge.textContent = unseenCount;
            notificationBadge.style.display = "inline-block";
        }
    });
});




document.getElementById("editForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const rollNo = document.getElementById("rollNo").value.trim();
    const name = document.getElementById("name").value.trim();
    const department = document.getElementById("department").value.trim();
    const phone_No = document.getElementById("phone_No").value.trim();
    const email = document.getElementById("email").value.trim();
    const messageDiv = document.getElementById("addMessage");

    if (!rollNo || !name || !department || !phone_No || !email) {
        messageDiv.textContent = "Please fill in all fields.";
        messageDiv.style.color = "red";
        return;
    }

    try {
        const studentRef = doc(db, "students", rollNo);
        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {
            messageDiv.textContent = `Student with Roll No "${rollNo}" already exists.`;
            messageDiv.style.color = "red";
            return;
        }

        await setDoc(studentRef, {
            name,
            department,
            phone_No,
            email            
        });

        // alert("");
        messageDiv.textContent = "Student added successfully!";
        document.getElementById("editForm").reset();
        messageDiv.style.color = "green";
    } catch (error) {
        console.error("Error adding student:", error);
        messageDiv.textContent = "Error adding student. Check console.";
        messageDiv.style.color = "red";
    }
});

// logout
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Logged Out Successfully");
        window.location.href = "admin-login.html";
    } catch (error) {
        console.error("Logout Error:", error);
    }
});
