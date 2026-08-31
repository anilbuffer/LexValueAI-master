"use client"
import { useState } from "react"
import { 
  FileText, 
  Upload, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Image as ImageIcon
} from "lucide-react"
import toast from "react-hot-toast"

interface DocumentItem {
  id: string
  title: string
  size: string
  type: 'pdf' | 'doc'
}

interface MediaItem {
  id: string
  title: string
  size: string
  url: string
}

export function CaseDocumentsTab({ caseData }: { caseData?: any }) {
  const [activeTab, setActiveTab] = useState<'documents' | 'media'>('documents')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Document items matching reference screenshot (Image 3)
  const documents: DocumentItem[] = [
    {
      id: "doc-1",
      title: "deidentified_standard (1).pdf",
      size: "100.74 MB",
      type: "pdf"
    }
  ]

  // Media items matching reference screenshots (Image 4 & 5)
  const mediaItems: MediaItem[] = [
    {
      id: "media-1",
      title: "images.jpg",
      size: "13.08 KB",
      url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "media-2",
      title: "8UPEW2.png",
      size: "25.92 KB",
      url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80"
    }
  ]

  const handleNextLightbox = () => {
    if (lightboxIndex !== null && mediaItems.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % mediaItems.length)
    }
  }

  const handlePrevLightbox = () => {
    if (lightboxIndex !== null && mediaItems.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + mediaItems.length) % mediaItems.length)
    }
  }

  const handleUploadSimulate = () => {
    toast.success(`Uploaded new ${activeTab === 'documents' ? 'document' : 'media'} successfully!`)
    setShowUploadModal(false)
  }

  return (
    <div className="flex flex-col w-full bg-white min-h-[500px] text-slate-800 font-sans p-6 rounded-2xl">
      
      {/* HEADER BAR: Case Documents title, Segment control toggle, Add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Case Documents</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Manage documents and media for this case.</p>
        </div>

        {/* Center Segmented Control [ Documents | Media ] */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200/60 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-teal-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Documents
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'media'
                ? 'bg-teal-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Media
          </button>
        </div>

        {/* Right Top Action Button */}
        <div>
          {activeTab === 'documents' ? (
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/80 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              Add Document
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/80 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Media
            </button>
          )}
        </div>
      </div>

      {/* CONTENT AREA: DOCUMENTS TAB (Image 3) */}
      {activeTab === 'documents' && (
        <div className="pt-6">
          {documents.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => toast(`Viewing document: ${doc.title}`)}
                  className="bg-white border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group h-64"
                >
                  {/* Pink PDF Container Top Part */}
                  <div className="bg-rose-50/90 rounded-xl flex-1 flex flex-col items-center justify-center p-4 mb-3 border border-rose-100/60 group-hover:scale-[1.01] transition-transform">
                    <div className="w-12 h-14 bg-rose-100/60 rounded-xl flex flex-col items-center justify-center border border-rose-200/60 text-rose-600">
                      <FileText className="w-7 h-7" />
                      <span className="text-[9px] font-black uppercase tracking-wider mt-0.5 text-rose-700">PDF</span>
                    </div>
                  </div>

                  {/* Document Title & Size Bottom Part */}
                  <div className="px-1">
                    <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-teal-900 transition-colors" title={doc.title}>
                      {doc.title}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">{doc.size}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONTENT AREA: MEDIA TAB (Image 4) */}
      {activeTab === 'media' && (
        <div className="pt-6">
          {mediaItems.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No media uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {mediaItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(index)}
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col h-64"
                >
                  {/* Thumbnail Image Top Part */}
                  <div className="w-full flex-1 bg-slate-100 overflow-hidden relative">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Title & Size Bottom Part */}
                  <div className="p-3 bg-white">
                    <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-teal-900 transition-colors" title={item.title}>
                      {item.title}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">{item.size}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LIGHTBOX PREVIEW MODAL (Image 5) */}
      {lightboxIndex !== null && mediaItems[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          
          {/* Close X Button top right */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer z-50 shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Navigation Arrow */}
          <button
            type="button"
            onClick={handlePrevLightbox}
            className="absolute left-6 w-12 h-12 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer z-50 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Navigation Arrow */}
          <button
            type="button"
            onClick={handleNextLightbox}
            className="absolute right-6 w-12 h-12 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer z-50 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Centered Image Container */}
          <div className="flex flex-col items-center justify-center max-w-3xl w-full">
            <div className="bg-white p-2 rounded-2xl overflow-hidden shadow-2xl max-h-[75vh] flex items-center justify-center border border-slate-200">
              <img
                src={mediaItems[lightboxIndex].url}
                alt={mediaItems[lightboxIndex].title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Bottom Caption & Pagination */}
            <div className="mt-4 flex flex-col items-center">
              <span className="text-sm font-bold text-white tracking-wide">
                {mediaItems[lightboxIndex].title}
              </span>
              <span className="text-xs font-medium text-slate-400 mt-1">
                {lightboxIndex + 1} of {mediaItems.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD SIMULATION MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {activeTab === 'documents' ? 'Add Case Document' : 'Upload Case Media'}
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              onClick={handleUploadSimulate}
              className="border-2 border-dashed border-teal-200 hover:border-teal-600 bg-teal-50/40 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-teal-50/70"
            >
              <Upload className="w-8 h-8 text-teal-600 mb-2" />
              <p className="text-sm font-bold text-slate-800">Click to select file</p>
              <p className="text-xs text-slate-400 mt-1">PDF for documents, JPG/PNG for media</p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadSimulate}
                className="px-4 py-2 bg-teal-900 text-white font-semibold text-xs rounded-lg hover:bg-teal-950 shadow-xs"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
