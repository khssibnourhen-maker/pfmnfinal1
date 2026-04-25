"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CVData, Certification } from "@/lib/types/cv"
import { Award, Plus, Trash2, Building, Calendar, Link as LinkIcon, Hash } from "lucide-react"

interface CertificationsStepProps {
  cvData: CVData
  setCVData: React.Dispatch<React.SetStateAction<CVData>>
  onNext: () => void
  onPrevious: () => void
}

export function CertificationsStep({ cvData, setCVData }: CertificationsStepProps) {
  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      date: "",
      expiryDate: "",
      credentialId: "",
      url: ""
    }
    setCVData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }))
  }

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCVData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }))
  }

  const removeCertification = (id: string) => {
    setCVData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Award className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Certifications</h2>
        <p className="text-muted-foreground">Ajoutez vos certifications et diplomes supplementaires</p>
      </div>

      {cvData.certifications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Aucune certification ajoutee</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ajoutez vos certifications professionnelles (AWS, Google, etc.)
            </p>
            <Button onClick={addCertification}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une certification
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cvData.certifications.map((cert) => (
            <Card key={cert.id}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                      <Award className="w-5 h-5 text-chart-4" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {cert.name || "Nouvelle certification"}
                      </CardTitle>
                      <CardDescription>
                        {cert.issuer || "Cliquez pour modifier"}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCertification(cert.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom de la certification</Label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="AWS Solutions Architect, Google Cloud..."
                        className="pl-10"
                        value={cert.name}
                        onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Organisme</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Amazon Web Services, Google, etc."
                        className="pl-10"
                        value={cert.issuer}
                        onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date d&apos;obtention</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="month"
                        className="pl-10"
                        value={cert.date}
                        onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Date d&apos;expiration (optionnel)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="month"
                        className="pl-10"
                        value={cert.expiryDate || ""}
                        onChange={(e) => updateCertification(cert.id, "expiryDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ID credential (optionnel)</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="ABC123XYZ"
                        className="pl-10"
                        value={cert.credentialId || ""}
                        onChange={(e) => updateCertification(cert.id, "credentialId", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Lien de verification (optionnel)</Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="https://..."
                        className="pl-10"
                        value={cert.url || ""}
                        onChange={(e) => updateCertification(cert.id, "url", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={addCertification} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une autre certification
          </Button>
        </div>
      )}
    </div>
  )
}
