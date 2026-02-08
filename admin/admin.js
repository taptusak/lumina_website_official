import { auth, db } from "../firebase.js";
import { onAuthStateChanged, signOut }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { checkAdmin } from "./admin-check.js";

// =======================
// DOM
// =======================
const reportList = document.getElementById("reportList");
const commentList = document.getElementById("commentList");
const ideaList = document.getElementById("ideaList");
const logoutBtn = document.getElementById("logoutBtn");

// =======================
// 🔐 ตรวจสิทธิ์ Admin
// =======================
onAuthStateChanged(auth, async (user) => {
  if (!user || !(await checkAdmin())) {
    alert("⛔ คุณไม่มีสิทธิ์เข้าหน้านี้");
    location.href = "../login.html";
    return;
  }

  loadReports();
  loadComments();
  loadIdeas(); // ✅ สำคัญมาก
});

// =======================
// 📌 Reports
// =======================
function loadReports() {
  onSnapshot(collection(db, "reports"), (snap) => {
    reportList.innerHTML = "";

    if (snap.empty) {
      reportList.innerHTML = "<p>ยังไม่มีแจ้งปัญหา</p>";
      return;
    }

    snap.forEach((docSnap) => {
      const d = docSnap.data();

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h4>${d.title || "-"}</h4>
        <p><b>ผู้แจ้ง:</b> ${d.userEmail || "-"}</p>
        <p><b>ประเภท:</b> ${d.category || "-"}</p>
        <p>${d.detail || "-"}</p>

        <label>สถานะ</label>
        <select>
          <option>รอดำเนินการ</option>
          <option>กำลังแก้ไข</option>
          <option>เสร็จแล้ว</option>
        </select>

        <label>ตอบกลับ</label>
        <textarea>${d.reply || ""}</textarea>

        <div class="actions">
          <button class="primary">💾 บันทึก</button>
          <button class="danger">🗑 ลบ</button>
        </div>
      `;

      const select = card.querySelector("select");
      select.value = d.status || "รอดำเนินการ";

      card.querySelector(".primary").onclick = async () => {
        await updateDoc(doc(db, "reports", docSnap.id), {
          status: select.value,
          reply: card.querySelector("textarea").value,
          updatedAt: serverTimestamp()
        });
        alert("✅ บันทึกแล้ว");
      };

      card.querySelector(".danger").onclick = async () => {
        if (!confirm("ลบแจ้งปัญหานี้?")) return;
        await deleteDoc(doc(db, "reports", docSnap.id));
      };

      reportList.appendChild(card);
    });
  });
}

// =======================
// 💬 Comments
// =======================
function loadComments() {
  const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));

  onSnapshot(q, (snap) => {
    commentList.innerHTML = "";

    if (snap.empty) {
      commentList.innerHTML = "<p>ยังไม่มีคอมเมนต์</p>";
      return;
    }

    snap.forEach((docSnap) => {
      const d = docSnap.data();

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <p><b>${d.userName || "ผู้ใช้"}</b></p>
        <p>${d.text || "-"}</p>
        <small>${d.createdAt?.toDate().toLocaleString() || ""}</small>
        <button class="danger">ลบ</button>
      `;

      card.querySelector("button").onclick = async () => {
        if (!confirm("ลบคอมเมนต์นี้?")) return;
        await deleteDoc(doc(db, "comments", docSnap.id));
      };

      commentList.appendChild(card);
    });
  });
}

// =======================
// 💡 Ideas (Admin)
// =======================
function loadIdeas() {
  const q = query(collection(db, "ideas"), orderBy("createdAt", "desc"));

  onSnapshot(q, (snap) => {
    ideaList.innerHTML = "";

    if (snap.empty) {
      ideaList.innerHTML = "<p>ยังไม่มีไอเดีย</p>";
      return;
    }

    snap.forEach((docSnap) => {
      const d = docSnap.data();

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h4>${d.title || "-"}</h4>
        <p>${d.detail || "-"}</p>
        <small>
          โดย ${d.userName || "ผู้ใช้"} · 
          ${d.createdAt?.toDate().toLocaleString() || ""}
        </small>

        <div class="actions">
          <button class="danger">🗑 ลบ</button>
        </div>
      `;

      card.querySelector(".danger").onclick = async () => {
        if (!confirm("ลบไอเดียนี้?")) return;
        await deleteDoc(doc(db, "ideas", docSnap.id));
      };

      ideaList.appendChild(card);
    });
  });
}

// =======================
// 🚪 Logout
// =======================
logoutBtn.onclick = async () => {
  await signOut(auth);
  location.href = "../login.html";
};

// =======================
// 📂 สลับหน้า
// =======================
const buttons = document.querySelectorAll(".sidebar button[data-page]");
const sections = document.querySelectorAll("main section");

buttons.forEach(btn => {
  btn.onclick = () => {
    sections.forEach(sec => sec.classList.remove("active"));
    document.getElementById(btn.dataset.page).classList.add("active");
  };
});

const feedbackAdminList = document.getElementById("feedbackAdminList");

function loadFeedbacks() {
  const q = query(
    collection(db, "feedbacks"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snap) => {
    feedbackAdminList.innerHTML = "";

    if (snap.empty) {
      feedbackAdminList.innerHTML = "<p>ยังไม่มี feedback</p>";
      return;
    }

    snap.forEach(docSnap => {
      const d = docSnap.data();

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h4>${d.title}</h4>
        <p>${d.detail}</p>
        <small>โดย ${d.userName}</small>

        <textarea placeholder="ตอบกลับ">${d.adminReply || ""}</textarea>

        <div class="actions">
          <button class="primary">💾 ตอบกลับ</button>
          <button class="danger">🗑 ลบ</button>
        </div>
      `;

      card.querySelector(".primary").onclick = async () => {
        await updateDoc(doc(db, "feedbacks", docSnap.id), {
          adminReply: card.querySelector("textarea").value,
          repliedAt: serverTimestamp()
        });
        alert("✅ ตอบกลับแล้ว");
      };

      card.querySelector(".danger").onclick = async () => {
        if (!confirm("ลบ feedback นี้?")) return;
        await deleteDoc(doc(db, "feedbacks", docSnap.id));
      };

      feedbackAdminList.appendChild(card);
    });
  });
}
onAuthStateChanged(auth, async (user) => {
  if (!user || !(await checkAdmin())) {
    alert("⛔ คุณไม่มีสิทธิ์เข้าหน้านี้");
    location.href = "../login.html";
    return;
  }

  loadReports();
  loadComments();
  loadIdeas();
  loadFeedbacks(); // ✅ เพิ่มบรรทัดนี้
});


