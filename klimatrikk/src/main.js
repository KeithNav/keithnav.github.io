import 'photoswipe/style.css'

// =====================================================
// KlímaTrikk – közös JavaScript
// =====================================================

// ── Fejléc árnyék görgetéskor ──
const header = document.getElementById('site-header')
if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

// ── Hamburger menü (mobil) ──
const hamburger = document.getElementById('hamburger')
const mainNav   = document.getElementById('main-nav')
const navLinks  = mainNav ? Array.from(mainNav.querySelectorAll('a')) : []

const normalizePath = path => {
  if (!path) return '/'

  const cleaned = path.replace(/index\.html$/i, '').replace(/\/+/g, '/').replace(/\\/g, '/')
  if (cleaned === '' || cleaned === '/') return '/'
  return cleaned.endsWith('/') ? cleaned : `${cleaned}/`
}

const currentPagePath = normalizePath(window.location.pathname)
const isHomePage = currentPagePath === '/'

const normalizeHref = href => {
  if (!href) return href
  if (href.startsWith('#')) return href

  try {
    const url = new URL(href, window.location.origin)
    return normalizePath(url.pathname)
  } catch {
    return href
  }
}

const setActiveNavLink = targetHref => {
  if (!navLinks.length) return

  const normalizedTarget = normalizeHref(targetHref)

  navLinks.forEach(link => {
    const isActive = normalizeHref(link.getAttribute('href')) === normalizedTarget
    link.classList.toggle('active', isActive)

    if (isActive) {
      link.setAttribute('aria-current', normalizedTarget.startsWith('#') ? 'location' : 'page')
    } else {
      link.removeAttribute('aria-current')
    }
  })
}

if (navLinks.length) {
  const initialTarget = isHomePage && window.location.hash ? window.location.hash : currentPagePath
  setActiveNavLink(initialTarget)
}

const getScrollTargetTop = target => {
  const headerOffset = header ? header.offsetHeight : 0
  const extraOffset = 18
  return Math.max(0, window.scrollY + target.getBoundingClientRect().top - headerOffset - extraOffset)
}

const isSamePageHomeLink = href => {
  if (!href) return false
  return normalizeHref(href) === '/'
}

if (hamburger && mainNav) {
  let touchToggleHandled = false

  const closeMenu = () => {
    mainNav.classList.remove('open')
    hamburger.classList.remove('open')
    hamburger.setAttribute('aria-expanded', 'false')
    hamburger.setAttribute('aria-label', 'Menü megnyitása')
  }

  const toggleMenu = () => {
    const isOpen = mainNav.classList.toggle('open')
    hamburger.classList.toggle('open', isOpen)
    hamburger.setAttribute('aria-expanded', String(isOpen))
    hamburger.setAttribute('aria-label', isOpen ? 'Menü bezárása' : 'Menü megnyitása')
  }

  hamburger.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse') return

    event.preventDefault()
    touchToggleHandled = true
    toggleMenu()
  })

  hamburger.addEventListener('click', () => {
    if (touchToggleHandled) {
      touchToggleHandled = false
      return
    }

    toggleMenu()
  })

  document.addEventListener('pointerdown', event => {
    if (!mainNav.classList.contains('open')) return

    const target = event.target
    if (!(target instanceof Node)) return
    if (mainNav.contains(target) || hamburger.contains(target)) return

    closeMenu()
  })

  // Navigációs linkre kattintáskor zárd be a menüt
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu()
    })
  })
}

document.querySelectorAll('a[href]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href')

    if (!isSamePageHomeLink(href)) return
    if (!isHomePage) return

    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (mainNav && mainNav.contains(anchor)) {
      setActiveNavLink('/')
    }

    history.replaceState(null, '', '/')
  })
})

// ── Smooth scroll az anchor (#) linkeknek ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href')
    const id = href.slice(1)
    const target = document.getElementById(id)

    if (target) {
      e.preventDefault()
      window.scrollTo({
        top: getScrollTargetTop(target),
        behavior: 'smooth',
      })

      if (mainNav && mainNav.contains(anchor)) {
        setActiveNavLink(href)
      }

      history.replaceState(null, '', href)
    }
  })
})

if (isHomePage) {
  window.addEventListener('hashchange', () => {
    setActiveNavLink(window.location.hash || '/')
  })
}

const initializeGallerySkeletons = () => {
  const galleryImages = Array.from(document.querySelectorAll('.bento-card img'))
  if (!galleryImages.length) return

  const markLoaded = image => {
    const card = image.closest('.bento-card')
    if (!card) return

    card.classList.add('is-loaded')
  }

  galleryImages.forEach(image => {
    const card = image.closest('.bento-card')
    if (!card) return

    if (image.complete && image.naturalWidth > 0) {
      markLoaded(image)
      return
    }

    image.addEventListener('load', () => {
      markLoaded(image)
    }, { once: true })

    image.addEventListener('error', () => {
      markLoaded(image)
    }, { once: true })
  })
}

initializeGallerySkeletons()

const initializeGalleryLightbox = async () => {
  const galleryElement = document.querySelector('.pswp-gallery')
  if (!galleryElement) return

  const { default: PhotoSwipeLightbox } = await import('photoswipe/lightbox')

  const lightbox = new PhotoSwipeLightbox({
    gallery: '.pswp-gallery',
    children: 'a[data-pswp-width]',
    pswpModule: () => import('photoswipe'),
    showHideAnimationType: 'zoom',
    bgOpacity: 0.9,
  })

  lightbox.init()
}

initializeGalleryLightbox()

const escapeHtml = value => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const getServiceCategory = name => {
  const normalized = (name ?? '').toLowerCase()

  if (normalized.includes('felmérés')) return 'Felmérés'
  if (normalized.includes('tisztítása')) return 'Tisztítás'
  if (normalized.includes('leszerelése')) return 'Leszerelés'
  if (normalized.includes('előcsövez')) return 'Előcsövezés'
  if (normalized.includes('tetőre')) return 'Tetőre telepítés'
  if (normalized.includes('telepítése') || normalized.includes('beüzemelése') || normalized.includes('szerelése')) return 'Telepítés'

  return 'Szolgáltatás'
}

const getServiceBadge = (price, index) => {
  const normalized = (price ?? '').toLowerCase()

  if (normalized.includes('ingyenes')) return 'Díjmentes'
  if (normalized.includes('/méter')) return 'Méretarányos'
  if (index === 0) return 'Kiemelt'

  return 'Tájékoztató ár'
}

const getServiceMeta = (service, category) => {
  const details = [category]
  const normalizedName = (service.name ?? '').toLowerCase()
  const normalizedPrice = (service.price ?? '').toLowerCase()

  if (normalizedPrice.includes('/méter')) details.push('méter alapú díjazás')
  if (normalizedName.includes('3,5kw')) details.push('3,5 kW-ig')
  if (normalizedName.includes('5kw felett')) details.push('5 kW felett')
  if (normalizedName.includes('tetőre')) details.push('speciális kivitelezés')

  return details.slice(0, 3)
}

const createPricingCardMarkup = (service, index) => {
  const category = getServiceCategory(service.name)
  const badge = getServiceBadge(service.price, index)
  const meta = getServiceMeta(service, category)
  const cardClasses = ['service-card']

  if (index === 0) cardClasses.push('is-featured')
  if ((service.price ?? '').toLowerCase().includes('ingyenes')) cardClasses.push('is-free')

  return `
    <article class="${cardClasses.join(' ')}">
      <div class="service-card-top">
        <span class="service-category">${escapeHtml(category)}</span>
        <span class="service-badge">${escapeHtml(badge)}</span>
      </div>
      <h3 class="service-title">${escapeHtml(service.name ?? '')}</h3>
      <p class="service-price">${escapeHtml(service.price ?? '')}</p>
      <p class="service-description">${escapeHtml(service.description ?? '')}</p>
      <div class="service-meta">
        ${meta.map(item => `<span class="service-meta-chip">${escapeHtml(item)}</span>`).join('')}
      </div>
    </article>
  `
}

const initializePricingPage = async () => {
  const pricingList = document.querySelector('[data-pricing-list]')
  if (!pricingList) return

  try {
    const response = await fetch('/arlista/arlista.json', {
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Price list request failed with status ${response.status}`)
    }

    const data = await response.json()
    const services = Array.isArray(data?.arlista) ? data.arlista : []

    if (!services.length) {
      pricingList.innerHTML = `
        <div class="pricing-empty">
          <h3>Az árlista jelenleg nem elérhető</h3>
          <p>Kérlek, nézz vissza később, vagy kérj közvetlenül ajánlatot a kapcsolat oldalon.</p>
        </div>
      `
      return
    }

    pricingList.innerHTML = services.map(createPricingCardMarkup).join('')
  } catch (error) {
    console.error('Unable to render pricing list:', error)
    pricingList.innerHTML = `
      <div class="pricing-empty">
        <h3>Nem sikerült betölteni az árlistát</h3>
        <p>Az oldal jelenleg nem tudta kiolvasni a szolgáltatási adatokat. Kérj ajánlatot, és küldünk pontos tájékoztatást.</p>
      </div>
    `
  }
}

initializePricingPage()

const counterSection = document.querySelector('[data-counter-section]')

if (counterSection) {
  const counters = Array.from(counterSection.querySelectorAll('[data-counter]'))
  let hasAnimatedCounters = false

  const formatCounterValue = (value, suffix = '') => `${value}${suffix}`

  const animateCounter = element => {
    const targetValue = Number.parseInt(element.dataset.target ?? '0', 10)
    const suffix = element.dataset.suffix ?? ''
    const duration = 2800
    const startTime = performance.now()

    const updateValue = currentTime => {
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.round(targetValue * easedProgress)

      element.textContent = formatCounterValue(currentValue, suffix)

      if (progress < 1) {
        window.requestAnimationFrame(updateValue)
      } else {
        element.textContent = formatCounterValue(targetValue, suffix)
      }
    }

    element.textContent = formatCounterValue(0, suffix)
    window.requestAnimationFrame(updateValue)
  }

  const startCounters = () => {
    if (hasAnimatedCounters) return

    hasAnimatedCounters = true
    counters.forEach(animateCounter)
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return

        startCounters()
        counterObserver.disconnect()
      })
    }, {
      threshold: 0.35,
    })

    counterObserver.observe(counterSection)
  } else {
    startCounters()
  }
}

document.querySelectorAll('[data-print-page]').forEach(button => {
  button.addEventListener('click', () => {
    window.print()
  })
})

let backToTopButton = document.querySelector('.back-to-top')

if (!backToTopButton) {
  backToTopButton = document.createElement('button')
  backToTopButton.type = 'button'
  backToTopButton.className = 'back-to-top'
  backToTopButton.setAttribute('aria-label', 'Vissza az oldal tetejére')
  backToTopButton.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 19V5" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `
  document.body.appendChild(backToTopButton)
}

if (backToTopButton) {
  const updateBackToTopVisibility = () => {
    backToTopButton.classList.toggle('is-visible', window.scrollY > 280)
  }

  backToTopButton.addEventListener('click', () => {
    backToTopButton.blur()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  window.addEventListener('scroll', updateBackToTopVisibility, { passive: true })
  updateBackToTopVisibility()
}
