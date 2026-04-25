"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Calendar, Plus, Clock, Loader2, Trash2, CheckCircle2, 
  AlertCircle, Video, Search, Filter 
} from "lucide-react"
import { schedulesApi, Schedule } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

const statusConfig: Record<string, { color: string; label: string; icon: any }> = {
  pending: { color: "bg-blue-100 text-blue-700", label: "Planifiée", icon: Calendar },
  done: { color: "bg-green-100 text-green-700", label: "Complétée", icon: CheckCircle2 },
  cancelled: { color: "bg-red-100 text-red-700", label: "Annulée", icon: AlertCircle },
}

interface SessionForm {
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  type: "course" | "revision" | "deadline" | "other"
  priority: "HIGH" | "MEDIUM" | "LOW"
  studentId?: number
}

export default function MentorSessionsPage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<SessionForm>({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "course",
    priority: "MEDIUM",
    studentId: undefined,
  })

  const fetchSessions = () => {
    if (!user) return
    setLoading(true)
    setError(null)
    schedulesApi.getByUser(user.id)
      .then((data) => {
        setSessions(data || [])
      })
      .catch(() => setError("Impossible de charger les sessions. Vérifiez que le backend est lancé sur le port 8081."))
      .finally(() => setLoading(false))
  }

  useEffect(() => { 
    fetchSessions() 
  }, [user])

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = (session.title || "").toLowerCase().includes(search.toLowerCase()) ||
                          (session.description || "").toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || session.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSave = async () => {
    if (!user || !form.title || !form.date || !form.startTime || !form.endTime) {
      alert("Veuillez remplir tous les champs requis")
      return
    }
    
    setSaving(true)
    try {
      // Combine date and time into ISO format
      const startDateTime = `${form.date}T${form.startTime}:00`
      const endDateTime = `${form.date}T${form.endTime}:00`
      
      const newSession: Schedule = {
        title: form.title,
        description: form.description,
        startTime: startDateTime,
        endTime: endDateTime,
        type: form.type as any,
        priority: form.priority,
        status: "pending",
        studentId: form.studentId,
      }
      
      const created = await schedulesApi.create(user.id, newSession)
      setSessions([created, ...sessions])
      setShowAdd(false)
      setForm({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        type: "course",
        priority: "MEDIUM",
        studentId: undefined,
      })
    } catch (e: any) {
      alert("Erreur: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette session?")) return
    try {
      await schedulesApi.delete(id)
      setSessions(sessions.filter(s => s.id !== id))
    } catch (e: any) {
      alert("Erreur suppression: " + e.message)
    }
  }

  const handleStatusChange = async (session: Schedule, newStatus: "pending" | "done" | "cancelled") => {
    try {
      const updated = await schedulesApi.update(session.id!, {
        ...session,
        status: newStatus,
      })
      setSessions(sessions.map(s => s.id === session.id ? updated : s))
    } catch (e: any) {
      alert("Erreur: " + e.message)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Mes Sessions de Mentorat</h1>
          <p className="text-muted-foreground">Gérez vos sessions et rendez-vous avec les étudiants</p>
        </div>
        <Button className="shadow-lg shadow-primary/25" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4 mr-2" />Nouvelle session
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par titre ou description..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">Planifiées</option>
            <option value="done">Complétées</option>
            <option value="cancelled">Annulées</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-primary" />
              <p className="text-muted-foreground">Chargement des sessions...</p>
            </CardContent>
          </Card>
        )}

        {!loading && filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground">Aucune session trouvée</p>
              <p className="text-sm text-muted-foreground mt-1">
                {sessions.length === 0 ? "Créez votre première session!" : "Modifiez les filtres pour voir d'autres sessions"}
              </p>
            </CardContent>
          </Card>
        ) : (
          !loading && filteredSessions.map((session) => {
            const cfg = statusConfig[session.status || "PENDING"]
            const cfg_icon = cfg.icon
            return (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{session.title}</h3>
                        <Badge className={cfg.color} variant="secondary">
                          {cfg.label}
                        </Badge>
                      </div>
                      {session.description && (
                        <p className="text-sm text-muted-foreground mb-2">{session.description}</p>
                      )}
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {session.startTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(session.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                            {session.endTime && ` - ${new Date(session.endTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`}
                          </div>
                        )}
                        {session.type && (
                          <div className="flex items-center gap-1">
                            <Video className="w-3.5 h-3.5" />
                            {session.type === "course" ? "Cours" : session.type === "revision" ? "Révision" : session.type === "deadline" ? "Deadline" : "Autre"}
                          </div>
                        )}
                        {session.priority && (
                          <div className="flex items-center gap-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              session.priority === "HIGH" ? "bg-red-100 text-red-700" :
                              session.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-700" :
                              "bg-green-100 text-green-700"
                            }`}>
                              {session.priority === "HIGH" ? "Urgent" : session.priority === "MEDIUM" ? "Moyen" : "Faible"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 lg:ml-auto flex-shrink-0">
                      {session.status === "pending" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusChange(session, "done")}
                        >
                          Confirmer
                        </Button>
                      )}
                      {session.status !== "cancelled" && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleStatusChange(session, "cancelled")}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          Annuler
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(session.id!)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Add Session Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvelle session de mentorat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre de la session *</Label>
              <Input
                id="title"
                placeholder="Ex: Préparation entretien technique"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Ex: Révision de concepts de base"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="studentId">ID de l'étudiant</Label>
              <Input
                id="studentId"
                type="number"
                placeholder="ID de l'étudiant à mentorer"
                value={form.studentId || ""}
                onChange={(e) => setForm({ ...form, studentId: e.target.value ? parseInt(e.target.value) : undefined })}
              />
            </div>
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="startTime">Heure début *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">Heure fin *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="type">Type de session</Label>
              <select
                id="type"
                className="w-full px-3 py-2 border rounded-lg"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
              >
                <option value="course">Cours</option>
                <option value="revision">Révision</option>
                <option value="deadline">Deadline</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <Label htmlFor="priority">Priorité</Label>
              <select
                id="priority"
                className="w-full px-3 py-2 border rounded-lg"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
              >
                <option value="LOW">Faible</option>
                <option value="MEDIUM">Moyen</option>
                <option value="HIGH">Urgent</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowAdd(false)}>
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Créer la session"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
