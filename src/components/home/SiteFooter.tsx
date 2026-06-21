import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative z-20 mx-auto mt-12 w-full max-w-xl border-t border-white/[0.06] pt-6 text-center">
      <p className="text-[11px] leading-relaxed text-white/30">
        Not affiliated with Valve or Steam. Public profiles only · Lifetime stats
        via Steam Web API.
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px]">
        <Link href="/u/demo" className="text-[#66c0f4]/70 hover:text-[#66c0f4]">
          Try the demo
        </Link>
        <a
          href="https://steamcommunity.com/dev/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/35 hover:text-white/55"
        >
          Steam API
        </a>
      </div>
    </footer>
  );
}
