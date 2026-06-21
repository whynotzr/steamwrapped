import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#0a0a0a] px-6 text-center">
      <p className="text-6xl">🎮</p>
      <h1 className="text-2xl font-bold text-white">Profile not found</h1>
      <p className="max-w-sm text-white/50">
        This Steam username does not exist or the link is invalid.
      </p>
      <Link
        href="/"
        className="rounded-full bg-[#1b2838] px-6 py-3 text-white hover:bg-[#2a475e]"
      >
        Back to menu
      </Link>
    </main>
  );
}
