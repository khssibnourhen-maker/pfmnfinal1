import Link from "next/link"
import { Sparkles, Github, Linkedin, Twitter } from "lucide-react"

const footerLinks = {
  produit: [
    { label: "Fonctionnalites", href: "#features" },
    { label: "CV Builder", href: "/cv-builder" },
    { label: "AI Career Mirror", href: "#" },
    { label: "Tarifs", href: "#" },
  ],
  ressources: [
    { label: "Blog", href: "#" },
    { label: "Guide Etudiant", href: "#" },
    { label: "Tutoriels", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  entreprise: [
    { label: "A propos", href: "#" },
    { label: "Carrieres", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Partenaires", href: "#" },
  ],
  legal: [
    { label: "Confidentialite", href: "#" },
    { label: "Conditions", href: "#" },
    { label: "Cookies", href: "#" },
  ],
}

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">
                Study<span className="text-primary">Path</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              La plateforme intelligente pour construire votre avenir professionnel.
            </p>
            <div className="flex gap-3">
              <Link href="#" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Github className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Produit</h4>
            <ul className="space-y-3">
              {footerLinks.produit.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Ressources</h4>
            <ul className="space-y-3">
              {footerLinks.ressources.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.entreprise.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} StudyPath. Tous droits reserves.
            </p>
            <p className="text-sm text-muted-foreground">
              Fait avec passion pour les etudiants
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
