"use client";
import { motion } from "framer-motion";
import { Shield, Terminal, GitPullRequest, Languages, Zap, CheckCircle } from "lucide-react";
import {
  BentoCard,
  CounterFeature,
  MetricsFeature,
  TimelineFeature,
  TypingFeature,
  SpotlightFeature,
  staggerContainer,
} from "@/components/ui/BentoGrid";

export function Features() {
  const features = [
    {
      title: "Automatic dependency scanning",
      description:
        "Patchr scans your entire dependency tree and identifies outdated packages, version conflicts, and potential issues.",
      icon: Terminal,
      colSpan: "col-span-1 md:col-span-2" as const,
      type: "code",
      code: `// patchr scan --verbose
Scanning my-app...
✓ Found 142 dependencies
⚠  8 outdated packages detected
🔍 3 security vulnerabilities found
→ Run 'patchr fix' to proceed`,
    },
    {
      title: "Security vulnerability detection",
      description:
        "Real-time CVE monitoring with 99.8% detection rate across all major vulnerability databases.",
      icon: Shield,
      type: "metrics",
      metrics: [
        { label: "CVE Detection", value: 99.8, suffix: "%" },
        { label: "False Positives", value: 0.2, suffix: "%" },
        { label: "Response Time", value: 12, suffix: "h" },
      ],
    },
    {
      title: "Smart auto-PRs",
      description:
        "Patchr opens pull requests with semantic version updates, changelogs, and compatibility notes.",
      icon: GitPullRequest,
      type: "timeline",
      timeline: [
        { year: "00:00", event: "Scan initiated" },
        { year: "00:03", event: "Dependencies analyzed" },
        { year: "00:05", event: "Vulnerabilities detected" },
        { year: "00:08", event: "PR created" },
      ],
    },
    {
      title: "Multi-language support",
      description:
        "Full support for Node.js and Python ecosystems with language-specific update strategies.",
      icon: Languages,
      type: "counter",
      end: 2,
    },
    {
      title: "Zero config setup",
      description:
        "Connect your repository and Patchr starts working immediately. No configuration needed.",
      icon: Zap,
      type: "checklist",
      items: [
        "GitHub/GitLab/Bitbucket integration",
        "Automatic security alerts",
        "Customizable update rules",
        "Team collaboration features",
      ],
    },
  ];

  return (
    <section
      id="features"
      className="py-24 px-6 bg-[#0a0a0a] border-t border-white/[0.05]"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-semibold text-zinc-100 tracking-tight">
            Built different
          </h2>
          <p className="mt-3 text-zinc-500 max-w-md mx-auto">
            Everything you need to ship secure code without the maintenance
            overhead.
          </p>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {features.map((feature, idx) => (
            <BentoCard key={idx} className={feature.colSpan}>
              <div className="w-10 h-10 rounded-lg border border-accent/20 bg-accent/[0.06] flex items-center justify-center mb-2">
                <feature.icon
                  size={20}
                  className="text-accent"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-base font-semibold text-zinc-100">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-500">{feature.description}</p>
              {feature.type === "code" && (
                <TypingFeature code={feature.code!} />
              )}
              {feature.type === "metrics" && (
                <MetricsFeature metrics={feature.metrics!} />
              )}
              {feature.type === "timeline" && (
                <TimelineFeature items={feature.timeline!} />
              )}
              {feature.type === "counter" && (
                <CounterFeature start={0} end={feature.end!} suffix=" languages" />
              )}
              {feature.type === "checklist" && (
                <SpotlightFeature items={feature.items!} />
              )}
            </BentoCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
