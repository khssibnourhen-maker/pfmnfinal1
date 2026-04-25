"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CVData, Experience } from "@/lib/types/cv"
import { Briefcase, Plus, Trash2, Building, Calendar, MapPin, X, Sparkles } from "lucide-react"

interface ExperienceStepProps {
  cvData: CVData
  setCVData: React.Dispatch<React.SetStateAction<CVData>>
  onNext: () => void
  onPrevious: () => void
}

export function ExperienceStep({ cvData, setCVData }: ExperienceStepProps) {
  const [newAchievement, setNewAchievement] = useState<Record<string, string>>({})

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: []
    }
    setCVData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }))
  }

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean | string[]) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const removeExperience = (id: string) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }))
  }

  const addAchievement = (expId: string) => {
    const achievement = newAchievement[expId]?.trim()
    if (achievement) {
      const exp = cvData.experience.find(e => e.id === expId)
      if (exp) {
        updateExperience(expId, "achievements", [...exp.achievements, achievement])
        setNewAchievement(prev => ({ ...prev, [expId]: "" }))
      }
    }
  }

  const removeAchievement = (expId: string, index: number) => {
    const exp = cvData.experience.find(e => e.id === expId)
    if (exp) {
      const updated = exp.achievements.filter((_, i) => i !== index)
      updateExperience(expId, "achievements", updated)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Experience professionnelle</h2>
        <p className="text-muted-foreground">Ajoutez vos experiences, stages et projets</p>
      </div>

      {cvData.experience.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Aucune experience ajoutee</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ajoutez vos stages, emplois ou projets professionnels
            </p>
            <Button onClick={addExperience}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une experience
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cvData.experience.map((exp) => (
            <Card key={exp.id}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {exp.position || "Nouvelle experience"}
                      </CardTitle>
                      <CardDescription>
                        {exp.company || "Cliquez pour modifier"}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExperience(exp.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Entreprise</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Nom de l'entreprise"
                        className="pl-10"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Poste</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Titre du poste"
                        className="pl-10"
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Localisation</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Ville, Pays"
                      className="pl-10"
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date de debut</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="month"
                        className="pl-10"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Date de fin</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="month"
                        className="pl-10"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                        disabled={exp.current}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onCheckedChange={(checked) => updateExperience(exp.id, "current", checked as boolean)}
                  />
                  <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal">
                    Poste actuel
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Decrivez vos responsabilites et missions..."
                    className="min-h-24 resize-none"
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Realisations cles</Label>
                    <Button variant="ghost" size="sm" className="gap-2 h-8">
                      <Sparkles className="w-3 h-3" />
                      Suggerer
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {exp.achievements.map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="gap-1 py-1.5">
                        {achievement}
                        <button onClick={() => removeAchievement(exp.id, index)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: Augmentation des ventes de 20%"
                      value={newAchievement[exp.id] || ""}
                      onChange={(e) => setNewAchievement(prev => ({ ...prev, [exp.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && addAchievement(exp.id)}
                    />
                    <Button variant="outline" onClick={() => addAchievement(exp.id)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={addExperience} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une autre experience
          </Button>
        </div>
      )}
    </div>
  )
}
