import { Suspense } from "react";
import dynamic from "next/dynamic";
import { StatCard } from "@/components/dashboard/StatCard";
import { SecurityAlerts } from "@/components/dashboard/SecurityAlerts";
import { RecentScans } from "@/components/dashboard/RecentScans";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import {
  globalStats,
  securityAlerts,
  recentScans,
  activityFeed,
} from "@/lib/data";

// Charts en client-side only pour éviter les problèmes SSR
const AreaChartCard = dynamic(
  () => import("@/components/ui/charts/AreaChartCard").then((mod) => mod.AreaChartCard),
  { ssr: false, loading: () => <ChartSkeleton type="area" /> }
);

const BarChartCard = dynamic(
  () => import("@/components/ui/charts/BarChartCard").then((mod) => mod.BarChartCard),
  { ssr: false, loading: () => <ChartSkeleton type="bar" /> }
);

const PieChartCard = dynamic(
  () => import("@/components/ui/charts/PieChartCard").then((mod) => mod.PieChartCard),
  { ssr: false, loading: () => <ChartSkeleton type="pie" /> }
);

const LineChartCard = dynamic(
  () => import("@/components/ui/charts/LineChartCard").then((mod) => mod.LineChartCard),
  { ssr: false, loading: () => <ChartSkeleton type="line" /> }
);

// Skeleton pour les charts pendant le chargement
function ChartSkeleton({ type }: { type: "area" | "bar" | "pie" | "line" }) {
  return (
    <div className="bg-[#111] border border-white/[0.10] rounded-xl p-5 animate-pulse">
      <div className="w-36 h-5 rounded bg-white/[0.05] mb-6" />
      <div className="h-48 flex items-end justify-around gap-2">
        {type === "pie" ? (
          <div className="w-40 h-40 rounded-full bg-white/[0.05]" />
        ) : (
          Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-8 rounded-t bg-white/[0.05]"
              style={{ height: `${30 + Math.random() * 50}%` }}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Données pour les graphiques
const vulnerabilitiesAreaData = [
  { date: "Jan 1", vulnerabilities: 45, resolved: 12 },
  { date: "Jan 3", vulnerabilities: 52, resolved: 15 },
  { date: "Jan 5", vulnerabilities: 48, resolved: 18 },
  { date: "Jan 7", vulnerabilities: 61, resolved: 14 },
  { date: "Jan 9", vulnerabilities: 55, resolved: 22 },
  { date: "Jan 11", vulnerabilities: 67, resolved: 19 },
  { date: "Jan 13", vulnerabilities: 72, resolved: 25 },
  { date: "Jan 15", vulnerabilities: 68, resolved: 28 },
  { date: "Jan 17", vulnerabilities: 75, resolved: 24 },
  { date: "Jan 19", vulnerabilities: 70, resolved: 31 },
  { date: "Jan 21", vulnerabilities: 78, resolved: 27 },
  { date: "Jan 23", vulnerabilities: 65, resolved: 35 },
  { date: "Jan 25", vulnerabilities: 58, resolved: 38 },
  { date: "Jan 27", vulnerabilities: 52, resolved: 32 },
  { date: "Jan 29", vulnerabilities: 47, resolved: 36 },
];

const dependenciesBarData = [
  { language: "Express", count: 89, critical: 3 },
  { language: "Lodash", count: 67, critical: 0 },
  { language: "React", count: 54, critical: 1 },
  { language: "Axios", count: 45, critical: 2 },
  { language: "Dotenv", count: 38, critical: 0 },
  { language: "Moment", count: 32, critical: 4 },
];

const severityPieData = [
  { name: "Critical", value: 8, color: "#ef4444" },
  { name: "High", value: 15, color: "#f97316" },
  { name: "Medium", value: 24, color: "#eab308" },
  { name: "Low", value: 18, color: "#22c55e" },
];

const resolutionTimeData = [
  { week: "W1", avgDays: 4.2 },
  { week: "W2", avgDays: 3.8 },
  { week: "W3", avgDays: 3.5 },
  { week: "W4", avgDays: 3.1 },
  { week: "W5", avgDays: 2.9 },
  { week: "W6", avgDays: 2.6 },
  { week: "W7", avgDays: 2.4 },
];

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            acme-corp · Last synced 5 minutes ago
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-9 px-4 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 text-sm font-medium transition-colors">
            Sync now
          </button>
          <button className="h-9 px-4 rounded-md bg-accent hover:bg-accent-hi text-white text-sm font-medium transition-colors shadow-[0_0_12px_rgba(22,163,74,0.2)]">
            Scan all
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {globalStats.map((stat, index) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Area Chart - Full width on lg */}
        <div className="lg:col-span-2">
          <AreaChartCard
            title="Vulnerability Trends"
            data={vulnerabilitiesAreaData}
            period="Last 30 days"
          />
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <ActivityFeed initialItems={activityFeed} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <BarChartCard
          title="Dependencies by Package"
          data={dependenciesBarData}
        />
        <PieChartCard
          title="Severity Distribution"
          data={severityPieData}
        />
        <LineChartCard
          title="Avg Resolution Time"
          data={resolutionTimeData}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityAlerts alerts={securityAlerts} />
        <RecentScans scans={recentScans} />
      </div>
    </div>
  );
}
