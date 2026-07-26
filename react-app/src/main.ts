import './style.css';
import darkEletkertLogo from './logojofeher.webp';
import lightEletkertLogo from './logojo_decreased.webp';

// ─── Smooth scroll without hash in URL ───────────────────────────────────────
function initSmoothScroll(): void {
  const navH = parseInt(getComputedStyle(document.documentElement)
    .getPropertyValue('--nav-h')) || 68;

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
      // Keep URL clean – no hash added
    });
  });
}

// ─── Navbar: add .scrolled class on scroll ───────────────────────────────────
function initNavbar(): void {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ─── Theme switcher ──────────────────────────────────────────────────────────
type Theme = 'dark' | 'light';

let currentTheme: Theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

function applyTheme(theme: Theme): void {
  currentTheme = theme;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);

  const eletkertLogo = document.getElementById('eletkert-logo') as HTMLImageElement | null;
  if (eletkertLogo) eletkertLogo.src = theme === 'dark' ? darkEletkertLogo : lightEletkertLogo;

  const isDark = theme === 'dark';
  ['theme-toggle', 'theme-toggle-mobile'].forEach(id => {
    const button = document.getElementById(id);
    if (!button) return;
    button.classList.toggle('is-light', !isDark);
    button.setAttribute('aria-checked', String(isDark));
    button.setAttribute('aria-label', isDark ? 'Világos mód bekapcsolása' : 'Sötét mód bekapcsolása');
  });
}

function initTheme(): void {
  ['theme-toggle', 'theme-toggle-mobile'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  });
  applyTheme(currentTheme);
}

// ─── Mobile hamburger menu ────────────────────────────────────────────────────
function initMobileMenu(): void {
  const hamburger = document.getElementById('hamburger') as HTMLButtonElement | null;
  const menu      = document.getElementById('nav-menu');
  if (!hamburger || !menu) return;

  const toggle = (open: boolean) => {
    hamburger.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  };

  hamburger.addEventListener('click', () => toggle(!menu.classList.contains('open')));

  // Close on link click
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => toggle(false))
  );

  // Close on outside click
  const navEl = document.getElementById('navbar');
  document.addEventListener('click', (e) => {
    if (!navEl?.contains(e.target as Node)) toggle(false);
  });
}

// ─── Active nav link on scroll ───────────────────────────────────────────────
function initActiveNav(): void {
  const sections  = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
  const navLinks  = document.querySelectorAll<HTMLAnchorElement>('#nav-menu a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
}

// ─── Translations ─────────────────────────────────────────────────────────────
type Lang = 'hu' | 'en';

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  hu: {
    'nav.about': 'Rólam', 'nav.experience': 'Tapasztalat', 'nav.projects': 'Projektek',
    'nav.skills': 'Képességek', 'nav.education': 'Tanulmányok', 'nav.contact': 'Kapcsolat',
    'hero.eyebrow': '// Üdvözöllek a CV oldalamon',
    'hero.sub': 'Logisztikus, IT infrastruktúra üzemeltető – proaktív, folyamatosan fejlődő szakember Győrből.',
    'hero.cta.primary': 'Nézd meg a projektjeimet', 'hero.cta.ghost': 'Kapcsolatfelvétel',
    'stat.years': 'Év tapasztalat', 'stat.competitions': 'IT verseny', 'stat.projects': 'Élő webprojekt',
    'about.tag': '// rólam', 'about.title': 'Ki is vagyok?',
    'about.badge': '● Aktívan keresek lehetőségeket',
    'about.p1': 'A technológia és annak újdonságai iránti érdeklődésem határozza meg a mindennapjaimat – ezeket napi szinten követem különböző szakmai fórumokon. Már diákéveim óta foglalkozom számítógépek és informatikai rendszerek építésével, javításával.',
    'about.p2': 'Az utóbbi időben elmélyedtem a mesterséges intelligencia, különösen a nagy nyelvi modellek (LLM-ek) világában. Rendszeresen tesztelek különböző AI-alapú eszközöket, és kísérletezem azok gyakorlati alkalmazásával – automatizált tartalomgenerálástól adatelemzésen át technikai dokumentációk gyors előállításáig.',
    'about.p3': 'Jelenlegi munkám mellett közösségi szakértőként vagyok jelen az <strong>Audi Hungaria Data &amp; AI Community</strong> csoportban, ahol háziversenyt rendeztem, és AI technológiáról publikálok rendszeresen.',
    'about.location': 'Győr, Magyarország',
    'exp.tag': '// karrier', 'exp.title': 'Szakmai tapasztalat',
    'exp.job1.title': 'Logisztikai koordinátor',
    'exp.job1.company': 'Audi Hungária – Előszérialogisztika és Változásmenedzsment G/PL-3',
    'exp.job1.date': '2018. május – jelenleg',
    'exp.job1.li1': 'Just-In-Time gyártásszervezési és készletgazdálkodási stratégia alkalmazása',
    'exp.job1.li2': 'SAP vállalatirányítási rendszer – anyagmozgások és készletnyilvántartás kezelése',
    'exp.job1.li3': 'Közvetlen 30 fős raktári csapat irányítása és ellenőrzése',
    'exp.job1.li4': 'Key User feladatok – hibás SAP tranzakciók elhárítása és kezelése',
    'exp.job1.li5': 'Fejlesztési javaslatok megfogalmazása és megvalósítása',
    'exp.job1.li6': 'Vevői auditokra való felkészülés, KPI mutatók nyomonkövetése',
    'exp.job1.tag.logistics': 'Logisztika',
    'exp.job2.title': 'Műszakvezető',
    'exp.job2.company': 'Syncreon Automotive Kft. – Audi Hungária G/PL-4',
    'exp.job2.date': '2016. dec – 2018. máj',
    'exp.job2.li1': 'Raktározási és anyagkezelési folyamatok üzembiztos működésének biztosítása',
    'exp.job2.li2': '30 fős raktári csapat közvetlen irányítása és teljesítményének ellenőrzése',
    'exp.job2.li3': 'Raktárkészlet pontosságának fenntartása a vonatkozó szabályzatok szerint',
    'exp.job2.li4': 'SAP raktárnyilvántartási rendszer naprakész és precíz kezelése',
    'exp.job2.tag.lead': 'Csapatvezetés', 'exp.job2.tag.warehouse': 'Raktárlogisztika',
    'exp.job3.title': 'Ipari IT Technikus',
    'exp.job3.company': 'T-Systems Magyarország Zrt. – Audi Hungária G/FP-3',
    'exp.job3.date': '2015. aug – 2016. dec',
    'exp.job3.li1': 'Ipari informatikai szolgáltatások, 24/7 készenléti hibajavítás és ügyeleti támogatás',
    'exp.job3.li2': 'Gyártósorok hardveres és szoftveres támogatása, rövid válaszidővel',
    'exp.job3.li3': 'Új IT eszközök üzembe helyezése, konfigurálása és rendszerbe integrálása',
    'exp.job3.li4': 'Active Directory (AD) tartománykezelő és Hyena adminisztrációs szoftver',
    'exp.job3.li5': 'Távoli kapcsolatkezelés Windows / Linux Server környezetben',
    'exp.job3.li6': 'Incidenskezelés Peregrine Ticketing rendszeren keresztül',
    'proj.tag': '// munkáim', 'proj.title': 'Projektek',
    'proj.elek.desc': 'Őstermelői weboldal fejlesztése és üzemeltetése egy helyi vállalkozó részére. Linux VPS-en futó teljes stack – frontend és backend LLM segítségével, senior mentor támogatásával.',
    'proj.klima.desc': 'Egyéni vállalkozás részére készített weboldal fejlesztése, üzemeltetése és arculati tervezése. Google Business integráció, SEO optimalizálás.',
    'proj.audi.desc': 'Közösségi szakértőként az Audi Hungaria Data & AI Community csoportban AI technológiát népszerűsítek, házi versenyt szerveztem és LLM-eket alkalmazó megoldásokat mutattam be.',
    'proj.portfolio.desc': 'Saját fejlesztésű portfólió oldal TypeScript és Vite alapokon, teljesen egyedi CSS dizájnnal. PWA-támogatás, SVG favicon, reszponzív navigáció és animált szekciók.',
    'skills.tag': '// tudás', 'skills.title': 'Képességek & Technológiák',
    'skills.web': '<span class="sk-icon">🌐</span>Webfejlesztés',
    'skills.infra': '<span class="sk-icon">🖥️</span>Infrastruktúra &amp; Szerverek',
    'skills.net': '<span class="sk-icon">🔌</span>Hálózatok',
    'skills.db': '<span class="sk-icon">🗄️</span>Adatbázisok &amp; Felhő',
    'skills.ai': '<span class="sk-icon">🤖</span>AI &amp; Automatizáció',
    'skills.enterprise': '<span class="sk-icon">📦</span>Vállalati rendszerek',
    'skills.ai.t3': 'Tartalomgenerálás', 'skills.ai.t4': 'Adatelemzés', 'skills.jit': 'JIT logisztika',
    'edu.tag': '// képzés', 'edu.title': 'Tanulmányok',
    'edu.item1.title': 'IT Rendszer és Alkalmazás Üzemeltető Technikus',
    'edu.item1.school': 'Jedlik Ányos Gépipari és Informatikai Technikum',
    'edu.item1.date': '2025 szeptember – jelenleg',
    'edu.item1.li1': 'Windows és Linux szerverek telepítése, üzemeltetése',
    'edu.item1.li2': 'Cisco Network Academy (CCNA) képzések',
    'edu.item1.li3': 'Adatbázis-kezelés (MySQL, PostgreSQL)',
    'edu.item1.li4': 'Felhőszolgáltatások és virtualizáció (VMware, VirtualBox)',
    'edu.item2.title': 'Emelőgépkezelői és Darukezelői OKJ', 'edu.item2.school': 'Mondo-Libro Felnőttképzés',
    'edu.item3.title': 'Logisztikai Mérnöki (befejezetlen)', 'edu.item3.school': 'Széchenyi István Egyetem',
    'edu.item4.title': 'Érettségi – Közgazdasági és Informatikai',
    'edu.item4.school': 'Deák Ferenc Közgazdasági és Informatikai Szakközépiskola',
    'edu.item4.li1': 'Közgazdasági szakmai tantárgyak (üzleti gazdaságtan, közgazdaságtan, statisztika, adózás)',
    'edu.item4.li2': 'Informatikai szakmai tantárgyak (informatika, programozási alapismeretek, taniroda)',
    'certs.title': 'Cisco Tanúsítványok',
    'certs.hint': 'A badge-re kattintva megnézheted Credly-n a tanúsítványom hitelességét 😊',
    'comp.tag': '// versenyek', 'comp.title': 'Országos IT Megmérettetés',
    'comp.sub': 'Helyezések az Országos IT Megmérettetés versenysorozaton',
    'comp.mobile.ios': 'Mobilfejlesztés iOS', 'comp.network': 'Hálózati ismeretek',
    'comp.mobile.android': 'Mobilfejlesztés Android', 'comp.infra': 'Infrastruktúra automatizáció',
    'comp.frontend1': 'FrontEnd', 'comp.accessible': 'Akadálymentes weboldalak',
    'comp.frontend2': 'Frontend', 'comp.itsec': 'IT Biztonság', 'comp.llm': 'Nagy Nyelvi Modellek',
    'contact.tag': '// kapcsolat', 'contact.title': 'Lépjünk kapcsolatba!',
    'contact.sub': 'Nyitott vagyok új lehetőségekre, projektekre és szakmai együttműködésekre.',
    'contact.phone': 'Telefon', 'footer.copy': '© 2026 Sarmon Bence. Minden jog fenntartva.',
    'contact.form.name': 'Név', 'contact.form.email': 'Email', 'contact.form.subject': 'Tárgy',
    'contact.form.message': 'Üzenet', 'contact.form.submit': 'Üzenet küldése',
    'contact.form.sending': 'Küldés folyamatban...',
    'contact.form.captcha': 'Kérlek, igazold, hogy nem robot vagy.',
    'contact.form.success': 'Köszönöm, az üzenet sikeresen elküldve.',
    'contact.form.error': 'Az üzenet küldése nem sikerült. Kérlek, próbáld újra.',
    'cookie.text': 'Az oldal statisztikai célból cookie-kat használ. <a href="#">Bővebben</a>',
    'cookie.btn': 'Elfogadom',
  },
  en: {
    'nav.about': 'About', 'nav.experience': 'Experience', 'nav.projects': 'Projects',
    'nav.skills': 'Skills', 'nav.education': 'Education', 'nav.contact': 'Contact',
    'hero.eyebrow': '// Welcome to my CV page',
    'hero.sub': 'Logistics coordinator, IT infrastructure specialist – proactive, continuously developing professional from Győr.',
    'hero.cta.primary': 'View my projects', 'hero.cta.ghost': 'Get in touch',
    'stat.years': 'Years of experience', 'stat.competitions': 'IT competitions', 'stat.projects': 'Live web projects',
    'about.tag': '// about me', 'about.title': 'Who am I?',
    'about.badge': '● Actively seeking opportunities',
    'about.p1': 'My interest in technology and its latest developments shapes my everyday life – I follow these daily across various professional forums. Ever since my student years, I have been building and repairing computers and IT systems.',
    'about.p2': 'Recently, I have been diving deep into artificial intelligence, especially the world of large language models (LLMs). I regularly test various AI-based tools and experiment with their practical applications – from automated content generation to data analysis and rapid technical documentation.',
    'about.p3': 'Alongside my current job, I am active as a community expert in the <strong>Audi Hungaria Data &amp; AI Community</strong> group, where I organized an in-house competition and regularly publish content about AI technology.',
    'about.location': 'Győr, Hungary',
    'exp.tag': '// career', 'exp.title': 'Professional Experience',
    'exp.job1.title': 'Logistics Coordinator',
    'exp.job1.company': 'Audi Hungária – Pre-series Logistics & Change Management G/PL-3',
    'exp.job1.date': 'May 2018 – present',
    'exp.job1.li1': 'Applying Just-In-Time production planning and inventory management strategies',
    'exp.job1.li2': 'SAP ERP system – managing material movements and inventory records',
    'exp.job1.li3': 'Direct supervision and management of a 30-person warehouse team',
    'exp.job1.li4': 'Key User tasks – troubleshooting and resolving faulty SAP transactions',
    'exp.job1.li5': 'Formulating and implementing process improvement proposals',
    'exp.job1.li6': 'Preparing for customer audits and tracking KPI metrics',
    'exp.job1.tag.logistics': 'Logistics',
    'exp.job2.title': 'Shift Manager',
    'exp.job2.company': 'Syncreon Automotive Ltd. – Audi Hungária G/PL-4',
    'exp.job2.date': 'Dec 2016 – May 2018',
    'exp.job2.li1': 'Ensuring reliable operation of warehousing and material handling processes',
    'exp.job2.li2': 'Direct management and performance monitoring of a 30-person warehouse team',
    'exp.job2.li3': 'Maintaining inventory accuracy in accordance with relevant regulations',
    'exp.job2.li4': 'Up-to-date and precise management of the SAP warehouse system',
    'exp.job2.tag.lead': 'Team Leadership', 'exp.job2.tag.warehouse': 'Warehouse Logistics',
    'exp.job3.title': 'Industrial IT Technician',
    'exp.job3.company': 'T-Systems Hungary Ltd. – Audi Hungária G/FP-3',
    'exp.job3.date': 'Aug 2015 – Dec 2016',
    'exp.job3.li1': 'Industrial IT services, 24/7 on-call fault repair and support',
    'exp.job3.li2': 'Hardware and software support for production lines with rapid response times',
    'exp.job3.li3': 'Installation, configuration and system integration of new IT equipment',
    'exp.job3.li4': 'Active Directory (AD) domain management and Hyena administration software',
    'exp.job3.li5': 'Remote connection management in Windows / Linux Server environments',
    'exp.job3.li6': 'Incident management via Peregrine Ticketing system',
    'proj.tag': '// my work', 'proj.title': 'Projects',
    'proj.elek.desc': 'Website development and operation for a local producer. Full stack running on a Linux VPS – frontend and backend with LLM assistance and senior mentor support.',
    'proj.klima.desc': 'Website development, operation, and brand design for a sole proprietor. Google Business integration, SEO optimization.',
    'proj.audi.desc': 'As a community expert in the Audi Hungaria Data & AI Community group, I promote AI technology, organized an in-house competition, and demonstrated LLM-based solutions.',
    'proj.portfolio.desc': 'Self-developed portfolio website built on TypeScript and Vite with fully custom CSS design. PWA support, SVG favicon, responsive navigation, and animated sections.',
    'skills.tag': '// knowledge', 'skills.title': 'Skills & Technologies',
    'skills.web': '<span class="sk-icon">🌐</span>Web Development',
    'skills.infra': '<span class="sk-icon">🖥️</span>Infrastructure &amp; Servers',
    'skills.net': '<span class="sk-icon">🔌</span>Networking',
    'skills.db': '<span class="sk-icon">🗄️</span>Databases &amp; Cloud',
    'skills.ai': '<span class="sk-icon">🤖</span>AI &amp; Automation',
    'skills.enterprise': '<span class="sk-icon">📦</span>Enterprise Systems',
    'skills.ai.t3': 'Content Generation', 'skills.ai.t4': 'Data Analysis', 'skills.jit': 'JIT Logistics',
    'edu.tag': '// education', 'edu.title': 'Education',
    'edu.item1.title': 'IT Systems and Application Operations Technician',
    'edu.item1.school': 'Jedlik Ányos School of Engineering and IT',
    'edu.item1.date': 'September 2025 – present',
    'edu.item1.li1': 'Installation and operation of Windows and Linux servers',
    'edu.item1.li2': 'Cisco Network Academy (CCNA) training courses',
    'edu.item1.li3': 'Database management (MySQL, PostgreSQL)',
    'edu.item1.li4': 'Cloud services and virtualization (VMware, VirtualBox)',
    'edu.item2.title': 'Crane and Hoist Operator Certification (OKJ)', 'edu.item2.school': 'Mondo-Libro Adult Education',
    'edu.item3.title': 'Logistics Engineering (incomplete)', 'edu.item3.school': 'Széchenyi István University',
    'edu.item4.title': 'Secondary School Diploma – Economics & IT',
    'edu.item4.school': 'Deák Ferenc School of Economics and IT',
    'edu.item4.li1': 'Economics subjects (business economics, macroeconomics, statistics, taxation)',
    'edu.item4.li2': 'IT subjects (computer science, programming fundamentals, practice office)',
    'certs.title': 'Cisco Certifications',
    'certs.hint': 'Click on a badge to verify the certificate on Credly 😊',
    'comp.tag': '// competitions', 'comp.title': 'National IT Competition',
    'comp.sub': 'Rankings in the National IT Competition series',
    'comp.mobile.ios': 'Mobile Development iOS', 'comp.network': 'Networking Knowledge',
    'comp.mobile.android': 'Mobile Development Android', 'comp.infra': 'Infrastructure Automation',
    'comp.frontend1': 'FrontEnd', 'comp.accessible': 'Accessible Websites',
    'comp.frontend2': 'Frontend', 'comp.itsec': 'IT Security', 'comp.llm': 'Large Language Models',
    'contact.tag': '// contact', 'contact.title': "Let's get in touch!",
    'contact.sub': "I'm open to new opportunities, projects, and professional collaborations.",
    'contact.phone': 'Phone', 'footer.copy': '© 2026 Sarmon Bence. All rights reserved.',
    'contact.form.name': 'Name', 'contact.form.email': 'Email', 'contact.form.subject': 'Subject',
    'contact.form.message': 'Message', 'contact.form.submit': 'Send message',
    'contact.form.sending': 'Sending message...',
    'contact.form.captcha': 'Please verify that you are not a robot.',
    'contact.form.success': 'Thank you, your message has been sent successfully.',
    'contact.form.error': 'Your message could not be sent. Please try again.',
    'cookie.text': 'This site uses cookies for analytics purposes. <a href="#">Learn more</a>',
    'cookie.btn': 'Accept',
  },
};

const ROLES: Record<Lang, string[]> = {
  hu: ['Logisztikus', 'IT Infrastruktúra Üzemeltető', 'Hálózati és Rendszeradminisztrátor', 'AI & LLM Enthusiast'],
  en: ['Logistics Coordinator', 'IT Infrastructure Specialist', 'Network & Systems Administrator', 'AI & LLM Enthusiast'],
};

function getLanguageFromPath(): Lang | null {
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const language = pathSegments[pathSegments.length - 1];
  return language === 'hu' || language === 'en' ? language : null;
}

let currentLang: Lang = getLanguageFromPath() || (localStorage.getItem('lang') as Lang) || 'hu';

// ─── Typing animation ────────────────────────────────────────────────────────
let typingTimer: ReturnType<typeof setTimeout> | null = null;

function runTyping(lang: Lang): void {
  const el = document.getElementById('typed-text');
  if (!el) return;
  if (typingTimer !== null) { clearTimeout(typingTimer); typingTimer = null; }
  el.textContent = '';

  const roles = ROLES[lang];
  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;

  const tick = () => {
    const current = roles[roleIdx];
    if (deleting) {
      el.textContent = current.slice(0, --charIdx);
    } else {
      el.textContent = current.slice(0, ++charIdx);
    }
    if (!deleting && charIdx === current.length) {
      typingTimer = setTimeout(() => { deleting = true; tick(); }, 2200);
      return;
    }
    if (deleting && charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
    typingTimer = setTimeout(tick, deleting ? 55 : 110);
  };
  tick();
}



// ─── Scroll-reveal (IntersectionObserver) ────────────────────────────────────
function initScrollReveal(): void {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);   // animate once
      }
    }),
    { threshold: 0.1 }
  );

  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
}

function initContentOrder(): void {
  const about = document.getElementById('rolam');
  const projects = document.getElementById('projektek');
  const skills = document.getElementById('kepessegek');
  const experience = document.getElementById('tapasztalat');
  const education = document.getElementById('oktatas');
  const competitions = document.getElementById('versenyek');
  const certificates = education?.querySelector('.certs-wrap');

  if (!about || !projects || !skills || !experience || !education || !competitions || !certificates) return;

  const certificateSection = document.createElement('section');
  certificateSection.className = 'section section-alt';
  certificateSection.id = 'tanusitvanyok';
  const container = document.createElement('div');
  container.className = 'container';
  certificateSection.append(container);
  container.append(certificates);

  about.after(projects);
  projects.after(skills);
  skills.after(experience);
  experience.after(certificateSection);
  certificateSection.after(competitions);
  competitions.after(education);
}

// ─── Cookie banner ───────────────────────────────────────────────────────────
function initCookieBanner(): void {
  const banner    = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  if (!banner || !acceptBtn) return;

  if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => banner.classList.add('show'), 1800);
  }

  acceptBtn.addEventListener('click', () => {
    banner.classList.remove('show');
    localStorage.setItem('cookiesAccepted', 'true');
  });
}

// ─── Video crossfade loop ─────────────────────────────────────────────────────
// Two identical video elements are stacked; each crossfades into the other
// before the playing one reaches its end, eliminating the visible jump.
function initVideoLoop(): void {
  const videos = Array.from(
    document.querySelectorAll<HTMLVideoElement>('.hero-video')
  );
  if (videos.length < 2) return;

  const FADE_S   = 1.4;   // must match CSS transition duration (seconds)
  const BEFORE_S = 1.6;   // how many seconds before end to start crossfade

  // Ensure both videos are loaded enough to measure duration
  const setup = () => {
    videos[0].style.opacity = '1';
    videos[1].style.opacity = '0';
    videos[0].play().catch(() => {/* autoplay blocked */});
    listenForCrossfade(0, 1);
  };

  const listenForCrossfade = (from: number, to: number) => {
    const vFrom = videos[from];
    const vTo   = videos[to];
    let triggered = false;

    const onTimeUpdate = () => {
      if (triggered) return;
      const remaining = vFrom.duration - vFrom.currentTime;
      if (isNaN(remaining) || remaining > BEFORE_S) return;

      triggered = true;
      vFrom.removeEventListener('timeupdate', onTimeUpdate);

      // Start the standby video slightly before the crossfade
      vTo.currentTime = 0;
      vTo.play().catch(() => {});

      // Crossfade: fade in standby, fade out active
      vTo.style.opacity   = '1';
      vFrom.style.opacity = '0';

      // After fade completes, pause & reset the old one, set up next crossfade
      setTimeout(() => {
        vFrom.pause();
        vFrom.currentTime = 0;
        listenForCrossfade(to, from);
      }, (FADE_S + 0.2) * 1000);
    };

    vFrom.addEventListener('timeupdate', onTimeUpdate);
  };

  // Wait for metadata so .duration is available
  if (videos[0].readyState >= 1) {
    setup();
  } else {
    videos[0].addEventListener('loadedmetadata', setup, { once: true });
  }
}


// ─── Scroll to top button ─────────────────────────────────────────────────────
function initScrollTop(): void {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── Language Switcher ────────────────────────────────────────────────────────
function applyLanguage(lang: Lang): void {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  const languagePath = `/${lang}`;
  if (window.location.pathname !== languagePath) {
    window.history.replaceState(null, '', `${languagePath}${window.location.search}${window.location.hash}`);
  }

  // Sync all toggle instances (main hero + mobile nav)
  ['lang-toggle', 'lang-toggle-mobile'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.classList.toggle('lang-en', lang === 'en');
      btn.setAttribute('aria-checked', String(lang === 'en'));
    }
  });
  ['lang-hu-label', 'lang-hu-label-mobile'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('lang-active', lang === 'hu');
  });
  ['lang-en-label', 'lang-en-label-mobile'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('lang-active', lang === 'en');
  });

  const languageLabels = lang === 'hu'
    ? { hu: 'Magyar', en: 'Angol' }
    : { hu: 'Hungarian', en: 'English' };
  ['lang-hu-label', 'lang-hu-label-mobile'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = languageLabels.hu;
  });
  ['lang-en-label', 'lang-en-label-mobile'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = languageLabels.en;
  });

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')!;
    const val = TRANSLATIONS[lang][key];
    if (val !== undefined) el.textContent = val;
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html')!;
    const val = TRANSLATIONS[lang][key];
    if (val !== undefined) el.innerHTML = val;
  });

  const hamburger = document.getElementById('hamburger');
  if (hamburger) hamburger.setAttribute('aria-label', lang === 'hu' ? 'Menü megnyitása' : 'Open menu');

  const scrollTop = document.getElementById('scroll-top');
  if (scrollTop) scrollTop.setAttribute('aria-label', lang === 'hu' ? 'Vissza a tetejére' : 'Back to top');

  const scrollDown = document.querySelector<HTMLElement>('.scroll-down');
  if (scrollDown) scrollDown.setAttribute('aria-label', lang === 'hu' ? 'Görgets le' : 'Scroll down');

  runTyping(lang);
}

function initLanguage(): void {
  ['lang-toggle', 'lang-toggle-mobile'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', () => applyLanguage(currentLang === 'hu' ? 'en' : 'hu'));
  });
  applyLanguage(currentLang);
}

// ─── Contact form (Web3Forms) ───────────────────────────────────────────────
function initContactForm(): void {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  const submitButton = document.getElementById('contact-submit') as HTMLButtonElement | null;
  const status = document.getElementById('contact-form-status');
  if (!form || !submitButton || !status) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const captchaResponse = form.querySelector<HTMLTextAreaElement>('[name="h-captcha-response"]');
    if (!captchaResponse?.value) {
      status.className = 'contact-form-status error';
      status.textContent = TRANSLATIONS[currentLang]['contact.form.captcha'];
      return;
    }

    submitButton.disabled = true;
    status.className = 'contact-form-status';
    status.textContent = TRANSLATIONS[currentLang]['contact.form.sending'];

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(form),
      });
      const data: { success?: boolean } = await response.json();

      if (!data.success) throw new Error('Web3Forms submission failed');

      form.reset();
      status.classList.add('success');
      status.textContent = TRANSLATIONS[currentLang]['contact.form.success'];
    } catch {
      status.classList.add('error');
      status.textContent = TRANSLATIONS[currentLang]['contact.form.error'];
    } finally {
      submitButton.disabled = false;
    }
  });
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initContentOrder();
  initSmoothScroll();
  initTheme();
  initNavbar();
  initMobileMenu();
  initActiveNav();
  initScrollReveal();
  initCookieBanner();
  initLanguage();
  initContactForm();
  initVideoLoop();
  initScrollTop();
});

