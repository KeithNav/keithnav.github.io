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

const setActiveNavLink = targetHref => {
  if (!navLinks.length) return

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === targetHref)
  })
}

const getScrollTargetTop = target => {
  const headerOffset = header ? header.offsetHeight : 0
  const extraOffset = 18
  return Math.max(0, window.scrollY + target.getBoundingClientRect().top - headerOffset - extraOffset)
}

const isSamePageHomeLink = href => {
  if (!href) return false

  const normalized = href.replace(/^\.\//, '')
  return normalized === 'index.html' || normalized === '/index.html' || normalized === '/'
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

    const currentPath = window.location.pathname.replace(/\\/g, '/').replace(/.*\//, '') || 'index.html'
    if (currentPath !== 'index.html') return

    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (mainNav && mainNav.contains(anchor)) {
      setActiveNavLink('index.html')
    }

    history.replaceState(null, '', 'index.html')
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

if (navLinks.length) {
  const sectionMap = [
    { id: 'szolgaltatasok', href: '#szolgaltatasok' },
    { id: 'kapcsolat', href: '#kapcsolat' },
  ]
    .map(item => ({ ...item, element: document.getElementById(item.id) }))
    .filter(item => item.element)

  const updateActiveNavOnScroll = () => {
    const headerOffset = header ? header.offsetHeight : 0
    const triggerLine = headerOffset + 40

    let activeHref = 'index.html'

    for (const section of sectionMap) {
      const rect = section.element.getBoundingClientRect()
      if (rect.top <= triggerLine && rect.bottom > triggerLine) {
        activeHref = section.href
      }
    }

    setActiveNavLink(activeHref)
  }

  window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true })
  updateActiveNavOnScroll()
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
