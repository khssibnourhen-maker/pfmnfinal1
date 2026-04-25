"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles, Brain, Target, Users } from "lucide-react"
import { motion } from "framer-motion"

interface HeroProps {
  onGetStarted: () => void
}

export function LandingHero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <Sparkles className="w-4 h-4" />
              Propulse par l&apos;Intelligence Artificielle
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Construisez votre{" "}
              <span className="text-primary">avenir professionnel</span>{" "}
              avec l&apos;IA
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Planification intelligente, creation de CV par etapes, analyse IA, 
              mentorat personnalise et prediction de carriere. Tout ce dont vous 
              avez besoin pour reussir.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="text-base px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                Commencer maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-semibold">+2,500 etudiants</p>
                <p className="text-sm text-muted-foreground">nous font confiance</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative z-10 grid gap-4">
              {/* Main Card */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Career Mirror</h3>
                    <p className="text-sm text-muted-foreground">Vision predictive de carriere</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Competences actuelles</span>
                    <span className="text-sm font-semibold text-primary">78%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Objectif Data Scientist</span>
                    <span className="text-sm font-semibold text-accent">92% match</span>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-xl border border-border p-4 shadow-lg hover:shadow-xl transition-shadow">
                  <Target className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-medium mb-1">Planification</h4>
                  <p className="text-xs text-muted-foreground">Smart scheduling IA</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-4 shadow-lg hover:shadow-xl transition-shadow">
                  <Users className="w-8 h-8 text-accent mb-3" />
                  <h4 className="font-medium mb-1">Mentorat</h4>
                  <p className="text-xs text-muted-foreground">Matching intelligent</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
