"use client"
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Check, ShieldCheck, ArrowRight } from "lucide-react"
import Link from "next/link"
import { CaseDetailsForm } from "@/components/cases/CaseDetailsForm"
import { Step2UploadFiles, Step3UploadMedia, TempFile, PhotoFile } from "@/components/cases/DocumentUploadArea"
import { getMockCases, createMockCase, createMockPropertyDamage, mockFirm } from "@/lib/mock-data"

const SAMPLE_MEDIA_FILES: PhotoFile[] = [
  {
    id: "media-sample-1",
    file: new File([""], "images.jpg", { type: "image/jpeg" }),
    previewUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80",
    status: "done",
    progress: 100
  },
  {
    id: "media-sample-2",
    file: new File([""], "8UPEW2.png", { type: "image/png" }),
    previewUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80",
    status: "done",
    progress: 100
  }
]

export default function NewCasePage() {
  const router = useRouter()
  const [existingCases, setExistingCases] = useState<any[]>([])

  useEffect(() => {
    setExistingCases(getMockCases())
  }, [])

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    referenceId: "",
    title: "",
    client: "",
    clientEmail: "",
    clientPhone: "",
    clientAge: "",
    clientGender: "",
    clientAddress: "",
    type: "",
    dateOfInjury: "",
    customPrompt: "",
  })

  // Document (Step 2) & Photo Media (Step 3) state
  const [files, setFiles] = useState<TempFile[]>([
    {
      id: "doc-1",
      file: new File([""], "deidentified_standard (1).pdf", { type: "application/pdf" }),
      progress: 100,
      status: "done"
    }
  ])
  const [isDragging, setIsDragging] = useState(false)
  const [damagePhotos, setDamagePhotos] = useState<PhotoFile[]>(SAMPLE_MEDIA_FILES)
  const [formErrors, setFormErrors] = useState<any>({})

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const uploadTempFile = async (tf: TempFile) => {
    setFiles(prev => prev.map(f => f.id === tf.id ? { ...f, status: 'uploading' } : f))
    let progress = 0
    const interval = setInterval(() => {
      progress += 25
      if (progress >= 100) {
        clearInterval(interval)
        setFiles(prev => prev.map(f => f.id === tf.id ? { ...f, status: 'done', progress: 100 } : f))
      } else {
        setFiles(prev => prev.map(f => f.id === tf.id ? { ...f, progress } : f))
      }
    }, 150)
  }

  const processSelectedFiles = (allFiles: File[]) => {
    const pdfFiles = allFiles.filter(file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))
    if (pdfFiles.length !== allFiles.length) toast.error("Only PDF files are supported for document upload.")

    const newTempFiles: TempFile[] = pdfFiles.map(f => ({
      file: f, id: Math.random().toString(36).substring(2) + Date.now().toString(36), progress: 0, status: 'pending'
    }))
    setFiles(prev => [...prev, ...newTempFiles])
    newTempFiles.forEach(tf => uploadTempFile(tf))
  }

  const processSelectedPhotos = (allFiles: File[]) => {
    const mediaFiles = allFiles.filter(file =>
      file.type.startsWith('image/') || file.type.startsWith('video/') ||
      /\.(jpg|jpeg|png|heic|webp|mp4)$/i.test(file.name)
    )

    const newPhotoFiles: PhotoFile[] = mediaFiles.map(f => ({
      id: Math.random().toString(36).substring(2) + Date.now().toString(36),
      file: f,
      previewUrl: URL.createObjectURL(f),
      status: 'done',
      progress: 100
    }))

    if (newPhotoFiles.length > 0) {
      setDamagePhotos(prev => [...prev, ...newPhotoFiles])
      toast.success(`${newPhotoFiles.length} media file(s) added!`)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFiles(Array.from(e.target.files))
    }
  }

  const handlePhotoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedPhotos(Array.from(e.target.files))
    }
  }

  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleDropMedia = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedPhotos(Array.from(e.dataTransfer.files))
    }
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const removePhoto = (id: string) => {
    setDamagePhotos(prev => prev.filter(p => p.id !== id))
  }

  const validateStep1 = () => {
    const errors: any = {}
    if (!formData.referenceId?.trim()) {
      errors.referenceId = "Case ID is required"
    } else if (existingCases.some((c: any) => c.referenceId === formData.referenceId.trim())) {
      errors.referenceId = "This Case ID already exists"
    }
    if (!formData.title.trim()) errors.title = "Case Title is required"
    if (!formData.client.trim()) errors.client = "Client Name is required"

    if (!formData.clientEmail.trim()) {
      errors.clientEmail = "Client Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      errors.clientEmail = "Invalid email format"
    }

    if (!formData.clientPhone.trim()) {
      errors.clientPhone = "Client Phone is required"
    }
    if (!formData.clientAge) errors.clientAge = "Client Age is required"
    if (!formData.clientGender) errors.clientGender = "Client Gender is required"
    if (!formData.clientAddress.trim()) errors.clientAddress = "Client Address is required"
    if (!formData.type.trim()) errors.type = "Category is required"
    if (!formData.dateOfInjury) errors.dateOfInjury = "Date of Injury is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2)
      } else {
        toast.error("Please fill the required fields")
      }
    } else if (currentStep === 2) {
      if (files.some(f => f.status === 'uploading')) {
        toast.error("Please wait for files to finish uploading.")
        return
      }
      setCurrentStep(3)
    } else if (currentStep === 3) {
      setCurrentStep(4)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const newCaseId = `case-${Date.now()}`
    const createdCase = {
      id: newCaseId,
      referenceId: formData.referenceId,
      title: formData.title,
      client: formData.client,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      clientAge: Number(formData.clientAge),
      clientGender: formData.clientGender,
      clientAddress: formData.clientAddress,
      type: formData.type,
      dateOfInjury: new Date(formData.dateOfInjury),
      status: "ACTIVE",
      flags: 0,
      customPrompt: formData.customPrompt,
      approvalStatus: "APPROVED",
      rejectionReason: null,
      scanProgress: 100,
      scanStage: "COMPLETED",
      firmId: mockFirm.id,
      createdByUserId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      documents: [],
      assignedUsers: []
    }

    createMockCase(createdCase)

    if (damagePhotos.length > 0) {
      createMockPropertyDamage({
        id: `pd-${Date.now()}`,
        caseId: newCaseId,
        firmId: mockFirm.id,
        photos: damagePhotos.map(p => p.previewUrl),
        description: "Uploaded media files",
        repairEstimate: 5000.00,
        vehicleInfo: `${formData.title || 'Case'} Media`,
        createdAt: new Date()
      })
    }

    setTimeout(() => {
      toast.success('Case created successfully!')
      router.push('/cases')
    }, 1000)
  }

  const steps = [
    { id: 1, title: 'Case Details', desc: 'Basic information' },
    { id: 2, title: 'Upload Files', desc: 'Case documents' },
    { id: 3, title: 'Upload Media', desc: 'Images & Videos' },
    { id: 4, title: 'AI Analysis', desc: 'Custom instructions' }
  ]

  return (
    <div className="w-full min-h-[calc(100vh-100px)] flex flex-col justify-center items-center pt-[20px] pb-[30px] px-4">
      <div className="w-full max-w-5xl font-sans relative flex flex-col gap-5">

        <Link href="/cases" className="h-10 px-4 flex items-center gap-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer w-fit bg-white shadow-xs">
          <ArrowLeft className="w-4 h-4" />
          Back to Cases
        </Link>

        {/* Main Card with Left Sidebar Stepper + Right Content Area */}
        <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200/60 overflow-hidden flex flex-col md:flex-row min-h-[580px]">

          {/* LEFT SIDEBAR: Stepper */}
          <div className="w-full md:w-72 bg-slate-50/50 border-b md:border-b-0 md:border-r border-slate-200/60 p-6 md:p-8 flex flex-col shrink-0">
            <div className="mb-8">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create New Case</h1>
              <p className="text-slate-500 text-xs mt-2 font-medium leading-relaxed">
                Follow the steps to set up your case and start analysis securely.
              </p>
            </div>

            {/* Vertical Stepper */}
            <div className="flex flex-col gap-6 relative">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep
                const isCompleted = step.id < currentStep

                return (
                  <div key={step.id} className="flex items-start gap-4 relative">
                    {/* Vertical Connecting Line */}
                    {index < steps.length - 1 && (
                      <div className={`absolute top-9 left-4 w-0.5 h-8 transition-colors duration-300 ${isCompleted ? 'bg-teal-600' : 'bg-slate-200'}`} />
                    )}

                    {/* Step Icon / Number Circle */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs transition-all duration-300 z-10 ${
                      isActive 
                        ? 'bg-teal-600 text-white ring-4 ring-teal-100 shadow-sm' 
                        : isCompleted 
                        ? 'bg-teal-600 text-white' 
                        : 'bg-white text-slate-400 border-2 border-slate-200'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                    </div>

                    <div className="flex flex-col pt-0.5">
                      <span className={`text-xs font-bold leading-snug transition-colors ${isActive || isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.title}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                        {step.desc}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="flex-1 flex flex-col justify-between bg-white p-6 md:p-8">
            <div className="flex-1 flex flex-col">
              {/* STEP 1: Basic Case Details */}
              {currentStep === 1 && (
                <CaseDetailsForm
                  formData={formData}
                  setFormData={setFormData}
                  formErrors={formErrors}
                  setFormErrors={setFormErrors}
                  existingCases={existingCases}
                />
              )}

              {/* STEP 2: Upload Files */}
              {currentStep === 2 && (
                <Step2UploadFiles
                  files={files}
                  isDragging={isDragging}
                  handleDragOver={handleDragOver}
                  handleDragLeave={handleDragLeave}
                  handleDrop={handleDropFiles}
                  handleFileInput={handleFileInput}
                  removeFile={removeFile}
                />
              )}

              {/* STEP 3: Upload Media (Optional) */}
              {currentStep === 3 && (
                <Step3UploadMedia
                  damagePhotos={damagePhotos}
                  isDragging={isDragging}
                  handleDragOver={handleDragOver}
                  handleDragLeave={handleDragLeave}
                  handleDrop={handleDropMedia}
                  handlePhotoInput={handlePhotoInput}
                  removePhoto={removePhoto}
                />
              )}

              {/* STEP 4: AI Analysis */}
              {currentStep === 4 && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex-1">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Analysis</h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Configure custom extraction rules for the AI.</p>
                  </div>

                  <div className="flex flex-col gap-4 flex-1">
                    <div className="space-y-1.5 flex flex-col flex-1">
                      <label htmlFor="customPrompt" className="text-xs font-bold text-slate-800 block shrink-0 uppercase tracking-wider">
                        Instructions <span className="text-slate-400 font-normal lowercase">(optional)</span>
                      </label>
                      <textarea
                        id="customPrompt"
                        placeholder="e.g., 'Extract all mentions of pre-existing knee conditions', 'Highlight any inconsistencies in the police report'."
                        value={formData.customPrompt}
                        onChange={(e) => setFormData(prev => ({ ...prev, customPrompt: e.target.value }))}
                        className="block w-full min-h-[160px] p-4 border border-slate-200 rounded-xl text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all text-sm resize-none shadow-xs"
                      />
                    </div>

                    <div className="p-4 bg-teal-50/60 border border-teal-100 rounded-xl flex gap-3 mt-2 shrink-0">
                      <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-teal-900 mb-0.5">HIPAA Compliant Processing</h4>
                        <p className="text-xs text-teal-700/90 font-medium leading-relaxed">
                          All instructions and documents are processed inside your firm's isolated environment. Data is never shared or logged insecurely.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="h-10 px-5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
                  >
                    Back
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentStep === 2 && files.some(f => f.status === 'uploading')}
                    className="h-10 px-6 border border-transparent rounded-lg text-xs font-semibold text-white bg-teal-900 hover:bg-teal-950 transition-all cursor-pointer flex items-center gap-2 shadow-xs group disabled:opacity-70"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="h-10 px-7 border border-transparent rounded-lg text-xs font-semibold text-white bg-teal-900 hover:bg-teal-950 transition-all cursor-pointer shadow-xs disabled:opacity-70 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating Case...
                      </>
                    ) : (
                      "Create Case"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
