// Gallery functionality - Using PhotoSwipe and Strapi API
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

// Strapi API configuration
const API_BASE_URL = import.meta.env.VITE_API || 'http://localhost:1337';
const API_TOKEN = 'Bearer cf90cc6bdb5494a9040ca41a8994397ef25e1e4b378f049ffee99ca78776f88573cd6cb4d49c9b8a1d870bac80cdcffca02cff15ef246fab1260ec3ca2b2104b9ad37e6d7ebd3b7cf5e7723870ff65417e3797adc2791917b5350627c255779a75e79c6310b9488294a613f8e2e7cadd8f218f408db105b94c4b25bc570478fd';

// Initialize PhotoSwipe for gallery
let galleryLightbox;

function initializePhotoSwipe() {
    if (galleryLightbox) {
        galleryLightbox.destroy();
    }
    
    galleryLightbox = new PhotoSwipeLightbox({
        gallery: '#gallery-photoswipe',
        children: 'a',
        showHideAnimationType: 'zoom',
        showAnimationDuration: 250,
        hideAnimationDuration: 250,
        pswpModule: () => import('photoswipe')
    });
    galleryLightbox.init();
}

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeFloatingBackButton();
    loadGalleryImages();
});

// Load images from Strapi API
async function loadGalleryImages() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const galleryGrid = document.getElementById('gallery-photoswipe');
    const retryBtn = document.getElementById('retry-btn');

    // Show loading state
    loadingState.style.display = 'block';
    errorState.style.display = 'none';
    galleryGrid.style.display = 'none';

    try {
        console.log('Fetching images from:', `${API_BASE_URL}/api/picture?populate=*`);
        
        const response = await fetch(`${API_BASE_URL}/api/picture?populate=*`, {
            headers: {
                'Authorization': API_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API response data:', data);
        
        // Handle single type response with kep array
        if (data.data && data.data.kep && data.data.kep.length > 0) {
            displayImages(data.data.kep);
        } else {
            // If no images found, show a message
            showNoImagesMessage();
        }

    } catch (error) {
        console.error('Error loading gallery images:', error);
        
        // For development: show a helpful message if API is not available
        if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
            showError('A Strapi szerver nem elérhető. Kérjük, győződjön meg róla, hogy a backend fut és elérhető.');
        } else if (error.message.includes('401') || error.message.includes('403')) {
            showError('Hitelesítési hiba. Kérjük, ellenőrizze az API kulcsot.');
        } else {
            showError(`Hiba történt: ${error.message}`);
        }
    }

    // Retry functionality (remove previous listener to avoid duplicates)
    retryBtn.removeEventListener('click', loadGalleryImages);
    retryBtn.addEventListener('click', loadGalleryImages);
}

function showNoImagesMessage() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const errorMessage = errorState.querySelector('p');
    
    if (errorMessage) {
        errorMessage.textContent = 'Jelenleg nincsenek feltöltött képek a galériában.';
    }
    
    // Hide retry button for this case
    const retryBtn = document.getElementById('retry-btn');
    retryBtn.style.display = 'none';
    
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
}

function displayImages(pictures) {
    const loadingState = document.getElementById('loading-state');
    const galleryGrid = document.getElementById('gallery-photoswipe');
    
    // Clear previous content
    galleryGrid.innerHTML = '';
    
    console.log('Processing pictures:', pictures);
    
    pictures.forEach((picture, index) => {
        console.log(`Processing picture ${index}:`, picture);
        
        // Handle the new structure where pictures are directly in the array
        if (picture.url) {
            const imageUrl = `${API_BASE_URL}${picture.url}`;
            const thumbnailUrl = picture.formats?.medium?.url 
                ? `${API_BASE_URL}${picture.formats.medium.url}`
                : (picture.formats?.small?.url 
                    ? `${API_BASE_URL}${picture.formats.small.url}`
                    : imageUrl);
            
            const altText = picture.name || picture.alternativeText || 'Életkert galéria kép';
            
            // Create gallery item
            const galleryItem = document.createElement('a');
            galleryItem.href = imageUrl;
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-pswp-width', picture.width || 800);
            galleryItem.setAttribute('data-pswp-height', picture.height || 600);
            galleryItem.setAttribute('data-cropped', 'true');
            
            const img = document.createElement('img');
            img.src = thumbnailUrl;
            img.alt = altText;
            img.loading = 'lazy';
            
            // Add error handling for individual images
            img.addEventListener('error', function() {
                console.log('Thumbnail failed, using original:', imageUrl);
                this.src = imageUrl; // Fallback to original if thumbnail fails
            });
            
            img.addEventListener('load', function() {
                console.log('Image loaded successfully:', this.src);
            });
            
            galleryItem.appendChild(img);
            galleryGrid.appendChild(galleryItem);
            
            console.log('Added gallery item:', galleryItem);
        } else {
            console.log('No URL found for picture:', picture);
        }
    });
    
    // Hide loading and show gallery
    loadingState.style.display = 'none';
    galleryGrid.style.display = 'grid';
    
    console.log('Gallery grid display set to grid, total items:', galleryGrid.children.length);
    
    // Initialize PhotoSwipe after images are loaded
    initializePhotoSwipe();
    
    // Animate gallery items
    animateGalleryItems();
}

function showError(message = 'Hiba történt a képek betöltése során') {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const errorMessage = errorState.querySelector('p');
    const retryBtn = document.getElementById('retry-btn');
    
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    
    // Show retry button for errors
    retryBtn.style.display = 'inline-block';
    
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
}

// Mobile menu functionality (from main site)
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

// Animate gallery items on scroll
function animateGalleryItems() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        galleryItems.forEach(item => {
            animationObserver.observe(item);
        });
    } else {
        // Fallback - show all items immediately
        galleryItems.forEach(item => {
            item.classList.add('animate-in');
        });
    }
}

// Initialize floating back button functionality
function initializeFloatingBackButton() {
    const backBtn = document.querySelector('.floating-back-btn');
    
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add a nice exit animation
            const galleryItems = document.querySelectorAll('.gallery-item');
            galleryItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transform = 'translateY(-30px)';
                    item.style.opacity = '0';
                }, index * 30);
            });
            
            // Navigate after animation
            setTimeout(() => {
                window.location.href = '/';
            }, galleryItems.length * 30 + 300);
        });
    }
}

// Smooth scroll functionality (from main site)
document.addEventListener("DOMContentLoaded", function() {
    // Smooth scroll for internal anchor links
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
});