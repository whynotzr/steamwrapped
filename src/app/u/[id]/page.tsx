import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryWrappedExperience } from "@/components/story/StoryWrappedExperience";
import { WrappedExperience } from "@/components/wrapped/WrappedExperience";
import { MOCK_DEMO_SLUG } from "@/lib/mock-data";
import { getSiteUrl } from "@/lib/site-url";
import { resolveSteamId } from "@/lib/steam/resolve";
import {
  buildWrappedMetadata,
  getWrappedPreview,
} from "@/lib/wrapped/preview";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  if (id === MOCK_DEMO_SLUG) {
    return {
      title: "SteamWrapped Demo",
      description: "Preview the Wrapped with fictional data.",
    };
  }

  try {
    const steamId = await resolveSteamId(id);
    const preview = await getWrappedPreview(steamId);
    if (!preview) throw new Error("no preview");

    const meta = buildWrappedMetadata(steamId, preview);
    const url = `${getSiteUrl()}/u/${steamId}`;

    return {
      title: meta.title,
      description: meta.description,
      openGraph: {
        type: "website",
        url,
        siteName: "SteamWrapped",
        title: meta.ogTitle,
        description: meta.ogDescription,
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: meta.ogTitle,
        description: meta.ogDescription,
      },
    };
  } catch {
    return {
      title: "SteamWrapped",
      description: "Discover this player's Steam Wrapped",
    };
  }
}

export default async function UserWrappedPage({ params }: PageProps) {
  const { id } = await params;

  if (id === MOCK_DEMO_SLUG) {
    return <StoryWrappedExperience mode="demo" />;
  }

  let steamId: string;
  try {
    steamId = await resolveSteamId(id);
  } catch {
    notFound();
  }

  return <WrappedExperience steamId={steamId} />;
}
