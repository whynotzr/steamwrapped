"use client";

import { toBlob } from "html-to-image";
import { useCallback, useState } from "react";

interface ShareButtonProps {
  targetId: string;
  filename?: string;
}

const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=";

async function waitForImages(el: HTMLElement) {
  const images = Array.from(el.querySelectorAll("img"));
  await Promise.all(
    images.map(async (img) => {
      try {
        if (img.complete) return;
        await img.decode();
      } catch {
        // html-to-image will use the configured placeholder for failed images.
      }
    })
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ShareButton({
  targetId,
  filename = "steam-wrapped.png",
}: ShareButtonProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleShare = useCallback(async () => {
    const el = document.getElementById(targetId);
    if (!el) return;

    setLoading(true);
    setDone(false);
    try {
      await document.fonts.ready;
      await waitForImages(el);

      const blob = await toBlob(el, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#0a0a0a",
        cacheBust: true,
        imagePlaceholder: TRANSPARENT_PIXEL,
        skipFonts: true,
        fetchRequestInit: {
          cache: "no-store",
        },
        onImageErrorHandler: () => undefined,
      });

      if (!blob) {
        throw new Error("Could not generate the share image.");
      }

      const file = new File([blob], filename, { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title: "My Steam Wrapped",
            text: "My Steam Wrapped recap",
            files: [file],
          });
          setDone(true);
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
        }
      }

      downloadBlob(blob, filename);
      setDone(true);
    } catch {
      alert(
        "Impossible de generer la carte pour l'instant. Reessaie dans quelques secondes."
      );
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
      {loading ? "Generating..." : done ? "Saved" : "Share card"}
    </button>
  );
}
