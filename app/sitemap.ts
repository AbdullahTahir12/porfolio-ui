import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

// -------------------- Helper Functions --------------------

async function fetchFromApi(endpoint: string) {
  try {
    const res = await fetch(`${baseUrl}/api/${endpoint}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    if (!res.ok) return []
    
    const data = await res.json()
    return data.data || data || []
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error)
    return []
  }
}

// -------------------- Get All Items --------------------

async function getProjects() {
  const projects = await fetchFromApi('projects')
  return projects.map((item: any) => ({
    id: item._id,
    updatedAt: item.updatedAt || item.createdAt,
    title: item.title
  }))
}

async function getSkills() {
  const skills = await fetchFromApi('skills')
  return skills.map((item: any) => ({
    id: item._id,
    updatedAt: item.updatedAt || item.createdAt,
    name: item.name
  }))
}

async function getCertifications() {
  const certifications = await fetchFromApi('certifications')
  return certifications.map((item: any) => ({
    id: item._id,
    updatedAt: item.updatedAt || item.createdAt,
    title: item.title
  }))
}

async function getExperience() {
  const experience = await fetchFromApi('experience')
  return experience.map((item: any) => ({
    id: item._id,
    updatedAt: item.updatedAt || item.startDate,
    company: item.company
  }))
}

// -------------------- Main Sitemap Function --------------------

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all data in parallel (faster)
  const [projects, skills, certifications, experience] = await Promise.all([
    getProjects(),
    getSkills(),
    getCertifications(),
    getExperience()
  ])

  // 1. Static Pages (Jo hamesha rehte hain)
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#hero`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#features`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#skills`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#certifications`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#testimonials`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#experience`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // 2. Dynamic: Project Pages
  const projectPages = projects.map((project: any) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // 3. Dynamic: Skill Pages
  const skillPages = skills.map((skill: any) => ({
    url: `${baseUrl}/skills/${skill.id}`,
    lastModified: new Date(skill.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // 4. Dynamic: Certification Pages
  const certificationPages = certifications.map((cert: any) => ({
    url: `${baseUrl}/certifications/${cert.id}`,
    lastModified: new Date(cert.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // 5. Dynamic: Experience Pages
  const experiencePages = experience.map((exp: any) => ({
    url: `${baseUrl}/experience/${exp.id}`,
    lastModified: new Date(exp.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Combine all pages
  return [
    ...staticPages,
    ...projectPages,
    ...skillPages,
    ...certificationPages,
    ...experiencePages,
  ]
}