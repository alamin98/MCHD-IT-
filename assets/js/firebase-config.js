/* Firebase connection for the expertise CMS.
   1. Create a Firebase project → add a Web app → copy its config object here.
   2. Enable Authentication (Email/Password), Firestore and Storage.
   3. Deploy firestore.rules + storage.rules, and add your admin UIDs (see ADMIN.md).
   Leave as null to run the site on the built-in content (admin panel runs in demo mode). */
window.MCHD_FIREBASE_CONFIG = null;
/* Example:
window.MCHD_FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "mchd-it.firebaseapp.com",
  projectId: "mchd-it",
  storageBucket: "mchd-it.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxxxxxxxxxx"
};
*/
