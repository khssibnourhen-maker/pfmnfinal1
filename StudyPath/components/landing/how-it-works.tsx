"use client"

import { motion } from "framer-motion"
import { UserPlus, FileEdit, Sparkles, TrendingUp } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Creez votre profil",
    description: "Inscrivez-vous en quelques secondes et completez votre profil etudiant avec vos objectifs et preferences."
  },
  {
    number: "02",
    icon: FileEdit,
    title: "Construisez votre CV",
    description: "Utilisez notre CV Builder intelligent etape par etape pour creer un CV professionnel et impactant."
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Analyse IA",
    description: "Notre IA analyse votre profil, identifie vos forces et propose un plan d'amelioration personnalise."
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Atteignez vos objectifs",
    description: "Suivez votre progression, connectez-vous avec des mentors et decouvrez des opportunites sur mesure."
  }
]

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            Comment ca marche
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            4 etapes vers votre{" "}
            <span className="text-primary">reussite</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Un processus simple et guide pour vous accompagner dans votre developpement professionnel.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-0.5 bg-border" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-center">
                  {/* Step Number with Icon */}
                  <div className="relative inline-flex mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-card border border-border shadow-lg flex items-center justify-center relative z-10">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center z-20">
                      {index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
