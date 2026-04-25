"use client"
import { useState, useEffect } from "react"
import { mentorsApi, Mentor, mentorMatchesApi, MentorMatch } from "@/lib/api"

export function useMentors() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    mentorsApi.getAvailable()
      .then(setMentors)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])
  return { mentors, loading, error }
}

export function useMentorMatch(studentId: number | null) {
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<MentorMatch[]>([])
  useEffect(() => {
    if (!studentId) return
    mentorMatchesApi.getByStudent(studentId).then(setMatches).catch(console.error)
  }, [studentId])
  const requestMatch = async (mentorId: number) => {
    if (!studentId) return
    setLoading(true)
    try {
      const match = await mentorMatchesApi.create(studentId, mentorId)
      setMatches((prev) => [...prev, match])
      return match
    } finally { setLoading(false) }
  }
  return { matches, loading, requestMatch }
}
