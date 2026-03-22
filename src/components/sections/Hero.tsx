"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AnimatedTextGenerate } from "@/components/ui/AnimatedTextGenerate";
import { UnicornBackground } from "@/components/ui/UnicornBackground";

export function Hero() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-[#0a0a0a] overflow-hidden pt-14">
      <UnicornBackground
        jsonFilePath="https://ipbkonbdobkaebffenbz.supabase.co/storage/v1/object/public/scenes/falling_cubes.json"
        className="absolute inset-0 z-0 w-full h-full"
        scale={0.75}
        dpi={1.5}
      />
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(22,163,74,0.08),transparent)]" />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-xs text-white-400"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Now available
        </motion.div>
        <AnimatedTextGenerate
          text="Never miss a security fix again."
          speed={0.4}
          mode="dark"
        />
        <p className="text-base text-zinc-400 max-w-md leading-relaxed">
          Patchr automatically detects outdated dependencies and security
          vulnerabilities in your Node.js and Python projects. Opens update PRs
          for you.
        </p>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={handleGetStarted}
            className="h-9 px-5 rounded-md bg-accent hover:bg-accent-hi text-white text-sm font-medium transition-colors shadow-[0_0_16px_rgba(22,163,74,0.25)]"
          >
            Get started for free
          </button>
          <button className="h-9 px-5 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 text-sm font-medium transition-colors">
            How it works →
          </button>
        </div>
        <p className="text-xs text-white-600">
          Trusted by 2,400+ developers · No credit card required
        </p>
      </div>
    </section>
  );
}
