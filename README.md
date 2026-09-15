# HoD Tracker

A simple 100% completion tracker for **Castlevania: Harmony of Despair**, DLC included.

Tracks:

- **Chapter/level clears** per character (all 11 characters × all 11 chapters, base game + DLC)
- **Item collection** — all ~300 equippable items (weapons, armor, accessories, shields, etc), tracked as one shared checklist since HoD's equipment is a shared item stash rather than owned per character
- **Equipped gear** per character — a separate, per-character loadout picker (one item per slot, two for accessories) so you can track what each character is currently wearing/wielding
- **Bestiary** — every common enemy and boss, grouped by chapter, with a bosses-only filter
- **Item details** — click any item for its stats, drop location, and icon (where known)

No database — all progress is saved to your browser's `localStorage`, tied to this browser/device. There's one small server route (`/api/icon`) that proxies item icon images from the Castlevania Wiki's CDN, which blocks direct hotlinking from other sites — see Tech below for what that means for hosting.

## Data

Character, chapter, and item data lives in [`data/game-data.json`](./data/game-data.json). It was compiled from public wikis/guides and cross-checked across a few sources, but Harmony of Despair's per-character equipment restrictions aren't fully verified (see the research notes below) — if you spot something wrong or missing, edit the JSON and open a PR, or just edit it locally.

**Known gaps / things to double check as you play:**

- Whether Julius Belmont and Yoko Belnades shipped in the base game or the first DLC pack is unconfirmed.
- Which exact DLC pack unlocked chapters 7–10 (vs. 11, which shipped with Getsu Fuma) is approximate.
- Equipment is modeled as one global catalog rather than per-character equip lists, since class/weapon-type restrictions couldn't be reliably sourced.
- Food/consumable items are intentionally excluded (not equippables).
- Item icons come from the Castlevania Wiki (fandom.com) where a confident match was found (281/300, via `/api/icon`, which proxies them server-side since the wiki's CDN blocks direct browser hotlinking); the rest fall back to a generic original per-slot icon. Bestiary and item stats/drop locations were compiled from castlevaniacrypt.com.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # eslint
```

## Tech

Next.js (App Router) + TypeScript + Tailwind CSS. Almost everything is client-side, driven by `localStorage` — the one exception is `/api/icon`, a small server route that proxies item icon images (see Data above). That route means this needs a Node-capable host (Vercel, Netlify, etc.) rather than a plain static host like GitHub Pages.
