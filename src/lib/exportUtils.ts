import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Scrub invalid XML control characters that corrupt Word documents
function scrub(text: string) {
  if (!text) return " ";
  return String(text).replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '').trim() || " ";
}

function safeParagraph(text: string, heading?: any) {
  return new Paragraph({ text: scrub(text), heading });
}

// Helper to extract aggregated data from caseData
function extractAggregatedData(caseData: any) {
  let allTimeline: any[] = caseData?.timelineEvents ? [...caseData.timelineEvents] : [];
  const allFlags: any[] = [];
  const allGaps: any[] = [];
  let combinedSummary = "";

  if (caseData?.documents) {
    caseData.documents.forEach((doc: any) => {
      // Keep fallback just in case some old data has it here
      if (!caseData?.timelineEvents && doc.aiAnalysis?.timeline) allTimeline.push(...doc.aiAnalysis.timeline);

      if (doc.aiAnalysis?.flags) allFlags.push(...doc.aiAnalysis.flags);
      if (doc.aiAnalysis?.gaps) allGaps.push(...doc.aiAnalysis.gaps);

      if (doc.aiAnalysis?.shortSummary || doc.summary) {
        combinedSummary += (doc.aiAnalysis?.shortSummary || doc.summary) + "\n\n";
      }
    });
  }

  // No static injection - dynamic data only

  // Sort timeline chronologically
  allTimeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Clean up description if it's stored as JSON string in DB
  allTimeline = allTimeline.map(event => {
    let cleanDesc = event.description;
    let rawDate = undefined;
    let pageNumber = "Source page unclear";
    let confidence = "Medium";
    try {
      const parsed = JSON.parse(event.description);
      if (parsed && typeof parsed === 'object') {
        cleanDesc = parsed.text || event.description;
        rawDate = parsed.rawDate;
        pageNumber = parsed.pageNumber || "Source page unclear";
        confidence = parsed.confidence || "Medium";
      }
    } catch (_) {
      // Not JSON, keep as is
    }
    
    // Determine the display date
    let displayDate = "";
    if (rawDate && !rawDate.toLowerCase().includes("not specified")) {
      displayDate = rawDate;
    } else if (!rawDate || rawDate.toLowerCase().includes("not specified")) {
      const d = new Date(event.date);
      // If it's epoch (1970) or invalid, keep it blank in export. Enforce UTC to prevent timezone shifts.
      displayDate = isNaN(d.getTime()) || d.getUTCFullYear() <= 1970 ? "" : d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: '2-digit', year: 'numeric' });
    }

    return { ...event, description: cleanDesc, displayDate, pageNumber, confidence };
  });

  const normalizedFlags = allFlags.map(flag => {
    if (typeof flag === 'string') return { title: flag, severity: 'High', confidence: 'Medium', pageNumber: 'Source page unclear' };
    return { 
      title: flag.title || flag.text || 'Flag', 
      severity: flag.severity || 'High',
      confidence: flag.confidence || 'Medium',
      pageNumber: flag.pageNumber || 'Source page unclear',
      text: flag.text || ''
    };
  });

  const normalizedGaps = allGaps.map(gap => {
    if (typeof gap === 'string') return { title: gap, confidence: 'Medium', pageNumber: 'Source page unclear' };
    return { 
      title: gap.title || gap.text || gap.description || 'Missing Record',
      confidence: gap.confidence || 'Medium',
      pageNumber: gap.pageNumber || 'Source page unclear',
      text: gap.text || ''
    };
  });

  return { allTimeline, normalizedFlags, normalizedGaps, combinedSummary: combinedSummary.trim() };
}

// -------------------------------------------------------------
// EXCEL EXPORT
// -------------------------------------------------------------
export async function exportToExcel(caseData: any) {
  const { allTimeline, normalizedFlags, normalizedGaps, combinedSummary } = extractAggregatedData(caseData);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'LexValue AI';

  // 1. Summary Sheet
  const summarySheet = workbook.addWorksheet('Summary');
  summarySheet.columns = [{ header: 'Narrative Summary', key: 'text', width: 100 }];
  summarySheet.getRow(1).font = { bold: true };
  combinedSummary.split('\n').forEach(line => {
    if (line.trim()) summarySheet.addRow({ text: line });
  });

  // 2. Timeline Sheet
  const timelineSheet = workbook.addWorksheet('Chronology');
  timelineSheet.columns = [
    { header: 'Date', key: 'displayDate', width: 15 },
    { header: 'Title', key: 'title', width: 25 },
    { header: 'Provider', key: 'provider', width: 20 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Page', key: 'pageNumber', width: 10 },
    { header: 'Confidence', key: 'confidence', width: 15 },
  ];
  timelineSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } };
  timelineSheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };
  allTimeline.forEach(event => timelineSheet.addRow(event));

  // 3. Flags Sheet
  const flagsSheet = workbook.addWorksheet('Case Flags');
  flagsSheet.columns = [
    { header: 'Severity', key: 'severity', width: 15 },
    { header: 'Confidence', key: 'confidence', width: 15 },
    { header: 'Page', key: 'pageNumber', width: 10 },
    { header: 'Flag Description', key: 'title', width: 60 },
  ];
  flagsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE11D48' } };
  flagsSheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };
  normalizedFlags.forEach(flag => flagsSheet.addRow(flag));

  // 4. Gaps Sheet
  const gapsSheet = workbook.addWorksheet('Missing Records');
  gapsSheet.columns = [
    { header: 'Confidence', key: 'confidence', width: 15 },
    { header: 'Page', key: 'pageNumber', width: 10 },
    { header: 'Missing Record Description', key: 'title', width: 80 },
  ];
  gapsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD97706' } };
  gapsSheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };
  normalizedGaps.forEach(gap => gapsSheet.addRow(gap));

  // Generate and save
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${caseData.title || 'Case'}_Export.xlsx`);
}

// -------------------------------------------------------------
// WORD EXPORT
// -------------------------------------------------------------
export async function exportToWord(caseData: any) {
  const { allTimeline, combinedSummary, normalizedFlags, normalizedGaps } = extractAggregatedData(caseData);

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        safeParagraph(`Case Report: ${caseData.title || 'Untitled Case'}`, HeadingLevel.HEADING_1),

        safeParagraph("Narrative Summary", HeadingLevel.HEADING_2),
        ...(combinedSummary || "No summary available.").split('\n').filter(l => l.trim()).map(line => safeParagraph(line)),

        safeParagraph("Case Flags (Risks)", HeadingLevel.HEADING_2),
        ...normalizedFlags.map(f => safeParagraph(`• [${f.severity.toUpperCase()}] [${f.confidence} Confidence] [Page: ${f.pageNumber}] ${f.title}`)),

        safeParagraph("Missing Records", HeadingLevel.HEADING_2),
        ...normalizedGaps.map(g => safeParagraph(`• [${g.confidence} Confidence] [Page: ${g.pageNumber}] ${g.title}`)),

        safeParagraph("Chronology of Events", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 100, type: WidthType.AUTO },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "cccccc" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "eeeeee" },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "eeeeee" },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [safeParagraph("Date")] }),
                new TableCell({ children: [safeParagraph("Event")] }),
                new TableCell({ children: [safeParagraph("Description")] }),
                new TableCell({ children: [safeParagraph("Page")] }),
                new TableCell({ children: [safeParagraph("Conf.")] }),
              ],
            }),
            ...allTimeline.map(event => new TableRow({
              children: [
                new TableCell({ children: [safeParagraph(event.displayDate)] }),
                new TableCell({ children: String(event.title || '').split('\n').map(line => safeParagraph(line)) }),
                new TableCell({ children: String(event.description || '').split('\n').map(line => safeParagraph(line)) }),
                new TableCell({ children: [safeParagraph(String(event.pageNumber))] }),
                new TableCell({ children: [safeParagraph(String(event.confidence))] }),
              ],
            }))
          ]
        })
      ],
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${caseData.title || 'Case'}_Export.docx`);
}

// -------------------------------------------------------------
// PDF EXPORT
// -------------------------------------------------------------
export async function exportToPDF(caseData: any) {
  const { allTimeline, combinedSummary, normalizedFlags, normalizedGaps } = extractAggregatedData(caseData);
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900 (dark black)
  doc.text(`Case Report: ${caseData.title || 'Untitled Case'}`, 14, 22);

  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text("Narrative Summary", 14, 35);

  autoTable(doc, {
    startY: 38,
    body: [[combinedSummary || "No summary available."]],
    theme: 'plain',
    styles: { fontSize: 10.5, cellPadding: 1, textColor: [15, 23, 42] }, // sharp dark text
    columnStyles: { 0: { cellWidth: 180 } }
  });

  let finalY = (doc as any).lastAutoTable.finalY + 12;

  if (normalizedFlags.length > 0) {
    if (finalY > 250) { doc.addPage(); finalY = 20; }
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text("Case Flags (Risks)", 14, finalY + 5);
    autoTable(doc, {
      startY: finalY + 10,
      head: [['Severity', 'Confidence', 'Page', 'Flag Description']],
      body: normalizedFlags.map(f => [f.severity, f.confidence, f.pageNumber, f.title]),
      theme: 'grid',
      headStyles: { fillColor: [225, 29, 72], textColor: [255, 255, 255], fontStyle: 'bold' }, // rose-600
      styles: { fontSize: 9.5, textColor: [15, 23, 42], lineColor: [203, 213, 225] },
    });
    finalY = (doc as any).lastAutoTable.finalY + 12;
  }

  if (normalizedGaps.length > 0) {
    if (finalY > 250) { doc.addPage(); finalY = 20; }
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text("Missing Records", 14, finalY + 5);
    autoTable(doc, {
      startY: finalY + 10,
      head: [['Confidence', 'Page', 'Missing Record Description']],
      body: normalizedGaps.map(g => [g.confidence, g.pageNumber, g.title]),
      theme: 'grid',
      headStyles: { fillColor: [217, 119, 6], textColor: [255, 255, 255], fontStyle: 'bold' }, // amber-600
      styles: { fontSize: 9.5, textColor: [15, 23, 42], lineColor: [203, 213, 225] },
    });
    finalY = (doc as any).lastAutoTable.finalY + 12;
  }

  if (finalY > 250) { doc.addPage(); finalY = 20; }
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text("Chronology of Events", 14, finalY + 5);

  const tableData = allTimeline.map(event => [
    event.displayDate || '',
    event.title || '',
    event.description || '',
    event.pageNumber || '',
    event.confidence || ''
  ]);

  autoTable(doc, {
    startY: finalY + 10,
    head: [['Date', 'Event', 'Description', 'Page', 'Conf.']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [15, 118, 110], textColor: [255, 255, 255], fontStyle: 'bold' }, // teal-900
    styles: { fontSize: 9, textColor: [15, 23, 42], lineColor: [203, 213, 225] },
  });

  doc.save(`${caseData.title || 'Case'}_Export.pdf`);
}
