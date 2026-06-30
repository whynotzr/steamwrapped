"use client";

import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_DEMO_SLUG } from "@/lib/mock-data";

export function SteamLookup() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === "demo" || trimmed.toLowerCase() === "mock") {
      router.push(`/u/${MOCK_DEMO_SLUG}`);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/resolve?q=${encodeURIComponent(trimmed)}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Profile not found");
      router.push(`/u/${body.steamId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className={`relative overflow-hidden rounded-lg border bg-[#06101b]/88 transition duration-300 ${
          focused
            ? "border-[#5ce1e6]/60 shadow-[0_0_0_1px_rgba(92,225,230,0.38),0_0_42px_rgba(92,225,230,0.17)]"
            : "border-white/10"
        }`}
      >
        <label htmlFor="steam-input" className="sr-only">
          SteamID64 or Steam profile URL
        </label>
        <div className="grid gap-3 p-2 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-[#5ce1e6]/70">
              ID
            </span>
            <input
              id="steam-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="SteamID64, custom name, or profile URL"
              className="h-14 w-full rounded-md bg-transparent px-12 text-base font-semibold text-white outline-none placeholder:text-white/28"
              autoComplete="off"
              spellCheck={false}
              disabled={loading}
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading || !query.trim()}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="relative h-14 overflow-hidden rounded-md bg-[#5ce1e6] px-6 text-sm font-black text-[#04111a] shadow-[0_0_34px_rgba(92,225,230,0.34)] transition before:absolute before:inset-y-0 before:left-[-45%] before:w-1/3 before:skew-x-[-18deg] before:bg-white/40 before:blur-md before:transition before:duration-700 hover:before:left-[115%] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-3">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#171a21]/25 border-t-[#171a21]" />
                Generating
              </span>
            ) : (
              "Generate"
            )}
          </motion.button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-white/35">
        <span>Try:</span>
        {[
          ["SteamID64", "76561198123456789"],
          ["Profile URL", "https://steamcommunity.com/id/GabeN"],
          ["Demo", "demo"],
        ].map(([label, value]) => (
          <button
            key={label}
            type="button"
            onClick={() => setQuery(value)}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-bold text-white/55 transition hover:border-[#5ce1e6]/35 hover:text-[#5ce1e6]"
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-center text-sm text-red-300"
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </form>
  );
}
