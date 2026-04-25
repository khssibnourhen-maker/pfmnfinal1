"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { commentsApi, Comment } from "@/lib/api"

export function LandingTestimonials() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  const loadComments = () => {
    commentsApi
      .getAll()
      .then((rows) => setComments(rows || []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadComments()
    const intervalId = window.setInterval(loadComments, 10000)
    const onFocus = () => loadComments()
    window.addEventListener("focus", onFocus)
    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener("focus", onFocus)
    }
  }, [])

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Temoignages
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            Ce que disent nos{" "}
            <span className="text-primary">utilisateurs</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Etudiants et mentors partagent leur experience sur StudyPath.
          </p>
        </motion.div>

        {loading && (
          <div className="text-center text-muted-foreground">Chargement des commentaires...</div>
        )}

        {!loading && comments.length === 0 && (
          <div className="text-center text-muted-foreground">Aucun commentaire pour le moment.</div>
        )}

        {!loading && comments.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {comments.map((comment, index) => (
            <motion.div
              key={comment.id || `${comment.user?.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-full bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    {(comment.user?.firstName?.[0] || "U") + (comment.user?.lastName?.[0] || "S")}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {comment.user?.firstName || "Utilisateur"} {comment.user?.lastName || ""}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {comment.user?.role === "Mentor" ? "Mentor" : "Etudiant"}
                    </p>
                  </div>
                  <Quote className="w-8 h-8 text-primary/20" />
                </div>

                <p className="text-foreground/90 leading-relaxed mb-4">
                  &ldquo;{comment.content}&rdquo;
                </p>

                <div className="flex items-center gap-1">
                  {Array.from({ length: comment.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-chart-4 text-chart-4" />
                  ))}
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
