import { auth, db } from "../firebase-config.js";
import { collection, onSnapshot, orderBy, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";


// document.addEventListener("DOMContentLoaded", async function () {

const notificationBell = document.getElementById("notificationBell");
const notificationList = document.getElementById("notificationList");
const notificationBadge = document.getElementById("notificationBadge");
const exportAllBtn = document.getElementById("exportAllBtn");


// Export all function
exportAllBtn.addEventListener("click", async () => {
    try {
        const resultsRef = collection(db, "results");
        const resultsSnapshot = await getDocs(resultsRef);

        // Get current filter values
        const selectedCategory = filterCategory.value;
        const selectedResult = filterResult.value;

        // Filter the data based on selected filters
        const filteredData = resultsSnapshot.docs
            .map(doc => doc.data())
            .filter(result =>
                (selectedCategory === "all" || result.category === selectedCategory) &&
                (selectedResult === "all" || result.resultType === selectedResult)
            )
            .map(result => ({
                Roll_No: result.roll_no,
                Name: result.name,
                Email: result.email,
                Phone_No: result.phone_No,
                Category: result.category,
                Result: result.resultType,
                Answers: result.answers.join(", "),
                Submited_On: result.createdAt?.toDate().toLocaleString() || "-"
            }));

        if (filteredData.length === 0) {
            alert("No responses match the current filters.");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered_Responses");

        XLSX.writeFile(workbook, "Filtered_Student_Responses.xlsx");
    } catch (error) {
        console.error("Error exporting filtered responses:", error);
        alert("Failed to export responses.");
    }
});




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
// });




// body content
const responsesTableBody = document.getElementById("responsesTableBody");
const filterCategory = document.getElementById("filterCategory");
const filterResult = document.getElementById("filterResult");
const logoutBtn = document.getElementById("logoutBtn");

async function fetchResponses() {
    const resultsRef = collection(db, "results");
    const resultsSnapshot = await getDocs(resultsRef);

    renderResponses(resultsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
}

function renderResponses(responses) {
    responsesTableBody.innerHTML = "";

    responses
        .filter(response => {
            const categoryFilter = filterCategory.value;
            const resultFilter = filterResult.value;

            return (categoryFilter === "all" || response.category === categoryFilter) &&
                (resultFilter === "all" || response.resultType === resultFilter);
        })
        .forEach(response => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
        <td>${response.roll_no}</td>
        <td>${response.uid}</td>
        <td>${response.phone_No}</td>
        <td>${response.category}</td>
        <td style="${response.resultType === 'Major' ? 'color: red; font-weight: bold;' : ''}">
            ${response.resultType}
        </td>
        <td>${response.createdAt?.toDate().toLocaleString() || "-"}</td>
        <td>
          
          <button onclick="exportToExcel('${response.id}')">Export Excel</button>
        </td>
      `;
            //   <button onclick="exportToPDF('${response.id}')">Export PDF</button>
            responsesTableBody.appendChild(tr);
        });
}

// Event Listeners
filterCategory.addEventListener("change", fetchResponses);
filterResult.addEventListener("change", fetchResponses);

fetchResponses();

// logout
logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Logged Out Successfully");
        window.location.href = "admin-login.html";
    } catch (error) {
        console.error("Logout Error:", error);
    }
});




window.exportToExcel = async function (docId) {
    const xlsx = await import("https://cdn.sheetjs.com/xlsx-0.19.3/package/xlsx.mjs");
    const resultSnap = await getDocs(collection(db, "results"));
    const docData = resultSnap.docs.find(doc => doc.id === docId)?.data();

    if (docData) {
        const worksheet = xlsx.utils.json_to_sheet([{
            Roll_No: docData.roll_no,
            Name: docData.name,
            Email: docData.email,
            Phone_No: docData.phone_No,
            Category: docData.category,
            Result: docData.resultType,
            Answers: docData.answers.join(", "),
            Submited_On: docData.createdAt?.toDate().toLocaleString() || "-"
        }]);

        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Result");
        xlsx.writeFile(workbook, `Response_${docData.uid}.xlsx`);
    }
};




