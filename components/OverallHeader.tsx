"use client";

import { useRef } from "react";
import type { ProgressState } from "@/lib/types";
import { overallStats } from "@/lib/useProgress";
import { ProgressBar } from "./ProgressBar";

export function OverallHeader({
  progress,
  onResetAll,
  onImport,
}: {
  progress: ProgressState;
  onResetAll: () => void;
  onImport: (next: ProgressState) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stats = overallStats(progress);

  function handleExport() {
    const blob = new Blob([JSON.stringify(progress, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hod-tracker-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed?.version === 1) {
        onImport(parsed as ProgressState);
      } else {
        alert("That file doesn't look like a valid progress export.");
      }
    } catch {
      alert("Couldn't read that file.");
    } finally {
      e.target.value = "";
    }
  }

  return (
    <header className="space-y-4 border-b border-neutral-800 pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-50">
            Castlevania: Harmony of Despair
          </h1>
          <p className="text-sm text-neutral-500">100% Completion Tracker</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleExport}
            className="rounded-md border border-neutral-800 px-3 py-1.5 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
          >
            Export
          </button>
          <button
            onClick={handleImportClick}
            className="rounded-md border border-neutral-800 px-3 py-1.5 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
          >
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => {
              if (confirm("Reset ALL progress for every character? This can't be undone.")) {
                onResetAll();
              }
            }}
            className="rounded-md border border-neutral-800 px-3 py-1.5 text-neutral-400 hover:border-red-900 hover:text-red-500"
          >
            Reset all
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar percent={stats.percent} />
        </div>
        <span className="text-sm font-semibold tabular-nums text-neutral-300">
          {stats.percent}% overall
        </span>
      </div>
    </header>
  );
}
