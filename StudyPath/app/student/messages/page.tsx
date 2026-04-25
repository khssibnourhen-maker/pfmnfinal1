"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Search, Send, MoreVertical, CheckCheck, Clock, Loader2, MessageSquare, AlertCircle } from "lucide-react"
import { messagesApi, Message, mentorMatchesApi, MentorMatch } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

interface Conversation {
  userId: string
  user: any
  messages: Message[]
  matchStatus?: string
  matchId?: string
}

export default function MessagesPage() {
  const { user, isLoading } = useAuth()
  const searchParams = useSearchParams()
  const mentorIdParam = searchParams.get('mentorId')
  
  const [messages, setMessages] = useState<Message[]>([])
  const [matches, setMatches] = useState<MentorMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [selectedMentorUserId, setSelectedMentorUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isLoading || !user) return
    
    const fetchData = async () => {
      try {
        setLoading(true)
        const [received, sent, mentorMatches] = await Promise.all([
          messagesApi.getReceived(user.id).catch(() => []),
          messagesApi.getSent(user.id).catch(() => []),
          mentorMatchesApi.getByStudent(user.id).catch(() => []),
        ])
        
        const all = [...(received || []), ...(sent || [])]
        all.sort((a, b) => new Date(a.sentAt!).getTime() - new Date(b.sentAt!).getTime())
        setMessages(all)
        setMatches(mentorMatches || [])

        // Si mentorIdParam est fourni, sélectionner le mentor correspondant
        if (mentorIdParam) {
          const match = mentorMatches?.find(m => m.mentor?.id === mentorIdParam)
          if (match?.mentor?.user?.id) {
            setSelectedMentorUserId(match.mentor.user.id)
          }
        }
      } catch (err: any) {
        setError("Impossible de charger les messages.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [isLoading, user, mentorIdParam])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, selectedMentorUserId])

  // Construire conversations à partir des matches ET messages
  const conversations: Conversation[] = (() => {
    const map = new Map<string, Conversation>()
    
    // D'abord, ajouter tous les matches (même sans messages)
    matches.forEach(match => {
      const mentorUserId = match.mentor?.user?.id
      const mentorUser = match.mentor?.user
      if (mentorUserId && mentorUser) {
        map.set(mentorUserId, {
          userId: mentorUserId,
          user: mentorUser,
          messages: [],
          matchStatus: match.status || 'unknown',
          matchId: match.id
        })
      }
    })
    
    // Ensuite, ajouter les messages associés
    messages.forEach(msg => {
      const otherId = msg.sender?.id === user?.id ? msg.receiver?.id : msg.sender?.id
      const otherUser = msg.sender?.id === user?.id ? msg.receiver : msg.sender
      if (!otherId || !otherUser) return
      
      if (!map.has(otherId)) {
        map.set(otherId, {
          userId: otherId,
          user: otherUser,
          messages: [],
          matchStatus: 'unknown'
        })
      }
      
      // Mettre à jour le status du match si disponible
      const match = matches.find(m => m.mentor?.user?.id === otherId)
      if (match) {
        const conv = map.get(otherId)!
        conv.matchStatus = match.status || 'unknown'
        conv.matchId = match.id
      }
      
      map.get(otherId)!.messages.push(msg)
    })
    
    return Array.from(map.values()).sort((a, b) => {
      const aLast = a.messages[a.messages.length - 1]?.sentAt || ""
      const bLast = b.messages[b.messages.length - 1]?.sentAt || ""
      return new Date(bLast).getTime() - new Date(aLast).getTime()
    })
  })()

  const activeConv = selectedMentorUserId
    ? conversations.find((conv) => conv.userId === selectedMentorUserId)
    : null

  const convMessages = activeConv?.messages ?? []

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !selectedMentorUserId) return
    
    // Vérifier le status du match
    if (activeConv?.matchStatus !== 'accepted') {
      setError('Vous ne pouvez envoyer un message que si la demande de mentorat est acceptée.')
      return
    }

    setSending(true)
    setError(null)
    try {
      const sent = await messagesApi.send(user.id, selectedMentorUserId, newMessage.trim())
      setMessages((prev) => [...prev, sent])
      setNewMessage("")
    } catch (e: any) {
      setError("Erreur d'envoi: " + e.message)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  }

  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "En attente", className: "bg-amber-100 text-amber-700" },
    accepted: { label: "Accepté", className: "bg-emerald-100 text-emerald-700" },
    declined: { label: "Refusé", className: "bg-rose-100 text-rose-700" },
    unknown: { label: "?", className: "bg-gray-100 text-gray-700" },
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar - Conversations */}
      <div className="w-80 border-r border-border flex flex-col bg-background">
        <div className="p-4 border-b border-border space-y-3">
          <h2 className="font-semibold text-lg">Messages</h2>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 p-2 rounded">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Chargement...</span>
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Rechercher..." className="pl-9 h-9" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          )}
          {error && (
            <p className="text-xs text-destructive text-center p-4">{error}</p>
          )}
          {!loading && conversations.length === 0 && (
            <div className="text-center py-12 text-muted-foreground px-4">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucune conversation</p>
            </div>
          )}
          {conversations.map((conv) => {
            const lastMsg = conv.messages[conv.messages.length - 1]
            const unread = conv.messages.filter(m => m.sender?.id !== user?.id && !m.isRead).length
            const initials = `${conv.user.firstName?.[0] ?? ""}${conv.user.lastName?.[0] ?? ""}`.toUpperCase()
            const statusBadge = statusConfig[conv.matchStatus || 'unknown']
            
            return (
              <button key={conv.userId} onClick={() => setSelectedMentorUserId(conv.userId)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left border-b border-border/50",
                  selectedMentorUserId === conv.userId && "bg-primary/5 border-l-2 border-l-primary"
                )}>
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm truncate">
                      {conv.user.firstName} {conv.user.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatTime(lastMsg?.sentAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5 gap-2">
                    <Badge variant="outline" className={`text-xs py-0 h-4 flex-shrink-0 ${statusBadge.className}`}>
                      {statusBadge.label}
                    </Badge>
                    <p className="text-xs text-muted-foreground truncate">{lastMsg?.content}</p>
                    {unread > 0 && (
                      <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs flex-shrink-0">
                        {unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Sélectionnez une conversation</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-3 bg-background">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {`${activeConv.user.firstName?.[0] ?? ""}${activeConv.user.lastName?.[0] ?? ""}`.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">{activeConv.user.firstName} {activeConv.user.lastName}</p>
                <Badge variant="outline" className={`text-xs py-0 h-4 ${statusConfig[activeConv.matchStatus || 'unknown'].className}`}>
                  {statusConfig[activeConv.matchStatus || 'unknown'].label}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto"><MoreVertical className="w-4 h-4" /></Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3 max-w-2xl mx-auto">
                {convMessages.map((msg) => {
                  const isMine = msg.sender?.id === user?.id
                  return (
                    <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm",
                        isMine
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm"
                      )}>
                        <p>{msg.content}</p>
                        <div className={cn("flex items-center gap-1 mt-1 text-xs opacity-70", isMine ? "justify-end" : "justify-start")}>
                          <Clock className="w-3 h-3" />
                          {formatTime(msg.sentAt)}
                          {isMine && <CheckCheck className={cn("w-3 h-3", msg.isRead ? "text-blue-300" : "opacity-50")} />}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border bg-background space-y-2">
              {error && (
                <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded p-3 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {activeConv.matchStatus !== 'accepted' && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Vous pouvez envoyer des messages une fois que la demande sera acceptée.</span>
                </div>
              )}
              <div className="flex gap-2 max-w-2xl mx-auto">
                <Input
                  placeholder="Écrire un message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && activeConv.matchStatus === 'accepted') { e.preventDefault(); handleSend() } }}
                  className="flex-1"
                  disabled={activeConv.matchStatus !== 'accepted'}
                />
                <Button 
                  onClick={handleSend} 
                  disabled={!newMessage.trim() || sending || activeConv.matchStatus !== 'accepted'} 
                  size="icon"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
