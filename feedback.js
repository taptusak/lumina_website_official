import { auth, db } from "./firebase.js";
import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// =======================
// DOM
// =======================
const feedbackForm = document.getElementById("feedbackForm");
const fbTitle = document.getElementById("fbTitle");
const fbDetail = document.getElementById("fbDetail");
const feedbackList = document.getElementById("feedbackList");

let currentUser = null;

// =======================
// 🔐 ตรวจ login
// =======================
onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  currentUser = user;
  loadMyFeedbacks();
});

// =======================
// 📨 ส่ง Feedback
// =======================
feedbackForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = fbTitle.value.trim();
  const detail = fbDetail.value.trim();

  if (!title || !detail) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  try {
    await addDoc(collection(db, "feedbacks"), {
      title,
      detail,
      userId: currentUser.uid,
      userName: currentUser.displayName || "ผู้ใช้",
      adminReply: "",
      createdAt: serverTimestamp(),
      createdAtClient: new Date()
    });

    feedbackForm.reset();
    alert("✅ ส่ง Feedback เรียบร้อย");

  } catch (err) {
    console.error("ADD ERROR:", err);
    alert("❌ ส่ง Feedback ไม่สำเร็จ");
  }
});

// =======================
// 📬 Feedback ของฉัน
// =======================
function loadMyFeedbacks() {

  const q = query(
    collection(db, "feedbacks"),
    where("userId", "==", currentUser.uid)
  );

  onSnapshot(q, (snap) => {
    console.log("จำนวน feedback:", snap.size);

    feedbackList.innerHTML = "";

    if (snap.empty) {
      feedbackList.innerHTML = "<p>ยังไม่มี feedback</p>";
      return;
    }

    snap.forEach(docSnap => {
      const d = docSnap.data();

      const div = document.createElement("div");
      div.className = "comment-item";

      div.innerHTML = `
        <h4>${d.title}</h4>
        <p>${d.detail}</p>
        ${
          d.adminReply
            ? `<p style="margin-top:8px;color:#2e7d32">
                 <b>แอดมินตอบ:</b> ${d.adminReply}
               </p>`
            : `<small style="color:#999">⏳ รอการตอบกลับ</small>`
        }
      `;

      feedbackList.appendChild(div);
    });
  });
}
