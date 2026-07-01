import type { Metadata } from "next";
import { LandingPage } from "@/components/home/LandingPage";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Steam Wrapped - Generate your Steam stats recap",
  description:
    "Generate a Steam Wrapped recap from your Steam profile with lifetime playtime, top games, achievements, rare unlocks, leaderboard rankings, and a shareable card.",
  alternates: {
    canonical: "/steam-wrapped",
  },
  openGraph: {
    title: "Steam Wrapped - Generate your Steam stats recap",
    description:
      "Create animated Steam Wrapped slides from your public Steam profile and compare your stats on the leaderboard.",
    url: "/steam-wrapped",
  },
  twitter: {
    card: "summary_large_image",
    title: "Steam Wrapped",
    description:
      "Generate your Steam Wrapped recap from your Steam profile.",
    images: ["/opengraph-image"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Steam Wrapped",
  url: `${getSiteUrl()}/steam-wrapped`,
  description:
    "Generate a Steam Wrapped recap from your Steam profile with lifetime Steam stats, top games, achievements, leaderboard rankings, and a shareable card.",
  isPartOf: {
    "@type": "WebSite",
    name: "SteamWrapped",
    url: getSiteUrl(),
  },
};

export default function SteamWrappedPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
