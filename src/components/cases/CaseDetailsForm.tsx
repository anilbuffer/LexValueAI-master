import React from 'react'
import { CustomDatePicker } from '@/components/ui/CustomDatePicker'

interface CaseDetailsFormProps {
  formData: any
  setFormData: (data: any) => void
  formErrors: any
  setFormErrors: (errors: any) => void
  existingCases?: any[]
}

export function CaseDetailsForm({ formData, setFormData, formErrors, setFormErrors, existingCases = [] }: CaseDetailsFormProps) {
  const formatPhoneInput = (value: string) => {
    let cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('1')) {
      cleaned = cleaned.substring(1, 11);
    } else {
      cleaned = cleaned.substring(0, 10);
    }
    if (cleaned.length === 0) return '';
    let formatted = '+1';
    if (cleaned.length > 0) formatted += ' (' + cleaned.substring(0, 3);
    if (cleaned.length >= 4) formatted += ') ' + cleaned.substring(3, 6);
    if (cleaned.length >= 7) formatted += '-' + cleaned.substring(6, 10);
    return formatted;
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Case Details</h2>
        <p className="text-sm text-slate-500 mt-1">Provide the fundamental information for this case.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5 md:col-span-1">
          <div className="flex items-center justify-between">
            <label htmlFor="referenceId" className="text-sm font-semibold text-slate-900 block">Case ID <span className="text-rose-500">*</span></label>
            <button
              type="button"
              onClick={() => {
                let randomId = '';
                let isUnique = false;
                while (!isUnique) {
                  randomId = `Case-${Math.floor(100 + Math.random() * 900)}`;
                  if (!existingCases.some(c => c.referenceId === randomId)) {
                    isUnique = true;
                  }
                }
                setFormData({ ...formData, referenceId: randomId });
                if (formErrors.referenceId) setFormErrors({ ...formErrors, referenceId: null });
              }}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
            >
              Generate ID
            </button>
          </div>
          <input
            id="referenceId"
            type="text"
            placeholder="e.g. case-505"
            value={formData.referenceId || ''}
            onChange={(e) => {
              const val = e.target.value;
              setFormData({ ...formData, referenceId: val });

              if (val.trim() && existingCases.some(c => c.referenceId === val.trim())) {
                setFormErrors({ ...formErrors, referenceId: "This Case ID already exists" });
              } else {
                if (formErrors.referenceId) setFormErrors({ ...formErrors, referenceId: null });
              }
            }}
            className={`block w-full h-12 px-4 border ${formErrors.referenceId ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
          />
          {formErrors.referenceId && <span className="text-xs text-rose-500 font-semibold">{formErrors.referenceId}</span>}
        </div>

        <div className="space-y-1.5 md:col-span-1">
          <label htmlFor="title" className="text-sm font-semibold text-slate-900 block">Case Title <span className="text-rose-500">*</span></label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Ramirez v. Delta Freight"
            value={formData.title}
            onChange={(e) => { setFormData({ ...formData, title: e.target.value }); if (formErrors.title) setFormErrors({ ...formErrors, title: null }) }}
            className={`block w-full h-12 px-4 border ${formErrors.title ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
          />
          {formErrors.title && <span className="text-xs text-rose-500 font-semibold">{formErrors.title}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="type" className="text-sm font-semibold text-slate-900 block">Case Category <span className="text-rose-500">*</span></label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => { setFormData({ ...formData, type: e.target.value }); if (formErrors.type) setFormErrors({ ...formErrors, type: null }) }}
            className={`block w-full h-12 px-4 border ${formErrors.type ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg ${formData.type ? 'text-slate-900' : 'text-slate-400'} focus:outline-none focus:ring-2 transition-all cursor-pointer`}
          >
            <option value="" disabled hidden>Select Category...</option>
            <option value="Personal Injury" className="text-slate-900">Personal Injury</option>
            <option value="Medical Malpractice" className="text-slate-900">Medical Malpractice</option>
            <option value="Criminal" className="text-slate-900">Criminal</option>
            <option value="Medical Records" className="text-slate-900">Medical Records</option>
            <option value="Accident / Police Report" className="text-slate-900">Accident / Police Report</option>
            <option value="Insurance Documents" className="text-slate-900">Insurance Documents</option>
            <option value="Property Damage Photos" className="text-slate-900">Property Damage</option>
            <option value="Other" className="text-slate-900">Other</option>
          </select>
          {formErrors.type && <span className="text-xs text-rose-500 font-semibold">{formErrors.type}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="dateOfInjury" className="text-sm font-semibold text-slate-900 block">Date of Injury / Incident <span className="text-rose-500">*</span></label>
          <CustomDatePicker
            id="dateOfInjury"
            type="datetime-local"
            value={formData.dateOfInjury}
            onChange={(e: any) => { setFormData({ ...formData, dateOfInjury: e.target.value }); if (formErrors.dateOfInjury) setFormErrors({ ...formErrors, dateOfInjury: null }) }}
            className={`block w-full h-12 px-4 border ${formErrors.dateOfInjury ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all cursor-pointer`}
          />
          {formErrors.dateOfInjury && <span className="text-xs text-rose-500 font-semibold">{formErrors.dateOfInjury}</span>}
        </div>

        <div className="md:col-span-2 pt-8 border-t border-slate-100">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Client Information</h2>
            <p className="text-sm text-slate-500 mt-1">Provide the required details about the client.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="client" className="text-sm font-semibold text-slate-900 block">Client Name <span className="text-rose-500">*</span></label>
              <input
                id="client"
                type="text"
                placeholder="e.g. Elena Ramirez"
                value={formData.client}
                onChange={(e) => { setFormData({ ...formData, client: e.target.value }); if (formErrors.client) setFormErrors({ ...formErrors, client: null }) }}
                className={`block w-full h-12 px-4 border ${formErrors.client ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
              />
              {formErrors.client && <span className="text-xs text-rose-500 font-semibold">{formErrors.client}</span>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="clientEmail" className="text-sm font-semibold text-slate-900 block">Client Email <span className="text-rose-500">*</span></label>
              <input
                id="clientEmail"
                type="email"
                placeholder="e.g. elena@example.com"
                value={formData.clientEmail}
                onChange={(e) => { setFormData({ ...formData, clientEmail: e.target.value }); if (formErrors.clientEmail) setFormErrors({ ...formErrors, clientEmail: null }) }}
                className={`block w-full h-12 px-4 border ${formErrors.clientEmail ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
              />
              {formErrors.clientEmail && <span className="text-xs text-rose-500 font-semibold">{formErrors.clientEmail}</span>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="clientPhone" className="text-sm font-semibold text-slate-900 block">Client Phone <span className="text-rose-500">*</span></label>
              <input
                id="clientPhone"
                type="tel"
                placeholder="e.g. +1 234 567 8900"
                value={formData.clientPhone}
                onChange={(e) => { setFormData({ ...formData, clientPhone: formatPhoneInput(e.target.value) }); if (formErrors.clientPhone) setFormErrors({ ...formErrors, clientPhone: null }) }}
                className={`block w-full h-12 px-4 border ${formErrors.clientPhone ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
              />
              {formErrors.clientPhone && <span className="text-xs text-rose-500 font-semibold">{formErrors.clientPhone}</span>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="clientAge" className="text-sm font-semibold text-slate-900 block">Client Age <span className="text-rose-500">*</span></label>
              <input
                id="clientAge"
                type="number"
                min="0"
                placeholder="e.g. 35"
                value={formData.clientAge}
                onChange={(e) => { setFormData({ ...formData, clientAge: e.target.value }); if (formErrors.clientAge) setFormErrors({ ...formErrors, clientAge: null }) }}
                className={`block w-full h-12 px-4 border ${formErrors.clientAge ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
              />
              {formErrors.clientAge && <span className="text-xs text-rose-500 font-semibold">{formErrors.clientAge}</span>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="clientGender" className="text-sm font-semibold text-slate-900 block">Client Gender <span className="text-rose-500">*</span></label>
              <select
                id="clientGender"
                value={formData.clientGender}
                onChange={(e) => { setFormData({ ...formData, clientGender: e.target.value }); if (formErrors.clientGender) setFormErrors({ ...formErrors, clientGender: null }) }}
                className={`block w-full h-12 px-4 border ${formErrors.clientGender ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg ${formData.clientGender ? 'text-slate-900' : 'text-slate-400'} focus:outline-none focus:ring-2 transition-all cursor-pointer`}
              >
                <option value="" disabled hidden>Select Gender...</option>
                <option value="Male" className="text-slate-900">Male</option>
                <option value="Female" className="text-slate-900">Female</option>
                <option value="Other" className="text-slate-900">Other</option>
              </select>
              {formErrors.clientGender && <span className="text-xs text-rose-500 font-semibold">{formErrors.clientGender}</span>}
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="clientAddress" className="text-sm font-semibold text-slate-900 block">Client Address <span className="text-rose-500">*</span></label>
              <input
                id="clientAddress"
                type="text"
                placeholder="e.g. 123 Main St, New York, NY 10001"
                value={formData.clientAddress}
                onChange={(e) => { setFormData({ ...formData, clientAddress: e.target.value }); if (formErrors.clientAddress) setFormErrors({ ...formErrors, clientAddress: null }) }}
                className={`block w-full h-12 px-4 border ${formErrors.clientAddress ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
              />
              {formErrors.clientAddress && <span className="text-xs text-rose-500 font-semibold">{formErrors.clientAddress}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
