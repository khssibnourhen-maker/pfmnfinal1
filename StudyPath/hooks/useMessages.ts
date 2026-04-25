"use client"
import { useState, useEffect } from "react"
import { messagesApi, Message } from "@/lib/api"

export function useMessages(userId: number | null) {
  const [received, setReceived] = useState<Message[]>([])
  const [sent, setSent] = useState<Message[]>([])
  const [unread, setUnread] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const [r, s, u] = await Promise.all([
        messagesApi.getReceived(userId),
        messagesApi.getSent(userId),
        messagesApi.getUnread(userId),
      ])
      setReceived(r || []); setSent(s || []); setUnread(u || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchMessages() }, [userId])

  const sendMessage = async (receiverId: number, content: string) => {
    if (!userId) return
    const msg = await messagesApi.send(userId, receiverId, content)
    setSent((prev) => [...prev, msg])
    return msg
  }

  const markAsRead = async (messageId: number) => {
    const updated = await messagesApi.markAsRead(messageId)
    setUnread((prev) => prev.filter((m) => m.id !== messageId))
    setReceived((prev) => prev.map((m) => (m.id === messageId ? updated : m)))
  }

  return { received, sent, unread, loading, sendMessage, markAsRead, refresh: fetchMessages }
}
