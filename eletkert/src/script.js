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