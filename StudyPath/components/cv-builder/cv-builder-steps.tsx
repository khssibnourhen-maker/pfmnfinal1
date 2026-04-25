"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CVPreview } from "@/components/cv-builder/cv-preview"
import { CVAnalysisButton } from "@/components/cv-builder/cv-analysis-button"
import {
  User, GraduationCap, Briefcase, Wrench, Globe, Award, FolderOpen,
  Sparkles, CheckCircle2, AlertCircle, TrendingUp, Loader2,
  Plus, Trash2, ChevronLeft, ChevronRight, FileText
} from "lucide-react"
import { CVData } from "@/lib/types/cv"
import { Dispatch, SetStateAction } from "react"

interface CVBuilderStepsProps {
  cvData: CVData
  setCVData: Dispatch<SetStateAction<CVData>>
  currentStep: number
  setCurrentStep: Dispatch<SetStateAction<number>>
}

const STEPS = [
  { id: 0, label: "Infos", icon: User },
  { id: 1, label: "Formation", icon: GraduationCap },
  { id: 2, label: "Expérience", icon: Briefcase },
  { id: 3, label: "Compétences", icon: Wrench },
  { id: 4, label: "Langues", icon: Globe },
  { id: 5, label: "Certifications", icon: Award },
  { id: 6, label: "Projets", icon: FolderOpen },
  { id: 7, label: "Générer CV Créatif", icon: Sparkles },
]

// ─── Step Components ──────────────────────────────────────────────────────────

function PersonalInfoStep({ cvData, setCVData }: Pick<CVBuilderStepsProps, "cvData" | "setCVData">) {
  const p = cvData.personalInfo
  const set = (field: string, value: string) =>
    setCVData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Prénom</Label>
          <Input value={p.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Marie" />
        </div>
        <div className="space-y-1.5">
          <Label>Nom</Label>
          <Input value={p.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Dupont" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input type="email" value={p.email} onChange={e => set("email", e.target.value)} placeholder="marie@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label>Téléphone</Label>
          <Input value={p.phone} onChange={e => set("phone", e.target.value)} placeholder="+33 6 00 00 00 00" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Adresse</Label>
        <Input value={p.address} onChange={e => set("address", e.target.value)} placeholder="Paris, France" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>LinkedIn</Label>
          <Input value={p.linkedIn} onChange={e => set("linkedIn", e.target.value)} placeholder="linkedin.com/in/marie" />
        </div>
        <div className="space-y-1.5">
          <Label>Portfolio / Site</Label>
          <Input value={p.portfolio} onChange={e => set("portfolio", e.target.value)} placeholder="marie.dev" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Résumé / Accroche</Label>
        <Textarea
          value={p.summary}
          onChange={e => set("summary", e.target.value)}
          placeholder="Développeuse fullstack passionnée avec 5 ans d'expérience..."
          rows={4}
        />
      </div>
    </div>
  )
}

function EducationStep({ cvData, setCVData }: Pick<CVBuilderStepsProps, "cvData" | "setCVData">) {
  const add = () =>
    setCVData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: crypto.randomUUID(),
          school: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          current: false,
          description: ""
        }
      ]
    }))
  const remove = (i: number) =>
    setCVData(prev => ({ ...prev, education: prev.education.filter((_, idx) => idx !== i) }))
  const update = (i: number, field: string, value: string) =>
    setCVData(prev => {
      const ed = [...prev.education]
      ed[i] = { ...ed[i], [field]: value }
      return { ...prev, education: ed }
    })

  return (
    <div className="space-y-4">
      {cvData.education.map((ed, i) => (
        <Card key={i}>
          <CardContent className="pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Formation {i + 1}</span>
              <Button variant="ghost" size="icon" onClick={() => remove(i)} className="h-7 w-7 text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Établissement</Label>
                <Input value={ed.school} onChange={e => update(i, "school", e.target.value)} placeholder="Université Paris-Saclay" />
              </div>
              <div className="space-y-1.5">
                <Label>Diplôme</Label>
                <Input value={ed.degree} onChange={e => update(i, "degree", e.target.value)} placeholder="Master" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Domaine</Label>
              <Input value={ed.field} onChange={e => update(i, "field", e.target.value)} placeholder="Informatique" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Début</Label>
                <Input value={ed.startDate} onChange={e => update(i, "startDate", e.target.value)} placeholder="Sept. 2020" />
              </div>
              <div className="space-y-1.5">
                <Label>Fin</Label>
                <Input value={ed.endDate} onChange={e => update(i, "endDate", e.target.value)} placeholder="Juin 2022" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={ed.description} onChange={e => update(i, "description", e.target.value)} rows={2} placeholder="Mémoire sur..." />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" className="w-full border-dashed" onClick={add}>
        <Plus className="w-4 h-4 mr-2" /> Ajouter une formation
      </Button>
    </div>
  )
}

function ExperienceStep({ cvData, setCVData }: Pick<CVBuilderStepsProps, "cvData" | "setCVData">) {
  const add = () =>
    setCVData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: crypto.randomUUID(),
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: ""
        }
      ]
    }))
  const remove = (i: number) =>
    setCVData(prev => ({ ...prev, experience: prev.experience.filter((_, idx) => idx !== i) }))
  const update = (i: number, field: string, value: any) =>
    setCVData(prev => {
      const ex = [...prev.experience]
      ex[i] = { ...ex[i], [field]: value }
      return { ...prev, experience: ex }
    })

  return (
    <div className="space-y-4">
      {cvData.experience.map((ex, i) => (
        <Card key={i}>
          <CardContent className="pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Expérience {i + 1}</span>
              <Button variant="ghost" size="icon" onClick={() => remove(i)} className="h-7 w-7 text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Entreprise</Label>
                <Input value={ex.company} onChange={e => update(i, "company", e.target.value)} placeholder="Acme Corp" />
              </div>
              <div className="space-y-1.5">
                <Label>Poste</Label>
                <Input value={ex.position} onChange={e => update(i, "position", e.target.value)} placeholder="Développeur Senior" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Localisation</Label>
              <Input value={ex.location} onChange={e => update(i, "location", e.target.value)} placeholder="Paris, France" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Début</Label>
                <Input type="month" value={ex.startDate} onChange={e => update(i, "startDate", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Fin</Label>
                <Input type="month" value={ex.endDate} onChange={e => update(i, "endDate", e.target.value)} disabled={ex.current} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id={`current-${i}`} checked={ex.current} onChange={e => update(i, "current", e.target.checked)} className="rounded" />
              <Label htmlFor={`current-${i}`} className="text-sm font-normal cursor-pointer">Poste actuel</Label>
            </div>
            <div className="space-y-1.5">
              <Label>Description & réalisations</Label>
              <Textarea value={ex.description} onChange={e => update(i, "description", e.target.value)} rows={3} placeholder="Développement de..." />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" className="w-full border-dashed" onClick={add}>
        <Plus className="w-4 h-4 mr-2" /> Ajouter une expérience
      </Button>
    </div>
  )
}

function SkillsStep({ cvData, setCVData }: Pick<CVBuilderStepsProps, "cvData" | "setCVData">) {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSkill, setSelectedSkill] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced" | "expert">("beginner")
  const [customSkill, setCustomSkill] = useState("")

  const SKILL_CATEGORIES = {
    "Technologies Web": ["React", "Next.js", "Vue.js", "Angular", "HTML", "CSS", "JavaScript", "TypeScript", "Node.js", "Express"],
    "Langages de Programmation": ["Python", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin"],
    "Bases de Données": ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase"],
    "Outils & Frameworks": ["Git", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Jenkins", "Terraform"],
    "Soft Skills": ["Communication", "Leadership", "Travail d'équipe", "Résolution de problèmes", "Gestion du temps", "Adaptabilité"],
    "Autres": []
  }

  const LEVELS = [
    { value: "beginner", label: "Débutant" },
    { value: "intermediate", label: "Intermédiaire" },
    { value: "advanced", label: "Avancé" },
    { value: "expert", label: "Expert" }
  ] as const

  const addSkill = () => {
    const skillName = selectedSkill || customSkill.trim()
    if (!skillName || !selectedCategory) return

    const newSkill = {
      id: crypto.randomUUID(),
      name: skillName,
      level: selectedLevel,
      category: selectedCategory
    }

    setCVData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }))

    // Reset form
    setSelectedSkill("")
    setCustomSkill("")
    setSelectedLevel("beginner")
  }

  const removeSkill = (id: string) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.filter(sk => sk.id !== id)
    }))
  }

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.map(sk =>
        sk.id === id ? { ...sk, [field]: value } : sk
      )
    }))
  }

  const groupedSkills = cvData.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Wrench className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Compétences</h2>
        <p className="text-muted-foreground">Ajoutez vos compétences techniques et soft skills</p>
      </div>

      {/* Add Skill Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ajouter une compétence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(SKILL_CATEGORIES).map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Niveau</Label>
              <Select value={selectedLevel} onValueChange={(value: any) => setSelectedLevel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedCategory && selectedCategory !== "Autres" && (
            <div className="space-y-2">
              <Label>Compétence</Label>
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une compétence" />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_CATEGORIES[selectedCategory as keyof typeof SKILL_CATEGORIES].map(skill => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(selectedCategory === "Autres" || !selectedSkill) && (
            <div className="space-y-2">
              <Label>Compétence personnalisée</Label>
              <Input
                value={customSkill}
                onChange={e => setCustomSkill(e.target.value)}
                placeholder="Entrez une compétence..."
                onKeyDown={e => e.key === "Enter" && addSkill()}
              />
            </div>
          )}

          <Button onClick={addSkill} className="w-full" disabled={!selectedCategory || (!selectedSkill && !customSkill.trim())}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter la compétence
          </Button>
        </CardContent>
      </Card>

      {/* Skills Display */}
      {cvData.skills.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Wrench className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Aucune compétence ajoutée</h3>
            <p className="text-sm text-muted-foreground">
              Commencez par sélectionner une catégorie et ajouter vos compétences
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <div key={skill.id} className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
                      <span className="font-medium">{skill.name}</span>
                      <Select
                        value={skill.level}
                        onValueChange={value => updateSkill(skill.id, "level", value)}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LEVELS.map(level => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSkill(skill.id)}
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function LanguagesStep({ cvData, setCVData }: Pick<CVBuilderStepsProps, "cvData" | "setCVData">) {
  const add = () =>
    setCVData(prev => ({ ...prev, languages: [...prev.languages, { name: "", level: "Intermédiaire" }] }))
  const remove = (i: number) =>
    setCVData(prev => ({ ...prev, languages: prev.languages.filter((_, idx) => idx !== i) }))
  const update = (i: number, field: string, value: string) =>
    setCVData(prev => {
      const langs = [...prev.languages]
      langs[i] = { ...langs[i], [field]: value }
      return { ...prev, languages: langs }
    })

  const LEVELS = ["Débutant", "Intermédiaire", "Avancé", "Courant", "Natif"]

  return (
    <div className="space-y-3">
      {cvData.languages.map((lang, i) => (
        <div key={i} className="flex gap-3 items-center">
          <Input value={lang.name} onChange={e => update(i, "name", e.target.value)} placeholder="Français" className="flex-1" />
          <select
            value={lang.level}
            onChange={e => update(i, "level", e.target.value)}
            className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            {LEVELS.map(l => <option key={l}>{l}</option>)}
          </select>
          <Button variant="ghost" size="icon" onClick={() => remove(i)} className="text-destructive hover:text-destructive shrink-0">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" className="w-full border-dashed" onClick={add}>
        <Plus className="w-4 h-4 mr-2" /> Ajouter une langue
      </Button>
    </div>
  )
}

function CertificationsStep({ cvData, setCVData }: Pick<CVBuilderStepsProps, "cvData" | "setCVData">) {
  const add = () =>
    setCVData(prev => ({ ...prev, certifications: [...prev.certifications, { name: "", issuer: "", date: "", url: "" }] }))
  const remove = (i: number) =>
    setCVData(prev => ({ ...prev, certifications: prev.certifications.filter((_, idx) => idx !== i) }))
  const update = (i: number, field: string, value: string) =>
    setCVData(prev => {
      const certs = [...prev.certifications]
      certs[i] = { ...certs[i], [field]: value }
      return { ...prev, certifications: certs }
    })

  return (
    <div className="space-y-4">
      {cvData.certifications.map((cert, i) => (
        <Card key={i}>
          <CardContent className="pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Certification {i + 1}</span>
              <Button variant="ghost" size="icon" onClick={() => remove(i)} className="h-7 w-7 text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1.5">
              <Label>Nom de la certification</Label>
              <Input value={cert.name} onChange={e => update(i, "name", e.target.value)} placeholder="AWS Certified Solutions Architect" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Émetteur</Label>
                <Input value={cert.issuer} onChange={e => update(i, "issuer", e.target.value)} placeholder="Amazon Web Services" />
              </div>
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input value={cert.date} onChange={e => update(i, "date", e.target.value)} placeholder="Mars 2024" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>URL (optionnel)</Label>
              <Input value={cert.url} onChange={e => update(i, "url", e.target.value)} placeholder="https://..." />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" className="w-full border-dashed" onClick={add}>
        <Plus className="w-4 h-4 mr-2" /> Ajouter une certification
      </Button>
    </div>
  )
}

function ProjectsStep({ cvData, setCVData }: Pick<CVBuilderStepsProps, "cvData" | "setCVData">) {
  const add = () =>
    setCVData(prev => ({ ...prev, projects: [...prev.projects, { name: "", description: "", technologies: [], url: "", startDate: "", endDate: "" }] }))
  const remove = (i: number) =>
    setCVData(prev => ({ ...prev, projects: prev.projects.filter((_, idx) => idx !== i) }))
  const update = (i: number, field: string, value: any) =>
    setCVData(prev => {
      const projs = [...prev.projects]
      projs[i] = { ...projs[i], [field]: value }
      return { ...prev, projects: projs }
    })

  return (
    <div className="space-y-4">
      {cvData.projects.map((proj, i) => (
        <Card key={i}>
          <CardContent className="pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Projet {i + 1}</span>
              <Button variant="ghost" size="icon" onClick={() => remove(i)} className="h-7 w-7 text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1.5">
              <Label>Nom du projet</Label>
              <Input value={proj.name} onChange={e => update(i, "name", e.target.value)} placeholder="Portfolio personnel" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={proj.description} onChange={e => update(i, "description", e.target.value)} rows={2} placeholder="Application web qui..." />
            </div>
            <div className="space-y-1.5">
              <Label>Technologies (séparées par des virgules)</Label>
              <Input
                value={Array.isArray(proj.technologies) ? proj.technologies.join(", ") : ""}
                onChange={e => update(i, "technologies", e.target.value.split(",").map((t: string) => t.trim()).filter(Boolean))}
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>
            <div className="space-y-1.5">
              <Label>URL (optionnel)</Label>
              <Input value={proj.url} onChange={e => update(i, "url", e.target.value)} placeholder="https://github.com/..." />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" className="w-full border-dashed" onClick={add}>
        <Plus className="w-4 h-4 mr-2" /> Ajouter un projet
      </Button>
    </div>
  )
}

function GenerateCreativeCVStep({ cvData }: { cvData: CVData }) {
  const [generatedCV, setGeneratedCV] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateCreativeCV = async () => {
    setLoading(true)
    setGeneratedCV(null)
    setError(null)
    try {
      // Generate a simple HTML CV template locally
      const html = generateSimpleCV(cvData)
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate processing
      setGeneratedCV(html)
    } catch (e) {
      console.error(e)
      setError("Erreur lors de la génération du CV créatif. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const generateSimpleCV = (data: CVData): string => {
    const skillsHTML = data.skills.map(s => `<span class="skill">${s.name}</span>`).join('')
    const experienceHTML = data.experience.map(exp => `
      <div class="item">
        <h3>${exp.position}</h3>
        <div class="meta">${exp.company} • ${exp.location}</div>
        <div class="dates">${exp.startDate} ${exp.endDate ? `- ${exp.endDate}` : '- Présent'}</div>
        <p>${exp.description}</p>
      </div>
    `).join('')
    const educationHTML = data.education.map(edu => `
      <div class="item">
        <h3>${edu.degree}</h3>
        <div class="meta">${edu.school} • ${edu.field}</div>
        <div class="dates">${edu.startDate} - ${edu.endDate}</div>
      </div>
    `).join('')
    const languagesHTML = data.languages.map(lang => `<div class="lang-item"><strong>${lang.name}:</strong> ${lang.level}</div>`).join('')

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${data.personalInfo.firstName} ${data.personalInfo.lastName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 900px; margin: 0 auto; padding: 20px; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 10px; margin-bottom: 30px; }
    .header h1 { font-size: 2.5em; margin-bottom: 5px; }
    .header .summary { font-size: 1.1em; opacity: 0.95; margin-top: 10px; }
    .contact-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 15px; font-size: 0.9em; }
    .contact-item { opacity: 0.9; }
    .section { margin-bottom: 35px; }
    .section h2 { color: #667eea; font-size: 1.3em; border-bottom: 3px solid #667eea; padding-bottom: 10px; margin-bottom: 20px; }
    .item { margin-bottom: 20px; padding-left: 20px; }
    .item h3 { color: #333; font-size: 1.1em; margin-bottom: 5px; }
    .meta { color: #666; font-weight: 600; font-size: 0.95em; }
    .dates { color: #888; font-size: 0.9em; margin-top: 3px; }
    .item p { color: #555; margin-top: 8px; line-height: 1.5; }
    .skills { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 15px; border-radius: 20px; font-size: 0.9em; }
    .lang-item { padding: 8px 0; color: #555; }
    .lang-item strong { color: #667eea; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${data.personalInfo.firstName} ${data.personalInfo.lastName}</h1>
      ${data.personalInfo.summary ? `<div class="summary">${data.personalInfo.summary}</div>` : ''}
      <div class="contact-info">
        ${data.personalInfo.email ? `<div class="contact-item">📧 ${data.personalInfo.email}</div>` : ''}
        ${data.personalInfo.phone ? `<div class="contact-item">📱 ${data.personalInfo.phone}</div>` : ''}
        ${data.personalInfo.address ? `<div class="contact-item">📍 ${data.personalInfo.address}</div>` : ''}
      </div>
    </div>

    ${data.experience.length > 0 ? `<div class="section"><h2>Expérience</h2>${experienceHTML}</div>` : ''}
    ${data.education.length > 0 ? `<div class="section"><h2>Formation</h2>${educationHTML}</div>` : ''}
    ${data.skills.length > 0 ? `<div class="section"><h2>Compétences</h2><div class="skills">${skillsHTML}</div></div>` : ''}
    ${data.languages.length > 0 ? `<div class="section"><h2>Langues</h2>${languagesHTML}</div>` : ''}
  </div>
</body>
</html>`
  }

  const downloadCV = () => {
    if (!generatedCV) return
    const blob = new Blob([generatedCV], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Générer un CV Créatif</h2>
        <p className="text-muted-foreground">Notre IA transformera vos informations en un CV moderne et impactant</p>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={generateCreativeCV}
          disabled={loading}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 px-8 py-3 text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-3" />
              Générer mon CV Créatif
            </>
          )}
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!generatedCV && !loading && !error && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Prêt à créer un CV unique ?</h3>
            <p className="text-muted-foreground max-w-md">
              Notre IA utilisera toutes les informations que vous avez fournies pour générer un CV moderne, créatif et professionnel, spécialement optimisé pour votre profil.
            </p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-pulse"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Génération en cours...</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Notre IA crée un CV personnalisé et créatif basé sur vos informations. Cela peut prendre quelques instants.
            </p>
            <div className="mt-4 w-full max-w-xs">
              <Progress value={undefined} className="h-2 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      )}

      {generatedCV && (
        <div className="space-y-6">
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="text-green-800 font-medium">Votre CV créatif a été généré avec succès !</p>
              </div>
              <p className="text-green-700 text-sm">
                Vous pouvez maintenant télécharger votre CV ou le régénérer avec des modifications.
              </p>
            </CardContent>
          </Card>

          <div className="border rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between border-b pb-4">
              <h3 className="font-semibold text-lg">Aperçu de votre CV</h3>
              <Button onClick={downloadCV} className="bg-gradient-to-r from-green-600 to-emerald-600">
                <FileText className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            </div>
            <div className="bg-gray-50 rounded p-4 max-h-96 overflow-auto">
              <iframe
                title="CV Preview"
                srcDoc={generatedCV}
                style={{
                  width: "100%",
                  minHeight: "600px",
                  border: "none",
                  borderRadius: "0.375rem"
                }}
              />
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={generateCreativeCV} variant="outline" className="px-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Régénérer
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

function FinalPreviewStep({ cvData }: { cvData: CVData }) {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">CV Final Preview</h2>
        <p className="text-muted-foreground">
          Cette derniere etape affiche le meme modele ATS-friendly que la preview.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 md:p-5">
          <CVPreview cvData={cvData} compact hideToolbar />
        </CardContent>
      </Card>

      <CVAnalysisButton cvData={cvData} />
    </div>
  )
}

export function CVBuilderSteps({
  cvData,
  setCVData,
  currentStep,
  setCurrentStep,
}: CVBuilderStepsProps) {
  const step = STEPS[currentStep]
  const progress = ((currentStep) / (STEPS.length - 1)) * 100

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <PersonalInfoStep cvData={cvData} setCVData={setCVData} />
      case 1: return <EducationStep cvData={cvData} setCVData={setCVData} />
      case 2: return <ExperienceStep cvData={cvData} setCVData={setCVData} />
      case 3: return <SkillsStep cvData={cvData} setCVData={setCVData} />
      case 4: return <LanguagesStep cvData={cvData} setCVData={setCVData} />
      case 5: return <CertificationsStep cvData={cvData} setCVData={setCVData} />
      case 6: return <ProjectsStep cvData={cvData} setCVData={setCVData} />
      case 7: return <FinalPreviewStep cvData={cvData} />
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 space-y-3 bg-background sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <step.icon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">{step.label}</h2>
          <Badge variant="outline" className="text-xs">{currentStep + 1}/{STEPS.length}</Badge>
        </div>

        {/* Step tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
          {STEPS.map((s) => {
            const Icon = s.icon
            return (
              <button
                key={s.id}
                onClick={() => setCurrentStep(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${s.id === currentStep
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {s.label}
              </button>
            )
          })}
        </div>

        <Progress value={progress} className="h-1" />
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-auto p-6">
        {renderStep()}
      </div>

      {/* Footer navigation */}
      <div className="border-t border-border px-6 py-4 flex justify-between bg-background">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Précédent
        </Button>
        <Button
          onClick={() => setCurrentStep(s => Math.min(STEPS.length - 1, s + 1))}
          disabled={currentStep === STEPS.length - 1}
        >
          Suivant <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
