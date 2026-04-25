"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Brain, Loader2, Send, Sparkles } from "lucide-react"
import { aiApi } from "@/lib/api"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export default function StudentAiCoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Bonjour 👋 Je suis ton AI Coach. Je peux analyser ton CV, proposer des certifications, des projets portfolio, et un plan d'action carrière."
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const cvContext = useMemo(() => {
    const stored = localStorage.getItem("cvAnalysis")
    if (!stored) return ""
    try {
      const parsed = JSON.parse(stored)
      return parsed.cvContent || ""
    } catch {
      return ""
    }
  }, [])

  const analysisContext = useMemo(() => {
    const stored = localStorage.getItem("cvAnalysis")
    if (!stored) return ""
    try {
      const parsed = JSON.parse(stored)
      return parsed.analysis || ""
    } catch {
      return ""
    }
  }, [])

  const send = async () => {
    if (!input.trim() || loading) return
    const outgoing = input.trim()
    const nextMessages = [...messages, { role: "user" as const, content: outgoing }]
    setMessages(nextMessages)
    setInput("")
    setLoading(true)
    try {
      const result = await aiApi.careerChat(
        outgoing,
        cvContext,
        analysisContext,
        nextMessages.map((m) => ({ role: m.role, content: m.content }))
      )
      setMessages((prev) => [...prev, { role: "assistant", content: result.reply }])
    } catch (error: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: error?.message || "Erreur IA" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 h-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Brain className="w-7 h-7 text-accent" />
            AI Coach
          </h1>
          <p className="text-muted-foreground">Chatbot carrière connecté à Ollama + Qwen2.5</p>
        </div>
        <Badge variant="outline" className="bg-accent/10 border-accent/30">Ollama / Qwen2.5</Badge>
      </div>

      <Card className="h-[70vh] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-accent" /> Career Copilot</CardTitle>
          <CardDescription>
            Pose des questions comme: "Quelles certifications pour devenir frontend senior ?" ou "Quels projets ajouter à mon CV ?"
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] overflow-hidden rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap break-words [overflow-wrap:anywhere] ${
                      message.role === "user" ? "bg-accent text-white" : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] overflow-hidden rounded-2xl bg-muted px-4 py-3 text-sm break-words [overflow-wrap:anywhere] flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyse en cours...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Demande un plan d'action, des certifications, ou une analyse ciblée..."
            />
            <Button onClick={send} disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
