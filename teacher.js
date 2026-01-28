import { db } from "./firebase.js";
import {
  doc, getDoc,
  collection, query, where, getDocs, addDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const teacherId = sessionStorage.getItem("teacherId");

// 🔹 Load teacher profile
async function loadProfile() {
  const snap = await getDoc(doc(db, "users", teacherId));
  if (snap.exists()) {
    document.getElementById("teacherName").innerText =
      snap.data().username;
  }
}

// 🔹 Load assigned class slots
async function loadClasses() {
  const q = query(
    collection(db, "classSlots"),
    where("teacherId", "==", teacherId),
    where("active", "==", true)
  );

  const snap = await getDocs(q);
  const container = document.getElementById("classList");
  container.innerHTML = "";

  if (snap.empty) {
    container.innerHTML =
      `<p class="text-gray-500">No classes assigned.</p>`;
    return;
  }

  snap.forEach(docu => {
    const c = docu.data();
    container.innerHTML += `
      <div class="bg-white p-4 rounded shadow">
        <div class="font-semibold">${c.course}</div>
        <div class="text-sm text-gray-600">
          ${c.day} | ${c.time} | ${c.mode}
        </div>

        <div class="mt-3 flex gap-2">
          <button onclick="markAttendance('${docu.id}', 'present')"
            class="bg-blue-600 text-white px-3 py-1 rounded">
            Present
          </button>

          <button onclick="markAttendance('${docu.id}', 'leave')"
            class="bg-red-600 text-white px-3 py-1 rounded">
            Leave
          </button>
        </div>
      </div>
    `;
  });
}

// 🔹 Mark attendance
window.markAttendance = async (slotId, status) => {
  await addDoc(collection(db, "attendance"), {
    slotId,
    teacherId,
    status,
    date: new Date().toISOString().slice(0, 10),
    createdAt: new Date()
  });

  alert("Attendance submitted");
};

// 🔹 Submit replacement
window.submitReplacement = async () => {
  const date = repDate.value;
  const duration = Number(repDuration.value);

  if (!date) {
    alert("Please select a date");
    return;
  }

  await addDoc(collection(db, "replacements"), {
    teacherId,
    date,
    durationMinutes: duration,
    createdAt: new Date(),
    approved: false
  });

  alert("Replacement submitted");
};

// INIT
loadProfile();
loadClasses();
