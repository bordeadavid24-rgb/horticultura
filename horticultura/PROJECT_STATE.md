# BioAir Brașov — Project State
> Last updated: 2026-05-06 (session 34)

## Files
```
index.html         markup + layout wrapper
style.css          ~1170 lines
script.js          ~1230 lines
assets/beech_tree/ scene.gltf · scene.bin · textures/ (6 PNGs) · license.txt
```
No build tools. Serve via VS Code Live Server or `python -m http.server`.  
CDN: Google Fonts · GSAP 3.12.5 + ScrollTrigger · Three.js r134 · GLTFLoader r134.

---

## What Changed This Session

**Phase 4E — lightweight procedural 3D city added to Three.js scene (script.js)**

### 3D city group (`cityGroup`)
- `cityGroup` declared alongside existing Three.js variables (`threeFlow`, `groundShadow`, etc.)
- `buildCity3D()` IIFE runs synchronously after `initThree()`, before the ResizeObserver
- 18 `BoxGeometry` buildings placed in `threeScene` (not `treeGroup`) so world-scale is fixed while the tree scales up with scroll
- ~216 triangles total — no measurable performance impact
- Buildings arranged in four groups:
  - **Left/right wings** — radius 2.8–5.2, Z −0.6 to −4.5 (mid-fog, visible during orbit)
  - **Center background** — Z −4.5 to −6.5 (tower silhouettes, deep fog)
  - **Far sides** — X ±5.5–6.5, visible during the 2.5-turn overhead orbit
- All buildings: `MeshStandardMaterial`, `roughness: 0.92`, soft blue-gray palette (`0xb3bac3`–`0xcbcfc6`)
- Ground-aligned: `position.y = −0.40 + height/2` (matches `treeGroup.position.y`)

### 2D city buildings suppressed when Three.js active
- `drawCity()` building `forEach` wrapped in `if (!threeRenderer)` — same pattern as 2D tree suppression
- Canvas sky, ground gradient, road, dashes, mountain, horizon haze: all preserved and always drawn

### Preserved
- `simulate(p, t)` — untouched
- Canvas fallback: if `threeRenderer` undefined, 2D buildings draw normally
- GLTF fallback: if beech fails, procedural Three.js tree + 3D city still render
- All other draw functions untouched

---

## Current State

Phase 4E prototype complete. The Three.js scene now contains a lightweight procedural city of 18 low-poly buildings that share the same camera as the beech tree. As the camera orbits and rises overhead (`p ≈ 0.3–0.5`), buildings emerge from the scene fog as soft atmospheric silhouettes — proper 3D perspective, foreshortening, and depth. The 2D canvas provides sky, ground, road, and atmosphere; the 3D city provides building geometry. Not yet browser-verified.

---

## Next Step

**Phase 4E browser verification:**
1. Open in Live Server / `python -m http.server`.
2. Scroll through the full tree section — confirm 3D buildings appear during the overhead camera phase (`p ≈ 0.4–0.5`).
3. Check that buildings feel like soft background (not Minecraft) — adjust `DEFS` Z-values or heights in [script.js:441](script.js#L441) if needed.
4. Confirm no console errors and no visible 2D building rectangles when Three.js is active.
5. After sign-off: consider per-frame `greenTint` color shift on buildings (Phase 4F), or a subtle ground plane mesh to anchor the city to the tree's base.
