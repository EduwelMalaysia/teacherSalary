import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { collection, query, where, getDocs } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { hashPassword } from "./utils.js";

window.login = async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Enter username & password");
    return;
  }

  // 🔍 Look up user by username
  const q = query(
    collection(db, "users"),
    where("username", "==", username),
    where("active", "==", true)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    alert("User not found");
    return;
  }

  const userDoc = snap.docs[0];
  const user = userDoc.data();

  // 🔐 ADMIN LOGIN (Firebase Auth)
  if (user.role === "admin") {
    if (!user.email) {
      alert("Admin email not set");
      return;
    }

    try {
      await signInWithEmailAndPassword(
        auth,
        user.email,
        password
      );
      location.href = "admin.html";
    } catch {
      alert("Invalid admin credentials");
    }
    return;
  }

  // 👩‍🏫 TEACHER LOGIN (Firestore)
  if (user.role === "teacher") {
    const hash = await hashPassword(password);
    if (hash !== user.passwordHash) {
      alert("Invalid username or password");
      return;
    }

    sessionStorage.setItem("teacherId", userDoc.id);
    location.href = "teacher.html";
  }
};
