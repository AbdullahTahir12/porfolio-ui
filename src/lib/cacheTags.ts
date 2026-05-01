export const CACHE_TAGS = {
  skills: "skills",
  projects: "projects",
  experience: "experience",
  certifications: "certifications",
  features: "features",
  hero: "hero",
  about: "about",
  site: "site",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
