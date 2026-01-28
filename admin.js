import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc,
  doc, query, where
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { hashPassword } from "./utils.js";

let selectedTeacherId = null;

/* ======================
   CREATE TEACHER
====================== */
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
  loadTeachers();
};

/* ======================
   LOAD TEACHERS
====================== */
async function loadTeachers() {
  const q = query(
    collection(db, "users"),
    where("role", "==", "teacher")
  );

  const snap = await getDocs(q);
  const list = document.getElementById("teacherList");
  list.innerHTML = "";

  snap.forEach(d => {
    const t = d.data();
    list.innerHTML += `
      <div class="bg-white p-4 rounded shadow flex justify-between items-center">
        <div>
          <div class="font-semibold">${t.username}</div>
          <div class="text-sm ${t.active ? "text-green-600" : "text-red-600"}">
            ${t.active ? "Active" : "Disabled"}
          </div>
        </div>

        <div class="flex gap-2">
          <button onclick="openSlotModal('${d.id}')"
            class="bg-blue-600 text-white px-3 py-1 rounded">
            Edit
          </button>

          <button onclick="toggleTeacher('${d.id}', ${!t.active})"
            class="bg-yellow-500 text-white px-3 py-1 rounded">
            ${t.active ? "Disable" : "Enable"}
          </button>

          <button onclick="deleteTeacher('${d.id}')"
            class="bg-red-600 text-white px-3 py-1 rounded">
            Delete
          </button>
        </div>
      </div>
    `;
  });
}

loadTeachers();

/* ======================
   ENABLE / DISABLE
====================== */
window.toggleTeacher = async (id, active) => {
  await updateDoc(doc(db, "users", id), { active });
  loadTeachers();
};

/* ======================
   DELETE TEACHER
====================== */
window.deleteTeacher = async (id) => {
  if (!confirm("Delete this teacher?")) return;
  await deleteDoc(doc(db, "users", id));
  loadTeachers();
};

/* ======================
   SLOT ASSIGNMENT
====================== */
window.openSlotModal = (teacherId) => {
  selectedTeacherId = teacherId;
  slotModal.classList.remove("hidden");
  slotModal.classList.add("flex");
};

window.closeSlotModal = () => {
  slotModal.classList.add("hidden");
};

window.saveSlot = async () => {
  await addDoc(collection(db, "classSlots"), {
    teacherId: selectedTeacherId,
    course: slotCourse.value,
    day: slotDay.value,
    time: slotTime.value,
    mode: slotMode.value,
    active: true
  });

  closeSlotModal();
  alert("Class slot assigned");
};
