# kilo-ui

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Dense technical UI kit for [KiloAgent](https://www.kiloagent.com). Sharp edges, 1px hairline borders, small radii, Geist + Geist Mono. Built on [shadcn/ui](https://ui.shadcn.com) (Lyra / base-nova style) and `@base-ui/react`.

The visual language is inspired by Blueprint’s dense, technical look. This project, package, style, and registry are named **kilo-ui** only.

## Install from the GitHub registry

This repository is a [shadcn GitHub registry](https://ui.shadcn.com/docs/registry/github). `registry.json` lives at the repo root.

```bash
# List items
npx shadcn@latest list KiloAgent/kilo-ui

# Validate
npx shadcn@latest registry validate KiloAgent/kilo-ui

# Add the theme (CSS + fonts)
npx shadcn@latest add KiloAgent/kilo-ui/theme

# Add a component
npx shadcn@latest add KiloAgent/kilo-ui/button

# Marketing block
npx shadcn@latest add KiloAgent/kilo-ui/marketing-section
```

Files land under `components/kilo-ui/` (same layout as `src/`, so relative imports between items keep working); fonts go to `public/fonts/`. Then import the theme from your global CSS:

```css
@import "tailwindcss";
@import "./components/kilo-ui/theme.css";
@import "./components/kilo-ui/base.css";
```

Pin a commit when you want a frozen install:

```bash
npx shadcn@latest add KiloAgent/kilo-ui/button#<full-sha>
```

## Use as an npm package

Package name: `@kiloagent/ui`. Until it is published to the npm registry, install from GitHub:

```bash
npm install github:KiloAgent/kilo-ui
# or pin:
npm install github:KiloAgent/kilo-ui#<full-sha>
```

```ts
import { Button } from "@kiloagent/ui/components/button";
import { Section } from "@kiloagent/ui/marketing/section";
import "@kiloagent/ui/theme.css";
import "@kiloagent/ui/base.css";
```

Copy `src/fonts/*.woff2` into your app’s `public/fonts/` (theme `@font-face` URLs point at `/fonts/...`).

Peer deps: `react` and `react-dom` ^19. Runtime deps: `@base-ui/react`, `class-variance-authority`, `clsx`, `lucide-react`, `tailwind-merge`. Tailwind CSS v4 required for `@theme` / `@source`.

## What’s inside

| Area | Path | Registry type |
| --- | --- | --- |
| Theme + base | `src/theme.css`, `src/base.css` | `registry:style` (`theme`) |
| Primitives | `src/components/*` | `registry:ui` |
| Marketing blocks | `src/marketing/*` | `registry:block` |
| Helpers | `src/lib/cn.ts`, `src/lib/field-styles.ts` | `registry:lib` |
| Fonts | `src/fonts/` (Geist OFL) | shipped with `theme` |

## Maintaining the registry

`registry.json` is generated from `src/`. After adding or changing a file, run:

```bash
node scripts/gen-registry.mjs
npx shadcn@latest registry validate KiloAgent/kilo-ui
```

## Showcase

Open [`docs/showcase/index.html`](docs/showcase/index.html) in a browser for a static token and chrome preview. Live kitchen-sink on the KiloAgent site: [kiloagent.com/ui](https://www.kiloagent.com/ui) (noindex).

## License

MIT © KiloAgent. Geist fonts: see `src/fonts/OFL.txt`.
