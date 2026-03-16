"use client";
import { motion } from "framer-motion";
import { AnimatedCanopy } from "@/components/ui/AnimatedCanopy";

const testimonials = [
  {
    quote:
      "Patchr caught 3 critical vulnerabilities in our dependencies before they became issues. Invaluable.",
    name: "Alex K.",
    role: "Founder @ Streamline",
  },
  {
    quote: "Went live in 48h. Nothing comes close for automatic dependency updates.",
    name: "Sara M.",
    role: "CTO @ Orbital",
  },
  {
    quote: "Cut our maintenance time by 60% in the first month alone.",
    name: "Tom R.",
    role: "Lead Eng @ Ditto",
  },
  {
    quote:
      "The auto-PR feature is a game changer. We ship updates without even thinking about them.",
    name: "Jordan L.",
    role: "Indie Hacker",
  },
  {
    quote:
      "Finally, something that just works. Connect repo, done. Security handled.",
    name: "Casey W.",
    role: "Founder @ Bolt",
  },
  {
    quote:
      "Our security team loves it. Zero configuration, maximum coverage.",
    name: "Morgan T.",
    role: "SecOps @ Scale",
  },
];

const TestimonialCard = ({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) => (
  <div className="flex-shrink-0 w-80 p-5 rounded-xl border border-white/[0.07] bg-[#111] flex flex-col gap-3">
    <p className="text-sm text-zinc-300 leading-relaxed line-clamp-3">
      &quot;{quote}&quot;
    </p>
    <div className="mt-auto">
      <p className="text-xs font-medium text-zinc-200">{name}</p>
      <p className="text-[11px] text-zinc-500">{role}</p>
    </div>
  </div>
);

export function Testimonials() {
  return (
    <section className="py-24 overflow-hidden bg-[#0a0a0a] border-t border-white/[0.05]">
      <div className="text-center mb-16 px-6">
        <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
          Testimonials
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-100 tracking-tight">
          Loved by developers
        </h2>
      </div>

      <div className="relative flex flex-col gap-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />

        <AnimatedCanopy reverse={false} pauseOnHover>
          {testimonials.map((t, i) => (
            <TestimonialCard key={`t1-${i}`} {...t} />
          ))}
        </AnimatedCanopy>

        <AnimatedCanopy reverse={true} pauseOnHover>
          {testimonials.map((t, i) => (
            <TestimonialCard key={`t2-${i}`} {...t} />
          ))}
        </AnimatedCanopy>

        <AnimatedCanopy reverse={false} pauseOnHover>
          {testimonials.map((t, i) => (
            <TestimonialCard key={`t3-${i}`} {...t} />
          ))}
        </AnimatedCanopy>
      </div>
    </section>
  );
}
