"use client";
import { motion, useMotionValue, useTransform, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const BentoCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [2, -2]);
  const rotateY = useTransform(x, [-100, 100], [-2, 2]);

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(((e.clientX - rect.left) / rect.width - 0.5) * 100);
        y.set(((e.clientY - rect.top) / rect.height - 0.5) * 100);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative rounded-xl border border-white/[0.07] bg-[#111] p-5 flex flex-col gap-3 overflow-hidden",
        className
      )}
    >
      <div
        style={{ transform: "translateZ(20px)" }}
        className="flex flex-col gap-2 flex-1"
      >
        {children}
      </div>
    </motion.div>
  );
};

const CounterFeature = ({
  start,
  end,
  suffix = "",
}: {
  start: number;
  end: number;
  suffix?: string;
}) => {
  const [count, setCount] = React.useState(start);
  React.useEffect(() => {
    const total = 60 * 2;
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      const p = 1 - (1 - frame / total) ** 3;
      setCount(Math.min(start + (end - start) * p, end));
      if (frame >= total) clearInterval(id);
    }, 1000 / 60);
    return () => clearInterval(id);
  }, [start, end]);

  return (
    <div className="mt-auto pt-3">
      <span className="text-3xl font-bold text-zinc-100 tracking-tight">
        {Math.round(count).toLocaleString()}
      </span>
      <span className="text-xl font-medium text-zinc-100 ml-1">{suffix}</span>
    </div>
  );
};

const MetricsFeature = ({
  metrics,
}: {
  metrics: Array<{ label: string; value: number; suffix?: string }>;
}) => (
  <div className="mt-2 flex flex-col gap-3">
    {metrics.map(({ label, value, suffix }, i) => (
      <motion.div
        key={label}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * i }}
      >
        <div className="flex justify-between text-xs mb-1">
          <span className="text-zinc-400">{label}</span>
          <span className="text-zinc-300 font-medium">
            {value}
            {suffix}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, value)}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 * i }}
            className="h-full rounded-full bg-accent"
          />
        </div>
      </motion.div>
    ))}
  </div>
);

const TimelineFeature = ({
  items,
}: {
  items: Array<{ year: string; event: string }>;
}) => (
  <div className="relative mt-2">
    <div className="absolute top-0 bottom-0 left-[9px] w-px bg-white/[0.06]" />
    {items.map(({ year, event }, i) => (
      <motion.div
        key={year}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 * i }}
        className="flex gap-3 mb-3 relative"
      >
        <div className="z-10 mt-0.5 w-5 h-5 rounded-full border border-white/20 bg-[#111] shrink-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        </div>
        <div>
          <p className="text-xs font-medium text-zinc-300">{year}</p>
          <p className="text-xs text-zinc-500">{event}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

const TypingFeature = ({ code }: { code: string }) => {
  const [displayed, setDisplayed] = useState("");
  const [i, setI] = useState(0);

  useEffect(() => {
    if (i >= code.length) return;
    const id = setTimeout(() => {
      setDisplayed((p) => p + code[i]);
      setI((p) => p + 1);
    }, Math.random() * 25 + 8);
    return () => clearTimeout(id);
  }, [i, code]);

  return (
    <div className="mt-2 rounded-md bg-[#0a0a0a] border border-white/[0.07] p-3 overflow-hidden h-36">
      <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap overflow-hidden">
        {displayed}
        <span className="animate-pulse">▋</span>
      </pre>
    </div>
  );
};

const SpotlightFeature = ({ items }: { items: string[] }) => (
  <ul className="mt-2 flex flex-col gap-1.5">
    {items.map((item, i) => (
      <motion.li
        key={item}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.08 * i }}
        className="flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4ade80"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <span className="text-sm text-zinc-400">{item}</span>
      </motion.li>
    ))}
  </ul>
);

export {
  BentoCard,
  CounterFeature,
  MetricsFeature,
  TimelineFeature,
  TypingFeature,
  SpotlightFeature,
  staggerContainer,
};
