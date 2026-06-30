import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between rounded-lg border border-white/[0.07] bg-[#06101b]/45 px-3 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <Link
        href="/"
        className="group inline-flex items-center gap-2.5 text-sm font-black text-white transition hover:text-[#66c0f4]"
      >
        <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-lg border border-[#66c0f4]/30 bg-[#020712] shadow-[0_0_24px_rgba(102,192,244,0.22)]">
          <Image
            src="/steamwrapped-logo.png"
            alt=""
            width={36}
            height={36}
            className="h-full w-full object-cover"
            priority
          />
        </span>
        SteamWrapped
      </Link>
      <div className="flex items-center gap-2">
        <Link
          href="/u/demo"
          className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-bold text-white/65 transition hover:border-[#5ce1e6]/35 hover:text-[#5ce1e6]"
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
