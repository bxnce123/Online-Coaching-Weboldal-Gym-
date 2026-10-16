/* Közös JavaScript – minden oldal betölti */
(() => {
  /* 1) Mobil hamburger menü */
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (btn && menu) {
    const setOpen = (open) => {
      menu.classList.toggle('hidden', !open);
      menu.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Menü bezárása' : 'Menü megnyitása');
      btn.firstElementChild.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    };
    btn.addEventListener('click', () => setOpen(menu.classList.contains('hidden')));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    document.addEventListener('click', e => {
      if (!menu.contains(e.target) && !btn.contains(e.target)) setOpen(false);
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', e => { if (e.matches) setOpen(false); });
  }

  /* 2) GYIK – accordion (egyszerre egy kérdés nyitott) */
  const faqButtons = document.querySelectorAll('.faq-btn');
  faqButtons.forEach(b => b.addEventListener('click', () => {
    const wasOpen = b.getAttribute('aria-expanded') === 'true';
    faqButtons.forEach(o => {
      o.setAttribute('aria-expanded', 'false');
      document.getElementById(o.getAttribute('aria-controls')).classList.remove('open');
    });
    if (!wasOpen) {
      b.setAttribute('aria-expanded', 'true');
      document.getElementById(b.getAttribute('aria-controls')).classList.add('open');
    }
  }));

  /* 3) Süti-banner (localStorage) */
  const banner = document.getElementById('cookieBanner');
  const KEY = 'cookieConsent';
  let accepted = false;
  try { accepted = localStorage.getItem(KEY) === 'accepted'; } catch (e) {}
  if (banner && !accepted) banner.classList.remove('hidden');
  const acceptBtn = document.getElementById('cookieAccept');
  if (acceptBtn) acceptBtn.addEventListener('click', () => {
    try { localStorage.setItem(KEY, 'accepted'); } catch (e) {}
    banner.classList.add('hidden');
  });

  /* 4) AOS – görgetési animációk */
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
    // Az animáció végén levesszük az AOS-attribútumot, hogy a kártyák hover-effektje újra a Tailwindé legyen
    document.addEventListener('aos:in', e => setTimeout(() => e.detail.removeAttribute('data-aos'), 1500));
  }

  /* 5) Évszám a láblécben */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
