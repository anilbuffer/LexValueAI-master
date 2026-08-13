"use client";

import { useState, useActionState, useEffect } from "react";
import { Mail, Lock, ArrowRight, ShieldCheck, Scale, FileText, UserPlus, Eye, EyeOff, Sparkles, RefreshCcw, Phone, Users, Calendar, Heart, User, Activity, CheckCircle, Handshake, GraduationCap, DollarSign, Building2 } from "lucide-react";
import { loginUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import loginBg from "../../../public/images/login.jpg";

type Role = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  email: string;
};

const demoRoles: Role[] = [
  { id: 'paralegal', title: 'Paralegal', subtitle: 'Case Prep', icon: FileText, email: 'rachel@smithassociates.com' },
  { id: 'attorney', title: 'Attorney', subtitle: 'Legal Desk', icon: Scale, email: 'mike@smithassociates.com' },
  { id: 'managing_partner', title: 'Managing Partner', subtitle: 'Firm Overview', icon: Handshake, email: 'harvey@smithassociates.com' },
  { id: 'admin', title: 'Super Admin', subtitle: 'System Control', icon: ShieldCheck, email: 'admin@lexvalue.com' },
];

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setEmail(role.email);
    setPassword("demo1234"); // Auto-fill password
  };

  const handleReset = () => {
    setSelectedRole(null);
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('lexvalue-remembered-email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  useEffect(() => {
    if (state?.success) {
      if (remember) {
        localStorage.setItem('lexvalue-remembered-email', email);
      } else {
        localStorage.removeItem('lexvalue-remembered-email');
      }
      router.push("/");
    }
  }, [state, router, remember, email]);

  return (
    <div className="min-h-screen flex flex-row-reverse bg-white selection:bg-teal-200">

      {/* Right Pane (Now visually on Right due to flex-row-reverse) - Login Form */}
      <div className="w-full lg:w-[450px] xl:w-[500px] flex flex-col justify-between p-8 sm:p-12 md:p-16 relative bg-white z-10 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.15)]">

        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <Scale className="w-8 h-8 text-teal-600" />
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              LexValue <span className="text-teal-600">AI</span>
            </span>
          </div>

          {selectedRole && (
            <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium">
                <selectedRole.icon className="w-4 h-4" />
                {selectedRole.title} {selectedRole.subtitle ? `& ${selectedRole.subtitle}` : ''}
              </div>
              <button onClick={handleReset} type="button" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                <RefreshCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          )}

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Welcome <span className="hover:animate-pulse cursor-default">👋</span>
            </h2>
            <p className="text-slate-500 mt-2 text-sm">Please sign in to your account to continue.</p>
          </div>

          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                {state.error}
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 block" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full h-12 pl-12 pr-3 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                    placeholder="name@lawfirm.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 block" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full h-12 pl-12 pr-12 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" name="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-slate-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer" />
                  <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">Remember me</label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-12 flex justify-center items-center px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-teal-900 hover:bg-teal-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group mt-8"
            >
              {isPending ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  Sign in to workspace
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <a href="#" className="text-sm font-semibold text-slate-900 underline underline-offset-4 hover:text-teal-700 transition-colors">
                Forgot your password?
              </a>
            </div>

            {/* Create Account Section */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">New to LexValue AI?</span>
              </div>
            </div>

            <div className="space-y-3">
              <a href="#" className="w-full h-12 flex justify-center items-center px-4 border border-teal-100 rounded-lg text-sm font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 transition-all cursor-pointer">
                <UserPlus className="w-5 h-5 mr-2 text-teal-600" />
                Create an account
              </a>
            </div>
          </form>
        </div>

        <div className="mt-12 text-center text-slate-400 text-xs">
          Copyright &copy; {new Date().getFullYear()} LexValue AI LLC.<br />All rights reserved.
        </div>
      </div>

      {/* Left Pane (Now visually on Left due to flex-row-reverse) - Full Image Background */}
      <div className="hidden lg:flex flex-1 relative bg-teal-900 overflow-hidden flex-col p-12 xl:p-16">

        {/* Actual Image Background (User Provided Image) */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${loginBg.src})` }}
        ></div>

        {/* Gradient Overlay for text readability (Darkened) */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950 via-teal-950/95 to-teal-950/80 z-10"></div>

        {/* Main Content Container */}
        <div className="relative z-20 flex flex-col h-full justify-between">
          
          {/* Top Section - Roles */}
          <div className="w-full max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-teal-300 font-bold text-sm tracking-widest uppercase">
                <Sparkles className="w-4 h-4" />
                Select Workspace Role:
              </div>
              <div className="text-teal-400/80 text-sm font-medium">
                Auto-fills demo credentials
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {demoRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  type="button"
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group
                    ${selectedRole?.id === role.id 
                      ? 'border-teal-400 bg-teal-900/50 shadow-[0_0_15px_rgba(45,212,191,0.2)]' 
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                >
                  <div className={`p-2.5 rounded-lg transition-colors flex-shrink-0
                    ${selectedRole?.id === role.id 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-white/10 text-teal-100 group-hover:text-white group-hover:bg-white/20'
                    }`}>
                    <role.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-semibold text-sm leading-tight truncate">{role.title}</div>
                    <div className="text-teal-100/60 text-[11px] mt-0.5 leading-tight truncate">{role.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Section - Hero Text */}
          <div className="max-w-3xl pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-teal-300 text-sm font-medium mb-8 backdrop-blur-sm transition-all duration-300">
               {selectedRole ? <selectedRole.icon className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
               {selectedRole ? `${selectedRole.title} & ${selectedRole.subtitle}` : 'Agency Executive & Admin'}
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold uppercase tracking-wide text-white leading-tight mb-6">
              Intelligent Case Processing.
            </h1>
            <p className="text-lg text-teal-50 mb-10 leading-relaxed font-light max-w-xl">
              Automate medical chronology generation, detect litigation-critical flags, and build demand-ready narratives with HIPAA-compliant AI.
            </p>

            <div className="flex gap-8">
              <div className="flex items-center gap-3 group">
                <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/20 shadow-xl group-hover:bg-white/20 transition-all">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-medium text-sm drop-shadow-md">Instant Chronologies</h3>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/20 shadow-xl group-hover:bg-white/20 transition-all">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-medium text-sm drop-shadow-md">HIPAA Compliant</h3>
              </div>
            </div>
          </div>
          
        </div>

        {/* Small Floating Badge (Bottom Right) */}
        <div className="absolute bottom-12 right-12 bg-white/10 backdrop-blur-md border border-white/20 p-3 pr-6 rounded-2xl shadow-2xl flex items-center gap-3 w-auto animate-float z-20 pointer-events-none hidden xl:flex">
          <div className="flex -space-x-2">
            <img src="https://i.pravatar.cc/100?img=1" alt="avatar" className="w-8 h-8 rounded-full border-2 border-teal-900 object-cover" />
            <img src="https://i.pravatar.cc/100?img=5" alt="avatar" className="w-8 h-8 rounded-full border-2 border-teal-900 object-cover" />
            <div className="w-8 h-8 rounded-full bg-teal-500 border-2 border-teal-900 flex items-center justify-center text-[10px] font-bold text-white z-10">
              50k+
            </div>
          </div>
          <div>
            <p className="font-semibold text-white text-sm whitespace-nowrap">Trusted by Firms</p>
          </div>
        </div>
      </div>

    </div>
  );
}
