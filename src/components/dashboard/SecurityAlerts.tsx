"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert } from "@/lib/data";

interface SecurityAlertsProps {
  alerts: Alert[];
  loading?: boolean;
}

type FilterType = "all" | "critical" | "action";

const severityConfig = {
  critical: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    dot: "bg-red-500",
    badge: "bg-red-500/15 text-red-400 border-red-500/25",
  },
  high: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
    dot: "bg-orange-500",
    badge: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  },
  medium: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    dot: "bg-yellow-500",
    badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  },
  low: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  },
};

export function SecurityAlerts({ alerts, loading = false }: SecurityAlertsProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const filteredAlerts = alerts.filter((alert) => {
    if (dismissedIds.has(alert.id)) return false;
    if (activeFilter === "critical") return alert.severity === "critical";
    if (activeFilter === "action") return alert.actionRequired;
    return true;
  });

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
  };

  if (loading) {
    return (
      <div
        className="bg-[#111] border border-white/[0.10] rounded-xl p-5"
        data-testid="alert-skeleton"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-32 h-5 rounded bg-white/[0.05] animate-pulse" />
          <div className="w-20 h-5 rounded bg-white/[0.05] animate-pulse" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-lg bg-white/[0.05] animate-pulse"
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
      transition={{ delay: 0.3 }}
      className="bg-[#111] border border-white/[0.10] rounded-xl p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-zinc-100">
            Security Alerts
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-xs font-medium">
            {filteredAlerts.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {(["all", "critical", "action"] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                activeFilter === filter
                  ? "bg-white/[0.08] text-zinc-200"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 text-accent-hi" />
          </div>
          <p className="text-sm font-medium text-zinc-300">All clear!</p>
          <p className="text-xs text-zinc-500 mt-1">
            No security alerts to display
          </p>
        </div>
      ) : (
        <ul className="space-y-2" role="list">
          <AnimatePresence>
            {filteredAlerts.map((alert) => {
              const severity = severityConfig[alert.severity];
              return (
                <motion.li
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  data-testid={`alert-item-${alert.id}`}
                  className={cn(
                    "relative p-4 rounded-lg border overflow-hidden list-none",
                    severity.bg,
                    severity.border
                  )}
                  role="listitem"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        severity.dot
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={cn("text-sm font-medium", severity.text)}>
                          {alert.title}
                        </h4>
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase border",
                            severity.badge
                          )}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mb-2">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-4 text-[11px] text-zinc-500">
                        <span className="font-mono">{alert.package}</span>
                        <span>·</span>
                        <span>{alert.repository}</span>
                        <span>·</span>
                        <span>{alert.detectedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button className="p-1.5 rounded-md bg-accent/15 hover:bg-accent/25 text-accent-hi transition-colors">
                        <ExternalLink size={12} />
                      </button>
                      <button
                        aria-label="Close"
                        onClick={() => handleDismiss(alert.id)}
                        className="p-1.5 rounded-md hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </motion.div>
  );
}
