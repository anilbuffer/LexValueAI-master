export const mockFirm = {
  id: "firm-1",
  name: "Smith & Associates LLP",
  email: "contact@smithassociates.com",
  phone: "555-0199",
  address: "123 Legal Way, Suite 400, New York, NY 10001",
  taxId: "12-3456789",
  require2fa: false,
  sessionTimeout: 60,
  dataRetention: "30",
  createdAt: new Date("2020-01-01T00:00:00Z"),
  updatedAt: new Date("2026-08-01T00:00:00Z"),
};

export const mockUser = {
  id: "user-1",
  firstName: "John",
  lastName: "Doe",
  email: "admin@lexvalue.com",
  phone: "555-0100",
  passwordHash: "mocked-hash",
  role: "ADMIN",
  isActive: true,
  firmId: mockFirm.id,
  managingPartnerId: null,
  attorneyId: null,
  createdAt: new Date("2020-01-01T00:00:00Z"),
  updatedAt: new Date("2026-08-01T00:00:00Z"),
};

export let mockUsers = [
  mockUser,
  {
    id: "user-2",
    firstName: "Mike",
    lastName: "Ross",
    email: "mike@smithassociates.com",
    phone: "555-0101",
    passwordHash: "mocked-hash",
    role: "ATTORNEY",
    isActive: true,
    firmId: mockFirm.id,
    managingPartnerId: mockUser.id,
    attorneyId: null,
    createdAt: new Date("2021-05-15T00:00:00Z"),
    updatedAt: new Date("2026-08-01T00:00:00Z"),
  },
  {
    id: "user-3",
    firstName: "Rachel",
    lastName: "Zane",
    email: "rachel@smithassociates.com",
    phone: "555-0102",
    passwordHash: "mocked-hash",
    role: "PARALEGAL",
    isActive: true,
    firmId: mockFirm.id,
    managingPartnerId: null,
    attorneyId: "user-2",
    createdAt: new Date("2022-03-10T00:00:00Z"),
    updatedAt: new Date("2026-08-01T00:00:00Z"),
  },
  {
    id: "client-1",
    firstName: "Debra",
    lastName: "Espinoza",
    email: "client@example.com",
    phone: "555-0123",
    passwordHash: "mocked-hash",
    role: "PLAINTIFF",
    isActive: true,
    firmId: mockFirm.id,
    managingPartnerId: null,
    attorneyId: null,
    createdAt: new Date("2026-01-10T10:00:00Z"),
    updatedAt: new Date("2026-08-01T00:00:00Z"),
  }
];

export let mockCases = [
  {
    id: "case-1",
    referenceId: "LVA-2026-001",
    title: "Espinoza v. Commercial Transport Inc.",
    client: "Debra Espinoza",
    clientEmail: "debra.e@example.com",
    clientPhone: "555-0123",
    clientAge: 45,
    clientGender: "Female",
    clientAddress: "456 Oak St, Brooklyn, NY 11201",
    type: "Medical Malpractice",
    dateOfInjury: new Date("2018-06-08T00:00:00Z"),
    status: "ACTIVE",
    flags: 10,
    customPrompt: null,
    approvalStatus: "APPROVED",
    rejectionReason: null,
    scanProgress: 100,
    scanStage: "COMPLETED",
    firmId: mockFirm.id,
    createdByUserId: mockUser.id,
    createdAt: new Date("2026-01-10T10:00:00Z"),
    updatedAt: new Date("2026-08-10T15:30:00Z"),
    documents: [
      {
        aiAnalysis: {
          shortSummary: "new case\nPatient: Robin Johnson (also documented as Lori Guidi in some records); DOB: Jan 01, 1958; Current age: 68 years old; Sex: Female. Patient is a 68-year-old female with a complex medical history involving multiple injuries sustained from a slip-and-fall accident on ice in Jan 2018 while being evacuated from her apartment complex. The incident resulted in injuries to her cervical spine, right shoulder, and bilateral knees. Patient: Robin Johnson (also documented as Lori Guidi in some records); DOB: Jan 01, 1958; Current age: 68 years old; Sex: Female. Patient is a 68-year-old female with a complex medical history involving multiple injuries sustained from a slip-and-fall accident on ice in Jan 2018 while being evacuated from her apartment complex. The incident resulted in injuries to her cervical spine, right shoulder, and bilateral knees."
        }
      }
    ],
    assignedUsers: [mockUser, mockUsers[1]],
  },
  {
    id: "case-2",
    referenceId: "LVA-2026-002",
    title: "Williams Auto Collision",
    client: "Marcus Williams",
    clientEmail: "marcus.w@example.com",
    clientPhone: "555-0144",
    clientAge: 32,
    clientGender: "Male",
    clientAddress: "789 Pine Ave, Queens, NY 11101",
    type: "Personal Injury",
    dateOfInjury: new Date("2026-04-20T00:00:00Z"),
    status: "REVIEWING",
    flags: 0,
    customPrompt: "Focus on whiplash and spinal injuries.",
    approvalStatus: "PENDING",
    rejectionReason: null,
    scanProgress: 45,
    scanStage: "PROCESSING",
    firmId: mockFirm.id,
    createdByUserId: mockUsers[1].id,
    createdAt: new Date("2026-07-25T09:15:00Z"),
    updatedAt: new Date("2026-08-12T11:20:00Z"),
    documents: [],
    assignedUsers: [mockUsers[1], mockUsers[2]],
  }
];

export let mockDocuments = [
  {
    id: "doc-1",
    fileName: "PD00302BDEAC13B19_Meds_Redacted.pdf",
    s3Key: "mock-s3-key-1.pdf",
    size: 2500000,
    mimeType: "application/pdf",
    status: "READY",
    summary: `PATIENT OVERVIEW
Robin Johnson (also documented interchangeably as Lori Guidi) is a 45-year-old female.
Date of Birth: Jan 01, 1958.
Gender: Female.
Occupation: Not specified.
Date of Incident: Jun 08, 2018.
Summary: Patient is a 45-year-old female who was involved in a motor vehicle accident (MVA) on Jun 08, 2018. She was a restrained driver in a vehicle that was rear-ended. She reported immediate onset of neck and back pain, which subsequently radiated to her left arm and right leg. She sought medical attention at the emergency room on the day of the accident. She was diagnosed with cervical and lumbar sprain/strain.

MECHANISM OF INJURY
Motor vehicle accident on Jun 08, 2018. Patient was the driver of a vehicle that was rear-ended. She was wearing a seatbelt. She stated that her vehicle was pushed forward and she felt a sudden "jolt" in her neck and back.

MEDICAL HISTORY
Prior to the MVA, patient reported a history of mild, occasional lower back pain. She denied any prior neck pain, upper extremity symptoms, or significant medical conditions. She also denied any prior surgeries or hospitalizations.

SURGERIES
- 10/15/2018: Anterior Cervical Discectomy and Fusion (ACDF) C5-C6 and C6-C7.
- 11/12/2018: Right shoulder arthroscopy with extensive debridement and SLAP repair.
- 06/15/2018: Left knee arthroscopy with partial medial meniscectomy.

FUNCTIONAL LIMITATIONS
- Difficulty turning head to the left/right.
- Pain with lifting objects overhead.
- Difficulty bending to tie shoes.
- Pain when sitting for prolonged periods.
- Trouble sleeping due to pain.

QUESTIONING LIST
- Did the patient wear the prescribed cervical orthosis after the ACDF surgery?
- Were there any complications during the left knee arthroscopy?
- Has the patient been compliant with physical therapy recommendations?`,
    summarySections: [
      { id: "sec-1", title: "PATIENT OVERVIEW", content: "Robin Johnson (also documented interchangeably as Lori Guidi) is a 45-year-old female.\nDate of Birth: Jan 01, 1958.\nGender: Female.\nOccupation: Not specified.\nDate of Incident: Jun 08, 2018.\nSummary: Patient is a 45-year-old female who was involved in a motor vehicle accident (MVA) on Jun 08, 2018. She was a restrained driver in a vehicle that was rear-ended. She reported immediate onset of neck and back pain, which subsequently radiated to her left arm and right leg. She sought medical attention at the emergency room on the day of the accident. She was diagnosed with cervical and lumbar sprain/strain. A subsequent Cervical Spine MRI revealed severe spondylosis with disc herniations at C5-C7." },
      { id: "sec-2", title: "MECHANISM OF INJURY", content: "Motor vehicle accident on Jun 08, 2018. Patient was the driver of a vehicle that was rear-ended. She was wearing a seatbelt. She stated that her vehicle was pushed forward and she felt a sudden \"jolt\" in her neck and back." },
      { id: "sec-3", title: "MEDICAL HISTORY", content: "Prior to the MVA, patient reported a history of mild, occasional lower back pain. She denied any prior neck pain, upper extremity symptoms, or significant medical conditions. She also denied any prior surgeries or hospitalizations." },
      { id: "sec-4", title: "SURGERIES", content: "- 10/15/2018: Anterior Cervical Discectomy and Fusion (ACDF) C5-C6 and C6-C7.\n- 11/12/2018: Right shoulder arthroscopy with extensive debridement and SLAP repair.\n- 06/15/2018: Left knee arthroscopy with partial medial meniscectomy." },
      { id: "sec-5", title: "FUNCTIONAL LIMITATIONS", content: "- Difficulty turning head to the left/right.\n- Pain with lifting objects overhead.\n- Difficulty bending to tie shoes.\n- Pain when sitting for prolonged periods.\n- Trouble sleeping due to pain." },
      { id: "sec-6", title: "QUESTIONING LIST", content: "- Did the patient wear the prescribed cervical orthosis after the ACDF surgery?\n- Were there any complications during the left knee arthroscopy?\n- Has the patient been compliant with physical therapy recommendations?" }
    ],
    plaintiffNarrative: "The plaintiff sustained significant, life-altering injuries as a direct result of the rear-end collision. Prior to the accident, she had no history of neck pain. The impact caused severe trauma requiring a complex C5-C7 ACDF surgery and multiple arthroscopic procedures, leading to permanent functional limitations.",
    defenseNarrative: "The defense notes that the plaintiff had pre-existing lower back complaints. Furthermore, there is a documented failure to comply with post-operative care instructions (e.g., not wearing the cervical orthosis), which likely exacerbated her symptoms and compromised surgical outcomes.",
    aiAnalysis: {
      flags: [
        {
          title: "Inconsistent Patient Name Documentation",
          text: "Patient is documented under multiple names throughout the medical record: 'Robin Johnson' and 'Lori Guidi' appear to be used interchangeably. This creates potential for medical record confusion and medication errors. Date of birth consistently listed as Jan 01, 1958.",
          severity: "high",
          pageNumber: "4, 6, 29, 52, 79, 84, 90, 119, 124-132",
          confidence: "High"
        },
        {
          title: "Multiple Dates of Birth Inconsistencies",
          text: "While most records list DOB as Jan 01, 1958, some pages show different years (1953, 1963, 1968, 1988, 1990, 1994). This is a critical data integrity issue that could affect medical decision-making and patient safety.",
          severity: "high",
          pageNumber: "15, 19, 20, 23, 25, 27, 38, 39, 78, 79, 80, 81, 82, ...",
          confidence: "High"
        },
        {
          title: "Cervical Orthosis Non-Compliance",
          text: "Documentation on page 68 explicitly states 'The patient has not been wearing the cervical orthosis brace.' This is a significant compliance issue post-ACDF surgery that could compromise surgical outcomes and increase risk of complications.",
          severity: "high",
          pageNumber: "68",
          confidence: "High"
        },
        {
          title: "Persistent Symptoms Despite Multiple Surgical Interventions",
          text: "Patient has undergone cervical spine fusion (ACDF at C5-C6 and C6-C7) and right shoulder arthroscopy with biceps tenodesis, yet continues to report significant pain and functional limitations. By Jan 2019, patient still experiencing moderate to severe bilateral shoulder pain, nocturnal symptoms, and ongoing left knee pain despite steroid injections.",
          severity: "high",
          pageNumber: "91, 92, 97, 98",
          confidence: "High"
        },
        {
          title: "Fragmented Medical Record - Multiple Facilities",
          text: "Patient's care is fragmented across multiple facilities (Good Samaritan Hospital, Long Island Spine & Orthopedics, Winthrop University Hospital, St. Charles Hospital, Orthopedic Associates of Long Island, Pequa Physical & Aquatic Therapy, Christopher Cline). This fragmentation may result in gaps in communication and coordination of care.",
          severity: "high",
          pageNumber: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, ...",
          confidence: "High"
        },
        {
          title: "Incomplete Follow-up Documentation",
          text: "Multiple treatment plans reference follow-up appointments and reevaluations that are not documented in the provided record. For example, page 77 mentions 'Reevaluation' and page 70 mentions 'New prescription for physical therapy for the neck and bilateral shoulders' but corresponding follow-up notes are not present.",
          severity: "medium",
          pageNumber: "70, 77",
          confidence: "Medium"
        },
        {
          title: "Recurrent Steroid Injections Without Clear Efficacy",
          text: "Patient received multiple steroid injections to right shoulder (documented on pages 66, 74) and left knee (page 98) with variable and temporary relief. Page 98 notes physician stated 'I do not recommend repeat injection but she assures me that this is just to temporize her symptoms.' This suggests potential overuse of steroid injections without definitive treatment.",
          severity: "high",
          pageNumber: "66, 74, 98",
          confidence: "High"
        },
        {
          title: "Potential Medication Interaction or Overuse",
          text: "Patient is documented on multiple pain medications including Vicodin ES, Vicodin, Percocet, and Nucynta. Multiple NSAIDs (ibuprofen, naproxen) are also documented. Concurrent use of multiple opioids and NSAIDs warrants review for potential interactions and appropriateness of pain management regimen.",
          severity: "medium",
          pageNumber: "30, 81, 82, 87, 88, 93, 95, 98, 153, 154, 158, 164, ...",
          confidence: "Medium"
        },
        {
          title: "Discrepancy in Surgical Date Documentation",
          text: "Right shoulder arthroscopy is documented with conflicting dates. Page 119 lists 'DATE OF PROCEDURE: 2049-01-01' and '2009-01-01' which are clearly erroneous. Context suggests procedure occurred in Jan 2019 based on post-operative follow-up documentation on pages 91-93.",
          severity: "high",
          pageNumber: "119",
          confidence: "High"
        },
        {
          title: "Left Shoulder Pathology Not Surgically Addressed",
          text: "Patient has documented left shoulder glenoid labral tear with subacromial bursitis (pages 63, 66, 68, 70, 73, 76) and received steroid injections, but no surgical intervention is documented for left shoulder despite ongoing pain and functional limitations.",
          severity: "high",
          pageNumber: "63, 66, 68, 70, 73, 76",
          confidence: "High"
        }
      ],
      gaps: [
        {
          title: "Missing Right Shoulder MRI Report",
          text: "Page 84 documents 'MRI: right shoulder non contrast' with diagnosis 'Pain in right shoulder' and 'Evaluate for RC tear' but the actual MRI report findings are not included in the provided document bundle. The MRI was ordered but the detailed radiologic findings are absent.",
          severity: "high",
          pageNumber: "84",
          confidence: "High"
        },
        {
          title: "Missing Cervical Spine MRI Reports from 2016-2017",
          text: "Multiple references to cervical spine MRI studies dated 2016-01-01 and 2017-01-01 are cited in clinical notes (pages 62, 63, 65, 66, 68, 70, 73, 76) but the actual MRI reports are not included in the document bundle. These studies are critical for understanding the progression of cervical pathology.",
          severity: "high",
          pageNumber: "62, 63, 65, 66, 68, 70, 73, 76",
          confidence: "High"
        },
        {
          title: "Missing Left Shoulder MRI Report",
          text: "Multiple references to left shoulder MRI dated 2016-01-01 are cited in clinical notes (pages 62, 63, 65, 66, 68, 70, 73, 76) documenting findings of 'Superior labral anterior glenoid labral tear, Large biceps tenosynovial effusion, Subacromial bursitis and subacromial bursal effusion' but the actual MRI report is not included.",
          severity: "high",
          pageNumber: "62, 63, 65, 66, 68, 70, 73, 76",
          confidence: "High"
        },
        {
          title: "Missing EMG/NCV Study Reports",
          text: "Multiple references to 'UPPER EMG/NCV STUDY DATED 2017-01-01' are cited in clinical notes (pages 62, 63, 65, 66, 68, 70, 73, 76) documenting findings of 'Left radiculopathy and carpal tunnel syndrome' but the actual EMG/NCV reports are not included in the document bundle.",
          severity: "high",
          pageNumber: "62, 63, 65, 66, 68, 70, 73, 76",
          confidence: "High"
        },
        {
          title: "Missing Lumbar Spine MRI",
          text: "Page 77 documents 'Physical therapy prescription with lumbar traction was given to the patient. Obtain MRI of the lumbar spine if symptoms persist despite physical therapy.' However, no lumbar spine MRI report is included in the document bundle despite patient's documented low back pain.",
          severity: "high",
          pageNumber: "77",
          confidence: "High"
        },
        {
          title: "Missing Physical Therapy Progress Notes",
          text: "While multiple physical therapy sessions are documented at Pequa Physical & Aquatic Therapy (pages 42-60) with treatment plans and goals, detailed progress notes documenting patient's response to therapy, functional improvements, and discharge summary are not included.",
          severity: "high",
          pageNumber: "42-60",
          confidence: "High"
        },
        {
          title: "Missing Operative Report for Left Knee Arthroscopy",
          text: "Page 134 documents surgical scheduling for 'Left knee arthroscopy, medial meniscectomy' but the complete operative report is not included. Only partial documentation appears on pages 137-138.",
          severity: "medium",
          pageNumber: "134, 137, 138",
          confidence: "Medium"
        }
      ]
    },
    caseId: "case-1",
    firmId: mockFirm.id,
    createdAt: new Date("2026-01-12T11:00:00Z"),
    updatedAt: new Date("2026-01-12T11:05:00Z"),
  },
  {
    id: "doc-2",
    fileName: "NYPD_Police_Report_MV104.pdf",
    s3Key: "mock-s3-key-2.pdf",
    size: 450000,
    mimeType: "application/pdf",
    status: "READY",
    summary: `POLICE REPORT SUMMARY
Date of Accident: Jun 08, 2018 at 08:15 AM
Location: Intersection of Atlantic Ave and Flatbush Ave, Brooklyn NY.
Vehicles Involved: Vehicle 1 (Driven by Robin Johnson, stopped at red light). Vehicle 2 (Driven by Commercial Driver, failed to stop).
Narrative: V1 was stopped at a steady red light. V2 rear-ended V1 at approximately 35 MPH. Driver of V1 complained of neck and back pain at the scene and was transported via EMS to City General Hospital. Driver of V2 cited for following too closely.`,
    summarySections: [
      { id: "sec-2-1", title: "COLLISION NARRATIVE", content: "V1 was stopped at a steady red light. V2 rear-ended V1 at approximately 35 MPH. Driver of V1 complained of neck and back pain at the scene and was transported via EMS to City General Hospital. Driver of V2 cited for following too closely." },
      { id: "sec-2-2", title: "INJURIES REPORTED", content: "Driver V1 (Johnson): Neck pain, back pain. Transported by ambulance." }
    ],
    plaintiffNarrative: "The evidence supports full liability on the defendant commercial driver who failed to stop and rear-ended the plaintiff at a high rate of speed.",
    defenseNarrative: "Liability is generally conceded, however, the severity of the impact is contested. Speed estimates are unverified.",
    aiAnalysis: {
      flags: [],
      gaps: []
    },
    caseId: "case-1",
    firmId: mockFirm.id,
    createdAt: new Date("2026-01-13T11:00:00Z"),
    updatedAt: new Date("2026-01-13T11:05:00Z"),
  }
];

export let mockNotifications = [
  {
    id: "notif-1",
    message: "New case 'Williams Auto Collision' requires approval.",
    type: "CASE_CREATED",
    isRead: false,
    userId: mockUser.id,
    firmId: mockFirm.id,
    caseId: "case-2",
    createdAt: new Date("2026-08-12T11:20:00Z"),
  },
  {
    id: "notif-2",
    message: "AI Scan completed for 'Espinoza v. Commercial Transport Inc.'.",
    type: "INFO",
    isRead: true,
    userId: mockUser.id,
    firmId: mockFirm.id,
    caseId: "case-1",
    createdAt: new Date("2026-08-10T15:30:00Z"),
  },
  {
    id: "notif-3",
    message: "Missing document requested: Right Shoulder MRI Report.",
    type: "PORTAL_DOCUMENT_REQUEST",
    isRead: false,
    userId: mockUsers[2].id, // client-1
    firmId: mockFirm.id,
    caseId: "case-1",
    createdAt: new Date("2026-08-14T09:00:00Z"),
  }
];

export let mockTimelineEvents = [
  {
    id: "event-1",
    date: new Date("2018-06-01T08:30:00Z"),
    title: "Orthopedic Evaluation - Cervical and Lumbar Spine",
    description: '{"text": "Initial evaluation for neck and back pain following a motor vehicle collision. Patient reports radiating pain and numbness.", "provider": "Dr. Christopher Cline, Long Island Spine", "time": "08:30 AM", "confidence": "High", "complaints": "Neck pain radiating to left arm, lower back pain, numbness in left hand.", "diagnosis": "Cervical radiculopathy, lumbar sprain/strain.", "treatment": "Recommended MRI of cervical and lumbar spine, physical therapy. Prescribed NSAIDs and muscle relaxants.", "pageNumber": "15"}',
    documentId: "doc-1",
    caseId: "case-1",
    firmId: mockFirm.id,
    createdAt: new Date("2026-01-12T11:05:00Z"),
  },
  {
    id: "event-2",
    date: new Date("2018-06-04T09:15:00Z"),
    title: "Left Knee MRI",
    description: '{"text": "MRI of left knee without contrast to evaluate persistent knee pain and swelling following the accident.", "provider": "Dr. Robert Bell, South Shore MRI", "time": "09:15 AM", "confidence": "High", "complaints": "Left knee pain, swelling, difficulty bearing weight.", "diagnosis": "Medial meniscus tear, mild joint effusion.", "pageNumber": "22"}',
    documentId: "doc-1",
    caseId: "case-1",
    firmId: mockFirm.id,
    createdAt: new Date("2026-01-12T11:05:00Z"),
  },
  {
    id: "event-3",
    date: new Date("2018-06-15T07:30:00Z"),
    title: "Left Knee Arthroscopy Surgery",
    description: '{"text": "Outpatient surgical procedure: Left knee arthroscopy with partial medial meniscectomy. No complications.", "provider": "Dr. Christopher Cline, Long Island Spine", "time": "07:30 AM", "confidence": "High", "diagnosis": "Medial meniscus tear, left knee.", "treatment": "Arthroscopic partial medial meniscectomy. Post-operative instructions provided.", "pageNumber": "35"}',
    documentId: "doc-1",
    caseId: "case-1",
    firmId: mockFirm.id,
    createdAt: new Date("2026-01-12T11:05:00Z"),
  },
  {
    id: "event-4",
    date: new Date("2018-07-10T11:00:00Z"),
    title: "Right Shoulder MRI",
    description: '{"text": "MRI right shoulder without contrast. Evaluated for persistent shoulder pain.", "provider": "Dr. Robert Bell, South Shore MRI", "time": "11:00 AM", "confidence": "Medium", "diagnosis": "Superior labral anterior-posterior (SLAP) tear, moderate supraspinatus tendinosis.", "pageNumber": "42"}',
    documentId: "doc-1",
    caseId: "case-1",
    firmId: mockFirm.id,
    createdAt: new Date("2026-01-12T11:05:00Z"),
  },
  {
    id: "event-5",
    date: new Date("2018-08-02T14:45:00Z"),
    title: "Neurosurgery Surgical Clearance Evaluation - Neural Foraminal Narrowing C5-7",
    description: '{"text": "Pre-surgical evaluation for ACDF surgery. Patient cleared for surgery. Detailed neurological exam performed showing diminished reflexes in C6 distribution.", "provider": "Dr. David Grossman, Empire City Medical", "time": "02:45 PM", "confidence": "High", "complaints": "Worsening neck pain, numbness in right arm.", "diagnosis": "C5-C7 neural foraminal narrowing, cervical radiculopathy.", "treatment": "Cleared for ACDF surgery. Ordered pre-op blood work and EKG.", "pageNumber": "55"}',
    documentId: "doc-1",
    caseId: "case-1",
    firmId: mockFirm.id,
    createdAt: new Date("2026-01-12T11:05:00Z"),
  },
  {
    id: "event-6",
    date: new Date("2018-08-12T10:15:00Z"),
    title: "EMG/NCV Upper Extremity",
    description: '{"text": "Nerve conduction study and electromyography of bilateral upper extremities.", "provider": "Dr. Sarah Jenkins, Neurological Associates", "time": "10:15 AM", "confidence": "High", "diagnosis": "Evidence of chronic right C6 and C7 radiculopathy. No evidence of carpal tunnel syndrome.", "pageNumber": "61"}',
    documentId: "doc-1",
    caseId: "case-1",
    firmId: mockFirm.id,
    createdAt: new Date("2026-01-12T11:05:00Z"),
  },
  {
    id: "event-7",
    date: new Date("2018-09-01T16:00:00Z"),
    title: "Physical Therapy Evaluation - Cervical and Lumbar Spine",
    description: '{"text": "Initial PT evaluation. Patient presents with decreased ROM in cervical and lumbar spine.", "provider": "Peak Performance Physical Therapy", "time": "04:00 PM", "confidence": "High", "complaints": "Neck and back stiffness.", "treatment": "Started on conservative therapy program. 2x/week for 6 weeks.", "pageNumber": "70"}',
    documentId: "doc-1",
    caseId: "case-1",
    firmId: mockFirm.id,
    createdAt: new Date("2026-01-12T11:05:00Z"),
  },
  {
    id: "event-8",
    date: new Date("2018-10-15T06:30:00Z"),
    title: "Anterior Cervical Discectomy and Fusion (ACDF) Surgery",
    description: '{"text": "Patient underwent ACDF at C5-C6 and C6-C7 with anterior plating and allograft. Procedure tolerated well. Discharged to recovery room in stable condition.", "provider": "Dr. David Grossman, Empire City Medical", "time": "06:30 AM", "confidence": "High", "diagnosis": "Severe cervical spondylosis with radiculopathy at C5-C7.", "treatment": "ACDF C5-C7. Post-operative care instructions provided. Prescribed pain medication (Percocet) and muscle relaxants.", "pageNumber": "85"}',
    documentId: "doc-1",
    caseId: "case-1",
    firmId: mockFirm.id,
    createdAt: new Date("2026-01-12T11:05:00Z"),
  },
  {
    id: "event-9",
    date: new Date("2018-11-12T09:00:00Z"),
    title: "Right Shoulder Arthroscopy",
    description: '{"text": "Right shoulder arthroscopy, extensive debridement, and SLAP repair.", "provider": "Dr. Christopher Cline, Long Island Spine", "time": "09:00 AM", "confidence": "High", "diagnosis": "SLAP tear right shoulder.", "treatment": "Arthroscopic SLAP repair. Arm placed in sling.", "pageNumber": "102"}',
    documentId: "doc-1",
    caseId: "case-1",
    firmId: mockFirm.id,
    createdAt: new Date("2026-01-12T11:05:00Z"),
  },
  {
    id: "event-10",
    date: new Date("2018-12-01T11:30:00Z"),
    title: "Right Knee Arthroscopy Follow-up",
    description: '{"text": "Routine post-operative follow up. Patient reports some lingering pain. Recommended continued physical therapy.", "provider": "Dr. Christopher Cline, Long Island Spine", "time": "11:30 AM", "confidence": "Medium", "pageNumber": "115"}',
    documentId: "doc-1",
    caseId: "case-1",
    firmId: mockFirm.id,
    createdAt: new Date("2026-01-12T11:05:00Z"),
  },
  {
    id: "event-11",
    date: new Date("2019-01-15T14:00:00Z"),
    title: "Neurology Follow-up - Cervical Radiculopathy",
    description: '{"text": "Follow up after ACDF surgery. Patient reports improvement in radiating pain but continued localized neck stiffness.", "provider": "Dr. Sarah Jenkins, Neurological Associates", "time": "02:00 PM", "confidence": "High", "pageNumber": "128"}',
    documentId: "doc-1",
    caseId: "case-1",
    firmId: mockFirm.id,
    createdAt: new Date("2026-01-12T11:05:00Z"),
  },
  {
    id: "event-12",
    date: new Date("2019-02-10T15:30:00Z"),
    title: "Physical Therapy Evaluation - Left Shoulder",
    description: '{"text": "Initial PT evaluation for left shoulder pain. Patient reports difficulty raising arm.", "provider": "Peak Performance Physical Therapy", "time": "03:30 PM", "confidence": "High", "pageNumber": "140"}',
    documentId: "doc-1",
    caseId: "case-1",
    firmId: mockFirm.id,
    createdAt: new Date("2026-01-12T11:05:00Z"),
  },
  {
    id: "event-13",
    date: new Date("2019-03-05T10:45:00Z"),
    title: "Right Shoulder Re-Evaluation - Persistent Pain",
    description: '{"text": "Patient returns with complaints of ongoing right shoulder pain despite surgery and physical therapy. Ordered repeat MRI.", "provider": "Dr. Christopher Cline, Long Island Spine", "time": "10:45 AM", "confidence": "High", "pageNumber": "155"}',
    documentId: "doc-1",
    caseId: "case-1",
    firmId: mockFirm.id,
    createdAt: new Date("2026-01-12T11:05:00Z"),
  }
];

export let mockAuditLogs = [
  {
    id: "log-1",
    action: "USER_LOGIN",
    details: "Harvey Specter logged in.",
    userId: mockUser.id,
    firmId: mockFirm.id,
    caseId: null,
    createdAt: new Date("2026-08-13T09:00:00Z"),
  }
];

export let mockCaseNotes = [
  {
    id: "note-1",
    caseId: "case-1",
    firmId: "firm-1",
    author: "Navneet Kaur",
    role: "Paralegal",
    type: "Follow-up",
    content: "Requested PT discharge summary from Coastal on 3 occasions. Escalating to records subpoena if not received this week.",
    isRestricted: false,
    createdAt: new Date("2026-08-10T10:00:00Z"),
  },
  {
    id: "note-2",
    caseId: "case-1",
    firmId: "firm-1",
    author: "Alexandra Guidi",
    role: "Attorney",
    type: "Strategy",
    content: "Do not submit demand until the radiology addendum is in hand — the degenerative language is the single biggest exposure here.",
    isRestricted: true,
    createdAt: new Date("2026-08-11T14:30:00Z"),
  }
];

export let mockPropertyDamage = [
  {
    id: "pd-1",
    caseId: "case-2",
    firmId: "firm-1",
    photos: ["/pd-example.jpg"],
    description: "Rear-end collision resulting in severe damage to the rear bumper and trunk. Frame damage suspected.",
    repairEstimate: 8500.00,
    vehicleInfo: "2023 Toyota Camry",
    createdAt: new Date("2026-08-12T10:00:00Z"),
  }
];


export let mockMedicalBills = [
  {
    id: "bill-6",
    caseId: "case-1",
    firmId: "firm-1",
    provider: "Shah Orthopedic Spine",
    datesOfService: "9/5/2025",
    billed: 0,
    adjusted: 0,
    paid: 0,
    balance: 0,
    isMissing: true,
    type: "Standard",
  },
  {
    id: "bill-1",
    caseId: "case-1",
    firmId: "firm-1",
    provider: "City General Hospital - ER",
    datesOfService: "06/08/2018",
    billed: 4500.00,
    adjusted: 1200.00,
    paid: 3300.00,
    balance: 0,
    type: "Standard",
  },
  {
    id: "bill-2",
    caseId: "case-1",
    firmId: "firm-1",
    provider: "South Shore MRI",
    datesOfService: "06/04/2018 - 07/10/2018",
    billed: 3200.00,
    adjusted: 500.00,
    paid: 2700.00,
    balance: 0,
    type: "PIP Pay-off",
  },
  {
    id: "bill-3",
    caseId: "case-1",
    firmId: "firm-1",
    provider: "Long Island Spine",
    datesOfService: "06/08/2018 - 12/01/2018",
    billed: 45000.00,
    adjusted: 15000.00,
    paid: 10000.00,
    balance: 20000.00,
    type: "Standard",
  },
  {
    id: "bill-4",
    caseId: "case-1",
    firmId: "firm-1",
    provider: "Empire City Medical Center",
    datesOfService: "10/15/2018",
    billed: 85000.00,
    adjusted: 35000.00,
    paid: 0,
    balance: 50000.00,
    type: "Medicare Lien",
  },
  {
    id: "bill-5",
    caseId: "case-1",
    firmId: "firm-1",
    provider: "Peak Performance Physical Therapy",
    datesOfService: "09/01/2018 - 02/10/2019",
    billed: 12500.00,
    adjusted: 4500.00,
    paid: 8000.00,
    balance: 0,
    type: "ERISA Subrogation",
  },
  {
    id: "bill-7",
    caseId: "case-1",
    firmId: "firm-1",
    provider: "Neurological Associates",
    datesOfService: "08/12/2018",
    billed: 0,
    adjusted: 0,
    paid: 0,
    balance: 0,
    isMissing: true,
    type: "Standard",
  }
];

export let mockDepositionOutlines = [
  {
    id: "depo-1",
    caseId: "case-1",
    firmId: "firm-1",
    deponentType: "Treating Physician (Dr. Christopher Cline)",
    targetRole: "Treating Physician",
    gaps: ["Missing physical therapy progress flowsheets for Dec 2018.", "Missing left knee arthroscopy operative narrative."],
    inconsistencies: ["Billing notes show injection on 08/12 while chart narrative indicates consultation only."],
    questionLines: [
      {
        topic: "Causation & MVA",
        category: "Causation",
        suggestedQuestion: "Dr. Cline, within a reasonable degree of medical certainty, did the motor vehicle collision on June 8th directly cause the acute disc herniations at C5-C6 and C6-C7?",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 35)",
        pageNumber: "35",
        impeachment: "Reference his initial orthopedic intake narrative where he explicitly concluded traumatic onset rather than degenerative origin.",
        branching: {
          ifYes: "Move to establish the necessity of the subsequent ACDF surgical intervention and permanent lifting restrictions.",
          ifNo: "Confront with his contemporaneous consultation notes on Page 35 declaring direct traumatic etiology."
        }
      },
      {
        topic: "17-Day Initial Treatment Gap",
        category: "Treatment Gaps",
        suggestedQuestion: "Is it medically customary for a patient with acute cervical whiplash to attempt conservative rest for 1-2 weeks before seeking specialized orthopedic intervention?",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 15)",
        pageNumber: "15",
        impeachment: "Defense will argue the 17-day delay proves lack of acute trauma. Lock doctor into confirming delayed inflammatory escalation.",
        branching: {
          ifYes: "Lock in doctor's explanation that disc edema and radicular pain frequently peak 10-14 days post-collision.",
          ifNo: "Clarify whether patient's delayed presentation altered his diagnostic conclusion in any manner."
        }
      },
      {
        topic: "Pre-Existing Degeneration vs. Acute Herniation",
        category: "Prior Injuries",
        suggestedQuestion: "Can you explain how a patient with asymptomatic age-related cervical spondylosis can suffer an acute traumatic disc herniation from sudden rear-end impact force?",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 85)",
        pageNumber: "85",
        impeachment: "Establish the Eggshell Plaintiff medical principle: trauma superimposed upon dormant degenerative architecture.",
        branching: {
          ifYes: "Have the physician distinguish between asymptomatic degenerative wear and the acute thecal sac compression documented on MRI.",
          ifNo: "Ask if he documented any prior complaints of radiating left arm pain before the accident date."
        }
      },
      {
        topic: "Billing & Chart Inconsistencies",
        category: "Inconsistencies",
        suggestedQuestion: "Doctor, can you clarify why the billing ledger reflects a procedure code for a right shoulder injection on August 12 while the progress note refers only to conservative physical therapy?",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 66)",
        pageNumber: "66",
        impeachment: "Cross-reference billing ledger line item with clinical note on Page 66 to resolve clerical discrepancy before defense raises it.",
        branching: {
          ifYes: "Confirm clerical entry correction and verify the physical therapy prescription was the primary order.",
          ifNo: "Review the medication administration log from the same visit."
        }
      }
    ]
  },
  {
    id: "depo-2",
    caseId: "case-1",
    firmId: "firm-1",
    deponentType: "Expert Witness (Dr. David Grossman - Neurosurgery)",
    targetRole: "Expert Witness",
    gaps: ["Pre-2018 baseline cervical radiographic studies."],
    inconsistencies: ["Conflicting diagnostic date codes on surgical pre-authorization."],
    questionLines: [
      {
        topic: "Surgical Necessity & Biomechanical Causation",
        category: "Causation",
        suggestedQuestion: "In your neurosurgical opinion, why was conservative physical therapy and epidural injections insufficient, necessitating the two-level ACDF surgery?",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 55, 85)",
        pageNumber: "55, 85",
        impeachment: "Operative report documents severe neural foraminal stenosis with active nerve root impingement that failed 4 months of conservative care.",
        branching: {
          ifYes: "Detail how structural mechanical compression cannot be relieved by physical therapy once neurological deficits emerge.",
          ifNo: "Confront with EMG/NCV findings documenting active chronic right C6 radiculopathy."
        }
      },
      {
        topic: "Adjacent Segment Disease & Future Care",
        category: "Treatment Gaps",
        suggestedQuestion: "Given the two-level fusion at C5-C7, what is the statistical probability of adjacent segment degeneration at C4-C5 over the patient's remaining life expectancy?",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 85)",
        pageNumber: "85",
        impeachment: "Peer-reviewed literature establishes a 25% 10-year risk of adjacent segment breakdown following multi-level cervical fusion.",
        branching: {
          ifYes: "Quantify future medical monitoring, revision surgery probability, and lifetime pain management costs.",
          ifNo: "Ask if he disagrees with published spinal biomechanics data on altered cervical kinematics."
        }
      },
      {
        topic: "Prior Asymptomatic Status",
        category: "Prior Injuries",
        suggestedQuestion: "Did you review the plaintiff's pre-accident primary care records, and did you find any evidence of prior cervical radiculopathy or treatment?",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 15)",
        pageNumber: "15",
        impeachment: "Primary care chart from 2010 to 2018 contains zero neck complaints or neuro evaluations.",
        branching: {
          ifYes: "Lock in that the records support the plaintiff was completely neurologically intact and asymptomatic prior to the collision.",
          ifNo: "Present Page 15 of the intake history showing zero prior cervical complaints."
        }
      }
    ]
  },
  {
    id: "depo-3",
    caseId: "case-1",
    firmId: "firm-1",
    deponentType: "Plaintiff (Debra Espinoza)",
    targetRole: "Plaintiff",
    gaps: ["17-day period prior to initial specialist presentation."],
    inconsistencies: ["Self-reported post-op brace compliance vs. chart note."],
    questionLines: [
      {
        topic: "17-Day Treatment Gap Explanation",
        category: "Treatment Gaps",
        suggestedQuestion: "Why did you wait 17 days following the accident before making your first appointment with the orthopedic specialist Dr. Cline?",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 15)",
        pageNumber: "15",
        impeachment: "Defense will claim the gap indicates the injury occurred elsewhere. Plaintiff must clearly explain initial conservative self-care.",
        branching: {
          ifYes: "Establish she took over-the-counter anti-inflammatories and rested, expecting the soreness to dissipate before radiating arm numbness forced a doctor visit.",
          ifNo: "Reiterate that no other accident or injury occurred during those 17 days."
        }
      },
      {
        topic: "Prior Lumbar Fatigue vs. Cervical Trauma",
        category: "Prior Injuries",
        suggestedQuestion: "Before June 8, 2018, had you ever sought treatment, taken prescription medication, or missed work due to neck pain or arm numbness?",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 15, 22)",
        pageNumber: "15, 22",
        impeachment: "Defense counsel will attempt to conflate a single 2017 mild lower back strain note with the acute cervical disc rupture.",
        branching: {
          ifYes: "Confirm prior 2017 complaint was isolated mild lower back fatigue that resolved in days with zero neck involvement.",
          ifNo: "Re-confirm she had never experienced cervical symptoms in her life."
        }
      },
      {
        topic: "Cervical Orthosis Compliance",
        category: "Inconsistencies",
        suggestedQuestion: "The medical chart on January 15, 2019 notes you were not wearing your cervical collar during that specific exam. Can you explain why?",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 68)",
        pageNumber: "68",
        impeachment: "Defense will allege surgical failure was caused by patient non-compliance with the post-operative brace.",
        branching: {
          ifYes: "Clarify she wore the collar continuously at home and during sleep, but temporarily removed it for the physical examination at the clinic.",
          ifNo: "Establish that her surgeon confirmed solid bony fusion on subsequent radiographic imaging regardless."
        }
      },
      {
        topic: "Immediate Crash Impact & Onset",
        category: "Causation",
        suggestedQuestion: "What physical sensations did you experience in your neck and upper body at the exact moment of the rear-end collision?",
        citation: "NYPD_Police_Report_MV104.pdf (Page 1)",
        pageNumber: "1",
        impeachment: "Lock in immediate violent flexion-extension whiplash motion and sharp burning sensation.",
        branching: {
          ifYes: "Detail immediate burning neck pain, steering wheel grip shock, and sudden onset numbness.",
          ifNo: "Corroborate with the police report narrative noting complaints of neck and back pain at the scene."
        }
      }
    ]
  },
  {
    id: "depo-4",
    caseId: "case-1",
    firmId: "firm-1",
    deponentType: "Opposing Party / Defense Examiner (DME)",
    targetRole: "Opposing Party",
    gaps: ["DME exam performed prior to second surgical intervention."],
    inconsistencies: ["Defense claim of low speed vs. physical bumper crushing."],
    questionLines: [
      {
        topic: "Commercial Driver Distraction & Speed",
        category: "Causation",
        suggestedQuestion: "Isn't it true that you were traveling at approximately 35 MPH when you rear-ended the plaintiff's stopped vehicle at a steady red light?",
        citation: "NYPD_Police_Report_MV104.pdf (Section 2-1)",
        pageNumber: "1-2",
        impeachment: "Police report MV-104 documents 35 MPH speed estimate and traffic citation for 'Following Too Closely'.",
        branching: {
          ifYes: "Establish that the evidence supports unimpeachable liability and high kinetic transfer.",
          ifNo: "Present the police citation and photos showing compressed rear bumper crush zones."
        }
      },
      {
        topic: "DME Pre-Surgical Examination Timing",
        category: "Inconsistencies",
        suggestedQuestion: "Doctor, your defense report claims the plaintiff was 'fully resolved,' yet your one-time physical exam occurred before her ACDF spine surgery, correct?",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 85)",
        pageNumber: "85",
        impeachment: "DME report date was Oct 1, 2018; surgical fusion occurred Oct 15, 2018. The examiner never evaluated the post-surgical patient.",
        branching: {
          ifYes: "Lock in that his report cannot medically assess post-fusion functional deficits or permanent restrictions.",
          ifNo: "Confront with the respective dates on the face of both documents."
        }
      },
      {
        topic: "Absence of Prior Cervical Complaints",
        category: "Prior Injuries",
        suggestedQuestion: "In your review of all 8 years of pre-collision primary care records, did you find a single documented complaint of cervical radiculopathy?",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 15)",
        pageNumber: "15",
        impeachment: "Confront defense expert with the complete absence of prior neck treatment in the medical history.",
        branching: {
          ifYes: "Lock in admission that plaintiff had zero functional cervical impairment prior to June 8, 2018.",
          ifNo: "Demand he identify the specific page and provider in the record."
        }
      }
    ]
  }
];

export let mockCaseValuations = [
  {
    id: "val-1",
    caseId: "case-1",
    firmId: "firm-1",
    confidence: 94,
    specialsTotal: 31400,
    overallCaseStrength: "Strong Favorable",
    directionalImpact: "Strong Positive",
    valueDrivers: [
      {
        id: "vd-1",
        title: "MRI-confirmed disc herniation",
        category: "Objective Imaging",
        impact: "High Positive",
        impactLevel: "High",
        detail: "Cervical MRI confirms C5-C6 and C6-C7 focal disc herniation with thecal sac compression and C6 nerve root abutment.",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 85)",
        pageNumber: "85"
      },
      {
        id: "vd-2",
        title: "Epidural injections & interventional care",
        category: "Invasive Treatment",
        impact: "High Positive",
        impactLevel: "High",
        detail: "Patient underwent targeted fluoroscopy-guided cervical epidural steroid injections demonstrating failure of conservative therapy.",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Pages 66 & 74)",
        pageNumber: "66, 74"
      },
      {
        id: "vd-3",
        title: "Consistent treatment post-gap",
        category: "Treatment Pattern",
        impact: "Moderate Positive",
        impactLevel: "Moderate",
        detail: "Active 4-month physical therapy regimen (3x/week) and consistent orthopedic follow-ups demonstrating diligent patient compliance.",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Pages 70-82)",
        pageNumber: "70-82"
      },
      {
        id: "vd-4",
        title: "Clear liability (rear-end at red light)",
        category: "Liability & Fault",
        impact: "High Positive",
        impactLevel: "High",
        detail: "Clear rear-end collision at red light with commercial driver cited for following too closely. Zero comparative negligence.",
        citation: "NYPD_Police_Report_MV104.pdf (Page 1-2)",
        pageNumber: "1-2"
      },
      {
        id: "vd-5",
        title: "$31,400 itemized economic specials",
        category: "Economic Damages",
        impact: "Moderate Positive",
        impactLevel: "Moderate",
        detail: "Fully itemized and un-contested medical specials ($27,200) plus verified lost wage documentation ($4,200).",
        citation: "Verified Medical Bills & Wage Ledger",
        pageNumber: "Bills"
      }
    ],
    defensePressure: [
      {
        id: "dp-1",
        title: "17-day treatment gap",
        category: "Treatment Continuity",
        impact: "Moderate Negative",
        impactLevel: "Moderate",
        riskLevel: "High",
        detail: "17-day delay between the date of the collision (06/08/2018) and the first specialized orthopedic presentation (06/25/2018).",
        carrierArgument: "Carrier argues the 17-day gap indicates initial injury was mild or that intervening trauma occurred.",
        rebuttal: "Debra initially attempted conservative self-care and bed rest believing symptoms were temporary strain. When radiating radicular pain intensified, she promptly sought specialist care. Zero intervening trauma occurred during the 17 days.",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 15)",
        pageNumber: "15"
      },
      {
        id: "dp-2",
        title: "Pre-existing degenerative disc findings",
        category: "Alternative Causation",
        impact: "Moderate Negative",
        impactLevel: "Moderate",
        riskLevel: "High",
        detail: "Radiologist notes mild age-related spondylosis and facet arthropathy on cervical imaging.",
        carrierArgument: "Carrier asserts disc pathology is pre-existing degeneration rather than collision-induced trauma.",
        rebuttal: "Under the Eggshell Plaintiff Doctrine, the defense takes the plaintiff as they find them. The records support that Debra was entirely asymptomatic and working without restriction prior to the collision. The impact converted a dormant degenerative state into an acute symptomatic condition.",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 85)",
        pageNumber: "85"
      },
      {
        id: "dp-3",
        title: "Prior lumbar complaint in 2017",
        category: "Medical History",
        impact: "Low Negative",
        impactLevel: "Low",
        riskLevel: "Medium",
        detail: "A single medical visit in 2017 referenced occasional lower back fatigue after lifting.",
        carrierArgument: "Carrier claims prior back complaints indicate chronic pre-existing musculoskeletal vulnerability.",
        rebuttal: "The 2017 incident was an isolated muscular strain that resolved completely within 10 days with zero follow-up, and involves the lumbar spine rather than the primary C5-C7 cervical disc herniation at issue.",
        citation: "PD00302BDEAC13B19_Meds_Redacted.pdf (Page 22)",
        pageNumber: "22"
      },
      {
        id: "dp-4",
        title: "Minimal exterior vehicle property damage",
        category: "Impact Biomechanics",
        impact: "Low Negative",
        impactLevel: "Low",
        riskLevel: "Medium",
        detail: "Property damage to plaintiff rear bumper estimated at $1,420 with no structural frame compromise.",
        carrierArgument: "Adjuster applies low-impact algorithm guidelines claiming low speed cannot produce structural disc injury.",
        rebuttal: "Modern energy-absorbing bumper isolators prevent exterior vehicle crushing by transferring crash kinetic energy directly through the chassis and seat system to the occupant's cervical spine.",
        citation: "Vehicle Repair Estimate & MV-104",
        pageNumber: "Photos"
      }
    ],
    carrierPositionFactors: [
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
    ],
    carrierModel: {
      discountFactorsApplied: [
        { factor: "17-Day Gap Penalty", impact: "Moderate Negative", reason: "Automated reduction for uncorroborated gap between accident and initial specialist visit." },
        { factor: "Pre-Existing Degeneration Offset", impact: "Moderate Negative", reason: "Alternative causation reduction applied to cervical soft tissue & disc injury rating." },
        { factor: "Low Property Damage Multiplier Cap", impact: "Low Negative", reason: "Sub-$2,000 property damage triggers insurance low-impact adjuster guideline." }
      ]
    },
    negotiationStrategy: {
      headline: "Do not lead heavily with the MRI alone because degenerative findings give the carrier an alternative-causation argument. Emphasize symptom onset, treatment consistency after the gap, injections and functional limitations.",
      whatToEmphasize: [
        "Consistent treatment and strict compliance following the initial 17-day period.",
        "Documented functional limitations: inability to lift overhead, perform occupational tasks, or sleep uninterrupted.",
        "Invasive interventional procedures: cervical epidural steroid injections and surgical recommendations.",
        "Unimpeached liability: commercial vehicle striking a stationary car at a red light."
      ],
      whatNotToLeadWith: [
        "Do not lead primarily with isolated MRI radiologist notes regarding spondylosis without immediately pairing with the Eggshell Plaintiff causation brief.",
        "Avoid opening debates regarding vehicle bumper repair costs; pivot directly to occupant kinetic transfer physics."
      ],
      howToRespondToDefense: [
        "Counter the 17-day treatment gap by presenting the initial ER discharge instructions and treating physician onset timeline.",
        "Counter pre-existing degeneration with proof of zero pre-collision cervical treatment across 8 years of primary care records.",
        "Neutralize low property damage arguments using biomechanical bumper isolator elasticity mechanics."
      ],
      keyLeveragePoints: [
        "Unimpeached liability: The evidence supports adverse driver fault at steady red light, eliminating comparative risk.",
        "Verified economic specials ($31,400) creates a strong mathematical floor for settlement discussions.",
        "Documented functional limitations provide compelling trial narrative for non-economic pain and suffering.",
        "Eggshell plaintiff doctrine completely overcomes adjuster's pre-existing spondylosis deductions under NY law."
      ]
    }
  },
  {
    id: "val-2",
    caseId: "case-2",
    firmId: "firm-1",
    minEstimate: 65000,
    maxEstimate: 95000,
    estimatedSettlementMin: 65000,
    estimatedSettlementMax: 95000,
    likelyCarrierMin: 32000,
    likelyCarrierMax: 48000,
    recommendedDemand: 135000,
    specialsTotal: 22800,
    confidence: 88,
    factorsUp: [
      "Documented whiplash & cervical sprain/strain",
      "Confirmed $22,800 in medical specials",
      "Immediate ER transport from accident scene"
    ],
    factorsDown: [
      "No MRI disc herniation reported to date",
      "Subjective soft tissue complaints only",
      "Gap in therapy during month 2"
    ],
    valueDrivers: [
      {
        id: "vd-2-1",
        title: "Immediate emergency department transport",
        category: "Emergency Care",
        impact: "+$15,000",
        detail: "EMS transport from the scene establishes immediate onset of cervical and lumbar pain.",
        citation: "EMS Run Sheet & ER Intake",
        pageNumber: "ER-1"
      },
      {
        id: "vd-2-2",
        title: "$22,800 confirmed specials",
        category: "Economic Damages",
        impact: "+$22,800",
        detail: "Itemized diagnostic and chiropractic bills with full documentation.",
        citation: "Billing Ledger",
        pageNumber: "Ledger"
      }
    ],
    defensePressure: [
      {
        id: "dp-2-1",
        title: "Soft tissue only diagnosis",
        category: "Diagnostic Severity",
        carrierDiscount: "-$14,000",
        riskLevel: "Medium",
        detail: "Absence of objective MRI nerve impingement or disc bulge.",
        rebuttal: "Objective range of motion deficits (>35% reduction) and orthopedic spasm findings establish verifiable trauma.",
        citation: "Chiro Notes",
        pageNumber: "12"
      }
    ],
    carrierModel: {
      softwarePredictedName: "Colossus / ISO ClaimOutcome",
      baselineInitialAuthority: 32000,
      maximumAuthorizedCeiling: 48000,
      injurySeverityPoints: 48,
      discountFactorsApplied: [
        { factor: "Soft Tissue Multiplier Cap", impact: "1.5x specials cap", reason: "Standard bodily injury cap for non-surgical soft tissue sprain/strain." }
      ]
    },
    negotiationStrategy: {
      headline: "Anchor demand around $135k based on immediate ER documentation and unyielding functional spasms, anticipating a carrier settlement in the $65k-$80k range.",
      openingMove: "Serve demand at $135,000 citing EMS run report and continuous cervical spasms.",
      expectedCarrierMove: "Adjuster will open at $30k–$35k treating as routine soft tissue.",
      counterMoveStrategy: "Highlight persistent ROM restrictions and counter at $95,000.",
      settlementTargetCorridor: "$65,000–$95,000",
      keyLeveragePoints: [
        "Scene EMS documentation rules out delayed reporting arguments."
      ],
      bracketGuide: [
        { round: "Round 1", plaintiff: "$135,000", expectedDefense: "$32,000", midpoint: "$83,500", note: "Opening demand" },
        { round: "Round 2", plaintiff: "$95,000", expectedDefense: "$55,000", midpoint: "$75,000", note: "Closing in on settlement target" }
      ]
    }
  }
];

export let mockChatHistory = [
  {
    id: "chat-1",
    caseId: "case-1",
    firmId: "firm-1",
    sender: "ai",
    content: "Ask me anything about this medical record — I answer with page citations from the chronology.",
    citation: null,
    createdAt: new Date("2026-08-14T10:00:00Z"),
  }
];

export let mockDocumentRequests = [
  {
    id: "req-1",
    caseId: "case-1",
    firmId: "firm-1",
    documentName: "Right Shoulder MRI Report",
    description: "Please provide the detailed radiology report for the right shoulder MRI you had in 2018.",
    status: "PENDING", // PENDING, FULFILLED
    requestedBy: "Rachel Zane",
    createdAt: new Date("2026-08-14T09:00:00Z"),
  }
];

export let mockPortalUpdates = [
  {
    id: "update-1",
    caseId: "case-1",
    firmId: "firm-1",
    title: "Medical Records Under Review",
    description: "Our paralegal team is currently reviewing your uploaded medical records.",
    createdAt: new Date("2026-08-13T14:30:00Z"),
  },
  {
    id: "update-2",
    caseId: "case-1",
    firmId: "firm-1",
    title: "Case Opened",
    description: "Your case has been successfully opened and assigned to our legal team.",
    createdAt: new Date("2026-01-10T10:00:00Z"),
  }
];

export let mockClientUploadedDocuments = [
  {
    id: "client-doc-1",
    caseId: "case-1",
    firmId: "firm-1",
    fileName: "Emergency_Room_Bill.pdf",
    category: "Medical Bills",
    status: "ACCEPTED", // PENDING_REVIEW, ACCEPTED, REJECTED
    uploadedAt: new Date("2026-08-12T11:00:00Z"),
  }
];

export interface MockNegotiationLog {
  id: string;
  firmId: string;
  caseId: string;
  roundNumber: number;
  date: Date;
  type: string;
  amount: number;
  author: string;
  recipient: string;
  notes: string;
  status: string;
}

export interface MockSettlementOutcome {
  id: string;
  firmId: string;
  caseId: string;
  caseTitle: string;
  injuryType: string;
  jurisdiction: string;
  carrierName: string;
  openingDemand: number;
  initialCarrierOffer: number;
  carrierOffersCount: number;
  finalOffer: number;
  finalSettlement: number;
  medicalSpecials: number;
  settlementRatio: number;
  timeToSettleDays: number;
  closedDate: Date;
  primaryValueDrivers: string[];
  primaryDefenseWeaknesses: string[];
  notes: string;
}

export let mockNegotiationLogs: MockNegotiationLog[] = [
  {
    id: "neg-1",
    firmId: "firm-1",
    caseId: "case-1",
    roundNumber: 1,
    date: new Date("2026-07-10T10:00:00Z"),
    type: "DEMAND",
    amount: 175000,
    author: "Attorney Mike Ross",
    recipient: "Travelers Adjuster Sarah Jenkins",
    notes: "Formal policy demand served backed by MRI, injection records, and $31,400 confirmed specials ledger.",
    status: "SUPERSEDED"
  },
  {
    id: "neg-2",
    firmId: "firm-1",
    caseId: "case-1",
    roundNumber: 1,
    date: new Date("2026-07-28T14:30:00Z"),
    type: "OFFER",
    amount: 32000,
    author: "Travelers Adjuster Sarah Jenkins",
    recipient: "Attorney Mike Ross",
    notes: "Adjuster opened with lowball citing 17-day gap and pre-existing degenerative changes on radiologist notes.",
    status: "SUPERSEDED"
  },
  {
    id: "neg-3",
    firmId: "firm-1",
    caseId: "case-1",
    roundNumber: 2,
    date: new Date("2026-08-05T11:15:00Z"),
    type: "COUNTER_DEMAND",
    amount: 145000,
    author: "Attorney Mike Ross",
    recipient: "Travelers Adjuster Sarah Jenkins",
    notes: "Countered with Eggshell Plaintiff legal rebuttal and treating surgeon causation affirmation.",
    status: "SUPERSEDED"
  },
  {
    id: "neg-4",
    firmId: "firm-1",
    caseId: "case-1",
    roundNumber: 2,
    date: new Date("2026-08-18T16:00:00Z"),
    type: "COUNTER_OFFER",
    amount: 58000,
    author: "Travelers Adjuster Sarah Jenkins",
    recipient: "Attorney Mike Ross",
    notes: "Carrier increased authority after supervisor review of injection logs. Spread narrowed to $87,000.",
    status: "ACTIVE"
  }
];

export let mockSettlementOutcomes: MockSettlementOutcome[] = [
  {
    id: "outcome-1",
    firmId: "firm-1",
    caseId: "case-legacy-1",
    caseTitle: "Martinez v. Logistics Express Corp.",
    injuryType: "L4-L5 Lumbar Disc Herniation w/ Epidural Injections",
    jurisdiction: "New York County Supreme Court, NY",
    carrierName: "Liberty Mutual Commercial",
    openingDemand: 195000,
    initialCarrierOffer: 35000,
    carrierOffersCount: 4,
    finalOffer: 98000,
    finalSettlement: 105000,
    medicalSpecials: 34200,
    settlementRatio: 3.07,
    timeToSettleDays: 165,
    closedDate: new Date("2026-06-12T14:00:00Z"),
    primaryValueDrivers: ["Confirmed L4-L5 herniation on MRI", "Fluoroscopic ESI procedures", "Evidence supports commercial liability"],
    primaryDefenseWeaknesses: ["14-day gap after urgent care", "Degenerative spondylolisthesis note"],
    notes: "Settled at mediator pre-trial conference after rebuttal of pre-existing degeneration with eggshell doctrine."
  },
  {
    id: "outcome-2",
    firmId: "firm-1",
    caseId: "case-legacy-2",
    caseTitle: "Chen v. Fleet Transit LLC",
    injuryType: "Cervical Strain / Sprain w/ 6 Months Physical Therapy",
    jurisdiction: "Queens County Supreme Court, NY",
    carrierName: "State Farm Mutual",
    openingDemand: 85000,
    initialCarrierOffer: 15000,
    carrierOffersCount: 3,
    finalOffer: 42000,
    finalSettlement: 45000,
    medicalSpecials: 16800,
    settlementRatio: 2.68,
    timeToSettleDays: 98,
    closedDate: new Date("2026-07-01T11:00:00Z"),
    primaryValueDrivers: ["Immediate EMS transport from scene", "Consistent 3x/week physical therapy compliance"],
    primaryDefenseWeaknesses: ["Absence of surgical or interventional recommendation", "Minor rear bumper damage"],
    notes: "Settled within 100 days directly with claims adjuster prior to formal litigation filing."
  }
];

export const getMockUser = () => mockUser;
export const getMockCases = () => mockCases;
export const getMockCaseById = (id: string) => mockCases.find((c: any) => c.id === id);
export const getMockDocumentsForCase = (caseId: string) => mockDocuments.filter((d: any) => d.caseId === caseId);
export const getMockTimelineForCase = (caseId: string) => mockTimelineEvents.filter((t: any) => t.caseId === caseId);
export const getMockNotifications = () => mockNotifications;
export const getMockAuditLogs = () => mockAuditLogs;
export const getMockUsers = () => mockUsers;
export const getMockFirm = () => mockFirm;

// Phase 2 Getters with strict firmId filtering
export const getMockCaseNotes = (firmId: string, caseId: string) => mockCaseNotes.filter((n: any) => n.firmId === firmId && n.caseId === caseId);
export const getMockPropertyDamage = (firmId: string, caseId: string) => mockPropertyDamage.filter((p: any) => p.firmId === firmId && p.caseId === caseId);
export const getMockNegotiationLogs = (firmId: string, caseId: string) => mockNegotiationLogs.filter((n: any) => n.firmId === firmId && n.caseId === caseId);
export const getMockMedicalBills = (firmId: string, caseId: string) => mockMedicalBills.filter((b: any) => b.firmId === firmId && b.caseId === caseId);
export const getMockDepositionOutlines = (firmId: string, caseId: string) => mockDepositionOutlines.filter((d: any) => d.firmId === firmId && d.caseId === caseId);
export const getMockCaseValuations = (firmId: string, caseId: string) => mockCaseValuations.filter((v: any) => v.firmId === firmId && v.caseId === caseId);
export const getMockSettlementOutcomes = (firmId: string, caseId?: string) => {
  if (caseId) {
    return mockSettlementOutcomes.filter((s: any) => s.firmId === firmId && s.caseId === caseId);
  }
  return mockSettlementOutcomes.filter((s: any) => s.firmId === firmId);
};
export const getMockChatHistory = (firmId: string, caseId: string) => mockChatHistory.filter((c: any) => c.firmId === firmId && c.caseId === caseId);
export const getMockDocumentRequests = (firmId: string, caseId: string) => mockDocumentRequests.filter((r: any) => r.firmId === firmId && r.caseId === caseId);
export const getMockPortalUpdates = (firmId: string, caseId: string) => mockPortalUpdates.filter((u: any) => u.firmId === firmId && u.caseId === caseId);
export const getMockClientUploadedDocuments = (firmId: string, caseId: string) => mockClientUploadedDocuments.filter((d: any) => d.firmId === firmId && d.caseId === caseId);

// Mutators
export const createMockCase = (newCase: any) => { mockCases.push(newCase); return newCase; }
export const updateMockCase = (id: string, data: any) => {
  const index = mockCases.findIndex(c => c.id === id);
  if (index > -1) { mockCases[index] = { ...mockCases[index], ...data }; return mockCases[index]; }
  return null;
}
export const deleteMockCase = (id: string) => { mockCases = mockCases.filter(c => c.id !== id); }

export const createMockUser = (newUser: any) => { mockUsers.push(newUser); return newUser; }
export const updateMockUser = (id: string, data: any) => {
  const index = mockUsers.findIndex(u => u.id === id);
  if (index > -1) { mockUsers[index] = { ...mockUsers[index], ...data }; return mockUsers[index]; }
  return null;
}
export const deleteMockUser = (id: string) => { mockUsers = mockUsers.filter(u => u.id !== id); }

export const createMockDocument = (newDoc: any) => { mockDocuments.push(newDoc); return newDoc; }
export const updateMockDocument = (id: string, data: any) => {
  const index = mockDocuments.findIndex(d => d.id === id);
  if (index > -1) { mockDocuments[index] = { ...mockDocuments[index], ...data }; return mockDocuments[index]; }
  return null;
}
export const deleteMockDocument = (id: string) => { mockDocuments = mockDocuments.filter(d => d.id !== id); }

export const createMockNotification = (newNotif: any) => { mockNotifications.push(newNotif); return newNotif; }
export const createMockAuditLog = (newLog: any) => { mockAuditLogs.push(newLog); return newLog; }

// Phase 2 Mutators
export const createMockCaseNote = (note: any) => { mockCaseNotes.unshift(note); return note; }
export const createMockPropertyDamage = (pd: any) => { mockPropertyDamage.unshift(pd); return pd; }
export const createMockNegotiationLog = (log: MockNegotiationLog) => { mockNegotiationLogs.push(log); return log; }
export const createMockSettlementOutcome = (outcome: MockSettlementOutcome) => { mockSettlementOutcomes.unshift(outcome); return outcome; }
export const createMockMedicalBill = (bill: any) => { mockMedicalBills.unshift(bill); return bill; }
export const updateMockMedicalBill = (id: string, data: any) => {
  const index = mockMedicalBills.findIndex(b => b.id === id);
  if (index > -1) { mockMedicalBills[index] = { ...mockMedicalBills[index], ...data }; return mockMedicalBills[index]; }
  return null;
}
export const deleteMockMedicalBill = (id: string) => { mockMedicalBills = mockMedicalBills.filter(b => b.id !== id); }
export const createMockChatHistory = (chat: any) => { mockChatHistory.push(chat); return chat; }
export const fulfillMockDocumentRequest = (id: string) => {
  const index = mockDocumentRequests.findIndex(r => r.id === id);
  if (index > -1) { mockDocumentRequests[index].status = "FULFILLED"; return mockDocumentRequests[index]; }
  return null;
}
export const createMockClientUploadedDocument = (doc: any) => { mockClientUploadedDocuments.unshift(doc); return doc; }

export let mockNegotiationChatHistory = [
  {
    id: "neg-chat-1",
    caseId: "case-1",
    firmId: "firm-1",
    sender: "ai",
    content: "Welcome to your AI Negotiation Assistant. I have indexed this case's medical chronology, objective MRI findings, $31,400 economic specials, and Travelers' algorithmic discount patterns.\n\nHow would you like to proceed with Round 3 strategy? You can ask me to calculate bracket midpoints, draft a formal counter-demand letter, or craft a targeted legal rebuttal.",
    createdAt: new Date("2026-08-18T16:15:00Z"),
  }
];

export const getMockNegotiationChat = (firmId: string, caseId: string) =>
  mockNegotiationChatHistory.filter((c: any) => c.firmId === firmId && c.caseId === caseId);

export const createMockNegotiationChatMessage = (msg: any) => {
  mockNegotiationChatHistory.push(msg);
  return msg;
};

