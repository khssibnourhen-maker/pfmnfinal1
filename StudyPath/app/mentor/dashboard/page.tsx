"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  Star,
  CheckCircle2,
  Eye,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { schedulesApi, cvsApi, Schedule } from "@/lib/api"
import { AddCommentDialog } from "@/components/comments/add-comment-dialog"

export default function MentorDashboard() {
  const { user } = useAuth()
  const [upcomingSessions, setUpcomingSessions] = useState<Schedule[]>([])
  const [pendingCVs, setPendingCVs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalStudents: 0,
    pendingCVs: 0,
    unreadMessages: 0
  })

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch mentor's sessions
        const sessions = await schedulesApi.getByUser(user.id).catch(() => [])
        const filteredSessions = (sessions || []).slice(0, 3)
        setUpcomingSessions(filteredSessions)

        // Fetch CVs for this mentor
        const cvs = await cvsApi.getByUser(user.id).catch(() => [])
        setPendingCVs((cvs || []).slice(0, 3))

        // Update stats
        setStats({
          totalSessions: sessions?.length || 0,
          totalStudents: new Set((sessions || []).map(s => s.user?.id)).size,
          pendingCVs: cvs?.length || 0,
          unreadMessages: 0
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const dashboardStats = [
    { label: "Etudiants actifs", value: String(stats.totalStudents), change: "", icon: Users, color: "text-accent", bgColor: "bg-accent/10" },
    { label: "CV a analyser", value: String(stats.pendingCVs), change: "", icon: FileText, color: "text-primary", bgColor: "bg-primary/10" },
    { label: "Sessions ce mois", value: String(stats.totalSessions), change: "", icon: Calendar, color: "text-chart-3", bgColor: "bg-chart-3/10" },
    { label: "Messages non lus", value: "0", change: "", icon: MessageSquare, color: "text-chart-4", bgColor: "bg-chart-4/10" },
  ]

  const getInitials = (session: Schedule) => {
    const firstName = session.user?.firstName?.[0] || "S"
    const lastName = session.user?.lastName?.[0] || "T"
    return (firstName + lastName).toUpperCase()
  }

  const formatDateTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime)
      return {
        date: date.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short" }),
        time: date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      }
    } catch {
      return { date: "—", time: "—" }
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Bonjour, {user?.firstName || "Mentor"}</h1>
          <p className="text-muted-foreground">Voici un apercu de votre activite de mentorat</p>
        </div>
        <div className="flex gap-3">
          <AddCommentDialog />
          <Button variant="outline" asChild>
            <Link href="/mentor/cv-review">
              <FileText className="w-4 h-4 mr-2" />
              CV a analyser (5)
            </Link>
          </Button>
          <Button className="shadow-lg shadow-accent/25 bg-accent hover:bg-accent/90" asChild>
            <Link href="/mentor/sessions">
              <Calendar className="w-4 h-4 mr-2" />
              Nouvelle session
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.change && (
                      <Badge variant="secondary" className="text-xs">
                        {stat.change}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                Sessions a venir
              </CardTitle>
              <CardDescription>Vos prochains rendez-vous avec les etudiants</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/mentor/sessions">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
              </div>
            ) : upcomingSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune session planifiée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingSessions.map((session) => {
                  const dt = formatDateTime(session.startTime || "")
                  return (
                    <div
                      key={session.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-accent/50 transition-colors"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-accent/10 text-accent font-semibold">
                          {getInitials(session)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{session.user?.firstName} {session.user?.lastName}</h4>
                          <Badge 
                            variant={session.status === "done" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {session.status === "done" ? "Completee" : "En attente"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{session.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{dt.date}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          {dt.time}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending CVs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              CV en attente
            </CardTitle>
            <CardDescription>CV a analyser et commenter</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
            ) : pendingCVs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Aucun CV en attente
              </div>
            ) : (
              <div className="space-y-3">
                {pendingCVs.map((cv) => (
                  <div
                    key={cv.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {cv.user?.firstName?.[0]}{cv.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{cv.user?.firstName} {cv.user?.lastName}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{cv.title || "CV"}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/mentor/cv-review">
                Voir tous les CV
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Students Progress - Removed hardcoded data, shows session count instead */}
      {upcomingSessions.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-chart-3" />
                Etudiants en suivi
              </CardTitle>
              <CardDescription>Sessions actives avec vos mentores</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/mentor/sessions">Voir tous</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start gap-4 p-3 rounded-lg border border-border hover:border-chart-3/50 transition-all"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-chart-3/10 text-chart-3 font-semibold text-sm">
                      {getInitials(session)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">{session.user?.firstName} {session.user?.lastName}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{session.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {session.status === "done" ? "Completee" : "En attente"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
              <FileText className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">Analyser un CV</h3>
              <p className="text-sm text-muted-foreground">{stats.pendingCVs} en attente</p>
            </div>
            <ArrowRight className="w-5 h-5 text-accent ml-auto" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
              <Calendar className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Planifier une session</h3>
              <p className="text-sm text-muted-foreground">{stats.totalSessions} sessions</p>
            </div>
            <ArrowRight className="w-5 h-5 text-primary ml-auto" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-chart-3/20 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-chart-3" />
            </div>
            <div>
              <h3 className="font-semibold">Etudiants actifs</h3>
              <p className="text-sm text-muted-foreground">{stats.totalStudents} etudiants</p>
            </div>
            <ArrowRight className="w-5 h-5 text-chart-3 ml-auto" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
