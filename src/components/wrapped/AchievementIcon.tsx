"use client";

import { useMemo, useState } from "react";
import { getAchievementIconUrls } from "@/lib/steam/achievement-icons";

export function AchievementIcon({
  appId,
  icon,
  iconUrl,
  className = "h-12 w-12 rounded-lg object-cover bg-white/10",
  highlight = false,
}: {
  appId?: number;
  icon?: string;
  iconUrl?: string;
  className?: string;
  highlight?: boolean;
}) {
  const urls = useMemo(() => {
    if (appId && icon) return getAchievementIconUrls(appId, icon);
    if (iconUrl?.startsWith("http")) return [iconUrl];
    if (appId && iconUrl) return getAchievementIconUrls(appId, iconUrl);
    return [];
  }, [appId, icon, iconUrl]);

  const [index, setIndex] = useState(0);
  const exhausted = index >= urls.length;
  const src = exhausted ? undefined : urls[index];

  if (!src) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center bg-white/10 text-lg ${className}`}
        aria-hidden
      >
        🏆
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={`shrink-0 ${className} ${highlight ? "wow-ach-icon" : ""}`}
      onError={() => {
        setIndex((i) => i + 1);
      }}
    />
  );
}
