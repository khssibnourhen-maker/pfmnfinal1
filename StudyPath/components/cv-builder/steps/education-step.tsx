"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CVData, Education } from "@/lib/types/cv"
import { GraduationCap, Plus, Trash2, Building, Calendar, BookOpen } from "lucide-react"

interface EducationStepProps {
  cvData: CVData
  setCVData: React.Dispatch<React.SetStateAction<CVData>>
  onNext: () => void
  onPrevious: () => void
}

export function EducationStep({ cvData, setCVData }: EducationStepProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    }
    setCVData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }))
    setEditingId(newEducation.id)
  }

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const removeEducation = (id: string) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Formation</h2>
        <p className="text-muted-foreground">Ajoutez vos diplomes et formations</p>
      </div>

      {cvData.education.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Aucune formation ajoutee</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Commencez par ajouter votre formation la plus recente
            </p>
            <Button onClick={addEducation}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une formation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cvData.education.map((edu) => (
            <Card key={edu.id} className={editingId === edu.id ? "border-primary" : ""}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {edu.school || "Nouvelle formation"}
                      </CardTitle>
                      <CardDescription>
                        {edu.degree ? `${edu.degree} - ${edu.field}` : "Cliquez pour modifier"}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEducation(edu.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Etablissement</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Universite, Ecole..."
                        className="pl-10"
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Diplome</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Licence, Master, Ingenieur..."
                        className="pl-10"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Domaine d&apos;etudes</Label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Informatique, Gestion, Marketing..."
                      className="pl-10"
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
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
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
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
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                        disabled={edu.current}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`current-${edu.id}`}
                    checked={edu.current}
                    onCheckedChange={(checked) => updateEducation(edu.id, "current", checked as boolean)}
                  />
                  <Label htmlFor={`current-${edu.id}`} className="text-sm font-normal">
                    En cours actuellement
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label>Description (optionnel)</Label>
                  <Textarea
                    placeholder="Decrivez votre parcours, vos projets, mentions..."
                    className="min-h-24 resize-none"
                    value={edu.description}
                    onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={addEducation} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une autre formation
          </Button>
        </div>
      )}
    </div>
  )
}
