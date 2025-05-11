rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 🔐 Helper Function to Check Admin Role
    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    // 📚 Students Collection: Public read, only admins can write
    match /students/{studentId} {
      allow read: if true; // Public read (e.g. for listing students)
      allow write: if isAdmin();
    }

    // 👤 Users Collection: Users can read/write their own data, admins can read all
    match /users/{userId} {
      allow read: if request.auth != null && (
        request.auth.uid == userId || isAdmin()
      );
      

      allow create: if true; // TEMP during registration
      allow update: if request.auth != null && request.auth.uid == userId || isAdmin();
      allow delete: if isAdmin(); // Optional: let admins delete user data
    }

    // 📊 Results Collection: Allow users to write their own results, admins can read all
    match /results/{resultId} {
      allow create, update, read: if request.auth != null && 
                              request.auth.uid == resultId.split("_")[0];
      allow read: if isAdmin(); // Admin can view for exports
    }

    // 🔔 Notifications Collection: Only admins can read/write
    match /notifications/{notifId} {
      allow read, write: if isAdmin();
    }

    // 👑 Admins Collection: Only admin can read/write their own admin document
    match /admins/{adminId} {
      allow read, write: if request.auth != null && request.auth.uid == adminId;
    }
  }
}
