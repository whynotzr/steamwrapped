"use client";

import Link from "next/link";
import { toPng } from "html-to-image";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";

interface StoryShareActionsProps {
  cardId: string;
  filename?: string;
}

export function StoryShareActions({
  cardId,
  filename = "steamwrapped.png",
}: StoryShareActionsProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = useCallback(async () => {
    const el = document.getElementById(cardId);
    if (!el) return;

    setLoading(true);
    try {
      const dataUrl = await toPng(el, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#171a21",
      });

      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [cardId, filename]);

  return (
    <div className="flex flex-col items-center gap-3 px-6 pb-10">
      <motion.button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        whileTap={{ scale: 0.97 }}
        className="w-full max-w-[320px] rounded-2xl bg-[#66c0f4] py-4 text-base font-black text-[#171a21] shadow-[0_0_28px_rgba(102,192,244,0.35)] disabled:opacity-50"
      >
        {loading
          ? "Generating…"
          : done
            ? "✓ Downloaded!"
            : "Download my card (.PNG)"}
      </motion.button>
      <Link
        href="/"
        className="w-full max-w-[320px] rounded-2xl border border-[#66c0f4]/40 bg-[#66c0f4]/10 py-3.5 text-center text-sm font-bold text-[#66c0f4] transition hover:bg-[#66c0f4]/20"
      >
        ← Back to menu
      </Link>
    </div>
  );
}
