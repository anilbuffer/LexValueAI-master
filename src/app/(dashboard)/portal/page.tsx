"use client"

import { FolderOpen, FileText, Activity } from "lucide-react"
import Link from "next/link"

export default function PortalDashboard() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      <div className="bg-gradient-to-r from-teal-900 to-teal-700 rounded-xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to your Portal</h1>
          <p className="text-teal-100 text-lg max-w-2xl">
            Access your case information, upload requested documents, and review important updates.
          </p>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/portal/cases" className="group block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-teal-500 transition-colors">
          <div className="p-6 flex flex-col h-full">
            <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FolderOpen className="w-6 h-6 text-teal-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">My Cases</h2>
            <p className="text-slate-500 text-sm flex-1">
              View the status of your active cases, assigned legal team, and sign required authorizations.
            </p>
          </div>
        </Link>

        <Link href="/portal/documents" className="group block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-teal-500 transition-colors">
          <div className="p-6 flex flex-col h-full">
            <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-teal-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Documents</h2>
            <p className="text-slate-500 text-sm flex-1">
              Securely upload medical records, bills, and photos requested by your attorney.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
