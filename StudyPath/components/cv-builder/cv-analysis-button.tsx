"use client"

import { useState } from "react"
import { Loader2, Sparkles, ArrowRight } from "lucide-react"
import { aiApi, cvsApi } from "@/lib/api"
import { CVData } from "@/lib/types/cv"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CVAnalysisButtonProps {
  cvData: CVData
  className?: string
}

export function CVAnalysisButton({ cvData, className = "" }: CVAnalysisButtonProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const generateCVContent = (cvData: CVData): string => {
    if (!cvData) return ""

    const {
      personalInfo,
      education,
      experience,
      skills,
      languages,
      certifications,
      projects,
    } = cvData

    let content = `CV de ${personalInfo?.firstName || ""} ${personalInfo?.lastName || ""}\n\n`

    if (personalInfo?.summary) {
      content += `Profil: ${personalInfo.summary}\n\n`
    }

    if (experience?.length) {
      content += "Expérience:\n"
      experience.forEach((exp) => {
        content += `- ${exp.position || ""} chez ${exp.company || ""} (${exp.startDate || ""} - ${exp.endDate || "Présent"})\n`
        if (exp.description) content += `  ${exp.description}\n`
        if (exp.achievements?.length) {
          exp.achievements.forEach((a) => {
            content += `  • ${a}\n`
          })
        }
      })
      content += "\n"
    }

    if (education?.length) {
      content += "Formation:\n"
      education.forEach((edu) => {
        content += `- ${edu.degree || ""} en ${edu.field || ""} à ${edu.school || ""} (${edu.startDate || ""} - ${edu.endDate || ""})\n`
      })
      content += "\n"
    }

    if (skills?.length) {
      content += "Compétences:\n"
      skills.forEach((skill) => {
        content += `- ${skill.name || ""} (${skill.level || ""})\n`
      })
      content += "\n"
    }

    if (languages?.length) {
      content += "Langues:\n"
      languages.forEach((lang) => {
        content += `- ${lang.name || ""} (${lang.level || ""})\n`
      })
      content += "\n"
    }

    if (certifications?.length) {
      content += "Certifications:\n"
      certifications.forEach((cert) => {
        content += `- ${cert.name || ""} - ${cert.issuer || ""}\n`
      })
      content += "\n"
    }

    if (projects?.length) {
      content += "Projets:\n"
      projects.forEach((project) => {
        content += `- ${project.name || ""}: ${project.description || ""}\n`
      })
    }

    return content
  }

  const cvContent = generateCVContent(cvData)

  if (!cvData) return null

  const hasMeaningfulContent =
    cvContent
      .trim()
      .split("\n")
      .filter((line) => line.trim()).length > 8

  if (!hasMeaningfulContent) return null

  const handleAnalyzeCv = async () => {
    if (!user?.id) {
      alert("Connectez-vous pour enregistrer et analyser votre CV.")
      return
    }

    if (!cvContent.trim()) {
      alert("Ajoute du contenu à ton CV avant l'analyse.")
      return
    }

    setLoading(true)

    try {
      const savedCv = await cvsApi.create(user.id, {
        title: `CV ${cvData.personalInfo.firstName || user.firstName} ${cvData.personalInfo.lastName || user.lastName}`,
        summary: cvData.personalInfo.summary,
        content: cvContent,
        structuredData: cvData,
      })

      const analysisResult = await aiApi.analyzeCv(cvContent, savedCv.id)

      localStorage.setItem(
        "cvAnalysis",
        JSON.stringify({
          analysis: analysisResult.analysis,
          suggestions: "",
          cvContent,
          cvId: savedCv.id,
          timestamp: new Date().toISOString(),
        })
      )

      router.push("/student/career-mirror")
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Analyse IA impossible. Vérifie backend, MongoDB et Ollama."
      )
      setLoading(false)
      return
    }

    setLoading(false)
  }

  return (
    <Card className={`border-accent/20 bg-gradient-to-r from-accent/10 via-background to-background ${className}`}>
      <CardContent className="p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-accent mb-1">Career Mirror AI</p>
          <h3 className="text-xl font-semibold">
            Analyse ton CV et obtiens un vrai plan d'amélioration
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Suggestions de certifications, projets, optimisation ATS et prochaines étapes carrière avec Ollama + Qwen2.5.
          </p>
        </div>

        <Button
          onClick={handleAnalyzeCv}
          disabled={loading}
          size="lg"
          className="min-w-[220px]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze with AI
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
