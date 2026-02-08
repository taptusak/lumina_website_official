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

// ___________________________________________________________________
  const primaryBtn = document.querySelector('.btn.primary');

  primaryBtn.addEventListener('mouseenter', () => {
    primaryBtn.style.setProperty('--shine', '1');
    primaryBtn.querySelector('::before');
  });

  primaryBtn.addEventListener('mouseleave', () => {
    primaryBtn.style.setProperty('--shine', '0');
  });

  primaryBtn.addEventListener('mouseenter', () => {
    primaryBtn.style.animation = 'none';
    primaryBtn.offsetHeight;
    primaryBtn.style.animation = '';
  });

  primaryBtn.addEventListener('mouseenter', () => {
    primaryBtn.style.setProperty('--start', '-120%');
    primaryBtn.style.setProperty('--end', '120%');
  });

  /* animate shimmer */
  primaryBtn.addEventListener('mouseenter', () => {
    primaryBtn.style.setProperty('--run', '1');
    primaryBtn.querySelector('::before');
  });

  primaryBtn.addEventListener('mouseenter', () => {
    primaryBtn.style.setProperty('--run', '1');
    primaryBtn.style.setProperty('--delay', '0s');
    primaryBtn.style.cssText += `
      --run:1;
    `;
  });

  primaryBtn.addEventListener('mouseenter', () => {
    primaryBtn.style.setProperty('--run', '1');
    primaryBtn.querySelector('::before');
  });

  /* simple shimmer animation */
  primaryBtn.addEventListener('mouseenter', () => {
    primaryBtn.style.setProperty('--animate', '1');
    primaryBtn.style.setProperty('--time', '0.6s');
    primaryBtn.style.setProperty('--ease', 'ease');
    primaryBtn.style.cssText += `
      animation: none;
    `;
  });

  primaryBtn.addEventListener('mouseenter', () => {
    primaryBtn.querySelector('::before');
  });

  primaryBtn.addEventListener('mouseenter', () => {
    primaryBtn.style.setProperty('--hover', '1');
    primaryBtn.style.cssText += `
      --hover:1;
    `;
  });

  /* actual shimmer run */
  primaryBtn.addEventListener('mouseenter', () => {
    primaryBtn.style.cssText += `
      --shimmer:1;
    `;
    primaryBtn.style.setProperty('--run', '1');
    primaryBtn.querySelector('::before');
    primaryBtn.style.cssText += `
      animation: none;
    `;
  });

  /* move shimmer */
  primaryBtn.addEventListener('mouseenter', () => {
    primaryBtn.querySelector('::before');
    primaryBtn.style.cssText += `
      --run:1;
    `;
  });

  primaryBtn.addEventListener('mouseenter', () => {
    primaryBtn.style.setProperty('--run', '1');
    primaryBtn.querySelector('::before');
    primaryBtn.style.cssText += `
      animation: none;
    `;
  });

  /* final shimmer */
  primaryBtn.addEventListener('mouseenter', () => {
    primaryBtn.querySelector('::before').style.transform = 'translateX(120%)';
    primaryBtn.querySelector('::before').style.transition = '0.6s';
  });

  primaryBtn.addEventListener('mouseleave', () => {
    primaryBtn.querySelector('::before').style.transform = 'translateX(-120%)';
    primaryBtn.querySelector('::before').style.transition = 'none';
  });

  // _____________________________________________________________________
let items = document.querySelectorAll('.policy-item');
let active = 1;

function loadPolicy(){

    // รีเซ็ตทุกการ์ด
    items.forEach(item => {
        item.style.transform = '';
        item.style.zIndex = '';
        item.style.opacity = '';
        item.style.filter = '';
        item.style.boxShadow = '';
        item.classList.remove('active'); // ❗ สำคัญ
    });

    // การ์ดที่ถูกเลือก
    items[active].style.transform = 'scale(1.15)';
    items[active].style.zIndex = 2;
    items[active].classList.add('active'); // ⭐ ทำให้เป็นสีทอง

    let step = 0;

    // ด้านขวา
    for(let i = active + 1; i < items.length; i++){
        step++;
        items[i].style.transform =
            `translateX(${140*step}px) scale(${1 - 0.15*step})`;
        items[i].style.opacity = step > 2 ? 0 : 0.5;
        items[i].style.zIndex = -step;
    }

    // ด้านซ้าย
    step = 0;
    for(let i = active - 1; i >= 0; i--){
        step++;
        items[i].style.transform =
            `translateX(${-140*step}px) scale(${1 - 0.15*step})`;
        items[i].style.opacity = step > 2 ? 0 : 0.5;
        items[i].style.zIndex = -step;
    }
}

document.getElementById('next').onclick = () => {
    active = Math.min(active + 1, items.length - 1);
    loadPolicy();
};

document.getElementById('prev').onclick = () => {
    active = Math.max(active - 1, 0);
    loadPolicy();
};

loadPolicy();

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


const counters = document.querySelectorAll(".stat-card h2");

const countObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.dataset.target;
        const isPercent = counter.textContent.includes("%");

        let current = 0;
        const increment = Math.ceil(target / 1000); // ความเร็ว

        const updateCount = () => {
          current += increment;
          if (current >= target) {
            counter.textContent = target + (isPercent ? "%" : "");
          } else {
            counter.textContent = current + (isPercent ? "%" : "");
            requestAnimationFrame(updateCount);
          }
        };

        updateCount();
        observer.unobserve(counter); // เล่นครั้งเดียว
      }
    });
  },
  {
    threshold: 0.4
  }
);

counters.forEach(counter => {
  countObserver.observe(counter);
});

