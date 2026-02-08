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

const teamSection = document.querySelector('.team-section');
const teamTrack = document.querySelector('.team-track');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      teamTrack.style.animationPlayState = 'running';
    }
  });
}, { threshold: 0.2 });

observer.observe(teamSection);
