/* Online Coaching – alap weboldal: közös szkript minden oldalra.
   - mobil menü
   - kosár a böngészőben (localStorage), fejléc számláló, "Kosárba rakom" gombok
   - termékszűrő, kosár oldal, kalóriakalkulátor, kapcsolati űrlap (csak ellenőrzés, nem küld el semmit)
   Felhasználói adat mindig textContent-tel kerül az oldalra. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Ft';
  const P = window.PRODUCTS || {};

  // ---------- Mobil menü ----------
  const menuBtn = $('[data-menu-btn]');
  const nav = $('[data-nav]');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? 'Bezárás' : 'Menü';
    });
  }

  // ---------- Kosár (localStorage) ----------
  const KEY = 'oc-kosar';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const write = cart => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { /* privát mód */ } };
  const count = cart => Object.values(cart).reduce((a, b) => a + b, 0);

  function updateBadge() {
    const n = count(read());
    $$('[data-cart-count]').forEach(el => { el.textContent = n; });
    $$('[data-cart-link]').forEach(el => el.setAttribute('aria-label', 'Kosár, ' + n + ' tétel'));
  }

  const toast = $('[data-toast]');
  let toastTimer;
  function say(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    const slug = btn.dataset.add;
    const p = P[slug];
    if (!p) return;
    const cart = read();
    const next = (cart[slug] || 0) + 1;
    if (next > p.max) { say(p.max === 1 ? 'Már a kosárban van' : 'Legfeljebb ' + p.max + ' darab'); return; }
    cart[slug] = next;
    write(cart);
    updateBadge();
    say('Hozzáadva a kosárhoz');
  });
  updateBadge();

  // ---------- Kosár oldal ----------
  const cartRoot = $('[data-cart]');
  function renderCart() {
    const cart = read();
    const list = $('[data-cart-list]', cartRoot);
    const slugs = Object.keys(cart).filter(s => P[s]);
    $('[data-cart-empty]', cartRoot).hidden = slugs.length > 0;
    $('[data-cart-summary]', cartRoot).hidden = slugs.length === 0;
    list.replaceChildren(...slugs.map(slug => {
      const p = P[slug];
      const q = cart[slug];
      const li = document.createElement('li');
      li.className = 'cart-item';
      const name = document.createElement('div');
      const t = document.createElement('p');
      t.textContent = p.name;
      t.style.fontWeight = '600';
      const unit = document.createElement('p');
      unit.className = 'muted';
      unit.textContent = money(p.price) + ' / db';
      name.append(t, unit);

      const qty = document.createElement('div');
      qty.className = 'qty';
      const minus = document.createElement('button');
      minus.type = 'button'; minus.textContent = '−'; minus.setAttribute('aria-label', 'Kevesebb: ' + p.name);
      const val = document.createElement('span');
      val.textContent = q;
      const plus = document.createElement('button');
      plus.type = 'button'; plus.textContent = '+'; plus.setAttribute('aria-label', 'Több: ' + p.name);
      plus.disabled = q >= p.max;
      minus.addEventListener('click', () => { const c = read(); c[slug] -= 1; if (c[slug] <= 0) delete c[slug]; write(c); renderCart(); updateBadge(); });
      plus.addEventListener('click', () => { const c = read(); c[slug] = Math.min(p.max, c[slug] + 1); write(c); renderCart(); updateBadge(); });
      qty.append(minus, val, plus);

      const price = document.createElement('p');
      price.className = 'price';
      price.textContent = money(p.price * q);
      li.append(name, qty, price);
      return li;
    }));
    const total = slugs.reduce((s, slug) => s + P[slug].price * cart[slug], 0);
    $('[data-cart-total]', cartRoot).textContent = money(total);
  }
  if (cartRoot) {
    renderCart();
    $('[data-cart-clear]', cartRoot).addEventListener('click', () => { write({}); renderCart(); updateBadge(); });
  }

  // ---------- Termékszűrő ----------
  const filter = $('[data-filter]');
  if (filter) {
    filter.addEventListener('click', e => {
      const b = e.target.closest('button[data-f]');
      if (!b) return;
      $$('button', filter).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      const f = b.dataset.f;
      $$('[data-cat]').forEach(card => { card.hidden = f !== 'all' && !card.dataset.cat.split(' ').includes(f); });
    });
  }

  // ---------- Kalóriakalkulátor (Mifflin–St Jeor, ugyanaz, mint a teljes oldalon) ----------
  const calc = $('[data-calc]');
  if (calc) {
    let sex = 'm';
    const GOALS = [['Fogyás, heti 0,5 kg', -550], ['Fogyás, heti 0,25 kg', -275], ['Súlytartás', 0], ['Tömegnövelés, heti 0,25 kg', 275], ['Tömegnövelés, heti 0,5 kg', 550]];
    let delta = 0;
    const out = $('[data-calc-out]');
    const err = $('[data-calc-err]');
    $$('[data-sex]', calc).forEach(b => b.addEventListener('click', () => {
      sex = b.dataset.sex;
      $$('[data-sex]', calc).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      run();
    }));
    const goalSel = $('[name="goal"]', calc);
    GOALS.forEach(([label, d]) => { const o = document.createElement('option'); o.value = d; o.textContent = label; o.selected = d === 0; goalSel.appendChild(o); });

    function run() {
      const age = Number($('[name="age"]', calc).value);
      const w = Number($('[name="weight"]', calc).value);
      const h = Number($('[name="height"]', calc).value);
      const f = Number($('[name="activity"]', calc).value);
      delta = Number(goalSel.value);
      if (!(age >= 14 && age <= 80 && w >= 35 && w <= 250 && h >= 130 && h <= 230)) {
        err.textContent = 'Adj meg valós értékeket: életkor 14–80, testsúly 35–250 kg, magasság 130–230 cm.';
        out.hidden = true;
        return;
      }
      err.textContent = '';
      const bmr = 10 * w + 6.25 * h - 5 * age + (sex === 'm' ? 5 : -161);
      const tdee = bmr * f;
      const kcal = Math.max(1200, tdee + delta);
      const protein = 1.8 * w, fat = 0.25 * kcal / 9, carbs = Math.max(0, (kcal - protein * 4 - fat * 9) / 4);
      $('[data-out-tdee]').textContent = money(tdee).replace(' Ft', ' kcal');
      $('[data-out-kcal]').textContent = money(kcal).replace(' Ft', ' kcal');
      $('[data-out-p]').textContent = Math.round(protein) + ' g';
      $('[data-out-c]').textContent = Math.round(carbs) + ' g';
      $('[data-out-f]').textContent = Math.round(fat) + ' g';
      out.hidden = false;
    }
    calc.addEventListener('input', run);
    calc.addEventListener('submit', e => { e.preventDefault(); run(); });
  }

  // ---------- Kapcsolati űrlap (alap verzió: csak ellenőriz, nem küld el semmit) ----------
  const contact = $('[data-contact]');
  if (contact) {
    contact.addEventListener('submit', e => {
      e.preventDefault();
      const f = contact.elements;
      const errors = {
        name: f.name.value.trim().length < 2 ? 'Add meg a neved.' : '',
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim()) ? '' : 'Adj meg egy érvényes e-mail-címet.',
        message: f.message.value.trim().length < 10 ? 'Az üzenet legalább 10 karakter legyen.' : ''
      };
      let first = null;
      Object.entries(errors).forEach(([k, v]) => {
        $('#err-' + k).textContent = v;
        f[k].setAttribute('aria-invalid', v ? 'true' : 'false');
        if (v && !first) first = f[k];
      });
      const msg = $('[data-contact-msg]');
      if (first) { first.focus(); msg.hidden = true; return; }
      msg.hidden = false;
      msg.textContent = 'Köszönöm, ' + f.name.value.trim() + '! Ez az alap (csak frontend) verzió, ezért az üzenet nem kerül elküldésre. Írj nekem Instagramon vagy e-mailben.';
      contact.reset();
    });
  }

  // Év a láblécben
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
