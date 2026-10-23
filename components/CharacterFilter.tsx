import { data } from "@/lib/data";
import { CharacterAvatar } from "./CharacterAvatar";

/** Single-select row of character portraits with a clear button. "" means no filter. */
export function CharacterFilter({
  characterId,
  onChange,
}: {
  characterId: string;
  onChange: (characterId: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by character">
        {data.characters.map((c) => {
          const selected = c.id === characterId;
          return (
            <button
              key={c.id}
              type="button"
              title={c.name}
              aria-label={c.name}
              aria-pressed={selected}
              onClick={() => onChange(c.id)}
              className={`cursor-pointer rounded-md ring-2 transition-opacity ${
                selected
                  ? "ring-red-600"
                  : characterId
                    ? "opacity-30 grayscale ring-transparent hover:opacity-70"
                    : "ring-transparent hover:opacity-80"
              }`}
            >
              <CharacterAvatar character={c} size={36} square />
            </button>
          );
        })}
      </div>
      {characterId && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear character filter"
          title="Clear character filter"
          className="flex size-7 cursor-pointer items-center justify-center rounded-md border border-neutral-700 text-sm text-neutral-400 hover:border-red-700 hover:text-red-400"
        >
          ×
        </button>
      )}
    </div>
  );
}
