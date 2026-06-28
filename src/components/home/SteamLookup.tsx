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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="steam-input" className="sr-only">
          SteamID64 or Steam profile URL
        </label>
        <div
          className={`relative rounded-xl transition-all duration-300 ${
            focused
              ? "shadow-[0_0_0_2px_rgba(92,225,230,0.48),0_0_42px_rgba(92,225,230,0.16)]"
              : ""
          }`}
        >
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
            @
          </span>
          <input
            id="steam-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="SteamID64, vanity name, or profile URL"
            className="w-full rounded-xl border border-white/10 bg-[#071018]/88 px-10 py-4 text-base text-white placeholder:text-white/30 outline-none transition"
            autoComplete="off"
            spellCheck={false}
            disabled={loading}
          />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading || !query.trim()}
        whileHover={{ scale: loading ? 1 : 1.01 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="relative w-full overflow-hidden rounded-xl bg-[#5ce1e6] py-4 text-base font-black text-[#061015] shadow-[0_0_34px_rgba(92,225,230,0.34)] transition before:absolute before:inset-y-0 before:left-[-45%] before:w-1/3 before:skew-x-[-18deg] before:bg-white/35 before:blur-md before:transition before:duration-700 hover:before:left-[115%] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-3">
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#171a21]/25 border-t-[#171a21]" />
            Generating...
          </span>
        ) : (
          "Generate my Wrapped"
        )}
      </motion.button>

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

      <p className="text-center text-[11px] text-white/30">
        Examples:{" "}
        <button
          type="button"
          onClick={() => setQuery("76561198123456789")}
          className="text-[#66c0f4]/75 underline-offset-2 hover:text-[#66c0f4] hover:underline"
        >
          SteamID64
        </button>
        {" / "}
        <button
          type="button"
          onClick={() => setQuery("https://steamcommunity.com/id/GabeN")}
          className="text-[#66c0f4]/75 underline-offset-2 hover:text-[#66c0f4] hover:underline"
        >
          profile URL
        </button>
        {" / "}
        <button
          type="button"
          onClick={() => setQuery("demo")}
          className="text-[#66c0f4]/75 underline-offset-2 hover:text-[#66c0f4] hover:underline"
        >
          mock demo
        </button>
      </p>
    </form>
  );
}
