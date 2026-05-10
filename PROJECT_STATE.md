# BioAir Brașov — Project State
> Last updated: 2026-05-10 (session 40 — mobile responsiveness pass)

## Files
```
index.html         markup + layout wrapper
style.css          ~1270 lines
script.js          ~1280 lines
assets/beech_tree/ scene.gltf · scene.bin · textures/ (6 PNGs) · license.txt
assets/map/        brasov-base.jpg
assets/podul-viu/  podul-viu.png
```
No build tools. Serve via VS Code Live Server or `python -m http.server`.  
CDN: Google Fonts · GSAP 3.12.5 + ScrollTrigger · Three.js r134 · GLTFLoader r134.

---

## Current State

**All major features complete. Site is visually verified and presentation-ready.**

Section flow:
```
3D Intro (tree scroll, 660vh)
→ Post-tree landing
→ Hero
→ 01 Problema
→ 02 Soluția
→ 03 Fezabilitate
→ 04 Hartă (satellite + BioAir overlay)
→ 05 Inovație (6 cards)
→ Podul Viu (image section, Pilot · Faza II)
→ 06 Implementare (timeline + impact panel)
→ 07 Buget (table + funding sources)
→ Referințe
→ CTA
→ Info proiect + Footer
```

---

## What Changed This Session (Phase 8 + Phase 9)

### Phase 8 — Podul Viu section

- New `<section id="podul-viu">` inserted between `#inovatie` and `#implementare`
- Layout: two-column grid (image 1.1fr / text 1fr), dark background (`--bg-deep`)
- Left: `assets/podul-viu/podul-viu.png` in a rounded `aspect-ratio: 4/3` container with caption overlay
- Right: lead paragraph + 3 labeled rows (Structură / Vegetație / Impact) with hairline borders
- All elements carry `.rv` class — picked up by existing `ScrollTrigger.batch` in script.js
- New CSS block: `.pv-layout`, `.pv-img-wrap`, `.pv-img`, `.pv-img-caption`, `.pv-content`, `.pv-lead`, `.pv-points`, `.pv-pt`, `.pv-pt-label`, `.pv-pt-text`
- Mobile breakpoint: `.pv-layout` added to the `grid-template-columns:1fr` rule at ≤900px

### Phase 9 — Design polish

- **`#implementare` background**: now starts `bg-deep → bg-page` in first 5%, creating a seamless visual bridge from the dark Podul Viu section above
- **Map legend**: removed 2 obsolete items ("Podul Viu pilot", "Zonă poluată") that were relics of the old schematic SVG; legend now shows only Parc / nod verde · Coridor verde BioAir · Tâmpa / Postăvarul
- **Nav**: added "Podul Viu" link between Inovație and Plan
- **CTA**: added "Explorează harta →" fill button alongside the existing ghost button — two-button layout, balanced
- **Budget note**: `font-size: .62rem italic` → `.66rem` non-italic; easier to read
- **`#info-proiect`**: top padding `3rem → 4rem` for breathing room after dark CTA
- **Podul Viu blob**: opacity `0.07 → 0.14` (more visible on dark background)

### Untouched throughout all phases
- `simulate(p, t)` — never modified
- Canvas 2D system, Three.js renderer, GLTF loader, procedural fallbacks
- IntersectionObserver RAF gate, ResizeObserver, pixel-ratio cap
- `assets/beech_tree/` — intact

---

## Next Steps (optional)

- **Performance profile**: DevTools Performance tab on the tree scroll section (not done since Phase 6A)
- **Mobile navigation**: nav links are hidden at ≤900px with no hamburger; acceptable for presentation but not for public launch
