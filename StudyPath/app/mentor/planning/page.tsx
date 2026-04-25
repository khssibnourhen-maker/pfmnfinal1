"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Calendar, Plus, ChevronLeft, ChevronRight, Clock,
  BookOpen, Target, Sparkles, Loader2, Trash2
} from "lucide-react"
import { schedulesApi, Schedule } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

const typeConfig: Record<string, { icon: any; color: string; label: string }> = {
  course: { icon: BookOpen, color: "text-primary bg-primary/10", label: "Cours" },
  revision: { icon: Target, color: "text-accent bg-accent/10", label: "Révision" },
  deadline: { icon: Calendar, color: "text-chart-3 bg-chart-3/10", label: "Deadline" },
  other: { icon: Sparkles, color: "text-muted-foreground bg-muted", label: "Autre" },
}

const priorityBadge: Record<string, string> = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700",
}

const priorityLabel: Record<string, string> = {
  HIGH: "Urgent", MEDIUM: "Moyen", LOW: "Faible",
}

export default function MentorPlanningPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<Partial<Schedule>>({
    title: "", description: "", type: "course" as any,
    priority: "MEDIUM" as any, startTime: "", endTime: "", status: "pending" as any,
  })

  const fetchTasks = () => {
    console.log(user)
    if (!user) return
    setLoading(true)
    schedulesApi.getByUser(user.id)
      .then((data) => setTasks(data || []))
      .catch(() => setError("Impossible de charger le planning. Vérifiez que le backend est lancé sur le port 8081."))
      .finally(() => setLoading(false))
  }

  useEffect(() => { 
    fetchTasks() 
  }, [user])

  const handleSave = async () => {
    if (!user || !form.title) return
    setSaving(true)
    try {
      const created = await schedulesApi.create(user.id, form as Schedule)
      setTasks((prev) => [created, ...prev])
      setShowAdd(false)
      setForm({
        title: "", description: "", type: "course" as any,
        priority: "MEDIUM" as any, startTime: "", endTime: "", status: "pending" as any,
      })
    } catch (e: any) {
      alert("Erreur: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (task: Schedule) => {
    try {
      const newStatus = task.status === "done" ? "pending" : "done"
      const updated = await schedulesApi.update(task.id!, { ...task, status: newStatus })
      setTasks((prev) => prev.map((t) => t.id === task.id ? updated : t))
    } catch (e: any) {
      alert("Erreur mise à jour: " + e.message)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await schedulesApi.delete(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (e: any) {
      alert("Erreur suppression: " + e.message)
    }
  }

  const today = new Date()
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Mon Planning</h1>
          <p className="text-muted-foreground">Gérez vos sessions de mentorat et vos rendez-vous</p>
        </div>
        <Button className="shadow-lg shadow-primary/25" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4 mr-2" />Ajouter un rendez-vous
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendrier */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {today.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {weekDays.map((d) => (
                <div key={d} className="text-xs text-muted-foreground font-medium py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 2
                const isToday = day === today.getDate()
                return (
                  <button key={i} className={`text-xs py-1.5 rounded-md transition-colors ${day < 1 || day > 30 ? "text-muted-foreground/30" :
                      isToday ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted"
                    }`}>
                    {day >= 1 && day <= 30 ? day : ""}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tâches */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Rendez-vous planifiés</CardTitle>
            <CardDescription>
              {tasks.filter(t => t.status === "CONFIRMED").length}/{tasks.length} confirmés
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
            {!loading && tasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucun rendez-vous planifié</p>
                <p className="text-xs mt-1">Cliquez sur "Ajouter un rendez-vous" pour commencer</p>
              </div>
            )}
            {tasks.map((task) => {
              const typeKey = (task.type ?? "other").toLowerCase()
              const cfg = typeConfig[typeKey] ?? typeConfig["other"]
              const Icon = cfg.icon
              const done = task.status === "done"
              const priorityKey = (task.priority ?? "MEDIUM").toUpperCase()
              return (
                <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${done ? "opacity-60" : "hover:bg-muted/30"
                  }`}>
                  <Checkbox
                    checked={done}
                    onCheckedChange={() => handleToggle(task)}
                    className="mt-0.5"
                  />
                  <div className={`p-1.5 rounded-md flex-shrink-0 ${cfg.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${done ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </p>
                    {task.startTime && (
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.startTime} {task.endTime && `- ${task.endTime}`}
                      </p>
                    )}
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                    )}
                  </div>
                  {task.priority && (
                    <Badge className={`flex-shrink-0 ${priorityBadge[(task.priority ?? "medium").toLowerCase()]}`}>
                      {priorityLabel[(task.priority ?? "medium").toLowerCase()]}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(task.id!)}
                    className="flex-shrink-0 h-7 w-7 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Add Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un rendez-vous</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                placeholder="Ex: Session mentorat - Jean"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Ex: Révision CV et lettre de motivation"
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                className="w-full px-3 py-2 border rounded-lg"
                value={form.type || "course"}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
              >
                <option value="course">Cours</option>
                <option value="revision">Révision</option>
                <option value="deadline">Deadline</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="startTime">Heure début</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={form.startTime || ""}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">Heure fin</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={form.endTime || ""}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="priority">Priorité</Label>
              <select
                id="priority"
                className="w-full px-3 py-2 border rounded-lg"
                value={form.priority || "MEDIUM"}
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
              <Button onClick={handleSave} disabled={saving || !form.title}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ajout...
                  </>
                ) : (
                  "Ajouter"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
