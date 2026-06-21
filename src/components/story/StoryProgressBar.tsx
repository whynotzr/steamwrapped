"use client";

import { motion } from "framer-motion";

interface StoryProgressBarProps {
  total: number;
  current: number;
  /** 0–1 progression dans le slide courant (timer auto). */
  segmentProgress: number;
}

export function StoryProgressBar({
  total,
  current,
  segmentProgress,
}: StoryProgressBarProps) {
  return (
    <div className="absolute top-0 right-0 left-0 z-50 flex gap-1 px-3 pt-3 pb-2">
      {Array.from({ length: total }).map((_, i) => {
        let fill = 0;
        if (i < current) fill = 1;
        else if (i === current) fill = segmentProgress;

        return (
          <div
            key={i}
            className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/20"
          >
            <motion.div
              className="h-full rounded-full bg-white"
              initial={false}
              animate={{ width: `${fill * 100}%` }}
              transition={{ duration: i === current ? 0.05 : 0.2 }}
            />
          </div>
        );
      })}
    </div>
  );
}
