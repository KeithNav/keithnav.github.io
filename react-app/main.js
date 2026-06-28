
  
  document.addEventListener("DOMContentLoaded", () => {
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");

    // Ha nincs elfogadva, jelenjen meg
    if (!localStorage.getItem("cookiesAccepted")) {
      banner.classList.remove("hidden");
      setTimeout(() => {
        banner.classList.add("show");
      }, 100); // Kis késleltetés az animációhoz
    }

    acceptBtn.addEventListener("click", () => {
      banner.classList.remove("show");
      banner.classList.add("hidden");
      localStorage.setItem("cookiesAccepted", "true");
    });
  });


const hamburger = document.querySelector('.hamburger');
const nav = document.getElementById('nav-menu');
const overlay = document.querySelector('.mobile-nav-overlay');

function toggleMenu() {
  hamburger.classList.toggle('open');
  nav.classList.toggle('open');
  overlay.classList.toggle('show');
}

hamburger.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Menü bezárás linkre kattintva
document.querySelectorAll('#nav-menu a').forEach(link =>
  link.addEventListener('click', toggleMenu)
);

