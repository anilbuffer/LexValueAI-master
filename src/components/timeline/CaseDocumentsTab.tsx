"use client"
import { useState } from "react"
import { Car, UploadCloud, Image as ImageIcon, FileText } from "lucide-react"
import toast from "react-hot-toast"

type DocTabType = 'property' | 'police' | 'injury' | 'scar' | 'misc'

export function CaseDocumentsTab({ caseData }: { caseData: any }) {
  const [activeTab, setActiveTab] = useState<DocTabType>('property')

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6">
        
        {/* Sub Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 border-b border-slate-100 no-scrollbar">
          <button 
            onClick={() => setActiveTab('property')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${activeTab === 'property' ? 'bg-white text-slate-800 border border-slate-200 shadow-sm' : 'bg-transparent text-slate-500 hover:bg-slate-50 border border-transparent'}`}
          >
            Property Damage <span className={`flex items-center justify-center text-[10px] w-5 h-5 rounded-full ml-1 font-medium ${activeTab === 'property' ? 'bg-teal-50 text-teal-700' : 'text-slate-400'}`}>3</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('police')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${activeTab === 'police' ? 'bg-white text-slate-800 border border-slate-200 shadow-sm' : 'bg-transparent text-slate-500 hover:bg-slate-50 border border-transparent'}`}
          >
            Police Reports <span className={`flex items-center justify-center text-[10px] w-5 h-5 rounded-full ml-1 font-medium ${activeTab === 'police' ? 'bg-teal-50 text-teal-700' : 'text-slate-400'}`}>2</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('injury')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${activeTab === 'injury' ? 'bg-white text-slate-800 border border-slate-200 shadow-sm' : 'bg-transparent text-slate-500 hover:bg-slate-50 border border-transparent'}`}
          >
            Injury Photos <span className={`flex items-center justify-center text-[10px] w-5 h-5 rounded-full ml-1 font-medium ${activeTab === 'injury' ? 'bg-teal-50 text-teal-700' : 'text-slate-400'}`}>2</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('scar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${activeTab === 'scar' ? 'bg-white text-slate-800 border border-slate-200 shadow-sm' : 'bg-transparent text-slate-500 hover:bg-slate-50 border border-transparent'}`}
          >
            Scar Photos <span className={`flex items-center justify-center text-[10px] w-5 h-5 rounded-full ml-1 font-medium ${activeTab === 'scar' ? 'bg-teal-50 text-teal-700' : 'text-slate-400'}`}>1</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('misc')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${activeTab === 'misc' ? 'bg-white text-slate-800 border border-slate-200 shadow-sm' : 'bg-transparent text-slate-500 hover:bg-slate-50 border border-transparent'}`}
          >
            Miscellaneous <span className={`flex items-center justify-center text-[10px] w-5 h-5 rounded-full ml-1 font-medium ${activeTab === 'misc' ? 'bg-teal-50 text-teal-700' : 'text-slate-400'}`}>2</span>
          </button>
        </div>

        {activeTab === 'property' && (
          <>
            <div className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900">2019 Honda Accord EX — rear quarter and trunk impact</h3>
                  <p className="text-[14px] text-slate-600 mt-1">Rear end impact at moderate speed. Trunk pan deformed, rear bumper cover displaced, frame rail measured out of tolerance.</p>
                </div>
              </div>
              <div className="bg-teal-50/30 border border-teal-100 rounded-xl p-5 mb-6">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Repair Estimate</p>
                <p className="text-2xl font-bold text-slate-900">$11,480</p>
              </div>
            </div>

            <div 
              onClick={() => toast.success("File uploaded successfully to Property Damage")}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer mb-8"
            >
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-[15px] font-bold text-slate-800 mb-1">Upload to Property Damage</p>
              <p className="text-[13px] text-slate-500">PDFs and photos. Files are encrypted and processed securely.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div onClick={() => toast("Opening document viewer...")} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm group hover:border-slate-300 transition-colors cursor-pointer">
                <div className="bg-slate-100 h-32 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="p-4 bg-white">
                  <p className="text-[13px] font-bold text-slate-800 truncate">Rear bumper — impact side</p>
                </div>
              </div>
              
              <div onClick={() => toast("Opening document viewer...")} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm group hover:border-slate-300 transition-colors cursor-pointer">
                <div className="bg-slate-100 h-32 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="p-4 bg-white">
                  <p className="text-[13px] font-bold text-slate-800 truncate">Trunk pan deformation</p>
                </div>
              </div>
              
              <div onClick={() => toast("Opening document viewer...")} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm group hover:border-slate-300 transition-colors cursor-pointer">
                <div className="bg-slate-100 h-32 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="p-4 bg-white">
                  <p className="text-[13px] font-bold text-slate-800 truncate">Repair estimate sheet</p>
                  <p className="text-[11px] text-slate-500 mt-1">Certified body shop estimate</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'police' && (
          <>
            <div 
              onClick={() => toast.success("File uploaded successfully to Police Reports")}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer mb-8"
            >
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-[15px] font-bold text-slate-800 mb-1">Upload to Police Reports</p>
              <p className="text-[13px] text-slate-500">PDFs and photos. Files are encrypted and processed securely.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div onClick={() => toast("Opening document viewer...")} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm group hover:border-slate-300 transition-colors cursor-pointer">
                <div className="bg-slate-100 h-32 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="p-4 bg-white">
                  <p className="text-[13px] font-bold text-slate-800 truncate">Traffic crash report #24-118342</p>
                  <p className="text-[11px] text-slate-500 mt-1">Officer narrative assigns fault to defendant driver</p>
                </div>
              </div>
              
              <div onClick={() => toast("Opening document viewer...")} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm group hover:border-slate-300 transition-colors cursor-pointer">
                <div className="bg-slate-100 h-32 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="p-4 bg-white">
                  <p className="text-[13px] font-bold text-slate-800 truncate">Scene diagram supplement</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'injury' && (
          <>
            <div 
              onClick={() => toast.success("File uploaded successfully to Injury Photos")}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer mb-8"
            >
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-[15px] font-bold text-slate-800 mb-1">Upload to Injury Photos</p>
              <p className="text-[13px] text-slate-500">PDFs and photos. Files are encrypted and processed securely.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div onClick={() => toast("Opening document viewer...")} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm group hover:border-slate-300 transition-colors cursor-pointer">
                <div className="bg-slate-100 h-32 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="p-4 bg-white">
                  <p className="text-[13px] font-bold text-slate-800 truncate">Cervical collar — day of discharge</p>
                </div>
              </div>
              
              <div onClick={() => toast("Opening document viewer...")} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm group hover:border-slate-300 transition-colors cursor-pointer">
                <div className="bg-slate-100 h-32 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="p-4 bg-white">
                  <p className="text-[13px] font-bold text-slate-800 truncate">Bruising, right shoulder</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'scar' && (
          <>
            <div 
              onClick={() => toast.success("File uploaded successfully to Scar Photos")}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer mb-8"
            >
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-[15px] font-bold text-slate-800 mb-1">Upload to Scar Photos</p>
              <p className="text-[13px] text-slate-500">PDFs and photos. Files are encrypted and processed securely.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div onClick={() => toast("Opening document viewer...")} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm group hover:border-slate-300 transition-colors cursor-pointer">
                <div className="bg-slate-100 h-32 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="p-4 bg-white">
                  <p className="text-[13px] font-bold text-slate-800 truncate">Anterior cervical incision — 2 weeks post-op</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'misc' && (
          <>
            <div 
              onClick={() => toast.success("File uploaded successfully to Miscellaneous")}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer mb-8"
            >
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-[15px] font-bold text-slate-800 mb-1">Upload to Miscellaneous</p>
              <p className="text-[13px] text-slate-500">Any supporting document or photo that doesn't fit the other categories.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div onClick={() => toast("Opening document viewer...")} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm group hover:border-slate-300 transition-colors cursor-pointer">
                <div className="bg-slate-100 h-32 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="p-4 bg-white">
                  <p className="text-[13px] font-bold text-slate-800 truncate">Employer wage-loss verification letter</p>
                </div>
              </div>
              
              <div onClick={() => toast("Opening document viewer...")} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm group hover:border-slate-300 transition-colors cursor-pointer">
                <div className="bg-slate-100 h-32 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="p-4 bg-white">
                  <p className="text-[13px] font-bold text-slate-800 truncate">Client gap-in-treatment affidavit</p>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
