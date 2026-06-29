import type { Metadata } from "next";
import { LandingPage } from "@/components/home/LandingPage";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Steam Wrapped - Create your Steam gaming recap",
  description:
    "Create your Steam Wrapped from your Steam profile. See lifetime Steam stats, top games, achievements, rare unlocks, and a shareable recap card.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Steam Wrapped - Create your Steam gaming recap",
    description:
      "Paste your Steam profile and generate animated Steam Wrapped slides with lifetime stats, top games, achievements, and a shareable card.",
    url: "/",
  },
  twitter: {
    title: "Steam Wrapped",
    description:
      "Create your Steam Wrapped from your Steam profile and share your gaming recap.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Steam Wrapped?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Steam Wrapped is a personalized recap for your Steam profile. It turns public Steam stats into animated slides with playtime, top games, achievements, rare unlocks, and a shareable summary card.",
      },
    },
    {
      "@type": "Question",
      name: "How do I create my Steam Wrapped?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paste your SteamID64, Steam vanity name, or Steam profile URL. SteamWrapped reads public Steam profile data and generates your gaming recap automatically.",
      },
    },
    {
      "@type": "Question",
      name: "Is Steam Wrapped official?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SteamWrapped is not affiliated with Valve or Steam. It uses public Steam Web API data from profiles that have public profile and game details enabled.",
      },
    },
  ],
};

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Steam Wrapped",
  alternateName: "SteamWrapped",
  url: getSiteUrl(),
  applicationCategory: "EntertainmentApplication",
  operatingSystem: "Web",
  description:
    "Create your Steam Wrapped from your Steam profile with lifetime Steam stats, top games, achievements, and a shareable recap card.",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationJsonLd),
        }}
      />
      <LandingPage hasError={params.error === "auth_failed"} />
    </>
  );
}
