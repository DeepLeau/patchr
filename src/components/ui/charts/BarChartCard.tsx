"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

interface BarChartCardProps {
  title: string;
  data: Array<{ language: string; count: number; critical: number }>;
  loading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { language: string; count: number; critical: number } }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1a1a1a] border border-white/[0.10] rounded-lg p-3 shadow-xl">
        <p className="text-xs font-medium text-zinc-100 mb-2">{data.language}</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-hi" />
            <span className="text-zinc-400">Total deps:</span>
            <span className="text-zinc-100 font-medium">{data.count}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-zinc-400">Critical:</span>
            <span className="text-zinc-100 font-medium">{data.critical}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Palette cyan → violet progressif pour look cybersécurité premium
const CYBER_COLORS = [
  "#06b6d4", // cyan-500
  "#0891b2", // cyan-600
  "#0e7490", // cyan-700
  "#6366f1", // indigo-500
  "#7c3aed", // violet-600
  "#8b5cf6", // violet-500
];

const getBarGradient = (index: number, critical: number) => {
  if (critical > 0) {
    return "url(#criticalGradient)";
  }
  const colorIndex = index % CYBER_COLORS.length;
  return CYBER_COLORS[colorIndex];
};

export function BarChartCard({ title, data, loading = false }: BarChartCardProps) {
  if (loading) {
    return (
      <div className="bg-[#111] border border-white/[0.10] rounded-xl p-5">
        <div className="w-36 h-5 rounded bg-white/[0.05] animate-pulse mb-6" />
        <div className="h-48 flex items-end justify-around gap-2">
          {[40, 65, 50, 35, 75, 55].map((h, i) => (
            <div
              key={i}
              className="w-8 rounded-t bg-white/[0.05] animate-pulse"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="bg-[#111] border border-white/[0.10] rounded-xl p-5"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        <p className="text-xs text-zinc-500 mt-1">Dependencies by package</p>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barCategoryGap="30%"
          >
            <defs>
              {/* Gradient critique - rouge glow */}
              <linearGradient id="criticalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                <stop offset="100%" stopColor="#991b1b" stopOpacity={0.8} />
              </linearGradient>
              {/* Gradients cyan → violet pour chaque barre */}
              <linearGradient id="barGrad0" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                <stop offset="100%" stopColor="#0891b2" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0891b2" stopOpacity={1} />
                <stop offset="100%" stopColor="#0e7490" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0e7490" stopOpacity={1} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="barGrad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="barGrad4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={1} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="barGrad5" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="language"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#52525b", fontSize: 10 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#52525b", fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.critical > 0 ? "url(#criticalGradient)" : `url(#barGrad${index % 6})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.05]">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <div className="w-2 h-2 rounded-full bg-gradient-to-b from-cyan-500 to-cyan-700" />
          Safe
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <div className="w-2 h-2 rounded-full bg-gradient-to-b from-red-500 to-red-800" />
          Has critical
        </div>
      </div>
    </motion.div>
  );
}
