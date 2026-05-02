import { Github, Linkedin, Mail, Twitter } from "lucide-react";

import type { SiteIdentity } from "@/src/types/portfolio";

const ADMIN_LINK_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ADMIN_LINK === "true";

type FooterProps = {
  siteIdentity: SiteIdentity;
};

const MediumIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 1043.63 592.71"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 279-147.17 279s-147.17-124.94-147.17-279 65.88-279 147.16-279 147.17 124.9 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94s-51.75-111.91-51.75-249.94 23.17-249.94 51.75-249.94 51.76 111.9 51.76 249.94" />
  </svg>
);

const SOCIAL_LINKS = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/Abdullah-MERN7",
    icon: Github,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/abdullah-mern/",
    icon: Linkedin,
  },
  {
    id: "medium",
    label: "Medium",
    href: "https://medium.com/@abdullah-mern",
    icon: MediumIcon,
  },
  {
    id: "email",
    label: "Email",
    href: "mailto:aj1762919@gmail.com",
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
              href="https://github.com/Abdullah-MERN7"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/abdullah-mern/"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              LinkedIn
            </a>
            <a
              href="https://medium.com/@abdullah-mern"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              Medium
            </a>
            <a href="mailto:aj1762919@gmail.com" className="footer-link">
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
