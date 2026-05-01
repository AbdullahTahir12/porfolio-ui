"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { AccentPaletteSelector } from "./AccentPaletteSelector";
import type { SiteIdentity } from "@/src/types/portfolio";
import { ThemeToggle } from "./ThemeToggle";

const sections = [
  { id: "hero", label: "Home" },
  { id: "features", label: "Features" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "testimonials", label: "Testimonials" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const ADMIN_LINK_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ADMIN_LINK === "true";

type NavbarProps = {
  siteIdentity: SiteIdentity;
};

export function Navbar({ siteIdentity }: NavbarProps) {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isOpen, setIsOpen] = useState(false);

  const brandName = siteIdentity.brandName || "DevPortfolio";
  const brandLogoUrl = siteIdentity.brandLogoUrl?.trim() ?? "";


  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(section.id);
            }
          });
        },
        {
          rootMargin: "-55% 0px -35% 0px",
          threshold: [0.15, 0.4, 0.7],
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const navLinks = useMemo(() => sections, []);

  return (
    <header className="sticky top-0 z-50 nav-surface border-b border-surface backdrop-blur-xl" suppressHydrationWarning>
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6" suppressHydrationWarning>
        <a href="#hero" className="brand-mark text-lg font-semibold tracking-tight">
          {brandLogoUrl ? (
            <span className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-[color:var(--color-accent-outline)] bg-[color:var(--color-accent-soft)]">
                <Image
                  unoptimized
                  src={brandLogoUrl}
                  alt={brandName ? brandName + " logo" : "Brand logo"}
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="brand-mark__text">{brandName}</span>
            </span>
          ) : (
            <span className="brand-mark__text">{brandName}</span>
          )}
        </a>
        <nav className="hidden flex-1 items-center justify-center gap-1 rounded-full border border-surface bg-[color:var(--color-surface)] px-2 py-1 text-sm font-medium text-[color:var(--color-foreground)] shadow-[0_25px_55px_-30px_var(--color-shadow)] md:flex">
          {navLinks.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="relative rounded-full px-3 py-1.5 text-[color:var(--color-muted-strong)] transition-transform duration-200 link-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-outline)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hover:-translate-y-0.5 hover:text-[color:var(--color-accent)]"
            >
              {activeSection === item.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-[1] rounded-full bg-[color:var(--color-accent-soft-strong)]"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              )}
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex">
            <AccentPaletteSelector />
          </div>
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-surface px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-[color:var(--color-muted-strong)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-outline)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hover:border-[color:var(--color-accent-outline)] hover:text-[color:var(--color-accent)] md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            Menu
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="border-t border-surface bg-[color:var(--color-surface-strong)] px-4 py-4 text-sm font-medium text-[color:var(--color-foreground)] md:hidden animate-slide-in" suppressHydrationWarning>
          <div className="grid gap-4">
            <AccentPaletteSelector />
            {navLinks.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2 transition hover:bg-[color:var(--color-accent-soft)]"
              >
                {item.label}
              </a>
            ))}
            {ADMIN_LINK_ENABLED && (
              <a
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2 transition hover:bg-[color:var(--color-accent-soft)]"
              >
                Admin
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
