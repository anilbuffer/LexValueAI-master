"use client"

import { useState } from "react"
import { UploadCloud, FileText, CheckCircle2, X, AlertCircle, Loader2, Info, ChevronDown } from "lucide-react"

type StagedFile = {
  id: string;
  file: File;
  category: string;
  notes: string;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
};

const DOCUMENT_CATEGORIES = [
  "Medical Records",
  "Medical Bills",
  "Police Report",
  "Photographs",
  "Insurance Documents",
  "Lost Wages Verification",
  "Other"
];

export function PortalDocumentUpload({ caseId }: { caseId: string }) {
  const [isDragging, setIsDragging] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, size: number, category: string}[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
      // Reset input so the same file can be selected again if removed
      e.target.value = '';
    }
  };

  const handleFiles = (files: File[]) => {
    const newStaged = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      category: "Other",
      notes: "",
      progress: 0,
      status: 'pending' as const
    }));
    setStagedFiles(prev => [...prev, ...newStaged]);
  };

  const updateStagedFile = (id: string, field: keyof StagedFile, value: any) => {
    setStagedFiles(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const removeStagedFile = (id: string) => {
    setStagedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUploadAll = async () => {
    if (stagedFiles.length === 0) return;
    
    setIsUploading(true);
    
    const currentStaged = [...stagedFiles];
    
    // Simulate uploading each file sequentially
    for (let i = 0; i < currentStaged.length; i++) {
       const fileToUpload = currentStaged[i];
       
       updateStagedFile(fileToUpload.id, 'status', 'uploading');
       
       // simulate progress chunks
       for (let p = 0; p <= 100; p += 25) {
         updateStagedFile(fileToUpload.id, 'progress', p);
         await new Promise(r => setTimeout(r, 150));
       }
       
       updateStagedFile(fileToUpload.id, 'status', 'complete');
       
       // Add to uploaded list
       setUploadedFiles(prev => [...prev, {
         name: fileToUpload.file.name,
         size: fileToUpload.file.size,
         category: fileToUpload.category
       }]);
    }
    
    // Clear staged files after a short delay
    setTimeout(() => {
      setStagedFiles([]);
      setIsUploading(false);
    }, 800);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const pendingCount = stagedFiles.filter(f => f.status === 'pending').length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-teal-600" />
          Secure Document Upload
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Upload medical records, bills, photos, or any other documents requested by your legal team.
        </p>
      </div>
      
      <div className="p-6">
        {/* Dropzone area */}
        <div 
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${
            isDragging ? 'border-teal-500 bg-teal-50' : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'
          } ${stagedFiles.length > 0 ? 'py-6' : 'py-12'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
            <UploadCloud className={`w-6 h-6 ${isDragging ? 'text-teal-600' : 'text-slate-400'}`} />
          </div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">Drag and drop files here</h3>
          <p className="text-sm text-slate-500 mb-4">or click to browse from your device</p>
          
          <input 
            type="file" 
            id="portal-upload" 
            className="hidden" 
            multiple 
            onChange={handleFileInput}
            disabled={isUploading}
          />
          <label 
            htmlFor="portal-upload"
            className={`px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium transition-colors shadow-sm ${
              isUploading 
                ? 'opacity-50 cursor-not-allowed text-slate-400' 
                : 'text-slate-700 hover:bg-slate-50 hover:text-teal-700 hover:border-teal-300 cursor-pointer'
            }`}
          >
            Select Files
          </label>
        </div>

        {/* Staged Files for Preparation */}
        {stagedFiles.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-semibold text-slate-800">Prepare Files for Upload</h4>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {stagedFiles.length} file{stagedFiles.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
              {stagedFiles.map((staged) => (
                <div key={staged.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm relative">
                  
                  {/* Progress Bar Background */}
                  {staged.status !== 'pending' && (
                    <div 
                      className={`absolute top-0 left-0 h-full transition-all duration-300 ease-out opacity-10 pointer-events-none ${
                        staged.status === 'complete' ? 'bg-emerald-500 w-full' : 'bg-teal-500'
                      }`}
                      style={{ width: `${staged.progress}%` }}
                    />
                  )}

                  <div className="p-4 relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      
                      {/* File Info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          staged.status === 'complete' ? 'bg-emerald-50 text-emerald-600' : 'bg-teal-50 text-teal-600'
                        }`}>
                          {staged.status === 'complete' ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-800 truncate" title={staged.file.name}>{staged.file.name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                            {formatFileSize(staged.file.size)}
                            
                            {staged.status === 'uploading' && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-teal-600 font-medium flex items-center gap-1">
                                  <Loader2 className="w-3 h-3 animate-spin" /> {staged.progress}%
                                </span>
                              </>
                            )}
                            
                            {staged.status === 'complete' && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-emerald-600 font-medium">Uploaded - Under Review</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Remove Button */}
                      {staged.status === 'pending' && (
                        <button 
                          onClick={() => removeStagedFile(staged.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    {/* Metadata Form (only editable when pending) */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Document Category</label>
                        <div className="relative">
                          <select 
                            value={staged.category}
                            onChange={(e) => updateStagedFile(staged.id, 'category', e.target.value)}
                            disabled={staged.status !== 'pending'}
                            className="w-full text-sm border border-slate-200 rounded-lg h-9 pl-3 pr-8 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-70 disabled:bg-slate-50"
                          >
                            {DOCUMENT_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Notes (Optional)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Bill from Dr. Smith for 10/12 visit"
                          value={staged.notes}
                          onChange={(e) => updateStagedFile(staged.id, 'notes', e.target.value)}
                          disabled={staged.status !== 'pending'}
                          className="w-full text-sm border border-slate-200 rounded-lg h-9 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-slate-400 disabled:opacity-70 disabled:bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`flex justify-end gap-3 ${stagedFiles.length > 0 ? 'mt-4 pt-4 border-t border-slate-100' : 'mt-6'}`}>
          <button
            type="button"
            onClick={() => setStagedFiles([])}
            disabled={isUploading || stagedFiles.length === 0}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel All
          </button>
          <button
            type="button"
            onClick={handleUploadAll}
            disabled={isUploading || pendingCount === 0}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                Submit / Save {pendingCount > 0 ? pendingCount : ''} File{pendingCount !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>

        {/* Previously Uploaded Files Summary (Optional, since the main page has it too) */}
        {uploadedFiles.length > 0 && stagedFiles.length === 0 && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-emerald-800">
                Successfully uploaded {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}.
              </p>
              <p className="text-xs text-emerald-600/80 mt-1">
                Your legal team has been notified. These files will appear in your main document list momentarily.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
