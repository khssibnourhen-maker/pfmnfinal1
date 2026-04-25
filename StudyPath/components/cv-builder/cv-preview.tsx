"use client"

import { CVData } from "@/lib/types/cv"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CVPreviewProps {
  cvData: CVData
  compact?: boolean
  hideToolbar?: boolean
}

export function CVPreview({ cvData, compact = false, hideToolbar = false }: CVPreviewProps) {
  const {
    personalInfo,
    education = [],
    experience = [],
    skills = [],
    languages = [],
    certifications = [],
    projects = [],
  } = cvData || {}

  const formatDate = (date?: string) => {
    if (!date) return ""
    if (!date.includes("-")) return date

    const [year, month] = date.split("-")
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${months[Math.max(0, parseInt(month || "1", 10) - 1)]} ${year}`
  }

  const formatDateRange = (startDate?: string, endDate?: string, current?: boolean) => {
    const start = formatDate(startDate)
    const end = current ? "Present" : formatDate(endDate)

    if (start && end) return `${start} - ${end}`
    return start || end || ""
  }

  const fullName = `${personalInfo?.firstName || "First"} ${personalInfo?.lastName || "Last"}`.trim()

  const contactItems = [
    personalInfo?.email,
    personalInfo?.phone,
    personalInfo?.address,
    personalInfo?.linkedIn,
    personalInfo?.portfolio,
  ].filter(Boolean)

  const groupedSkills = skills.reduce((acc, skill) => {
    const key = skill.category || "Skills"
    if (!acc[key]) acc[key] = []
    acc[key].push(skill.name)
    return acc
  }, {} as Record<string, string[]>)

  const handleDownload = () => {
    const element = document.getElementById("cv-preview-content")
    if (!element) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>${fullName} - CV</title>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: Arial, Helvetica, sans-serif;
              margin: 0;
              padding: 0;
              background: #ffffff;
              color: #111827;
            }
            .print-shell {
              width: 100%;
              max-width: 850px;
              margin: 0 auto;
              background: #ffffff;
              padding: 24px;
            }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="print-shell">${element.innerHTML}</div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  return (
    <div className={compact ? "space-y-3" : "p-6 lg:p-8 space-y-4"}>
      {!hideToolbar && (
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">ATS-Friendly CV Preview</h2>
            <p className="text-sm text-muted-foreground">
              Mise en page simple, structuree et lisible pour ATS et recruteurs
            </p>
          </div>

          <Button variant="outline" onClick={handleDownload} className="w-full md:w-auto">
            <Sparkles className="w-4 h-4 mr-2" />
            Print / Save PDF
          </Button>
        </div>
      )}

      <div
        id="cv-preview-content"
        className={`mx-auto max-w-[850px] rounded-lg border border-slate-300 bg-white shadow-sm ${
          compact ? "p-5 lg:p-6" : "p-6 lg:p-8"
        }`}
      >
        <header className={`border-b border-slate-300 ${compact ? "pb-3" : "pb-4"}`}>
          <h1 className={`${compact ? "text-[28px]" : "text-3xl"} font-bold tracking-tight text-slate-950`}>
            {fullName}
          </h1>

          {contactItems.length > 0 && (
            <p className={`${compact ? "mt-1.5 leading-5" : "mt-2 leading-5"} text-sm text-slate-700`}>
              {contactItems.join(" | ")}
            </p>
          )}

          <p className={`${compact ? "mt-2 leading-5" : "mt-3 leading-6"} text-sm text-slate-800`}>
            {personalInfo?.summary ||
              "Add a concise professional summary that highlights your experience, core skills, and target role."}
          </p>
        </header>

        <div className={`${compact ? "mt-4 space-y-4" : "mt-5 space-y-5"} text-sm text-slate-800`}>
          {experience.length > 0 && (
            <section>
              <h2 className="border-b border-slate-300 pb-1.5 text-base font-bold uppercase tracking-[0.14em] text-slate-900">
                Professional Experience
              </h2>

              <div className={`${compact ? "mt-3 space-y-3" : "mt-4 space-y-4"}`}>
                {experience.map((exp) => (
                  <article key={exp.id}>
                    <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-950">
                          {exp.position || "Job Title"}
                        </h3>
                        <p className="text-slate-700">
                          {[exp.company || "Company", exp.location].filter(Boolean).join(" | ")}
                        </p>
                      </div>

                      <p className="text-slate-600 md:text-right">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </p>
                    </div>

                    {exp.description && (
                      <p className={`${compact ? "mt-1 leading-5" : "mt-1.5 leading-6"} text-slate-800`}>
                        {exp.description}
                      </p>
                    )}

                    {exp.achievements?.length > 0 && (
                      <ul className={`${compact ? "mt-1 space-y-0.5 leading-5" : "mt-1.5 space-y-1 leading-6"} list-disc pl-5`}>
                        {exp.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="border-b border-slate-300 pb-1.5 text-base font-bold uppercase tracking-[0.14em] text-slate-900">
                Education
              </h2>

              <div className={`${compact ? "mt-3 space-y-3" : "mt-4 space-y-4"}`}>
                {education.map((edu) => (
                  <article key={edu.id}>
                    <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-950">
                          {[edu.degree || "Degree", edu.field].filter(Boolean).join(", ")}
                        </h3>
                        <p className="text-slate-700">{edu.school || "Institution"}</p>
                      </div>

                      <p className="text-slate-600 md:text-right">
                        {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                      </p>
                    </div>

                    {edu.description && (
                      <p className={`${compact ? "mt-1 leading-5" : "mt-1.5 leading-6"} text-slate-800`}>
                        {edu.description}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {Object.keys(groupedSkills).length > 0 && (
            <section>
              <h2 className="border-b border-slate-300 pb-1.5 text-base font-bold uppercase tracking-[0.14em] text-slate-900">
                Skills
              </h2>

              <div className={`${compact ? "mt-3 space-y-1" : "mt-4 space-y-1.5"}`}>
                {Object.entries(groupedSkills).map(([category, items]) => (
                  <p key={category} className={compact ? "leading-5" : "leading-6"}>
                    <span className="font-semibold text-slate-950">{category}:</span>{" "}
                    <span>{items.join(", ")}</span>
                  </p>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2 className="border-b border-slate-300 pb-1.5 text-base font-bold uppercase tracking-[0.14em] text-slate-900">
                Projects
              </h2>

              <div className={`${compact ? "mt-3 space-y-3" : "mt-4 space-y-4"}`}>
                {projects.map((project) => (
                  <article key={project.id}>
                    <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-950">
                          {project.name || "Project"}
                        </h3>
                        {project.technologies?.length > 0 && (
                          <p className="text-slate-700">{project.technologies.join(", ")}</p>
                        )}
                        {project.url && <p className="text-slate-700">{project.url}</p>}
                      </div>

                      <p className="text-slate-600 md:text-right">
                        {formatDateRange(project.startDate, project.endDate)}
                      </p>
                    </div>

                    <p className={`${compact ? "mt-1 leading-5" : "mt-1.5 leading-6"} text-slate-800`}>
                      {project.description ||
                        "Describe the project context, your role, the tools used, and the measurable outcome."}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h2 className="border-b border-slate-300 pb-1.5 text-base font-bold uppercase tracking-[0.14em] text-slate-900">
                Certifications
              </h2>

              <div className={`${compact ? "mt-3 space-y-2" : "mt-4 space-y-3"}`}>
                {certifications.map((cert) => (
                  <article key={cert.id}>
                    <p className="font-semibold text-slate-950">{cert.name}</p>
                    <p className="text-slate-700">
                      {[cert.issuer, cert.date].filter(Boolean).join(" | ")}
                    </p>
                    {cert.url && <p className="text-slate-700">{cert.url}</p>}
                  </article>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h2 className="border-b border-slate-300 pb-1.5 text-base font-bold uppercase tracking-[0.14em] text-slate-900">
                Languages
              </h2>

              <div className={`${compact ? "mt-3 space-y-0.5" : "mt-4 space-y-1"}`}>
                {languages.map((lang) => (
                  <p key={lang.id} className={compact ? "leading-5" : "leading-6"}>
                    <span className="font-semibold text-slate-950">{lang.name}:</span>{" "}
                    <span>{lang.level}</span>
                  </p>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
