import type { ProgressState } from "@/lib/types";
import { overallStats } from "@/lib/useProgress";
import { ProgressBar } from "./ProgressBar";
import { HeroBanner } from "./HeroBanner";

export function OverallHeader({ progress }: { progress: ProgressState }) {
  const stats = overallStats(progress);

  return (
    <header className="space-y-4 border-b border-neutral-800 pb-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-50 sm:text-3xl">
            Castlevania: Harmony of Despair
          </h1>
          <p className="font-display text-sm tracking-wide text-neutral-500">
            100% Completion Tracker
          </p>
        </div>
        <HeroBanner />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar percent={stats.percent} />
        </div>
        <span className="font-display text-sm font-semibold tabular-nums text-neutral-300">
          {stats.percent}% overall
        </span>
      </div>
    </header>
  );
}
