import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_CONFIG_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_CONFIG_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_CONFIG_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_CONFIG_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_CONFIG_MESSANGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_CONFIG_appId
};
// Initialize Firebase
console.log(firebaseConfig)

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Sign in anonymously first
signInAnonymously(auth).then(() => {
    console.log("Signed in anonymously for public write access");
}).catch((error) => {
    console.error("Auth error:", error);
});

// Form Handling Logic
const form = document.getElementById('quote-form');
const submitBtn = document.getElementById('submit-btn');
const spinner = document.getElementById('loading-spinner');
const toast = document.getElementById('toast');
const btnText = submitBtn.querySelector('span');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Guard: check auth
    if (!auth.currentUser) {
        alert("Connecting to server... please try again in a second.");
        return;
    }

    // UI Loading State
    submitBtn.disabled = true;
    spinner.classList.remove('hidden');
    btnText.textContent = "Sending...";

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const requirement = document.getElementById('requirement').value;
    const message = document.getElementById('message').value;
    const emailParams = {
        name: name,     // The user's name
        phone: phone,   // The user's email
        requirement: requirement,      
        message: message
    };
    try {
        // RULE 1: Use the correct path structure
        // /artifacts/{appId}/public/data/{collectionName}
        const inquiriesRef = collection(db, 'artifacts', appId, 'public', 'data', 'inquiries');
        
        await addDoc(inquiriesRef, {
            name: name,
            phone: phone,
            requirement: requirement,
            message: message,
            createdAt: serverTimestamp(),
            userId: auth.currentUser.uid // Tracking who sent it
        });
        await emailjs.send(import.meta.env.VITE_SERVICE_KEY_EMAILJS, import.meta.env.VITE_TEMPLATE_ID_EMAILJS, emailParams);
        // Success UI
        form.reset();
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 5000);

    } catch (error) {
        console.error("Error writing document: ", error);
        alert("Something went wrong. Please call us directly.");
    } finally {
        // Reset UI
        submitBtn.disabled = false;
        spinner.classList.add('hidden');
        btnText.textContent = "Send Request";
    }
});