"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CVData, Language } from "@/lib/types/cv"
import { Globe, Plus, Trash2 } from "lucide-react"

interface LanguagesStepProps {
  cvData: CVData
  setCVData: React.Dispatch<React.SetStateAction<CVData>>
  onNext: () => void
  onPrevious: () => void
}

const availableLanguages = [
  "Francais", "Anglais", "Espagnol", "Allemand", "Italien", 
  "Portugais", "Arabe", "Chinois", "Japonais", "Russe", "Coreen"
]

const languageLevels: { value: Language["level"]; label: string; description: string }[] = [
  { value: "A1", label: "A1 - Debutant", description: "Notions de base" },
  { value: "A2", label: "A2 - Elementaire", description: "Communication simple" },
  { value: "B1", label: "B1 - Intermediaire", description: "Conversation courante" },
  { value: "B2", label: "B2 - Avance", description: "Aisance professionnelle" },
  { value: "C1", label: "C1 - Expert", description: "Maitrise avancee" },
  { value: "C2", label: "C2 - Bilingue", description: "Niveau natif" },
  { value: "native", label: "Langue maternelle", description: "Langue native" },
]

export function LanguagesStep({ cvData, setCVData }: LanguagesStepProps) {
  const addLanguage = (name: string) => {
    if (!cvData.languages.find(l => l.name === name)) {
      const language: Language = {
        id: Date.now().toString(),
        name,
        level: "B1"
      }
      setCVData(prev => ({
        ...prev,
        languages: [...prev.languages, language]
      }))
    }
  }

  const updateLanguageLevel = (id: string, level: Language["level"]) => {
    setCVData(prev => ({
      ...prev,
      languages: prev.languages.map(lang =>
        lang.id === id ? { ...lang, level } : lang
      )
    }))
  }

  const removeLanguage = (id: string) => {
    setCVData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }))
  }

  const getLevelColor = (level: Language["level"]) => {
    const colors: Record<string, string> = {
      "A1": "bg-red-100 text-red-700",
      "A2": "bg-orange-100 text-orange-700",
      "B1": "bg-yellow-100 text-yellow-700",
      "B2": "bg-lime-100 text-lime-700",
      "C1": "bg-green-100 text-green-700",
      "C2": "bg-emerald-100 text-emerald-700",
      "native": "bg-primary/10 text-primary"
    }
    return colors[level] || ""
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Globe className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Langues</h2>
        <p className="text-muted-foreground">Indiquez les langues que vous parlez</p>
      </div>

      {/* Available Languages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Selectionnez vos langues</CardTitle>
          <CardDescription>Cliquez sur une langue pour l&apos;ajouter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availableLanguages.map(lang => {
              const isAdded = cvData.languages.find(l => l.name === lang)
              return (
                <Button
                  key={lang}
                  variant={isAdded ? "default" : "outline"}
                  size="sm"
                  onClick={() => !isAdded && addLanguage(lang)}
                  disabled={!!isAdded}
                >
                  {lang}
                  {isAdded && <span className="ml-1">✓</span>}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Languages */}
      {cvData.languages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vos langues ({cvData.languages.length})</CardTitle>
            <CardDescription>Definissez votre niveau pour chaque langue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cvData.languages.map(lang => (
              <div
                key={lang.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{lang.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(lang.level)}`}>
                      {languageLevels.find(l => l.value === lang.level)?.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={lang.level}
                    onValueChange={(v) => updateLanguageLevel(lang.id, v as Language["level"])}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languageLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          <div>
                            <p>{level.label}</p>
                            <p className="text-xs text-muted-foreground">{level.description}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLanguage(lang.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Level Guide */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Guide des niveaux CECRL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {languageLevels.map(level => (
              <div key={level.value} className="flex items-center gap-3 p-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(level.value)}`}>
                  {level.value === "native" ? "Natif" : level.value}
                </span>
                <div>
                  <p className="text-sm font-medium">{level.label}</p>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
