"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

interface CTAProps {
  onGetStarted: () => void
}

export function LandingCTA({ onGetStarted }: CTAProps) {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 md:px-16 md:py-20"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Lancez-vous aujourd&apos;hui
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
              Pret a transformer votre parcours academique?
            </h2>

            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Rejoignez des milliers d&apos;etudiants qui utilisent deja StudyPath pour 
              planifier, creer leur CV et atteindre leurs objectifs professionnels.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                variant="secondary"
                onClick={onGetStarted}
                className="text-base px-8 bg-white text-primary hover:bg-white/90"
              >
                Commencer gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <p className="text-sm text-white/60 mt-6">
              Gratuit pour toujours. Pas de carte de credit requise.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
