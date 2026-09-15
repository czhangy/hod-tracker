# HoD Tracker

A simple 100% completion tracker for **Castlevania: Harmony of Despair**, DLC included.

Tracks:

- **Chapter/level clears** per character (all 11 characters × all 11 chapters, base game + DLC)
- **Item collection** — 474 collectible items across 25 categories (every weapon type — swords, katanas, axes, cestuses, cudgels, daggers, great swords, lances, rapiers, firearms, other weapons, sub-weapons — plus armor, headgear, leg protection, cloaks, shields, accessories, spells, glyphs, dark magic scrolls, martial arts, Soma's three soul colors, and a handful of rare Hard Mode "+1" weapon upgrades), tracked as one shared checklist since HoD's item stash is shared, not owned per character. Click any item for its stats, drop location, and icon.
- **Leveling** — Soma's Souls (and any future item flagged the same way) are collected in duplicate to level up, so those are tracked by a +/− count instead of a plain checkbox.
- **Character portraits** — real art per character, pulled from the Castlevania Wiki.

No database — all progress is saved to your browser's `localStorage`, tied to this browser/device. There's one small server route (`/api/icon`) that proxies item icons and character portraits from the Castlevania Wiki's CDN and castlevaniacrypt.com, both of which block direct hotlinking — see Tech below for what that means for hosting.

## Data

Character, chapter, and item data lives in [`data/game-data.json`](./data/game-data.json). It was compiled from public wikis/guides (castlevaniacrypt.com and castlevania.fandom.com) and cross-checked across sources — if you spot something wrong or missing, edit the JSON and open a PR, or just edit it locally.

**Known gaps / things to double check as you play:**

- Whether Julius Belmont and Yoko Belnades shipped in the base game or the first DLC pack is unconfirmed.
- Which exact DLC pack unlocked chapters 7–10 (vs. 11, which shipped with Getsu Fuma) is approximate.
- Equipment is modeled as one global catalog rather than per-character equip lists — per-character weapon/armor-class restrictions (e.g. only Alucard can use shields, souls are Soma-only) aren't enforced in the UI, only reflected in item labels/notes where known.
- Food/consumable items are intentionally excluded (not equippables).
- The rare Hard Mode boss-chest "+1" weapon upgrades (e.g. Valmanway +1, Yasutsuna +1) are only sparsely documented anywhere online — 6 are included here (Valmanway, Kaiser Knuckle, Alucard Sword, Claimh Solais, Yasutsuna, Muramasa), each sourced secondhand from community threads rather than a primary database, since castlevaniacrypt.com doesn't list this tier at all. Player reports suggest more weapons (and possibly armor) have undocumented +1 versions beyond these 6 — worth verifying/adding as you encounter them in-game.
- A handful of items have no stat bonus (confirmed, not a gap) and some have no matched icon and fall back to a generic per-slot icon.

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

Next.js (App Router) + TypeScript + Tailwind CSS. Almost everything is client-side, driven by `localStorage` — the one exception is `/api/icon`, a small server route that proxies images (see Data above). That route means this needs a Node-capable host (Vercel, Netlify, etc.) rather than a plain static host like GitHub Pages.
