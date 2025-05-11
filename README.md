

Psychological First Aid (PFA) Web Platform

## Abstract on "Psychological First-aid" Web Platform
What we aim through this web-based application is, to provide early identification and support for Psychological Well-being of students. Encouraging them not to ignore the signs of mental health and take precautions and early counselling. 

This platform lets students directly chat with the AI-bot containing knowledge on various mental health issues and possible ways to resolve it. Aside from chatbot the student can choose a category as needed to which leads to a questioner session which decides level of treatment they need and offers immediate first-aid through chatbot interaction, and accessible pathways to departmental or professional counselling depending on level of need.

For project creation, many tools and technologies used to carry out web application development that is smooth, responsive, and interactive. On the front end, working with HTML, CSS, and JavaScript helped provide a good user interface and dynamic interaction. For backend functionalities Firebase proved to be an advantage. Firebase provided real-time database services and secure authentication, further speeding up development while increasing scalability. As for the Chatbot creation and logic behind its responses are managed by Botpress an open-source conversational-natural language processing framework for designing and managing the chatbot logic.


-- In a nutshell 
This is a web-based application designed to offer **early psychological support** to students through self-assessment tools, chatbot assistance, and a dashboard for both students and admins. It promotes mental well-being using the principles of **Psychological First Aid** in an accessible and scalable format.

---


## Features

- **Secure Login/Registration** for Students and Admins (via Firebase Authentication)
- **Conversational Chatbot** powered by Botpress
- **Self-assessment result submission** with real-time storage(using Firebase's firestore functionality)
- **Admin Dashboard** to view, filter, and export results
- **Notification system** for new high-risk submissions

---


## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend / Database**: Firebase Firestore (NoSQL, free tier)
- **Authentication**: Firebase Auth
- **Chatbot**: Botpress WebChat

---


## Work Flow

1. admin log in to the admin panel, then add a new student on add student section.
2. only then that student can register(i.e if student data is added by the admin side) by using same email & rollno added by admin
3. after successful registration, user can log in through that registered email and password.
4. after sign in user can select a counselling category in which he\she wants to proceed with.
5. based on selected category some MCQ-question will be shown which user have to answer to.
6. based on those responses the system determines whether that user needs to get  a minor counselling or should have major treatment session with a specialist.
# extra features
-- he/she can also interact with the chatbot for mental health related queries after log in.
-- user can contact authorities or book a session witht the department counseller if needed.
-- admin can see, edit, or delete a students data from the firestire from admin pannel.
-- admin gets notified on admin panel each time a user submites a response of the category wise questions.
-- admin can view all the response data of the user but can't see any users chatbot interaction history(because the chat history gets deleted on log out). 
-- admin can also export student response reportwhich includes student details, choosen counselling type and responded mcq choice numbers and timestamp in a excel sheet.
-- admin can also export by filtering student based on result type(major, minor) or counselling categories in a excel sheet.

---


## Note on Firebase Usage

> This project is currently functional using **Firebase Free Tier (Spark Plan)**.  
> **Important:** The Spark Plan is subject to usage limitations, and Firebase may **remove or restrict free hosting and features after July 2025** as per new policy updates.  

> - Considering exporting and migrating to alternative platforms (e.g., Supabase, Vercel, Render).

---


## Files That are not Included for Privacy and Security.

> You must set up your own `firebase-config.js` (not included in repo) with your Firebase credentials.
> you have to set up the botpress and place the embading script inside bot-embeding.js and place it where the current index.html is located.

---


## Firebase_Firestore Collection List & Structure
> admins
    --<admin_user_id provided_through_firebase_authentication>(use it as document id under this collection) 
        → fields--  email,
                    role:'admin'
> students (for this collection no need to creat any documents and fields its done dynamically while admin adds new student)
> results (just create this collection no need to create documents and fields manually, its generated dynamically when student submit question response.)
> users (no need to create this collection its generated automatically when student is registered successfully.)

---


## Contributors

* Sritam kumar Hota – Frontend & Admin Dashboard & Firestore Rules
* Arabinda Nayak – Botpress Chatbot Configuration
* Biswaranjan Moharana – Firebase Integration 

---

## License

This project is for academic and educational purposes.
---
