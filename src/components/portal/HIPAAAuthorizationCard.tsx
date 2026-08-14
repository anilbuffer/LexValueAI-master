"use client"

import { useState } from "react"
import { ShieldAlert, CheckCircle2 } from "lucide-react"

export function HIPAAAuthorizationCard({ caseId }: { caseId: string }) {
  const [isSigned, setIsSigned] = useState(false);
  const [signature, setSignature] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (signature.trim() && acceptedTerms) {
      // Simulate API call to save signature
      setTimeout(() => {
        setIsSigned(true);
      }, 500);
    }
  };

  if (isSigned) {
    return (
      <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-emerald-900">HIPAA Authorization Signed</h3>
          <p className="text-sm text-emerald-700 mt-1">Thank you. Your legal team now has the authorization to request your medical records.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-teal-600" />
          HIPAA Release Authorization
        </h2>
        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider rounded border border-amber-200">
          Action Required
        </span>
      </div>
      
      <div className="p-6">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 h-48 overflow-y-auto text-sm text-slate-600 mb-6 font-mono leading-relaxed">
          <p className="font-bold mb-2">AUTHORIZATION FOR RELEASE OF HEALTH INFORMATION PURSUANT TO HIPAA</p>
          <p className="mb-2">I authorize the use or disclosure of my health information as described below.</p>
          <p className="mb-2">1. Person(s) or class of persons authorized to receive the information: My designated legal counsel and their authorized representatives.</p>
          <p className="mb-2">2. Description of information to be released: Entire medical record, including patient histories, office notes (except psychotherapy notes), test results, radiology studies, films, referrals, consults, billing records, insurance records, and records sent to you by other health care providers.</p>
          <p className="mb-2">3. Purpose of requested use or disclosure: Legal representation and case evaluation.</p>
          <p className="mb-2">4. I understand that I have the right to revoke this authorization at any time by notifying my legal counsel in writing. I understand that the revocation is only effective after it is received and logged.</p>
          <p>5. I understand that any disclosure of information carries with it the potential for an unauthorized redisclosure and the information may not be protected by federal confidentiality rules.</p>
        </div>

        <form onSubmit={handleSign} className="space-y-4">
          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              id="accept-terms" 
              className="mt-1 w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-600 cursor-pointer"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <label htmlFor="accept-terms" className="text-sm text-slate-700 cursor-pointer select-none">
              I have read and understand the terms of this HIPAA authorization and agree to sign electronically.
            </label>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label htmlFor="signature" className="block text-sm font-medium text-slate-700 mb-1">
                Type your full legal name to sign
              </label>
              <input
                type="text"
                id="signature"
                className="block w-full h-11 px-4 border border-slate-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm font-handwriting text-lg"
                placeholder="John Doe"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={!acceptedTerms || signature.trim().length < 3}
              className="h-11 px-6 bg-teal-600 text-white font-medium rounded-lg shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full md:w-auto shrink-0"
            >
              Sign Authorization
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
