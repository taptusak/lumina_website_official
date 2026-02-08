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

// _____________________________________________________________________

import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "index.html";
  } else {
 // ===== Desktop =====
const nameDesktop = document.getElementById("userNameDesktop");
const photoDesktop = document.getElementById("userPhotoDesktop");

if (nameDesktop) {
  nameDesktop.innerText = user.displayName || "ผู้ใช้";
}

if (photoDesktop) {
  photoDesktop.src = user.photoURL || "img/default-profile.png";
}

// ===== Mobile =====
const nameMobile = document.getElementById("userName");
const emailMobile = document.getElementById("userEmail");
const photoMobile = document.getElementById("userPhoto");

if (nameMobile) {
  nameMobile.innerText = user.displayName || "ผู้ใช้";
}

if (emailMobile) {
  emailMobile.innerText = user.email || "";
}

if (photoMobile) {
  photoMobile.src = user.photoURL || "img/default-profile.png";
}

  }
});

// ===== Logout =====
document.getElementById("logout")?.addEventListener("click", () => {
  signOut(auth);
});

// ===== Logout (Mobile) =====
const logoutMobile = document.getElementById("logoutMobile");

if (logoutMobile) {
  logoutMobile.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "index.html";
    });
  });
}
