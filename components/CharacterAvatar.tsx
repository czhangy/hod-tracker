"use client";

import { useState } from "react";
import { avatarStyleFor, initialsFor } from "@/lib/avatarStyles";
import type { Character } from "@/lib/types";

export function CharacterAvatar({
  character,
  size = 36,
}: {
  character: Pick<Character, "id" | "name" | "portraitUrl">;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const { color, glow } = avatarStyleFor(character.id);

  if (character.portraitUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/api/icon?url=${encodeURIComponent(character.portraitUrl)}`}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-full border object-cover"
        style={{ width: size, height: size, borderColor: color }}
        onError={() => setFailed(true)}
      />
    );
  }

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
      {initialsFor(character.name)}
    </span>
  );
}
