export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
      <div
        className={`h-full rounded-full transition-all ${percent >= 100 ? "bg-green-600" : "bg-red-600"}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
