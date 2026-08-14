import React, { useState, useMemo } from 'react'
import { FileText, ClipboardList, Link as LinkIcon, Stethoscope, Activity, Filter, MessageSquare } from 'lucide-react'

export function ChronologyTab({ caseData }: { caseData?: any }) {
  const [providerFilter, setProviderFilter] = useState<string>('All')
  const [bodyPartFilter, setBodyPartFilter] = useState<string>('All')
  const [confidenceFilter, setConfidenceFilter] = useState<string>('All')

  const [annotations, setAnnotations] = useState<Record<string, { note: string; date: string }[]>>({})
  const [annotatingEventId, setAnnotatingEventId] = useState<string | null>(null)
  const [newAnnotation, setNewAnnotation] = useState('')

  const handlePageClick = async (documentId: string, pageStr: string) => {
    if (!documentId) return;
    const match = pageStr.match(/\d+/);
    const pageNum = match ? match[0] : null;
    try {
      alert("Mock Download: In a real app, this would open the PDF.");
    } catch (e) {
      console.error('Failed to open document:', e);
    }
  };

  const filteredEvents = useMemo(() => {
    return (caseData?.timelineEvents || []).filter((event: any) => {
      let details: any = null;
      try {
        const parsed = JSON.parse(event.description);
        if (parsed && typeof parsed === 'object') {
          details = parsed;
        }
      } catch (e) {}
      
      const provider = details?.provider || '';
      const confidence = details?.confidence || 'Medium';
      
      const textForBodyPart = (details?.complaints || '') + ' ' + (details?.diagnosis || '') + ' ' + (event.title || '');

      if (providerFilter !== 'All' && provider !== providerFilter) return false;
      if (confidenceFilter !== 'All' && confidence !== confidenceFilter) return false;
      if (bodyPartFilter !== 'All' && !textForBodyPart.toLowerCase().includes(bodyPartFilter.toLowerCase())) return false;
      
      return true;
    });
  }, [caseData, providerFilter, bodyPartFilter, confidenceFilter]);

  const uniqueProviders = useMemo(() => {
    const providers = new Set<string>();
    (caseData?.timelineEvents || []).forEach((event: any) => {
      try {
        const parsed = JSON.parse(event.description);
        if (parsed?.provider && parsed.provider.toLowerCase() !== 'not specified' && parsed.provider.toLowerCase() !== 'n/a') {
          providers.add(parsed.provider);
        }
      } catch(e) {}
    });
    return Array.from(providers).sort();
  }, [caseData]);
  
  const bodyPartOptions = ['Cervical', 'Lumbar', 'Left Knee', 'Right Shoulder', 'Brain', 'Head', 'Spine', 'Back'];

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-50 p-3 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Medical Chronology</h2>
            <p className="text-xs text-slate-500 mt-0.5">Timeline of {filteredEvents.length} extracted medical events.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-md px-2 py-1 shadow-sm hover:border-slate-300 transition-colors">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select 
                className="text-xs font-medium text-slate-700 bg-transparent border-none focus:ring-0 outline-none cursor-pointer pr-4"
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
              >
                <option value="All">All Providers</option>
                {uniqueProviders.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-md px-2 py-1 shadow-sm hover:border-slate-300 transition-colors">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select 
                className="text-xs font-medium text-slate-700 bg-transparent border-none focus:ring-0 outline-none cursor-pointer pr-4"
                value={bodyPartFilter}
                onChange={(e) => setBodyPartFilter(e.target.value)}
              >
                <option value="All">All Body Parts</option>
                {bodyPartOptions.map(bp => <option key={bp} value={bp}>{bp}</option>)}
              </select>
            </div>
            
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-md px-2 py-1 shadow-sm hover:border-slate-300 transition-colors">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select 
                className="text-xs font-medium text-slate-700 bg-transparent border-none focus:ring-0 outline-none cursor-pointer pr-4"
                value={confidenceFilter}
                onChange={(e) => setConfidenceFilter(e.target.value)}
              >
                <option value="All">All Confidences</option>
                <option value="High">High Conf</option>
                <option value="Medium">Medium Conf</option>
                <option value="Low">Low Conf</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 w-full">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-slate-500">No events match the selected filters or none generated yet.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredEvents.map((event: any, index: number) => {
              let rawDate = undefined
              const d = new Date(event.date)
              const isDateValid = !isNaN(d.getTime()) && d.getTime() > 0
              const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
              let month = isDateValid ? monthNames[d.getUTCMonth()] : ''
              let day = isDateValid ? d.getUTCDate().toString().padStart(2, '0') : ''
              let year = isDateValid ? d.getUTCFullYear() : ''

              // Find the document to show filename
              const doc = caseData?.documents?.find((d: any) => d.id === event.documentId)
              const docName = doc ? doc.fileName : "Unknown Source"

              // Parse details from description if it's JSON
              let details: any = null
              let descriptionText = event.description
              try {
                const parsed = JSON.parse(event.description)
                if (parsed && typeof parsed === 'object') {
                  details = parsed
                  descriptionText = parsed.text || event.description
                }
              } catch (e) {
                // not JSON
              }

              let provider = details?.provider || null
              let complaints = details?.complaints || null
              let diagnosis = details?.diagnosis || null
              let treatment = details?.treatment || null

              const isNullValue = (val: string | null) => !val || val.toLowerCase() === 'not specified' || val.toLowerCase() === 'n/a' || val.toLowerCase() === 'none' || val.trim() === ''

              if (isNullValue(provider)) provider = null
              if (isNullValue(complaints)) complaints = null
              if (isNullValue(diagnosis)) diagnosis = null
              if (isNullValue(treatment)) treatment = null
              const sourcePage = details?.pageNumber || "Source page unclear"
              const confidence = details?.confidence || "Medium"
              rawDate = details?.rawDate

              // If we have a raw date, we format it nicely for the sidebar instead of standard date
              if (rawDate) {
                // Determine if it's "Year only: 2026" or "Date not specified"
                if (rawDate.startsWith('Year only:')) {
                  year = rawDate.replace('Year only:', '').trim()
                  month = 'YEAR'
                  day = ''
                } else if (rawDate === 'Date not specified' || rawDate.toLowerCase() === 'not specified') {
                  month = 'N/A'
                  day = ''
                  year = 'NO DATE'
                }
                // Normal dates (YYYY-MM-DD) will just use the standard parsed date above
              }

              const getConfidenceStyle = (conf: string) => {
                if (conf === 'High') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
                if (conf === 'Low') return 'bg-rose-100 text-rose-700 border-rose-200'
                return 'bg-amber-100 text-amber-700 border-amber-200'
              }

              return (
                <div key={event.id} className="flex flex-col md:flex-row gap-2 md:gap-4 relative group mb-3 md:mb-0">
                  <div className="w-full md:w-[60px] shrink-0 text-left md:text-right flex flex-row md:flex-col items-baseline md:items-end justify-start gap-1.5 md:gap-0 pt-0.5 md:pt-0.5 px-1 md:px-0">
                    <div className="text-[13px] font-bold text-slate-800 leading-none">{month} {day}</div>
                    <div className="text-[10px] font-bold text-slate-400 md:mt-0.5 tracking-widest uppercase">{year}</div>
                    {details?.time && (
                      <div className="text-[9px] font-bold text-teal-600 md:mt-1 tracking-wide uppercase whitespace-nowrap">{details.time}</div>
                    )}
                  </div>
                  <div className="hidden md:flex relative flex-col items-center shrink-0 w-10">
                    <div className="absolute top-10 bottom-0 w-[2px] bg-slate-100 group-last:hidden"></div>
                    <div className="w-10 h-10 rounded-full bg-white border-[3px] border-slate-100 flex items-center justify-center z-1 group-hover:border-teal-500 group-hover:bg-teal-50 transition-all duration-300 shadow-sm relative">
                      {event.title.toLowerCase().includes('evaluation') ? (
                        <Stethoscope className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                      ) : event.title.toLowerCase().includes('mri') || event.title.toLowerCase().includes('emg') ? (
                        <FileText className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                      ) : (
                        <Activity className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pb-0 md:pb-1">
                    <div className="bg-white border border-slate-100 rounded-xl p-3 md:p-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:border-teal-200 transition-all duration-300 group-hover:-translate-y-0.5 mb-2 md:mb-3 break-words">

                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-1.5 mb-1.5">
                        <div className="flex items-start md:items-center flex-wrap gap-2 flex-1">
                          <h4 className="text-[14px] md:text-[15px] font-semibold text-slate-800">{event.title}</h4>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-bold whitespace-nowrap shrink-0 mt-0.5 md:mt-0 ${getConfidenceStyle(confidence)}`}>
                            {confidence} Conf
                          </span>
                        </div>
                        {provider && (
                          <div className="flex items-start md:items-center gap-1.5 text-slate-500 text-[12px] md:text-[13px] font-medium md:max-w-[45%] md:justify-end shrink-0">
                            <Stethoscope className="w-3.5 h-3.5 shrink-0 mt-[2px] md:mt-0" />
                            <span className="text-left md:text-right leading-snug">{provider}</span>
                          </div>
                        )}
                      </div>



                      <p className="text-[13px] text-slate-600 leading-relaxed mb-2">{descriptionText}</p>

                      {/* Detailed Content */}
                      {(complaints || diagnosis || treatment) && (
                        <div className="mt-2 pt-2 border-t border-slate-50">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {complaints && (
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                                  <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Complaint</h4>
                                </div>
                                <p className="text-[12px] text-slate-700 leading-relaxed">{complaints}</p>
                              </div>
                            )}
                            {diagnosis && (
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                                  <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Diagnosis</h4>
                                </div>
                                <p className="text-[12px] text-slate-700 leading-relaxed">{diagnosis}</p>
                              </div>
                            )}
                            {treatment && (
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                                  <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Treatment</h4>
                                </div>
                                <p className="text-[12px] text-slate-700 leading-relaxed">{treatment}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between gap-3 w-full min-w-0">
                        <div
                          title={sourcePage === "Source page unclear" ? `Page unclear, ${docName}` : `Page ${sourcePage}, ${docName}`}
                          onClick={(e) => { e.stopPropagation(); handlePageClick(event.documentId, String(sourcePage)); }}
                          className="flex items-center gap-1.5 text-[11px] text-teal-700 font-semibold bg-teal-50 border border-teal-100 px-2 py-1 rounded-md max-w-full overflow-hidden cursor-pointer hover:bg-teal-100 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span className="truncate whitespace-nowrap overflow-hidden">
                            {sourcePage === "Source page unclear" ? `Page unclear, ${docName}` : `Page ${sourcePage}, ${docName}`}
                          </span>
                        </div>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setAnnotatingEventId(annotatingEventId === event.id ? null : event.id);
                          }}
                          className={`flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-md transition-colors ${annotatingEventId === event.id || (annotations[event.id] && annotations[event.id].length > 0) ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100' : 'text-slate-500 hover:bg-slate-100 border border-transparent'}`}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          {annotations[event.id]?.length ? `${annotations[event.id].length} Notes` : 'Add Note'}
                        </button>
                      </div>

                      {/* Annotation Area */}
                      {(annotatingEventId === event.id || (annotations[event.id] && annotations[event.id].length > 0)) && (
                        <div className="mt-3 pt-3 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                            <h4 className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Internal Notes & Flags</h4>
                          </div>
                          
                          {annotations[event.id]?.map((ann, idx) => (
                            <div key={idx} className="bg-amber-50/50 border border-amber-100 rounded-md p-2 mb-2">
                              <div className="text-[10px] text-amber-600 mb-1 font-semibold">{ann.date}</div>
                              <p className="text-[12px] text-slate-800 leading-relaxed font-medium">{ann.note}</p>
                            </div>
                          ))}

                          {annotatingEventId === event.id && (
                            <div className="flex gap-2 mt-2">
                              <input 
                                type="text" 
                                placeholder="Type an internal note or flag..." 
                                className="flex-1 text-[12px] px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 bg-white shadow-sm"
                                value={newAnnotation}
                                onChange={(e) => setNewAnnotation(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && newAnnotation.trim()) {
                                    const current = annotations[event.id] || [];
                                    setAnnotations({
                                      ...annotations,
                                      [event.id]: [...current, { note: newAnnotation.trim(), date: new Date().toLocaleString() }]
                                    });
                                    setNewAnnotation('');
                                  }
                                }}
                              />
                              <button 
                                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-md text-[11px] font-bold transition-colors shadow-sm disabled:opacity-50"
                                disabled={!newAnnotation.trim()}
                                onClick={() => {
                                  if (newAnnotation.trim()) {
                                    const current = annotations[event.id] || [];
                                    setAnnotations({
                                      ...annotations,
                                      [event.id]: [...current, { note: newAnnotation.trim(), date: new Date().toLocaleString() }]
                                    });
                                    setNewAnnotation('');
                                  }
                                }}
                              >
                                Save
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

