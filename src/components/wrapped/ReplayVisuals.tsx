"use client";

import { LOCALE } from "@/lib/locale";

import { motion } from "framer-motion";
import type {
  CompletedGameEntry,
  GameSpotlight,
  ReplayCompareMetric,
  ReplayData,
  WorkshopItem,
  WorkshopStats,
} from "@/types/wrapped";
import { MultiplierBadge, ShineOverlay } from "./WowEffects";

/* ─── Mosaic background (Steam Replay style) ─── */

export function MosaicBackground({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  const tiles = [...images, ...images].slice(0, 16);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      <div className="replay-mosaic-grid absolute inset-0 grid grid-cols-4 gap-1 p-4 sm:grid-cols-5">
        {tiles.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            className="aspect-[460/215] w-full rounded-sm object-cover"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#120810]/90 via-[#120810]/85 to-[#0a0510]/98" />
    </div>
  );
}

/* ─── Dashboard stat cards ─── */

function statValueClass(value: string | number): string {
  const text = String(value).replace(/\s/g, "");
  const len = text.length;
  if (len >= 6) return "text-xl sm:text-2xl md:text-3xl";
  if (len >= 5) return "text-2xl sm:text-3xl md:text-4xl";
  if (len >= 4) return "text-3xl sm:text-4xl md:text-5xl";
  return "text-4xl sm:text-5xl";
}

export function DashboardStatCard({
  title,
  value,
  subtitle,
  delay = 0,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.55, type: "spring", stiffness: 200 }}
      className="replay-card-wow flex min-w-0 flex-col justify-between overflow-hidden p-4 sm:p-5"
    >
      <ShineOverlay />
      <p className="relative text-sm font-medium text-white/55">{title}</p>
      <p
        className={`relative mt-2 font-black tabular-nums leading-none tracking-tight text-white ${statValueClass(value)}`}
      >
        {value}
      </p>
      {subtitle && (
        <p className="relative mt-3 text-xs text-white/40">{subtitle}</p>
      )}
    </motion.div>
  );
}

export function DashboardGameCard({
  name,
  image,
  percent,
  hours,
  delay = 0,
}: {
  name: string;
  image?: string;
  percent: number;
  hours: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, type: "spring" }}
      whileHover={{ scale: 1.02 }}
      className="replay-card-wow relative min-h-[150px] overflow-hidden p-0"
    >
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
      <ShineOverlay />
      <div className="relative flex h-full flex-col justify-end p-4">
        <p className="truncate text-sm font-bold text-white">{name}</p>
        <p className="mt-1 text-3xl font-black text-shimmer-gold">{percent}%</p>
        <p className="text-xs text-white/50">
          {hours.toLocaleString(LOCALE)}h played
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Compare bars (How You Compare) ─── */

export function CompareBar({
  metric,
  index,
}: {
  metric: ReplayCompareMetric;
  index: number;
}) {
  const fillPct = Math.min(
    100,
    Math.max(8, (metric.user / Math.max(metric.user, metric.median * 2)) * 100)
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + index * 0.12, duration: 0.5 }}
      className="space-y-2"
    >
      <p className="text-sm font-semibold text-white">
        You have{" "}
        <span className="text-white">
          {metric.user.toLocaleString(LOCALE)} {metric.unit}
        </span>
      </p>
      <div className="relative h-10 overflow-hidden rounded-lg bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${fillPct}%` }}
          transition={{
            delay: 0.3 + index * 0.12,
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="replay-compare-bar h-full rounded-lg"
        />
        <div
          className="absolute top-0 bottom-0 w-px bg-white/30"
          style={{
            left: `${Math.min(95, (metric.median / Math.max(metric.user, metric.median * 2)) * 100)}%`,
          }}
        />
      </div>
      <p className="flex flex-wrap items-center gap-2 text-xs text-white/45">
        <span className="text-emerald-400">▲</span>
        Steam median ~{metric.median.toLocaleString(LOCALE)}
        <MultiplierBadge ratio={metric.ratio} delay={0.5 + index * 0.12} />
      </p>
    </motion.div>
  );
}

/* ─── Donut chart (New / Recent / Classic) ─── */

export function EraDonut({
  era,
}: {
  era: ReplayData["playtimeEra"];
}) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const segments = [
    { ...era.new, color: "#5ce1e6", label: "New releases" },
    { ...era.recent, color: "#c9a227", label: "Recent" },
    { ...era.classic, color: "#8b4049", label: "Classics" },
  ];

  let offset = 0;
  const arcs = segments.map((s) => {
    const dash = (s.percent / 100) * c;
    const arc = { ...s, dash, gap: c - dash, offset };
    offset += dash;
    return arc;
  });

  const highlight = segments.reduce((a, b) => (a.percent > b.percent ? a : b));

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      <div className="relative shrink-0">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="14"
          />
          {arcs.map((a) => (
            <circle
              key={a.label}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={a.color}
              strokeWidth="14"
              strokeDasharray={`${a.dash} ${a.gap}`}
              strokeDashoffset={-a.offset + c / 4}
              strokeLinecap="butt"
            />
          ))}
        </svg>
      </div>
      <div className="flex-1 space-y-3">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-3 text-sm">
            <span
              className="h-3 w-3 shrink-0 rounded-sm"
              style={{ background: s.color }}
            />
            <span className="flex-1 text-white/70">{s.label}</span>
            <span className="font-bold text-white">{s.percent}%</span>
          </div>
        ))}
        <div className="replay-highlight-box mt-4 p-4">
          <p className="text-3xl font-black text-[#5ce1e6]">
            {highlight.percent}%
          </p>
          <p className="text-sm text-white/60">{highlight.label}</p>
          <p className="mt-1 text-xs text-white/35">
            How your time splits by release date
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Radar chart (genres) ─── */

export function GenreRadar({
  data,
}: {
  data: ReplayData["genreRadar"];
}) {
  if (data.length === 0) return null;

  const cx = 120;
  const cy = 120;
  const maxR = 88;
  const n = data.length;
  const angleStep = (2 * Math.PI) / n;

  const point = (i: number, val: number) => {
    const a = i * angleStep - Math.PI / 2;
    const r = (val / 100) * maxR;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };

  const gridLevels = [25, 50, 75, 100];
  const dataPoints = data
    .map((d, i) => point(i, d.value))
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

  return (
    <div className="mx-auto w-full max-w-[280px]">
      <svg viewBox="0 0 240 240" className="w-full">
        {gridLevels.map((lvl) => {
          const pts = data
            .map((_, i) => point(i, lvl))
            .map(([x, y]) => `${x},${y}`)
            .join(" ");
          return (
            <polygon
              key={lvl}
              points={pts}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          );
        })}
        {data.map((d, i) => {
          const [x, y] = point(i, 100);
          const [lx, ly] = point(i, 118);
          return (
            <g key={d.label}>
              <line
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white/50 text-[8px] font-medium"
              >
                {d.label}
              </text>
            </g>
          );
        })}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          points={dataPoints}
          fill="rgba(92,225,230,0.25)"
          stroke="#5ce1e6"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

/* ─── By the numbers (dotted leaders) ─── */

export function ByTheNumbers({
  items,
}: {
  items: { label: string; value: number }[];
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 * i }}
          className="flex items-baseline gap-1 text-sm"
        >
          <span className="shrink-0 text-white/65">{item.label}</span>
          <span className="replay-dots min-w-[1rem] flex-1" />
          <span className="shrink-0 font-black text-white tabular-nums">
            {item.value.toLocaleString(LOCALE)}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Monthly bar chart ─── */

function RecordTile({
  label,
  title,
  detail,
  image,
  index,
}: {
  label: string;
  title: string;
  detail: string;
  image?: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.08 * index, type: "spring", stiffness: 180 }}
      className="replay-card-wow relative min-h-[132px] overflow-hidden p-4"
    >
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
      <ShineOverlay />
      <div className="relative flex h-full flex-col justify-end">
        <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#5ce1e6]">
          {label}
        </p>
        <p className="mt-2 line-clamp-2 text-lg font-black leading-tight text-white">
          {title}
        </p>
        <p className="mt-1 text-xs text-white/50">{detail}</p>
      </div>
    </motion.div>
  );
}

export function LibraryRecords({
  records,
}: {
  records: ReplayData["libraryRecords"];
}) {
  const tiles = [
    {
      label: "Time sink",
      title: records.topGameName,
      detail: `${records.topGameHours.toLocaleString(LOCALE)}h in your #1 game`,
    },
    records.oldestGame && {
      label: "Old soul",
      title: records.oldestGame.name,
      detail: `Released in ${records.oldestGame.year}`,
      image: records.oldestGame.headerImage,
    },
    records.newestGame && {
      label: "Freshest game",
      title: records.newestGame.name,
      detail: `Released in ${records.newestGame.year}`,
      image: records.newestGame.headerImage,
    },
    records.mostRecentGame && {
      label: "Last seen",
      title: records.mostRecentGame.name,
      detail: records.mostRecentGame.lastPlayed,
      image: records.mostRecentGame.headerImage,
    },
    records.mostExpensiveBacklog && {
      label: "Backlog guilt",
      title: records.mostExpensiveBacklog.name,
      detail: `~${records.mostExpensiveBacklog.price.toLocaleString(LOCALE)} sitting untouched`,
      image: records.mostExpensiveBacklog.headerImage,
    },
  ].filter(Boolean) as {
    label: string;
    title: string;
    detail: string;
    image?: string;
  }[];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {tiles.slice(0, 5).map((tile, index) => (
        <RecordTile key={tile.label} {...tile} index={index} />
      ))}
    </div>
  );
}

export function MonthlyBars({
  months,
  labels,
}: {
  months: number[];
  labels: string[];
}) {
  const max = Math.max(...months, 1);
  const total = months.reduce((s, c) => s + c, 0);
  const BAR_MAX = 132;

  if (total === 0) {
    return (
      <p className="py-10 text-center text-sm text-white/40">
        No monthly activity detected for this period.
      </p>
    );
  }

  return (
    <div className="flex h-40 items-end justify-between gap-1 sm:gap-1.5">
      {months.map((count, i) => {
        const hPx = Math.max(4, Math.round((count / max) * BAR_MAX));
        return (
          <div
            key={i}
            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: hPx }}
              transition={{ delay: 0.05 * i, duration: 0.7, type: "spring" }}
              className="replay-month-bar w-full rounded-t-sm"
              style={{
                boxShadow:
                  count === max && count > 0
                    ? "0 0 24px rgba(92,225,230,0.7)"
                    : undefined,
              }}
              title={`${count} game${count > 1 ? "s" : ""}`}
            />
            <span className="text-[9px] text-white/35 sm:text-[10px]">
              {labels[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Game deep-dive slide ─── */

export function GameDeepDive({ game }: { game: GameSpotlight }) {
  const catLabel =
    game.releaseCategory === "new"
      ? "New release"
      : game.releaseCategory === "recent"
        ? "Recent game"
        : "Classic";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <span className="replay-pill">{game.playtimePercent}% of total time</span>
        <span className="replay-pill">{game.hours.toLocaleString(LOCALE)}h played</span>
        {game.recentlyActive && (
          <span className="replay-pill replay-pill-accent">Active last 2 weeks</span>
        )}
        {game.achievementComplete && (
          <span className="replay-pill replay-pill-accent">100% achievements</span>
        )}
        {game.priceLabel && (
          <span className="replay-pill">{game.priceLabel}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="replay-card p-3 text-center">
          <p className="text-2xl font-black text-white">{game.playtimePercent}%</p>
          <p className="text-[10px] uppercase tracking-wider text-white/40">
            Time share
          </p>
        </div>
        <div className="replay-card p-3 text-center">
          <p className="text-2xl font-black text-white">{game.hours.toLocaleString(LOCALE)}h</p>
          <p className="text-[10px] uppercase tracking-wider text-white/40">
            Total hours
          </p>
        </div>
        <div className="replay-card p-3 text-center">
          <p className="text-2xl font-black text-white">
            {game.recentHours > 0 ? `${game.recentHours}h` : "—"}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-white/40">
            Last 2 weeks
          </p>
        </div>
        <div className="replay-card p-3 text-center">
          <p className="text-2xl font-black text-white">
            {game.achievementPercent !== undefined
              ? `${game.achievementPercent}%`
              : "—"}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-white/40">
            Achievements
          </p>
        </div>
      </div>

      {(game.developers.length > 0 || game.releaseDate) && (
        <div className="replay-card p-4">
          {game.developers.length > 0 && (
            <p className="text-sm text-white/75">
              <span className="text-white/40">Studio · </span>
              {game.developers.join(", ")}
            </p>
          )}
          {game.releaseDate && (
            <p className="mt-1 text-sm text-white/75">
              <span className="text-white/40">Release · </span>
              {game.releaseDate}
            </p>
          )}
          {game.achievementTotal !== undefined && (
            <p className="mt-1 text-sm text-white/75">
              <span className="text-white/40">Achievements · </span>
              {game.achievementUnlocked}/{game.achievementTotal}
              {game.achievementComplete ? " · Perfect!" : ""}
            </p>
          )}
        </div>
      )}

      {game.lastPlayed && (
        <div>
          <p className="text-xs text-white/45">
            Last session · {game.lastPlayed}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/55">
          {catLabel}
        </span>
        {game.genres.map((g) => (
          <span
            key={g}
            className="rounded-full border border-[#5ce1e6]/25 bg-[#5ce1e6]/10 px-3 py-1 text-xs text-[#5ce1e6]"
          >
            {g}
          </span>
        ))}
      </div>
    </div>
  );
}

function formatStat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString(LOCALE);
}

export function CompletedGamesList({
  games,
  scannedCount,
  profilePerfectGames,
  libraryGamesWithSchema,
}: {
  games: CompletedGameEntry[];
  scannedCount: number;
  profilePerfectGames?: number | null;
  libraryGamesWithSchema?: number;
}) {
  if (games.length === 0) {
    return (
      <p className="text-center text-sm text-white/45">
        No 100% games detected among {scannedCount.toLocaleString(LOCALE)}{" "}
        scanned games
        {libraryGamesWithSchema !== undefined
          ? ` (${libraryGamesWithSchema.toLocaleString(LOCALE)} with achievements in your library)`
          : ""}
        .
      </p>
    );
  }

  const steamGap =
    profilePerfectGames != null && profilePerfectGames > games.length;

  return (
    <div className="max-h-[55vh] space-y-2 overflow-x-hidden overflow-y-auto">
      {games.map((g, i) => (
        <motion.div
          key={g.appid}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: Math.min(0.06 * i, 1.2) }}
          className="replay-card-wow flex min-w-0 items-center gap-3 overflow-hidden p-3"
        >
          {g.headerImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={g.headerImage}
              alt=""
              className="h-12 w-20 shrink-0 rounded-lg object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-white">{g.name}</p>
            <p className="text-xs text-[#ffc857]">
              {g.achievementUnlocked}/{g.achievementTotal} achievements · 100%
            </p>
          </div>
          <span className="text-xl">🏆</span>
        </motion.div>
      ))}
      <p className="pt-2 text-center text-[10px] leading-relaxed text-white/30">
        {games.length.toLocaleString(LOCALE)} game{games.length > 1 ? "s" : ""}{" "}
        confirmed at 100% ·{" "}
        {scannedCount.toLocaleString(LOCALE)} games scanned
        {steamGap && (
          <>
            {" "}
            · Steam shows {profilePerfectGames!.toLocaleString(LOCALE)}{" "}
            (full history)
          </>
        )}
      </p>
    </div>
  );
}

function WorkshopItemCard({
  item,
  index,
}: {
  item: WorkshopItem;
  index: number;
}) {
  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index }}
      onClick={(e) => e.stopPropagation()}
      className="replay-card-wow flex gap-3 p-3 transition hover:ring-1 hover:ring-[#5ce1e6]/40"
    >
      {item.previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.previewUrl}
          alt=""
          className="h-16 w-24 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-white/5 text-2xl">
          📦
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-bold text-white">{item.title}</p>
        <p className="mt-0.5 text-[10px] uppercase tracking-wide text-[#5ce1e6]/80">
          {item.fileTypeLabel}
          {item.appName ? ` · ${item.appName}` : ""}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-white/45">
          <span>👥 {formatStat(item.subscriptions)} subs</span>
          <span>⭐ {formatStat(item.favorites)} favorites</span>
          <span>👁 {formatStat(item.views)} views</span>
        </div>
      </div>
    </motion.a>
  );
}

export function WorkshopShowcase({ workshop }: { workshop: WorkshopStats }) {
  if (!workshop.hasContent) {
    return (
      <p className="text-center text-sm text-white/45">
        No Workshop items or published guides detected on this profile.
      </p>
    );
  }

  const sections: { title: string; items: WorkshopItem[] }[] = [
    { title: "Top creations", items: workshop.topOverall.slice(0, 4) },
    { title: "Wallpapers & art", items: workshop.topWallpapers },
    { title: "Guides", items: workshop.topGuides },
    { title: "Workshop", items: workshop.topWorkshop },
  ].filter((s) => s.items.length > 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { v: formatStat(workshop.totalSubscriptions), l: "Subs" },
          { v: formatStat(workshop.totalFavorites), l: "Favorites" },
          { v: formatStat(workshop.totalViews), l: "Views" },
        ].map((s) => (
          <div key={s.l} className="replay-card p-2.5">
            <p className="text-lg font-black text-white">{s.v}</p>
            <p className="text-[9px] uppercase text-white/35">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="max-h-[48vh] space-y-4 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
              {section.title}
            </p>
            <div className="space-y-2">
              {section.items.map((item, i) => (
                <WorkshopItemCard key={item.publishedFileId} item={item} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
