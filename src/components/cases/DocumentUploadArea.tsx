import React from 'react'
import { UploadCloud, FileText, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export type TempFile = {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  s3Key?: string;
}

interface DocumentUploadAreaProps {
  files: TempFile[]
  isDragging: boolean
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeFile: (id: string) => void
}

export function DocumentUploadArea({ files, isDragging, handleDragOver, handleDragLeave, handleDrop, handleFileInput, removeFile }: DocumentUploadAreaProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Upload Files</h2>
        <p className="text-sm text-slate-500 mt-1">Upload medical records and associated files.</p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 transition-all duration-300 ${isDragging ? "border-teal-500 bg-teal-50/50 scale-[1.02]" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
          }`}
      >
        <div className={`w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
          <UploadCloud className="w-8 h-8 text-teal-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Drop your files here</h3>
        <p className="text-sm text-slate-500 font-medium mb-8 text-center max-w-sm">
          Only PDF format is supported securely.
        </p>

        <label className="h-10 flex items-center px-6 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 hover:bg-slate-50 hover:text-teal-700 shadow-sm transition-all cursor-pointer">
          Browse Files
          <input type="file" accept=".pdf,application/pdf" multiple className="hidden" onChange={handleFileInput} />
        </label>
      </div>

        <div className="mt-2 flex flex-col gap-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selected Files ({files.length})</h4>
          <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto pr-1">
            {files.map((tf) => (
              <div key={tf.id} className="flex flex-col gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white group hover:border-teal-400 transition-colors shadow-sm w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-1.5 bg-teal-50 text-teal-600 rounded-md shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{tf.file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tf.status === 'uploading' && <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />}
                    {tf.status === 'done' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {tf.status === 'error' && <AlertCircle className="w-4 h-4 text-rose-500" />}
                    <button
                      type="button"
                      onClick={() => removeFile(tf.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {tf.status === 'uploading' && (
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-teal-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${tf.progress}%` }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}
