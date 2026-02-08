window.openMenu = function () {
  document.getElementById("sideMenu").style.right = "0";
  document.getElementById("overlay").style.opacity = "1";
  document.getElementById("overlay").style.pointerEvents = "auto";
};

window.closeMenu = function () {
  document.getElementById("sideMenu").style.right = "-300px";
  document.getElementById("overlay").style.opacity = "0";
  document.getElementById("overlay").style.pointerEvents = "none";
};

const backBtn = document.getElementById("backBtn");

if (backBtn) {
  backBtn.addEventListener("click", () => {
    history.back();
  });
}

// ___________________________________________________________________


import { auth, db } from "./firebase.js";
import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("reportForm");
const statusList = document.getElementById("statusList");

if (!form || !statusList) {
  console.error("❌ ไม่พบ element");
}

// ===============================
// ตรวจสอบ Login
// ===============================
onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  console.log("✅ Login:", user.uid);
  listenReports(user.uid);
});

// ===============================
// ส่งข้อมูล
// ===============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) return;

  try {
        await addDoc(collection(db, "reports"), {
          title: title.value,
          category: category.value,
          detail: detail.value,
          status: "รอดำเนินการ",

          userId: user.uid,
          userEmail: user.email, // ✅ เพิ่มบรรทัดนี้

          createdAt: serverTimestamp()
        });


    alert("✅ ส่งเรื่องเรียบร้อย");
    form.reset();

  } catch (err) {
    console.error(err);
    alert("❌ ส่งไม่สำเร็จ");
  }
});

// ===============================
// Real-time Listener
// ===============================
function listenReports(uid) {
  const q = query(
    collection(db, "reports"),
    where("userId", "==", uid)
  );

  onSnapshot(q, (snapshot) => {
    statusList.innerHTML = "";

    snapshot.forEach((doc) => {
      const d = doc.data();

   statusList.innerHTML += `
  <div class="status-item">
    <h4>${d.title}</h4>
    <p><b>ประเภท:</b> ${d.category}</p>
    <p><b>สถานะ:</b> ${d.status}</p>

    ${
      d.reply
        ? `<div class="reply-box">
             <b>📣 การตอบกลับจากผู้ดูแล</b>
             <p>${d.reply}</p>
           </div>`
        : `<p class="waiting">⏳ รอการตอบกลับจากผู้ดูแล</p>`
    }
  </div>
`;

    });

    console.log("📡 โหลดข้อมูลแล้ว", snapshot.size);
  });

}
