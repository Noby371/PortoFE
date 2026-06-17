import type { FunctionalComponent, SVGAttributes } from 'vue'

// ── Skill ──────────────────────────────────────────────────────────────────
export interface Skill {
  name: string
  level: number
  iconSlug?: string
}

export interface SkillGroup {
  category: string
  icon: FunctionalComponent<SVGAttributes>
  skills: Skill[]
}

// ── Project ────────────────────────────────────────────────────────────────
export type ProjectType = 'THESIS' | 'STARTUP' | 'FREELANCE' | 'ACADEMIC' | 'PERSONAL'
export type ProjectStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'

export interface Project {
  id: number
  title: string
  slug: string
  description: string
  type: ProjectType
  status: ProjectStatus
  techStack: string[]
  imageUrl?: string
  repoUrl?: string
  demoUrl?: string
  featured: boolean
  startDate: string
  endDate?: string
}

// ── Experience ─────────────────────────────────────────────────────────────
export type ExperienceType = 'WORK' | 'INTERNSHIP' | 'ORGANIZATION' | 'FREELANCE'

export interface Experience {
  company: string
  role: string
  description: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  location: string
  type: ExperienceType
}

// ── About ──────────────────────────────────────────────────────────────────
export interface AboutHighlight {
  icon: FunctionalComponent<SVGAttributes>
  title: string
  description: string
}
