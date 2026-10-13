---
name: kilo-assets
description: Generate KiloAgent technical isometric assets and interactive machine visuals. Use when creating sealed machines, BYOK key vaults, pipeline conduits, approval gates, FLUX or Midjourney prompts, WebP cutouts, or IsometricStage canvas scenes.
---

# KiloAgent technical assets

Produce isometric technical graphics that look like sealed infrastructure hardware, not consumer gadgets or game sprites. Prefer code-driven canvas (`IsometricStage`) when the asset must tilt, pulse, or inspect. Prefer static WebP when the surface cannot run JS.

## Aesthetic contract

Match kilo-ui tokens exactly. Do not invent a parallel palette.

| Token | Value | Use |
| --- | --- | --- |
| `--color-ka-bg` | `#f7f7f8` | Neutral paper ground |
| `--color-ka-surface` | `#ffffff` | Panels, HUD, chip lids |
| `--color-ka-line` | `#d8d8dc` | Hairline 1px edges, grid |
| `--color-ka-ink` | `#111214` | Structure, type, ports |
| `--color-ka-muted` | `#2f3339` | Secondary labels |
| `--color-ka-faint` | `#6b6f76` | Grid dots, idle LEDs |
| `--color-ka-accent` | `#f5b301` | Security seals, amber status, energy |
| Cyan conduit | `#06b6d4` | Data bus, fiber pulses, D1/queue |

Typography: Geist for HUD titles only if needed; **Geist Mono** for every label, status, latency, and spec.

Geometry:

- 30° axonometric isometric. Projection: `isoX = (x - y) * cos(30°)`, `isoY = (x + y) * sin(30°) - z`.
- Hairline 1px strokes. Sharp 2px radii (`--radius-ka-card`). No rounded consumer fillets.
- z is up. Yaw around z, pitch around x. Keep tilt gentle (≤ ~15°).

Materials (always name these in diffusion prompts and canvas fills):

- **Matte polymer / ceramic body** — dry, slightly warm off-white, no plastic gloss.
- **Frosted acrylic glass** — translucent top plate, internal core faintly visible.
- **Brushed metallic ports** — small rectangular I/O, darker than the body.
- **Amber status LEDs** — `#f5b301`, tiny, optically bright, never neon blobs.
- **Soft ambient occlusion** — contact shadow only; no cinematic HDRI, no floor drop-shadow studio.

Composition: object floats on paper or transparent cutout. No environment, no people, no UI chrome inside the render (HUD is HTML, not baked into pixels).

## Diffusion prompt recipe (FLUX / Midjourney)

Lock the camera and materials first, then swap only the subject block. Append the negative prompt on every run. Ask for a cutout (transparent or `#f7f7f8` paper) so marketing and docs can composite.

**Shared prefix**

```
isometric 30-degree axonometric technical product illustration, miniature sealed infrastructure hardware, hairline 1px panel gaps, sharp 2px corners, matte polymer ceramic body, frosted acrylic glass lid, brushed metallic ports, amber LED #f5b301, cyan fiber conduit #06b6d4, soft ambient occlusion, neutral paper #f7f7f8, Geist-like industrial labeling optional and minimal, no environment, studio cutout
```

**Shared negative**

```
photoreal human, cinematic movie still, round consumer gadget, smartphone, game sprite, isometric RPG, voxel, three-quarter perspective, fisheye, lens flare, watermark, text paragraph, cluttered background, drop shadow on infinite black, neon cyberpunk city, wood, leather, toy, cute, glossy candy plastic
```

### 1. Sealed Machine — MicroVM execution unit

```
{SHARED PREFIX}, sealed MicroVM execution chassis in a compact cuboid enclosure, semi-translucent frosted top revealing a dim amber security core, chamfered bevels, amber security seal strip across the lid, brushed I/O ports on the right face, ventilation hairlines on the left, four short metallic feet, looks like a sealed cloud machine / isolated runtime block, {CUTOUT}
```

### 2. BYOK Key Vault — HSM for encrypted API keys

```
{SHARED PREFIX}, hardware security module vault, thicker sealed cuboid with a keyed faceplate, amber lock LED, recessed key-slot and tiny hex fasteners, no screens, stores encrypted API keys, modular brick that can sit beside a MicroVM chassis, {CUTOUT}
```

### 3. Pipeline Conduit — fiber-optic task routing bus

```
{SHARED PREFIX}, low isometric fiber-optic task routing bus, rectangular cable tray with glowing cyan and amber data packets traveling along the conduit, hairline traces, modular connectors at both ends, no chassis dominating the frame, packets read as energy not liquid, {CUTOUT}
```

### 4. Approval Gate — HITL mechanical relay

```
{SHARED PREFIX}, mechanical human-in-the-loop approval gate, isometric relay block with a physical status switch (amber = hold, cyan = pass), visible copper-like contact leaves behind frosted acrylic, latch and solenoid housing, industrial but miniature, {CUTOUT}
```

**Cutout / transparency**

- FLUX: end with `isolated on #f7f7f8 paper background, full object in frame, padding 8%, no ground plane texture`. Then remove the paper in post and export **WebP with alpha**.
- Midjourney: append `--ar 1:1` for icons, `--ar 3:2` for heroes, `--style raw`. Prefer a flat `#f7f7f8` fill; do not use `--stylize` high enough to melt hairlines.
- Never bake a drop shadow into the asset. kilo-ui already has `--shadow-ka-raised` for HUD only.

## Code-driven interactive visuals

Use `<IsometricStage>` from `src/components/isometric-stage.tsx` when the viewer should tilt the machine, inspect modules, or watch conduit pulses. It is a self-contained HTML5 Canvas 2D renderer (no Three.js).

Use static WebP when the asset is an icon, email header, OG image, README badge, or any surface that cannot ship a canvas loop.

| Surface | Size | Format |
| --- | --- | --- |
| Module / vault / gate icon | **512×512** | WebP, alpha |
| Hero / explainer stage | **1200×800** | `<IsometricStage>` (or WebP still if static) |
| Showcase embed | full width × **420px** | canvas, `height={420}` |

```tsx
import { IsometricStage } from "@kiloagent/ui/components/isometric-stage";

<IsometricStage interactive height={420} showControls className="w-full" />
```

Registry: `npx shadcn@latest add KiloAgent/kilo-ui/isometric-stage`

Props: `interactive` (default true) enables pointer tilt, hover HUD, pause/reset. `height` number or CSS string (default `420px`). `showControls` (default true) floating Pause/Play + Reset pill. `className` on the hairline stage frame.

Inspectable default nodes: `Kernel / LLM`, `Vault / Keys`, `Storage / D1`, `Bus / Queue`. HUD shows label, status, p95 latency, spec. Pulses run amber `#f5b301` and cyan `#06b6d4`. Honor `prefers-reduced-motion` by starting paused.

When extending the canvas: keep projection math identical, 1px hairlines, ceramic/glass/metal/LED materials, and Geist Mono HUD. Do not add Three.js, shadows-as-textures, or rounded “pill” hardware.

## Checklist

- [ ] Palette is ka tokens + cyan conduit only
- [ ] 30° isometric, z-up, hairline 1px, 2px radii
- [ ] Materials named: ceramic, frosted acrylic, brushed metal, amber LED, soft AO
- [ ] Icon 512×512 WebP alpha, or hero 1200×800 stage
- [ ] Interactive explainer uses `IsometricStage`, not a 20MB 3D bundle
