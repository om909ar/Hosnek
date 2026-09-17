(function () {
  const KEY = 'hosnek_tg_theme';
  const root = document.documentElement;

  function current() {
    return root.classList.contains('tg-dark') ? 'dark' : 'light';
  }

  function apply(theme) {
    root.classList.remove('tg-light', 'tg-dark');
    root.classList.add(theme === 'dark' ? 'tg-dark' : 'tg-light');
    try { localStorage.setItem(KEY, theme); } catch (_) {}

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#062c26' : '#f6f1e7');

    const btn = document.getElementById('tg-theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'تفعيل المظهر الفاتح' : 'تفعيل المظهر الداكن');
      btn.setAttribute('title', theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن');
    }
  }

  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (_) {}
  apply(saved === 'light' ? 'light' : 'dark');

  function mountToggle() {
    const bar = document.querySelector('.topbar');
    if (!bar || document.getElementById('tg-theme-toggle')) return;

    const button = document.createElement('button');
    button.id = 'tg-theme-toggle';
    button.className = 'tg-theme-toggle';
    button.type = 'button';
    button.innerHTML = `
      <span class="tg-moon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"></path>
        </svg>
      </span>
      <span class="tg-sun" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
        </svg>
      </span>`;
    button.addEventListener('click', function () {
      apply(current() === 'dark' ? 'light' : 'dark');
    });
    bar.appendChild(button);
    apply(current());
  }

  function fitDhikrCard() {
    const card = document.querySelector('.reading-card:not(.surah-card)');
    if (!card) return;
    const p = card.querySelector('.reading-copy p');
    card.classList.remove('tg-evening-compact');

const text = (p.textContent || '').replace(/\s+/g, ' ').trim();

if (text.includes('أمسينا وأمسى الملك')) {
  card.classList.add('tg-evening-compact');
}
    if (!p) return;

    const length = (p.textContent || '').replace(/\s+/g, '').length;
    card.classList.remove('tg-dhikr-long', 'tg-dhikr-xlong');

    if (length >= 360) {
      card.classList.add('tg-dhikr-xlong');
    } else if (length >= 220) {
      card.classList.add('tg-dhikr-long');
    }
  }

  function refreshEnhancements() {
    mountToggle();
    fitDhikrCard();
  }

  refreshEnhancements();
  const obs = new MutationObserver(refreshEnhancements);
  obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
