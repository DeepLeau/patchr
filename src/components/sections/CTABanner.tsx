"use client";
import { motion } from "framer-motion";

export function CTABanner() {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(22,163,74,0.12),transparent)]" />
          <h2 className="relative text-4xl font-semibold text-zinc-50 tracking-[-0.025em]">
            Ready to secure your dependencies?
          </h2>
        </motion.div>
        <p className="text-zinc-400 text-base max-w-md">
          Join 2,400+ developers. Free plan available. No credit card required.
        </p>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="h-10 px-6 rounded-md bg-accent hover:bg-accent-hi text-white text-sm font-medium transition-colors shadow-[0_0_20px_rgba(22,163,74,0.3)]"
        >
          Get started for free
        </motion.button>
      </div>
    </section>
  );
}
