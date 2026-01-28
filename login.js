import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
  collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

window.login = async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }

  try {
    // 🔍 1. Find user by username
    const q = query(
      collection(db, "users"),
      where("username", "==", username)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      alert("User not found");
      return;
    }

    const userDoc = snap.docs[0].data();
    const email = userDoc.email;

    // 🔐 2. Sign in with REAL email
    const cred = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // 🚦 3. Check role
    window.location.href =
      userDoc.role === "admin"
        ? "admin.html"
        : "teacher.html";

  } catch (err) {
    console.error(err.code, err.message);
    alert("Invalid username or password");
  }
};
