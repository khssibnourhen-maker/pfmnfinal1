"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/context/AuthContext"
import {
  Users, Search, Filter, MessageSquare, Calendar,
  Star, TrendingUp, CheckCircle2, Clock, ArrowRight, Loader2
} from "lucide-react"
import Link from "next/link"
import { mentorsApi, mentorMatchesApi, MentorMatch, Mentor } from "@/lib/api"

interface StudentRequest {
  id: string
  studentName: string
  studentId: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-amber-100 text-amber-700 border-amber-200" },
  accepted: { label: "Accepté", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  declined: { label: "Refusé", className: "bg-rose-100 text-rose-700 border-rose-200" },
}

export default function MentorStudentsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "declined">("all")
  const [requests, setRequests] = useState<StudentRequest[]>([])
  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoading || !user?.id) return

    const fetchMentorAndRequests = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get mentor profile
        const mentorData = await mentorsApi.getByUserId(user.id)
        setMentor(mentorData)
        
        // Get all mentoring requests for this mentor
        const matches = await mentorMatchesApi.getByMentor(mentorData.id!)
        
        // Transform matches to student requests
        const studentRequests = matches.map((match) => ({
          id: match.id || '',
          studentName: `${match.student?.firstName || ''} ${match.student?.lastName || ''}`.trim(),
          studentId: match.student?.id || '',
          status: match.status || 'pending',
          createdAt: match.createdAt || '',
        }))
        
        setRequests(studentRequests)
      } catch (err: any) {
        console.error('Error fetching mentor data:', err)
        setError('Impossible de charger les demandes. ' + (err.message || ''))
      } finally {
        setLoading(false)
      }
    }

    fetchMentorAndRequests()
  }, [isLoading, user?.id])

  const filtered = requests.filter(r => {
    const matchSearch = r.studentName.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || r.status === filter
    return matchSearch && matchFilter
  })

  const handleUpdateStatus = async (requestId: string, newStatus: 'accepted' | 'declined') => {
    setUpdating(requestId)
    try {
      const updated = await mentorMatchesApi.updateStatus(requestId, newStatus)
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: updated.status || newStatus } : req))
      )
    } catch (err: any) {
      alert('Erreur: ' + err.message)
    } finally {
      setUpdating(null)
    }
  }

  const handleMessageClick = (studentId: string) => {
    router.push(`/mentor/messages?studentId=${studentId}`)
  }

  const handleSessionClick = (studentId: string) => {
    // Navigate to planning page or create a session
    router.push(`/mentor/planning?studentId=${studentId}`)
  }

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    declined: "bg-red-100 text-red-700",
  }

  const totalRequests = requests.length
  const acceptedCount = requests.filter(r => r.status === 'accepted').length
  const pendingCount = requests.filter(r => r.status === 'pending').length

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Users className="w-7 h-7 text-accent" />
            Demandes de Mentorat
          </h1>
          <p className="text-muted-foreground">
            {loading ? "Chargement..." : `${filtered.length} demande(s) — ${acceptedCount} acceptée(s)`}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un étudiant..."
            className="pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "accepted", "declined"] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className={filter === f ? "bg-accent hover:bg-accent/90" : ""}
            >
              {f === "all" ? "Tous" : f === "pending" ? "En attente" : f === "accepted" ? "Acceptées" : "Refusées"}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Demandes totales", value: totalRequests, icon: Users, color: "text-accent bg-accent/10" },
          { label: "En attente", value: pendingCount, icon: Clock, color: "text-amber-600 bg-amber-50" },
          { label: "Acceptées", value: acceptedCount, icon: CheckCircle2, color: "text-green-600 bg-green-50" },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-bold">{loading ? "-" : stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Requests Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Aucune demande trouvée</p>
            </div>
          ) : (
            filtered.map(request => {
              const status = statusConfig[request.status]
              const isUpdating = updating === request.id
              const isPending = request.status === 'pending'
              
              return (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-accent/10 text-accent font-semibold">
                            {request.studentName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-sm">{request.studentName}</h3>
                          <p className="text-xs text-muted-foreground">
                            {request.createdAt ? new Date(request.createdAt).toLocaleDateString('fr-FR') : ''}
                          </p>
                        </div>
                      </div>
                      <Badge className={`text-xs border-0 ${status.className}`}>
                        {status.label}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {isPending && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(request.id, 'accepted')}
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                            )}
                            Accepter
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(request.id, 'declined')}
                          >
                            Refuser
                          </Button>
                        </div>
                      )}
                      
                      {request.status === 'accepted' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleMessageClick(request.studentId)}
                          >
                            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                            Message
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 bg-accent hover:bg-accent/90"
                            onClick={() => handleSessionClick(request.studentId)}
                          >
                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                            Session
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
