"use client";

import { useEffect, useState } from "react";
import { LOCALE } from "@/lib/locale";

interface CountUpProps {
  value: number;
  duration?: number;
  className?: string;
}

export function CountUp({
  value,
  duration = 1200,
  className = "",
}: CountUpProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <span className={className}>{display.toLocaleString(LOCALE)}</span>
  );
}
