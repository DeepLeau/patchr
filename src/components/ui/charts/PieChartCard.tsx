"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

interface PieChartCardProps {
  title: string;
  data: Array<{ name: string; value: number; color: string }>;
  loading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number; color: string } }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1a1a1a] border border-white/[0.10] rounded-lg p-3 shadow-xl">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="text-xs text-zinc-300">{data.name}:</span>
          <span className="text-xs text-zinc-100 font-medium">{data.value}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function PieChartCard({ title, data, loading = false }: PieChartCardProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <div className="bg-[#111] border border-white/[0.10] rounded-xl p-5">
        <div className="w-32 h-5 rounded bg-white/[0.05] animate-pulse mb-6" />
        <div className="flex items-center justify-center">
          <div className="w-40 h-40 rounded-full bg-white/[0.05] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className="bg-[#111] border border-white/[0.10] rounded-xl p-5"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        <p className="text-xs text-zinc-500 mt-1">Distribution by severity</p>
      </div>

      {/* Chart */}
      <div className="h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-semibold text-zinc-100">{total}</span>
          <span className="text-xs text-zinc-500">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/[0.05]">
        {data.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-center gap-2"
          >
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-300 truncate">{item.name}</p>
              <p className="text-[10px] text-zinc-500">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
