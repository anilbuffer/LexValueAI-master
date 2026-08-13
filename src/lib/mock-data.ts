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

export const mockUsers = [
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
];

export const mockCases = [
  {
    id: "case-1",
    referenceId: "Illo rerum praesenti",
    title: "Illo rerum praesenti",
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
    documents: [],
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

export const mockDocuments = [
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
  }
];

export const mockNotifications = [
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
    message: "AI Scan completed for 'Illo rerum praesenti'.",
    type: "INFO",
    isRead: true,
    userId: mockUser.id,
    firmId: mockFirm.id,
    caseId: "case-1",
    createdAt: new Date("2026-08-10T15:30:00Z"),
  },
];

export const mockTimelineEvents = [
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

export const mockAuditLogs = [
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

export const getMockUser = () => mockUser;
export const getMockCases = () => mockCases;
export const getMockCaseById = (id: string) => mockCases.find(c => c.id === id);
export const getMockDocumentsForCase = (caseId: string) => mockDocuments.filter(d => d.caseId === caseId);
export const getMockTimelineForCase = (caseId: string) => mockTimelineEvents.filter(t => t.caseId === caseId);
export const getMockNotifications = () => mockNotifications;
export const getMockAuditLogs = () => mockAuditLogs;
export const getMockUsers = () => mockUsers;
export const getMockFirm = () => mockFirm;
