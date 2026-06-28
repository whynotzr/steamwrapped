import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-1 py-2">
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-sm font-black tracking-tight text-white transition hover:text-[#66c0f4]"
      >
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-[#66c0f4]/30 bg-[#66c0f4]/10 text-[#66c0f4] shadow-[0_0_24px_rgba(102,192,244,0.16)]">
          S
        </span>
        SteamWrapped
      </Link>
      <div className="flex items-center gap-2">
        <Link
          href="/u/demo"
          className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/65 transition hover:border-white/25 hover:text-white"
        >
          Demo
        </Link>
        <a
          href="/api/auth/steam"
          className="rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-[#08111a] shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition hover:bg-[#dff6ff]"
        >
          Sign in with Steam
        </a>
      </div>
    </header>
  );
}
