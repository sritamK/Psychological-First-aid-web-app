import { db, auth } from "../firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const category = localStorage.getItem("selectedCategory");
const categoryTitle = document.getElementById("categoryTitle");
const helpTxt = document.getElementById("helpTxt");
const questionsContainer = document.getElementById("questionsContainer");
const questionForm = document.getElementById("questionForm");
const resultMessage = document.getElementById("resultMessage");

// Dummy Questions (placeholder)
const dummyQuestions = {
    "Stress Management": [
        {
            question: "How often do you feel overwhelmed by responsibilities?",
            options: ["Rarely", "Sometimes", "Often", "Always"],
            criticalOptions: [2, 3]
        },
        {
            question: "Do you find it hard to relax or sleep?",
            options: ["Never", "Occasionally", "Frequently", "Always"],
            criticalOptions: [2, 3]
        },
        {
            question: "How would you rate your current energy levels?",
            options: ["High", "Moderate", "Low", "Very Low"],
            criticalOptions: [2, 3]
        }
    ],
    "Depression Help": [
        {
            question: "Do you feel a lack of motivation?",
            options: ["No", "Sometimes", "Yes, Often", "Always"],
            criticalOptions: [2, 3]
        },
        {
            question: "Have you lost interest in activities?",
            options: ["No", "Slightly", "Yes", "Completely"],
            criticalOptions: [2, 3]
        },
        {
            question: "Do you feel hopeless or worthless?",
            options: ["Never", "Sometimes", "Often", "Always"],
            criticalOptions: [2, 3]
        }
    ],
    "Anxiety Support": [
        {
            question: "Do you frequently feel nervous or tense?",
            options: ["Rarely", "Sometimes", "Often", "Always"],
            criticalOptions: [2, 3]
        },
        {
            question: "Do you get panic attacks?",
            options: ["Never", "Rarely", "Frequently", "Very Frequently"],
            criticalOptions: [2, 3]
        },
        {
            question: "Does anxiety affect your daily tasks?",
            options: ["Not at all", "Slightly", "Moderately", "Severely"],
            criticalOptions: [2, 3]
        }
    ],
    "Academic Pressure": [
        {
            question: "How often do you feel overwhelmed by your coursework?",
            options: ["Rarely", "Sometimes", "Often", "Very Often"],
            criticalOptions: [2, 3]
        },
        {
            question: "Do you feel pressure to constantly perform well academically?",
            options: ["Not at all", "Somewhat", "A lot", "Extremely"],
            criticalOptions: [2, 3]
        },
        {
            question: "How often do you lose sleep due to academic stress?",
            options: ["Rarely", "Sometimes", "Often", "Very Often"],
            criticalOptions: [2, 3]
        }
    ],
    "Social Issues": [
        {
            question: "How often do you feel lonely or isolated from others?",
            options: ["Rarely", "Sometimes", "Often", "Always"],
            criticalOptions: [2, 3]
        },
        {
            question: "Do you feel excluded or left out by your peers?",
            options: ["Never", "Sometimes", "Often", "Very Often"],
            criticalOptions: [2, 3]
        },
        {
            question: "Do you worry about social interactions or fitting in?",
            options: ["Not at all", "A little", "A lot", "Constantly"],
            criticalOptions: [2, 3]
        }
    ]
};

if (!category) {
    categoryTitle.textContent = "No category selected.";
} else {
    categoryTitle.textContent = category;
    helpTxt.textContent = "Help us understand your condition, it will help us to provide better care.";
    loadQuestions(category);
}

function loadQuestions(category) {
    const questions = dummyQuestions[category] || [];

    questions.forEach((q, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question-block");

        questionDiv.innerHTML = `
            <p><strong>Q${index + 1}: ${q.question}</strong></p>
            ${q.options.map((option, i) =>
            `<label><input type="radio" name="q${index}" value="${i}" required> ${option}</label><br>`
        ).join("")}
        `;

        questionsContainer.appendChild(questionDiv);
    });
}

questionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(questionForm);
    const answers = [];

    for (let i = 0; i < dummyQuestions[category].length; i++) {
        const selected = formData.get(`q${i}`);
        answers.push(parseInt(selected));
    }

    // Evaluate result type
    let criticalCount = 0;
    dummyQuestions[category].forEach((q, i) => {
        if (q.criticalOptions.includes(answers[i])) {
            criticalCount++;
        }
    });

    const resultType = criticalCount >= 2 ? "Major" : "Minor";
    localStorage.setItem("counselingResult", resultType);
    if (resultType === "Minor") {
        resultMessage.style.background = "#ebf4ff";
        resultMessage.style.border = "1px solid #a5ccfd";


        resultMessage.textContent = `You may need ${resultType} Psychological First Aid.`;
    }
    if (resultType === "Major") {
        resultMessage.style.background = "#ffe7e7";
        resultMessage.style.border = "1px solid #ff4949";


        resultMessage.textContent = `You may need ${resultType} Psychological First Aid.`;
    }

    // Save to Firestore with user info
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const userData = userDoc.exists() ? userDoc.data() : {};

                const resultRef = doc(db, "results", user.uid + "_" + category.replace(/\s+/g, "_"));
                await setDoc(resultRef, {
                    uid: user.uid,
                    name: userData.name || "",
                    roll_no: userData.roll_no || "",
                    department: userData.department || "",
                    email: userData.email || "",
                    phone_No: userData.phone_No || "",
                    category,
                    answers,
                    resultType,
                    createdAt: serverTimestamp()
                });

                console.log("Result saved.");
                window.location.href = "counseling.html";
            } catch (err) {
                console.error("Error saving result:", err);
                alert("An error occurred while saving your result. Please try again.");
            }
        }
    });
});
