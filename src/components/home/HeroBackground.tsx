"use client";

import { motion } from "framer-motion";

const SIGNALS = [
  { label: "Lifetime", value: "8,742h", x: "7%", y: "25%", delay: 0 },
  { label: "Rarest", value: "0.4%", x: "75%", y: "18%", delay: 0.22 },
  { label: "Backlog", value: "38%", x: "70%", y: "65%", delay: 0.44 },
  { label: "Peak", value: "Nov", x: "11%", y: "72%", delay: 0.66 },
];

export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#050814]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(11,38,67,0.9)_0%,rgba(5,8,20,0.92)_38%,rgba(20,9,30,0.78)_67%,rgba(5,8,20,1)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[58%] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(92,225,230,0.23),transparent_70%)]" />
      <div
        className="absolute inset-x-[-8%] bottom-[-20%] h-[56%] opacity-[0.2]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(92,225,230,0.45) 1px, transparent 1px),
            linear-gradient(90deg, rgba(92,225,230,0.45) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          transform: "perspective(760px) rotateX(64deg)",
          transformOrigin: "center bottom",
          maskImage: "linear-gradient(to top, black, transparent)",
        }}
      />

      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:100%_8px]" />

      {SIGNALS.map((signal) => (
        <motion.div
          key={signal.label}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: [0, -12, 0] }}
          transition={{
            opacity: { delay: signal.delay, duration: 0.45 },
            y: {
              delay: signal.delay,
              duration: 6.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="absolute hidden w-36 rounded-lg border border-white/10 bg-[#07111f]/70 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl xl:block"
          style={{ left: signal.x, top: signal.y }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
            {signal.label}
          </p>
          <p className="mt-2 text-2xl font-black text-white">{signal.value}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#5ce1e6] to-[#ffc857]" />
          </div>
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050814]" />
    </div>
  );
}
