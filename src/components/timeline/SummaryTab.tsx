import React, { useState } from 'react'
import { Copy, Download } from 'lucide-react'
import { updateMockDocument } from '@/lib/mock-data'

type NarrativePerspective = 'Structured' | 'Plaintiff view' | 'Defense view'

export function SummaryTab({ caseData }: { caseData?: any }) {
  const [perspective, setPerspective] = useState<NarrativePerspective>('Structured')
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  // Get the primary document (mocked)
  const doc = caseData?.documents?.[0] || null

  const handleEditClick = (sectionId: string, currentContent: string) => {
    setEditingSection(sectionId)
    setEditContent(currentContent)
  }

  const handleSaveClick = (sectionId: string) => {
    if (doc && doc.summarySections) {
      const updatedSections = doc.summarySections.map((s: any) => 
        s.id === sectionId ? { ...s, content: editContent } : s
      )
      updateMockDocument(doc.id, { summarySections: updatedSections })
      // Update local state if needed (since it's a mock, caseData might need a refresh, but we can mutate it directly for demo)
      const target = doc.summarySections.find((s: any) => s.id === sectionId)
      if (target) target.content = editContent;
    }
    setEditingSection(null)
  }

  // Hover Annotation Component
  const AnnotatedText = ({ text }: { text: string }) => {
    // Simple regex to find dates like "Jun 08, 2018" or "10/15/2018" and wrap them
    const parts = text.split(/(Jun 08, 2018|10\/15\/2018|11\/12\/2018|06\/15\/2018)/g);
    
    return (
      <div className="whitespace-pre-wrap">
        {parts.map((part, i) => {
          if (part.match(/(Jun 08, 2018|10\/15\/2018|11\/12\/2018|06\/15\/2018)/)) {
            return (
              <span key={i} className="group relative inline-block cursor-help border-b border-dashed border-teal-500 text-teal-700 bg-teal-50/50 transition-colors hover:bg-teal-100">
                {part}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-slate-800 text-white text-xs font-sans rounded p-2 z-10 shadow-lg text-left leading-normal">
                  <span className="font-bold block mb-1">Source Record:</span>
                  <span className="text-slate-300 block">Click to jump to chronology event on this date.</span>
                  {/* Small pointer */}
                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></span>
                </span>
              </span>
            )
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white">
      <div className="p-4 md:p-6 pb-0 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Inner Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl w-fit">
          {['Structured', 'Plaintiff view', 'Defense view'].map((tab) => (
            <button
              key={tab}
              onClick={() => setPerspective(tab as NarrativePerspective)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                perspective === tab
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-900'
                  : 'text-slate-500 hover:text-slate-700 border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Copy className="w-4 h-4" /> Copy
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 rounded-lg text-[13px] font-bold text-white hover:bg-teal-700 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export as Word
          </button>
        </div>
      </div>
      
      <div className="p-6 md:p-6 w-full flex-1 overflow-y-auto">
        <div className="max-w-none text-slate-700 leading-relaxed text-[14px]">
          
          {perspective === 'Structured' && doc?.summarySections && (
            <div className="flex flex-col gap-4">
              {doc.summarySections.map((section: any) => (
                <div key={section.id} className="group relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-widest m-0">{section.title}</h3>
                    {editingSection !== section.id ? (
                      <button 
                        onClick={() => handleEditClick(section.id, section.content)}
                        className="text-teal-600 hover:text-teal-700 text-[13px] font-medium transition-colors"
                      >
                        Edit
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleSaveClick(section.id)}
                        className="text-teal-600 hover:text-teal-700 text-[13px] font-medium transition-colors"
                      >
                        Done
                      </button>
                    )}
                  </div>
                  
                  {editingSection === section.id ? (
                    <textarea 
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full min-h-[120px] p-4 bg-white border-2 border-teal-500 rounded-xl outline-none focus:ring-0 text-slate-800 resize-y leading-relaxed text-[14px] shadow-inner"
                    />
                  ) : (
                    <div className="text-slate-700 text-[14px] leading-relaxed">
                      <AnnotatedText text={section.content} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {perspective === 'Plaintiff view' && doc?.plaintiffNarrative && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-in fade-in duration-300">
              <h3 className="text-[15px] font-bold text-slate-900 mb-4 mt-0">
                Plaintiff narrative
              </h3>
              <p className="text-slate-700 leading-relaxed text-[14px] mb-0">{doc.plaintiffNarrative}</p>
            </div>
          )}

          {perspective === 'Defense view' && doc?.defenseNarrative && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-in fade-in duration-300">
              <h3 className="text-[15px] font-bold text-slate-900 mb-4 mt-0">
                Defense narrative (anticipated counterarguments)
              </h3>
              <p className="text-slate-700 leading-relaxed text-[14px] mb-0">{doc.defenseNarrative}</p>
            </div>
          )}
          
          {(!doc || (!doc.summarySections && !doc.plaintiffNarrative)) && (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
              <p className="italic">No narrative summary available for this case.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
