"use client";

import { useState } from "react";
import { data } from "@/lib/data";
import { useProgress } from "@/lib/useProgress";
import { OverallHeader } from "@/components/OverallHeader";
import { Sidebar } from "@/components/Sidebar";
import { CharacterDetail } from "@/components/CharacterDetail";
import { ItemsPanel } from "@/components/ItemsPanel";

type Tab = "characters" | "items";

export default function Home() {
  const { progress, toggleChapter, toggleItem, resetCharacter, resetAll, importProgress } =
    useProgress();
  const [tab, setTab] = useState<Tab>("characters");
  const [selectedCharacterId, setSelectedCharacterId] = useState(
    data.characters[0]?.id ?? ""
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <OverallHeader progress={progress} onResetAll={resetAll} onImport={importProgress} />

      <div className="flex gap-2 text-sm">
        <button
          onClick={() => setTab("characters")}
          className={`rounded-md px-3 py-1.5 font-medium ${
            tab === "characters"
              ? "bg-red-950/50 text-red-400"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Characters
        </button>
        <button
          onClick={() => setTab("items")}
          className={`rounded-md px-3 py-1.5 font-medium ${
            tab === "items"
              ? "bg-red-950/50 text-red-400"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Item Collection
        </button>
      </div>

      {tab === "characters" ? (
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
            onReset={resetCharacter}
          />
        </div>
      ) : (
        <ItemsPanel progress={progress} onToggleItem={toggleItem} />
      )}
    </div>
  );
}
