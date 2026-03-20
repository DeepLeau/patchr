"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

interface AreaChartCardProps {
  title: string;
  data: Array<{ date: string; vulnerabilities: number; resolved: number }>;
  period?: string;
  loading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-white/[0.10] rounded-lg p-3 shadow-xl">
        <p className="text-xs text-zinc-400 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-zinc-300 capitalize">{entry.name}:</span>
            <span className="text-zinc-100 font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function AreaChartCard({
  title,
  data,
  period = "Last 30 days",
  loading = false,
}: AreaChartCardProps) {
  if (loading) {
    return (
      <div className="bg-[#111] border border-white/[0.10] rounded-xl p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="w-40 h-5 rounded bg-white/[0.05] animate-pulse" />
          <div className="w-24 h-4 rounded bg-white/[0.05] animate-pulse" />
        </div>
        <div className="h-64 rounded-lg bg-white/[0.03] animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#111] border border-white/[0.10] rounded-xl p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        <span className="text-xs text-zinc-500">{period}</span>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {/* Gradient vulnérabilités - cyber red avec glow */}
              <linearGradient id="colorVulns" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dc2626" stopOpacity={0.5} />
                <stop offset="50%" stopColor="#991b1b" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#450a0a" stopOpacity={0} />
              </linearGradient>
              {/* Glow effect vulnérabilités */}
              <filter id="glowVulns" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Gradient résolu - cyber green avec glow */}
              <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                <stop offset="50%" stopColor="#059669" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#064e3b" stopOpacity={0} />
              </linearGradient>
              {/* Glow effect résolu */}
              <filter id="glowResolved" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#52525b", fontSize: 11 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#52525b", fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => (
                <span className="text-xs text-zinc-400 capitalize">{value}</span>
              )}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Vulnerabilities curve with dots and glow */}
              <Area
                type="monotone"
                dataKey="vulnerabilities"
                stroke="#dc2626"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorVulns)"
                dot={{
                  fill: "#1a1a1a",
                  stroke: "#dc2626",
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  fill: "#dc2626",
                  stroke: "#1a1a1a",
                  strokeWidth: 2,
                  r: 6,
                }}
                animationDuration={1500}
                animationEasing="ease-out"
              />
              {/* Resolved curve with dots and glow */}
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorResolved)"
                dot={{
                  fill: "#1a1a1a",
                  stroke: "#10b981",
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  fill: "#10b981",
                  stroke: "#1a1a1a",
                  strokeWidth: 2,
                  r: 6,
                }}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </motion.div>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
