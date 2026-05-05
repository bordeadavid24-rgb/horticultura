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
  /* Hero entrance — scroll-triggered so elements emerge from scroll momentum,
     not from page load. Fires once when #hero enters the viewport. */
  const heroTl = gsap.timeline({ paused: true, defaults: { ease: 'power1.out' } });
  heroTl
    .fromTo('.hero-eyebrow',
            { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.80 })
    .fromTo(['.hero-title .word-light', 'h1.hero-title em', '.hero-title .word-main'],
            { opacity: 0, y: 18 }, { opacity: 1, y: 0, stagger: 0.10, duration: 0.75 }, '-=0.42')
    .fromTo('.hero-body',
            { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.65 }, '-=0.28')
    .fromTo('.hero-actions',
            { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.60 }, '-=0.38')
    .fromTo('.hero-stats',
            { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.65 }, '-=0.50')
    .fromTo('.scroll-cue',
            { opacity: 0, y: 8  }, { opacity: 1, y: 0, duration: 0.55 }, '+=0.08');

  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top 82%',
    once: true,
    onEnter: () => heroTl.play()
  });

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

  /* Section reveals — softer ease and reduced stagger keeps elements feeling
     like they surface from the field rather than dropping in as UI. */
  ScrollTrigger.batch('.rv', {
    onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.70, ease: 'power1.out', stagger: 0.05 }),
    start: 'top 90%',
    once: true
  });

  /* Post-tree landing — atmospheric scrub reveal.
     Each element carries a distinct scrub lag so they settle at different rates,
     producing a depth-layered float that continues the simulation's scroll momentum
     into the DOM layer rather than snapping in as a separate UI event. */
  const ptST = { trigger: '#post-tree', start: 'top 92%', end: 'top 15%' };
  gsap.fromTo('.pt-label',   { opacity: 0, y: 16 }, { opacity: 0.85, y: 0, ease: 'power2.out', scrollTrigger: { ...ptST, scrub: 1.4 } });
  gsap.fromTo('.pt-title',   { opacity: 0, y: 24 }, { opacity: 0.90, y: 0, ease: 'power2.out', scrollTrigger: { ...ptST, scrub: 1.8 } });
  gsap.fromTo('.pt-body',    { opacity: 0, y: 14 }, { opacity: 0.88, y: 0, ease: 'power2.out', scrollTrigger: { ...ptST, scrub: 2.4 } });
  gsap.fromTo('.pt-divider', { opacity: 0, scaleX: 0 }, { opacity: 0.55, scaleX: 1, ease: 'power2.out', scrollTrigger: { ...ptST, scrub: 1.6 } });
  gsap.fromTo('.pt-footnote',{ opacity: 0, y: 8  }, { opacity: 0.70, y: 0, ease: 'power2.out', scrollTrigger: { ...ptST, scrub: 2.8 } });

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

  /* ── AMBIENT DOM BREATHING ──────────────────────────────────────────────────
     Extends the canvas's continuous time-based life into the DOM layer.
     Targets container elements only — never children under active GSAP control.

     Frequency range: 9–27 s periods, matching canvas leaf-sway (~15 s primary,
     ~48 s secondary via simulate() swayL/swayR). Negative delays seed each
     element at a different phase in its cycle so no two containers pulse together.

     All values are sub-2 px / ≤ 0.12 opacity swing — below the threshold of
     conscious detection. The motion reads as environment, not animation.
  ────────────────────────────────────────────────────────────────────────── */

  /* Post-tree block — slowest drift, matches the atmospheric scrub zone */
  gsap.to('.post-tree-inner', { y: 1.5, duration: 11,   ease: 'sine.inOut', repeat: -1, yoyo: true, delay: -4.2 });

  /* Hero content — two-column grid treated as one atmospheric body */
  gsap.to('.hero-inner',      { y: 1.0, duration: 14,   ease: 'sine.inOut', repeat: -1, yoyo: true, delay: -7.1 });

  /* CTA block */
  gsap.to('.cta-in',          { y: 1.0, duration: 13,   ease: 'sine.inOut', repeat: -1, yoyo: true, delay: -5.5 });

  /* Content section containers — desynchronised via prime-ish duration offsets
     so no two sections are ever at the same point in their drift cycle */
  gsap.utils.toArray('.sec-inner').forEach((el, i) => {
    gsap.to(el, {
      y:        i % 2 === 0 ? 1.2 : 0.9,
      duration: 9.4 + i * 2.3,
      ease:     'sine.inOut',
      repeat:   -1,
      yoyo:     true,
      delay:    -(i * 3.7 + 1.6)
    });
  });

  /* Eyebrow labels — gentle opacity breath. Already low-contrast by design,
     so a 1.0→0.88 swing over 12–27 s reads as the label inhabiting the
     same atmospheric layer as the canvas text. */
  gsap.utils.toArray('.sec-eyebrow').forEach((el, i) => {
    gsap.to(el, {
      opacity:  0.88,
      duration: 12.4 + i * 2.1,
      ease:     'sine.inOut',
      repeat:   -1,
      yoyo:     true,
      delay:    -(i * 2.9 + 1.1)
    });
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

  /* ── THREE.JS PARALLEL RENDERER ────────────────────────────────────────────
     Runs alongside drawFrame(sim). Same sim object, parallel render path.
     Trunk: CylinderGeometry (MeshStandardMaterial, lit).
     Branches: InstancedMesh — 800 pre-allocated cylinder instances.
       buildBranches3D() mirrors Canvas drawBranch() recursion exactly.
       Per instance: position at segment midpoint, rotation from branch angle,
       scaleY = segment length, scaleX/Z = depth-tapered thickness.
       Sway enters via initial branch angles and propagates through hierarchy.
       Colour lerps trunk-brown → olive-green with depth.
     Remove this block + #three-canvas in index.html to fully revert.
  ─────────────────────────────────────────────────────────────────────────── */
  const threeCanvas = document.getElementById('three-canvas');
  let threeRenderer, threeScene, threeCamera, threeTrunk, threeBranches, threeLeaves;
  let threeFlow, flowGeo, flowData;
  const FLOW_N = 32;

  // Identical LCG to Canvas rng() — separate seed so Canvas RNG is unaffected
  let rng3DSeed = 0;
  function rng3D() { rng3DSeed = (rng3DSeed * 9301 + 49297) % 233280; return rng3DSeed / 233280; }

  let branchSegCount = 0;
  let leafInstCount  = 0;
  // Scratch objects allocated once — reused every frame, no per-frame heap pressure
  const _obj        = new THREE.Object3D();
  const _col        = new THREE.Color();
  const _colTrunk   = new THREE.Color(0x7a5c38);  // warm desaturated bark brown
  const _colTip     = new THREE.Color(0x566040);  // grey-olive for outer twigs
  const _leafCol    = new THREE.Color();
  const _colLeafA   = new THREE.Color(0x3d7228);  // deep forest green
  const _colLeafB   = new THREE.Color(0x6aaa38);  // natural mid green
  const _leafData   = Array.from({ length: 1200 }, () => ({ x: 0, y: 0, z: 0, phase: 0, branchAngle: 0, tiltX: 0, scaleV: 1, cg: 0 }));

  // Leaf-shaped BufferGeometry — 8-segment fan, 0.44:1 width:height ratio.
  // Allocated once, reused by InstancedMesh; no per-frame allocations.
  function makeLeafGeo() {
    const pos = [], idx = [], n = 8;
    pos.push(0, 0, 0);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      pos.push(0.22 * Math.sin(a), 0.50 * Math.cos(a), 0);
    }
    for (let i = 0; i < n; i++) idx.push(0, 1 + i, 1 + (i + 1) % n);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  }

  (function initThree() {
    const W3 = 480, H3 = 360;
    threeRenderer = new THREE.WebGLRenderer({ canvas: threeCanvas, alpha: true, antialias: true });
    // updateStyle:false — CSS owns display size; buffer stays at W3×H3
    threeRenderer.setSize(W3, H3, false);
    threeRenderer.setClearColor(0x000000, 0);

    threeScene = new THREE.Scene();
    // Fog color matches page background (rgb 245,243,238 ≈ 0xf5f3ee); linear, starts
    // just in front of tree so depth Z-layers fade naturally toward far end
    threeScene.fog = new THREE.Fog(0xf2f0ea, 4.0, 8.0);

    threeCamera = new THREE.PerspectiveCamera(48, W3 / H3, 0.1, 100);
    threeCamera.position.set(0, 0.5, 4.5);
    threeCamera.lookAt(0, 0.2, 0);

    // Ambient: kept low so directional lights define form rather than flatten everything
    threeScene.add(new THREE.AmbientLight(0xd4e8f0, 0.18));

    // Key light — warm, upper-left-front; primary source of highlights on branches
    const keyLight = new THREE.DirectionalLight(0xfff0d0, 1.10);
    keyLight.position.set(-2.0, 4.0, 2.0);
    threeScene.add(keyLight);

    // Fill light — cool, from right at mid-height; softens key-side shadows
    const fillLight = new THREE.DirectionalLight(0xb8d4f0, 0.38);
    fillLight.position.set(2.8, 0.8, 1.5);
    threeScene.add(fillLight);

    // Rim light — very low, from behind; outlines tips against background
    const rimLight = new THREE.DirectionalLight(0xd0f0d8, 0.22);
    rimLight.position.set(0.3, 1.5, -3.5);
    threeScene.add(rimLight);

    // Trunk — dark bark, high roughness for matte woody look
    const trunkGeo = new THREE.CylinderGeometry(0.06, 0.14, 2.2, 7);
    threeTrunk = new THREE.Mesh(trunkGeo, new THREE.MeshStandardMaterial({ color: 0x6e5030, roughness: 0.90 }));
    threeTrunk.position.y = -0.3;
    threeScene.add(threeTrunk);

    // Branches — white base so instance colors are not tinted (same as leaves)
    const branchGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 6);
    const branchMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
    threeBranches = new THREE.InstancedMesh(branchGeo, branchMat, 800);
    threeBranches.count = 0;
    // Pre-init instanceColor so Three.js compiles the shader with USE_INSTANCING_COLOR
    // from the first frame. Without this, the shader is compiled while instanceColor
    // is null (branchProg=0 at load), and later setColorAt calls are silently ignored.
    threeBranches.setColorAt(0, _colTrunk);
    threeScene.add(threeBranches);

    // Leaves — white base so instance colors are not tinted; leaf-shaped geometry
    const leafGeo = makeLeafGeo();
    const leafMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.75, side: THREE.DoubleSide });
    threeLeaves = new THREE.InstancedMesh(leafGeo, leafMat, 1200);
    threeLeaves.count = 0;
    // Same pre-init for leaves — forces instance color path in shader from first compile.
    threeLeaves.setColorAt(0, _colLeafA);
    threeScene.add(threeLeaves);

    // Airflow wisps — 4 pts per wisp (left, mid, mid, right) so LineSegments draws
    // two connected sub-segments whose midpoint can arc independently.
    // depthWrite:false, fog:true — same depth integration as before.
    const flowBuf = new Float32Array(FLOW_N * 12); // 4 pts × 3 floats per wisp
    flowGeo = new THREE.BufferGeometry();
    flowGeo.setAttribute('position', new THREE.BufferAttribute(flowBuf, 3));
    threeFlow = new THREE.LineSegments(flowGeo, new THREE.LineBasicMaterial({
      color: 0xaaccb8, opacity: 0.07, transparent: true, fog: true, depthWrite: false
    }));
    threeScene.add(threeFlow);

    // Wisp properties — one seeded LCG run at init, never touched again.
    // First 62% are canopy-biased (Y ∈ [0.1, 1.4]) for density near leaf clusters.
    let fSeed = 7919;
    const fRng = () => { fSeed = (fSeed * 9301 + 49297) % 233280; return fSeed / 233280; };
    const _cc = Math.floor(FLOW_N * 0.62);
    flowData = Array.from({ length: FLOW_N }, (_, i) => ({
      baseY:   i < _cc ? 0.10 + fRng() * 1.30   // canopy zone: trunk-top → above crown
                       : -0.60 + fRng() * 2.40,  // full range: sub-trunk → sky
      z:       -0.35 + fRng() * 0.70,
      phase:    fRng() * 7.0,
      speed:    0.20  + fRng() * 0.15,
      halfLen:  0.10  + fRng() * 0.15,
      dy:      (fRng() - 0.5) * 0.08,
      vy:       0.02  + fRng() * 0.04,   // vertical undulation amplitude
      vFreq:    0.25  + fRng() * 0.30,   // undulation frequency, rad/s
    }));
  })();

  // Mirrors Canvas drawBranch() recursion exactly.
  // Coordinate space: +x right, +y up (Three.js), z = 0 (flat tree facing camera).
  // lerp/clamp are hoisted function declarations — safe to call before their source.
  function buildBranches3D(x1, y1, angle, len, depth, maxD, prog) {
    const bp = clamp((prog - depth / maxD * 0.55) / (1 / maxD * 0.9), 0, 1);
    if (bp <= 0 || branchSegCount >= 800) return;

    // Per-branch organic variation — all seeded via rng3D so the tree is
    // identical each run. Seed resets to 42/84 in renderThree before each arm.
    const lenVar   = 0.91 + rng3D() * 0.18;                            // ±9 % length noise
    const thickVar = 0.84 + rng3D() * 0.32;                            // ±16 % thickness noise
    const cr       = (rng3D() - 0.5) * 0.07;                           // colour noise R
    const cg       = (rng3D() - 0.5) * 0.06;                           // colour noise G
    const cb       = (rng3D() - 0.5) * 0.05;                           // colour noise B
    // Outer branches wobble more — inner scaffold stays clean
    const bendFrac = (rng3D() - 0.5) * lerp(0.08, 0.22, depth / maxD);

    const segLen = len * bp * lenVar;
    const x2 = x1 + Math.cos(angle) * segLen;
    const y2 = y1 + Math.sin(angle) * segLen;

    // Power curve taper: gradual for primary scaffold, rapid at outer twigs.
    // Base range 0.068→0.016: depth-0 just under trunk-top radius (0.06); twigs
    // stay thick enough to read against leaves and support visual weight.
    const thickness = lerp(0.068, 0.016, Math.pow(depth / maxD, 0.75)) * thickVar;

    _col.lerpColors(_colTrunk, _colTip, depth / maxD);
    _col.r = Math.max(0, Math.min(1, _col.r + cr));
    _col.g = Math.max(0, Math.min(1, _col.g + cg));
    _col.b = Math.max(0, Math.min(1, _col.b + cb));

    // Micro-bending: offset midpoint perpendicularly, emit two sub-cylinders.
    // (-sin, cos) is the unit perpendicular to (cos, sin) rotated 90° CCW.
    const perpX = -Math.sin(angle) * bendFrac * segLen;
    const perpY =  Math.cos(angle) * bendFrac * segLen;
    const midX  = (x1 + x2) * 0.5 + perpX;
    const midY  = (y1 + y2) * 0.5 + perpY;

    // Trunk forward, tips back — wider range gives fog a stronger depth gradient
    const zOff = (0.5 - depth / maxD) * 0.35;
    let sa, sl;

    // First half: x1 → mid
    sa = Math.atan2(midY - y1, midX - x1);
    sl = Math.hypot(midX - x1, midY - y1);
    _obj.position.set((x1 + midX) * 0.5, (y1 + midY) * 0.5, zOff);
    _obj.rotation.set(0, 0, sa - Math.PI / 2);
    _obj.scale.set(thickness, sl, thickness);
    _obj.updateMatrix();
    threeBranches.setMatrixAt(branchSegCount, _obj.matrix);
    threeBranches.setColorAt(branchSegCount, _col);
    branchSegCount++;

    // Second half: mid → x2
    if (branchSegCount < 800) {
      sa = Math.atan2(y2 - midY, x2 - midX);
      sl = Math.hypot(x2 - midX, y2 - midY);
      _obj.position.set((midX + x2) * 0.5, (midY + y2) * 0.5, zOff);
      _obj.rotation.set(0, 0, sa - Math.PI / 2);
      _obj.scale.set(thickness, sl, thickness);
      _obj.updateMatrix();
      threeBranches.setMatrixAt(branchSegCount, _obj.matrix);
      threeBranches.setColorAt(branchSegCount, _col);
      branchSegCount++;
    }

    if (bp > 0.8 && depth < maxD) {
      const spread = lerp(0.52, 0.36, depth / maxD);
      const nl     = len * lerp(0.73, 0.65, depth / maxD);
      // Angle jitter: tighter at scaffold, looser at outer twigs for organic silhouette
      const angVar = lerp(0.06, 0.30, depth / maxD);
      rng3D(); const jL = (rng3D() - 0.5) * angVar;
      rng3D(); const jR = (rng3D() - 0.5) * angVar;
      buildBranches3D(x2, y2, angle + spread + jL, nl, depth + 1, maxD, prog);
      buildBranches3D(x2, y2, angle - spread + jR, nl, depth + 1, maxD, prog);
      if (depth < maxD - 2 && rng3D() > 0.45)
        buildBranches3D(x2, y2, angle + (rng3D() - 0.5) * 0.4, nl * 0.55, depth + 2, maxD, prog);
    }

    // Leaf cluster at branch tips — outer 2 depth levels, after all recursion.
    // Placement biased along and perpendicular to branch direction so leaves
    // feel attached to the twig rather than floating as a uniform cloud.
    if (depth >= maxD - 1 && bp > 0.75 && leafInstCount < 1195) {
      const cnt = 3 + Math.floor(rng3D() * 4);  // 3–6 leaves per tip
      const bDx = Math.cos(angle);  // branch direction X
      const bDy = Math.sin(angle);  // branch direction Y
      const pDx = -bDy;             // perpendicular X
      const pDy =  bDx;             // perpendicular Y
      for (let i = 0; i < cnt && leafInstCount < 1200; i++) {
        const ld      = _leafData[leafInstCount];
        // along: 0→+0.07 (forward from tip), never behind; perp: ±0.065
        const along   = rng3D() * 0.07;
        const perp    = (rng3D() - 0.5) * 0.13;
        ld.x          = x2 + along * bDx + perp * pDx;
        ld.y          = y2 + along * bDy + perp * pDy;
        ld.phase      = rng3D() * Math.PI * 2;
        // Z rotation centered on branch direction with ±34° spread
        ld.branchAngle = angle - Math.PI * 0.5 + (rng3D() - 0.5) * 1.2;
        // Static per-leaf X tilt for 3D depth — so leaves face different angles
        ld.tiltX      = (rng3D() - 0.5) * 0.65;
        ld.scaleV     = 0.55 + rng3D() * 0.50;  // 0.55–1.05, smaller outer leaves
        ld.cg         = rng3D();
        ld.z          = (0.5 - depth / maxD) * 0.35 + (rng3D() - 0.5) * 0.08;
        leafInstCount++;
      }
    }
  }

  function renderThree(sim) {
    threeTrunk.scale.y = 0.05 + sim.trunkGrowth * 0.95;
    threeTrunk.scale.x = 0.4 + sim.trunkWeight * 0.6;
    threeTrunk.scale.z = 0.4 + sim.trunkWeight * 0.6;
    const trunkTop = -0.3 + 1.1 * threeTrunk.scale.y;

    branchSegCount = 0;
    leafInstCount  = 0;
    if (sim.branchProg > 0) {
      const bLen = lerp(0.1, 0.9, sim.branchScale);
      rng3DSeed = 42;
      buildBranches3D(0, trunkTop, Math.PI / 2 + 0.44 + sim.swayL, bLen, 0, sim.branchDepth, sim.branchProg);
      rng3DSeed = 84;
      buildBranches3D(0, trunkTop, Math.PI / 2 - 0.44 + sim.swayR, bLen, 0, sim.branchDepth, sim.branchProg);
    }

    threeBranches.count = branchSegCount;
    threeBranches.instanceMatrix.needsUpdate = true;
    if (threeBranches.instanceColor) threeBranches.instanceColor.needsUpdate = true;

    // Animate leaf instances — positions set during branch traversal, airflow + flutter added here
    threeLeaves.count = leafInstCount;

    // Global airflow vector — slow drift, +X bias with slight upward lift
    const afTime = sim.t * 0.055;
    const afX    = 0.022 + 0.010 * Math.sin(afTime);
    const afY    = 0.010 + 0.005 * Math.sin(afTime * 1.41 + 0.6);
    // Canopy wave — same base frequency for all leaves; ld.x shifts phase so
    // the wave travels in the wind direction (+X) rather than pulsing uniformly
    const waveT  = sim.t * 0.38;

    for (let i = 0; i < leafInstCount; i++) {
      const ld   = _leafData[i];

      // Existing flutter — kept as secondary, high-frequency motion
      const flt  = 0.009 * Math.sin(sim.t * 2.3 + ld.phase);
      const fltY = 0.006 * Math.sin(sim.t * 1.7 + ld.phase + 1.1);

      // Depth-based reactivity: scaleV 0.55–1.05 → react 1.25–0.75
      // Smaller (outer) leaves swing more; larger (inner) leaves are damped
      const react = 1.25 - (ld.scaleV - 0.55) * 1.0;

      // Traveling wave: spatial phase from ld.x makes the wave propagate +X
      // through canopy; ld.phase * 0.15 adds per-leaf variation without
      // breaking the group coherence
      const wave  = Math.sin(waveT - ld.x * 3.0 + ld.phase * 0.15);

      // Airflow displacement — added to base position, never overrides it
      const dispX = (afX + wave * 0.014) * react;
      const dispY = (afY + wave * 0.007) * react;

      _obj.position.set(ld.x + dispX + flt, ld.y + dispY + fltY, ld.z + flt * 0.5);

      // Rotation: permanent Y-axis lean into wind + wave nod on X-axis
      // ld.phase static tilt preserved from original; flt*6 flutter on Z preserved
      const tiltY = 0.12 * react;
      const tiltX = 0.10 * wave * react + 0.28 * Math.sin(ld.phase);
      // tiltX: dynamic airflow lean + ld.tiltX static per-leaf 3D orientation
      _obj.rotation.set(tiltX + ld.tiltX, tiltY, ld.branchAngle + flt * 4);

      _obj.scale.setScalar(0.044 * ld.scaleV);
      _obj.updateMatrix();
      threeLeaves.setMatrixAt(i, _obj.matrix);
      _leafCol.lerpColors(_colLeafA, _colLeafB, ld.cg);
      threeLeaves.setColorAt(i, _leafCol);
    }
    threeLeaves.instanceMatrix.needsUpdate = true;
    if (threeLeaves.instanceColor) threeLeaves.instanceColor.needsUpdate = true;

    // Update airflow wisps — two sub-segments per wisp (left→mid, mid→right).
    // The midpoint arcs upward inside the canopy X zone, simulating flow deflected
    // by the leaf mass. Arc is always ≥ 0 (air lifts over the dome, never pushes down).
    const _fp   = flowGeo.attributes.position.array;
    const _trav = 7.0;
    for (let i = 0; i < FLOW_N; i++) {
      const fd  = flowData[i];
      const cx  = (sim.t * fd.speed + fd.phase) % _trav - _trav * 0.5;
      const xl  = cx - fd.halfLen;
      const xr  = cx + fd.halfLen;

      // Per-wisp vertical undulation — slow, independent of canopy
      const yBase = fd.baseY + fd.vy * Math.sin(sim.t * fd.vFreq + fd.phase);

      // Canopy arc at midpoint: strongest when cx is near tree center (|cx| < 1.1),
      // only for wisps already in canopy Y band. Oscillates gently so it reads as
      // living breath rather than a fixed deflector shape.
      const cxFactor = Math.max(0, 1.0 - Math.abs(cx) / 1.1);
      const cyFactor = fd.baseY > 0.1 && fd.baseY < 1.5 ? 1.0 : 0.25;
      const arc = cxFactor * cyFactor * (0.04 + 0.03 * Math.sin(sim.t * 0.32 + fd.phase * 1.4));

      const yL = yBase + fd.dy * (-fd.halfLen);
      const yM = yBase + arc;
      const yR = yBase + fd.dy * fd.halfLen;
      const b  = i * 12;

      _fp[b     ] = xl;  _fp[b +  1] = yL;  _fp[b +  2] = fd.z;  // left
      _fp[b +  3] = cx;  _fp[b +  4] = yM;  _fp[b +  5] = fd.z;  // mid
      _fp[b +  6] = cx;  _fp[b +  7] = yM;  _fp[b +  8] = fd.z;  // mid (dup for seg 2 start)
      _fp[b +  9] = xr;  _fp[b + 10] = yR;  _fp[b + 11] = fd.z;  // right
    }
    flowGeo.attributes.position.needsUpdate = true;

    threeRenderer.render(threeScene, threeCamera);
  }

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
    const sim = simulate(p, t);
    drawFrame(sim);
    renderThree(sim);
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
