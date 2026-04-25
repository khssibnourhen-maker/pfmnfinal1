export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  linkedIn: string
  portfolio: string
  summary: string
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
}

export interface Skill {
  id: string
  name: string
  level: "beginner" | "intermediate" | "advanced" | "expert"
  category: string
}

export interface Language {
  id: string
  name: string
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "native"
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  startDate: string
  endDate?: string
}

export interface CVData {
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  skills: Skill[]
  languages: Language[]
  certifications: Certification[]
  projects: Project[]
}

export interface CVAnalysis {
  overallScore: number
  sections: {
    name: string
    score: number
    feedback: string
    suggestions: string[]
  }[]
  strengths: string[]
  improvements: string[]
  keywords: string[]
  atsScore: number
}
