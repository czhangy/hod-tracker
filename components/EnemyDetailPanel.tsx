import { data } from "@/lib/data";
import type { Enemy } from "@/lib/types";
import { EnemyIcon } from "./EnemyIcon";

function chapterLabel(chapterId: string) {
  const chapter = data.chapters.find((c) => c.id === chapterId);
  return chapter ? `${chapter.number}. ${chapter.name}` : chapterId;
}

export function EnemyDetailPanel({ enemy }: { enemy: Enemy | null }) {
  if (!enemy) {
    return (
      <div className="flex h-full min-h-[16rem] flex-1 items-center justify-center rounded-lg border border-dashed border-neutral-800 text-sm text-neutral-600">
        Select an enemy to see its details.
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/40 p-5">
      <div className="flex items-start gap-3">
        <EnemyIcon enemy={enemy} size={48} />
        <div className="min-w-0 flex-1">
          <h3
            className={`font-display text-lg font-bold ${
              enemy.type === "boss" ? "text-red-400" : "text-neutral-50"
            }`}
          >
            {enemy.name}
          </h3>
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            {enemy.type === "boss" ? "Boss" : "Common Enemy"}
          </p>
        </div>
      </div>

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Chapters
          </dt>
          <dd className="mt-0.5 text-neutral-300">
            {enemy.chapters.length ? (
              <ul className="space-y-0.5">
                {enemy.chapters.map((id) => (
                  <li key={id}>{chapterLabel(id)}</li>
                ))}
              </ul>
            ) : (
              <span className="text-neutral-600">Unknown</span>
            )}
          </dd>
        </div>
        {enemy.description && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Description
            </dt>
            <dd className="mt-0.5 text-neutral-300">{enemy.description}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            HP
          </dt>
          <dd className="mt-0.5 text-neutral-300">
            {enemy.hp ?? <span className="text-neutral-600">Unknown</span>}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Weaknesses
          </dt>
          <dd className="mt-0.5 text-neutral-300">
            {enemy.weaknesses ?? <span className="text-neutral-600">Unknown</span>}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Drops
          </dt>
          <dd className="mt-0.5 text-neutral-300">
            {enemy.drops ?? <span className="text-neutral-600">None / unknown</span>}
          </dd>
        </div>
        {enemy.notes && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Notes
            </dt>
            <dd className="mt-0.5 text-neutral-300">{enemy.notes}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
