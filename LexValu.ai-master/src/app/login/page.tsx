"use client";

import { useState, useActionState, useEffect } from "react";
import { Mail, Lock, ArrowRight, ShieldCheck, Scale, FileText, UserPlus, Eye, EyeOff } from "lucide-react";
import { loginUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import loginBg from "../../../public/images/login.jpg";

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="hidden lg:flex flex-1 relative bg-teal-900 overflow-hidden flex-col justify-center p-16">

        {/* Actual Image Background (User Provided Image) */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${loginBg.src})` }}
        ></div>

        {/* Gradient Overlay for text readability (Darkened) */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950 via-teal-950/95 to-teal-950/40 z-10"></div>

        {/* Small Floating Badge (Top Right) */}
        <div className="absolute top-16 right-16 bg-white/10 backdrop-blur-md border border-white/20 p-3 pr-6 rounded-2xl shadow-2xl flex items-center gap-3 w-auto animate-float z-20 pointer-events-none">
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

        {/* Main Content */}
        <div className="relative z-20 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold uppercase tracking-wide text-white leading-tight mb-6">
            Intelligent Case Processing.
          </h1>
          <p className="text-lg text-teal-50 mb-10 leading-relaxed font-light max-w-xl">
            Automate medical chronology generation, detect litigation-critical flags, and build demand-ready narratives with HIPAA-compliant AI.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-xl group-hover:bg-white/20 transition-all">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium text-lg drop-shadow-md">Instant Chronologies</h3>
              </div>
            </div>

            <div className="flex items-center gap-4 group mt-6">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-xl group-hover:bg-white/20 transition-all">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium text-lg drop-shadow-md">HIPAA Compliant</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
