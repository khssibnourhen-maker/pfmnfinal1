"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CVData, Project } from "@/lib/types/cv"
import { FolderOpen, Plus, Trash2, Calendar, Link as LinkIcon, X, Code } from "lucide-react"

interface ProjectsStepProps {
  cvData: CVData
  setCVData: React.Dispatch<React.SetStateAction<CVData>>
  onNext: () => void
  onPrevious: () => void
}

export function ProjectsStep({ cvData, setCVData }: ProjectsStepProps) {
  const [newTech, setNewTech] = useState<Record<string, string>>({})

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      url: "",
      startDate: "",
      endDate: ""
    }
    setCVData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }))
  }

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    setCVData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    }))
  }

  const removeProject = (id: string) => {
    setCVData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }))
  }

  const addTechnology = (projectId: string) => {
    const tech = newTech[projectId]?.trim()
    if (tech) {
      const project = cvData.projects.find(p => p.id === projectId)
      if (project && !project.technologies.includes(tech)) {
        updateProject(projectId, "technologies", [...project.technologies, tech])
        setNewTech(prev => ({ ...prev, [projectId]: "" }))
      }
    }
  }

  const removeTechnology = (projectId: string, tech: string) => {
    const project = cvData.projects.find(p => p.id === projectId)
    if (project) {
      updateProject(projectId, "technologies", project.technologies.filter(t => t !== tech))
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <FolderOpen className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Projets</h2>
        <p className="text-muted-foreground">Presentez vos projets personnels ou academiques</p>
      </div>

      {cvData.projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Aucun projet ajoute</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ajoutez vos projets personnels, hackathons ou projets academiques
            </p>
            <Button onClick={addProject}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un projet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cvData.projects.map((project) => (
            <Card key={project.id}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-chart-3" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {project.name || "Nouveau projet"}
                      </CardTitle>
                      <CardDescription>
                        {project.technologies.length > 0
                          ? project.technologies.slice(0, 3).join(", ")
                          : "Cliquez pour modifier"}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProject(project.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom du projet</Label>
                  <div className="relative">
                    <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Mon super projet"
                      className="pl-10"
                      value={project.name}
                      onChange={(e) => updateProject(project.id, "name", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Decrivez votre projet, ses fonctionnalites et ce que vous avez appris..."
                    className="min-h-24 resize-none"
                    value={project.description}
                    onChange={(e) => updateProject(project.id, "description", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Technologies utilisees</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map(tech => (
                      <Badge key={tech} variant="secondary" className="gap-1 py-1.5">
                        <Code className="w-3 h-3" />
                        {tech}
                        <button onClick={() => removeTechnology(project.id, tech)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="React, Python, AWS..."
                      value={newTech[project.id] || ""}
                      onChange={(e) => setNewTech(prev => ({ ...prev, [project.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && addTechnology(project.id)}
                    />
                    <Button variant="outline" onClick={() => addTechnology(project.id)}>
                      <Plus className="w-4 h-4" />
                    </Button>
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
                        value={project.startDate}
                        onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Date de fin (optionnel)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="month"
                        className="pl-10"
                        value={project.endDate || ""}
                        onChange={(e) => updateProject(project.id, "endDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Lien du projet (optionnel)</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="https://github.com/... ou https://mon-projet.com"
                      className="pl-10"
                      value={project.url || ""}
                      onChange={(e) => updateProject(project.id, "url", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={addProject} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un autre projet
          </Button>
        </div>
      )}
    </div>
  )
}
