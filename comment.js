import { auth, db } from "./firebase.js";
import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// DOM
const commentForm = document.getElementById("commentForm");
const commentList = document.getElementById("commentList");
const commentText = document.getElementById("commentText");

const ACTIVITY_ID = "science-day-2026";

// ตรวจ login
onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  listenComments();
});

// ✅ ส่งคอมเมนต์
commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = commentText.value.trim();
  if (!text) return;

  try {
    await addDoc(collection(db, "comments"), {
      text: text,
      userName: auth.currentUser.displayName || "ผู้ใช้",
      userId: auth.currentUser.uid,
      activityId: ACTIVITY_ID,
      createdAt: serverTimestamp()
    });

    commentForm.reset();
  } catch (err) {
    console.error(err);
    alert("❌ ส่งคอมเมนต์ไม่สำเร็จ");
  }
});

// ✅ ดึงคอมเมนต์
function listenComments() {
  const q = query(
    collection(db, "comments"),
    orderBy("createdAt", "asc")
  );

  onSnapshot(q, (snapshot) => {
    commentList.innerHTML = "";

    snapshot.forEach((doc) => {
      const d = doc.data();

      if (d.activityId !== ACTIVITY_ID) return;

      const timeText = d.createdAt
        ? d.createdAt.toDate().toLocaleString("th-TH")
        : "เมื่อสักครู่";

      commentList.innerHTML += `
        <div class="comment-item">
          <h4>${d.userName}</h4>
          <p>${d.text}</p>
          <small>${timeText}</small>
        </div>
      `;
    });
  });
}
