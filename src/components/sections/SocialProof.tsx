"use client";
import { motion } from "framer-motion";

const companies = [
  "Vercel",
  "Linear",
  "Resend",
  "Raycast",
  "Supabase",
  "Turso",
];

export function SocialProof() {
  return (
    <section className="py-12 px-6 border-y border-white/[0.05] bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-xs text-zinc-600 uppercase tracking-widest mb-8">
          Trusted by developers at
        </p>
        <div className="flex items-center justify-center gap-10 flex-wrap">
          {companies.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="text-sm font-semibold text-zinc-600 tracking-tight hover:text-zinc-400 transition-colors cursor-default"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
