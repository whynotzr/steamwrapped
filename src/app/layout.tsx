import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const googleSiteVerifications = Array.from(
  new Set(
    [
      process.env.GOOGLE_SITE_VERIFICATION,
      "mVok42bd5JDio7rOgDoHgMwA-3JWPSlTHUG5E7_VC8I",
    ].filter(Boolean),
  ),
) as string[];

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  ...(googleSiteVerifications.length > 0
    ? {
        verification: {
          google: googleSiteVerifications,
        },
      }
    : {}),
  title: {
    default: "Steam Wrapped - Steam stats recap and leaderboard",
    template: "%s | SteamWrapped",
  },
  description:
    "Create your Steam Wrapped in one click: lifetime Steam stats, top games, achievements, rare unlocks, gaming leaderboard, and a shareable PNG recap card.",
  keywords: [
    "Steam Wrapped",
    "SteamWrapped",
    "Steam stats",
    "Steam recap",
    "gaming wrapped",
    "Steam profile stats",
    "Steam Wrapped generator",
    "Steam Wrapped leaderboard",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "SteamWrapped",
    title: "Steam Wrapped - Steam stats recap and leaderboard",
    description:
      "Create a Steam Wrapped recap from your Steam profile with lifetime stats, top games, achievements, leaderboards, and a shareable card.",
    locale: "en_US",
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Steam Wrapped profile recap",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Steam Wrapped - Steam stats recap",
    description:
      "Create your Steam Wrapped and compare your Steam stats on the leaderboard.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#070a11] text-white">
        {children}
      </body>
    </html>
  );
}
