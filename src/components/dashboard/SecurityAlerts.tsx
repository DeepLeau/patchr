"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, ExternalLink, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert } from "@/lib/data";

interface SecurityAlertsProps {
  alerts: Alert[];
  loading?: boolean;
}

const severityConfig = {
  critical: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    badge: "bg-red-500/15 text-red-400 border-red-500/25",
    dot: "bg-red-500",
  },
  high: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
    badge: "bg-orange-500/15 text-orange-400 border-orange-500/25",
    dot: "bg-orange-500",
  },
  medium: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
    dot: "bg-yellow-500",
  },
  low: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
    badge: "bg-green-500/15 text-green-400 border-green-500/25",
    dot: "bg-green-500",
  },
};

export function SecurityAlerts({ alerts, loading = false }: SecurityAlertsProps) {
  const [filter, setFilter] = useState<"all" | "critical" | "action">("all");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const filteredAlerts = alerts.filter((alert) => {
    if (dismissed.has(alert.id)) return false;
    if (filter === "critical") return alert.severity === "critical";
    if (filter === "action") return alert.actionRequired;
    return true;
  });

  const handleDismiss = (id: string) => {
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
  };

  if (loading) {
    return (
      <div className="bg-[#111] border border-white/[0.10] rounded-xl p-5" data-testid="alert-skeleton">
        <div className="flex items-center justify-between mb-4">
          <div className="w-32 h-5 rounded bg-white/[0.05] animate-pulse" />
          <div className="w-20 h-5 rounded bg-white/[0.05] animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-lg bg-white/[0.03] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (filteredAlerts.length === 0) {
    return (
      <div className="bg-[#111] border border-white/[0.10] rounded-xl p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={20} className="text-accent-hi" />
        </div>
        <p className="text-sm font-medium text-zinc-200 mb-1">All clear!</p>
        <p className="text-xs text-zinc-500">
          No security alerts requiring attention.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-white/[0.10] rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-zinc-100">Security Alerts</h3>
          <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-xs font-medium">
            {filteredAlerts.length}
          </span>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1">
          {(["all", "critical", "action"] as const).map((f) => (
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
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts list */}
      <ul className="space-y-2" role="list">
        <AnimatePresence mode="popLayout">
          {filteredAlerts.map((alert, index) => {
            const config = severityConfig[alert.severity];

            return (
              <motion.li
                key={alert.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                data-testid={`alert-item-${alert.id}`}
                role="listitem"
                className={cn(
                  "relative p-4 rounded-lg border overflow-hidden list-none",
                  config.bg,
                  config.border
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Severity dot */}
                  <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", config.dot)} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn("text-sm font-medium", config.text)}>
                        {alert.title}
                      </h4>
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase border",
                          config.badge
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

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {alert.actionRequired && (
                      <button className="p-1.5 rounded-md bg-accent/15 hover:bg-accent/25 text-accent-hi transition-colors">
                        <ExternalLink size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDismiss(alert.id)}
                      aria-label="Close"
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
    </div>
  );
}
