import { motion } from "motion/react";

const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  delay: (i * 0.7) % 5,
  duration: 12 + (i % 6),
  size: 6 + (i % 4) * 3,
  opacity: 0.15 + (i % 3) * 0.08,
}));

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 bg-grain opacity-[0.35]" />
      {PETALS.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-br from-rose-300/40 to-amber-200/30 blur-[1px]"
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
