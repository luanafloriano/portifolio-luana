/* ============================================================
   PORTFOLIO — LUANA CRUZ · Full Stack Developer
   script.js · Vanilla JS — sem dependências externas
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════
   1. TOGGLE DE TEMA (dark / light)
   ══════════════════════════════════════════════ */
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Recupera preferência salva; fallback: dark
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

/* ══════════════════════════════════════════════
   2. MENU HAMBURGUER (mobile)
   ══════════════════════════════════════════════ */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  // Fecha ao clicar em qualquer link
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
    });
  });
})();

/* ══════════════════════════════════════════════
   3. SCROLL — NAV ATIVO + SHADOW NO HEADER
   ══════════════════════════════════════════════ */
(function initScrollSpy() {
  const header   = document.getElementById('header');
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  // Header shadow ao rolar
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 4px 30px rgba(0,0,0,0.4)'
      : 'none';
  }, { passive: true });

  // Intersection Observer para destacar seção ativa
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();

/* ══════════════════════════════════════════════
   4. ANIMAÇÕES DE ENTRADA (reveal ao scroll)
   ══════════════════════════════════════════════ */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Delay escalonado para sub-elementos
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════════════════
   5. EFEITO TYPEWRITER (hero)
   ══════════════════════════════════════════════ */
(function initTypewriter() {
  const el      = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Criadora de sites profissionais',
    'Sites que vendem de verdade',
    'Design + Tecnologia para o seu negócio',
    'HTML · Node.js · MySQL · Docker',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let delay     = 90;

  function tick() {
    const current = phrases[phraseIdx];

    if (deleting) {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      delay = 45;
    } else {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      delay = 90;
    }

    if (!deleting && charIdx === current.length) {
      // Pausa no fim da frase
      delay = 1800;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay     = 400;
    }

    setTimeout(tick, delay);
  }

  // Pequeno delay inicial
  setTimeout(tick, 600);
})();

/* ══════════════════════════════════════════════
   6. FILTRO DE PROJETOS
   ══════════════════════════════════════════════ */
(function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Atualiza botão ativo
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'todos' || cat === filter) {
          card.classList.remove('hidden');
          // Animação suave
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = 'fadeInUp 0.4s ease forwards';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ══════════════════════════════════════════════
   7. CURSOR CUSTOMIZADO
   ══════════════════════════════════════════════ */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  // Só ativa em dispositivos com mouse real
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    dot.style.display  = 'none';
    ring.style.display = 'none';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot segue imediatamente
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring acompanha com suavidade (lerp)
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Efeito hover em links/botões
  const hoverTargets = document.querySelectorAll('a, button');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  // Esconde ao sair da janela
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '0.5';
  });
})();

/* ══════════════════════════════════════════════
   8. ANIMAÇÃO FADEUP para cards filtrados
   ══════════════════════════════════════════════ */
(function injectFilterAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

/* ══════════════════════════════════════════════
   9. ANIMAÇÃO ESCALONADA DAS STACK CARDS
   ══════════════════════════════════════════════ */
(function initStackStagger() {
  const stackSection = document.getElementById('stacks');
  if (!stackSection) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = stackSection.querySelectorAll('.stack-card');
        cards.forEach((card, i) => {
          card.style.opacity   = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          }, i * 60);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(stackSection);
})();

/* ══════════════════════════════════════════════
   10. ANIMAÇÃO DE ENTRADA NOS CONTACT CARDS
   ══════════════════════════════════════════════ */
(function initContactReveal() {
  const contactSection = document.getElementById('contato');
  if (!contactSection) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = contactSection.querySelectorAll('.contact-card');
        cards.forEach((card, i) => {
          card.style.opacity   = '0';
          card.style.transform = 'translateX(-30px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateX(0)';
          }, i * 120);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(contactSection);
})();
