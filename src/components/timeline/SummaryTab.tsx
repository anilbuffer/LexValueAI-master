import React, { useState, useEffect } from 'react'
import {
  Calendar,
  User,
  Activity,
  FileText,
  Info,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Cpu,
  AlertTriangle
} from 'lucide-react'
import { updateMockDocument, getMockCaseValuations } from '@/lib/mock-data'
import { useRouter, usePathname } from 'next/navigation'

type NarrativePerspective = 'Plaintiff Narrative' | 'Defense Narrative' | 'Settlement & Negotiation Analysis' | 'Structured'
type SettlementSection = 'all' | 'drivers' | 'defense' | 'carrier' | 'strategy'

export function SummaryTab({ caseData }: { caseData?: any }) {
  const [perspective, setPerspective] = useState<NarrativePerspective>('Plaintiff Narrative')
  const [settlementSection, setSettlementSection] = useState<SettlementSection>('all')
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [valuations, setValuations] = useState<any[]>([])

  const router = useRouter()
  const pathname = usePathname()

  const firmId = caseData?.firmId || 'firm-1'
  const caseId = caseData?.id || 'case-1'

  useEffect(() => {
    if (firmId && caseId) {
      const vals = getMockCaseValuations(firmId, caseId)
      setValuations(vals)
    }
  }, [firmId, caseId])

  const val = valuations[0] || {}
  const valueDrivers = val.valueDrivers || []
  const defensePressure = val.defensePressure || []
  const strategy = val.negotiationStrategy || {}
  const carrierModel = val.carrierModel || {}

  const DEFAULT_CARRIER_POSITION_FACTORS = [
    {
      id: "cpf-1",
      title: "Degenerative Findings",
      category: "Causation & Radiography",
      impactType: "negative",
      impactLabel: "Alternative Causation Offset",
      carrierArgument: "Adjuster argues that cervical MRI findings of disc desiccation, multilevel spondylosis, and facet arthropathy reflect pre-existing, age-related degeneration rather than acute trauma from the collision, attempting to apply an automated 25%–35% alternative-causation discount.",
      rebuttal: "Plaintiff was fully asymptomatic with zero prior cervical limitations before the crash. Under the Eggshell Plaintiff Doctrine (PJI 2:282), the tortfeasor is legally liable for precipitating acute disc herniations and nerve impingement on dormant degenerative changes.",
      citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 85)",
      pageNumber: "85"
    },
    {
      id: "cpf-2",
      title: "Priors",
      category: "Medical History & Prior Claims",
      impactType: "positive",
      impactLabel: "Zero Prior Cervical History",
      carrierArgument: "Adjuster raises a prior 2017 medical record noting lower back muscular strain, attempting to argue a pre-existing chronic spinal condition and prior physical complaints to diminish current claim value.",
      rebuttal: "The 2017 record was an isolated lumbar muscular strain that resolved within 10 days; plaintiff has zero prior cervical complaints, treatment, physical therapy, or diagnostic imaging on record.",
      citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 22)",
      pageNumber: "22"
    },
    {
      id: "cpf-3",
      title: "Treatment Gaps",
      category: "Treatment Continuity",
      impactType: "warning",
      impactLabel: "17-Day Delay Addressed",
      carrierArgument: "Adjuster and software algorithms use the 17-day period between collision (06/08/2018) and initial orthopedic evaluation (06/25/2018) to question treatment continuity and argue injuries were either minor or caused by an intervening event.",
      rebuttal: "Plaintiff followed hospital ER discharge instructions for initial rest and conservative care; when severe radiating radicular symptoms failed to subside, specialist care was promptly initiated, followed by unbroken, continuous treatment with no intervening trauma.",
      citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 15)",
      pageNumber: "15"
    },
    {
      id: "cpf-4",
      title: "Conservative Treatment",
      category: "Care Modalities & Protocol",
      impactType: "positive",
      impactLabel: "Conservative Care Exhausted",
      carrierArgument: "Carrier evaluates treatment modalities and patient response, arguing that escalating to interventional procedures or surgery is unjustified if a full course of conservative care (physical therapy, chiropractic, NSAIDs) was not fully exhausted or showed improvement.",
      rebuttal: "Plaintiff underwent 24+ documented physical therapy sessions and 2 fluoroscopic cervical epidural steroid injections with only transient relief, establishing documented conservative treatment failure and medical necessity for invasive intervention.",
      citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 48)",
      pageNumber: "48"
    },
    {
      id: "cpf-5",
      title: "Minimal Impact Claims",
      category: "Biomechanics & Property Damage",
      impactType: "warning",
      impactLabel: "Low Delta-V Cap Rebutted",
      carrierArgument: "Adjuster raises minimal vehicle damage ($1,850 bumper repair) under low-impact/minor impact soft-tissue guidelines, arguing that low delta-V collision forces are biomechanically insufficient to cause structural disc pathology.",
      rebuttal: "Modern energy-absorbing bumper isolators prevent cosmetic crushing by transferring crash kinetic energy directly through the vehicle frame to the occupant's cervical spine, biomechanically causing acute annular tearing regardless of vehicle exterior damage.",
      citation: "Vehicle Repair Estimate & MV-104",
      pageNumber: "Photos"
    },
    {
      id: "cpf-6",
      title: "Age",
      category: "Demographics & Actuarial",
      impactType: "positive",
      impactLabel: "39 Yrs Life Expectancy",
      carrierArgument: "Adjuster uses plaintiff's age (42) to attribute spinal wear to natural aging while seeking to compress multiplier ranges and limit future pain and suffering damages calculations.",
      rebuttal: "At age 42, plaintiff faces ~39 years of remaining statistical life expectancy living with permanent radiculopathy, cervical deficits, and chronic pain, significantly expanding lifetime non-economic general damages.",
      citation: "CDC Life Expectancy Tables (Age 42)",
      pageNumber: "Life-Table"
    },
    {
      id: "cpf-7",
      title: "Venue",
      category: "Jurisdiction & Jury Risk",
      impactType: "positive",
      impactLabel: "Kings County NY (High Carrier Risk)",
      carrierArgument: "Carrier factors county venue risk and seeks an aggressive pre-suit discount before an index number is filed in this historically plaintiff-favorable New York jurisdiction.",
      rebuttal: "Kings County (Brooklyn), NY is one of the highest-rated plaintiff-verdict forums in the nation; combined with New York's 9% statutory pre-judgment interest from verdict, carrier faces severe financial risk if the matter proceeds to trial.",
      citation: "Kings County Supreme Court Venue Index",
      pageNumber: "Court-NY"
    },
    {
      id: "cpf-8",
      title: "Surgical Hardware Distinction",
      category: "Surgical Severity Scoring",
      impactType: "positive",
      impactLabel: "Hardware & Anchor Tier (Max Points)",
      carrierArgument: "Claims software (Colossus/Guidewire) assigns significantly lower severity point tiers to percutaneous / needle / endoscopic decompression procedures compared to open surgeries requiring rigid hardware instrumentation, fusion plates, or suture anchors.",
      rebuttal: "Surgical recommendation specifies an open anterior cervical discectomy and fusion (ACDF) with rigid instrumentation and anchors upon conservative care failure, placing the claim in the maximum surgical severity algorithmic point tier.",
      citation: "Dr. Grossman Surgical Recommendation (Page 92)",
      pageNumber: "92"
    }
  ]

  const carrierPositionFactors = val.carrierPositionFactors || DEFAULT_CARRIER_POSITION_FACTORS

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
        doc.plaintiffNarrative = editContent
      } else if (sectionId === 'defense') {
        updateMockDocument(doc.id, { defenseNarrative: editContent })
        doc.defenseNarrative = editContent
      } else if (doc.summarySections) {
        const updatedSections = doc.summarySections.map((s: any) =>
          s.id === sectionId ? { ...s, content: editContent } : s
        )
        updateMockDocument(doc.id, { summarySections: updatedSections })
        const target = doc.summarySections.find((s: any) => s.id === sectionId)
        if (target) target.content = editContent
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
  ]

  const handleSourceClick = (e: React.MouseEvent, pageNumber?: string) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`${pathname}?tab=chronology`)
  }

  // Hover Annotation Component
  const AnnotatedText = ({ text }: { text: string }) => {
    // Sort annotations by length (longest first) to prevent partial matching issues
    const sortedAnnotations = [...annotations].sort((a, b) => b.term.length - a.term.length)

    let parts: { text: string; annotation?: any }[] = [{ text }]

    sortedAnnotations.forEach(ann => {
      const newParts: { text: string; annotation?: any }[] = []
      parts.forEach(part => {
        if (part.annotation) {
          newParts.push(part)
          return
        }

        const split = part.text.split(ann.term)
        for (let i = 0; i < split.length; i++) {
          if (split[i]) {
            newParts.push({ text: split[i] })
          }
          if (i < split.length - 1) {
            newParts.push({ text: ann.term, annotation: ann })
          }
        }
      })
      parts = newParts
    })

    const handleAnnotationClick = (e: React.MouseEvent, eventId: string) => {
      e.preventDefault()
      e.stopPropagation()
      router.push(`${pathname}?tab=chronology&eventId=${eventId}`)
    }

    return (
      <div className="whitespace-pre-wrap">
        {parts.map((part, i) => {
          if (part.annotation) {
            const ann = part.annotation
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
          return <span key={i}>{part.text}</span>
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white font-sans">
      <div className="p-4 md:p-6 pb-0 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Inner Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl w-fit flex-wrap gap-1">
          <button
            onClick={() => setPerspective('Plaintiff Narrative')}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${perspective === 'Plaintiff Narrative'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-300'
              : 'text-slate-500 hover:text-slate-700 border border-transparent'
              }`}
          >
            Plaintiff Narrative
          </button>
          <button
            onClick={() => setPerspective('Defense Narrative')}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${perspective === 'Defense Narrative'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-300'
              : 'text-slate-500 hover:text-slate-700 border border-transparent'
              }`}
          >
            Defense Narrative
          </button>
          <button
            onClick={() => setPerspective('Settlement & Negotiation Analysis')}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center gap-1.5 ${perspective === 'Settlement & Negotiation Analysis'
              ? 'bg-teal-900 text-white shadow-sm border border-teal-900'
              : 'text-teal-800 hover:text-teal-950 bg-teal-50/70 border border-teal-200/60'
              }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Settlement & Negotiation Analysis
          </button>
          <button
            onClick={() => setPerspective('Structured')}
            className={`px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${perspective === 'Structured'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-300'
              : 'text-slate-400 hover:text-slate-600 border border-transparent'
              }`}
          >
            Structured Breakdown
          </button>
        </div>
      </div>

      <div className="p-6 md:p-6 w-full flex-1 overflow-y-auto">
        <div className="max-w-none text-slate-700 leading-relaxed text-[14px]">

          {/* 1. PLAINTIFF NARRATIVE */}
          {perspective === 'Plaintiff Narrative' && doc?.plaintiffNarrative && (
            <div className="group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-teal-600"></span>
                  <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-widest m-0">Plaintiff Narrative (Case Presentation)</h3>
                </div>
                {editingSection !== 'plaintiff' ? (
                  <button
                    onClick={() => handleEditClick('plaintiff', doc.plaintiffNarrative)}
                    className="text-teal-600 hover:text-teal-700 text-[13px] font-bold px-3 py-1 rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => handleSaveClick('plaintiff')}
                    className="text-white bg-teal-600 hover:bg-teal-700 text-[13px] font-bold px-4 py-1 rounded-lg shadow-sm transition-colors"
                  >
                    Save Changes
                  </button>
                )}
              </div>

              {editingSection === 'plaintiff' ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full min-h-[140px] p-4 bg-white border-2 border-teal-500 rounded-xl outline-none focus:ring-0 text-slate-800 resize-y leading-relaxed text-[14px] shadow-inner"
                />
              ) : (
                <div className="text-slate-700 text-[15px] leading-relaxed font-normal">
                  <AnnotatedText text={doc.plaintiffNarrative} />
                </div>
              )}
            </div>
          )}

          {/* 2. DEFENSE NARRATIVE */}
          {perspective === 'Defense Narrative' && doc?.defenseNarrative && (
            <div className="group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-widest m-0">Defense Narrative (Anticipated Counterarguments)</h3>
                </div>
                {editingSection !== 'defense' ? (
                  <button
                    onClick={() => handleEditClick('defense', doc.defenseNarrative)}
                    className="text-teal-600 hover:text-teal-700 text-[13px] font-bold px-3 py-1 rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => handleSaveClick('defense')}
                    className="text-white bg-teal-600 hover:bg-teal-700 text-[13px] font-bold px-4 py-1 rounded-lg shadow-sm transition-colors"
                  >
                    Save Changes
                  </button>
                )}
              </div>

              {editingSection === 'defense' ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full min-h-[140px] p-4 bg-white border-2 border-teal-500 rounded-xl outline-none focus:ring-0 text-slate-800 resize-y leading-relaxed text-[14px] shadow-inner"
                />
              ) : (
                <div className="text-slate-700 text-[15px] leading-relaxed font-normal">
                  <AnnotatedText text={doc.defenseNarrative} />
                </div>
              )}
            </div>
          )}

          {/* 3. SETTLEMENT & NEGOTIATION ANALYSIS ⭐ NEW */}
          {perspective === 'Settlement & Negotiation Analysis' && (
            <div className="space-y-6 animate-in fade-in duration-300">

              {/* Top Overview Banner */}
              <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-md border border-teal-800/40">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-teal-500/20 text-teal-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-teal-500/30">
                        <Sparkles className="w-3 h-3 text-teal-400" /> Settlement Intelligence
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      Settlement & Negotiation Analysis
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                      AI-synthesized settlement corridor, value drivers, defense vulnerabilities, anticipated carrier counter-moves, and direct citation back-links to source medical records.
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300">
                      Overall Standing: Strong Favorable
                    </span>
                    <button
                      onClick={() => router.push(`${pathname}?tab=valuation`)}
                      className="text-xs font-bold text-teal-900 hover:text-slate-900 bg-teal-300 hover:bg-teal-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <span>Full Negotiation Center</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Structured Flow Breadcrumb Banner (Tree Hierarchy Visualization) */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                    <span>Settlement Intelligence Flow Architecture:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSettlementSection('all')}
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${settlementSection === 'all'
                        ? 'bg-teal-900 text-white font-bold'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      Show All (Complete Flow)
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-700 overflow-x-auto no-scrollbar py-0.5">
                  <button
                    onClick={() => setSettlementSection('drivers')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-1 ${settlementSection === 'drivers' ? 'bg-teal-900 text-white shadow-xs' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                  >
                    <TrendingUp className="w-3 h-3 text-emerald-600" /> Value Drivers ({valueDrivers.length})
                  </button>

                  <span className="text-slate-300 font-bold">└──</span>

                  <button
                    onClick={() => setSettlementSection('defense')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-1 ${settlementSection === 'defense' ? 'bg-teal-900 text-white shadow-xs' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                  >
                    <TrendingDown className="w-3 h-3 text-rose-600" /> Defense Pressure ({defensePressure.length})
                  </button>

                  <span className="text-slate-300 font-bold">└──</span>

                  <button
                    onClick={() => setSettlementSection('carrier')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-1 ${settlementSection === 'carrier' ? 'bg-teal-900 text-white shadow-xs' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                  >
                    <Cpu className="w-3 h-3 text-indigo-600" /> Carrier Position ({carrierPositionFactors.length})
                  </button>

                  <span className="text-slate-300 font-bold">└──</span>

                  <button
                    onClick={() => setSettlementSection('strategy')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-1 ${settlementSection === 'strategy' ? 'bg-teal-900 text-white shadow-xs' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                  >
                    <Target className="w-3 h-3 text-teal-600" /> Negotiation Strategy
                  </button>
                </div>
              </div>

              {/* SECTION 2: VALUE DRIVERS */}
              {(settlementSection === 'all' || settlementSection === 'drivers') && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-900">
                              Settlement Intelligence └── Value Drivers
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-0.5">Value Drivers</h4>
                          <p className="text-xs text-slate-500">What strengthens the plaintiff's recovery</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
                        {valueDrivers.length} Identified Drivers
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {valueDrivers.map((driver: any) => (
                        <div
                          key={driver.id}
                          className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-teal-300 hover:shadow-sm transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                  ✓
                                </span>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h5 className="text-sm font-bold text-slate-900">{driver.title}</h5>
                                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                                      {driver.category}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{driver.detail}</p>
                                </div>
                              </div>
                              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md shrink-0 ${driver.impactLevel === 'High' || driver.impact?.includes('High')
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                                : 'bg-teal-50 text-teal-800 border border-teal-200'
                                }`}>
                                {driver.impact || 'High Positive'}
                              </span>
                            </div>
                          </div>

                          {/* Source Reference Link */}
                          {driver.citation && (
                            <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 flex items-center gap-1 font-medium">
                                <FileText className="w-3 h-3 text-teal-600" /> Source Reference:
                              </span>
                              <button
                                onClick={(e) => handleSourceClick(e, driver.pageNumber)}
                                className="font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span>{driver.citation}</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center gap-2 text-xs text-teal-900 font-medium">
                    <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Every positive value driver is supported by radiographic findings and itemized medical entries.</span>
                  </div>
                </div>
              )}

              {/* SECTION 3: DEFENSE PRESSURE */}
              {(settlementSection === 'all' || settlementSection === 'defense') && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                          <TrendingDown className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-900">
                              Settlement Intelligence └── Defense Pressure
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-0.5">Defense Pressure</h4>
                          <p className="text-xs text-slate-500">What weakens the case or creates exposure</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                        {defensePressure.length} Exposure Points
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {defensePressure.map((pressure: any) => (
                        <div
                          key={pressure.id}
                          className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-rose-300 hover:shadow-sm transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                  !
                                </span>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h5 className="text-sm font-bold text-slate-900">{pressure.title}</h5>
                                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                                      {pressure.riskLevel || 'High'} Risk
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{pressure.detail}</p>
                                </div>
                              </div>
                              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md shrink-0 bg-rose-50 text-rose-800 border border-rose-200">
                                {pressure.impact || pressure.carrierDiscount || 'Moderate Negative'}
                              </span>
                            </div>
                          </div>

                          {/* Source Reference Link */}
                          {pressure.citation && (
                            <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 flex items-center gap-1 font-medium">
                                <FileText className="w-3 h-3 text-rose-600" /> Source Reference:
                              </span>
                              <button
                                onClick={(e) => handleSourceClick(e, pressure.pageNumber)}
                                className="font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span>{pressure.citation}</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-rose-50/60 rounded-xl border border-rose-100 flex items-center gap-2 text-xs text-rose-900 font-medium">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Deploying the AI Legal Rebuttals prevents adjusters from taking unwarranted alternative-causation discounts.</span>
                  </div>
                </div>
              )}

              {/* SECTION 4: CARRIER POSITION */}
              {(settlementSection === 'all' || settlementSection === 'carrier') && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-900">
                            Settlement Intelligence └── Carrier Position
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-0.5">Anticipated Carrier Position</h4>
                        <p className="text-xs text-slate-500">Anticipated insurer objections, software algorithms, and AI legal counter-rebuttals across core evaluation factors</p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                      {carrierPositionFactors.length} Evaluation Factors
                    </span>
                  </div>

                  {/* Anticipated Carrier Arguments Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {carrierPositionFactors.map((factor: any) => (
                      <div key={factor.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-900">{factor.title}</span>
                              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                                {factor.category}
                              </span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 border ${factor.impactType === 'positive'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : factor.impactType === 'warning'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                              }`}>
                              {factor.impactLabel || 'Carrier Assessment'}
                            </span>
                          </div>

                          <div className="mb-3 p-3 bg-white rounded-lg border border-slate-200/80">
                            <span className="text-[10px] uppercase font-bold text-rose-700 block mb-1 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-600" /> Carrier Claim / Algorithm Position:
                            </span>
                            <p className="text-xs text-slate-700 leading-relaxed italic">
                              "{factor.carrierArgument}"
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="pt-2.5 border-t border-slate-200/60 bg-teal-50/40 -mx-4 -mb-4 p-3.5 rounded-b-xl">
                            <span className="text-[10px] uppercase font-bold text-teal-800 block mb-1 flex items-center gap-1">
                              <Shield className="w-3.5 h-3.5 text-teal-600" /> AI Legal Counter-Rebuttal
                            </span>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {factor.rebuttal}
                            </p>

                            {factor.citation && (
                              <div className="mt-2.5 pt-2 border-t border-teal-100 flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 flex items-center gap-1 font-medium">
                                  <FileText className="w-3 h-3 text-teal-600" /> Source Reference:
                                </span>
                                <button
                                  onClick={(e) => handleSourceClick(e, factor.pageNumber)}
                                  className="font-semibold text-teal-700 hover:text-teal-900 bg-white hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-200 transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <span>{factor.citation}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center gap-2 text-xs text-indigo-900 font-medium">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>AI claims modeling anticipates adjuster algorithmic discounts across degenerative changes, prior records, treatment gaps, conservative care, impact severity, age, venue, and surgical classification.</span>
                  </div>
                </div>
              )}

              {/* SECTION 5: NEGOTIATION STRATEGY */}
              {(settlementSection === 'all' || settlementSection === 'strategy') && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                        <Target className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-900">
                            Settlement Intelligence └── Negotiation Strategy
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-0.5">Negotiation Strategy Playbook</h4>
                        <p className="text-xs text-slate-500">Tactical guidance on what to emphasize, what to avoid, and how to counter</p>
                      </div>
                    </div>
                  </div>

                  {/* Master Strategic Directive Box */}
                  <div className="bg-gradient-to-r from-teal-50 via-indigo-50 to-slate-50 border-2 border-teal-200/80 rounded-2xl p-5 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-900 block mb-1">
                      Master Negotiation Directive
                    </span>
                    <p className="text-sm md:text-[15px] font-semibold text-slate-800 leading-relaxed">
                      "{strategy.headline || "Do not lead heavily with the MRI alone because degenerative findings give the carrier an alternative-causation argument. Emphasize symptom onset, treatment consistency after the gap, injections and functional limitations."}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Column 1: What to Emphasize */}
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col">
                      <div className="flex items-center gap-2 mb-3 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>What to Emphasize</span>
                      </div>
                      <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed flex-1">
                        {(strategy.whatToEmphasize || [
                          "Consistent treatment and strict compliance following the initial 17-day period.",
                          "Documented functional limitations: inability to lift overhead, perform occupational tasks, or sleep uninterrupted.",
                          "Invasive interventional procedures: cervical epidural steroid injections and surgical recommendations.",
                          "Unimpeached liability: commercial vehicle striking a stationary car at a red light."
                        ]).map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                            <span className="text-emerald-600 font-bold mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 2: What NOT to Lead With */}
                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col">
                      <div className="flex items-center gap-2 mb-3 text-amber-900 font-bold text-xs uppercase tracking-wider">
                        <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>What NOT to Lead With</span>
                      </div>
                      <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed flex-1">
                        {(strategy.whatNotToLeadWith || [
                          "Do not lead primarily with isolated MRI radiologist notes regarding spondylosis without immediately pairing with the Eggshell Plaintiff causation brief.",
                          "Avoid opening debates regarding vehicle bumper repair costs; pivot directly to occupant kinetic transfer physics."
                        ]).map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-amber-100">
                            <span className="text-amber-600 font-bold mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 3: How to Respond to Defense Arguments */}
                    <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 flex flex-col">
                      <div className="flex items-center gap-2 mb-3 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                        <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>How to Respond to Carrier</span>
                      </div>
                      <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed flex-1">
                        {(strategy.howToRespondToDefense || [
                          "Counter the 17-day treatment gap by presenting the initial ER discharge instructions and treating physician onset timeline.",
                          "Counter pre-existing degeneration with proof of zero pre-collision cervical treatment across 8 years of primary care records.",
                          "Neutralize low property damage arguments using biomechanical bumper isolator elasticity mechanics."
                        ]).map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-indigo-100">
                            <span className="text-indigo-600 font-bold mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* 4. STRUCTURED BREAKDOWN */}
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
