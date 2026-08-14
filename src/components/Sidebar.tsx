"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Scale,
  Activity,
  FileText,
  ActivitySquare,
  Shield
} from "lucide-react";
import { logoutUser } from "@/app/actions/auth";

interface SidebarProps {
  role: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export default function Sidebar({ role, user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState<{ text: string, top: number, left: number } | null>(null);
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isExpanded = !isCollapsed || isMobileOpen;

  useEffect(() => {
    setMounted(true);
    const handleToggle = () => setIsMobileOpen(prev => !prev);
    window.addEventListener('toggle-mobile-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-mobile-sidebar', handleToggle);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Define routes based on role
  const getNavItems = () => {
    const items = [
      { name: "Overview", href: "/", icon: LayoutDashboard, roles: ['ADMIN', 'MANAGING_PARTNER', 'ATTORNEY', 'PARALEGAL'] },
      { name: "Dashboard", href: "/portal", icon: LayoutDashboard, roles: ['PLAINTIFF'] },
      { name: "Timeline", href: "/portal/timeline", icon: ActivitySquare, roles: ['PLAINTIFF'] },
      { name: "Documents", href: "/portal/documents", icon: FileText, roles: ['PLAINTIFF'] },
      { name: "Authorizations", href: "/portal/authorizations", icon: Shield, roles: ['PLAINTIFF'] },
      { name: "Cases & AI Analysis", href: "/cases", icon: FolderOpen, roles: ['ADMIN', 'MANAGING_PARTNER', 'ATTORNEY', 'PARALEGAL'] },
      { name: "Users", href: "/users", icon: Users, roles: ['ADMIN', 'MANAGING_PARTNER', 'ATTORNEY'] },
      { name: "Audit Log", href: "/audit", icon: Activity, roles: ['ADMIN', 'MANAGING_PARTNER'] },
      { name: "Billing", href: "/billing", icon: CreditCard, roles: ['ADMIN', 'MANAGING_PARTNER'] },
      { name: "Settings", href: "/settings", icon: Settings, roles: ['ADMIN', 'MANAGING_PARTNER', 'ATTORNEY', 'PARALEGAL', 'PLAINTIFF'] },
    ];
    return items.filter(item => item.roles.includes(role));
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[999] min-[768px]:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`relative bg-[#0b1320] text-slate-300 transition-all duration-300 flex flex-col z-20 m-2.5 rounded-2xl h-[calc(100vh-20px)] shadow-xl border border-slate-800 
          max-[767px]:fixed max-[767px]:top-0 max-[767px]:left-0 max-[767px]:h-full max-[767px]:m-0 max-[767px]:rounded-none max-[767px]:z-[1000]
          ${!isExpanded ? 'w-[80px]' : 'w-[260px]'}
          ${isMobileOpen ? 'max-[767px]:translate-x-0' : 'max-[767px]:-translate-x-full'}
        `}
      >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-6 bg-slate-800 border-[3px] border-slate-100 text-slate-300 rounded-full p-0.5 hover:bg-slate-700 hover:text-white transition-all z-30 cursor-pointer max-[767px]:hidden"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Logo */}
      <div className="h-20 flex items-center justify-center shrink-0 w-full bg-slate-800/30 rounded-t-2xl border-b border-slate-800">
        <div className="flex items-center gap-3 justify-center">
          <div className="bg-teal-500 w-11 h-11 rounded-lg flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6 text-white" />
          </div>
          {isExpanded && (
            <span className="text-xl font-bold tracking-tight text-white truncate transition-opacity duration-300">
              LexValue <span className="text-teal-400">AI</span>
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700/50 hover:[&::-webkit-scrollbar-thumb]:bg-slate-600/80 [&::-webkit-scrollbar-thumb]:rounded-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <div key={item.name} className="relative">
              <Link
                href={item.href}
                onMouseEnter={(e) => {
                  if (!isExpanded) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({ text: item.name, top: rect.top + rect.height / 2, left: rect.right + 12 });
                  }
                }}
                onMouseLeave={() => setTooltip(null)}
                className={`flex items-center rounded-lg text-base font-normal transition-all ${!isExpanded ? 'w-11 h-11 justify-center mx-auto' : 'px-3 h-11 gap-3 w-full'
                  } ${isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
              >
                <item.icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-white' : ''}`} />

                {isExpanded && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            </div>
          );
        })}
      </div>

      {/* User */}
      <div className="p-4 border-t border-slate-800">
        <div className={`flex items-center gap-3 ${!isExpanded ? 'justify-center' : ''}`}>
          <div className="w-11 h-11 rounded-lg bg-slate-800 flex items-center justify-center text-teal-400 font-medium border border-slate-700 shrink-0">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          {isExpanded && (
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
              <p className="text-base font-normal text-white truncate leading-none">{user.firstName} {user.lastName}</p>
              <p className="text-[14px] text-slate-500 truncate capitalize leading-none">{role.replace('_', ' ')}</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={async () => {
          await logoutUser();
          window.location.href = '/login';
        }}
        className="p-4 flex items-center justify-center shrink-0 w-full bg-red-400/10 hover:bg-red-400/20 rounded-b-2xl border-t border-red-500/20 cursor-pointer transition-colors group"
      >
        <div className="flex items-center gap-3 justify-center">
          <div className="bg-red-500 w-11 h-11 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <LogOut className="w-5 h-5 text-white ml-0.5" />
          </div>
          {isExpanded && (
            <span className="text-lg font-medium tracking-tight text-red-400 truncate transition-opacity duration-300">
              Sign Out
            </span>
          )}
        </div>
      </button>

      {/* Portal Tooltip */}
      {mounted && tooltip && createPortal(
        <div
          className="fixed bg-slate-800 text-white text-sm font-medium rounded-lg px-3 py-2 whitespace-nowrap z-[9999] pointer-events-none transform -translate-y-1/2"
          style={{ top: tooltip.top, left: tooltip.left }}
        >
          {tooltip.text}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
        </div>,
        document.body
      )}
    </aside>
    </>
  );
}
