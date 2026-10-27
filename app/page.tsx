"use client";

import { data } from "@/lib/data";
import { useProgress } from "@/lib/useProgress";
import { usePersistedState } from "@/lib/usePersistedState";
import { OverallHeader } from "@/components/OverallHeader";
import { Sidebar } from "@/components/Sidebar";
import { CharacterDetail } from "@/components/CharacterDetail";
import { ItemsPanel } from "@/components/ItemsPanel";
import { LevelingPanel } from "@/components/LevelingPanel";
import { BuildsPanel } from "@/components/BuildsPanel";

type Tab = "characters" | "items" | "leveling" | "builds";

export default function Home() {
  const { progress, toggleChapter, toggleItem, adjustItemCount, adjustItemLevel, setBuildSlot } = useProgress();
  const [tab, setTab] = usePersistedState<Tab>(
    "hod-tracker-tab",
    "characters",
    (v) => v === "characters" || v === "items" || v === "leveling" || v === "builds"
  );
  const [selectedCharacterId, setSelectedCharacterId] = usePersistedState<string>(
    "hod-tracker-character",
    data.characters[0]?.id ?? "",
    (v) => data.characters.some((c) => c.id === v)
  );

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <OverallHeader progress={progress} />

      <div className="font-display flex gap-2 text-sm">
        <button
          onClick={() => setTab("characters")}
          className={`cursor-pointer rounded-md px-3 py-1.5 font-semibold tracking-wide ${
            tab === "characters"
              ? "bg-red-950/50 text-red-400"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Characters
        </button>
        <button
          onClick={() => setTab("items")}
          className={`cursor-pointer rounded-md px-3 py-1.5 font-semibold tracking-wide ${
            tab === "items"
              ? "bg-red-950/50 text-red-400"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Items
        </button>
        <button
          onClick={() => setTab("leveling")}
          className={`cursor-pointer rounded-md px-3 py-1.5 font-semibold tracking-wide ${
            tab === "leveling"
              ? "bg-red-950/50 text-red-400"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Leveling
        </button>
        <button
          onClick={() => setTab("builds")}
          className={`cursor-pointer rounded-md px-3 py-1.5 font-semibold tracking-wide ${
            tab === "builds"
              ? "bg-red-950/50 text-red-400"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Builds
        </button>
      </div>

      {tab === "characters" && (
        <div className="flex flex-col gap-6 md:flex-row">
          <Sidebar
            progress={progress}
            selectedId={selectedCharacterId}
            onSelect={setSelectedCharacterId}
          />
          <CharacterDetail
            characterId={selectedCharacterId}
            progress={progress}
            onToggleChapter={toggleChapter}
          />
        </div>
      )}
      {tab === "items" && (
        <ItemsPanel
          progress={progress}
          onToggleItem={toggleItem}
          onAdjustItemCount={adjustItemCount}
        />
      )}
      {tab === "leveling" && (
        <LevelingPanel
          progress={progress}
          onAdjustItemLevel={adjustItemLevel}
          onAdjustItemCount={adjustItemCount}
        />
      )}
      {tab === "builds" && <BuildsPanel progress={progress} onSetBuildSlot={setBuildSlot} />}
    </div>
  );
}
