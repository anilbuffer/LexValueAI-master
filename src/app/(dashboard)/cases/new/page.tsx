"use client"
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Check, ShieldCheck, ArrowRight } from "lucide-react"
import Link from "next/link"
import { CaseDetailsForm } from "@/components/cases/CaseDetailsForm"
import { DocumentUploadArea, TempFile, PhotoFile, PropertyDamageMetadata } from "@/components/cases/DocumentUploadArea"
import { getMockCases, createMockCase, createMockPropertyDamage, mockFirm } from "@/lib/mock-data"

const SAMPLE_DAMAGE_PHOTOS: PhotoFile[] = [
  {
    id: "photo-sample-1",
    file: new File([""], "front_bumper_damage.jpg", { type: "image/jpeg" }),
    previewUrl: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&auto=format&fit=crop&q=80",
    status: "done",
    progress: 100
  },
  {
    id: "photo-sample-2",
    file: new File([""], "side_impact_damage.jpg", { type: "image/jpeg" }),
    previewUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80",
    status: "done",
    progress: 100
  },
  {
    id: "photo-sample-3",
    file: new File([""], "rear_collision_damage.jpg", { type: "image/jpeg" }),
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

  // Document & Photo state
  const [documentType, setDocumentType] = useState<string>('property_damage')
  const [files, setFiles] = useState<TempFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  // Property Damage Photos state with 3 sample vehicle photos
  const [damagePhotos, setDamagePhotos] = useState<PhotoFile[]>(SAMPLE_DAMAGE_PHOTOS)
  const [photoMetadata, setPhotoMetadata] = useState<PropertyDamageMetadata>({
    description: "",
    photoDate: new Date().toISOString().split('T')[0],
    source: "Attorney Upload"
  })
  const [photoSubStep, setPhotoSubStep] = useState<'select_type' | 'upload_photos' | 'review_photos'>('select_type')

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
    setFiles(prev => prev.map(f => f.id === tf.id ? { ...f, status: 'uploading' } : f));
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        clearInterval(interval);
        setFiles(prev => prev.map(f => f.id === tf.id ? { ...f, status: 'done', progress: 100, s3Key: `mock-key-${tf.id}` } : f));
      } else {
        setFiles(prev => prev.map(f => f.id === tf.id ? { ...f, progress: Math.min(progress, 99) } : f));
      }
    }, 200);
  }

  const processSelectedFiles = (allFiles: File[]) => {
    const pdfFiles = allFiles.filter(file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))
    if (pdfFiles.length !== allFiles.length) toast.error("Only PDF files are supported for document upload.")
    const validSizeFiles = pdfFiles.filter(file => file.size <= 200 * 1024 * 1024)
    if (validSizeFiles.length !== pdfFiles.length) toast.error("Some files exceed the 200MB limit and were skipped.")

    const uniqueFiles: File[] = [];
    const seenFiles = new Set(files.map(f => `${f.file.name}-${f.file.size}`));
    for (const newFile of validSizeFiles) {
      const key = `${newFile.name}-${newFile.size}`;
      if (seenFiles.has(key)) {
        toast.error(`File "${newFile.name}" is already selected.`);
      } else {
        seenFiles.add(key);
        uniqueFiles.push(newFile);
      }
    }

    const newTempFiles: TempFile[] = uniqueFiles.map(f => ({
      file: f, id: Math.random().toString(36).substring(2) + Date.now().toString(36), progress: 0, status: 'pending'
    }));
    setFiles(prev => [...prev, ...newTempFiles]);
    newTempFiles.forEach(tf => uploadTempFile(tf));
  }

  // Handle Photo selection and drag-and-drop
  const processSelectedPhotos = (allFiles: File[]) => {
    const imageFiles = allFiles.filter(file => 
      file.type.startsWith('image/') || 
      /\.(jpg|jpeg|png|heic|webp)$/i.test(file.name)
    )

    if (imageFiles.length !== allFiles.length) {
      toast.error("Some non-image files were skipped. Accepted formats: JPG, PNG, HEIC.")
    }

    const validSizePhotos = imageFiles.filter(file => file.size <= 25 * 1024 * 1024)
    if (validSizePhotos.length !== imageFiles.length) {
      toast.error("Some photos exceed the 25MB limit per photo.")
    }

    const newPhotoFiles: PhotoFile[] = validSizePhotos.map(f => ({
      id: Math.random().toString(36).substring(2) + Date.now().toString(36),
      file: f,
      previewUrl: URL.createObjectURL(f),
      status: 'done',
      progress: 100
    }))

    if (newPhotoFiles.length > 0) {
      setDamagePhotos(prev => [...prev, ...newPhotoFiles])
      setPhotoSubStep('review_photos')
      toast.success(`${newPhotoFiles.length} photo(s) added!`)
    }
  }

  const handlePhotoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedPhotos(Array.from(e.target.files))
    }
  }

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedPhotos(Array.from(e.dataTransfer.files))
    }
  }

  const removePhoto = (id: string) => {
    setDamagePhotos(prev => {
      const target = prev.find(p => p.id === id)
      if (target?.previewUrl && target.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(target.previewUrl)
      }
      const remaining = prev.filter(p => p.id !== id)
      if (remaining.length === 0 && photoSubStep === 'review_photos') {
        setPhotoSubStep('upload_photos')
      }
      return remaining
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (documentType === 'property_damage') {
      handlePhotoDrop(e)
    } else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
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
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.clientPhone) || formData.clientPhone.replace(/[^\d]/g, '').length < 7) {
      errors.clientPhone = "Invalid phone number"
    }

    if (!formData.clientAge) {
      errors.clientAge = "Client Age is required"
    } else if (isNaN(Number(formData.clientAge)) || Number(formData.clientAge) <= 0 || Number(formData.clientAge) > 130) {
      errors.clientAge = "Please enter a valid age"
    }

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
      if (documentType === 'property_damage') {
        if (photoSubStep === 'select_type') {
          if (damagePhotos.length > 0) {
            setPhotoSubStep('review_photos')
          } else {
            setPhotoSubStep('upload_photos')
          }
        } else if (photoSubStep === 'upload_photos') {
          if (damagePhotos.length === 0) {
            toast.error("Please select at least one Property Damage Photo or change document type.")
            return
          }
          setPhotoSubStep('review_photos')
        } else if (photoSubStep === 'review_photos') {
          setCurrentStep(3)
        }
      } else {
        if (files.some(f => f.status === 'uploading')) {
          toast.error("Please wait for all files to finish uploading.")
          return
        }
        setCurrentStep(3)
      }
    }
  }

  const handleBack = () => {
    if (currentStep === 2) {
      if (documentType === 'property_damage') {
        if (photoSubStep === 'review_photos') {
          setPhotoSubStep('upload_photos')
          return
        } else if (photoSubStep === 'upload_photos') {
          setPhotoSubStep('select_type')
          return
        }
      }
      setCurrentStep(1)
    } else if (currentStep > 1) {
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
        description: photoMetadata.description || "Property damage photos uploaded during case creation.",
        repairEstimate: 8500.00,
        vehicleInfo: `${formData.title || 'Vehicle'} Damage`,
        createdAt: new Date()
      })
    }

    setTimeout(() => {
      toast.success('Case created and photos saved successfully!')
      router.push('/cases')
    }, 1000)
  }

  const steps = [
    { id: 1, title: 'Case Details', desc: 'Basic information' },
    { id: 2, title: 'Upload Files', desc: 'Medical records & photos' },
    { id: 3, title: 'AI Analysis', desc: 'Custom instructions' }
  ]

  return (
    <div className="w-full min-h-[calc(100vh-100px)] flex flex-col justify-center items-center pt-[20px] pb-[30px] px-4">
      <div className="w-full max-w-5xl font-sans relative flex flex-col gap-5">

        <Link href="/cases" className="h-12 px-4 flex items-center gap-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all cursor-pointer w-fit bg-white">
          <ArrowLeft className="w-4 h-4" />
          Back to Cases
        </Link>

        <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-200/50 overflow-hidden flex flex-col min-h-[600px]">

          {/* Top Bar: Stepper UI */}
          <div className="w-full bg-slate-50/50 border-b border-slate-100 p-6 sm:p-8 flex flex-col">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Case</h1>
              <p className="text-slate-500 text-sm mt-2 font-medium leading-relaxed">Follow the steps to set up your case and start analysis securely.</p>
            </div>

            <div className="flex flex-row justify-between relative max-w-3xl mx-auto w-full">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep
                const isCompleted = step.id < currentStep

                return (
                  <div key={step.id} className="flex flex-col items-center gap-3 relative flex-1">
                    {/* Horizontal line connecting steps */}
                    {index < steps.length - 1 && (
                      <div className={`absolute top-5 left-[50%] right-[-50%] h-0.5 transition-colors duration-500 ${isCompleted ? 'bg-teal-600' : 'bg-slate-200'}`}></div>
                    )}

                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm transition-all duration-300 shadow-sm z-10 relative ${isActive ? 'bg-teal-600 text-white ring-4 ring-teal-100 shadow-teal-600/20' : isCompleted ? 'bg-teal-600 text-white' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
                      {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <span className={`text-sm sm:text-base font-bold transition-colors leading-tight ${isActive || isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</span>
                      <span className="hidden sm:block text-xs font-medium text-slate-500 mt-1 leading-tight">{step.desc}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom Side: Step Content */}
          <div className="w-full flex flex-col relative bg-white flex-1">

            <div className="p-8 flex-1 flex flex-col overflow-y-auto">
              {/* STEP 1: Basic Details */}
              {currentStep === 1 && (
                <CaseDetailsForm
                  formData={formData}
                  setFormData={setFormData}
                  formErrors={formErrors}
                  setFormErrors={setFormErrors}
                  existingCases={existingCases}
                />
              )}

              {/* STEP 2: Document Upload & Property Damage Photos */}
              {currentStep === 2 && (
                <DocumentUploadArea
                  files={files}
                  isDragging={isDragging}
                  handleDragOver={handleDragOver}
                  handleDragLeave={handleDragLeave}
                  handleDrop={handleDrop}
                  handleFileInput={handleFileInput}
                  removeFile={removeFile}
                  documentType={documentType}
                  setDocumentType={setDocumentType}
                  damagePhotos={damagePhotos}
                  photoMetadata={photoMetadata}
                  setPhotoMetadata={setPhotoMetadata}
                  photoSubStep={photoSubStep}
                  setPhotoSubStep={setPhotoSubStep}
                  handlePhotoInput={handlePhotoInput}
                  removePhoto={removePhoto}
                  handlePhotoDrop={handlePhotoDrop}
                  onSaveAndContinue={handleNext}
                />
              )}

              {/* STEP 3: AI Prompt */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full flex-1">
                  <div className="mb-2">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Analysis</h2>
                    <p className="text-sm text-slate-500 mt-1">Configure custom extraction rules for the AI.</p>
                  </div>

                  <div className="flex flex-col gap-4 h-full flex-1">
                    <div className="space-y-1.5 flex flex-col flex-1">
                      <label htmlFor="customPrompt" className="text-sm font-semibold text-slate-900 block shrink-0">
                        Instructions <span className="text-slate-400 font-medium">(Optional)</span>
                      </label>
                      <textarea
                        id="customPrompt"
                        placeholder="e.g., 'Extract all mentions of pre-existing knee conditions', 'Highlight any inconsistencies in the police report'."
                        value={formData.customPrompt}
                        onChange={(e) => setFormData(prev => ({ ...prev, customPrompt: e.target.value }))}
                        className="block w-full flex-1 p-4 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all text-sm resize-none shadow-sm"
                      />
                    </div>

                    <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-lg flex gap-3 mt-2 shrink-0">
                      <ShieldCheck className="w-6 h-6 text-teal-600 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-teal-900 mb-0.5">HIPAA Compliant Processing</h4>
                        <p className="text-xs text-teal-700/80 font-medium leading-relaxed">
                          All instructions and documents are processed inside your firm's isolated environment. Data is never shared or logged insecurely.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between mt-auto rounded-br-2xl">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="h-12 flex justify-center items-center px-5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer"
                  >
                    Back
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentStep === 2 && documentType !== 'property_damage' && files.some(f => f.status === 'uploading')}
                    className="h-12 flex justify-center items-center px-5 border border-transparent rounded-lg text-sm font-medium text-white bg-teal-900 hover:bg-teal-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 transition-all cursor-pointer group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {currentStep === 2 && documentType === 'property_damage' && photoSubStep === 'review_photos'
                      ? "Save & Continue"
                      : "Continue"}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="h-12 flex justify-center items-center px-8 border border-transparent rounded-lg text-sm font-medium text-white bg-teal-900 hover:bg-teal-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
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
