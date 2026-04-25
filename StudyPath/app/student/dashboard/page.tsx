"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  FileText, Calendar, Users, Rocket, Brain, ArrowRight,
  TrendingUp, Clock, Target, CheckCircle2, Sparkles, Loader2
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { cvsApi, schedulesApi, mentorMatchesApi, Schedule } from "@/lib/api"

export default function StudentDashboard() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Schedule[]>([])
  const [cvCount, setCvCount] = useState(0)
  const [matchCount, setMatchCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      schedulesApi.getByUser(user.id).catch(() => []),
      cvsApi.getByUser(user.id).catch(() => []),
      mentorMatchesApi.getByStudent(user.id).catch(() => []),
    ]).then(([schedules, cvs, matches]) => {
      setTasks((schedules || []).slice(0, 4))
      setCvCount((cvs || []).length)
      setMatchCount((matches || []).length)
    }).finally(() => setLoading(false))
  }, [user])

  const stats = [
    { label: "CVs créés", value: String(cvCount), icon: FileText, color: "text-primary", bgColor: "bg-primary/10" },
    { label: "Tâches planifiées", value: String(tasks.length), icon: Calendar, color: "text-accent", bgColor: "bg-accent/10" },
    { label: "Sessions Mentorat", value: String(matchCount), icon: Users, color: "text-chart-3", bgColor: "bg-chart-3/10" },
    { label: "Profil", value: `${user ? "Actif" : "—"}`, icon: Rocket, color: "text-chart-4", bgColor: "bg-chart-4/10" },
  ]

  const priorityColor: Record<string, string> = {
    HIGH: "bg-red-100 text-red-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    LOW: "bg-green-100 text-green-700",
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Bonjour, {user?.firstName || "Étudiant"} 👋
          </h1>
          <p className="text-muted-foreground">Voici un aperçu de votre progression aujourd'hui</p>
        </div>
        <Button asChild className="shadow-lg shadow-primary/25">
          <Link href="/student/cv-builder">
            <Sparkles className="w-4 h-4 mr-2" />Continuer mon CV
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : (
                      <p className="text-xl font-bold">{stat.value}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tâches récentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Tâches récentes</CardTitle>
              <CardDescription>
                {tasks.filter(t => t.status === "done").length}/{tasks.length} complétées
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/planning">Voir tout <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading && <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>}
            {!loading && tasks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune tâche — <Link href="/student/planning" className="text-primary underline">Planifiez votre première tâche</Link>
              </p>
            )}
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30">
                {task.status === "done"
                  ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  : <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </p>
                  {task.startTime && <p className="text-xs text-muted-foreground">{task.startTime}</p>}
                </div>
                {task.priority && (
                  <Badge className={`text-xs ${priorityColor[task.priority]}`}>
                    {task.priority === "HIGH" ? "Urgent" : task.priority === "MEDIUM" ? "Moyen" : "Faible"}
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Raccourcis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Accès rapide</CardTitle>
            <CardDescription>Vos outils principaux</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { href: "/student/cv-builder", icon: FileText, label: "CV Builder", desc: "Créer ou modifier votre CV", color: "text-primary bg-primary/10" },
              { href: "/student/career-mirror", icon: Brain, label: "Career Mirror", desc: "Analyse IA de votre profil", color: "text-accent bg-accent/10" },
              { href: "/student/mentoring", icon: Users, label: "Trouver un Mentor", desc: "Connectez-vous avec des pros", color: "text-chart-3 bg-chart-3/10" },
              { href: "/student/planning", icon: Calendar, label: "Mon Planning", desc: "Organiser votre semaine", color: "text-chart-4 bg-chart-4/10" },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors group">
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
