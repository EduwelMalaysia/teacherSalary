import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { doc, getDoc } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

window.login = async () => {
  const email = `${username.value}@eduwel.local`;
  const cred = await signInWithEmailAndPassword(auth, email, password.value);
  const snap = await getDoc(doc(db,"users",cred.user.uid));
  location.href = snap.data().role === "admin" ? "admin.html" : "teacher.html";
};
