"use client";

import { motion } from "framer-motion";

const FLOATING_CARDS = [
  { title: "Top game", value: "412h", x: "7%", y: "24%", delay: 0 },
  { title: "Rare flex", value: "0.4%", x: "72%", y: "18%", delay: 0.25 },
  { title: "Backlog", value: "38%", x: "68%", y: "66%", delay: 0.5 },
  { title: "Peak month", value: "Nov", x: "12%", y: "70%", delay: 0.75 },
];

export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,#070a11_0%,#111726_38%,#210d1b_68%,#08131a_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_0%,rgba(92,225,230,0.22),transparent_65%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(102,192,244,0.08),transparent_22%,rgba(255,200,87,0.07)_50%,transparent_76%,rgba(255,107,157,0.08))]" />

      <div
        className="absolute inset-x-[-10%] bottom-[-18%] h-[58%] opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(102,192,244,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102,192,244,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "52px 52px",
          transform: "perspective(680px) rotateX(62deg)",
          transformOrigin: "center bottom",
          maskImage: "linear-gradient(to top, black, transparent)",
        }}
      />

      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:100%_7px]" />

      {FLOATING_CARDS.map((card) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 18, rotate: -3 }}
          animate={{ opacity: 1, y: [0, -10, 0], rotate: [-2, 2, -2] }}
          transition={{
            opacity: { delay: card.delay, duration: 0.5 },
            y: {
              delay: card.delay,
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              delay: card.delay,
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="absolute hidden w-36 rounded-lg border border-white/10 bg-white/[0.045] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:block"
          style={{ left: card.x, top: card.y }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">
            {card.title}
          </p>
          <p className="mt-2 text-2xl font-black text-white">{card.value}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/3 rounded-full bg-[#5ce1e6]" />
          </div>
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#070a11]" />
    </div>
  );
}
