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
  hamburger.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open')
    hamburger.classList.toggle('open', isOpen)
    hamburger.setAttribute('aria-expanded', String(isOpen))
    hamburger.setAttribute('aria-label', isOpen ? 'Menü bezárása' : 'Menü megnyitása')
  })

  // Navigációs linkre kattintáskor zárd be a menüt
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open')
      hamburger.classList.remove('open')
      hamburger.setAttribute('aria-expanded', 'false')
      hamburger.setAttribute('aria-label', 'Menü megnyitása')
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
