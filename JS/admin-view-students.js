import { auth, db } from "../firebase-config.js";
import { collection, onSnapshot, query, orderBy, getDocs, deleteDoc, doc, updateDoc, where } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
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



// Fetch and display students
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
                    <td>${student.department || "N/A"}</td>
                    <td>${registered}</td>
                    <td class="actionBtn">
                        <button id="edit" onclick="editStudent('${rollNo}', '${student.name}', '${student.department}', '${student.phone_No}', '${student.email}')"><span class="material-symbols-outlined">edit</span></button>
                        <button id="delete" onclick="deleteStudent('${rollNo}')"><span class="material-symbols-outlined">delete</span></button>
                    </td>
                </tr>
            `;

        });

        console.log("Students loaded successfully.");
    } catch (error) {
        console.error("Error fetching students:", error);
    }
}



window.deleteStudent = async function (studentId) {
    if (confirm("Are you sure you want to delete this student?")) {
        try {
            // Delete from "students" collection
            await deleteDoc(doc(db, "students", studentId));

            // Search "users" collection for a document with roll == studentId
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("roll_no", "==", studentId));
            const querySnapshot = await getDocs(q);

            // Delete matching user(s)
            querySnapshot.forEach(async (userDoc) => {
                await deleteDoc(doc(db, "users", userDoc.id));
            });

            alert("Student deleted successfully!");
            fetchStudents(); // Refresh the table
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    }
};



// Make editStudent globally accessible
window.editStudent = function (rollNo, name, department, phone_No, email) {
    document.getElementById("editRollNo").value = rollNo;
    document.getElementById("editName").value = name;
    document.getElementById("editDepartment").value = department;
    document.getElementById("editPhone").value = phone_No;
    document.getElementById("editEmail").value = email;
    // console.log(email);
    document.getElementById("editModal").style.display = "block";
};

// Save changes
document.getElementById("editForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("Save btn clicked");
    const rollNo = document.getElementById("editRollNo").value;
    const newName = document.getElementById("editName").value;
    const newDepartment = document.getElementById("editDepartment").value;
    const newPhone = document.getElementById("editPhone").value;
    const newMail = document.getElementById("editEmail").value;

    try {
        await updateDoc(doc(db, "students", rollNo), {
            name: newName,
            department: newDepartment,
            phone_No: newPhone,
            email: newMail
        });

        // Search "users" collection for a document with roll == studentId
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("roll_no", "==", rollNo));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (userDoc) => {
            await updateDoc(doc(db, "users", userDoc.id), {
                name: newName,
                department: newDepartment,
                phone_No: newPhone,
                email: newMail
            });
        });

        alert("✅Student updated successfully!");
        document.getElementById("editModal").style.display = "none";
        fetchStudents();
    } catch (error) {
        console.error("Error updating student:", error);
    }
});

// Close modal on cancel or X
document.getElementById("cancelEdit").addEventListener("click", () => {
    document.getElementById("editModal").style.display = "none";
});
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("editModal").style.display = "none";
});







// Search students
document.getElementById("searchStudent").addEventListener("keyup", function () {
    let filter = this.value.toLowerCase();
    let rows = document.querySelectorAll("#studentsTable tr");

    rows.forEach((row) => {
        let text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
});

// Load students on page load
document.addEventListener("DOMContentLoaded", fetchStudents);

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
