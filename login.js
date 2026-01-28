import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { doc, getDoc } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

window.login = async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }

  const email = `${username}@eduwel.local`;

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, "users", cred.user.uid));

    if (!snap.exists()) {
      alert("User profile not found");
      return;
    }

    const role = snap.data().role;
    window.location.href = role === "admin"
      ? "admin.html"
      : "teacher.html";

  } catch (err) {
    console.error(err);
    alert("Invalid username or password");
  }
};
