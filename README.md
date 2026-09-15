# HoD Tracker

A simple 100% completion tracker for **Castlevania: Harmony of Despair**, DLC included.

Tracks:

- **Chapter/level clears** per character (all 11 characters × all 11 chapters, base game + DLC)
- **Item collection** — all ~300 equippable items (weapons, armor, accessories, shields, etc), tracked as one shared checklist since HoD's equipment is a shared item stash rather than owned per character
- **Equipped gear** per character — a separate, per-character loadout picker (one item per slot, two for accessories) so you can track what each character is currently wearing/wielding

No backend — all progress is saved to your browser's `localStorage`, tied to this browser/device.

## Data

Character, chapter, and item data lives in [`data/game-data.json`](./data/game-data.json). It was compiled from public wikis/guides and cross-checked across a few sources, but Harmony of Despair's per-character equipment restrictions aren't fully verified (see the research notes below) — if you spot something wrong or missing, edit the JSON and open a PR, or just edit it locally.

**Known gaps / things to double check as you play:**

- Whether Julius Belmont and Yoko Belnades shipped in the base game or the first DLC pack is unconfirmed.
- Which exact DLC pack unlocked chapters 7–10 (vs. 11, which shipped with Getsu Fuma) is approximate.
- Equipment is modeled as one global catalog rather than per-character equip lists, since class/weapon-type restrictions couldn't be reliably sourced.
- Food/consumable items are intentionally excluded (not equippables).

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build (fully static)
npm run lint    # eslint
```

## Tech

Next.js (App Router) + TypeScript + Tailwind CSS. No database — everything is a static export driven by `localStorage`.
