"use client"

import { motion } from "framer-motion"
import { 
  Calendar, 
  FileText, 
  Users, 
  Brain, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Planification Intelligente",
    description: "Creation automatique de votre emploi du temps base sur vos cours, revisions et deadlines avec notifications intelligentes.",
    benefits: ["Synchronisation calendrier", "Rappels personnalises", "Optimisation du temps"],
    color: "bg-primary/10 text-primary"
  },
  {
    icon: FileText,
    title: "CV Builder & Analyse IA",
    description: "Creez votre CV etape par etape avec notre assistant IA qui analyse et optimise votre profil pour maximiser vos chances.",
    benefits: ["Creation guidee", "Analyse de competences", "Suggestions IA"],
    color: "bg-accent/10 text-accent"
  },
  {
    icon: Users,
    title: "Networking & Mentorat",
    description: "Connectez-vous avec des mentors et etudiants ayant un parcours similaire. Messagerie integree pour echanges et conseils.",
    benefits: ["Matching intelligent", "Chat en temps reel", "Conseils experts"],
    color: "bg-chart-3/10 text-chart-3"
  },
  {
    icon: Brain,
    title: "AI Career Mirror",
    description: "Vision predictive de votre futur professionnel avec recommandations precises pour atteindre vos objectifs de carriere.",
    benefits: ["Prediction IA", "Roadmap personnalisee", "Gap analysis"],
    color: "bg-chart-5/10 text-chart-5"
  }
]

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
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
            <Sparkles className="w-4 h-4" />
            Fonctionnalites
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            Tout ce dont vous avez besoin pour{" "}
            <span className="text-primary">reussir</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Une plateforme complete qui combine planification, CV, mentorat et IA 
            pour accompagner chaque etape de votre parcours.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group h-full bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-5 leading-relaxed">{feature.description}</p>
                
                <div className="space-y-2 mb-5">
                  {feature.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <button className="inline-flex items-center text-sm font-medium text-primary hover:underline group/btn">
                  En savoir plus
                  <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
