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

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
  title: {
    default: "SteamWrapped - Your gaming life, exposed",
    template: "%s | SteamWrapped",
  },
  description:
    "Generate your Steam Wrapped in one click: lifetime playtime, top games, gaming archetype, and a shareable PNG card.",
  keywords: [
    "Steam Wrapped",
    "SteamWrapped",
    "Steam stats",
    "Steam recap",
    "gaming wrapped",
    "Steam profile stats",
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
    title: "SteamWrapped - Your gaming life, exposed",
    description:
      "Spotify Wrapped-style animated slides. Paste your SteamID64 or profile URL.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SteamWrapped",
    description: "Your Steam gaming life in animated slides.",
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
