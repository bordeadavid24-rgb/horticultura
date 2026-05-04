/* ─── CURSOR ─────────────────────────────── */
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let rx = mx, ry = my;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button,.pcard,.icard,.hstat,.tphase').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.style.width = '18px'; cur.style.height = '18px'; ring.style.width = '54px'; ring.style.height = '54px'; });
  el.addEventListener('mouseleave', () => { cur.style.width = '10px'; cur.style.height = '10px'; ring.style.width = '38px'; ring.style.height = '38px'; });
});

/* ─── NAV SCROLL ─────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50));

/* ─── GSAP ANIMATIONS ────────────────────── */
gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReduced) {
  const heroSels = '.hero-eyebrow,.hero-title .word-light,h1.hero-title em,.hero-title .word-main,.hero-body,.hero-actions,.hero-stats,.scroll-cue';
  document.querySelectorAll(heroSels).forEach(el => el.style.opacity = '1');
  document.querySelectorAll('.rv').forEach(el => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
  document.querySelectorAll('.pt-label,.pt-title,.pt-body,.pt-divider,.pt-footnote').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
} else {
  /* Hero entrance – staggered timeline */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .fromTo('.hero-eyebrow',
            { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.75 })
    .fromTo(['.hero-title .word-light', 'h1.hero-title em', '.hero-title .word-main'],
            { opacity: 0, y: 28 }, { opacity: 1, y: 0, stagger: 0.13, duration: 0.72 }, '-=0.42')
    .fromTo('.hero-body',
            { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.65 }, '-=0.28')
    .fromTo('.hero-actions',
            { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.60 }, '-=0.38')
    .fromTo('.hero-stats',
            { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.70 }, '-=0.50')
    .fromTo('.scroll-cue',
            { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55 }, '+=0.10');

  /* Blob float – GSAP replaces CSS blobFloat (x+scale only; y reserved for parallax) */
  gsap.to('.hero-blob-1', { x: 28, scale: 1.05, duration: 12, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('.hero-blob-2', { x: -18, scale: 0.93, duration: 9,  ease: 'sine.inOut', yoyo: true, repeat: -1, delay: -3 });
  gsap.to('.hero-blob-3', { x: 12,  scale: 1.04, duration: 7,  ease: 'sine.inOut', yoyo: true, repeat: -1, delay: -5 });

  /* Blob scroll parallax (y only – composes with float x+scale above) */
  gsap.to('.hero-blob-1', { y: -40, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });
  gsap.to('.hero-blob-2', { y: -28, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2   } });
  gsap.to('.hero-blob-3', { y: -18, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2.5 } });

  /* Section reveals – ScrollTrigger.batch replaces IntersectionObserver */
  ScrollTrigger.batch('.rv', {
    onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', stagger: 0.07 }),
    start: 'top 88%',
    once: true
  });

  /* Post-tree landing — atmospheric scrub reveal.
     Each element carries a distinct scrub lag so they settle at different rates,
     producing a depth-layered float that continues the simulation's scroll momentum
     into the DOM layer rather than snapping in as a separate UI event. */
  const ptST = { trigger: '#post-tree', start: 'top 90%', end: 'top 25%' };
  gsap.fromTo('.pt-label',   { opacity: 0, y: 16 }, { opacity: 1, y: 0, ease: 'power2.out', scrollTrigger: { ...ptST, scrub: 1.4 } });
  gsap.fromTo('.pt-title',   { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: 'power2.out', scrollTrigger: { ...ptST, scrub: 1.8 } });
  gsap.fromTo('.pt-body',    { opacity: 0, y: 14 }, { opacity: 1, y: 0, ease: 'power2.out', scrollTrigger: { ...ptST, scrub: 2.4 } });
  gsap.fromTo('.pt-divider', { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, ease: 'power2.out', scrollTrigger: { ...ptST, scrub: 1.6 } });
  gsap.fromTo('.pt-footnote',{ opacity: 0, y: 8  }, { opacity: 1, y: 0, ease: 'power2.out', scrollTrigger: { ...ptST, scrub: 2.8 } });

  /* Button hover micro-animations (GSAP owns transform; CSS still handles color/shadow) */
  document.querySelectorAll('.btn-fill, .btn-outline, .cta-btn-fill, .cta-btn-ghost').forEach(el => {
    el.addEventListener('mouseenter', () => gsap.to(el, { scale: 1.04, y: -2, duration: 0.22, ease: 'power2.out' }));
    el.addEventListener('mouseleave', () => gsap.to(el, { scale: 1,    y:  0, duration: 0.28, ease: 'power2.inOut' }));
  });

  /* Nav link nudge */
  document.querySelectorAll('.nav-links a').forEach(el => {
    el.addEventListener('mouseenter', () => gsap.to(el, { y: -2, duration: 0.20, ease: 'power2.out' }));
    el.addEventListener('mouseleave', () => gsap.to(el, { y:  0, duration: 0.25, ease: 'power2.out' }));
  });
}

/* ─── AMBIENT CANVAS PARTICLES ───────────── */
(function () {
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 55; i++) {
    particles.push({
      x: Math.random() * 1400, y: Math.random() * 900,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - .5) * .35,
      vy: -(Math.random() * .4 + .1),
      o: Math.random() * .25 + .05,
      hue: 120 + Math.random() * 30
    });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x % W, p.y % H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},55%,52%,${p.o})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─── MAP SWITCH ─────────────────────────── */
function swMap(which, btn) {
  document.getElementById('sv-before').style.display = which === 'before' ? 'block' : 'none';
  document.getElementById('sv-after').style.display  = which === 'after'  ? 'block' : 'none';
  document.querySelectorAll('.mtab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  const info = document.getElementById('map-info');
  const cap  = document.getElementById('map-cap');
  if (which === 'before') {
    info.innerHTML = '<h4>Situația actuală</h4><p>Parcurile Brașovului există, dar sunt complet izolate între ele. Aerul curat de pe Tâmpa nu poate pătrunde în centrul urban.</p><span class="map-tag">Schemă bazată pe geometria reală</span>';
    cap.textContent = 'Schemă schematică bazată pe geometria reală a Brașovului · Parcuri în poziții aproximative · Nu reprezintă GIS oficial';
  } else {
    info.innerHTML = '<h4>După BioAir</h4><p>5 coridoare verzi conectează Tâmpa, Titulescu, Tractorul, Parc Civic și Zoo/Noua într-o rețea biologică activă. Aerul curat este dirijat spre centrul urban.</p><span class="map-tag">Rețeaua completă Faza 1+2</span>';
    cap.textContent = 'Rețeaua BioAir – 5 coridoare principale · ~12–15 km vegetație activă · Săgețile indică fluxul de aer curat';
  }
}

/* ─── TREE INTRO OVERLAY ─────────────────────── */
(function () {
  const canvas   = document.getElementById('tree-canvas');
  const ctx      = canvas.getContext('2d');
  const section  = document.getElementById('tree-section');
  const pfill    = document.getElementById('tree-pfill');
  const tslNum   = document.getElementById('tsl-num');
  const tslTitle = document.getElementById('tsl-title');
  const tslBody  = document.getElementById('tsl-body');

  const titleLeft  = document.querySelector('.thb-left');
  const titleRight = document.querySelector('.thb-right');

  const aflEl  = document.getElementById('airflow-bg');
  let aflAnims = null;
  let aflLastP = -1;

  const STAGES = [
    { num: 'Etapa 1 / 5', title: 'Un copac singur într-un oraș poluat',       body: 'Brașovul de astăzi – parcuri izolate, aer viciat de trafic, nicio conexiune biologică între spațiile verzi.' },
    { num: 'Etapa 2 / 5', title: 'Primele ramuri verzi prind viață',           body: 'O schimbare începe. Vegetația crește, haza de poluare se subțiază, orașul respiră puțin mai ușor.' },
    { num: 'Etapa 3 / 5', title: 'Coridoarele se extind în oraș',              body: 'Ramurile devin coridoare verzi – rute biologice active ce traversează bulevardele și conectează parcurile.' },
    { num: 'Etapa 4 / 5', title: 'Rețeaua conectează toate parcurile',         body: 'Titulescu, Tractorul, Noua/Zoo – toate unite. Aerul curat de pe Tâmpa ajunge în centrul urban prin rețeaua BioAir.' },
    { num: 'Etapa 5 / 5', title: 'Ecosistem urban complet – Brașovul respiră', body: 'Orașul transformat: coridoare active, biodiversitate restabilită, temperaturi mai scăzute, aer curat pentru 60.000 de locuitori.' },
  ];

  let p = 0;
  let t = 0; // seconds — drives time-based animation independent of scroll

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); drawFrame(simulate(p, t)); });

  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  let rngSeed = 0;
  function rng() { rngSeed = (rngSeed * 9301 + 49297) % 233280; return rngSeed / 233280; }

  /* ── SIMULATION LAYER ──────────────────────────────────────────────────────
     Derives all motion state from scroll progress (p) and time (t).
     No Canvas API — safe to swap for a Three.js consumer without edits here.
  ────────────────────────────────────────────────────────────────────────── */
  function simulate(p, t) {
    return {
      p, t,
      // Atmosphere
      pollution:     clamp(1 - p * 1.5, 0, 1),
      cleanGlow:     easeOut(clamp(p * 2 - 0.5, 0, 1)),
      // City / ground
      greenTint:     easeOut(clamp(p * 2 - 0.2, 0, 1)),
      vegProg:       easeOut(clamp((p - 0.35) * 2.5, 0, 1)),
      groundGreen:   easeOut(clamp(p * 1.6 - 0.1, 0, 1)),
      roadAlpha:     clamp(1 - p * 0.75, 0, 1),
      // Mountain
      mountainAlpha: easeOut(clamp(p * 3.5 - 1.8, 0, 1)),
      // Airflow
      flowIntensity: easeOut(clamp(p * 2 - 0.7, 0, 1)),
      flowTime:      t * 0.7,
      // Trunk
      trunkGrowth:   easeOut(clamp(p * 1.7, 0, 1)),
      trunkWeight:   easeOut(clamp(p * 1.5, 0, 1)),
      // Branches & leaves
      branchProg:    clamp((p - 0.06) * 1.5, 0, 1),
      branchDepth:   Math.round(lerp(2, 6, easeInOut(p))),
      branchScale:   easeOut(p),
      swayL:         0.013 * Math.sin(t * 0.40 + 0.3) + 0.006 * Math.sin(t * 0.13 + 0.9),
      swayR:         0.013 * Math.sin(t * 0.40 - 0.2) + 0.006 * Math.sin(t * 0.13 - 0.6),
      leafCol:       `rgba(${Math.round(lerp(110,145,p))},${Math.round(lerp(183,215,p))},${Math.round(lerp(108,142,p))},0.52)`,
      // Corridors
      corridorProg:  easeOut(clamp(p * 2 - 0.85, 0, 1)),
    };
  }

  /* ── RENDER LAYER ──────────────────────────────────────────────────────────
     All functions below consume sim values — no logic, no p/t derivation.
     To migrate to WebGL/Three.js: replace this block, keep simulate() as-is.
  ────────────────────────────────────────────────────────────────────────── */

  function drawSky(sim) {
    const { p, pollution, cleanGlow } = sim;
    const W = canvas.width, H = canvas.height;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, `rgb(${Math.round(lerp(246,238,p))},${Math.round(lerp(243,247,p))},${Math.round(lerp(238,238,p))})`);
    g.addColorStop(1, `rgb(${Math.round(lerp(238,228,p))},${Math.round(lerp(235,242,p))},${Math.round(lerp(228,232,p))})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    if (pollution > 0.01) {
      const haze = ctx.createRadialGradient(W * .5, H * .38, 0, W * .5, H * .38, W * .55);
      haze.addColorStop(0, `rgba(195,175,130,${pollution * 0.10})`);
      haze.addColorStop(1, 'transparent');
      ctx.fillStyle = haze; ctx.fillRect(0, 0, W, H);
    }
    if (cleanGlow > 0.01) {
      const cg = ctx.createRadialGradient(W * .5, H * .3, 0, W * .5, H * .3, W * .4);
      cg.addColorStop(0, `rgba(110,185,135,${cleanGlow * 0.07})`);
      cg.addColorStop(1, 'transparent');
      ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H);
    }
  }

  function drawCity(sim) {
    const { greenTint, vegProg, groundGreen, roadAlpha } = sim;
    const W = canvas.width, H = canvas.height;
    const gY = H * 0.71;
    const buildings = [
      { x: .03, w: .07, h: .22 }, { x: .11, w: .05, h: .15 }, { x: .17, w: .09, h: .30 },
      { x: .27, w: .05, h: .17 }, { x: .63, w: .06, h: .21 }, { x: .70, w: .09, h: .33 },
      { x: .80, w: .06, h: .17 }, { x: .87, w: .07, h: .25 }, { x: .94, w: .06, h: .14 },
    ];
    buildings.forEach(b => {
      const bx = b.x * W, bw = b.w * W, bh = b.h * H, by = gY - b.h * H;
      ctx.fillStyle = `rgb(${Math.round(lerp(198,188,greenTint))},${Math.round(lerp(195,208,greenTint))},${Math.round(lerp(190,196,greenTint))})`;
      ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = `rgba(120,170,140,0.06)`;
      const wW = bw * .22, wH = bh * .07;
      for (let r = 0; r < 5; r++) for (let c = 0; c < 2; c++)
        ctx.fillRect(bx + bw * .15 + c * bw * .38, by + bh * .1 + r * bh * .13, wW, wH);
      if (greenTint > .25) {
        ctx.fillStyle = `rgba(100,170,120,${vegProg * .22})`;
        ctx.fillRect(bx, by, bw * vegProg * .5, bh * .25);
        ctx.fillRect(bx, gY - bh * .12, bw, bh * .12 * vegProg);
      }
    });
    const gg = ctx.createLinearGradient(0, gY, 0, H);
    gg.addColorStop(0, `rgb(${Math.round(lerp(222,210,groundGreen))},${Math.round(lerp(220,230,groundGreen))},${Math.round(lerp(212,215,groundGreen))})`);
    gg.addColorStop(1, `rgb(${Math.round(lerp(235,225,groundGreen))},${Math.round(lerp(232,238,groundGreen))},${Math.round(lerp(228,232,groundGreen))})`);
    ctx.fillStyle = gg; ctx.fillRect(0, gY, W, H - gY);
    ctx.fillStyle = `rgba(185,180,172,${roadAlpha * .55})`; ctx.fillRect(W * .32, gY - 3, W * .36, 12);
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = `rgba(200,175,70,${roadAlpha * .28})`;
      ctx.fillRect(W * .335 + i * W * .052, gY + 2, W * .028, 4);
    }
  }

  function drawMountain(sim) {
    const { mountainAlpha } = sim;
    if (mountainAlpha < .01) return;
    const W = canvas.width, H = canvas.height;
    const gY = H * 0.71;
    ctx.globalAlpha = mountainAlpha * .35;
    ctx.fillStyle = 'rgba(90,145,105,1)';
    ctx.beginPath(); ctx.moveTo(W * .28, gY);
    ctx.quadraticCurveTo(W * .37, gY - H * .4, W * .46, gY - H * .31);
    ctx.lineTo(W * .56, gY); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(115,168,128,1)';
    ctx.beginPath(); ctx.moveTo(W * .30, gY);
    ctx.quadraticCurveTo(W * .38, gY - H * .36, W * .46, gY - H * .29);
    ctx.lineTo(W * .53, gY); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawAirflow(sim) {
    const { flowIntensity, flowTime } = sim;
    if (flowIntensity < .01) return;
    const W = canvas.width, H = canvas.height;
    for (let i = 0; i < 7; i++) {
      const yb = H * .2 + i * H * .058;
      const a = flowIntensity * .16 * (0.5 + 0.5 * Math.sin(flowTime + i * .9));
      ctx.strokeStyle = `rgba(65,130,90,${a * 1.3})`;
      ctx.lineWidth = 1; ctx.setLineDash([7, 13]);
      ctx.lineDashOffset = -(flowTime * 55 + i * 18) % 20;
      ctx.beginPath();
      ctx.moveTo(W * .04, yb + Math.sin(flowTime + i) * 7);
      ctx.bezierCurveTo(W * .25, yb - 14, W * .5, yb + 9, W * .96, yb + Math.sin(flowTime + i + 1) * 5);
      ctx.stroke();
    }
    ctx.setLineDash([]); ctx.lineDashOffset = 0;
  }

  function drawBranch(ox, oy, angle, len, depth, maxD, prog, leafCol, lw, leafTime) {
    if (depth > maxD || len < 1.5) return;
    const bp = clamp((prog - depth / maxD * .55) / (1 / maxD * .9), 0, 1);
    if (bp <= 0) return;
    const ex = ox + Math.cos(angle) * len * bp;
    const ey = oy - Math.sin(angle) * len * bp;
    const gr = Math.round(lerp(125, 152, depth / maxD));
    const gg = Math.round(lerp(92, 78, depth / maxD));
    const gb = Math.round(lerp(60, 50, depth / maxD));
    ctx.strokeStyle = `rgb(${gr},${gg},${gb})`;
    ctx.lineWidth = Math.max(.5, lw);
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex, ey); ctx.stroke();
    if (bp > .8 && depth < maxD) {
      const spread = lerp(.52, .36, depth / maxD);
      const nl = len * lerp(.73, .65, depth / maxD);
      rng(); const jL = (rng() - .5) * .12;
      rng(); const jR = (rng() - .5) * .12;
      drawBranch(ex, ey, angle + spread + jL, nl, depth + 1, maxD, prog, leafCol, lw * .68, leafTime);
      drawBranch(ex, ey, angle - spread + jR, nl, depth + 1, maxD, prog, leafCol, lw * .68, leafTime);
      if (depth < maxD - 2 && rng() > .45)
        drawBranch(ex, ey, angle + (rng() - .5) * .4, nl * .55, depth + 2, maxD, prog, leafCol, lw * .5, leafTime);
    }
    if (depth >= maxD - 1 && bp > .75) {
      const la = easeOut(bp);
      const ls = lerp(2, 6, depth / maxD);
      ctx.fillStyle = leafCol;
      ctx.globalAlpha = la * .72;
      for (let i = 0; i < 4; i++) {
        const sx = 1.3 * Math.sin(leafTime * 0.55 + depth * 1.3 + i * 2.1) + 0.5 * Math.sin(leafTime * 0.18 + depth * 0.8 + i * 1.4);
        const sy = 1.0 * Math.sin(leafTime * 0.45 + depth * 0.9 + i * 1.7) + 0.4 * Math.sin(leafTime * 0.22 + depth * 1.1 + i * 0.8);
        ctx.beginPath();
        ctx.arc(ex + (rng() - .5) * 14 + sx, ey + (rng() - .5) * 11 + sy, ls + rng() * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }

  function drawCorridors(sim, cx, gY) {
    const { corridorProg } = sim;
    if (corridorProg < .01) return;
    const W = canvas.width, H = canvas.height;
    const corridors = [
      { sx: cx, sy: gY * .54, ex: W * .10, ey: gY * .62, lbl: 'Parc Titulescu' },
      { sx: cx, sy: gY * .51, ex: W * .90, ey: gY * .57, lbl: 'Parc Tractorul' },
      { sx: cx, sy: gY * .59, ex: W * .84, ey: gY * .76, lbl: 'Parc Noua / Zoo' },
    ];
    corridors.forEach((c, i) => {
      const cP = easeOut(clamp((corridorProg - i * .18) * 1.6, 0, 1));
      if (cP < .01) return;
      const curX = lerp(c.sx, c.ex, cP), curY = lerp(c.sy, c.ey, cP);
      const cp1x = lerp(c.sx, c.ex, .3), cp1y = c.sy - 44;
      ctx.strokeStyle = `rgba(80,160,100,${cP * .42})`;
      ctx.lineWidth = 8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(c.sx, c.sy);
      ctx.quadraticCurveTo(cp1x, cp1y, curX, curY); ctx.stroke();
      ctx.strokeStyle = `rgba(55,135,80,${cP * .80})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(c.sx, c.sy);
      ctx.quadraticCurveTo(cp1x, cp1y, curX, curY); ctx.stroke();
      if (cP > .88) {
        const fa = (cP - .88) * 8.3;
        ctx.fillStyle = `rgba(78,154,94,${fa * .85})`;
        ctx.beginPath(); ctx.arc(c.ex, c.ey, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(40,90,55,${fa * .88})`;
        ctx.font = `500 10px 'JetBrains Mono',monospace`;
        ctx.textAlign = c.ex > W * .5 ? 'right' : 'left';
        ctx.fillText(c.lbl, c.ex + (c.ex > W * .5 ? -14 : 14), c.ey - 14);
      }
    });
    ctx.textAlign = 'left';
  }

  /* ── airflow & UI — called by ScrollTrigger onUpdate ── */
  function updateAirflow(p) {
    if (!aflEl) return;
    if (!aflAnims) {
      aflAnims = [];
      aflEl.querySelectorAll('.afl').forEach(el => { aflAnims.push(...el.getAnimations()); });
    }
    if (!aflAnims.length || Math.abs(p - aflLastP) <= 0.001) return;
    aflLastP = p;
    let rate, aop;
    if (p < 0.3) {
      const t = p / 0.3;
      rate = 0.4 + t * 0.6; aop = 0.25 + t * 0.35;
    } else if (p < 0.7) {
      const t = (p - 0.3) / 0.4;
      rate = 1.0 + t * 0.8; aop = 0.60 + t * 0.40;
    } else {
      const t = (p - 0.7) / 0.3;
      rate = 1.8 - t * 0.8; aop = 1.0  - t * 0.15;
    }
    aflEl.style.opacity = aop.toFixed(3);
    aflAnims.forEach(a => { a.playbackRate = rate; });
  }

  function updateUI(p) {
    pfill.style.width = (p * 100).toFixed(1) + '%';
    const si = Math.min(4, Math.floor(p * 5 + 0.02));
    const s  = STAGES[si];
    tslNum.textContent   = s.num;
    tslTitle.textContent = s.title;
    tslBody.textContent  = s.body;
    if (titleLeft)  titleLeft.style.opacity  = Math.max(0, 1 - p / 0.52).toFixed(3);
    if (titleRight) titleRight.style.opacity = Math.max(0, 1 - p / 0.30).toFixed(3);
  }

  function drawFrame(sim) {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    rngSeed = 42;

    drawSky(sim);
    drawCity(sim);
    drawMountain(sim);
    drawAirflow(sim);

    const gY       = H * .71;
    const cx       = W * .5;
    const trunkH   = lerp(16, H * .37, sim.trunkGrowth);
    const trunkTop = gY - trunkH;

    ctx.strokeStyle = `rgb(${Math.round(lerp(130,152,sim.p))},${Math.round(lerp(98,115,sim.p))},${Math.round(lerp(68,78,sim.p))})`;
    ctx.lineWidth   = lerp(4, 12, sim.trunkWeight);
    ctx.lineCap     = 'round';
    ctx.beginPath(); ctx.moveTo(cx, gY); ctx.lineTo(cx, trunkTop); ctx.stroke();

    if (sim.branchProg > 0) {
      const bLen = lerp(18, H * .185, sim.branchScale);
      rngSeed = 42;
      drawBranch(cx, trunkTop, Math.PI / 2 + .44 + sim.swayL, bLen, 0, sim.branchDepth, sim.branchProg, sim.leafCol, lerp(3, 7, sim.p), sim.t);
      rngSeed = 84;
      drawBranch(cx, trunkTop, Math.PI / 2 - .44 + sim.swayR, bLen, 0, sim.branchDepth, sim.branchProg, sim.leafCol, lerp(3, 7, sim.p), sim.t);
    }

    drawCorridors(sim, cx, gY);

    // Edge vignette — blends canvas into page background
    const vign = ctx.createRadialGradient(W * .5, H * .45, Math.min(W, H) * .3, W * .5, H * .45, Math.min(W, H) * .85);
    vign.addColorStop(0, 'transparent');
    vign.addColorStop(1, `rgba(245,243,238,0.28)`);
    ctx.fillStyle = vign; ctx.fillRect(0, 0, W, H);
    // Bottom fade — softer transition to page content below
    const bFade = ctx.createLinearGradient(0, H * .78, 0, H);
    bFade.addColorStop(0, 'transparent');
    bFade.addColorStop(1, `rgba(245,243,238,0.42)`);
    ctx.fillStyle = bFade; ctx.fillRect(0, H * .78, W, H * .22);
  }

  function loop() {
    t = performance.now() * 0.001;
    drawFrame(simulate(p, t));
    requestAnimationFrame(loop);
  }

  /* ── ScrollTrigger drives p; RAF draws each frame ── */
  ScrollTrigger.create({
    trigger:  '#tree-section',
    start:    'top top',
    end:      'bottom bottom',
    scrub:    1.2,
    onUpdate: self => { p = self.progress; updateUI(p); updateAirflow(p); }
  });

  loop();
})();

/* ─── ACTIVE NAV ─────────────────────────── */
const secs   = document.querySelectorAll('section[id]');
const nlinks = document.querySelectorAll('.nav-links a');
const so = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      nlinks.forEach(a => a.style.color = '');
      const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (a) a.style.color = 'var(--green-600)';
    }
  });
}, { threshold: 0.4 });
secs.forEach(s => so.observe(s));
