"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
} from "recharts";
import { cn } from "@/lib/utils";

interface LineChartCardProps {
  title: string;
  data: Array<{ week: string; avgDays: number }>;
  loading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-white/[0.10] rounded-lg p-3 shadow-xl">
        <p className="text-xs text-zinc-400 mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-100">
            {payload[0].value.toFixed(1)} days
          </span>
          <span className="text-xs text-zinc-500">avg</span>
        </div>
      </div>
    );
  }
  return null;
};

export function LineChartCard({ title, data, loading = false }: LineChartCardProps) {
  if (loading) {
    return (
      <div className="bg-[#111] border border-white/[0.10] rounded-xl p-5">
        <div className="w-44 h-5 rounded bg-white/[0.05] animate-pulse mb-6" />
        <div className="h-48 flex items-center justify-center">
          <div className="w-full h-full bg-white/[0.03] animate-pulse" />
        </div>
      </div>
    );
  }

  const minValue = Math.min(...data.map((d) => d.avgDays));
  const maxValue = Math.max(...data.map((d) => d.avgDays));
  const currentValue = data[data.length - 1].avgDays;
  
  // Target = moyenne initiale (W1) pour montrer variance
  const targetValue = data[0].avgDays;
  // Bande de tolérance ± 0.5 jours
  const toleranceBand = 0.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
      className="bg-[#111] border border-white/[0.10] rounded-xl p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
          <p className="text-xs text-zinc-500 mt-1">Weekly average</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-accent-hi">
            {currentValue.toFixed(1)}
            <span className="text-xs text-zinc-400 ml-1">days</span>
          </p>
          <p className="text-[10px] text-accent-hi">↓ Best time</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {/* Bande haute - vert pâle */}
              <linearGradient id="bandeHaute" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
              {/* Bande basse - vert pâle inversé */}
              <linearGradient id="bandeBasse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.05} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.15} />
              </linearGradient>
              {/* Glow effect pour la ligne réelle */}
              <filter id="glowLine" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
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
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#52525b", fontSize: 11 }}
              dy={10}
            />
            <YAxis
              domain={[Math.floor(minValue - 0.5), Math.ceil(maxValue + 0.5)]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#52525b", fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Bande de tolérance - ligne haute target en pointillé */}
            <ReferenceLine
              y={targetValue + toleranceBand}
              stroke="#10b981"
              strokeDasharray="5 5"
              strokeOpacity={0.25}
            />
            
            {/* Bande haute de tolérance */}
            <Area
              type="monotone"
              dataKey={() => targetValue + toleranceBand}
              stroke="transparent"
              fill="url(#bandeHaute)"
              animationDuration={0}
            />
            
            {/* Bande basse de tolérance */}
            <Area
              type="monotone"
              dataKey={() => targetValue - toleranceBand}
              stroke="transparent"
              fill="url(#bandeBasse)"
              animationDuration={0}
            />
            
            {/* Ligne target en pointillé vert */}
            <ReferenceLine
              y={targetValue}
              stroke="#10b981"
              strokeDasharray="5 5"
              strokeOpacity={0.5}
              label={{
                value: "Target",
                position: "right",
                fill: "#10b981",
                fontSize: 10,
                opacity: 0.7,
              }}
            />
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Ligne réelle avec dots et glow */}
              <Line
                type="monotone"
                dataKey="avgDays"
                stroke="#10b981"
                strokeWidth={2.5}
                filter="url(#glowLine)"
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
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/[0.05]">
        <div>
          <p className="text-xs text-zinc-500">Best</p>
          <p className="text-sm font-medium text-accent-hi">{minValue.toFixed(1)}d</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Current</p>
          <p className="text-sm font-medium text-zinc-200">{currentValue.toFixed(1)}d</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Improvement</p>
          <p className="text-sm font-medium text-accent-hi">
            {(((data[0].avgDays - currentValue) / data[0].avgDays) * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
}
