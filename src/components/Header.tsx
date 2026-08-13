"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Search, Maximize, Minimize, Plus, FileText, History, CheckCircle2, AlertTriangle, XCircle, Clock, Info, Folder, Loader2, User, Shield, CreditCard, Settings, Menu } from "lucide-react"

export default function Header({ role, user }: { role: string, user: { firstName: string, lastName: string } }) {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Listen for fullscreen changes (e.g. if user presses Esc)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifContainerRef = useRef<HTMLDivElement>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>({ cases: [], users: [], notifications: [], auditLogs: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifContainerRef.current && !notifContainerRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        setTimeout(() => {
          setSearchResults({ cases: [], users: [], notifications: [], auditLogs: [] });
          setIsSearching(false);
        }, 500);
      } else {
        setSearchResults({ cases: [], users: [], notifications: [], auditLogs: [] });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchNotifications = async () => {
    try {
      const mockData = await import('@/lib/mock-data');
      const notifs = mockData.getMockNotifications().slice(0, 5);
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n: any) => !n.isRead).length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every 60s
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <header className="relative p-4 bg-white rounded-2xl m-2.5 shadow-md shadow-slate-200/50 flex items-center justify-between shrink-0 z-[999] border border-slate-200/50">

      {/* Left: Greeting */}
      <div className="flex-1 max-[1100px]:hidden">
        <h2 className="text-slate-800 font-bold tracking-tight text-lg flex items-center gap-2">
          Hello, {user.firstName} {user.lastName} <span className="hover:animate-pulse cursor-default">👋</span>
        </h2>
        <p className="text-sm text-slate-500 font-regular ">Here&apos;s an overview of your firm&apos;s activity today.</p>
      </div>

      {/* Mobile Menu Button (replaces search on mobile) */}
      <button 
        onClick={() => window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))}
        className="hidden max-[767px]:flex w-12 h-12 items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all cursor-pointer mr-auto"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Center: Search Bar (Login Input Style) */}
      <div className="flex-1 max-w-lg flex justify-center max-[1100px]:justify-start relative max-[767px]:hidden" ref={searchContainerRef}>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className="block w-full h-12 pl-12 pr-3 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all cursor-text"
            placeholder="Search cases, medical records..."
          />
        </div>

        {/* Search Suggestions Dropdown */}
        <div className={`absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-200 z-50 max-h-[60vh] overflow-y-auto ${isSearchOpen && (searchQuery.length > 1) ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="p-2">
            
            {isSearching ? (
              <div className="px-3 py-8 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
                <span className="text-sm font-medium text-slate-500">Searching global records...</span>
              </div>
            ) : (() => {
              const hasResults = searchResults.cases?.length > 0 || searchResults.users?.length > 0 || searchResults.notifications?.length > 0 || searchResults.auditLogs?.length > 0;
              const sq = searchQuery.toLowerCase();
              const showBilling = "billing".includes(sq) || "subscription".includes(sq) || "plan".includes(sq);
              const showSettings = "settings".includes(sq) || "firm".includes(sq) || "profile".includes(sq);

              if (!hasResults && !showBilling && !showSettings) {
                return (
                  <div className="px-3 py-6 text-center">
                    <p className="text-sm font-medium text-slate-700">No results found for "{searchQuery}"</p>
                    <p className="text-xs text-slate-500 mt-1">Try checking for typos or using different keywords.</p>
                  </div>
                )
              }

              return (
                <>
                  {/* Cases Section */}
                  {searchResults.cases?.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cases</div>
                      {searchResults.cases.map((result: any) => (
                        <button 
                          key={result.id}
                          onClick={() => { const q = searchQuery; setIsSearchOpen(false); setSearchQuery(""); router.push(`/cases?search=${encodeURIComponent(q)}`); }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-start gap-3 transition-colors cursor-pointer"
                        >
                          <Folder className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-slate-800 truncate">{result.title}</span>
                            <span className="text-xs text-slate-500 truncate">{result.type || "General"}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Users Section */}
                  {searchResults.users?.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Users</div>
                      {searchResults.users.map((result: any) => (
                        <button 
                          key={result.id}
                          onClick={() => { const q = searchQuery; setIsSearchOpen(false); setSearchQuery(""); router.push(`/users?search=${encodeURIComponent(q)}`); }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-start gap-3 transition-colors cursor-pointer"
                        >
                          <User className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-slate-800 truncate">{result.firstName} {result.lastName}</span>
                            <span className="text-xs text-slate-500 truncate">{result.email}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Notifications Section */}
                  {searchResults.notifications?.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Notifications</div>
                      {searchResults.notifications.map((result: any) => (
                        <button 
                          key={result.id}
                          onClick={() => { const q = searchQuery; setIsSearchOpen(false); setSearchQuery(""); router.push(`/notifications?search=${encodeURIComponent(q)}`); }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-start gap-3 transition-colors cursor-pointer"
                        >
                          <Bell className={`w-4 h-4 shrink-0 mt-0.5 ${result.isRead ? 'text-slate-400' : 'text-amber-500'}`} />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-slate-800 truncate">{result.message}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Audit Logs Section */}
                  {searchResults.auditLogs?.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Audit Logs</div>
                      {searchResults.auditLogs.map((result: any) => (
                        <button 
                          key={result.id}
                          onClick={() => { const q = searchQuery; setIsSearchOpen(false); setSearchQuery(""); router.push(`/audit?search=${encodeURIComponent(q)}`); }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-start gap-3 transition-colors cursor-pointer"
                        >
                          <Shield className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-slate-800 truncate">{result.action}</span>
                            <span className="text-xs text-slate-500 truncate">{result.details}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick Shortcuts Section */}
                  {(showBilling || showSettings) && (
                    <div className="mb-2">
                      <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Shortcuts</div>
                      {showBilling && (
                        <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); router.push(`/billing`); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-colors cursor-pointer">
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-slate-800">Billing & Subscription</span>
                        </button>
                      )}
                      {showSettings && (
                        <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); router.push(`/settings`); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-colors cursor-pointer">
                          <Settings className="w-4 h-4 text-slate-600" />
                          <span className="text-sm font-medium text-slate-800">Firm Settings</span>
                        </button>
                      )}
                    </div>
                  )}
                </>
              )
            })()}

          </div>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex-1 flex items-center justify-end gap-3">

        {/* Fullscreen Option */}
        <button
          onClick={toggleFullScreen}
          className="w-12 h-12 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all cursor-pointer max-[1100px]:hidden"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative group" ref={notifContainerRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-12 h-12 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          <div className={`absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-200 z-50 overflow-hidden ${isNotifOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">Notifications {unreadCount > 0 && `(${unreadCount})`}</h3>
              <button onClick={markAllAsRead} className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer">Mark all read</button>
            </div>
            <div className="max-h-[300px] overflow-y-auto">

              {notifications.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-sm">No new notifications</div>
              ) : (
                notifications.map((notif) => {
                    const getStyle = () => {
                      const msg = notif.message.toLowerCase()
                      if (msg.includes('delete') || msg.includes('remov')) return { Icon: AlertTriangle, bg: 'bg-rose-50', text: notif.isRead ? 'text-rose-400' : 'text-rose-600' }
                      if (msg.includes('reject')) return { Icon: XCircle, bg: 'bg-rose-50', text: notif.isRead ? 'text-rose-400' : 'text-rose-600' }
                      if (msg.includes('approv')) return { Icon: CheckCircle2, bg: 'bg-emerald-50', text: notif.isRead ? 'text-emerald-400' : 'text-emerald-600' }
                      if (msg.includes('warn') || msg.includes('alert')) return { Icon: AlertTriangle, bg: 'bg-amber-50', text: notif.isRead ? 'text-amber-400' : 'text-amber-600' }
                      if (msg.includes('remind')) return { Icon: Clock, bg: 'bg-purple-50', text: notif.isRead ? 'text-purple-400' : 'text-purple-600' }
                      if (msg.includes('create') || msg.includes('new') || msg.includes('info') || msg.includes('status') || msg.includes('change') || msg.includes('updat')) return { Icon: Info, bg: 'bg-blue-50', text: notif.isRead ? 'text-blue-400' : 'text-blue-600' }
                      return { Icon: Bell, bg: 'bg-teal-50', text: notif.isRead ? 'text-slate-400' : 'text-teal-600' }
                    }
                  const { Icon, bg, text } = getStyle()

                  return (
                    <div key={notif.id} onClick={() => markAsRead(notif.id)} className={`px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 flex gap-3 items-start ${!notif.isRead ? 'bg-slate-50/50' : ''}`}>
                      <div className={`mt-0.5 ${bg} w-8 h-8 rounded-lg shrink-0 flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${text}`} />
                      </div>
                      <div>
                        <p className={`text-sm leading-snug ${!notif.isRead ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{notif.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(notif.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                  )
                })
              )}

            </div>
            <div className="p-2 border-t border-slate-100 bg-slate-50/50">
              <Link href="/notifications" className="block w-full py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-center">
                View All Notifications
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Action Button (Login Button Style) */}
        {(role === 'ADMIN' || role === 'MANAGING_PARTNER') && (
          <Link href="/cases/new" className="h-12 flex justify-center items-center px-5 border border-transparent rounded-lg text-sm font-medium text-white bg-teal-900 hover:bg-teal-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 transition-all cursor-pointer group">
            New Case
            <Plus className="ml-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
          </Link>
        )}

      </div>
    </header>
  )
}
