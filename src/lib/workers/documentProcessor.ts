import crypto from 'crypto';
import { mockDocuments, updateMockDocument, getMockCaseById, updateMockCase, createMockNotification, getMockUsers } from '@/lib/mock-data';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function processDocumentInBackground(documentId: string) {
  console.log(`Starting mock background processing for document: ${documentId}`);

  try {
    const document = mockDocuments.find(d => d.id === documentId);
    if (!document) {
      throw new Error(`Document ${documentId} not found.`);
    }

    const currentCase = getMockCaseById(document.caseId);
    if (!currentCase) {
      throw new Error(`Case ${document.caseId} not found.`);
    }

    console.log(`Mock: Extracting text from s3://${document.s3Key}`);
    updateMockCase(currentCase.id, { scanProgress: 10, scanStage: "TEXT_EXTRACTION", updatedAt: new Date() });
    await sleep(2000); // Simulate network delay

    console.log("Mock: Chunking raw text for Vector Embeddings...");
    updateMockCase(currentCase.id, { scanProgress: 45, scanStage: "VECTOR_EMBEDDING", updatedAt: new Date() });
    await sleep(2000);

    console.log("Mock: Generating embeddings using Bedrock Titan...");
    updateMockCase(currentCase.id, { scanProgress: 80, scanStage: "AI_ANALYSIS", updatedAt: new Date() });
    await sleep(2000);

    console.log("Mock: Generating Narrative Summary, Timeline, and Insights using Claude...");
    
    // Fake summary
    updateMockDocument(documentId, {
      summary: "---\nPATIENT OVERVIEW\n[Mock Patient details]\n\n---\nMECHANISM OF INJURY\n[Mock Injury details]\n\n---\nTREATMENT HISTORY\n[Mock Treatment details]\n\n---\nCURRENT STATUS\n[Mock Current status]\n\n---\nFUNCTIONAL LIMITATIONS\n[Mock Limitations]\n\n---\nOUTSTANDING ISSUES\n[Mock Issues]",
      aiAnalysis: {
        flags: [{ title: "Mock Flag", text: "This is a mock flag", pageNumber: "1", confidence: "Medium" }],
        gaps: [{ title: "Mock Gap", text: "This is a mock missing record", pageNumber: "Source page unclear", confidence: "High" }],
        shortSummary: "A concise mock summary of the document."
      },
      status: "READY",
      updatedAt: new Date()
    });

    // Mock timeline events could be pushed to mockTimelineEvents here, but skipped for brevity

    const finalStatus = currentCase.status === 'Closed' ? 'Closed' : 'READY';

    const updatedCase = updateMockCase(currentCase.id, {
      status: finalStatus,
      scanProgress: 100,
      scanStage: "COMPLETED",
      updatedAt: new Date()
    });

    try {
      const userIds = new Set<string>();
      if (updatedCase?.createdByUserId) userIds.add(updatedCase.createdByUserId);
      updatedCase?.assignedUsers?.forEach((u: any) => userIds.add(u.id));

      userIds.forEach(userId => {
        createMockNotification({
          id: `notif-${Date.now()}-${userId}`,
          message: `Case Update: New document processed for "${updatedCase?.title}"`,
          type: 'INFO',
          userId: userId,
          firmId: document.firmId,
          caseId: document.caseId,
          isRead: false,
          createdAt: new Date()
        });
      });
    } catch (e) {
      console.error('Failed to create team notifications for scan completion:', e);
    }

    console.log(`Document ${documentId} processing complete! (Mock)`);

  } catch (error) {
    console.error(`Error processing document ${documentId}:`, error);
    try {
      updateMockDocument(documentId, { status: "FAILED", updatedAt: new Date() });
      const document = mockDocuments.find(d => d.id === documentId);
      if (document && document.caseId) {
        const readyDocsCount = mockDocuments.filter(d => d.caseId === document.caseId && d.status === "READY").length;

        if (readyDocsCount > 0) {
          updateMockCase(document.caseId, { status: "READY", scanStage: "COMPLETED", scanProgress: 100, updatedAt: new Date() });
        } else {
          updateMockCase(document.caseId, { status: "FAILED", scanStage: "FAILED", updatedAt: new Date() });
        }

        const docCase = getMockCaseById(document.caseId);
        if (docCase && docCase.createdByUserId) {
          createMockNotification({
            id: `notif-${Date.now()}-error`,
            message: `AI Scan failed for document "${document.fileName}". Please try again or contact support.`,
            type: 'ERROR',
            userId: docCase.createdByUserId,
            firmId: document.firmId,
            caseId: document.caseId,
            isRead: false,
            createdAt: new Date()
          });
        }
      }
    } catch (e) {
      console.error("Failed to update status after failure:", e);
    }
  }
}
