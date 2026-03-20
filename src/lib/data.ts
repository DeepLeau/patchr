// Données mockées centralisées pour le dashboard Patchr
// TODO: Remplacer par un vrai appel API / base de données

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  language: "nodejs" | "python" | "mixed";
  lastScan: string;
  vulnerabilities: number;
  outdatedDeps: number;
}

export interface Scan {
  id: string;
  repository: string;
  status: "completed" | "running" | "failed";
  date: string;
  vulnerabilities: number;
  duration: string;
  commit: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  package: string;
  repository: string;
  detectedAt: string;
  actionRequired: boolean;
}

export interface ActivityItem {
  id: string;
  type: "scan" | "fix" | "pr" | "alert";
  message: string;
  repository: string;
  timestamp: string;
}

export interface MetricData {
  label: string;
  value: number;
  delta: number;
  deltaType: "positive" | "negative" | "neutral";
  icon: "shield" | "git-branch" | "clock" | "package";
}

// Statistiques globales
export const globalStats: MetricData[] = [
  {
    label: "Total Vulnerabilities",
    value: 47,
    delta: -12,
    deltaType: "positive",
    icon: "shield",
  },
  {
    label: "Active Repositories",
    value: 12,
    delta: 3,
    deltaType: "positive",
    icon: "git-branch",
  },
  {
    label: "Avg Resolution Time",
    value: 2.4,
    delta: -0.8,
    deltaType: "positive",
    icon: "clock",
  },
  {
    label: "Pending Updates",
    value: 156,
    delta: 24,
    deltaType: "negative",
    icon: "package",
  },
];

// Données pour le graphique aire (vulnérabilités sur 30 jours)
export const vulnerabilitiesAreaData = [
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

// Données pour le graphique barres (dépendances par langage)
export const dependenciesBarData = [
  { language: "Express", count: 89, critical: 3 },
  { language: "Lodash", count: 67, critical: 0 },
  { language: "React", count: 54, critical: 1 },
  { language: "Axios", count: 45, critical: 2 },
  { language: "Dotenv", count: 38, critical: 0 },
  { language: "Moment", count: 32, critical: 4 },
];

// Données pour le graphique donut (répartition severity)
export const severityPieData = [
  { name: "Critical", value: 8, color: "#ef4444" },
  { name: "High", value: 15, color: "#f97316" },
  { name: "Medium", value: 24, color: "#eab308" },
  { name: "Low", value: 18, color: "#22c55e" },
];

// Données pour le graphique ligne (temps moyen de résolution en jours)
export const resolutionTimeData = [
  { week: "W1", avgDays: 4.2 },
  { week: "W2", avgDays: 3.8 },
  { week: "W3", avgDays: 3.5 },
  { week: "W4", avgDays: 3.1 },
  { week: "W5", avgDays: 2.9 },
  { week: "W6", avgDays: 2.6 },
  { week: "W7", avgDays: 2.4 },
];

// Dépôts mockés
export const repositories: Repository[] = [
  {
    id: "repo-1",
    name: "api-service",
    fullName: "acme/api-service",
    language: "nodejs",
    lastScan: "2 hours ago",
    vulnerabilities: 5,
    outdatedDeps: 12,
  },
  {
    id: "repo-2",
    name: "web-frontend",
    fullName: "acme/web-frontend",
    language: "nodejs",
    lastScan: "4 hours ago",
    vulnerabilities: 3,
    outdatedDeps: 8,
  },
  {
    id: "repo-3",
    name: "ml-pipeline",
    fullName: "acme/ml-pipeline",
    language: "python",
    lastScan: "1 day ago",
    vulnerabilities: 12,
    outdatedDeps: 24,
  },
  {
    id: "repo-4",
    name: "auth-service",
    fullName: "acme/auth-service",
    language: "nodejs",
    lastScan: "3 days ago",
    vulnerabilities: 2,
    outdatedDeps: 5,
  },
];

// Scans récents
export const recentScans: Scan[] = [
  {
    id: "scan-1",
    repository: "acme/api-service",
    status: "completed",
    date: "2 hours ago",
    vulnerabilities: 5,
    duration: "12s",
    commit: "a1b2c3d",
  },
  {
    id: "scan-2",
    repository: "acme/web-frontend",
    status: "completed",
    date: "4 hours ago",
    vulnerabilities: 3,
    duration: "8s",
    commit: "e4f5g6h",
  },
  {
    id: "scan-3",
    repository: "acme/ml-pipeline",
    status: "running",
    date: "In progress",
    vulnerabilities: 0,
    duration: "—",
    commit: "i7j8k9l",
  },
  {
    id: "scan-4",
    repository: "acme/auth-service",
    status: "failed",
    date: "3 days ago",
    vulnerabilities: 2,
    duration: "—",
    commit: "m0n1o2p",
  },
];

// Alertes sécurité
export const securityAlerts: Alert[] = [
  {
    id: "alert-1",
    title: "Remote Code Execution in json5",
    description: "Prototype pollution vulnerability allowing RCE via '__proto__' property",
    severity: "critical",
    package: "json5@1.0.1",
    repository: "acme/api-service",
    detectedAt: "2 hours ago",
    actionRequired: true,
  },
  {
    id: "alert-2",
    title: "Prototype Pollution in lodash",
    description: "Allows attackers to inject properties via crafted __proto__ payloads",
    severity: "high",
    package: "lodash@4.17.20",
    repository: "acme/web-frontend",
    detectedAt: "5 hours ago",
    actionRequired: true,
  },
  {
    id: "alert-3",
    title: "Open Redirect in follow-redirects",
    description: "Unintended behavior when handling empty hostname",
    severity: "medium",
    package: "follow-redirects@1.15.0",
    repository: "acme/api-service",
    detectedAt: "1 day ago",
    actionRequired: false,
  },
  {
    id: "alert-4",
    title: "ReDoS in moment",
    description: "Regular expression denial of service via parseFormat",
    severity: "high",
    package: "moment@2.29.1",
    repository: "acme/ml-pipeline",
    detectedAt: "2 days ago",
    actionRequired: true,
  },
];

// Flux d'activité
export const activityFeed: ActivityItem[] = [
  {
    id: "act-1",
    type: "scan",
    message: "Scan completed with 5 vulnerabilities detected",
    repository: "acme/api-service",
    timestamp: "2 min ago",
  },
  {
    id: "act-2",
    type: "pr",
    message: "PR #142 opened: Update express to 4.18.2",
    repository: "acme/web-frontend",
    timestamp: "15 min ago",
  },
  {
    id: "act-3",
    type: "fix",
    message: "Fixed: Prototype pollution in lodash@4.17.21",
    repository: "acme/auth-service",
    timestamp: "1 hour ago",
  },
  {
    id: "act-4",
    type: "alert",
    message: "Critical: Remote Code Execution in json5",
    repository: "acme/api-service",
    timestamp: "2 hours ago",
  },
  {
    id: "act-5",
    type: "scan",
    message: "Scheduled scan started",
    repository: "acme/ml-pipeline",
    timestamp: "3 hours ago",
  },
];
