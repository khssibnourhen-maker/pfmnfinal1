"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CVData, Skill } from "@/lib/types/cv"
import { Code, Plus, Trash2, Sparkles, Star } from "lucide-react"

interface SkillsStepProps {
  cvData: CVData
  setCVData: React.Dispatch<React.SetStateAction<CVData>>
  onNext: () => void
  onPrevious: () => void
}

const skillCategories = [
  "Programmation",
  "Frameworks",
  "Bases de donnees",
  "DevOps",
  "Design",
  "Soft Skills",
  "Outils",
  "Autres"
]

const suggestedSkills = {
  "Programmation": ["Python", "JavaScript", "Java", "TypeScript", "C++", "SQL"],
  "Frameworks": ["React", "Next.js", "Vue.js", "Django", "Spring Boot", "Node.js"],
  "Bases de donnees": ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Firebase"],
  "DevOps": ["Docker", "Kubernetes", "AWS", "Git", "CI/CD", "Linux"],
  "Design": ["Figma", "Adobe XD", "Photoshop", "UI/UX", "Tailwind CSS"],
  "Soft Skills": ["Communication", "Leadership", "Travail d'equipe", "Resolution de problemes"],
  "Outils": ["VS Code", "Jira", "Notion", "Slack", "Postman"],
}

const levelLabels = {
  beginner: "Debutant",
  intermediate: "Intermediaire",
  advanced: "Avance",
  expert: "Expert"
}

export function SkillsStep({ cvData, setCVData }: SkillsStepProps) {
  const [newSkill, setNewSkill] = useState("")
  const [newSkillLevel, setNewSkillLevel] = useState<Skill["level"]>("intermediate")
  const [newSkillCategory, setNewSkillCategory] = useState("Programmation")

  const addSkill = (name?: string) => {
    const skillName = name || newSkill.trim()
    if (skillName && !cvData.skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      const skill: Skill = {
        id: Date.now().toString(),
        name: skillName,
        level: newSkillLevel,
        category: newSkillCategory
      }
      setCVData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }))
      setNewSkill("")
    }
  }

  const updateSkillLevel = (id: string, level: Skill["level"]) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, level } : skill
      )
    }))
  }

  const removeSkill = (id: string) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }))
  }

  const skillsByCategory = cvData.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  const getLevelStars = (level: Skill["level"]) => {
    const levels = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }
    return levels[level]
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Code className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Competences</h2>
        <p className="text-muted-foreground">Listez vos competences techniques et soft skills</p>
      </div>

      {/* Add Skill Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ajouter une competence</CardTitle>
          <CardDescription>Renseignez vos competences avec leur niveau de maitrise</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Competence</Label>
              <Input
                placeholder="Ex: Python, React..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
              />
            </div>
            <div className="space-y-2">
              <Label>Categorie</Label>
              <Select value={newSkillCategory} onValueChange={setNewSkillCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {skillCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Niveau</Label>
              <Select value={newSkillLevel} onValueChange={(v) => setNewSkillLevel(v as Skill["level"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Debutant</SelectItem>
                  <SelectItem value="intermediate">Intermediaire</SelectItem>
                  <SelectItem value="advanced">Avance</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={() => addSkill()} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter la competence
          </Button>
        </CardContent>
      </Card>

      {/* Suggested Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Suggestions
          </CardTitle>
          <CardDescription>Cliquez pour ajouter rapidement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(suggestedSkills).map(([category, skills]) => (
              <div key={category}>
                <p className="text-sm font-medium text-muted-foreground mb-2">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => {
                    const isAdded = cvData.skills.find(s => s.name.toLowerCase() === skill.toLowerCase())
                    return (
                      <Badge
                        key={skill}
                        variant={isAdded ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${!isAdded && "hover:bg-primary/10"}`}
                        onClick={() => {
                          if (!isAdded) {
                            setNewSkillCategory(category)
                            addSkill(skill)
                          }
                        }}
                      >
                        {skill}
                        {isAdded && <span className="ml-1">✓</span>}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Skills */}
      {Object.keys(skillsByCategory).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vos competences ({cvData.skills.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category}>
                <p className="text-sm font-medium text-muted-foreground mb-3">{category}</p>
                <div className="space-y-2">
                  {skills.map(skill => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{skill.name}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < getLevelStars(skill.level)
                                  ? "fill-chart-4 text-chart-4"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {levelLabels[skill.level]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={skill.level}
                          onValueChange={(v) => updateSkillLevel(skill.id, v as Skill["level"])}
                        >
                          <SelectTrigger className="h-8 w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Debutant</SelectItem>
                            <SelectItem value="intermediate">Intermediaire</SelectItem>
                            <SelectItem value="advanced">Avance</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSkill(skill.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
