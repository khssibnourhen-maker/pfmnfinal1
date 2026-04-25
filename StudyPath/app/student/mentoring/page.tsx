"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  Search,
  Star,
  MessageSquare,
  Calendar,
  Briefcase,
  CheckCircle2,
  Loader2,
  Send,
  Clock,
} from "lucide-react"
import { mentorsApi, mentorMatchesApi, messagesApi, Mentor, MentorMatch, Message } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

type ConversationItem = {
  mentorId: string
  mentor: Mentor
  match?: MentorMatch
  messages: Message[]
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-amber-100 text-amber-700 border-amber-200" },
  accepted: { label: "Accepte", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  declined: { label: "Refuse", className: "bg-rose-100 text-rose-700 border-rose-200" },
  completed: { label: "Termine", className: "bg-slate-100 text-slate-700 border-slate-200" },
}

function getInitials(mentor?: Mentor) {
  return `${mentor?.user?.firstName?.[0] ?? ""}${mentor?.user?.lastName?.[0] ?? "M"}`.toUpperCase()
}

function formatTime(dateStr?: string) {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
}

export default function MentoringPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [matches, setMatches] = useState<MentorMatch[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [requestingMentorId, setRequestingMentorId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoading || !user?.id) return

    setLoading(true)
    Promise.all([
      mentorsApi.getAvailable().catch(() => []),
      mentorMatchesApi.getByStudent(user.id).catch(() => []),
      messagesApi.getReceived(user.id).catch(() => []),
      messagesApi.getSent(user.id).catch(() => []),
    ])
      .then(([mentorRows, matchRows, received, sent]) => {
        const allMessages = [...received, ...sent].sort(
          (a, b) => new Date(a.sentAt || "").getTime() - new Date(b.sentAt || "").getTime()
        )
        setMentors(mentorRows || [])
        setMatches(matchRows || [])
        setMessages(allMessages)
      })
      .catch(() => setError("Impossible de charger l'interface mentorat. Verifie que le backend est lance sur le port 8081."))
      .finally(() => setLoading(false))
  }, [isLoading, user?.id])

  const mentorsByUserId = useMemo(() => {
    return mentors.reduce((acc, mentor) => {
      if (mentor.user?.id) acc[mentor.user.id] = mentor
      return acc
    }, {} as Record<string, Mentor>)
  }, [mentors])

  const requestedMentorIds = useMemo(() => {
    return new Set(matches.map((match) => match.mentor?.id).filter(Boolean) as string[])
  }, [matches])

  const filteredMentors = useMemo(() => {
    const query = search.toLowerCase()
    return mentors.filter((mentor) => {
      const name = `${mentor.user?.firstName ?? ""} ${mentor.user?.lastName ?? ""}`.toLowerCase()
      const expertise = (mentor.expertise || "").toLowerCase()
      return name.includes(query) || expertise.includes(query)
    })
  }, [mentors, search])

  const conversations = useMemo(() => {
    const map = new Map<string, ConversationItem>()

    matches.forEach((match) => {
      const mentor = match.mentor
      if (!mentor?.id) return
      map.set(mentor.id, {
        mentorId: mentor.id,
        mentor,
        match,
        messages: [],
      })
    })

    messages.forEach((message) => {
      const otherUser = message.sender?.id === user?.id ? message.receiver : message.sender
      if (!otherUser?.id) return

      const mentor = mentorsByUserId[otherUser.id] || matches.find((item) => item.mentor?.user?.id === otherUser.id)?.mentor
      if (!mentor?.id) return

      if (!map.has(mentor.id)) {
        map.set(mentor.id, {
          mentorId: mentor.id,
          mentor,
          match: matches.find((item) => item.mentor?.id === mentor.id),
          messages: [],
        })
      }

      map.get(mentor.id)!.messages.push(message)
    })

    return Array.from(map.values()).sort((a, b) => {
      const aLast = a.messages[a.messages.length - 1]?.sentAt || a.match?.createdAt || ""
      const bLast = b.messages[b.messages.length - 1]?.sentAt || b.match?.createdAt || ""
      return new Date(bLast).getTime() - new Date(aLast).getTime()
    })
  }, [matches, mentorsByUserId, messages, user?.id])

  const selectedConversation =
    conversations.find((conversation) => conversation.mentorId === selectedConversationId) || null

  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversationId(conversations[0].mentorId)
    }
  }, [conversations, selectedConversation])

  useEffect(() => {
    if (!selectedConversation || !user?.id) return

    const unread = selectedConversation.messages.filter(
      (message) => message.receiver?.id === user.id && !message.isRead && message.id
    )

    if (unread.length === 0) return

    Promise.all(unread.map((message) => messagesApi.markAsRead(message.id!)))
      .then((updated) => {
        setMessages((prev) =>
          prev.map((message) => updated.find((item) => item.id === message.id) || message)
        )
      })
      .catch(() => {})
  }, [selectedConversation, user?.id])

  const handleRequest = async (mentor: Mentor) => {
    if (!user?.id || !mentor.id) return

    setRequestingMentorId(mentor.id)
    try {
      const created = await mentorMatchesApi.create(user.id, mentor.id)
      setMatches((prev) => {
        const exists = prev.some((item) => item.id === created.id)
        return exists ? prev : [created, ...prev]
      })
      setSelectedConversationId(mentor.id)
    } catch (e: any) {
      alert("Erreur: " + e.message)
    } finally {
      setRequestingMentorId(null)
    }
  }

  const handleOpenConversation = (mentorId?: string) => {
    if (!mentorId) return
    // Navigate to the messages page with the mentor ID as a query parameter
    router.push(`/student/messages?mentorId=${mentorId}`)
  }

  const handleMessageClick = (mentor: Mentor) => {
    if (!mentor.id) return
    // Simply navigate to messages page - the status check will happen there
    handleOpenConversation(mentor.id)
  }

  const handleSendMessage = async () => {
    const receiverId = selectedConversation?.mentor.user?.id
    if (!user?.id || !receiverId || !newMessage.trim()) return

    if (selectedConversation.match?.status !== "accepted") {
      alert("Vous ne pouvez envoyer un message que si la demande est acceptee.")
      return
    }

    setSending(true)
    try {
      const sent = await messagesApi.send(user.id, receiverId, newMessage.trim())
      setMessages((prev) => [...prev, sent])
      setNewMessage("")
    } catch (e: any) {
      alert("Erreur envoi: " + e.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Trouver un Mentor</h1>
        <p className="text-muted-foreground">
          Une seule interface etudiant pour rechercher des mentors, suivre tes demandes et discuter avec eux.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      )}

      <Tabs defaultValue="discover" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[560px]">
          <TabsTrigger value="discover">Trouver</TabsTrigger>
          <TabsTrigger value="requests">Demandes</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou expertise..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="mr-3 h-8 w-8 animate-spin text-primary" />
              <span className="text-muted-foreground">Chargement des mentors...</span>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredMentors.length === 0 ? (
                <div className="col-span-full py-16 text-center text-muted-foreground">
                  <Users className="mx-auto mb-3 h-12 w-12 opacity-30" />
                  <p>Aucun mentor trouve</p>
                </div>
              ) : (
                filteredMentors.map((mentor) => {
                  const match = matches.find((item) => item.mentor?.id === mentor.id)
                  const status = statusConfig[match?.status || "pending"]
                  const alreadyRequested = requestedMentorIds.has(mentor.id || "")

                  return (
                    <Card key={mentor.id} className="transition-shadow hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                              {getInitials(mentor)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="truncate text-base">
                              {mentor.user?.firstName} {mentor.user?.lastName}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {mentor.yearsOfExperience
                                ? `${mentor.yearsOfExperience} ans d'experience`
                                : "Experience non renseignee"}
                            </CardDescription>
                          </div>
                          {mentor.rating && (
                            <div className="flex items-center gap-1 text-sm text-amber-500">
                              <Star className="h-3.5 w-3.5 fill-current" />
                              <span className="font-medium">{Number(mentor.rating).toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span>{mentor.expertise || "Expertise non renseignee"}</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                            Disponible
                          </Badge>
                          {alreadyRequested && (
                            <Badge variant="outline" className={status.className}>
                              {status.label}
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            disabled={!alreadyRequested}
                            onClick={() => handleMessageClick(mentor)}
                            title={!alreadyRequested ? "Envoyer une demande d'abord" : "Ouvrir la session de chat"}
                          >
                            <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                            Message
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            disabled={alreadyRequested || requestingMentorId === mentor.id}
                            onClick={() => handleRequest(mentor)}
                          >
                            {requestingMentorId === mentor.id ? (
                              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                            ) : alreadyRequested ? (
                              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                            ) : (
                              <Calendar className="mr-1.5 h-3.5 w-3.5" />
                            )}
                            {alreadyRequested ? "Demande envoyee" : "Demander"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {matches.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Calendar className="mx-auto mb-3 h-10 w-10 opacity-30" />
                  <p>Aucune demande pour le moment</p>
                  <p className="mt-1 text-xs">Va dans l'onglet Trouver pour envoyer ta premiere demande.</p>
                </CardContent>
              </Card>
            ) : (
              matches.map((match) => {
                const mentor = match.mentor
                const status = statusConfig[match.status || "pending"]

                return (
                  <Card key={match.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11">
                          <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                            {getInitials(mentor)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="truncate text-base">
                            {mentor?.user?.firstName} {mentor?.user?.lastName}
                          </CardTitle>
                          <CardDescription className="truncate">
                            {mentor?.expertise || "Expertise non renseignee"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <Badge variant="outline" className={status.className}>
                        {status.label}
                      </Badge>

                      <div className="text-sm text-muted-foreground">
                        Demande envoyee le{" "}
                        {match.createdAt ? new Date(match.createdAt).toLocaleDateString("fr-FR") : "-"}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => handleOpenConversation(mentor?.id)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Ouvrir chat
                        </Button>
                        <Button asChild className="flex-1">
                          <Link href="/student/planning">
                            <Calendar className="mr-2 h-4 w-4" />
                            Planning
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <Card className="overflow-hidden">
            <div className="grid min-h-[640px] lg:grid-cols-[320px_1fr]">
              <div className="border-r border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Conversations</CardTitle>
                  <CardDescription>Mentors contactes ou demandes deja envoyees.</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <ScrollArea className="h-[520px] pr-2">
                    <div className="space-y-2">
                      {conversations.length === 0 ? (
                        <div className="py-10 text-center text-muted-foreground">
                          <MessageSquare className="mx-auto mb-3 h-10 w-10 opacity-30" />
                          <p className="text-sm">Aucune conversation</p>
                        </div>
                      ) : (
                        conversations.map((conversation) => {
                          const lastMessage = conversation.messages[conversation.messages.length - 1]
                          const unreadCount = conversation.messages.filter(
                            (message) => message.receiver?.id === user?.id && !message.isRead
                          ).length

                          return (
                            <button
                              key={conversation.mentorId}
                              onClick={() => setSelectedConversationId(conversation.mentorId)}
                              className={`w-full rounded-xl border p-3 text-left transition-colors ${
                                selectedConversationId === conversation.mentorId
                                  ? "border-primary bg-primary/5"
                                  : "hover:bg-muted/40"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                                    {getInitials(conversation.mentor)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="truncate text-sm font-medium">
                                      {conversation.mentor.user?.firstName} {conversation.mentor.user?.lastName}
                                    </p>
                                    <span className="text-[11px] text-muted-foreground">
                                      {formatTime(lastMessage?.sentAt)}
                                    </span>
                                  </div>
                                  <p className="truncate text-xs text-muted-foreground">
                                    {lastMessage?.content || "Aucun message pour le moment"}
                                  </p>
                                </div>
                                {unreadCount > 0 && (
                                  <Badge className="h-5 min-w-5 rounded-full px-1.5 text-[10px]">
                                    {unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </button>
                          )
                        })
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </div>

              <div className="flex flex-col">
                {!selectedConversation ? (
                  <div className="flex flex-1 items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <MessageSquare className="mx-auto mb-3 h-12 w-12 opacity-20" />
                      <p>Selectionne un mentor pour commencer</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="border-b border-border p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                            {getInitials(selectedConversation.mentor)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold">
                            {selectedConversation.mentor.user?.firstName} {selectedConversation.mentor.user?.lastName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {selectedConversation.mentor.expertise || "Expertise non renseignee"}
                          </p>
                        </div>
                        {selectedConversation.match?.status && (
                          <Badge variant="outline" className={statusConfig[selectedConversation.match.status].className}>
                            {statusConfig[selectedConversation.match.status].label}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <ScrollArea className="h-[470px] p-4">
                      <div className="mx-auto max-w-3xl space-y-3">
                        {selectedConversation.messages.length === 0 ? (
                          <div className="py-12 text-center text-muted-foreground">
                            <Clock className="mx-auto mb-3 h-10 w-10 opacity-20" />
                            <p className="text-sm">Pas encore de messages</p>
                            <p className="mt-1 text-xs">Envoie le premier message a ce mentor.</p>
                          </div>
                        ) : (
                          selectedConversation.messages.map((message) => {
                            const isMine = message.sender?.id === user?.id
                            return (
                              <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                <div
                                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap break-words [overflow-wrap:anywhere] ${
                                    isMine ? "bg-primary text-primary-foreground" : "bg-muted"
                                  }`}
                                >
                                  {message.content}
                                  <div className={`mt-1 text-[11px] opacity-70 ${isMine ? "text-right" : "text-left"}`}>
                                    {formatTime(message.sentAt)}
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </ScrollArea>

                    <div className="border-t border-border p-4">
                      {selectedConversation.match?.status !== "accepted" && (
                        <div className="mx-auto mb-3 max-w-3xl rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                          Vous pourrez envoyer un message une fois la demande acceptee.
                        </div>
                      )}
                      <div className="mx-auto flex max-w-3xl gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                          placeholder="Ecris un message au mentor..."
                          disabled={selectedConversation.match?.status !== "accepted" || sending}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={sending || !newMessage.trim() || selectedConversation.match?.status !== "accepted"}
                        >
                          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
