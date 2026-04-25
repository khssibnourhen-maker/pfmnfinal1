"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Benali",
    role: "Etudiante en Data Science",
    university: "Universite Paris-Saclay",
    content: "Grace a StudyPath, j'ai pu creer un CV professionnel et trouver un mentor qui m'a aide a decrocher mon stage chez Microsoft.",
    rating: 5,
    avatar: "SB"
  },
  {
    name: "Karim Ouahab",
    role: "Etudiant en Genie Logiciel",
    university: "INSA Lyon",
    content: "L'AI Career Mirror m'a ouvert les yeux sur les competences que je devais developper. Maintenant j'ai une roadmap claire.",
    rating: 5,
    avatar: "KO"
  },
  {
    name: "Marie Dupont",
    role: "Etudiante en Marketing Digital",
    university: "HEC Paris",
    content: "La planification intelligente a transforme ma gestion du temps. Je suis plus productive et moins stresse.",
    rating: 5,
    avatar: "MD"
  },
  {
    name: "Ahmed Ziani",
    role: "Etudiant en Finance",
    university: "ESSEC",
    content: "Les micro-experiences proposees m'ont permis de construire un portfolio impressionnant avant meme ma sortie d'ecole.",
    rating: 5,
    avatar: "AZ"
  }
]

export function LandingTestimonials() {
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
            <span className="text-primary">etudiants</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Rejoignez des milliers d&apos;etudiants qui ont deja transforme leur parcours avec StudyPath.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-full bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.university}</p>
                  </div>
                  <Quote className="w-8 h-8 text-primary/20" />
                </div>

                <p className="text-foreground/90 leading-relaxed mb-4">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className="flex items-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-chart-4 text-chart-4" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
