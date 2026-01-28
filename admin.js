import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
  collection, getDocs, setDoc, doc,
  updateDoc, query, where
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

/* =========================
   👤 USER MANAGEMENT
========================= */

// CREATE USER
window.createUser = async () => {
  const username = newUsername.value.trim();
  const password = newPassword.value;
  const role = newRole.value;

  if (!username || !password) {
    alert("Username and password required");
    return;
  }

  const email = `${username}@eduwel.local`;

  const cred = await createUserWithEmailAndPassword(
    auth, email, password
  );

  await setDoc(doc(db,"users",cred.user.uid),{
    username,
    role,
    active: true
  });

  alert("User created");
};

// LOAD USERS
async function loadUsers() {
  const snap = await getDocs(collection(db,"users"));
  snap.forEach(d => {
    const u = d.data();
    userList.innerHTML += `
      <div class="bg-white p-3 shadow rounded mb-2">
        ${u.username} (${u.role})
        <button
          onclick="toggleUser('${d.id}',${!u.active})"
          class="ml-2 px-2 py-1 text-white rounded
            ${u.active ? "bg-red-600" : "bg-green-600"}">
          ${u.active ? "Disable" : "Enable"}
        </button>
      </div>
    `;
  });
}

window.toggleUser = async (uid, active) => {
  await updateDoc(doc(db,"users",uid),{ active });
  location.reload();
};

loadUsers();

/* =========================
   📅 SLOT → AUTO GENERATE
========================= */

window.generateDates = (year, month, dayOfWeek) => {
  const dates = [];
  const d = new Date(year, month - 1, 1);

  while (d.getMonth() === month - 1) {
    if (d.getDay() === dayOfWeek) {
      dates.push(d.toISOString().slice(0,10));
    }
    d.setDate(d.getDate() + 1);
  }
  return dates;
};

/* =========================
   💰 PAYROLL CALCULATION
========================= */

function calculatePay(minutes, salary) {
  const hours = minutes / 60;
  if (hours >= 4.5) return salary.fullDay;
  if (hours >= 3) return salary.halfDay;
  return hours * salary.hourly;
}

// EXPORT CSV
window.exportPayroll = async () => {
  let csv = "Teacher,Date,Minutes,Pay\n";

  const sessionsSnap = await getDocs(
    query(collection(db,"classSessions"), where("status","==","taught"))
  );

  sessionsSnap.forEach(d => {
    const s = d.data();
    csv += `${s.teacherId},${s.date},${s.durationMinutes},\n`;
  });

  const blob = new Blob([csv],{ type:"text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "payroll.csv";
  a.click();
};

/* =========================
   🔒 LOCK MONTH
========================= */

window.lockMonth = async month => {
  await setDoc(doc(db,"settings","payroll"),{
    lockedMonth: month
  });
  alert("Month locked");
};
