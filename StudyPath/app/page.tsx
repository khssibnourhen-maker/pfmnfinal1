"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LandingHero } from "@/components/landing/hero"
import { LandingFeatures } from "@/components/landing/features"
import { LandingHowItWorks } from "@/components/landing/how-it-works"
import { LandingTestimonials } from "@/components/landing/testimonials"
import { LandingCTA } from "@/components/landing/cta"
import { LandingFooter } from "@/components/landing/footer"
import { Navbar } from "@/components/landing/navbar"
import { AuthModal } from "@/components/auth/auth-modal"

export default function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let connectedUser = localStorage.getItem("smartcareer_user") as any;

      if (connectedUser != null) {
        connectedUser = JSON.parse(connectedUser);
        if (connectedUser.role == "Student") {
          router.replace("/student/dashboard")
        }
        if (connectedUser.role == "Mentor") {
          router.replace("/mentor/dashboard")
        }
      }
    }
  }, [router]);

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  return (
    <main className="min-h-screen">
      <Navbar onLogin={() => openAuth("login")} onRegister={() => openAuth("register")} />
      <LandingHero onGetStarted={() => openAuth("register")} />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingTestimonials />
      <LandingCTA onGetStarted={() => openAuth("register")} />
      <LandingFooter />
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </main>
  )
}
