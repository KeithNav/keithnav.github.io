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
const API_BASE_URL = import.meta.env.VITE_API
const API_TOKEN = import.meta.env.VITE_API_TOKEN;
// Global variable to store all recipes for filtering
let allReceptek = [];

// Format rich text ingredients from Strapi
function formatRichTextIngredients(text) {
    if (!text || typeof text !== 'string') {
        return '<p>Hozzávalók nem elérhetők.</p>';
    }
    
    // Split by lines and filter empty ones
    const lines = text.split('\n').filter(line => line.trim());
    
    let formattedHtml = '';
    let currentList = [];
    
    lines.forEach(line => {
        const trimmedLine = line.trim();
        
        // Check if line is a bold header (starts and ends with **)
        if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
            // If we have items in current list, output them first
            if (currentList.length > 0) {
                formattedHtml += '<ul>' + currentList.map(item => `<li>${item}</li>`).join('') + '</ul>';
                currentList = [];
            }
            
            // Extract header text without ** markers and add as header
            const headerText = trimmedLine.slice(2, -2);
            formattedHtml += `<h4 class="ingredients-header">${headerText}</h4>`;
        } else {
            // Regular ingredient item
            currentList.push(trimmedLine);
        }
    });
    
    // Output any remaining items
    if (currentList.length > 0) {
        formattedHtml += '<ul>' + currentList.map(item => `<li>${item}</li>`).join('') + '</ul>';
    }
    
    return formattedHtml;
}

// Check if a recipe is new (created within the last week)
function isNewRecipe(createdAt) {
    if (!createdAt) return false;
    
    const now = new Date();
    const recipeDate = new Date(createdAt);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return recipeDate > oneWeekAgo;
}

// Initialize receptek functionality
function initializeReceptek() {
    loadReceptek();
    initializeModal();
    initializeCategoryFilter();
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
        const response = await fetch(`${API_BASE_URL}/api/recepts?populate=*`, {
            headers: {
                'Authorization': API_TOKEN,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, text: ${errorText}`);
        }

        const data = await response.json();

        if (data.data && data.data.length > 0) {
            allReceptek = data.data; // Store all recipes for filtering
            displayReceptek(data.data);
            populateCategoryFilter(data.data); // Populate filter options
            updateResultCount(data.data.length, data.data.length); // Initialize result count
        } else {
            showError(`Nem találhatók receptek. Szerver válasz: ${data.data?.length || 0} elem`);
        }

    } catch (error) {
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
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const receptekGrid = document.getElementById('receptek-grid');

    loadingState.style.display = 'none';
    errorState.style.display = 'none';
    
    // If no recipes to display, hide the grid
    if (receptek.length === 0) {
        receptekGrid.style.display = 'none';
    } else {
        receptekGrid.style.display = 'grid';
    }

    receptekGrid.innerHTML = '';

    receptek.forEach((recept, index) => {
        const receptCard = createReceptCard(recept);
        receptekGrid.appendChild(receptCard);
    });
}

// Create individual recept card
function createReceptCard(recept) {
    const card = document.createElement('div');
    card.className = 'recept-card';
    card.setAttribute('data-recept', JSON.stringify(recept));

    // Get image URL
    let imageUrl = '/vegyes.jpg'; // fallback image
    
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

    // Check if this is a new recipe (within last week)
    const isNew = isNewRecipe(recept.createdAt);
    const newBadge = isNew ? '<span class="new-recipe-badge">ÚJ!</span>' : '';

    card.innerHTML = `
        ${newBadge}
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
    
    // Format ingredients with rich text support
    const ingredientsContainer = document.getElementById('modal-ingredients');
    if (recept.hozzavalok) {
        const formattedIngredients = formatRichTextIngredients(recept.hozzavalok);
        ingredientsContainer.innerHTML = formattedIngredients;
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

    // Display category
    const categoryContainer = document.getElementById('modal-category');
    if (recept.kategoria) {
        categoryContainer.innerHTML = `<span class="category-tag">Kategória: ${recept.kategoria}</span>`;
    } else {
        categoryContainer.innerHTML = '';
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

// Initialize category filter functionality
function initializeCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    const clearFiltersBtn = document.getElementById('clear-filters');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    if (searchInput) {
        // Add debouncing to search input for better performance
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                applyFilters();
            }, 300); // 300ms delay after user stops typing
        });
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            clearAllFilters();
        });
    }
}

// Populate category filter with dynamic options
function populateCategoryFilter(receptek) {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) return;
    
    // Get unique categories from recipes
    const categories = [...new Set(receptek.map(recept => recept.kategoria).filter(cat => cat))];
    
    // Clear existing options except "Összes kategória"
    const allOption = categoryFilter.querySelector('option[value=""]');
    categoryFilter.innerHTML = '';
    if (allOption) {
        categoryFilter.appendChild(allOption);
    } else {
        categoryFilter.innerHTML = '<option value="">Összes kategória</option>';
    }
    
    // Add dynamic category options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
}

// Apply all active filters (search + category)
function applyFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    
    const selectedCategory = categoryFilter ? categoryFilter.value : '';
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    
    let filteredReceptek = allReceptek;
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== '') {
        filteredReceptek = filteredReceptek.filter(recept => recept.kategoria === selectedCategory);
    }
    
    // Apply search filter
    if (searchTerm && searchTerm !== '') {
        filteredReceptek = filteredReceptek.filter(recept => {
            const receptName = (recept.nev || '').toLowerCase();
            return receptName.includes(searchTerm);
        });
    }
    
    // Display filtered recipes
    displayReceptek(filteredReceptek);
    
    // Show result count
    updateResultCount(filteredReceptek.length, allReceptek.length, searchTerm);
}

// Clear all filters
function clearAllFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    
    if (categoryFilter) categoryFilter.value = '';
    if (searchInput) searchInput.value = '';
    
    // Display all recipes
    displayReceptek(allReceptek);
    updateResultCount(allReceptek.length, allReceptek.length);
}

// Update result count display
function updateResultCount(filteredCount, totalCount, searchTerm = '') {
    const subtitleElement = document.querySelector('.receptek-subtitle');
    if (subtitleElement) {
        if (filteredCount === 0 && searchTerm && searchTerm.trim() !== '') {
            subtitleElement.textContent = 'Sajnálom, de a keresett kulcsszóra nincs receptünk.';
        } else if (filteredCount === totalCount) {
            subtitleElement.textContent = 'Fedezd fel ízletes receptjeinket, amelyek természetes alapanyagokból készülnek!';
        } else {
            subtitleElement.textContent = `${filteredCount} recept találat a ${totalCount} receptből`;
        }
    }
}

// Filter recipes by category (legacy function for compatibility)
function filterReceptekByCategory(selectedCategory) {
    applyFilters();
}
