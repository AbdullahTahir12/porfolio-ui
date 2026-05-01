import { AboutSection } from "@/components/sections/About";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { fetchFromApi } from "@/src/lib/apiClient";
import { CACHE_TAGS } from "@/src/lib/cacheTags";
import { ABOUT_CONTENT_FALLBACK, FEATURES_FALLBACK, HERO_CONTENT_FALLBACK } from "@/src/lib/defaultContent";
import type {
  AboutContent,
  Certification,
  Experience,
  Feature,
  HeroContent,
  Project,
  Skill,
} from "@/src/types/portfolio";
export default async function Home() {
  const [
    skills,
    projects,
    experience,
    certifications,
    heroContent,
    aboutContent,
    features,
  ] = await Promise.all([
    safeFetch<Skill[]>("/api/skills", []),
    safeFetch<Project[]>("/api/projects", []),
    safeFetch<Experience[]>("/api/experience", []),
    safeFetch<Certification[]>("/api/certifications", []),
    safeFetch<HeroContent>("/api/hero", HERO_CONTENT_FALLBACK),
    safeFetch<AboutContent>("/api/about", ABOUT_CONTENT_FALLBACK),
    safeFetch<Feature[]>("/api/features", FEATURES_FALLBACK),
  ]);

  return (
    <div className="relative pb-24" suppressHydrationWarning>
      <HeroSection content={heroContent} />
      <FeaturesSection features={features} />
      <AboutSection content={aboutContent} />
      <SkillsSection skills={skills} />
      <ProjectsSection projects={projects} />
      <CertificationsSection certifications={certifications} />
      <TestimonialsSection />
      <ExperienceSection experience={experience} />
      <ContactSection />
    </div>
  );
}

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  const tag =
    path === "/api/skills"
      ? CACHE_TAGS.skills
      : path === "/api/projects"
        ? CACHE_TAGS.projects
        : path === "/api/experience"
          ? CACHE_TAGS.experience
          : path === "/api/certifications"
            ? CACHE_TAGS.certifications
            : path === "/api/hero"
              ? CACHE_TAGS.hero
              : path === "/api/about"
                ? CACHE_TAGS.about
                : path === "/api/features"
                  ? CACHE_TAGS.features
                  : path === "/api/site"
                    ? CACHE_TAGS.site
                    : undefined;
  try {
    return await fetchFromApi<T>(path, {
      revalidate: 180,
      tags: tag ? [tag] : undefined,
      fallbackData: fallback,
      suppressError: true,
    });
  } catch (error) {
    console.error(`Failed to load ${path}`, error);
    return fallback;
  }
}










