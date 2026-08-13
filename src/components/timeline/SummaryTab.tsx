import React from 'react'

export function SummaryTab({ caseData }: { caseData?: any }) {
  // Extract documents that have a summary
  const documentsWithSummary = caseData?.documents?.filter((doc: any) => doc.summary) || []

  // Combine all summaries into one narrative
  const combinedSummary = documentsWithSummary.map((d: any) => d.summary).join('\n\n')

  // Parse the summary to replace '---' with actual <hr> elements and style titles
  const renderFormattedSummary = (text: string) => {
    let currentHeader = '';
    let hasRenderedContent = false;
    let isFirstTitle = true;

    return text.split('\n').map((line, index) => {
      const trimmed = line.trim();
      const cleanLine = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, ''); // Remove markdown 
      const upperLine = cleanLine.toUpperCase();

      if (trimmed === '---' || trimmed === '***') {
        if (!hasRenderedContent) return null; // Hide the very top separator line
        return <hr key={index} className="my-6 border-slate-200" />
      }
      const isKnownTitle = upperLine.startsWith('PATIENT OVERVIEW') ||
        upperLine.startsWith('MECHANISM OF INJURY') ||
        upperLine.startsWith('TREATMENT HISTORY') ||
        upperLine.startsWith('CURRENT STATUS') ||
        upperLine.startsWith('FUNCTIONAL LIMITATIONS') ||
        upperLine.startsWith('OUTSTANDING ISSUES');

      // Catch any other all-caps titles the AI might generate
      const isDynamicTitle = cleanLine === upperLine && /[A-Z]/.test(cleanLine) && cleanLine.length < 60 && !cleanLine.includes('.');

      if (isKnownTitle || isDynamicTitle) {
        hasRenderedContent = true;
        if (upperLine === currentHeader) {
          return null; // Skip duplicate consecutive header
        }
        currentHeader = upperLine;
        
        const topMarginClass = isFirstTitle ? "mt-0" : "mt-6";
        isFirstTitle = false;

        return <h3 key={index} className={`text-lg font-semibold text-slate-800 ${topMarginClass} mb-2 uppercase`}>{cleanLine}</h3>
      }

      if (!trimmed) return <div key={index} className="h-2"></div>;

      hasRenderedContent = true;
      
      // Render as a bullet list item if it starts with a dash or bullet
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        return (
          <div key={index} className="flex items-start mb-1">
            <span className="text-slate-400 mr-2 mt-0.5">•</span>
            <span>{trimmed.substring(2)}</span>
          </div>
        );
      }

      return <div key={index} className="mb-2">{trimmed}</div>
    });
  }

  // No static injection - UI displays actual dynamic data only
  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-50 p-5 border-b border-slate-200 shrink-0">
        <h2 className="text-2xl font-bold text-slate-800">Narrative Summary</h2>
        <p className="text-sm text-slate-500 mt-1">Comprehensive AI-drafted narrative medical summary.</p>
      </div>
      <div className="p-6 md:p-8 w-full flex-1">
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-[15px] font-normal">
          {renderFormattedSummary(combinedSummary)}
        </div>
      </div>
    </div>
  )
}

