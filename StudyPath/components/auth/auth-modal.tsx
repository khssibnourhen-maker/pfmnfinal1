"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Mail, Lock, User, GraduationCap, Briefcase, ArrowRight, AlertCircle } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "login" | "register"
  onModeChange: (mode: "login" | "register") => void
}

export function AuthModal({ open, onOpenChange, mode, onModeChange }: AuthModalProps) {
  const router = useRouter()
  const { login, register } = useAuth()
  const [userType, setUserType] = useState<"Student" | "Mentor">("Student")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Champs login
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Champs register
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await login(loginEmail, loginPassword, userType)
      onOpenChange(false)
      router.push(userType === "Student" ? "/student/dashboard" : "/mentor/dashboard")
    } catch (err: any) {
      setError(err.message || "Erreur de connexion")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await register({
        firstName,
        lastName,
        email: registerEmail,
        password: registerPassword,
        role: userType,
      })
      onOpenChange(false)
      router.push(userType === "Student" ? "/student/dashboard" : "/mentor/dashboard")
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription")
    } finally {
      setIsLoading(false)
    }
  }

  const UserTypeSelector = () => (
    <div className="space-y-2">
      <Label>Je suis</Label>
      <div className="grid grid-cols-2 gap-3">
        {(["Student", "Mentor"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setUserType(type)}
            className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
              userType === type
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-primary/50"
            }`}
          >
            {type === "Student" ? <GraduationCap className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
            <span className="text-sm font-medium">{type === "Student" ? "Etudiant" : "Mentor"}</span>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">StudyPath</span>
          </div>
          <DialogTitle>
            {mode === "login" ? "Content de vous revoir!" : "Rejoignez StudyPath"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Connectez-vous pour acceder a votre espace"
              : "Creez votre compte et commencez votre parcours"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <Tabs value={mode} onValueChange={(v) => { setError(null); onModeChange(v as "login" | "register") }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email-login" type="email" placeholder="vous@exemple.com"
                    className="pl-10" required value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password-login" type="password" placeholder="••••••••"
                    className="pl-10" required value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)} />
                </div>
              </div>
              <UserTypeSelector />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="firstName" type="text" placeholder="Prénom"
                      className="pl-10" required value={firstName}
                      onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" type="text" placeholder="Nom"
                    required value={lastName}
                    onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-register">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email-register" type="email" placeholder="vous@exemple.com"
                    className="pl-10" required value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-register">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password-register" type="password" placeholder="••••••••"
                    className="pl-10" required value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)} />
                </div>
              </div>
              <UserTypeSelector />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Création..." : "Créer mon compte"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
