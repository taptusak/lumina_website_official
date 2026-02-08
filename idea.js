import { auth, db } from "./firebase.js";
import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// DOM
const ideaForm = document.getElementById("ideaForm");
const ideaTitle = document.getElementById("ideaTitle");
const ideaDetail = document.getElementById("ideaDetail");

// ตรวจ login
onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "login.html";
  }
});

// ส่งไอเดีย
ideaForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    await addDoc(collection(db, "ideas"), {
      title: ideaTitle.value.trim(),
      detail: ideaDetail.value.trim(),
      userName: auth.currentUser.displayName || "ผู้ใช้",
      createdAt: serverTimestamp()
    });

    alert("✅ ส่งไอเดียเรียบร้อย ขอบคุณสำหรับความคิดเห็น!");
    ideaForm.reset();

  } catch (err) {
    console.error(err);
    alert("❌ ส่งไอเดียไม่สำเร็จ");
  }
});
