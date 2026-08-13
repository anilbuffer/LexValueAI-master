"use client"
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Check, ShieldCheck, ArrowRight } from "lucide-react"
import Link from "next/link"
import { CaseDetailsForm } from "@/components/cases/CaseDetailsForm"
import { DocumentUploadArea, TempFile } from "@/components/cases/DocumentUploadArea"
import { getMockCases } from "@/lib/mock-data"

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

  const [files, setFiles] = useState<TempFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
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
    
    // Simulate upload progress
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
    if (pdfFiles.length !== allFiles.length) toast.error("Only PDF files are supported.")
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
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
      if (files.some(f => f.status === 'uploading')) {
        toast.error("Please wait for all files to finish uploading.");
        return;
      }
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API creation
    setTimeout(() => {
      toast.success('Case created and files processing successfully!')
      router.push('/cases')
    }, 1000)
  }

  const steps = [
    { id: 1, title: 'Case Details', desc: 'Basic information' },
    { id: 2, title: 'Upload Files', desc: 'Medical records' },
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

              {/* STEP 2: Document Upload */}
              {currentStep === 2 && (
                <DocumentUploadArea
                  files={files}
                  isDragging={isDragging}
                  handleDragOver={handleDragOver}
                  handleDragLeave={handleDragLeave}
                  handleDrop={handleDrop}
                  handleFileInput={handleFileInput}
                  removeFile={removeFile}
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
                    disabled={currentStep === 2 && files.some(f => f.status === 'uploading')}
                    className="h-12 flex justify-center items-center px-5 border border-transparent rounded-lg text-sm font-medium text-white bg-teal-900 hover:bg-teal-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 transition-all cursor-pointer group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Next Step
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
