"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Brain, ArrowLeft, Zap, Target, Rocket, MessageSquare } from "lucide-react"
import Link from "next/link"

interface CVAnalysisData {
  analysis: string
  suggestions: string
  cvContent: string
  timestamp: string
}

export default function CareerMirrorPage() {
  const [analysisData, setAnalysisData] = useState<CVAnalysisData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("cvAnalysis")
    if (stored) {
      try {
        setAnalysisData(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to load analysis data:", error)
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!analysisData) {
    return (
      <div className="p-6 lg:p-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/student/cv-builder">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to CV Builder
          </Link>
        </Button>

        <div className="py-16 text-center">
          <Brain className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
          <h2 className="mb-2 text-2xl font-bold">No Analysis Yet</h2>
          <p className="mx-auto mb-6 max-w-md text-muted-foreground">
            Va dans le CV Builder puis clique sur "Analyze with AI" pour generer ton diagnostic carriere.
          </p>
          <Button asChild>
            <Link href="/student/cv-builder">
              <Zap className="mr-2 h-4 w-4" />
              Go to CV Builder
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/student/cv-builder">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to CV Builder
            </Link>
          </Button>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Zap className="h-8 w-8 text-accent" />
            AI Career Mirror
          </h1>
          <p className="mt-2 text-muted-foreground">
            Diagnostic complet, honnête et actionnable de ton CV. Genere le{" "}
            {new Date(analysisData.timestamp).toLocaleString()}.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/student/ai-coach">
              <MessageSquare className="mr-2 h-4 w-4" />
              Open AI Coach
            </Link>
          </Button>
          <Button asChild>
            <Link href="/student/cv-builder">
              <Zap className="mr-2 h-4 w-4" />
              Re-analyze CV
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <Target className="mb-3 h-5 w-5 text-accent" />
            <p className="font-semibold">Diagnostic Honnete</p>
            <p className="text-sm text-muted-foreground">
              L'analyse se concentre sur le fond: clarté, crédibilité, spécialisation, impact et mots-clés.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <Rocket className="mb-3 h-5 w-5 text-accent" />
            <p className="font-semibold">Plan Actionnable</p>
            <p className="text-sm text-muted-foreground">
              Tu reçois un vrai plan d'amélioration avec priorités, positionnement et prochaines étapes carrière.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-accent/20">
        <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5">
          <div className="mb-2 flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            <Badge variant="outline" className="border-accent/30 bg-accent/10">
              Ollama + Qwen2.5
            </Badge>
          </div>
          <CardTitle className="text-2xl">Analyse Complete de Ton CV</CardTitle>
          <CardDescription>
            Une seule analyse complète, avec diagnostic, recommandations et orientation carrière.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <div className="rounded-xl border bg-muted/40 p-6 whitespace-pre-wrap text-sm leading-7">
            {analysisData.analysis}
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t pt-6">
            <Button asChild>
              <Link href="/student/ai-coach">
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask AI Coach what to do next
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/student/cv-builder">
                <Zap className="mr-2 h-4 w-4" />
                Update CV & Re-analyze
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                localStorage.removeItem("cvAnalysis")
                window.location.href = "/student/cv-builder"
              }}
            >
              Clear Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
