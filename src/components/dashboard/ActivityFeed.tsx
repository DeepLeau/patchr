"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, GitPullRequest, Wrench, AlertTriangle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/lib/data";

interface ActivityFeedProps {
  initialItems: ActivityItem[];
}

const typeConfig = {
  scan: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: GitBranch,
    color: "text-blue-400",
  },
  fix: {
    bg: "bg-accent/10",
    border: "border-accent/20",
    icon: Wrench,
    color: "text-accent-hi",
  },
  pr: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    icon: GitPullRequest,
    color: "text-purple-400",
  },
  alert: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: AlertTriangle,
    color: "text-red-400",
  },
};

const newActivities: Omit<ActivityItem, "id">[] = [
  {
    type: "scan",
    message: "New vulnerability detected in express",
    repository: "acme/api-gateway",
    timestamp: "Just now",
  },
  {
    type: "fix",
    message: "Patched lodash to version 4.17.21",
    repository: "acme/web-app",
    timestamp: "Just now",
  },
  {
    type: "pr",
    message: "PR merged: Update react-router to 6.22.0",
    repository: "acme/dashboard",
    timestamp: "Just now",
  },
];

export function ActivityFeed({ initialItems }: ActivityFeedProps) {
  const [items, setItems] = useState<ActivityItem[]>(initialItems);
  const [idCounter, setIdCounter] = useState(initialItems.length + 1);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];
      const newItem: ActivityItem = {
        ...randomActivity,
        id: `new-act-${idCounter}`,
      };

      setItems((prev) => [newItem, ...prev.slice(0, 4)]);
      setIdCounter((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [idCounter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-[#111] border border-white/[0.10] rounded-xl p-5 h-full"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <h3 className="text-sm font-semibold text-zinc-100">Activity Feed</h3>
        <span className="text-[10px] text-zinc-500 ml-auto">Live</span>
      </div>

      {/* Items */}
      <div className="relative h-[calc(100%-3rem)] overflow-hidden">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  layout: { duration: 0.3 },
                }}
                className="mb-2"
              >
                <div
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border overflow-hidden",
                    config.bg,
                    config.border
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-md flex items-center justify-center shrink-0",
                      config.bg
                    )}
                  >
                    <Icon size={13} className={config.color} strokeWidth={1.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-300 mb-0.5 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                      <span>{item.repository}</span>
                      <span>·</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Fade gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}
