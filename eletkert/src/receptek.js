// Receptek page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu functionality
    initializeMobileMenu();
    
    // Initialize receptek functionality
    initializeReceptek();
    
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

// Strapi API configuration
const API_BASE_URL = 'http://localhost:1337';
const API_TOKEN = 'Bearer cf90cc6bdb5494a9040ca41a8994397ef25e1e4b378f049ffee99ca78776f88573cd6cb4d49c9b8a1d870bac80cdcffca02cff15ef246fab1260ec3ca2b2104b9ad37e6d7ebd3b7cf5e7723870ff65417e3797adc2791917b5350627c255779a75e79c6310b9488294a613f8e2e7cadd8f218f408db105b94c4b25bc570478fd';

// Initialize receptek functionality
function initializeReceptek() {
    loadReceptek();
    initializeModal();
}

// Load receptek from Strapi API
async function loadReceptek() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const receptekGrid = document.getElementById('receptek-grid');
    const retryBtn = document.getElementById('retry-btn');

    // Show loading state
    loadingState.style.display = 'flex';
    errorState.style.display = 'none';
    receptekGrid.style.display = 'none';

    try {
        console.log('Fetching receptek from:', `${API_BASE_URL}/api/recepts?populate=*`);
        console.log('Using token:', API_TOKEN.substring(0, 20) + '...');
        
        const response = await fetch(`${API_BASE_URL}/api/recepts?populate=*`, {
            headers: {
                'Authorization': API_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        console.log('Response received:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, text: ${errorText}`);
        }

        const data = await response.json();
        console.log('Receptek data received:', data);
        console.log('Data array length:', data.data?.length);
        console.log('First recept attributes:', data.data?.[0]?.attributes);
        console.log('Response status:', response.status);
        console.log('Meta info:', data.meta);

        if (data.data && data.data.length > 0) {
            console.log('Displaying receptek:', data.data.length, 'items');
            displayReceptek(data.data);
        } else {
            console.log('No receptek found, showing error');
            showError(`Nem találhatók receptek. Szerver válasz: ${data.data?.length || 0} elem`);
        }

    } catch (error) {
        console.error('Error loading receptek:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('A Strapi szerver nem elérhető. CORS hiba vagy hálózati probléma. Kérjük, ellenőrizze a backend beállításokat.');
        } else if (error.message.includes('403')) {
            showError('Authentication hiba. Ellenőrizze az API token-t és a Strapi permissions beállításokat.');
        } else {
            showError(`Hiba történt a receptek betöltése során: ${error.message}`);
        }
    }

    // Retry button functionality
    if (retryBtn) {
        retryBtn.onclick = () => loadReceptek();
    }
}

// Display receptek in grid
function displayReceptek(receptek) {
    console.log('displayReceptek called with:', receptek.length, 'items');
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const receptekGrid = document.getElementById('receptek-grid');

    console.log('Elements found:', {
        loadingState: !!loadingState,
        errorState: !!errorState, 
        receptekGrid: !!receptekGrid
    });

    loadingState.style.display = 'none';
    errorState.style.display = 'none';
    receptekGrid.style.display = 'grid';

    receptekGrid.innerHTML = '';

    receptek.forEach((recept, index) => {
        console.log(`Creating card ${index + 1}:`, recept);
        const receptCard = createReceptCard(recept);
        console.log('Created card:', receptCard);
        receptekGrid.appendChild(receptCard);
    });
    
    console.log('Grid after adding cards:', receptekGrid.children.length, 'children');
}

// Create individual recept card
function createReceptCard(recept) {
    console.log('createReceptCard called with:', recept);
    console.log('Recept nev:', recept.nev);
    console.log('Recept rovidid:', recept.rovid);
    
    const card = document.createElement('div');
    card.className = 'recept-card';
    card.setAttribute('data-recept', JSON.stringify(recept));

    // Get image URL
    let imageUrl = '/vegyes.jpg'; // fallback image
    console.log('Recept kep object:', recept.kep);
    
    if (recept.kep) {
        // Check if kep has url property directly
        if (recept.kep.url) {
            imageUrl = recept.kep.url.startsWith('http') 
                ? recept.kep.url 
                : `${API_BASE_URL}${recept.kep.url}`;
        }
        // Or check if it's in formats property
        else if (recept.kep.formats) {
            // Try thumbnail, small, medium, or original
            const format = recept.kep.formats.thumbnail || recept.kep.formats.small || recept.kep.formats.medium || recept.kep;
            if (format.url) {
                imageUrl = format.url.startsWith('http') 
                    ? format.url 
                    : `${API_BASE_URL}${format.url}`;
            }
        }
    }
    
    console.log('Using image URL:', imageUrl);
    console.log('Recept name:', recept.nev);
    console.log('Recept short desc:', recept.rovid);

    card.innerHTML = `
        <div class="recept-card-content">
            <div class="recept-image-container">
                <img src="${imageUrl}" 
                     alt="${recept.nev || 'Recept kép'}" 
                     class="recept-image"
                     onerror="this.src='/vegyes.jpg'">
            </div>
            <div class="recept-info">
                <h3 class="recept-name">${recept.nev || 'Névtelen recept'}</h3>
                <p class="recept-short-desc">${recept.rovid || 'Rövid leírás nem elérhető.'}</p>
            </div>
        </div>
    `;

    // Add click event to open modal
    card.addEventListener('click', () => {
        openReceptModal(recept);
    });

    return card;
}

// Show error message
function showError(message) {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const receptekGrid = document.getElementById('receptek-grid');

    loadingState.style.display = 'none';
    receptekGrid.style.display = 'none';
    errorState.style.display = 'flex';
    
    const errorText = errorState.querySelector('p');
    if (errorText) {
        errorText.textContent = message;
    }
}

// Initialize modal functionality
function initializeModal() {
    const modal = document.getElementById('recept-modal');
    const modalClose = modal.querySelector('.modal-close');
    const modalBackdrop = modal.querySelector('.modal-backdrop');

    // Close modal events
    modalClose?.addEventListener('click', closeReceptModal);
    modalBackdrop?.addEventListener('click', closeReceptModal);
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeReceptModal();
        }
    });
}

// Open recept modal
function openReceptModal(recept) {
    const modal = document.getElementById('recept-modal');
    
    // Get image URL
    let imageUrl = '/vegyes.jpg'; // fallback image
    console.log('Modal kep object:', recept.kep);
    
    if (recept.kep) {
        // Check if kep has url property directly
        if (recept.kep.url) {
            imageUrl = recept.kep.url.startsWith('http') 
                ? recept.kep.url 
                : `${API_BASE_URL}${recept.kep.url}`;
        }
        // Or check if it's in formats property
        else if (recept.kep.formats) {
            // Try thumbnail, small, medium, or original
            const format = recept.kep.formats.medium || recept.kep.formats.small || recept.kep.formats.thumbnail || recept.kep;
            if (format.url) {
                imageUrl = format.url.startsWith('http') 
                    ? format.url 
                    : `${API_BASE_URL}${format.url}`;
            }
        }
    }

    // Populate modal content
    document.getElementById('modal-image').src = imageUrl;
    document.getElementById('modal-image').alt = recept.nev || 'Recept kép';
    document.getElementById('modal-title').textContent = recept.nev || 'Névtelen recept';
    document.getElementById('modal-short-description').textContent = recept.rovidid || '';
    
    // Format ingredients
    const ingredientsContainer = document.getElementById('modal-ingredients');
    if (recept.hozzavalok) {
        // If ingredients is a string, split by lines or format as needed
        let ingredientsList;
        if (typeof recept.hozzavalok === 'string') {
            const ingredientsArray = recept.hozzavalok.split('\n').filter(item => item.trim());
            ingredientsList = `<ul>${ingredientsArray.map(ingredient => `<li>${ingredient.trim()}</li>`).join('')}</ul>`;
        } else {
            ingredientsList = `<p>${recept.hozzavalok}</p>`;
        }
        ingredientsContainer.innerHTML = ingredientsList;
    } else {
        ingredientsContainer.innerHTML = '<p>Hozzávalók nem elérhetők.</p>';
    }
    
    // Format description
    const descriptionContainer = document.getElementById('modal-description');
    if (recept.teljes) {
        // Convert line breaks to paragraphs
        const formattedDescription = recept.teljes
            .split('\n\n')
            .filter(p => p.trim())
            .map(p => `<p>${p.trim()}</p>`)
            .join('');
        descriptionContainer.innerHTML = formattedDescription || `<p>${recept.teljes}</p>`;
    } else {
        descriptionContainer.innerHTML = '<p>Részletes leírás nem elérhető.</p>';
    }

    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Trigger animation
    setTimeout(() => {
        modal.classList.add('open');
    }, 10);
}

// Close recept modal
function closeReceptModal() {
    const modal = document.getElementById('recept-modal');
    
    modal.classList.remove('open');
    document.body.style.overflow = '';
    
    // Hide modal after animation
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}
