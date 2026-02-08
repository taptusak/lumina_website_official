function openMenu() {
  document.getElementById("sideMenu").style.right = "0";
  document.getElementById("overlay").style.opacity = "1";
  document.getElementById("overlay").style.pointerEvents = "auto";
}

function closeMenu() {
  document.getElementById("sideMenu").style.right = "-300px";
  document.getElementById("overlay").style.opacity = "0";
  document.getElementById("overlay").style.pointerEvents = "none";
}
// ===== Scroll Reveal =====
const policies = document.querySelectorAll(".policy");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.2
  }
);

policies.forEach(policy => {
  observer.observe(policy);
});
