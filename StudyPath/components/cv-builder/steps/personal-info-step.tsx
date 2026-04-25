"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CVData } from "@/lib/types/cv"
import { User, Mail, Phone, MapPin, Linkedin, Globe, FileText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PersonalInfoStepProps {
  cvData: CVData
  setCVData: React.Dispatch<React.SetStateAction<CVData>>
  onNext: () => void
  onPrevious: () => void
}

export function PersonalInfoStep({ cvData, setCVData }: PersonalInfoStepProps) {
  const updateField = (field: keyof CVData["personalInfo"], value: string) => {
    setCVData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Informations personnelles</h2>
        <p className="text-muted-foreground">Commencez par renseigner vos coordonnees de base</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Identite</CardTitle>
          <CardDescription>Ces informations apparaitront en haut de votre CV</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prenom</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  placeholder="Votre prenom"
                  className="pl-10"
                  value={cvData.personalInfo.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  placeholder="Votre nom"
                  className="pl-10"
                  value={cvData.personalInfo.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Coordonnees</CardTitle>
          <CardDescription>Comment les recruteurs peuvent vous contacter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  className="pl-10"
                  value={cvData.personalInfo.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telephone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  className="pl-10"
                  value={cvData.personalInfo.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="address"
                placeholder="Ville, Pays"
                className="pl-10"
                value={cvData.personalInfo.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Liens professionnels</CardTitle>
          <CardDescription>Ajoutez vos profils en ligne (optionnel)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedIn">LinkedIn</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="linkedIn"
                  placeholder="linkedin.com/in/votre-profil"
                  className="pl-10"
                  value={cvData.personalInfo.linkedIn}
                  onChange={(e) => updateField("linkedIn", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio / Site web</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="portfolio"
                  placeholder="votre-site.com"
                  className="pl-10"
                  value={cvData.personalInfo.portfolio}
                  onChange={(e) => updateField("portfolio", e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resume professionnel
              </CardTitle>
              <CardDescription>Un court paragraphe qui vous presente</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Generer avec IA
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Decrivez votre profil en quelques phrases. Par exemple: Etudiant en informatique passionne par le developpement web et l'intelligence artificielle..."
            className="min-h-32 resize-none"
            value={cvData.personalInfo.summary}
            onChange={(e) => updateField("summary", e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-2">
            {cvData.personalInfo.summary.length}/500 caracteres
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
