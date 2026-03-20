"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Scan } from "@/lib/data";

interface RecentScansProps {
  scans: Scan[];
  loading?: boolean;
}

type SortKey = "repository" | "status" | "vulnerabilities" | "date";
type SortOrder = "asc" | "desc";

const statusConfig = {
  completed: {
    bg: "bg-accent/10",
    text: "text-accent-hi",
    border: "border-accent/20",
    icon: CheckCircle,
    label: "Completed",
  },
  running: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    icon: Loader2,
    label: "Running",
  },
  failed: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
    icon: XCircle,
    label: "Failed",
  },
};

export function RecentScans({ scans, loading = false }: RecentScansProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const sortedScans = [...scans].sort((a, b) => {
    let comparison = 0;
    switch (sortKey) {
      case "repository":
        comparison = a.repository.localeCompare(b.repository);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      case "vulnerabilities":
        comparison = a.vulnerabilities - b.vulnerabilities;
        break;
      case "date":
        comparison = a.date.localeCompare(b.date);
        break;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  if (loading) {
    return (
      <div className="bg-[#111] border border-white/[0.10] rounded-xl overflow-hidden" data-testid="scans-skeleton">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <div className="w-28 h-5 rounded bg-white/[0.05] animate-pulse" />
        </div>
        <div className="divide-y divide-white/[0.04]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4">
              <div className="w-32 h-4 rounded bg-white/[0.05] animate-pulse" />
              <div className="w-20 h-4 rounded bg-white/[0.05] animate-pulse" />
              <div className="w-24 h-4 rounded bg-white/[0.05] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-[#111] border border-white/[0.10] rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <h3 className="text-sm font-semibold text-zinc-100">Recent Scans</h3>
        <a
          href="#"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          View all →
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {[
                { key: "repository" as SortKey, label: "Repository" },
                { key: "status" as SortKey, label: "Status" },
                { key: "vulnerabilities" as SortKey, label: "Vulns" },
                { key: "date" as SortKey, label: "Date" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-5 py-3 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <ArrowUpDown
                      size={10}
                      className={cn(
                        sortKey === key ? "text-accent-hi" : "",
                        "opacity-40"
                      )}
                    />
                  </div>
                </th>
              ))}
              <th className="px-5 py-3 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                Commit
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                Duration
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedScans.map((scan) => {
              const status = statusConfig[scan.status];
              const StatusIcon = status.icon;

              return (
                <tr
                  key={scan.id}
                  className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <span className="text-zinc-300 font-medium">
                      {scan.repository}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
                        status.bg,
                        status.text,
                        status.border
                      )}
                    >
                      <StatusIcon
                        size={10}
                        className={scan.status === "running" ? "animate-spin" : ""}
                      />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "font-mono text-xs",
                        scan.vulnerabilities > 0 ? "text-red-400" : "text-zinc-400"
                      )}
                    >
                      {scan.vulnerabilities}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-zinc-500 text-xs">
                    {scan.date}
                  </td>
                  <td className="px-5 py-4">
                    <code className="text-xs text-zinc-400 bg-white/[0.05] px-1.5 py-0.5 rounded">
                      {scan.commit}
                    </code>
                  </td>
                  <td className="px-5 py-4 text-zinc-500 text-xs font-mono">
                    {scan.duration}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
