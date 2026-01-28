import { db } from "./firebase.js";
import { collection, addDoc } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { hashPassword } from "./utils.js";

window.createUser = async () => {
  const username = newUsername.value.trim();
  const password = newPassword.value;

  if (!username || !password) {
    alert("Username & password required");
    return;
  }

  const passwordHash = await hashPassword(password);

  await addDoc(collection(db, "users"), {
    username,
    passwordHash,
    role: "teacher",
    email: null,
    active: true
  });

  alert("Teacher created");
};
