import { TextractClient, StartDocumentTextDetectionCommand, GetDocumentTextDetectionCommand } from "@aws-sdk/client-textract";

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

const textractClient = new TextractClient({ region: process.env.AWS_REGION || "us-east-1" });
const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simple chunking function (splits by roughly 1000 chars, preferring sentence boundaries)
function chunkText(text: string, maxChunkSize = 1000): string[] {
  const chunks: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let currentChunk = "";
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}

async function processInBatches<T, R>(items: T[], batchSize: number, processor: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);

    // Add a 1.5-second delay between batches to respect AWS API rate limits (avoid TooManyRequestsException)
    if (i + batchSize < items.length) {
      await sleep(1500);
    }
  }
  return results;
}


export async function processDocumentInBackground(documentId: string) {
  console.log(`Starting background processing for document: ${documentId}`);

  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { case: true }
    });

    if (!document || !document.s3Key) {
      throw new Error(`Document ${documentId} not found or missing S3 Key.`);
    }

    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      throw new Error("AWS_S3_BUCKET_NAME is not configured.");
    }

    // --- 1. AWS Textract (Extract Text) ---
    console.log(`Starting Textract for s3://${bucketName}/${document.s3Key}`);
    await prisma.case.update({ where: { id: document.caseId }, data: { scanProgress: 10, scanStage: "TEXT_EXTRACTION" } });
    const startResponse = await textractClient.send(new StartDocumentTextDetectionCommand({
      DocumentLocation: { S3Object: { Bucket: bucketName, Name: document.s3Key } },
    }));
    const jobId = startResponse.JobId;
    if (!jobId) throw new Error("Failed to get JobId from Textract");

    let status = "IN_PROGRESS";
    const textractResults: any[] = [];
    console.log(`Polling Textract Job: ${jobId}`);
    let attempts = 0;
    while (status === "IN_PROGRESS") {
      attempts++;
      // Poll every 3 seconds for the first 10 attempts, then every 10 seconds
      await sleep(attempts <= 10 ? 3000 : 10000); 
      const getResponse = await textractClient.send(new GetDocumentTextDetectionCommand({ JobId: jobId }));
      status = getResponse.JobStatus || "FAILED";
      if (status === "SUCCEEDED") {
        textractResults.push(getResponse);
        let nextToken = getResponse.NextToken;
        while (nextToken) {
          const nextResponse = await textractClient.send(new GetDocumentTextDetectionCommand({ JobId: jobId, NextToken: nextToken }));
          textractResults.push(nextResponse);
          nextToken = nextResponse.NextToken;
        }
      } else if (status === "FAILED" || status === "PARTIAL_SUCCESS") {
        throw new Error(`Textract job failed with status: ${status}`);
      }
    }

    const rawTextParts = [];
    let currentPage = -1;
    for (const res of textractResults) {
      for (const block of res.Blocks || []) {
        if (block.BlockType === "LINE") {
          const page = block.Page || 1;
          if (page !== currentPage) {
            rawTextParts.push(`\n--- PAGE ${page} ---\n`);
            currentPage = page;
          }
          rawTextParts.push(block.Text);
        }
      }
    }
    const rawText = rawTextParts.join("\n");
    console.log(`Successfully extracted ${rawText.length} characters.`);

    // --- 2. Chunking for Embeddings ---
    console.log("Chunking raw text for Vector Embeddings...");
    await prisma.case.update({ where: { id: document.caseId }, data: { scanProgress: 45, scanStage: "VECTOR_EMBEDDING" } });
    const chunks = chunkText(rawText, 1000);

    // --- 3. Embeddings (AWS Bedrock) & Storage (pgvector) ---
    console.log(`Generating embeddings for ${chunks.length} chunks using Bedrock Titan...`);

    // Process Embeddings in batches of 5 to speed up execution
    await processInBatches(chunks, 5, async (chunk) => {
      // Invoke Amazon Titan Text V2
      const body = JSON.stringify({ inputText: chunk, dimensions: 1024, normalize: true });
      const embedResponse = await bedrockClient.send(new InvokeModelCommand({
        modelId: "amazon.titan-embed-text-v2:0",
        contentType: "application/json",
        accept: "application/json",
        body: body
      }));

      const responseBody = JSON.parse(new TextDecoder().decode(embedResponse.body));
      const embedding = responseBody.embedding; // Array of 1024 floats

      const embeddingString = `[${embedding.join(',')}]`;

      // Insert into pgvector
      const chunkId = crypto.randomUUID();
      await prisma.$executeRaw`
        INSERT INTO "document_chunks" (id, text, embedding, document_id, firm_id, created_at)
        VALUES (${chunkId}, ${chunk}, ${embeddingString}::vector, ${documentId}, ${document.firmId}, NOW())
      `;
    });

    // --- 4. AI Summarization & Timeline (Claude 4.5 Haiku) ---
    console.log("Generating Narrative Summary, Timeline, and Insights using Claude 4.5 Haiku...");
    await prisma.case.update({ where: { id: document.caseId }, data: { scanProgress: 80, scanStage: "AI_ANALYSIS" } });
    const prompt = `You are a highly precise legal/medical AI assistant. Analyze the following document text and provide a JSON response containing:

1. "summary": A structured medical summary of the document.
You MUST provide a detailed breakdown using EXACTLY the following 6 sections. Before every section title, you MUST output three dashes (---) on a new line to act as a separator. If there is no explicit data for a specific section, you MUST strictly write "No data found". Do not use any other titles.
Format exactly like this:

---
PATIENT OVERVIEW
[content or "No data found"]

---
MECHANISM OF INJURY
[content or "No data found"]

---
TREATMENT HISTORY
[content or "No data found"]

---
CURRENT STATUS
[content or "No data found"]

---
FUNCTIONAL LIMITATIONS
[content or "No data found"]

---
OUTSTANDING ISSUES
[content or "No data found"]

AGE CALCULATION RULE: This rule applies ONLY when stating the patient's CURRENT age (e.g., in the PATIENT OVERVIEW or shortSummary). Today's date is ${new Date().toISOString().split('T')[0]}. If a Date of Birth (DOB) is present, mathematically calculate the patient's exact current age in years as of TODAY'S date (accounting for month/day). DO NOT apply this calculation to historical events (e.g., age at the time of the accident or past surgeries) - for historical events, extract the age exactly as written in the text. FORMAT ALL DATES strictly as 'MMM DD, YYYY'.
2. "timeline": An array of important chronological medical/legal events. Extract EVERY medical event, prior surgery, and clinical interaction found in the text. Each event must have: "date", "time" (string or null), "title", "description", "provider", "complaints", "diagnosis", "treatment", "pageNumber" (string), and "confidence" (string). 
   DATE & TIME ACCURACY:
   - Only output a specific date (YYYY-MM-DD) if it is explicitly and clearly stated in the source document.
   - If a specific exact time is mentioned (e.g. "14:30", "02:00 PM"), extract it exactly into the "time" field. If no time is mentioned, output null for "time".
   - Never default to "Jan 01" or any placeholder date when the exact date is unclear or missing.
   - If only the year is known, output exactly 'Year only: [YYYY]' instead of a full fabricated date.
   - If no date is known, output exactly 'Date not specified'.
   - Do not guess or infer a date or time based on nearby entries.

   EVENT QUALITY RULE:
   - DO NOT create a timeline event for an isolated date (like a "Date of injury" field in a document header) unless there is a specific, documented clinical interaction or medical event tied to it.
   - NEVER use the patient's Date of Birth (DOB) as a timeline event. DO NOT ignore past medical history or prior surgeries; you MUST extract and include ALL historical medical events and prior surgeries regardless of how many decades ago they occurred. Nothing from the document should be skipped.
   - Every timeline event MUST contain meaningful clinical details. If a field like 'provider', 'complaints', 'diagnosis', or 'treatment' is not mentioned, output null. DO NOT output "Not specified", "N/A", or "None".

   CITATION PRECISION:
   - For every claim, flag, or chronology entry, cite the exact page number(s) (e.g., '14', '18-21', or '14, 25') where that specific fact appears in the source (derived from --- PAGE X ---).
   - If an event is documented across multiple pages, output all relevant pages.
   - Do not reuse the same page number(s) across multiple unrelated claims unless each claim is independently verified.
   - If you cannot confidently identify the exact source page(s), output exactly 'Source page unclear' instead of guessing.

   CONFIDENCE LABELING:
   - For every generated flag, chronology entry, and missing record item, include a confidence label: High, Medium, or Low.
   - "High" = information is explicitly and unambiguously stated in the source.
   - "Medium" = information is reasonably inferred but not explicitly stated.
   - "Low" = information is uncertain, ambiguous, or based on incomplete data.

   STRICT ANTI-HALLUCINATION RULE (APPLIES TO SUMMARY, TIMELINE, FLAGS, AND GAPS):
   - NEVER invent, assume, or hallucinate ANY information. This strict rule applies universally to the narrative summary, medical chronology, case flags, and missing records.
   - If the source text does not explicitly and clearly support a claim, DO NOT write it. It is far better to return an empty array (0 events, 0 flags, 0 gaps) than to guess or hallucinate.
   - Do NOT make assumptions about HOW an accident happened, the cause of injury, or body laterality (e.g., if it says 'left knee', never mention 'right knee').
   - MEDICAL CODES PRECISION: If extracting ICD-10, CPT, or other medical codes, ensure the code exactly matches its description as written in the text. (e.g. Do not mistakenly merge "Osteoarthritis" with the code for "Pain in left knee").
   - TREATMENT COMPLETENESS: In the 'treatment' field, include both the treatments immediately rendered AND any significant medical treatments formally planned, ordered, or discussed during that visit (e.g. "Ordered viscosupplement injections").
   - PROVIDER ACCURACY: Extract the exact name of the physician or medical professional (e.g., "Eric Lescault, DO") if present, rather than just the facility name. Do not misattribute providers.
   - You MUST extract ONLY what is explicitly written in the document text (including medication/contrast names). If details are missing, omit them, output null, or return an empty array [].
   - Stick strictly to the provided text. Do not use outside medical knowledge, external context, or common sense assumptions to fill in blanks.

   FLAG QUALITY RULE:
   - Generate a flag for undeniable clinical contradictions, major treatment gaps, or highly significant clinical/legal red flags (e.g., patient refusing surgery, fragmented care, unexplained delays).
   - DO NOT claim a finding is "unexplained" or "inconsistent" without thoroughly verifying the entire document.
   - DO NOT claim "Inconsistent Age Reporting" unless ages mathematically contradict the Date of Birth or visit dates.
   - Be clinically accurate: If a treatment was ordered/referred but the follow-up is not in the record, add it to "gaps". Do not flag it as "Minimally treated".
   - If a discrepancy only affects one minor event, specify the exact isolated event. Do not generalize it to the entire document.
   - Do not generate sensationalized or false flags, but DO extract legitimate medical/legal concerns that a reviewer would want to know.

   MISSING RECORDS (GAPS) QUALITY RULE:
   - CROSS-REFERENCE BEFORE FLAGGING: If a specific test, MRI, surgery, or prior medical record is mentioned as having occurred (e.g., "Patient had an MRI on Jan 5th"), you MUST search the ENTIRE document to see if that actual report is included later on. 
   - ONLY if that specific report is COMPLETELY ABSENT from the entire document bundle should you flag it as a Missing Record.
   - If you find the report elsewhere in the document, DO NOT flag it as missing.
   - BE STRICT: Do not flag routine prior visits or old irrelevant x-rays as missing unless their absence directly halts or impacts current clinical decision-making.
   - It is FAR better to have an empty gaps array [] than to generate a false missing record.

3. "flags": An array of objects representing Intelligence Flags (e.g. inconsistencies, red flags). Each must have: "title", "text", "pageNumber" (exact page string or 'Source page unclear'), and "confidence" ('High', 'Medium', or 'Low').
4. "gaps": An array of objects representing missing records or gaps. Each must have: "title", "text", "pageNumber" (exact page string or 'Source page unclear'), and "confidence" ('High', 'Medium', or 'Low'). LIMIT EXTRANEOUS GAPS: Only flag CRITICAL, obvious missing medical records that directly affect the evaluation of the current injury (e.g., a missing MRI report explicitly mentioned by a doctor). Do not flag every passing mention of a past doctor or old irrelevant x-rays. Be conservative; fewer, higher-quality gaps are better.
5. "shortSummary": A concise summary (approximately 150-200 words) providing a solid high-level overview.

Document Name: ${document.fileName}
Document Text (with page markers):
${rawText.substring(0, 800000)}
${document.case.customPrompt ? `\nUser Custom Instructions (PAY SPECIAL ATTENTION):\n"${document.case.customPrompt}"\nEnsure your output reflects these specific instructions.` : ''}

Example format:
{
  "summary": "---\nPATIENT OVERVIEW\n[Patient details]\n\n---\nMECHANISM OF INJURY\n[Injury details]\n\n---\nTREATMENT HISTORY\n[Treatment details]\n\n---\nCURRENT STATUS\n[Current status or No data found]\n\n---\nFUNCTIONAL LIMITATIONS\n[Limitations or No data found]\n\n---\nOUTSTANDING ISSUES\n[Issues or No data found]",
  "timeline": [ { 
    "date": "2026-03-14", 
    "time": "02:30 PM",
    "title": "Emergency Room Visit", 
    "description": "Patient admitted for evaluation.",
    "provider": "St. Mary Hospital",
    "complaints": "Severe neck pain",
    "diagnosis": "Acute cervical strain",
    "treatment": "Discharged with collar",
    "pageNumber": "14-16, 22",
    "confidence": "High"
  } ],
  "flags": [ { "title": "Pre-existing neck pain", "text": "Prior neck pain recorded", "pageNumber": "2", "confidence": "Medium" } ],
  "gaps": [ { "title": "Missing physical therapy", "text": "Missing PT records", "pageNumber": "Source page unclear", "confidence": "High" } ],
  "shortSummary": "A concise summary..."
}`;

    try {
      const claudeBody = JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 8192,
        temperature: 0,
        messages: [{ role: "user", content: prompt }]
      });

      const claudeResponse = await bedrockClient.send(new InvokeModelCommand({
        modelId: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: claudeBody
      }));

      const claudeResult = JSON.parse(new TextDecoder().decode(claudeResponse.body));
      const aiText = claudeResult.content[0].text;

      // Attempt to parse JSON (sometimes models wrap in markdown ```json)
      let parsedAi;
      try {
        // Attempt to clean markdown if present
        const cleanJson = aiText.replace(/```json/gi, '').replace(/```/g, '').trim();

        try {
          parsedAi = JSON.parse(cleanJson);
        } catch (_) {
          console.warn("Initial JSON parse failed, attempting recovery...");
          let success = false;

          // Find all positions of '}' and ']'
          const positions = [];
          for (let i = 0; i < cleanJson.length; i++) {
            if (cleanJson[i] === '}' || cleanJson[i] === ']') {
              positions.push(i);
            }
          }

          // Try from the end backwards
          for (let i = positions.length - 1; i >= 0; i--) {
            const pos = positions[i];
            const truncated = cleanJson.substring(0, pos + 1);
            const suffixes = ['', '}', ']}', '] }', '}', ']}'];
            for (const suffix of suffixes) {
              try {
                parsedAi = JSON.parse(truncated + suffix);
                success = true;
                break;
              } catch (_) { }
            }
            if (success) break;
          }

          if (!success) {
            console.warn("Could not parse Claude response as JSON:", aiText);
            parsedAi = null;
          }
        }
      } catch (_) {
        console.warn("Could not parse Claude response as JSON:", aiText);
        parsedAi = null;
      }

      if (parsedAi) {
        // Save Summary and aiAnalysis to Document
        const aiAnalysisPayload = {
          flags: parsedAi.flags || [],
          gaps: parsedAi.gaps || [],
          shortSummary: parsedAi.shortSummary || ""
        };

        await prisma.document.update({
          where: { id: documentId },
          data: {
            summary: parsedAi.summary,
            aiAnalysis: aiAnalysisPayload,
            status: "READY"
          }
        });

        // Save Timeline Events
        if (parsedAi.timeline && Array.isArray(parsedAi.timeline)) {
          const events = parsedAi.timeline.map((event: any) => {
            let parsedDate = new Date(event.date);
            if (isNaN(parsedDate.getTime())) parsedDate = new Date(0); // Fallback to epoch for invalid/unspecified dates

            const detailsObj = {
              text: event.description || "",
              time: event.time || null,
              provider: event.provider || "",
              complaints: event.complaints || "",
              diagnosis: event.diagnosis || "",
              treatment: event.treatment || "",
              pageNumber: event.pageNumber || "Source page unclear",
              confidence: event.confidence || "Medium",
              rawDate: event.date // Save the literal output (e.g. "Date not specified")
            };

            return {
              date: parsedDate,
              title: event.title || "Event",
              description: JSON.stringify(detailsObj),
              documentId: document.id,
              caseId: document.caseId,
              firmId: document.firmId
            };
          });

          if (events.length > 0) {
            await prisma.timelineEvent.createMany({ data: events });
          }
        }
      } else {
        // Fallback if parsing failed
        throw new Error("Failed to parse Claude AI response");
      }
    } catch (aiError) {
      console.error("Claude AI Error:", aiError);
      throw aiError; // Propagate to outer catch
    }

    await prisma.document.update({ where: { id: documentId }, data: { status: "READY" } });

    const currentCase = await prisma.case.findUnique({ where: { id: document.caseId }, select: { status: true } });
    const finalStatus = currentCase?.status === 'Closed' ? 'Closed' : 'READY';

    const updatedCase = await prisma.case.update({
      where: { id: document.caseId },
      data: { status: finalStatus, scanProgress: 100, scanStage: "COMPLETED" },
      include: { createdByUser: true, assignedUsers: true }
    });

    try {
      // Find unique users involved in this case (creator + assigned)
      const userIds = new Set<string>();
      if (updatedCase.createdByUserId) userIds.add(updatedCase.createdByUserId);
      updatedCase.assignedUsers.forEach((u: any) => userIds.add(u.id));

      if (userIds.size > 0) {
        await prisma.notification.createMany({
          data: Array.from(userIds).map((userId: any) => ({
            message: `Case Update: New document processed for "${updatedCase.title}"`,
            type: 'INFO',
            userId: userId,
            firmId: document.firmId,
            caseId: document.caseId
          }))
        });
      }
    } catch (e) {
      console.error('Failed to create team notifications for scan completion:', e);
    }

    console.log(`Document ${documentId} processing complete! Embeddings & AI Summary saved.`);

  } catch (error) {
    console.error(`Error processing document ${documentId}:`, error);
    try {
      await prisma.document.update({ where: { id: documentId }, data: { status: "FAILED" } });
      const doc = await prisma.document.findUnique({ where: { id: documentId }, include: { case: true } });
      if (doc?.case) {
        // Check if there are other successfully processed documents in this case
        const readyDocsCount = await prisma.document.count({
          where: { caseId: doc.caseId, status: "READY" }
        });

        if (readyDocsCount > 0) {
          // If there are other valid documents, revert the case to READY instead of FAILED
          await prisma.case.update({
            where: { id: doc.caseId },
            data: { status: "READY", scanStage: "COMPLETED", scanProgress: 100 }
          });
        } else {
          // If this was the only document and it failed, fail the whole case
          await prisma.case.update({
            where: { id: doc.caseId },
            data: { status: "FAILED", scanStage: "FAILED" }
          });
        }

        if (doc.case.createdByUserId) {
          try {
            await prisma.notification.create({
              data: {
                message: `AI Scan failed for document "${doc.fileName}". Please try again or contact support.`,
                type: 'ERROR',
                userId: doc.case.createdByUserId,
                firmId: doc.firmId,
                caseId: doc.caseId
              }
            });
          } catch (e) {
            console.error('Failed to create failure notification:', e);
          }
        }
      }
    } catch (e) {
      console.error("Failed to update status after failure:", e);
    }
  }
}
