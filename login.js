import { auth, db } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const provider = new GoogleAuthProvider();
const googleBtn = document.getElementById("googleLogin");

googleBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    // ถ้า login ครั้งแรก → สร้าง user
    if (!snap.exists()) {
      await setDoc(userRef, {
        name: user.displayName || "ไม่มีชื่อ",
        email: user.email,
        role: "user",
        createdAt: serverTimestamp()
      });

      location.href = "dashboard.html";
      return;
    }

    const data = snap.data();

    // 🔥 เช็ค role
    if (data.role === "admin") {
      location.href = "admin/admin.html";
    } else {
      location.href = "dashboard.html";
    }

  } catch (err) {
    console.error(err);
    alert("❌ เข้าสู่ระบบไม่สำเร็จ");
  }
});
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