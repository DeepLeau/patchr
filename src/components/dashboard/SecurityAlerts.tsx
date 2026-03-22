"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert } from "@/lib/data";

interface SecurityAlertsProps {
  alerts: Alert[];
  loading?: boolean;
}

type FilterType = "all" | "critical" | "action";

export function SecurityAlerts({ alerts, loading = false }: SecurityAlertsProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
  };

  const visibleAlerts = alerts.filter((alert) => {
    if (dismissedIds.has(alert.id)) return false;
    if (filter === "critical") return alert.severity === "critical";
    if (filter === "action") return alert.actionRequired;
    return true;
  });

  const remainingCount = alerts.filter((a) => !dismissedIds.has(a.id)).length;

  if (loading) {
    return (
      <div className="bg-[#111] border border-white/[0.10] rounded-xl p-5" data-testid="alert-skeleton">
        <div className="h-5 w-32 rounded bg-white/[0.05] animate-pulse mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-white/[0.05] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-white/[0.10] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-zinc-100">Security Alerts</h3>
          <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-xs font-medium">
            {remainingCount}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {(["all", "critical", "action"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                filter === f
                  ? "bg-white/[0.08] text-zinc-200"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {f === "all" ? "All" : f === "critical" ? "Critical" : "Action"}
            </button>
          ))}
        </div>
      </div>

      {visibleAlerts.length === 0 ? (
        <div className="py-12 text-center">
          <div className="text-2xl mb-2">🎉</div>
          <p className="text-sm text-zinc-400">All clear!</p>
          <p className="text-xs text-zinc-600 mt-1">No security alerts to show</p>
        </div>
      ) : (
        <ul className="space-y-2" role="list">
          <AnimatePresence>
            {visibleAlerts.map((alert) => (
              <motion.li
                key={alert.id}
                data-testid={`alert-item-${alert.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={cn(
                  "relative p-4 rounded-lg border overflow-hidden",
                  alert.severity === "critical"
                    ? "bg-red-500/10 border-red-500/30"
                    : alert.severity === "high"
                    ? "bg-orange-500/10 border-orange-500/30"
                    : alert.severity === "medium"
                    ? "bg-yellow-500/10 border-yellow-500/30"
                    : "bg-zinc-500/10 border-zinc-500/30"
                )}
                role="listitem"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mt-1.5 shrink-0",
                      alert.severity === "critical"
                        ? "bg-red-500"
                        : alert.severity === "high"
                        ? "bg-orange-500"
                        : alert.severity === "medium"
                        ? "bg-yellow-500"
                        : "bg-zinc-500"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className={cn(
                          "text-sm font-medium",
                          alert.severity === "critical"
                            ? "text-red-400"
                            : alert.severity === "high"
                            ? "text-orange-400"
                            : alert.severity === "medium"
                            ? "text-yellow-400"
                            : "text-zinc-400"
                        )}
                      >
                        {alert.title}
                      </h4>
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase border",
                          alert.severity === "critical"
                            ? "bg-red-500/15 text-red-400 border-red-500/25"
                            : alert.severity === "high"
                            ? "bg-orange-500/15 text-orange-400 border-orange-500/25"
                            : alert.severity === "medium"
                            ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/25"
                            : "bg-zinc-500/15 text-zinc-400 border-zinc-500/25"
                        )}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mb-2">{alert.description}</p>
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
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
