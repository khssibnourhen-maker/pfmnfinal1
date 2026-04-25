"use client"

import { useEffect, useMemo, useState } from "react"
import { CVBuilderSteps } from "@/components/cv-builder/cv-builder-steps"
import { CVPreview } from "@/components/cv-builder/cv-preview"
import { CVData } from "@/lib/types/cv"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

const initialCVData: CVData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    linkedIn: "",
    portfolio: "",
    summary: "",
  },
  education: [],
  experience: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
}

const FINAL_STEP_INDEX = 7
const CV_DRAFT_STORAGE_KEY = "cv_builder_draft_v1"

export default function CVBuilderPage() {
  const { user, isLoading } = useAuth()
  const [cvData, setCVData] = useState<CVData>(initialCVData)
  const [currentStep, setCurrentStep] = useState(0)
  const [draftLoaded, setDraftLoaded] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  const draftStorageKey = useMemo(
    () => `${CV_DRAFT_STORAGE_KEY}_${user?.id || "guest"}`,
    [user?.id]
  )

  useEffect(() => {
    if (isLoading) return

    const fallbackPersonalInfo = {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    }

    try {
      const storedDraft = localStorage.getItem(draftStorageKey)

      if (storedDraft) {
        const parsed = JSON.parse(storedDraft) as {
          cvData?: CVData
          currentStep?: number
        }

        setCVData({
          ...initialCVData,
          ...parsed.cvData,
          personalInfo: {
            ...initialCVData.personalInfo,
            ...parsed.cvData?.personalInfo,
            firstName: parsed.cvData?.personalInfo?.firstName || fallbackPersonalInfo.firstName,
            lastName: parsed.cvData?.personalInfo?.lastName || fallbackPersonalInfo.lastName,
            email: parsed.cvData?.personalInfo?.email || fallbackPersonalInfo.email,
          },
        })

        if (typeof parsed.currentStep === "number") {
          setCurrentStep(parsed.currentStep)
        }
      } else {
        setCVData((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            firstName: prev.personalInfo.firstName || fallbackPersonalInfo.firstName,
            lastName: prev.personalInfo.lastName || fallbackPersonalInfo.lastName,
            email: prev.personalInfo.email || fallbackPersonalInfo.email,
          },
        }))
      }
    } catch {
      setCVData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          firstName: prev.personalInfo.firstName || fallbackPersonalInfo.firstName,
          lastName: prev.personalInfo.lastName || fallbackPersonalInfo.lastName,
          email: prev.personalInfo.email || fallbackPersonalInfo.email,
        },
      }))
    } finally {
      setDraftLoaded(true)
    }
  }, [draftStorageKey, isLoading, user])

  useEffect(() => {
    if (!draftLoaded) return

    const nextData: CVData = {
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        firstName: cvData.personalInfo.firstName || user?.firstName || "",
        lastName: cvData.personalInfo.lastName || user?.lastName || "",
        email: cvData.personalInfo.email || user?.email || "",
      },
    }

    if (
      nextData.personalInfo.firstName !== cvData.personalInfo.firstName ||
      nextData.personalInfo.lastName !== cvData.personalInfo.lastName ||
      nextData.personalInfo.email !== cvData.personalInfo.email
    ) {
      setCVData(nextData)
      return
    }

    localStorage.setItem(
      draftStorageKey,
      JSON.stringify({
        cvData: nextData,
        currentStep,
        updatedAt: new Date().toISOString(),
      })
    )
  }, [currentStep, cvData, draftLoaded, draftStorageKey, user?.email, user?.firstName, user?.lastName])

  useEffect(() => {
    if (currentStep === FINAL_STEP_INDEX) {
      setShowPreview(false)
    }
  }, [currentStep])

  const handleResetDraft = () => {
    localStorage.removeItem(draftStorageKey)
    setCVData({
      ...initialCVData,
      personalInfo: {
        ...initialCVData.personalInfo,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
      },
    })
    setCurrentStep(0)
  }

  const canShowPreview = currentStep !== FINAL_STEP_INDEX

  return (
    <div className="flex h-[calc(100vh-0px)]">
      <div className={`flex-1 overflow-auto transition-all duration-300 ${showPreview && canShowPreview ? "lg:w-1/2" : "w-full"}`}>
        <div className="p-6 lg:p-8 space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Professional CV Builder</h1>
              <p className="text-muted-foreground mt-2">
                Cree un CV plus professionnel puis lance l'analyse IA pour recevoir des recommandations concretes sur ton profil, ton CV et ta carriere.
              </p>
            </div>

            {canShowPreview && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview((prev) => !prev)}
                className="gap-2"
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPreview ? "Close preview" : "Open preview"}
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
            <p className="text-muted-foreground">
              {draftLoaded
                ? "Draft mode active: your CV is auto-saved and restored after refresh."
                : "Loading your saved CV draft..."}
            </p>
            <Button variant="outline" size="sm" onClick={handleResetDraft} disabled={!draftLoaded}>
              Reset draft
            </Button>
          </div>

          <CVBuilderSteps
            cvData={cvData}
            setCVData={setCVData}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </div>
      </div>

      {showPreview && canShowPreview && (
        <div className="hidden lg:block w-1/2 border-l border-border bg-muted/30 overflow-auto">
          <div className="space-y-6">
            <CVPreview cvData={cvData} />
          </div>
        </div>
      )}
    </div>
  )
}
