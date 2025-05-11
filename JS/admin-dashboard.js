import { auth, db } from "../firebase-config.js";
import { collection, onSnapshot, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", async function () {
    const notificationBell = document.getElementById("notificationBell");
    const notificationList = document.getElementById("notificationList");
    const notificationBadge = document.getElementById("notificationBadge");
    const totalStudents = document.getElementById("totalStudents");
    const registeredStudents = document.getElementById("registeredStudents");
    const majorIssues = document.getElementById("majorIssues");
    const logoutBtn = document.getElementById("logoutBtn");



    // Toggle notification dropdown
    notificationBell.addEventListener("click", () => {
        notificationList.style.display = notificationList.style.display === "none" ? "block" : "none";
        // notificationBadge.style.display="none";
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




    async function fetchStats() {
        try {
            console.log("Fetching student data...");

            const studentsSnapshot = await getDocs(collection(db, "students"));
            console.log("Total students fetched:", studentsSnapshot.size);
            // studentsSnapshot.forEach((doc) => console.log("Student:", doc.data()));

            const usersSnapshot = await getDocs(collection(db, "users"));
            console.log("Registered students fetched:", usersSnapshot.size);
            // usersSnapshot.forEach((doc) => console.log("User:", doc.data()));


            const resultsRef = collection(db, "results");
            const resultsSnapshot = await getDocs(resultsRef);

            let majorIssueCount = 0;

            resultsSnapshot.forEach((doc) => {
                const resultData = doc.data();
                if (resultData.resultType === "Major") {
                    majorIssueCount++;
                }
            });

            console.log("Total Major Issues:", majorIssueCount);

            totalStudents.innerText = studentsSnapshot.size;
            registeredStudents.innerText = usersSnapshot.size;
            majorIssues.innerText = majorIssueCount;

            console.log("Final counts - Total:", studentsSnapshot.size, "Registered:", usersSnapshot.size, "Major Issues:", majorIssueCount);  // Debugging
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }

    fetchStats();

    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            alert("Logged Out Successfully");
            window.location.href = "admin-login.html";
        } catch (error) {
            console.error("Logout Error:", error);
        }
    });
});

async function fetchStudents() {
    const studentsTable = document.getElementById("studentsTable");
    studentsTable.innerHTML = ""; // Clear previous data

    try {
        console.log("Fetching students...");

        // Fetch students collection
        const studentsSnapshot = await getDocs(collection(db, "students"));

        // Fetch users collection
        const usersSnapshot = await getDocs(collection(db, "users"));
        const registeredUsers = new Set();

        // Store registered roll numbers from users collection
        usersSnapshot.forEach(userDoc => {
            const userData = userDoc.data();
            if (userData.roll_no) {
                registeredUsers.add(userData.roll_no);
            }
        });

        // Iterate over students collection
        let counter = 0;
        studentsSnapshot.forEach((docSnapshot) => {
            const student = docSnapshot.data();
            const rollNo = docSnapshot.id; // Document ID is roll number
            counter++;
            // Check if student is in the users collection (registered)
            const registered = registeredUsers.has(rollNo) ? "✅ Yes" : "❌ No";

            studentsTable.innerHTML += `
                <tr>
                    <td>${counter}</td>
                    <td>${rollNo}</td>
                    <td>${student.name || "N/A"}</td>
                    <td>${student.email || "N/A"}</td>
                    <td>${student.phone_No || "N/A"}</td>
                    <td>${student.department || "N/A"}</td>
                    <td>${registered}</td>
                    
                </tr>
            `;

        });

        console.log("Students loaded successfully.");
    } catch (error) {
        console.error("Error fetching students:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchStudents);



