import React, { useState } from 'react'
import { Calendar, User, Activity, FileText, Info, ExternalLink } from 'lucide-react'
import { updateMockDocument } from '@/lib/mock-data'
import { useRouter, usePathname } from 'next/navigation'

type NarrativePerspective = 'Structured' | 'Plaintiff Narrative' | 'Defense Narrative'

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
    if (doc) {
      if (sectionId === 'plaintiff') {
        updateMockDocument(doc.id, { plaintiffNarrative: editContent })
        doc.plaintiffNarrative = editContent;
      } else if (sectionId === 'defense') {
        updateMockDocument(doc.id, { defenseNarrative: editContent })
        doc.defenseNarrative = editContent;
      } else if (doc.summarySections) {
        const updatedSections = doc.summarySections.map((s: any) =>
          s.id === sectionId ? { ...s, content: editContent } : s
        )
        updateMockDocument(doc.id, { summarySections: updatedSections })
        // Update local state if needed (since it's a mock, caseData might need a refresh, but we can mutate it directly for demo)
        const target = doc.summarySections.find((s: any) => s.id === sectionId)
        if (target) target.content = editContent;
      }
    }
    setEditingSection(null)
  }

  // Define annotations
  const annotations = [
    {
      term: "Anterior Cervical Discectomy and Fusion (ACDF) C5-C6 and C6-C7",
      date: "Oct 15, 2018",
      provider: "Dr. David Grossman",
      symptoms: "Severe cervical spondylosis with radiculopathy at C5-C7.",
      sourceDocument: "PD00302BDEAC13B19_Meds_Redacted.pdf",
      details: "Surgeon: Dr. David Grossman. Operative Report: ACDF C5-C7 with anterior plating and allograft.",
      eventId: "event-8"
    },
    {
      term: "Right shoulder arthroscopy with extensive debridement and SLAP repair",
      date: "Nov 12, 2018",
      provider: "Dr. Christopher Cline",
      symptoms: "SLAP tear right shoulder.",
      sourceDocument: "PD00302BDEAC13B19_Meds_Redacted.pdf",
      details: "Surgeon: Dr. Christopher Cline. Extensive debridement and SLAP repair performed.",
      eventId: "event-9"
    },
    {
      term: "Left knee arthroscopy with partial medial meniscectomy",
      date: "Jun 15, 2018",
      provider: "Dr. Christopher Cline",
      symptoms: "Medial meniscus tear.",
      sourceDocument: "PD00302BDEAC13B19_Meds_Redacted.pdf",
      details: "Surgeon: Dr. Christopher Cline. Partial medial meniscectomy. No complications.",
      eventId: "event-3"
    },
    {
      term: "motor vehicle accident (MVA)",
      date: "Jun 08, 2018",
      provider: "NYPD / EMS",
      symptoms: "Neck and back pain",
      sourceDocument: "NYPD_Police_Report_MV104.pdf",
      details: "Rear-ended at steady red light by commercial driver at ~35 MPH.",
      eventId: "event-1"
    },
    {
      term: "rear-end collision",
      date: "Jun 08, 2018",
      provider: "NYPD / EMS",
      symptoms: "Neck and back pain",
      sourceDocument: "NYPD_Police_Report_MV104.pdf",
      details: "Rear-ended at steady red light by commercial driver at ~35 MPH.",
      eventId: "event-1"
    },
    {
      term: "C5-C7 ACDF surgery",
      date: "Oct 15, 2018",
      provider: "Dr. David Grossman",
      symptoms: "Severe cervical spondylosis with radiculopathy at C5-C7.",
      sourceDocument: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 85)",
      details: "Surgeon: Dr. David Grossman. Operative Report: ACDF C5-C7 with anterior plating and allograft.",
      eventId: "event-8"
    },
    {
      term: "no history of neck pain",
      date: "Prior to Jun 08, 2018",
      provider: "Patient Self-Report",
      symptoms: "Denies prior neck pain",
      sourceDocument: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 15)",
      details: "Initial Orthopedic Evaluation notes patient denied any prior neck pain or upper extremity symptoms.",
      eventId: "event-1"
    },
    {
      term: "pre-existing lower back complaints",
      date: "Prior to Jun 08, 2018",
      provider: "Dr. Christopher Cline",
      symptoms: "Mild, occasional lower back pain",
      sourceDocument: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 15)",
      details: "Patient reported a history of mild, occasional lower back pain prior to the MVA.",
      eventId: "event-1"
    },
    {
      term: "not wearing the cervical orthosis",
      date: "Jan 15, 2019",
      provider: "Dr. Sarah Jenkins",
      symptoms: "Non-compliance with post-operative care",
      sourceDocument: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 68)",
      details: "Documentation states 'The patient has not been wearing the cervical orthosis brace.'",
      eventId: "event-11"
    },
    {
      term: "cervical and lumbar sprain/strain",
      date: "Jun 08, 2018",
      provider: "NYU Langone Emergency Dept",
      symptoms: "Neck and back pain, radiating symptoms.",
      sourceDocument: "NYU_ER_Discharge_Summary.pdf",
      details: "Initial diagnosis at ER following the accident. Prescribed muscle relaxants and advised follow-up.",
      eventId: "event-1"
    },
    {
      term: "Cervical Spine MRI",
      date: "Jul 12, 2018",
      provider: "Dr. Alan Smith (Radiology)",
      symptoms: "Persistent neck pain radiating to left arm",
      sourceDocument: "MRI_Cervical_Spine_Report.pdf",
      details: "Findings: Severe spondylosis, broad-based disc herniations at C5-C6 and C6-C7 compressing the thecal sac and bilateral nerve roots.",
      eventId: "event-2"
    },
    {
      term: "rear-ended",
      date: "Jun 08, 2018",
      provider: "NYPD / EMS",
      symptoms: "Neck and back pain",
      sourceDocument: "NYPD_Police_Report_MV104.pdf",
      details: "Rear-ended at steady red light by commercial driver at ~35 MPH.",
      eventId: "event-1"
    },
    {
      term: "neck and back pain",
      date: "Jun 08, 2018",
      provider: "Patient Self-Report",
      symptoms: "Immediate onset post-collision",
      sourceDocument: "NYU_ER_Discharge_Summary.pdf",
      details: "Patient reported immediate onset of neck and back pain, which subsequently radiated to her left arm and right leg.",
      eventId: "event-1"
    },
    {
      term: "emergency room",
      date: "Jun 08, 2018",
      provider: "NYU Langone",
      symptoms: "Post-accident trauma evaluation",
      sourceDocument: "NYU_ER_Discharge_Summary.pdf",
      details: "Patient was evaluated in the emergency room on the day of the accident. X-rays were taken, diagnosed with sprain/strain.",
      eventId: "event-1"
    },
    {
      term: "Motor vehicle accident",
      date: "Jun 08, 2018",
      provider: "NYPD / EMS",
      symptoms: "Neck and back pain",
      sourceDocument: "NYPD_Police_Report_MV104.pdf",
      details: "Rear-ended at steady red light by commercial driver at ~35 MPH.",
      eventId: "event-1"
    },
    {
      term: "mild, occasional lower back pain",
      date: "Prior to Jun 08, 2018",
      provider: "Dr. Christopher Cline",
      symptoms: "Mild, occasional lower back pain",
      sourceDocument: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 15)",
      details: "Patient reported a history of mild, occasional lower back pain prior to the MVA.",
      eventId: "event-1"
    },
    {
      term: "denied any prior neck pain",
      date: "Prior to Jun 08, 2018",
      provider: "Patient Self-Report",
      symptoms: "Denies prior neck pain",
      sourceDocument: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 15)",
      details: "Initial Orthopedic Evaluation notes patient denied any prior neck pain or upper extremity symptoms.",
      eventId: "event-1"
    }
  ];

  // Hover Annotation Component
  const AnnotatedText = ({ text }: { text: string }) => {
    const router = useRouter();
    const pathname = usePathname();

    // Sort annotations by length (longest first) to prevent partial matching issues
    const sortedAnnotations = [...annotations].sort((a, b) => b.term.length - a.term.length);

    let parts: { text: string; annotation?: any }[] = [{ text }];

    sortedAnnotations.forEach(ann => {
      const newParts: { text: string; annotation?: any }[] = [];
      parts.forEach(part => {
        if (part.annotation) {
          newParts.push(part);
          return;
        }

        const split = part.text.split(ann.term);
        for (let i = 0; i < split.length; i++) {
          if (split[i]) {
            newParts.push({ text: split[i] });
          }
          if (i < split.length - 1) {
            newParts.push({ text: ann.term, annotation: ann });
          }
        }
      });
      parts = newParts;
    });

    const handleAnnotationClick = (e: React.MouseEvent, eventId: string) => {
      e.preventDefault();
      e.stopPropagation();
      // Navigate to chronology tab and pass eventId in query params
      router.push(`${pathname}?tab=chronology&eventId=${eventId}`);
    };

    return (
      <div className="whitespace-pre-wrap">
        {parts.map((part, i) => {
          if (part.annotation) {
            const ann = part.annotation;
            return (
              <span key={i} className="group/tooltip relative inline-block cursor-pointer border-b-2 border-teal-500/30 text-teal-700 bg-teal-50/50 transition-colors hover:bg-teal-100 font-medium rounded-sm px-0.5">
                <span onClick={(e) => handleAnnotationClick(e, ann.eventId)}>{part.text}</span>
                <span className="absolute top-full -left-2 mt-2 hidden group-hover/tooltip:block w-80 bg-white text-slate-800 text-xs font-sans rounded-xl p-0 z-[100] shadow-xl border border-slate-200 text-left leading-normal overflow-hidden transform transition-all duration-200 scale-95 group-hover/tooltip:scale-100 origin-top-left">
                  <div className="bg-slate-50 border-b border-slate-100 p-3">
                    <div className="font-bold text-[13px] text-slate-900 mb-1 leading-tight">{ann.term}</div>
                    <div className="flex items-center text-teal-600 font-medium text-[11px] uppercase tracking-wider">
                      <Calendar className="w-3 h-3 mr-1" /> {ann.date}
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    <div className="flex items-start">
                      <User className="w-3.5 h-3.5 text-slate-400 mt-0.5 mr-2 shrink-0" />
                      <div>
                        <span className="text-slate-500 font-medium block text-[11px] uppercase tracking-wider mb-0.5">Provider</span>
                        <span className="text-slate-700">{ann.provider}</span>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Activity className="w-3.5 h-3.5 text-slate-400 mt-0.5 mr-2 shrink-0" />
                      <div>
                        <span className="text-slate-500 font-medium block text-[11px] uppercase tracking-wider mb-0.5">Symptoms / Findings</span>
                        <span className="text-slate-700">{ann.symptoms}</span>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 mr-2 shrink-0" />
                      <div>
                        <span className="text-slate-500 font-medium block text-[11px] uppercase tracking-wider mb-0.5">Relevant Details</span>
                        <span className="text-slate-700">{ann.details}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border-t border-slate-100 p-2.5 px-3 flex justify-between items-center group/btn cursor-pointer hover:bg-slate-100 transition-colors" onClick={(e) => handleAnnotationClick(e, ann.eventId)}>
                    <div className="flex items-center overflow-hidden mr-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                      <span className="text-slate-500 text-[11px] truncate">{ann.sourceDocument}</span>
                    </div>
                    <div className="flex items-center text-teal-600 font-medium text-[11px] whitespace-nowrap group-hover/btn:text-teal-700">
                      View in Chronology <ExternalLink className="w-3 h-3 ml-1" />
                    </div>
                  </div>

                  {/* Pointer */}
                  <span className="absolute bottom-full left-6 border-8 border-transparent border-b-white drop-shadow-sm"></span>
                </span>
              </span>
            )
          }
          return <span key={i}>{part.text}</span>;
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white">
      <div className="p-4 md:p-6 pb-0 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Inner Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl w-fit">
          {['Structured', 'Plaintiff Narrative', 'Defense Narrative'].map((tab) => (
            <button
              key={tab}
              onClick={() => setPerspective(tab as NarrativePerspective)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${perspective === tab
                ? 'bg-white text-slate-900 shadow-sm border border-slate-900'
                : 'text-slate-500 hover:text-slate-700 border border-transparent'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        {/* <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Copy className="w-4 h-4" /> Copy
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 rounded-lg text-[13px] font-bold text-white hover:bg-teal-700 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export as Word
          </button>
        </div> */}
      </div>

      <div className="p-6 md:p-6 w-full flex-1 overflow-y-auto">
        <div className="max-w-none text-slate-700 leading-relaxed text-[14px]">

          {perspective === 'Structured' && doc?.summarySections && (
            <div className="flex flex-col gap-4">
              {doc.summarySections.map((section: any) => (
                <div key={section.id} className="group relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-widest m-0">{section.title}</h3>
                  </div>

                  <div className="text-slate-700 text-[14px] leading-relaxed">
                    <AnnotatedText text={section.content} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {perspective === 'Plaintiff Narrative' && doc?.plaintiffNarrative && (
            <div className="group relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-widest m-0">Plaintiff narrative</h3>
                {editingSection !== 'plaintiff' ? (
                  <button
                    onClick={() => handleEditClick('plaintiff', doc.plaintiffNarrative)}
                    className="text-teal-600 hover:text-teal-700 text-[13px] font-medium transition-colors"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => handleSaveClick('plaintiff')}
                    className="text-teal-600 hover:text-teal-700 text-[13px] font-medium transition-colors"
                  >
                    Done
                  </button>
                )}
              </div>

              {editingSection === 'plaintiff' ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full min-h-[120px] p-4 bg-white border-2 border-teal-500 rounded-xl outline-none focus:ring-0 text-slate-800 resize-y leading-relaxed text-[14px] shadow-inner"
                />
              ) : (
                <div className="text-slate-700 text-[14px] leading-relaxed">
                  <AnnotatedText text={doc.plaintiffNarrative} />
                </div>
              )}
            </div>
          )}

          {perspective === 'Defense Narrative' && doc?.defenseNarrative && (
            <div className="group relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-widest m-0">Defense narrative (anticipated counterarguments)</h3>
                {editingSection !== 'defense' ? (
                  <button
                    onClick={() => handleEditClick('defense', doc.defenseNarrative)}
                    className="text-teal-600 hover:text-teal-700 text-[13px] font-medium transition-colors"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => handleSaveClick('defense')}
                    className="text-teal-600 hover:text-teal-700 text-[13px] font-medium transition-colors"
                  >
                    Done
                  </button>
                )}
              </div>

              {editingSection === 'defense' ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full min-h-[120px] p-4 bg-white border-2 border-teal-500 rounded-xl outline-none focus:ring-0 text-slate-800 resize-y leading-relaxed text-[14px] shadow-inner"
                />
              ) : (
                <div className="text-slate-700 text-[14px] leading-relaxed">
                  <AnnotatedText text={doc.defenseNarrative} />
                </div>
              )}
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
