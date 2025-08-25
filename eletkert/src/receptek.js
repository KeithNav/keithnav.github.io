// Receptek page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu functionality
    initializeMobileMenu();
    
    // Smooth scroll functionality for anchor links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const hash = this.getAttribute('href');
            const targetId = hash.slice(1);
            const target = document.getElementById(targetId);
            if (!target) return;

            e.preventDefault();
            const y = target.getBoundingClientRect().top + window.pageYOffset - 10;
            window.scrollTo({ top: y, behavior: 'smooth' });

            // Update URL without jumping
            history.replaceState(null, '', hash);
        });
    });
    
    // Scroll to top button functionality
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
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
    }
});

// Mobile menu functionality - same as galeria.js
function initializeMobileMenu() {
    const vegburger = document.querySelector('.vegburger');
    const mobileMenu = document.querySelector('#mobile-menu');
    const backdrop = document.querySelector('.menu-backdrop');

    function openMenu() {
        mobileMenu.classList.add('open');
        vegburger.classList.add('open');
        vegburger.setAttribute('aria-expanded', 'true');
        backdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        mobileMenu.classList.remove('open');
        vegburger.classList.remove('open');
        vegburger.setAttribute('aria-expanded', 'false');
        backdrop.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    function toggleMenu() {
        if (mobileMenu.classList.contains('open')) closeMenu(); else openMenu();
    }

    if (vegburger && mobileMenu) {
        vegburger.addEventListener('click', toggleMenu);
        backdrop && backdrop.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

        // Close on mobile nav link click
        mobileMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                if(window.innerWidth <= 768) closeMenu();
            });
        });

        // Close menu on desktop resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }
}
