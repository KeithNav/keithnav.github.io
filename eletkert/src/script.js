import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#my-gallery',
  children: 'a',
  showHideAnimationType: 'zoom',
  showAnimationDuration: 250,
  hideAnimationDuration: 250,
  pswpModule: () => import('photoswipe')
});
lightbox.init();

// Cookie Consent Management
const COOKIE_CONSENT_KEY = 'eletkert_youtube_consent';

function showCookieBanner() {
  const banner = document.getElementById('cookie-consent-banner');
  if (banner) {
    banner.style.display = 'block';
  }
}

function hideCookieBanner() {
  const banner = document.getElementById('cookie-consent-banner');
  if (banner) {
    banner.style.display = 'none';
  }
}

function setCookieConsent(accepted) {
  localStorage.setItem(COOKIE_CONSENT_KEY, accepted ? 'accepted' : 'declined');
  hideCookieBanner();
  
  if (accepted) {
    enableYouTubeVideos();
  } else {
    disableYouTubeVideos();
  }
}

function getCookieConsent() {
  return localStorage.getItem(COOKIE_CONSENT_KEY);
}

function enableYouTubeVideos() {
  // Enable YouTube videos by removing overlays and enabling interaction
  const videoContainers = document.querySelectorAll('.video-responsive-container');
  videoContainers.forEach(container => {
    const iframe = container.querySelector('iframe');
    const overlay = container.querySelector('.video-overlay');
    
    // Remove overlay if exists
    if (overlay) {
      overlay.remove();
    }
    
    // Ensure iframe is interactive
    if (iframe) {
      iframe.style.pointerEvents = 'auto';
    }
  });
}

function disableYouTubeVideos() {
  // Disable YouTube videos by adding click-blocking overlay
  const videoContainers = document.querySelectorAll('.video-responsive-container');
  videoContainers.forEach(container => {
    const iframe = container.querySelector('iframe');
    
    if (iframe && !container.querySelector('.video-overlay')) {
      // Add overlay to block interaction
      const overlay = document.createElement('div');
      overlay.className = 'video-overlay';
      overlay.innerHTML = `
        <div class="video-overlay-content">
          <div class="overlay-icon">🍪</div>
          <h4>YouTube videó</h4>
          <p>A videó megtekintéséhez el kell fogadnod a YouTube sütiket.</p>
          <button onclick="showCookieBanner()" class="overlay-button">
            Süti beállítások
          </button>
        </div>
      `;
      container.appendChild(overlay);
      
      // Disable iframe interaction
      iframe.style.pointerEvents = 'none';
    }
  });
}

// Initialize cookie consent on page load
document.addEventListener('DOMContentLoaded', function() {
  const consent = getCookieConsent();
  
  if (consent === null) {
    // First visit - show banner and disable video interaction
    showCookieBanner();
    disableYouTubeVideos();
  } else if (consent === 'accepted') {
    enableYouTubeVideos();
  } else {
    disableYouTubeVideos();
  }
  
  // Event listeners for cookie buttons
  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    setCookieConsent(true);
  });
  
  document.getElementById('cookie-decline')?.addEventListener('click', () => {
    setCookieConsent(false);
  });
});

// Make showCookieBanner globally available for placeholder buttons
window.showCookieBanner = showCookieBanner;





document.addEventListener("DOMContentLoaded", function() {
  // Smooth scroll: minden belső horgony linkre (nav + footer)
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const hash = this.getAttribute('href');
      const targetId = hash.slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.pageYOffset - 10;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // URL frissítése ugrás nélkül
      history.replaceState(null, '', hash);
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

  vegburger.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  // Bezárás kattintásra a mobil nav linkre
  mobileMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      if(window.innerWidth <= 768) closeMenu();
    });
  });

  // Ha visszanagyítunk desktopra, menü zárása és overlay eltüntetése
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
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
    
    // Dátum szerint növekvő sorrendbe rendezés
    const sortedData = res.data.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB; // növekvő sorrend (korábbi dátumok előbb)
    });
    
    // Tároljuk el a város koordinátákat a linkekhez
    const cityLinksData = {};
    
    sortedData.forEach(item => {
        // dátum formázás emberibbé
        const datum = new Date(item.date).toLocaleDateString("hu-HU", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });

        const li = document.createElement("li");
        
        // Város link létrehozása
        const cityLink = document.createElement("a");
        cityLink.href = "#";
        cityLink.textContent = item.city;
        
        // Hover effekt
        cityLink.addEventListener("mouseenter", () => {
          cityLink.style.textDecoration = "underline";
        });
        cityLink.addEventListener("mouseleave", () => {
          cityLink.style.textDecoration = "none";
        });
        
        // Tároljuk a város adatait későbbi használatra
        cityLinksData[item.city] = {
          coords: cityCoordinates[item.city] || null,
          needsGeocoding: !cityCoordinates[item.city]
        };

        li.appendChild(cityLink);
        
        // Utca hozzáadása, ha van
        const streetText = item.street ? `, ${item.street}` : '';
        li.appendChild(document.createTextNode(`${streetText} – ${item.marketName} (${datum})`));
        lista.appendChild(li);
      });

    // Kattintás események hozzáadása a city linkekhez
    Object.keys(cityLinksData).forEach(cityName => {
      const cityLink = [...lista.querySelectorAll('a')].find(link => link.textContent === cityName);
      if (cityLink) {
        cityLink.addEventListener('click', (e) => {
          e.preventDefault();
          
          const cityData = cityLinksData[cityName];
          if (cityData.coords) {
            // Ha van koordináta, zoomolunk rá nagyobb zoommal
            map.setView([cityData.coords.lat, cityData.coords.lon], 16);
            
            // Megnyitjuk a marker popup-ját
            if (window.cityMarkers && window.cityMarkers[cityName]) {
              const markers = window.cityMarkers[cityName];
              if (markers.length > 0) {
                // A marker koordinátáira zoomolunk, nem a város koordinátáira
                const marker = markers[0];
                const markerLatLng = marker.getLatLng();
                map.setView([markerLatLng.lat, markerLatLng.lng], 16);
                
                // Popup megnyitása rövidebb késleltetéssel
                setTimeout(() => {
                  marker.openPopup();
                }, 200); // Rövidebb késleltetés a jobb UX érdekében
              }
            }
          } else if (cityData.needsGeocoding) {
            // Ha nincs koordináta, geocodoljuk
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}, Hungary&limit=1`)
              .then(resp => resp.json())
              .then(data => {
                if (data && data.length > 0) {
                  const lat = parseFloat(data[0].lat);
                  const lon = parseFloat(data[0].lon);
                  
                  // Eltároljuk a koordinátát később használatra
                  cityLinksData[cityName].coords = { lat, lon };
                  cityLinksData[cityName].needsGeocoding = false;
                  
                  // Zoomolunk a városra nagyobb zoommal
                  map.setView([lat, lon], 16);
                  
                  // Popup megnyitása geocoding után is
                  if (window.cityMarkers && window.cityMarkers[cityName]) {
                    const markers = window.cityMarkers[cityName];
                    if (markers.length > 0) {
                      // A marker pontos koordinátáira zoomolunk
                      const marker = markers[0];
                      const markerLatLng = marker.getLatLng();
                      map.setView([markerLatLng.lat, markerLatLng.lng], 16);
                      
                      setTimeout(() => {
                        marker.openPopup();
                      }, 200);
                    }
                  }
                } else {
                  console.warn("Nem található:", cityName);
                }
              })
              .catch(err => console.error("Geocoding hiba:", err));
          }
        });
      }
    });
    })
    .catch(err => console.error("Hiba történt:", err));

    // Alap térkép beállítás
const map = L.map('map', {
  scrollWheelZoom: false,
  dragging: window.innerWidth > 900,
  tap: window.innerWidth > 900, 
  touchZoom: true
}).setView([47.4825, 17.6333], 8.5);

// Térkép alaphelyzet tárolása a reset gombhoz
const DEFAULT_MAP_VIEW = {
  center: [47.4825, 17.6333],
  zoom: 8.5
};

// Reset gomb eseménykezelő
document.getElementById('map-reset-btn').addEventListener('click', () => {
  map.setView(DEFAULT_MAP_VIEW.center, DEFAULT_MAP_VIEW.zoom);
  // Minden popup bezárása
  map.closePopup();
});
function updateMapTouch() {
  if (window.innerWidth <= 900) {
    map.dragging.disable();
    map.tap && map.tap.disable();
    map.scrollWheelZoom.disable();
    map.touchZoom.enable(); // csak pinch
  } else {
    map.dragging.enable();
    map.tap && map.tap.enable();
    map.scrollWheelZoom.disable();
    map.touchZoom.enable();
  }
}
window.addEventListener('resize', updateMapTouch);
updateMapTouch();

// Csak Ctrl/Meta nyomva tartásakor engedélyezzük a görgős zoomot
const enableWheel = () => map.scrollWheelZoom.enable();
const disableWheel = () => map.scrollWheelZoom.disable();

window.addEventListener('keydown', (e) => {
  if (e.key === 'Control' || e.key === 'Meta') enableWheel();
});
window.addEventListener('keyup', (e) => {
  if (e.key === 'Control' || e.key === 'Meta') disableWheel();
});
window.addEventListener('blur', disableWheel);
map.getContainer().addEventListener('mouseleave', disableWheel);

// OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Előre geocodolt magyar városok (gyors cache)
const cityCoordinates = {
  'Budapest': { lat: 47.4979, lon: 19.0402 },
  'Debrecen': { lat: 47.5316, lon: 21.6273 },
  'Szeged': { lat: 46.2530, lon: 20.1414 },
  'Miskolc': { lat: 48.1036, lon: 20.7784 },
  'Pécs': { lat: 46.0727, lon: 18.2329 },
  'Győr': { lat: 47.6875, lon: 17.6504 },
  'Nyíregyháza': { lat: 47.9565, lon: 21.7172 },
  'Kecskemét': { lat: 46.9069, lon: 19.6925 },
  'Székesfehérvár': { lat: 47.1903, lon: 18.4092 },
  'Szombathely': { lat: 47.2306, lon: 16.6218 },
  'Szolnok': { lat: 47.1817, lon: 20.1992 },
  'Tatabánya': { lat: 47.5692, lon: 18.3981 },
  'Kaposvár': { lat: 46.3661, lon: 17.7956 },
  'Érd': { lat: 47.3964, lon: 18.9195 },
  'Veszprém': { lat: 47.0930, lon: 17.9093 },
  'Békéscsaba': { lat: 46.6758, lon: 21.0951 },
  'Zalaegerszeg': { lat: 46.8456, lon: 16.8443 },
  'Sopron': { lat: 47.6850, lon: 16.5900 },
  'Eger': { lat: 47.9028, lon: 20.3707 },
  'Nagykanizsa': { lat: 46.4613, lon: 16.9902 },
  'Dunaszeg': { lat: 47.7517, lon: 17.4536 },
  'Kunsziget': { lat: 47.7712, lon: 17.4282 }
};

// Geocoding gyorsítótár (localStorage-ben tárolva)
const GEOCODE_CACHE_KEY = 'eletkert_geocode_cache';
const CACHE_EXPIRY_DAYS = 30; // 30 napig érvényes a cache

function getGeocodingCache() {
  try {
    const cached = localStorage.getItem(GEOCODE_CACHE_KEY);
    if (cached) {
      const data = JSON.parse(cached);
      const now = Date.now();
      // Ellenőrizzük, hogy nem járt-e le a cache
      if (data.expiry > now) {
        return data.cache || {};
      }
    }
  } catch (e) {
    console.warn('Cache olvasási hiba:', e);
  }
  return {};
}

function saveGeocodingCache(cache) {
  try {
    const expiry = Date.now() + (CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify({
      cache: cache,
      expiry: expiry
    }));
  } catch (e) {
    console.warn('Cache mentési hiba:', e);
  }
}

async function geocodeWithCache(searchQuery) {
  const cache = getGeocodingCache();
  
  // Ha már van cache-ben, azonnal visszaadjuk
  if (cache[searchQuery]) {
    return cache[searchQuery];
  }
  
  // Ha nincs cache-ben, geocodoljuk
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}, Hungary&limit=1`);
    const data = await response.json();
    
    const result = data && data.length > 0 ? 
      { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) } : null;
    
    // Mentjük a cache-be
    cache[searchQuery] = result;
    saveGeocodingCache(cache);
    
    return result;
  } catch (error) {
    console.warn('Geocoding hiba:', searchQuery, error);
    return null;
  }
}

// Piacok betöltése Strapi-ból
fetch("http://localhost:1337/api/piacoks", {
  method: "GET",
  headers: {
    "Authorization": "Bearer cf90cc6bdb5494a9040ca41a8994397ef25e1e4b378f049ffee99ca78776f88573cd6cb4d49c9b8a1d870bac80cdcffca02cff15ef246fab1260ec3ca2b2104b9ad37e6d7ebd3b7cf5e7723870ff65417e3797adc2791917b5350627c255779a75e79c6310b9488294a613f8e2e7cadd8f218f408db105b94c4b25bc570478fd"
  }
})
  .then(res => res.json())
  .then(async res => {
    // Dátum szerint növekvő sorrendbe rendezés a térképhez is
    const sortedData = res.data.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB; // növekvő sorrend (korábbi dátumok előbb)
    });
    
    // Marker referenciák tárolása városonként
    const cityMarkers = {};

    // Optimalizált geocoding - fokozatos marker megjelenítés
    // Először próbáljuk a cache-ből, majd aszinkron geocodoljuk a többit
    
    const processItem = async (item, index) => {
      const city = item.city;
      const street = item.street || '';
      const houseNumber = item.houseNumber || '';
      
      // Keresési lekérdezés felépítése
      let searchQuery = city;
      if (street) {
        searchQuery = `${street}, ${city}`;
        if (houseNumber) {
          searchQuery = `${street} ${houseNumber}, ${city}`;
        }
      }
      
      // Geocoding cache-szel
      let coords = await geocodeWithCache(searchQuery);
      
      // Fallback ha nem találta a pontos címet
      if (!coords && street) {
        coords = await geocodeWithCache(city);
      }
      
      // Ha van koordináta, rögtön hozzáadjuk a markert
      if (coords) {
        const formattedDate = new Date(item.date).toLocaleDateString("hu-HU");
        const marker = L.marker([coords.lat, coords.lon]).addTo(map);
        const streetInfo = street ? `<br>Utca: ${street}` : '';
        
        marker.bindPopup(`
          <strong>${item.marketName}</strong><br>
          Város: ${city}${streetInfo}<br>
          Dátum: ${formattedDate}
        `);
        
        // Tároljuk a markert a városhoz
        if (!cityMarkers[city]) {
          cityMarkers[city] = [];
        }
        cityMarkers[city].push(marker);
        
        console.log(`Marker hozzáadva: ${city} (${index + 1}/${sortedData.length})`);
      }
    };
    
    // Első körben a cache-ből azonnal hozzáadjuk a markereket
    const cachePromises = sortedData.map((item, index) => processItem(item, index));
    
    // Kis késleltetéssel dolgozzuk fel őket, hogy ne blokkoljuk a UI-t
    for (let i = 0; i < cachePromises.length; i += 3) {
      // 3-asával dolgozzuk fel párhuzamosan
      const batch = cachePromises.slice(i, i + 3);
      await Promise.all(batch);
      
      // Kis szünet a batch-ek között, hogy ne túlterheljük a nominatim API-t
      if (i + 3 < cachePromises.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Globális hozzáférés a marker referenciákhoz
    window.cityMarkers = cityMarkers;
  });

