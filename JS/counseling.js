import { auth, db } from "../firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const category = localStorage.getItem("selectedCategory");
var botloaded = false;
var botready = false;

document.addEventListener("DOMContentLoaded", async () => {

    const cunclSug = document.getElementById("cunclSug");
    const counselingMessage = document.getElementById("counselingMessage");
    const contactInfoCT = document.getElementById("contactInfoCT");
    const contactInfoHOD = document.getElementById("contactInfoHOD");
    const contactInfoDC = document.getElementById("contactInfoDC");
    const majorMsg = document.getElementById("majorMsg");
    const chatbotSection = document.getElementById("chatbotSection");
    const actionSection = document.getElementById("actionSection");
    const srtPara1 = document.getElementById("srtPara1");



    onAuthStateChanged(auth, async (user) => {
        if (user) {

            const resultRef = doc(db, "results", `${user.uid}_${category.replace(" ", "_")}`);
            const resultSnap = await getDoc(resultRef);

            if (resultSnap.exists()) {
                const { resultType } = resultSnap.data();

                if (resultType === "Minor") {
                    showMinorCounseling(resultSnap.data(), category);
                } else {
                    showMajorCounseling(resultSnap.data(), category);

                }
            } else {
                counselingMessage.textContent = "No counseling result found.";
            }
        } else {
            window.location.href = "login.html";
        }
    });






    // function of Minor category
    function showMinorCounseling(user, category) {
        counselingMessage.textContent = "Let our assistant help you with your uneasiness!";
        contactInfoCT.style.display = "block";
        console.log(category);

        const emailBody = `
        Student: ${user.name}
        Roll No: ${user.roll_no}  
        Category: ${category} ${user.resultType}
        Want to have a one on one counselling session with you, please suggest date and time accordingly.
    `;

        contactInfoDC.innerHTML = `
            <h4>Department Counselor</h4>
            <p>Have a one on one Counselling session</p>
            <div class="contact">
                <div><span class="material-symbols-rounded">send</span><a id="BookS" href="mailto:hod@example.com?subject=Counseling session Request&body=${encodeURIComponent(emailBody)}">Book a session</a></div>
            </div>
            `;

        contactInfoCT.innerHTML = `
            <h4>Class Teacher</h4>
            <p>Have a chat with your class teacher.</p>
            <div class="contact">
              <div><span class="material-symbols-rounded">phone_in_talk</span><a href="tel:+91-9865324875">+91-98653 24875</a></div>
              <div><span class="material-symbols-rounded">send</span><a href="mailto:teacher@mail.com">Send an email</a>
              </div>
            </div>
            `;

        contactInfoHOD.innerHTML = `
            <h4>HOD</h4>
            <p>Connect with your HOD</p>
            <div class="contact">
              <div><span class="material-symbols-rounded">phone_in_talk</span><a href="tel:+91-9784653154">+91-97846 53154</a></div>
              <div><span class="material-symbols-rounded">send</span><a href="mailto:Hod@mail.com">Send an email</a>
              </div>
            </div>
            `;



        chatbotSection.style.display = "block";
        initBotpress(category);

    }




    // function of Major category
    function showMajorCounseling(user, category) {
        counselingMessage.innerHTML = "Proper Counselling session Recommanded";

        // cunclSug.style.color = "red";
        actionSection.style.display = "block";
        majorMsg.style.color = "red";


        const emailBody = `
        Student: ${user.name}
        Roll No: ${user.roll_no}  
        Category: ${category} ${user.resultType}
        Want to have a one on one counselling session with you, please suggest date and time accordingly.
    `;

        contactInfoDC.innerHTML = `
            <h4>Department Counselor</h4>
            <p>Have a one on one Counselling session</p>
            <div class="contact">
                <div><span class="material-symbols-rounded">send</span><a id="BookS" href="mailto:hod@example.com?subject=Counseling session Request&body=${encodeURIComponent(emailBody)}">Book a session</a></div>
            </div>
            `;

        contactInfoHOD.innerHTML = `
            <h4>HOD</h4>
            <p>Connect with your HOD</p>
            <div class="contact">
              <div><span class="material-symbols-rounded">phone_in_talk</span><a href="tel:+91-9784653154">+91-97846 53154</a></div>
              <div><span class="material-symbols-rounded">send</span><a href="mailto:Hod@mail.com">Send an email</a>
              </div>
            </div>
            `;

        srtPara1.innerHTML = "Your Physical and Mental health both are important,<br>Don't ignore the signs."

        sendEmailToHOD(user, category);
        // initBotpress(user,category);

    }



    async function sendEmailToHOD(user, category) {
        const emailBody = `
            Student: ${user.name} (Roll No: ${user.roll_no})  
            Category: ${category}, (${user.resultType}) 
            Urgent Attention Required for Professional Counseling.
        `;

        const mailtoLink = `mailto:hod@example.com?subject=Urgent Counseling Request&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
    }
});

