/** Purely cosmetic per-character accent color + initials, used for the avatar badges. */
export const CHARACTER_AVATAR: Record<string, { color: string; glow: string }> = {
  alucard: { color: "#38bdf8", glow: "#0c4a6e" },
  "soma-cruz": { color: "#a78bfa", glow: "#3b0764" },
  "jonathan-morris": { color: "#fb923c", glow: "#7c2d12" },
  "charlotte-aulin": { color: "#f472b6", glow: "#831843" },
  shanoa: { color: "#c084fc", glow: "#4c1d95" },
  "julius-belmont": { color: "#f87171", glow: "#7f1d1d" },
  "yoko-belnades": { color: "#4ade80", glow: "#14532d" },
  "richter-belmont": { color: "#fb7185", glow: "#881337" },
  "maria-renard": { color: "#facc15", glow: "#713f12" },
  "simon-belmont": { color: "#d6a35c", glow: "#5c3a1e" },
  "getsu-fuma": { color: "#2dd4bf", glow: "#134e4a" },
};

const FALLBACK = { color: "#dc2626", glow: "#450a0a" };

export function avatarStyleFor(characterId: string) {
  return CHARACTER_AVATAR[characterId] ?? FALLBACK;
}

export function initialsFor(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
