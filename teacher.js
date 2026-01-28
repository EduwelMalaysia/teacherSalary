import { auth, db } from "./firebase.js";
import {
  collection, query, where, getDocs,
  updateDoc, doc, addDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import {
  updatePassword
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// 🔐 CHANGE PASSWORD
window.changePassword = async () => {
  const pwd = document.getElementById("newPassword").value;
  if (pwd.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }
  await updatePassword(auth.currentUser, pwd);
  alert("Password updated");
};

// 📚 LOAD CLASS SESSIONS
auth.onAuthStateChanged(async user => {
  if (!user) return;

  const settingsSnap = await getDoc(doc(db,"settings","payroll"));
  const lockedMonth = settingsSnap.exists()
    ? settingsSnap.data().lockedMonth
    : null;

  const q = query(
    collection(db,"classSessions"),
    where("teacherId","==",user.uid)
  );

  const snap = await getDocs(q);
  snap.forEach(d => {
    const s = d.data();
    const isLocked = lockedMonth && s.date.startsWith(lockedMonth);

    sessions.innerHTML += `
      <div class="bg-white p-4 rounded shadow">
        <b>${s.date}</b> – ${s.courseTitle}
        <div class="mt-2 space-x-2">
          <button
            ${isLocked ? "disabled" : ""}
            onclick="mark('${d.id}','taught')"
            class="px-3 py-1 rounded text-white
              ${isLocked ? "bg-gray-400" : "bg-blue-600"}">
            Taught
          </button>

          <button
            ${isLocked ? "disabled" : ""}
            onclick="mark('${d.id}','leave')"
            class="px-3 py-1 rounded text-white
              ${isLocked ? "bg-gray-400" : "bg-red-600"}">
            Leave
          </button>
        </div>
      </div>
    `;
  });
});

// ✅ MARK ATTENDANCE
window.mark = async (id, status) => {
  await updateDoc(doc(db,"classSessions",id),{
    status,
    confirmedAt: new Date()
  });
  alert("Saved");
};

// ➕ SUBMIT REPLACEMENT
window.submitReplacement = async () => {
  const date = repDate.value;
  if (!date) {
    alert("Please select date");
    return;
  }

  await addDoc(collection(db,"replacementSessions"),{
    replacementTeacherId: auth.currentUser.uid,
    date,
    durationMinutes: Number(repDuration.value),
    mode: repMode.value,
    status: "pending",
    submittedAt: new Date()
  });

  alert("Replacement submitted for approval");
};
