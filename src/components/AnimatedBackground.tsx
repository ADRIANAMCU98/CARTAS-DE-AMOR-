import { motion } from "motion/react";

const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  delay: (i * 0.7) % 5,
  duration: 12 + (i % 6),
  size: 6 + (i % 4) * 3,
  opacity: 0.12 + (i % 3) * 0.07,
}));

const ORBS = [
  { top: "-8%", left: "-5%", w: "min(55vw, 420px)", colors: "from-indigo-400/35 via-violet-500/25 to-transparent" },
  { top: "15%", right: "-10%", w: "min(50vw, 380px)", colors: "from-fuchsia-400/30 via-pink-500/20 to-transparent" },
  { bottom: "-5%", left: "25%", w: "min(60vw, 480px)", colors: "from-violet-500/25 via-purple-400/15 to-transparent" },
];

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-mesh" />
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${orb.colors} blur-3xl`}
          style={{
            top: orb.top,
            left: orb.left,
            right: orb.right,
            width: orb.w,
            height: orb.w,
          }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-grain opacity-[0.28]" />
      {PETALS.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-br from-violet-400/35 via-fuchsia-300/25 to-pink-200/30 blur-[1px]"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          initial={{ y: "110vh", rotate: 0 }}
          animate={{
            y: "-10vh",
            rotate: 360,
            x: [0, 20, -15, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
