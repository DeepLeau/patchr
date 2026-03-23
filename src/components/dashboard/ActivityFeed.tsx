"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, GitBranch, Package, GitPullRequest, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/lib/data";

interface ActivityFeedProps {
  initialItems: ActivityItem[];
}

const typeConfig = {
  scan: {
    icon: GitBranch,
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
  },
  fix: {
    icon: Package,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
  },
  pr: {
    icon: GitPullRequest,
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
  },
  alert: {
    icon: AlertTriangle,
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
  },
};

const sampleMessages = [
  { type: "scan", messages: ["Scan completed with 3 vulnerabilities detected", "Scheduled scan started"] },
  { type: "fix", messages: ["Patched express to 4.19.1", "Updated lodash to 4.17.21"] },
  { type: "pr", messages: ["PR #142 opened: Update react", "PR merged: Security patch"] },
  { type: "alert", messages: ["Critical: Prototype pollution detected", "High: XSS vulnerability found"] },
];

function generateRandomItem(existingIds: Set<string>): ActivityItem {
  const types = ["scan", "fix", "pr", "alert"] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  const repo = ["acme/api-service", "acme/web-app", "acme/auth-service"][Math.floor(Math.random() * 3)];
  const messages = sampleMessages.find((s) => s.type === type)?.messages || [];
  const message = messages[Math.floor(Math.random() * messages.length)] || "Activity update";
  const times = ["just now", "1m ago", "2m ago", "3m ago"];
  const timestamp = times[Math.floor(Math.random() * times.length)];

  let id: string;
  do {
    id = `new-act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  } while (existingIds.has(id));

  return { id, type, message, repository: repo, timestamp };
}

export function ActivityFeed({ initialItems }: ActivityFeedProps) {
  const [items, setItems] = useState<ActivityItem[]>(initialItems);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItem = generateRandomItem(existingIds);
        const updated = [newItem, ...prev].slice(0, 5);
        return updated;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#111] border border-white/[0.10] rounded-xl p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <h3 className="text-sm font-semibold text-zinc-100">Activity Feed</h3>
        <span className="text-[10px] text-zinc-500 ml-auto">Live</span>
      </div>
      <div className="relative h-[calc(100%-3rem)] overflow-hidden">
        <div className="mb-2">
          <AnimatePresence>
            {items.map((item) => {
              const config = typeConfig[item.type];
              const Icon = config.icon;
              return (
                <motion.div
                  key={item.id}
                  data-testid="activity-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border overflow-hidden",
                    config.bg,
                    config.border
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-md flex items-center justify-center shrink-0",
                      config.iconBg
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", config.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-200 leading-snug">{item.message}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-zinc-500">
                      <span className="font-mono">{item.repository}</span>
                      <span>·</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
