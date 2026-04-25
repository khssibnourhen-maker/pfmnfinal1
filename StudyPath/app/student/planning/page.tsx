"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Target,
  Sparkles,
  Loader2,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { schedulesApi, Schedule } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

const typeConfig: Record<string, { icon: any; label: string }> = {
  course: { icon: BookOpen, label: "Etude" },
  revision: { icon: Target, label: "Revision" },
  deadline: { icon: Calendar, label: "Deadline" },
  other: { icon: Sparkles, label: "Autre" },
}

const priorityBadge: Record<string, string> = {
  HIGH: "bg-rose-100 text-rose-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW: "bg-emerald-100 text-emerald-700",
}

const priorityLabel: Record<string, string> = {
  HIGH: "Urgent",
  MEDIUM: "Moyen",
  LOW: "Faible",
}

const pastelColors = [
  { id: "sky", label: "Bleu", card: "bg-sky-100 border-sky-200", dot: "bg-sky-400" },
  { id: "mint", label: "Menthe", card: "bg-emerald-100 border-emerald-200", dot: "bg-emerald-400" },
  { id: "peach", label: "Peche", card: "bg-orange-100 border-orange-200", dot: "bg-orange-400" },
  { id: "lavender", label: "Lavande", card: "bg-violet-100 border-violet-200", dot: "bg-violet-400" },
  { id: "pink", label: "Rose", card: "bg-pink-100 border-pink-200", dot: "bg-pink-400" },
  { id: "butter", label: "Jaune", card: "bg-yellow-100 border-yellow-200", dot: "bg-yellow-400" },
]

const getPastel = (color?: string) =>
  pastelColors.find((item) => item.id === color) || pastelColors[0]

const formatDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

const compareTasks = (a: Schedule, b: Schedule) => {
  const dateCompare = (a.taskDate || "").localeCompare(b.taskDate || "")
  if (dateCompare !== 0) return dateCompare

  const timeCompare = (a.startTime || "99:99").localeCompare(b.startTime || "99:99")
  if (timeCompare !== 0) return timeCompare

  return (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
}

export default function PlanningPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(() => formatDateKey(new Date()))

  const [form, setForm] = useState<Partial<Schedule>>({
    title: "",
    description: "",
    type: "course",
    priority: "MEDIUM",
    taskDate: formatDateKey(new Date()),
    startTime: "",
    endTime: "",
    status: "pending",
    color: pastelColors[0].id,
  })

  const fetchTasks = () => {
    if (!user) return
    setLoading(true)
    schedulesApi.getByUser(user.id)
      .then((data) => setTasks((data || []).slice().sort(compareTasks)))
      .catch(() => setError("Impossible de charger le planning. Verifie que le backend est lance sur le port 8081."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchTasks()
  }, [user])

  useEffect(() => {
    setForm((prev) => ({ ...prev, taskDate: prev.taskDate || selectedDate }))
  }, [selectedDate])

  const tasksByDate = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const key = task.taskDate || ""
      if (!key) return acc
      if (!acc[key]) acc[key] = []
      acc[key].push(task)
      acc[key].sort(compareTasks)
      return acc
    }, {} as Record<string, Schedule[]>)
  }, [tasks])

  const selectedTasks = useMemo(() => {
    return (tasksByDate[selectedDate] || []).slice().sort(compareTasks)
  }, [selectedDate, tasksByDate])

  const completedCount = tasks.filter((task) => task.status === "done").length

  const monthLabel = currentMonth.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  })

  const monthGrid = useMemo(() => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const start = new Date(firstDay)
    const dayOffset = (firstDay.getDay() + 6) % 7
    start.setDate(firstDay.getDate() - dayOffset)

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start)
      date.setDate(start.getDate() + index)
      const key = formatDateKey(date)
      return {
        key,
        date,
        inMonth: date.getMonth() === currentMonth.getMonth(),
        isToday: key === formatDateKey(new Date()),
        isSelected: key === selectedDate,
        count: (tasksByDate[key] || []).length,
        colors: Array.from(new Set((tasksByDate[key] || []).slice(0, 3).map((task) => getPastel(task.color).dot))),
      }
    })
  }, [currentMonth, selectedDate, tasksByDate])

  const handleSave = async () => {
    if (!user || !form.title || !form.taskDate) return

    setSaving(true)
    try {
      const dayTasks = tasksByDate[form.taskDate] || []
      const created = await schedulesApi.create(user.id, {
        ...form,
        sortOrder: dayTasks.length,
      } as Schedule)

      setTasks((prev) => [...prev, created].slice().sort(compareTasks))
      setSelectedDate(created.taskDate || selectedDate)
      setShowAdd(false)
      setForm({
        title: "",
        description: "",
        type: "course",
        priority: "MEDIUM",
        taskDate: selectedDate,
        startTime: "",
        endTime: "",
        status: "pending",
        color: pastelColors[0].id,
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
      setTasks((prev) => prev.map((item) => item.id === task.id ? updated : item).sort(compareTasks))
    } catch (e: any) {
      alert("Erreur mise a jour: " + e.message)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await schedulesApi.delete(id)
      setTasks((prev) => prev.filter((task) => task.id !== id).sort(compareTasks))
    } catch (e: any) {
      alert("Erreur suppression: " + e.message)
    }
  }

  const moveTask = async (task: Schedule, direction: "up" | "down") => {
    const dayTasks = (tasksByDate[task.taskDate || ""] || []).slice().sort(compareTasks)
    const currentIndex = dayTasks.findIndex((item) => item.id === task.id)
    if (currentIndex === -1) return

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= dayTasks.length) return

    const reordered = dayTasks.slice()
    const [moved] = reordered.splice(currentIndex, 1)
    reordered.splice(targetIndex, 0, moved)

    try {
      const updates = await Promise.all(
        reordered.map((item, index) =>
          schedulesApi.update(item.id!, { ...item, sortOrder: index })
        )
      )

      setTasks((prev) => {
        const next = prev.map((item) => updates.find((updated) => updated.id === item.id) || item)
        return next.sort(compareTasks)
      })
    } catch (e: any) {
      alert("Erreur ordre des taches: " + e.message)
    }
  }

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Mon Planning</h1>
          <p className="text-muted-foreground">Ajoute tes taches, place-les dans le calendrier et organise-les par jour.</p>
        </div>
        <Button className="shadow-lg shadow-primary/25" onClick={() => setShowAdd(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une tache
        </Button>
      </div>

      {error && <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base capitalize">{monthLabel}</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>Clique sur un jour pour voir les taches planifiees.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                <div key={day} className="py-1">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {monthGrid.map((day) => (
                <button
                  key={day.key}
                  onClick={() => setSelectedDate(day.key)}
                  className={`min-h-[64px] rounded-xl border p-1.5 text-left transition-colors ${
                    day.isSelected
                      ? "border-primary bg-primary/10"
                      : day.inMonth
                        ? "border-border hover:bg-muted/60"
                        : "border-transparent bg-muted/20 text-muted-foreground/40"
                  }`}
                >
                  <div className={`text-xs font-medium ${day.isToday ? "text-primary" : ""}`}>
                    {day.date.getDate()}
                  </div>
                  {day.count > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {day.colors.map((dotColor) => (
                          <span key={`${day.key}-${dotColor}`} className={`h-2 w-2 rounded-full ${dotColor}`} />
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground">{day.count} tache{day.count > 1 ? "s" : ""}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-base">Taches du {new Date(`${selectedDate}T00:00:00`).toLocaleDateString("fr-FR")}</CardTitle>
                <CardDescription>{completedCount}/{tasks.length} taches completees au total</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setForm((prev) => ({ ...prev, taskDate: selectedDate }))
                  setShowAdd(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter ce jour
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {!loading && selectedTasks.length === 0 && (
              <div className="py-10 text-center text-muted-foreground">
                <Calendar className="mx-auto mb-2 h-10 w-10 opacity-30" />
                <p className="text-sm">Aucune tache pour cette date</p>
                <p className="mt-1 text-xs">Ajoute une tache et elle apparaitra aussi dans le calendrier.</p>
              </div>
            )}

            {selectedTasks.map((task, index) => {
              const typeKey = (task.type ?? "other").toLowerCase()
              const cfg = typeConfig[typeKey] ?? typeConfig.other
              const Icon = cfg.icon
              const done = task.status === "done"
              const priorityKey = (task.priority ?? "MEDIUM").toUpperCase()
              const pastel = getPastel(task.color)

              return (
                <div
                  key={task.id}
                  className={`rounded-2xl border p-4 transition-all ${pastel.card} ${done ? "opacity-70" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={done}
                      onCheckedChange={() => handleToggle(task)}
                      className="mt-1"
                    />

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="rounded-md bg-white/70 p-1.5">
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <p className={`text-sm font-semibold ${done ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </p>
                          </div>
                          {task.description && (
                            <p className="text-sm text-slate-700">{task.description}</p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className="border-0 bg-white/80 text-slate-700">{cfg.label}</Badge>
                          {task.priority && (
                            <Badge className={`border-0 ${priorityBadge[priorityKey] ?? ""}`}>
                              {priorityLabel[priorityKey] ?? task.priority}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700">
                          {task.startTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.startTime}{task.endTime ? ` - ${task.endTime}` : ""}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {task.taskDate}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => moveTask(task, "up")}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => moveTask(task, "down")}
                            disabled={index === selectedTasks.length - 1}
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(task.id!)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter une tache</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input
                placeholder="Ex: Reviser React hooks"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Ajoute un peu de contexte si tu veux"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={form.taskDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, taskDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.type as string}
                  onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as any }))}
                >
                  <option value="course">Etude</option>
                  <option value="revision">Revision</option>
                  <option value="deadline">Deadline</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Heure debut</Label>
                <Input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Heure fin</Label>
                <Input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Priorite</Label>
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.priority as string}
                  onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as any }))}
                >
                  <option value="HIGH">Urgent</option>
                  <option value="MEDIUM">Moyen</option>
                  <option value="LOW">Faible</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Couleur pastel</Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {pastelColors.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, color: color.id }))}
                      className={`h-9 w-9 rounded-full border-2 ${color.dot} ${
                        form.color === color.id ? "border-slate-900" : "border-transparent"
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>
                Annuler
              </Button>
              <Button className="flex-1" onClick={handleSave} disabled={!form.title || !form.taskDate || saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ajout...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
