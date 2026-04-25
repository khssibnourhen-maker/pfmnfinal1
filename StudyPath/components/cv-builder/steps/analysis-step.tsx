"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CVData, CVAnalysis } from "@/lib/types/cv"
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Target, 
  Zap,
  FileText,
  Download,
  RefreshCw,
  ChevronRight,
  Star,
  Lightbulb
} from "lucide-react"

interface AnalysisStepProps {
  cvData: CVData
  setCVData: React.Dispatch<React.SetStateAction<CVData>>
  onNext: () => void
  onPrevious: () => void
}

export function AnalysisStep({ cvData }: AnalysisStepProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null)
  const [animatedScore, setAnimatedScore] = useState(0)

  const runAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysis(null)
    setAnimatedScore(0)

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2500))

    const mockAnalysis: CVAnalysis = {
      overallScore: 78,
      sections: [
        {
          name: "Informations personnelles",
          score: cvData.personalInfo.firstName && cvData.personalInfo.email ? 95 : 40,
          feedback: cvData.personalInfo.summary 
            ? "Excellent resume professionnel, clair et concis."
            : "Ajoutez un resume professionnel pour vous demarquer.",
          suggestions: cvData.personalInfo.summary ? [] : [
            "Redigez un resume de 2-3 phrases",
            "Mentionnez votre objectif professionnel"
          ]
        },
        {
          name: "Formation",
          score: cvData.education.length > 0 ? 85 : 30,
          feedback: cvData.education.length > 0
            ? "Bonne presentation de votre parcours academique."
            : "Section formation incomplete.",
          suggestions: cvData.education.length === 0 
            ? ["Ajoutez au moins une formation"] 
            : ["Ajoutez des details sur vos projets academiques"]
        },
        {
          name: "Experience",
          score: cvData.experience.length > 0 ? 80 : 25,
          feedback: cvData.experience.length > 0
            ? "Experiences bien detaillees avec des realisations concretes."
            : "Ajoutez des experiences pour renforcer votre profil.",
          suggestions: cvData.experience.length === 0
            ? ["Ajoutez des stages, jobs etudiants ou projets"]
            : ["Quantifiez davantage vos realisations"]
        },
        {
          name: "Competences",
          score: cvData.skills.length >= 5 ? 90 : cvData.skills.length > 0 ? 60 : 20,
          feedback: cvData.skills.length >= 5
            ? "Excellent eventail de competences techniques."
            : "Enrichissez votre liste de competences.",
          suggestions: cvData.skills.length < 5 
            ? ["Ajoutez plus de competences techniques", "Incluez des soft skills"]
            : []
        },
        {
          name: "Projets",
          score: cvData.projects.length > 0 ? 85 : 40,
          feedback: cvData.projects.length > 0
            ? "Les projets demontrent bien vos competences pratiques."
            : "Les projets sont essentiels pour les profils juniors.",
          suggestions: cvData.projects.length === 0
            ? ["Ajoutez des projets personnels ou academiques", "Incluez des liens vers GitHub"]
            : []
        }
      ],
      strengths: [
        cvData.skills.length > 5 && "Competences techniques diversifiees",
        cvData.experience.length > 0 && "Experience professionnelle presente",
        cvData.personalInfo.linkedIn && "Profil LinkedIn lie",
        cvData.languages.length > 1 && "Multilinguisme"
      ].filter(Boolean) as string[],
      improvements: [
        !cvData.personalInfo.summary && "Ajouter un resume professionnel",
        cvData.skills.length < 5 && "Enrichir la section competences",
        cvData.projects.length === 0 && "Ajouter des projets",
        cvData.certifications.length === 0 && "Ajouter des certifications"
      ].filter(Boolean) as string[],
      keywords: ["Python", "React", "Data Science", "Machine Learning", "Agile"].slice(0, cvData.skills.length || 3),
      atsScore: 72
    }

    setAnalysis(mockAnalysis)
    setIsAnalyzing(false)

    // Animate score
    let current = 0
    const interval = setInterval(() => {
      current += 2
      if (current >= mockAnalysis.overallScore) {
        setAnimatedScore(mockAnalysis.overallScore)
        clearInterval(interval)
      } else {
        setAnimatedScore(current)
      }
    }, 30)
  }

  useEffect(() => {
    runAnalysis()
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-chart-3"
    if (score >= 60) return "text-chart-4"
    return "text-destructive"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-chart-3"
    if (score >= 60) return "bg-chart-4"
    return "bg-destructive"
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Analyse IA de votre CV</h2>
        <p className="text-muted-foreground">Notre IA analyse votre CV et vous donne des recommandations personnalisees</p>
      </div>

      {isAnalyzing ? (
        <Card className="border-primary/20">
          <CardContent className="py-16 text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Analyse en cours...</h3>
            <p className="text-muted-foreground mb-4">Notre IA examine chaque section de votre CV</p>
            <div className="max-w-xs mx-auto space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Verification des informations...</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse delay-300">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Analyse des competences...</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse delay-500">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Calcul du score ATS...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : analysis && (
        <>
          {/* Main Score Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="py-8">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Overall Score */}
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted/20"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(animatedScore / 100) * 352} 352`}
                        className={getScoreColor(animatedScore)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div>
                        <span className={`text-4xl font-bold ${getScoreColor(animatedScore)}`}>
                          {animatedScore}
                        </span>
                        <span className="text-lg text-muted-foreground">/100</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold">Score Global</h3>
                  <p className="text-sm text-muted-foreground">de votre CV</p>
                </div>

                {/* ATS Score */}
                <div className="text-center p-6 bg-background/50 rounded-xl">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Score ATS</span>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{analysis.atsScore}%</div>
                  <p className="text-sm text-muted-foreground">
                    Compatibilite avec les systemes de tri automatique
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-chart-3" />
                      <span className="text-sm">Points forts</span>
                    </div>
                    <Badge variant="secondary">{analysis.strengths.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-chart-4" />
                      <span className="text-sm">Ameliorations</span>
                    </div>
                    <Badge variant="secondary">{analysis.improvements.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-sm">Mots-cles</span>
                    </div>
                    <Badge variant="secondary">{analysis.keywords.length}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-chart-4" />
                  Points forts
                </CardTitle>
                <CardDescription>Ce qui rend votre CV attractif</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.strengths.length > 0 ? (
                    analysis.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-chart-3/10 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-chart-3 shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Completez votre CV pour decouvrir vos points forts</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Improvements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-chart-4" />
                  Axes d&apos;amelioration
                </CardTitle>
                <CardDescription>Comment optimiser votre CV</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.improvements.length > 0 ? (
                    analysis.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-chart-4/10 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-chart-4 shrink-0" />
                        <span className="text-sm">{improvement}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Excellent! Aucune amelioration majeure necessaire</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Analyse par section
              </CardTitle>
              <CardDescription>Score detaille de chaque partie de votre CV</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.sections.map((section, index) => (
                <div key={index} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{section.name}</span>
                      {section.score >= 80 && (
                        <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">Excellent</Badge>
                      )}
                    </div>
                    <span className={`font-bold ${getScoreColor(section.score)}`}>
                      {section.score}/100
                    </span>
                  </div>
                  <Progress value={section.score} className={`h-2 mb-3 [&>div]:${getScoreBg(section.score)}`} />
                  <p className="text-sm text-muted-foreground mb-2">{section.feedback}</p>
                  {section.suggestions.length > 0 && (
                    <div className="space-y-1">
                      {section.suggestions.map((suggestion, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <ChevronRight className="w-3 h-3" />
                          <span>{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Mots-cles detectes
              </CardTitle>
              <CardDescription>Termes qui renforcent votre visibilite ATS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={runAnalysis} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Relancer l&apos;analyse
            </Button>
            <Button className="gap-2 shadow-lg shadow-primary/25">
              <Download className="w-4 h-4" />
              Telecharger le CV
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
