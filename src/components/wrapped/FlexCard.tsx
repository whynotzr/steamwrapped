"use client";

import { LOCALE } from "@/lib/locale";
import type { WrappedData } from "@/types/wrapped";

interface FlexCardProps {
  data: WrappedData;
  shareUrl: string;
  exportMode?: boolean;
}

export function FlexCard({ data, shareUrl, exportMode = false }: FlexCardProps) {
  const { replay, extras } = data;
  const wow = replay.wowMoment;
  const top3 = data.topGames.slice(0, 3);
  const rare = extras.rarestSpotlight;

  const width = exportMode ? 540 : undefined;

  return (
    <div
      id={exportMode ? "wrapped-summary-card" : undefined}
      className={exportMode ? "" : "mx-auto w-full max-w-[340px] scale-[0.92] sm:max-w-[380px] sm:scale-100"}
      style={{
        width: width ?? "100%",
        fontFamily: "system-ui, sans-serif",
        background: "linear-gradient(160deg, #1f0a18 0%, #120810 45%, #0a0510 100%)",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: exportMode
          ? "none"
          : "0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(92,225,230,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          background: "linear-gradient(90deg, rgba(92,225,230,0.12), rgba(255,200,87,0.08))",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/steamwrapped-logo.png"
            alt=""
            width={38}
            height={38}
            style={{
              borderRadius: 10,
              objectFit: "cover",
              boxShadow: "0 0 22px rgba(92,225,230,0.28)",
            }}
          />
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#5ce1e6",
              }}
            >
              Steam Wrapped
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 22,
                fontWeight: 900,
                color: "#fff",
              }}
            >
              {data.profile.personaName}
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "rgba(255,200,87,0.15)",
            border: "2px solid rgba(255,200,87,0.4)",
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 900, color: "#ffc857" }}>
            {wow.powerScore}
          </span>
          <span style={{ fontSize: 7, color: "rgba(255,255,255,0.4)" }}>PWR</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px 0" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.profile.avatarUrl}
          alt=""
          width={56}
          height={56}
          style={{
            borderRadius: "50%",
            border: "3px solid rgba(92,225,230,0.5)",
            flexShrink: 0,
          }}
        />
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 800,
              color: "#fff",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {data.profile.personaName}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
            Niv. {data.profile.steamLevel} · {wow.headline}
          </p>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 48, lineHeight: 1 }}>{wow.emoji}</p>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 42,
            fontWeight: 900,
            color: "#ffc857",
            lineHeight: 1.05,
            textShadow: "0 0 40px rgba(255,200,87,0.4)",
          }}
        >
          {wow.statFormatted}
        </p>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
          {wow.statLabel}
        </p>
      </div>

      {top3.length > 0 && (
        <div style={{ display: "flex", gap: 8, padding: "18px 16px 0" }}>
          {top3.map((g, i) => (
            <div
              key={g.appid}
              style={{
                flex: 1,
                position: "relative",
                borderRadius: 10,
                overflow: "hidden",
                height: 72,
                border: i === 0 ? "2px solid rgba(255,200,87,0.5)" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {g.headerImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={g.headerImage}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "4px 6px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 8,
                    fontWeight: 700,
                    color: "#fff",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  #{i + 1} {g.name}
                </p>
                <p
                  style={{
                    margin: "1px 0 0",
                    fontSize: 7,
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  {Math.round(g.playtime_forever / 60).toLocaleString(LOCALE)}h
                  {(g.playtimePercent ?? 0) > 0
                    ? ` · ${g.playtimePercent}%`
                    : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          padding: "16px 16px 0",
        }}
      >
        {[
          { v: `${data.playtime.totalHours.toLocaleString(LOCALE)}h`, l: "Playtime" },
          { v: String(data.library.playedGames), l: "Games played" },
          {
            v: data.achievements.totalUnlocked.toLocaleString(LOCALE),
            l: "Total achievements",
          },
          { v: data.genres[0]?.genre ?? "—", l: "Genre #1" },
        ].map((s) => (
          <div
            key={s.l}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: s.l === "Genre #1" ? 11 : 18,
                fontWeight: 800,
                color: "#fff",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {s.v}
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              {s.l}
            </p>
          </div>
        ))}
      </div>

      {rare && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            margin: "14px 16px 0",
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(255,200,87,0.08)",
            border: "1px solid rgba(255,200,87,0.2)",
          }}
        >
          {rare.icon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={rare.icon} alt="" width={36} height={36} style={{ borderRadius: 8 }} />
          )}
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#ffc857" }}>
              Rarest achievement
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 10,
                color: "rgba(255,255,255,0.6)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {rare.name} · {rare.percent}%
            </p>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
          padding: "14px 20px 18px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: 20 }}>{data.personality.emoji}</p>
          <p style={{ margin: "2px 0 0", fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
            {data.personality.title}
          </p>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 9,
            color: "rgba(255,255,255,0.3)",
            maxWidth: 140,
            textAlign: "right",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {shareUrl.replace(/^https?:\/\//, "")}
        </p>
      </div>
    </div>
  );
}
