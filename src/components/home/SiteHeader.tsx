import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-xl items-center justify-between px-1 py-2">
      <Link
        href="/"
        className="text-sm font-black tracking-tight text-white transition hover:text-[#66c0f4]"
      >
        SteamWrapped
      </Link>
      <div className="flex items-center gap-2">
        <Link
          href="/u/demo"
          className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/55 transition hover:border-white/25 hover:text-white"
        >
          Demo
        </Link>
        <a
          href="/api/auth/steam"
          className="rounded-full bg-[#171a21] px-3 py-1.5 text-[11px] font-bold text-[#66c0f4] ring-1 ring-[#66c0f4]/40 transition hover:bg-[#66c0f4]/10"
        >
          Sign in with Steam
        </a>
      </div>
    </header>
  );
}
