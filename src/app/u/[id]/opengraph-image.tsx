import { ImageResponse } from "next/og";
import { getWrappedPreview } from "@/lib/wrapped/preview";
import { resolveSteamId } from "@/lib/steam/resolve";
import type { WrappedData } from "@/types/wrapped";

export const runtime = "nodejs";
export const alt = "Steam Wrapped";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function OgCard({ wrapped }: { wrapped: WrappedData }) {
  const topGames = wrapped.topGames.slice(0, 3);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1b2838 45%, #2a475e 100%)",
        color: "white",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Steam Wrapped
        </div>
        <div style={{ fontSize: 48 }}>{wrapped.personality.emoji}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={wrapped.profile.avatarUrl}
          alt=""
          width={120}
          height={120}
          style={{ borderRadius: "50%", border: "4px solid rgba(255,255,255,0.2)" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 52,
              fontWeight: 900,
              lineHeight: 1.1,
            }}
          >
            <span>{wrapped.profile.personaName}</span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: "#22d3ee",
              }}
            >
              {wrapped.summary.headline}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        {[
          {
            value: `${wrapped.playtime.totalHours.toLocaleString("fr-FR")}h`,
            label: "Temps de jeu",
          },
          { value: `${wrapped.library.totalGames}`, label: "Jeux" },
          {
            value: `${wrapped.achievements.totalUnlocked}`,
            label: "Achievements",
          },
          { value: wrapped.personality.emoji, label: wrapped.personality.title },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              padding: "20px 24px",
              borderRadius: 16,
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 800 }}>{stat.value}</div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.45)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {topGames.length > 0 && (
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Top jeux :{" "}
          {topGames.map((g, i) => `${i + 1}. ${g.name}`).join(" · ")}
        </div>
      )}
    </div>
  );
}

function OgMinimal({
  personaName,
  avatarUrl,
}: {
  personaName: string;
  avatarUrl: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        background: "linear-gradient(135deg, #0a0a0a 0%, #1b2838 50%, #171a21 100%)",
        color: "white",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        Steam Wrapped
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarUrl}
        alt=""
        width={140}
        height={140}
        style={{ borderRadius: "50%", border: "4px solid rgba(255,255,255,0.15)" }}
      />
      <div style={{ fontSize: 56, fontWeight: 900 }}>{personaName}</div>
      <div style={{ fontSize: 26, color: "rgba(255,255,255,0.55)" }}>
        Clique pour découvrir son Wrapped
      </div>
    </div>
  );
}

function OgFallback() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        background: "linear-gradient(135deg, #0a0a0a, #1b2838, #2a475e)",
        color: "white",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ fontSize: 80 }}>🎮</div>
      <div style={{ fontSize: 64, fontWeight: 900 }}>Steam Wrapped</div>
      <div style={{ fontSize: 28, color: "rgba(255,255,255,0.55)" }}>
        Ton année gaming en slides animées
      </div>
    </div>
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const steamId = await resolveSteamId(id);
    const preview = await getWrappedPreview(steamId);

    if (preview?.kind === "full") {
      return new ImageResponse(<OgCard wrapped={preview.wrapped} />, {
        ...size,
      });
    }

    if (preview?.kind === "minimal") {
      return new ImageResponse(
        <OgMinimal
          personaName={preview.profile.personaname}
          avatarUrl={preview.profile.avatarfull}
        />,
        { ...size }
      );
    }
  } catch {
    // fallback image
  }

  return new ImageResponse(<OgFallback />, { ...size });
}
