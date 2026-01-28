import { auth, db } from "./firebase.js";
import {
  collection, query, where, getDocs,
  updateDoc, doc, addDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

auth.onAuthStateChanged(async user => {
  if (!user) return;

  const q = query(
    collection(db, "classSessions"),
    where("teacherId", "==", user.uid)
  );

  const snap = await getDocs(q);
  snap.forEach(d => {
    const s = d.data();
    sessions.innerHTML += `
      <div class="bg-white p-4 shadow rounded">
        <b>${s.date}</b> – ${s.courseTitle}
        <div class="mt-2">
          <button onclick="mark('${d.id}','taught')" class="bg-blue-500 text-white px-3 py-1 rounded">Taught</button>
          <button onclick="mark('${d.id}','leave')" class="bg-red-500 text-white px-3 py-1 rounded ml-2">Leave</button>
        </div>
      </div>
    `;
  });
});

window.mark = async (id, status) => {
  await updateDoc(doc(db,"classSessions",id),{
    status,
    confirmedAt: new Date()
  });
  alert("Saved");
};

window.submitReplacement = async () => {
  await addDoc(collection(db,"replacementSessions"),{
    replacementTeacherId: auth.currentUser.uid,
    date: repDate.value,
    durationMinutes: Number(repDuration.value),
    mode: repMode.value,
    status: "pending",
    submittedAt: new Date()
  });
  alert("Replacement submitted");
};
