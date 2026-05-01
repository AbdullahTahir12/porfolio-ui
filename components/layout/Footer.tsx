import { Github, Linkedin, Mail, Twitter } from "lucide-react";

import type { SiteIdentity } from "@/src/types/portfolio";

const ADMIN_LINK_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ADMIN_LINK === "true";

type FooterProps = {
  siteIdentity: SiteIdentity;
};

const SOCIAL_LINKS = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/",
    icon: Github,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: Linkedin,
  },
  {
    id: "twitter",
    label: "Twitter",
    href: "https://twitter.com/",
    icon: Twitter,
  },
  {
    id: "email",
    label: "Email",
    href: "mailto:hello@example.com",
    icon: Mail,
  },
];

export function Footer({ siteIdentity }: FooterProps) {
  const year = new Date().getFullYear();
  const brandName = siteIdentity.brandName || "DevPortfolio";
  const brandTagline = siteIdentity.brandTagline?.trim() || brandName;
  const brandDescription =
    siteIdentity.brandDescription?.trim() ||
    "Building thoughtful digital experiences for forward-looking teams.";


  return (
    <footer className="nav-surface border-t border-surface py-12 animate-fade-in" suppressHydrationWarning>
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
          <div className="space-y-4 text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
              {brandTagline}
            </span>
            <p className="text-lg font-semibold text-[color:var(--color-foreground)]">
              {brandDescription}
            </p>
            <p className="text-sm text-[color:var(--color-muted)]">
              Every project blends usability, accessibility, and polish to create products that feel human.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 text-center md:items-end md:text-right">
            <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
              Stay in touch
            </span>
            <p className="text-sm text-[color:var(--color-muted-strong)]">
              Follow along, reach out, or share a challenge you&apos;re solving.
            </p>
            <ul className="social-list" role="list">
              {SOCIAL_LINKS.map(({ id, href, label, icon: Icon }) => (
                <li key={id}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="social-link"
                    aria-label={`Open ${label}`}
                  >
                    <Icon className="social-link__icon" aria-hidden="true" />
                    <span className="sr-only">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 border-t border-surface pt-6 text-sm text-[color:var(--color-muted)] md:flex-row md:justify-between">
          <div className="footer-links" role="list">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              LinkedIn
            </a>
            <a href="mailto:hello@example.com" className="footer-link">
              Email
            </a>

            {ADMIN_LINK_ENABLED && (
              <a href="/admin" className="footer-link">
                Admin
              </a>
            )}
          </div>
          <span className="text-xs text-[color:var(--color-muted)]" suppressHydrationWarning>
            Copyright {year} {brandName}. Crafted with TypeScript, Next.js, and MongoDB.
          </span>
        </div>
      </div>
    </footer>
  );
}
