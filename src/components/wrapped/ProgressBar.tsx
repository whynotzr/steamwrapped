"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? ((current + 1) / total) * 100 : 0;

  if (total <= 12) {
    return (
      <div className="fixed top-0 right-0 left-0 z-50 flex gap-1 px-3 pt-3 sm:gap-1.5 sm:px-4 sm:pt-4">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4a9fd4] to-[#66c0f4] transition-all duration-500 ease-out"
              style={{ width: i <= current ? "100%" : "0%" }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="fixed top-0 right-0 left-0 z-50 px-4 pt-4">
      <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#4a9fd4] via-[#66c0f4] to-[#8fd4ff] transition-all duration-500 ease-out shadow-[0_0_12px_rgba(102,192,244,0.5)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
