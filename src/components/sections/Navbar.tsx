"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Docs", href: "#docs" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 h-14 flex items-center transition-all duration-200",
        scrolled
          ? "border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="max-w-5xl mx-auto w-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
            <Package size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold text-zinc-100 tracking-tight">
            Patchr
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-3 h-8 flex items-center text-sm text-zinc-500 hover:text-zinc-200 rounded-md hover:bg-white/[0.04] transition-colors duration-150"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#"
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors px-3"
          >
            Log in
          </a>
          <button className="h-8 px-4 rounded-md bg-accent hover:bg-accent-hi text-white text-sm font-medium transition-colors duration-150">
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}
