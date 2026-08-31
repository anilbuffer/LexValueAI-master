"use client"
import React, { useRef } from 'react'
import { UploadCloud, FileText, X, RotateCw, CheckCircle2 } from 'lucide-react'

export type TempFile = {
  file: File
  id: string
  progress: number
  status: 'pending' | 'uploading' | 'done' | 'error'
  s3Key?: string
}

export type PhotoFile = {
  id: string
  file: File
  previewUrl: string
  status: 'pending' | 'uploading' | 'done' | 'error'
  progress: number
}

interface Step2FilesProps {
  files: TempFile[]
  isDragging: boolean
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeFile: (id: string) => void
}

export function Step2UploadFiles({
  files,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileInput,
  removeFile
}: Step2FilesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex-1">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Upload Files</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Upload case documents and associated files.</p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        className="hidden"
        onChange={handleFileInput}
      />

      {/* Dashed Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full min-h-[220px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all duration-300 ${
          isDragging ? 'border-teal-600 bg-teal-50/50 scale-[1.005]' : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 border border-slate-100 text-teal-600">
          <UploadCloud className="w-7 h-7 text-teal-600" />
        </div>

        <h3 className="text-base font-bold text-slate-800 mb-1">Drop your files here</h3>
        <p className="text-xs text-slate-400 font-medium mb-4">Only PDF format is supported securely.</p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="h-10 px-5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-lg text-sm font-semibold shadow-xs transition-all cursor-pointer"
        >
          Browse Files
        </button>
      </div>

      {/* Selected Files Section */}
      {files.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            SELECTED FILES ({files.length})
          </h4>

          <div className="flex flex-col gap-2.5 max-h-[240px] overflow-y-auto pr-1">
            {files.map((tf) => (
              <div
                key={tf.id}
                className="relative overflow-hidden border border-slate-200 rounded-xl bg-white p-3.5 flex flex-col justify-between shadow-xs transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-800 truncate">{tf.file.name}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {tf.status === 'uploading' ? (
                      <RotateCw className="w-4 h-4 text-teal-600 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(tf.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-md transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar line along bottom */}
                <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-teal-600 h-full transition-all duration-200 rounded-full"
                    style={{ width: `${tf.progress || 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface Step3MediaProps {
  damagePhotos: PhotoFile[]
  isDragging: boolean
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  handlePhotoInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  removePhoto: (id: string) => void
}

export function Step3UploadMedia({
  damagePhotos,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handlePhotoInput,
  removePhoto
}: Step3MediaProps) {
  const mediaInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex-1">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Upload Media (Optional)</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Upload injury photos, scene videos, or other visual evidence.</p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={mediaInputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/webp,video/mp4,.heic,.jpg,.jpeg,.png,.mp4"
        multiple
        className="hidden"
        onChange={handlePhotoInput}
      />

      {/* Dashed Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full min-h-[220px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all duration-300 ${
          isDragging ? 'border-teal-600 bg-teal-50/50 scale-[1.005]' : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 border border-slate-100 text-teal-600">
          <UploadCloud className="w-7 h-7 text-teal-600" />
        </div>

        <h3 className="text-base font-bold text-slate-800 mb-1">Drop your media here</h3>
        <p className="text-xs text-slate-400 font-medium mb-4">Images (JPG/PNG) and Videos (MP4) are supported securely.</p>

        <button
          type="button"
          onClick={() => mediaInputRef.current?.click()}
          className="h-10 px-5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-lg text-sm font-semibold shadow-xs transition-all cursor-pointer"
        >
          Browse Media
        </button>
      </div>

      {/* Selected Media Grid */}
      {damagePhotos.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            SELECTED MEDIA ({damagePhotos.length})
          </h4>

          <div className="flex flex-wrap gap-4">
            {damagePhotos.map((photo) => (
              <div
                key={photo.id}
                className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-slate-200 shadow-md group shrink-0 bg-slate-900"
              >
                <img
                  src={photo.previewUrl}
                  alt="Uploaded media"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80"
                  }}
                />

                {/* Dark gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 pt-6 pb-2 px-2.5 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent flex flex-col justify-end">
                  <span className="text-[11px] font-bold text-white truncate drop-shadow-sm">
                    {photo.file.name || `media_${photo.id.slice(0, 5)}`}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> UPLOADED
                  </span>
                </div>

                {/* Top right circular delete button */}
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs z-10"
                  title="Remove media"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
