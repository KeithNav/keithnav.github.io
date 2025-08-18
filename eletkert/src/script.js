import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#my-gallery',
  children: 'a',
  pswpModule: () => import('photoswipe')
});
lightbox.init();





document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('nav a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 10,
                    behavior: 'smooth'
                });
            }
        });
    });

    const scrollBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 200) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    
    // Vegburger mobil menü
    const vegburger = document.querySelector('.vegburger');
    const nav = document.querySelector('header nav');
    vegburger.addEventListener('click', function() {
        nav.classList.toggle('open');
    });

    // Bezárás kattintásra a nav linkre mobilon
    nav.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            if(window.innerWidth <= 768) {
                nav.classList.remove('open');
            }
        });
    });
});


fetch("http://localhost:1337/api/piacoks", {
    method: "GET",
    headers: {
        "Authorization": "Bearer cf90cc6bdb5494a9040ca41a8994397ef25e1e4b378f049ffee99ca78776f88573cd6cb4d49c9b8a1d870bac80cdcffca02cff15ef246fab1260ec3ca2b2104b9ad37e6d7ebd3b7cf5e7723870ff65417e3797adc2791917b5350627c255779a75e79c6310b9488294a613f8e2e7cadd8f218f408db105b94c4b25bc570478fd"
    }
    // …
  }).then(res=>res.json()).then(res=>{
    console.log(res)

    const lista = document.querySelector(".piacok"); 
    lista.innerHTML = ""; // előző törlése, ha frissíted
    
    res.data.forEach(item => {
        // dátum formázás emberibbé
        const datum = new Date(item.date).toLocaleDateString("hu-HU", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });

        const li = document.createElement("li");
        li.textContent = `${item.city} – ${item.marketName} (${datum})`;
        lista.appendChild(li);
      });
    })
    .catch(err => console.error("Hiba történt:", err));
