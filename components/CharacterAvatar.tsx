import { avatarStyleFor, initialsFor } from "@/lib/avatarStyles";

export function CharacterAvatar({
  characterId,
  name,
  size = 36,
}: {
  characterId: string;
  name: string;
  size?: number;
}) {
  const { color, glow } = avatarStyleFor(characterId);
  return (
    <span
      className="font-display inline-flex shrink-0 items-center justify-center rounded-full border font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        color,
        borderColor: color,
        background: `radial-gradient(circle at 30% 25%, ${glow}, #0a0a0a 70%)`,
      }}
      aria-hidden
    >
      {initialsFor(name)}
    </span>
  );
}
