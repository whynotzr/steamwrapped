"use client";

import { toPng } from "html-to-image";
import { useCallback, useState } from "react";

interface ShareButtonProps {
  targetId: string;
  filename?: string;
}

export function ShareButton({
  targetId,
  filename = "steam-wrapped.png",
}: ShareButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleShare = useCallback(async () => {
    const el = document.getElementById(targetId);
    if (!el) return;

    setLoading(true);
    try {
      const dataUrl = await toPng(el, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#0a0a0a",
      });

      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();

      if (navigator.share && navigator.canShare) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], filename, { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: "My Steam Wrapped",
              files: [file],
            });
            return;
          }
        } catch {
          // fall through to download only
        }
      }
    } catch {
      // User cancelled share
    } finally {
      setLoading(false);
    }
  }, [targetId, filename]);

  return (
    <button
      onClick={handleShare}
      disabled={loading}
      className="rounded-full bg-white px-8 py-3 text-sm font-bold text-black transition hover:bg-white/90 disabled:opacity-50"
    >
      {loading ? "Generating..." : "📸 Share"}
    </button>
  );
}
