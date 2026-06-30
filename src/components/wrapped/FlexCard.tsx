"use client";

import { LOCALE } from "@/lib/locale";
import type { WrappedData } from "@/types/wrapped";

interface FlexCardProps {
  data: WrappedData;
  shareUrl: string;
  exportMode?: boolean;
}

function compactUrl(url: string) {
  return url.replace(/^https?:\/\//, "");
}

export function FlexCard({ data, shareUrl, exportMode = false }: FlexCardProps) {
  const { replay, extras } = data;
  const wow = replay.wowMoment;
  const top3 = data.topGames.slice(0, 3);
  const rare = extras.rarestSpotlight;
  const mainGenre = data.genres[0]?.genre ?? "Mixed";
  const width = exportMode ? 560 : undefined;

  return (
    <div
      id={exportMode ? "wrapped-summary-card" : undefined}
      className={
        exportMode
          ? ""
          : "mx-auto w-full max-w-[345px] scale-[0.92] sm:max-w-[390px] sm:scale-100"
      }
      style={{
        width: width ?? "100%",
        fontFamily: "system-ui, sans-serif",
        background:
          "linear-gradient(160deg, #06101d 0%, #0b1220 40%, #180a19 72%, #05070d 100%)",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "white",
        boxShadow: exportMode
          ? "none"
          : "0 28px 90px rgba(0,0,0,0.62), 0 0 70px rgba(92,225,230,0.1)",
      }}
    >
      <div
        style={{
          position: "relative",
          minHeight: 690,
          overflow: "hidden",
          padding: 22,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 28% 8%, rgba(92,225,230,0.22), transparent 34%), radial-gradient(circle at 82% 72%, rgba(255,200,87,0.16), transparent 34%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.1,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
            backgroundSize: "100% 9px",
          }}
        />

        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/steamwrapped-logo.png"
                alt=""
                width={44}
                height={44}
                style={{
                  borderRadius: 8,
                  objectFit: "cover",
                  boxShadow: "0 0 24px rgba(92,225,230,0.35)",
                }}
              />
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: "0.34em",
                    textTransform: "uppercase",
                    color: "#5ce1e6",
                  }}
                >
                  Steam Wrapped
                </p>
                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: 17,
                    fontWeight: 900,
                    color: "#fff",
                    maxWidth: 300,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {data.profile.personaName}
                </p>
              </div>
            </div>

            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,200,87,0.12)",
                border: "1px solid rgba(255,200,87,0.36)",
              }}
            >
              <span
                style={{ fontSize: 18, fontWeight: 950, color: "#ffc857" }}
              >
                {wow.powerScore}
              </span>
              <span
                style={{
                  marginTop: 1,
                  fontSize: 8,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  color: "rgba(255,255,255,0.42)",
                }}
              >
                POWER
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: 30,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.profile.avatarUrl}
              alt=""
              width={70}
              height={70}
              style={{
                borderRadius: 8,
                border: "3px solid rgba(92,225,230,0.52)",
                flexShrink: 0,
              }}
            />
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.42)",
                }}
              >
                {data.personality.title}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 32,
                  lineHeight: 1,
                  fontWeight: 950,
                  color: "#fff",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {data.profile.personaName}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 30, textAlign: "center" }}>
            <p
              style={{
                margin: 0,
                fontSize: 84,
                lineHeight: 0.95,
                fontWeight: 950,
                color: "#ffc857",
                textShadow:
                  "0 0 38px rgba(255,200,87,0.42), 0 0 80px rgba(92,225,230,0.14)",
              }}
            >
              {wow.statFormatted}
            </p>
            <p
              style={{
                margin: "8px auto 0",
                maxWidth: 360,
                fontSize: 16,
                lineHeight: 1.35,
                fontWeight: 800,
                color: "rgba(255,255,255,0.68)",
              }}
            >
              {wow.statLabel}
            </p>
            <p
              style={{
                margin: "10px auto 0",
                maxWidth: 380,
                fontSize: 13,
                lineHeight: 1.4,
                color: "rgba(255,255,255,0.45)",
              }}
            >
              {wow.punchline}
            </p>
          </div>

          <div
            style={{
              marginTop: 28,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[
              {
                v: `${data.playtime.totalHours.toLocaleString(LOCALE)}h`,
                l: "Playtime",
              },
              { v: String(data.library.playedGames), l: "Games played" },
              {
                v: data.achievements.totalUnlocked.toLocaleString(LOCALE),
                l: "Achievements",
              },
              { v: mainGenre, l: "Top genre" },
            ].map((stat) => (
              <div
                key={stat.l}
                style={{
                  padding: "14px 15px",
                  minHeight: 70,
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.055)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: stat.l === "Top genre" ? 16 : 22,
                    fontWeight: 950,
                    lineHeight: 1.05,
                    color: "#fff",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {stat.v}
                </p>
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: 9,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "rgba(255,255,255,0.36)",
                  }}
                >
                  {stat.l}
                </p>
              </div>
            ))}
          </div>

          {top3.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.36)",
                }}
              >
                Top games
              </p>
              <div style={{ display: "grid", gap: 7 }}>
                {top3.map((game, index) => (
                  <div
                    key={game.appid}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: 8,
                      borderRadius: 8,
                      background: "rgba(0,0,0,0.22)",
                      border:
                        index === 0
                          ? "1px solid rgba(255,200,87,0.32)"
                          : "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {game.headerImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={game.headerImage}
                        alt=""
                        width={72}
                        height={34}
                        style={{
                          borderRadius: 6,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          fontWeight: 900,
                          color: "#fff",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        #{index + 1} {game.name}
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0",
                          fontSize: 10,
                          color: "rgba(255,255,255,0.45)",
                        }}
                      >
                        {Math.round(game.playtime_forever / 60).toLocaleString(
                          LOCALE
                        )}
                        h
                        {(game.playtimePercent ?? 0) > 0
                          ? ` / ${game.playtimePercent}%`
                          : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rare && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 14,
                padding: 12,
                borderRadius: 8,
                background: "rgba(255,200,87,0.085)",
                border: "1px solid rgba(255,200,87,0.22)",
              }}
            >
              {rare.icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={rare.icon}
                  alt=""
                  width={38}
                  height={38}
                  style={{ borderRadius: 6 }}
                />
              )}
              <div style={{ minWidth: 0, flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 10,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: "#ffc857",
                  }}
                >
                  Rarest achievement
                </p>
                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.65)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {rare.name} / {rare.percent}%
                </p>
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: 18,
              paddingTop: 14,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {data.personality.emoji} {data.personality.title}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                color: "rgba(255,255,255,0.35)",
                maxWidth: 210,
                textAlign: "right",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {compactUrl(shareUrl)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
