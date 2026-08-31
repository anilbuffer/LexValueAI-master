"use client"
import React, { useRef } from 'react'
import { UploadCloud, FileText, X, Camera, Info, Calendar, Plus, Check, ArrowRight } from 'lucide-react'

export type TempFile = {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  s3Key?: string;
}

export type PhotoFile = {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
}

export type PropertyDamageMetadata = {
  description: string;
  photoDate: string;
  source: string;
}

interface DocumentUploadAreaProps {
  files: TempFile[]
  isDragging: boolean
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeFile: (id: string) => void

  // Document Type selection state
  documentType: string
  setDocumentType: (type: string) => void

  // Property Damage Photos state
  damagePhotos: PhotoFile[]
  photoMetadata: PropertyDamageMetadata
  setPhotoMetadata: React.Dispatch<React.SetStateAction<PropertyDamageMetadata>>

  // Sub-step view: 'select_type' | 'upload_photos' | 'review_photos'
  photoSubStep: 'select_type' | 'upload_photos' | 'review_photos'
  setPhotoSubStep: (step: 'select_type' | 'upload_photos' | 'review_photos') => void

  handlePhotoInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  removePhoto: (id: string) => void
  handlePhotoDrop: (e: React.DragEvent) => void
  onSaveAndContinue?: () => void
}

export function DocumentUploadArea({
  files,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileInput,
  removeFile,
  documentType,
  setDocumentType,
  damagePhotos,
  photoMetadata,
  setPhotoMetadata,
  photoSubStep,
  setPhotoSubStep,
  handlePhotoInput,
  removePhoto,
  handlePhotoDrop,
  onSaveAndContinue,
}: DocumentUploadAreaProps) {
  const photoInputRef = useRef<HTMLInputElement>(null)

  const documentTypes = [
    { id: 'medical', label: 'Medical Records', desc: 'Hospital charts, diagnostic reports, physician notes' },
    { id: 'accident', label: 'Accident / Police Report', desc: 'Official incident & police reports' },
    { id: 'insurance', label: 'Insurance Documents', desc: 'Policy declarations, claims & coverage details' },
    { id: 'property_damage', label: 'Property Damage Photos', isNew: true, desc: 'Photos showing vehicle damage or accident impact' },
    { id: 'other', label: 'Other Documents', desc: 'General correspondence & miscellaneous files' },
  ]

  // Render Step 2 (a): Document Type Selection
  if (photoSubStep === 'select_type') {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Upload Files</h2>
          <p className="text-sm text-slate-500 mt-1">Add documents and photos related to this case.</p>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-slate-900 block">Select Document Type</label>
          <div className="grid grid-cols-1 gap-3">
            {documentTypes.map((dt) => {
              const isSelected = documentType === dt.id
              return (
                <div
                  key={dt.id}
                  onClick={() => setDocumentType(dt.id)}
                  className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/40 ring-2 ring-teal-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? 'border-teal-600 bg-teal-600' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{dt.label}</span>
                      {dt.isNew && (
                        <span className="px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">{dt.desc}</span>
                </div>
              )
            })}
          </div>

          {/* Info callout banner for Property Damage */}
          <div className="p-4 bg-teal-50/60 border border-teal-100 rounded-xl flex items-start gap-3 mt-2">
            <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-teal-900 font-medium leading-relaxed">
              Property Damage Photos help AI understand impact severity and strengthen settlement analysis.
            </p>
          </div>
        </div>

        {/* Selected files count if any standard docs uploaded */}
        {documentType !== 'property_damage' && files.length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selected PDF Files ({files.length})</h4>
            <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
              {files.map((tf) => (
                <div key={tf.id} className="flex items-center justify-between px-3 py-2 border border-slate-200 rounded-lg bg-white shadow-sm">
                  <div className="flex items-center gap-3 truncate">
                    <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="text-sm font-medium text-slate-700 truncate">{tf.file.name}</span>
                  </div>
                  <button type="button" onClick={() => removeFile(tf.id)} className="text-slate-400 hover:text-rose-500 p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Render Step 3: Upload Property Damage Photos (Dropzone)
  if (photoSubStep === 'upload_photos' && damagePhotos.length === 0) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Upload Property Damage Photos</h2>
          <p className="text-sm text-slate-500 mt-1">Add photos showing vehicle damage or accident impact.</p>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handlePhotoDrop}
          className={`w-full flex-1 min-h-[260px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all duration-300 ${
            isDragging ? 'border-teal-500 bg-teal-50/50 scale-[1.01]' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
          }`}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100 text-teal-600">
            <UploadCloud className="w-8 h-8 text-teal-600" />
          </div>

          <h3 className="text-base font-bold text-slate-800 mb-1">Drag & drop photos here</h3>
          <span className="text-xs text-slate-400 font-medium mb-4">or</span>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/heic,image/webp,.heic,.jpg,.jpeg,.png"
            multiple
            className="hidden"
            onChange={handlePhotoInput}
          />
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="h-11 px-7 bg-teal-900 hover:bg-teal-950 text-white rounded-lg text-sm font-semibold shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Choose Photos
          </button>

          <p className="text-xs text-slate-400 font-medium mt-6 text-center">
            Accepted formats: JPG, PNG, HEIC
            <br />
            Max file size: 25MB per photo
          </p>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={() => setPhotoSubStep('select_type')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 underline cursor-pointer"
          >
            ← Back to Document Type
          </button>
        </div>
      </div>
    )
  }

  // Render Step 4: Review & Add Details (Thumbnail preview & metadata fields)
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Review Uploaded Photos ({damagePhotos.length})</h2>
        <p className="text-sm text-slate-500 mt-1">Preview photos and add metadata.</p>
      </div>

      {/* Hidden file input for "Add More Photos" */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/webp,.heic,.jpg,.jpeg,.png"
        multiple
        className="hidden"
        onChange={handlePhotoInput}
      />

      {/* Photo Thumbnails Grid */}
      <div className="flex flex-wrap gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl min-h-[140px] items-center">
        {damagePhotos.map((photo) => (
          <div
            key={photo.id}
            className="relative w-32 h-28 sm:w-40 sm:h-32 rounded-xl overflow-hidden border-2 border-white shadow-md group shrink-0 bg-slate-200"
          >
            <img
              src={photo.previewUrl}
              alt="Property damage preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback SVG graphic if external URL fails
                const target = e.target as HTMLImageElement
                target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150" fill="%23e2e8f0"><rect width="200" height="150" fill="%23f1f5f9"/><path d="M40 100 L70 60 L100 90 L130 50 L170 100 Z" fill="%23cbd5e1"/><circle cx="60" cy="45" r="12" fill="%2394a3b8"/><text x="100" y="130" text-anchor="middle" font-size="12" fill="%2364748b" font-family="sans-serif">Vehicle Damage Photo</text></svg>`
              }}
            />

            {/* Red Circular X Delete Button */}
            <button
              type="button"
              onClick={() => removePhoto(photo.id)}
              className="absolute top-2 right-2 w-6 h-6 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer z-10"
              title="Remove photo"
            >
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        ))}

        {/* Add Photo Button Card */}
        <button
          type="button"
          onClick={() => photoInputRef.current?.click()}
          className="w-32 h-28 sm:w-40 sm:h-32 rounded-xl border-2 border-dashed border-slate-300 hover:border-teal-500 hover:bg-teal-50/50 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-teal-600 transition-all cursor-pointer bg-white shrink-0 shadow-sm"
        >
          <Plus className="w-6 h-6" />
          <span className="text-xs font-semibold">Add Photo</span>
        </button>
      </div>

      {/* Photo Metadata Form */}
      <div className="grid grid-cols-1 gap-4 pt-1">
        {/* Photo Description (Optional) */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-800 block">
            Photo Description <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Front bumper damage"
            value={photoMetadata.description}
            onChange={(e) => setPhotoMetadata((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full h-11 px-4 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date of Photos (Optional) */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-800 block">
              Date of Photos <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={photoMetadata.photoDate}
                onChange={(e) => setPhotoMetadata((prev) => ({ ...prev, photoDate: e.target.value }))}
                className="w-full h-11 px-4 pr-10 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all shadow-sm"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Source (Optional) */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-800 block">
              Source <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <select
              value={photoMetadata.source}
              onChange={(e) => setPhotoMetadata((prev) => ({ ...prev, source: e.target.value }))}
              className="w-full h-11 px-4 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all shadow-sm"
            >
              <option value="Attorney Upload">Attorney Upload</option>
              <option value="Client Upload">Client Upload</option>
              <option value="Insurance Adjuster">Insurance Adjuster</option>
              <option value="Repair / Body Shop">Repair / Body Shop</option>
              <option value="Police / Official">Police / Official</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons Row matching the brand design */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 mt-2">
        <button
          type="button"
          onClick={() => photoInputRef.current?.click()}
          className="h-11 px-6 border border-teal-600 text-teal-700 hover:bg-teal-50 rounded-lg text-sm font-semibold transition-all cursor-pointer bg-white"
        >
          Add More Photos
        </button>

        {onSaveAndContinue && (
          <button
            type="button"
            onClick={onSaveAndContinue}
            className="h-11 px-7 bg-teal-900 hover:bg-teal-950 text-white rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-md flex items-center gap-2"
          >
            Save & Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
