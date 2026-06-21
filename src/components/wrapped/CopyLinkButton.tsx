"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";

interface CopyLinkButtonProps {
  url: string;
}

export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [url]);

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={handleCopy}
      className="w-full max-w-xs rounded-2xl border border-[#66c0f4]/30 bg-[#66c0f4]/10 px-8 py-4 text-sm font-bold text-[#66c0f4] transition hover:bg-[#66c0f4]/20"
    >
      {copied ? "✓ Copied!" : "🔗 Copy link"}
    </motion.button>
  );
}
