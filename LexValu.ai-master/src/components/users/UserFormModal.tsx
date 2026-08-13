import React, { useState, useEffect } from 'react'
import { X, User, Mail, Phone, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  modalMode: 'add' | 'edit' | 'view'
  isSubmitting: boolean
  newUser: any
  setNewUser: (user: any) => void
  role: string | null
  allUsersList: any[]
  onSubmit: (e: React.FormEvent) => void
}

export function UserFormModal({
  isOpen, onClose, modalMode, isSubmitting, newUser, setNewUser, role, allUsersList, onSubmit
}: UserFormModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<any>({})

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

  useEffect(() => {
    if (isOpen) {
       
      setFormErrors({})
    }
  }, [isOpen])

  const handleValidation = (e: React.FormEvent) => {
    e.preventDefault()
    if (modalMode === 'view') {
      onSubmit(e)
      return
    }

    const errors: any = {}
    if (!newUser.firstName.trim()) errors.firstName = "First Name is required"
    if (!newUser.lastName.trim()) errors.lastName = "Last Name is required"
    if (!newUser.email.trim()) errors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) errors.email = "Invalid email format"
    
    if (!newUser.phone.trim()) errors.phone = "Phone is required"
    else {
      const phoneClean = newUser.phone.replace(/[^\d]/g, '')
      if (phoneClean.length < 7) errors.phone = "Invalid phone number"
    }

    if (modalMode === 'add' && (!newUser.password || newUser.password.length < 6)) {
      errors.password = "Password must be at least 6 characters"
    }

    if (role === 'ADMIN' && (newUser.role === 'ATTORNEY' || newUser.role === 'PARALEGAL')) {
      if (!newUser.managingPartnerId) errors.managingPartnerId = "Managing Partner is required"
    }
    
    if ((role === 'ADMIN' && newUser.role === 'PARALEGAL') || (role === 'MANAGING_PARTNER' && newUser.role === 'PARALEGAL')) {
      if (!newUser.attorneyId) errors.attorneyId = "Attorney is required"
    }

    setFormErrors(errors)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      toast.error("Please fix the validation errors before saving")
      return
    }

    onSubmit(e)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-stretch justify-end" onClick={onClose}>
      <div className="bg-white shadow-2xl border-l border-slate-200 w-full max-w-md overflow-hidden animate-slide-in-right flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">{modalMode === 'add' ? 'Add New User' : modalMode === 'edit' ? 'Edit User' : 'View User Details'}</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleValidation} noValidate className="p-6 space-y-5 overflow-y-auto flex-1 flex flex-col">
          <div className="flex-1 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 block">First Name <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input disabled={modalMode === 'view'} type="text" value={newUser.firstName} onChange={e => { setNewUser({ ...newUser, firstName: e.target.value }); if (formErrors.firstName) setFormErrors({ ...formErrors, firstName: null }) }} className={`block w-full h-12 pl-12 pr-3 border ${formErrors.firstName ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all disabled:bg-slate-50 disabled:text-slate-500`} placeholder="John" />
                </div>
                {formErrors.firstName && <span className="text-xs text-rose-500 font-semibold">{formErrors.firstName}</span>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 block">Last Name <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input disabled={modalMode === 'view'} type="text" value={newUser.lastName} onChange={e => { setNewUser({ ...newUser, lastName: e.target.value }); if (formErrors.lastName) setFormErrors({ ...formErrors, lastName: null }) }} className={`block w-full h-12 pl-12 pr-3 border ${formErrors.lastName ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all disabled:bg-slate-50 disabled:text-slate-500`} placeholder="Doe" />
                </div>
                {formErrors.lastName && <span className="text-xs text-rose-500 font-semibold">{formErrors.lastName}</span>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900 block">Email Address <span className="text-rose-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input disabled={modalMode === 'view' || modalMode === 'edit'} type="email" value={newUser.email} onChange={e => { 
                  const val = e.target.value;
                  setNewUser({ ...newUser, email: val });
                  
                  if (val.trim() && modalMode === 'add' && allUsersList.some(u => u.email.toLowerCase() === val.trim().toLowerCase())) {
                    setFormErrors({ ...formErrors, email: "This email already exists" });
                  } else {
                    if (formErrors.email) setFormErrors({ ...formErrors, email: null });
                  }
                }} className={`block w-full h-12 pl-12 pr-3 border ${formErrors.email ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed`} placeholder="name@lawfirm.com" />
              </div>
              {formErrors.email && <span className="text-xs text-rose-500 font-semibold">{formErrors.email}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-900 block">Phone Number <span className="text-rose-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input disabled={modalMode === 'view'} type="tel" value={newUser.phone} onChange={e => { setNewUser({ ...newUser, phone: formatPhoneInput(e.target.value) }); if (formErrors.phone) setFormErrors({ ...formErrors, phone: null }) }} className={`block w-full h-12 pl-12 pr-3 border ${formErrors.phone ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all disabled:bg-slate-50 disabled:text-slate-500`} placeholder="+1 (555) 000-0000" />
              </div>
              {formErrors.phone && <span className="text-xs text-rose-500 font-semibold">{formErrors.phone}</span>}
            </div>

            {modalMode !== 'view' && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 block">Password {modalMode === 'add' && <span className="text-rose-500">*</span>}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type={showPassword ? "text" : "password"} value={newUser.password} onChange={e => { setNewUser({ ...newUser, password: e.target.value }); if (formErrors.password) setFormErrors({ ...formErrors, password: null }) }} className={`block w-full h-12 pl-12 pr-12 border ${formErrors.password ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`} placeholder={modalMode === 'edit' ? "Leave blank to keep current" : "••••••••"} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {formErrors.password && <span className="text-xs text-rose-500 font-semibold">{formErrors.password}</span>}
              </div>
            )}

            {role === 'ADMIN' && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 block">Role <span className="text-rose-500">*</span></label>
                <select disabled={modalMode === 'view'} value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="block w-full h-12 px-3 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all cursor-pointer disabled:bg-slate-50 disabled:text-slate-500">
                  <option value="MANAGING_PARTNER">Managing Partner</option>
                  <option value="ATTORNEY">Attorney</option>
                  <option value="PARALEGAL">Paralegal</option>
                </select>
              </div>
            )}

            {role === 'MANAGING_PARTNER' && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 block">Role <span className="text-rose-500">*</span></label>
                <select disabled={modalMode === 'view'} value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="block w-full h-12 px-3 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all cursor-pointer disabled:bg-slate-50 disabled:text-slate-500">
                  <option value="ATTORNEY">Attorney</option>
                  <option value="PARALEGAL">Paralegal</option>
                </select>
              </div>
            )}

            {role === 'ADMIN' && (newUser.role === 'ATTORNEY' || newUser.role === 'PARALEGAL') && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 block">Assign to Managing Partner <span className="text-rose-500">*</span></label>
                <select disabled={modalMode === 'view'} value={newUser.managingPartnerId} onChange={e => { setNewUser({ ...newUser, managingPartnerId: e.target.value, attorneyId: '' }); if (formErrors.managingPartnerId) setFormErrors({ ...formErrors, managingPartnerId: null }) }} className={`block w-full h-12 px-3 border ${formErrors.managingPartnerId ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 focus:outline-none focus:ring-2 transition-all cursor-pointer disabled:bg-slate-50 disabled:text-slate-500`}>
                  <option value="">Select Managing Partner</option>
                  {allUsersList.filter(u => u.role === 'MANAGING_PARTNER').map(mp => (
                    <option key={mp.id} value={mp.id}>{mp.name}</option>
                  ))}
                </select>
                {formErrors.managingPartnerId && <span className="text-xs text-rose-500 font-semibold">{formErrors.managingPartnerId}</span>}
              </div>
            )}

            {((role === 'ADMIN' && newUser.role === 'PARALEGAL') || (role === 'MANAGING_PARTNER' && newUser.role === 'PARALEGAL')) && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 block">Assign to Attorney <span className="text-rose-500">*</span></label>
                <select disabled={modalMode === 'view'} value={newUser.attorneyId} onChange={e => { setNewUser({ ...newUser, attorneyId: e.target.value }); if (formErrors.attorneyId) setFormErrors({ ...formErrors, attorneyId: null }) }} className={`block w-full h-12 px-3 border ${formErrors.attorneyId ? 'border-rose-300 focus:ring-rose-600 bg-rose-50' : 'border-slate-200 focus:ring-teal-600 focus:border-transparent bg-white'} rounded-lg text-slate-900 focus:outline-none focus:ring-2 transition-all cursor-pointer disabled:bg-slate-50 disabled:text-slate-500`}>
                  <option value="">Select Attorney</option>
                  {allUsersList.filter(u => u.role === 'ATTORNEY' && (role === 'ADMIN' ? u.managingPartnerId === newUser.managingPartnerId : true)).map(att => (
                    <option key={att.id} value={att.id}>{att.name}</option>
                  ))}
                </select>
                {formErrors.attorneyId && <span className="text-xs text-rose-500 font-semibold">{formErrors.attorneyId}</span>}
              </div>
            )}
          </div>

          <div className="pt-6 mt-auto">
            {modalMode === 'view' ? (
              <button
                type="button"
                onClick={onClose}
                className="w-full h-12 flex justify-center items-center px-4 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 transition-all cursor-pointer group"
              >
                Close
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 flex justify-center items-center px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-teal-900 hover:bg-teal-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    {modalMode === 'edit' ? 'Update User' : 'Save User'}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
