"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { MessageSquare, Search, Send, Clock, CheckCheck, Loader2 } from "lucide-react"
import { mentorMatchesApi, mentorsApi, messagesApi, Message, MentorMatch } from "@/lib/api"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Conversation {
  studentId: string
  studentName: string
  matchId: string
  matchStatus: string
  lastMessage?: Message
  messages: Message[]
  online: boolean
}

export default function MentorMessagesPage() {
  const { user, isLoading } = useAuth()
  const searchParams = useSearchParams()
  const studentIdParam = searchParams.get('studentId')
  
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selected, setSelected] = useState<string | null>(studentIdParam || null)
  const [search, setSearch] = useState("")
  const [newMsg, setNewMsg] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoading || !user?.id) return

    const fetchConversations = async () => {
      try {
        setLoading(true)
        setError(null)

        const mentor = await mentorsApi.getByUserId(user.id)

        // Get all mentoring requests with students
        const matches = await mentorMatchesApi.getByMentor(mentor.id!)
        
        // Get all sent and received messages
        const [sent, received] = await Promise.all([
          messagesApi.getSent(user.id).catch(() => []),
          messagesApi.getReceived(user.id).catch(() => []),
        ])
        const allMessages = [...sent, ...received].sort(
          (a, b) => new Date(a.sentAt || "").getTime() - new Date(b.sentAt || "").getTime()
        )

        // Build conversations from matches
        const conversationMap = new Map<string, Conversation>()
        
        matches.forEach((match) => {
          const studentId = match.student?.id
          const studentName = `${match.student?.firstName || ''} ${match.student?.lastName || ''}`.trim()
          
          if (studentId) {
            conversationMap.set(studentId, {
              studentId,
              studentName,
              matchId: match.id || '',
              matchStatus: match.status || 'pending',
              messages: [],
              online: false,
            })
          }
        })

        // Add messages to conversations
        allMessages.forEach((message) => {
          const otherUserId = message.sender?.id === user.id ? message.receiver?.id : message.sender?.id
          if (otherUserId && conversationMap.has(otherUserId)) {
            conversationMap.get(otherUserId)!.messages.push(message)
          }
        })

        // Sort by last message
        const convList = Array.from(conversationMap.values())
          .map((conv) => ({
            ...conv,
            lastMessage: conv.messages[conv.messages.length - 1],
          }))
          .sort((a, b) => {
            const aTime = new Date(a.lastMessage?.sentAt || a.matchId).getTime()
            const bTime = new Date(b.lastMessage?.sentAt || b.matchId).getTime()
            return bTime - aTime
          })

        setConversations(convList)
        if (convList.length > 0 && !selected) {
          setSelected(convList[0].studentId)
        }
      } catch (err: any) {
        console.error('Error loading conversations:', err)
        setError('Impossible de charger les conversations')
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [isLoading, user?.id])

  const filtered = conversations.filter((c) =>
    c.studentName.toLowerCase().includes(search.toLowerCase())
  )

  const selectedConv = conversations.find((c) => c.studentId === selected)

  const handleSend = async () => {
    if (!newMsg.trim() || !selectedConv || !user?.id) return

    // Check if match is accepted
    if (selectedConv.matchStatus !== 'accepted') {
      alert('Vous ne pouvez envoyer un message que si la demande est acceptée.')
      return
    }

    setSending(true)
    try {
      const sent = await messagesApi.send(user.id, selectedConv.studentId, newMsg.trim())
      setConversations((prev) =>
        prev.map((conv) =>
          conv.studentId === selectedConv.studentId
            ? { ...conv, messages: [...conv.messages, sent], lastMessage: sent }
            : conv
        )
      )
      setNewMsg("")
    } catch (err: any) {
      alert('Erreur: ' + err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-full">
      {/* Conversation List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-lg mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 h-8 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="p-4 text-xs text-destructive bg-destructive/10">{error}</div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              {conversations.length === 0 ? "Aucune conversation" : "Aucun résultat"}
            </div>
          ) : (
            filtered.map((conv) => (
              <button
                key={conv.studentId}
                onClick={() => setSelected(conv.studentId)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left border-b border-border/50 ${
                  selected === conv.studentId ? "bg-accent/5 border-l-2 border-l-accent" : ""
                }`}
              >
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-accent/10 text-accent text-sm font-semibold">
                      {conv.studentName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{conv.studentName}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {conv.lastMessage?.sentAt
                        ? new Date(conv.lastMessage.sentAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs py-0 h-4">
                      {conv.matchStatus}
                    </Badge>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {conv.lastMessage?.content || "Aucun message"}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConv ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center gap-3 bg-background">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-accent/10 text-accent font-semibold">
                {selectedConv.studentName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{selectedConv.studentName}</p>
              <Badge variant="outline" className="text-xs">
                {selectedConv.matchStatus}
              </Badge>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 space-y-4">
            {selectedConv.messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Aucun message pour le moment</p>
              </div>
            ) : (
              selectedConv.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender?.id === user?.id ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                      msg.sender?.id === user?.id
                        ? "bg-accent text-white rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <div
                      className={`flex items-center gap-1 mt-1 text-xs ${
                        msg.sender?.id === user?.id ? "text-white/70 justify-end" : "text-muted-foreground"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>
                        {msg.sentAt
                          ? new Date(msg.sentAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
                          : ""}
                      </span>
                      {msg.sender?.id === user?.id && <CheckCheck className="w-3 h-3 ml-1" />}
                    </div>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border bg-background space-y-2">
            {selectedConv.matchStatus !== "accepted" && (
              <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-700">
                Vous pouvez envoyer des messages une fois que l'étudiant aura accepté cette demande.
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Écrire un message..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !sending && handleSend()}
                className="flex-1"
                disabled={selectedConv.matchStatus !== "accepted" || sending}
              />
              <Button
                onClick={handleSend}
                className="bg-accent hover:bg-accent/90 px-4"
                disabled={!newMsg.trim() || selectedConv.matchStatus !== "accepted" || sending}
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Sélectionnez une conversation</p>
          </div>
        </div>
      )}
    </div>
  )
}
