import { db } from "./firebase.js";
import {
  collection, query, where, getDocs,
  updateDoc, doc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const snap = await getDocs(
  query(collection(db,"replacementSessions"), where("status","==","pending"))
);

snap.forEach(d => {
  const r = d.data();
  replacements.innerHTML += `
    <div class="bg-white p-4 shadow rounded">
      ${r.date} – ${r.durationMinutes} min – ${r.mode}
      <button onclick="approve('${d.id}')" class="bg-green-600 text-white px-2 py-1 rounded ml-2">Approve</button>
    </div>
  `;
});

window.approve = async id => {
  await updateDoc(doc(db,"replacementSessions",id),{ status:"approved" });
  location.reload();
};

window.exportCSV = async () => {
  let csv = "Teacher,Date,Minutes\n";
  const snap = await getDocs(collection(db,"replacementSessions"));

  snap.forEach(d => {
    const r = d.data();
    if (r.status === "approved") {
      csv += `${r.replacementTeacherId},${r.date},${r.durationMinutes}\n`;
    }
  });

  const blob = new Blob([csv], { type:"text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "payroll.csv";
  a.click();
};
