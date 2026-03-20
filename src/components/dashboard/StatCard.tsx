"use client";

import { motion } from "framer-motion";
import { Shield, GitBranch, Clock, Package, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  delta?: number;
  deltaType?: "positive" | "negative" | "neutral";
  icon: "shield" | "git-branch" | "clock" | "package";
  loading?: boolean;
}

const iconMap = {
  shield: Shield,
  "git-branch": GitBranch,
  clock: Clock,
  package: Package,
};

const deltaConfig = {
  positive: {
    icon: TrendingUp,
    color: "text-accent-hi",
    bg: "bg-accent/10",
  },
  negative: {
    icon: TrendingDown,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  neutral: {
    icon: Minus,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
  },
};

export function StatCard({
  label,
  value,
  delta,
  deltaType = "neutral",
  icon,
  loading = false,
}: StatCardProps) {
  const Icon = iconMap[icon];
  const deltaInfo = deltaConfig[deltaType];

  if (loading) {
    return (
      <div className="bg-[#111] border border-white/[0.10] rounded-xl p-5 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-white/[0.05]" />
          <div className="w-16 h-5 rounded-full bg-white/[0.05]" />
        </div>
        <div className="w-20 h-8 rounded bg-white/[0.05] mb-2" />
        <div className="w-32 h-4 rounded bg-white/[0.05]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative group bg-[#111] border border-white/[0.10] hover:border-white/[0.14] rounded-xl p-5 overflow-hidden"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg border border-accent/20 bg-accent/10 flex items-center justify-center">
            <Icon size={18} className="text-accent-hi" strokeWidth={1.5} />
          </div>

          {/* Delta badge */}
          {delta !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                deltaInfo.bg,
                deltaInfo.color
              )}
            >
              <deltaInfo.icon size={10} />
              {delta > 0 ? "+" : ""}
              {delta}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-1">
          <span className="text-3xl font-semibold text-zinc-100 tracking-tight">
            {value}
          </span>
        </div>

        {/* Label */}
        <p className="text-sm text-zinc-400">{label}</p>
      </div>
    </motion.div>
  );
}
