document.addEventListener('DOMContentLoaded', () => {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!items.length) return;

  const lightbox = document.getElementById('lightbox');
  const imgEl = lightbox.querySelector('.lightbox-image');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const stage = lightbox.querySelector('.lightbox-stage');

  const sources = items.map((a) => a.getAttribute('href') || a.querySelector('img')?.src);
  const alts = items.map((a, i) => a.querySelector('img')?.alt || `갤러리 이미지 ${i + 1}`);

  let current = 0;

  function updateImage() {
    imgEl.src = sources[current];
    imgEl.alt = alts[current];
    // Preload neighbors for smoother sliding
    const nextIdx = (current + 1) % sources.length;
    const prevIdx = (current - 1 + sources.length) % sources.length;
    const pre1 = new Image();
    pre1.src = sources[nextIdx];
    const pre2 = new Image();
    pre2.src = sources[prevIdx];
  }

  function open(index) {
    current = index;
    updateImage();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    try { closeBtn.focus(); } catch (_) {}
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function next() {
    current = (current + 1) % sources.length;
    updateImage();
  }

  function prev() {
    current = (current - 1 + sources.length) % sources.length;
    updateImage();
  }

  items.forEach((a, idx) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      open(idx);
    });
    a.setAttribute('tabindex', '0');
    a.setAttribute('role', 'button');
    a.setAttribute('aria-label', (alts[idx] || `갤러리 이미지 ${idx + 1}`) + ' 크게 보기');
    a.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(idx);
      }
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Touch swipe for mobile
  let startX = 0;
  let deltaX = 0;
  let touching = false;
  stage.addEventListener('touchstart', (e) => {
    if (!e.touches.length) return;
    touching = true;
    startX = e.touches[0].clientX;
  }, { passive: true });

  stage.addEventListener('touchmove', (e) => {
    if (!touching) return;
    deltaX = e.touches[0].clientX - startX;
  }, { passive: true });

  stage.addEventListener('touchend', () => {
    if (!touching) return;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) next();
      else prev();
    }
    touching = false;
    deltaX = 0;
  });
});

