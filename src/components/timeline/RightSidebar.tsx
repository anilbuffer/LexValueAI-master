"use client"
import { useState, useRef, useEffect } from "react"
import { MessageSquare, Plus, FileText, Send } from "lucide-react"

type Note = {
  id: number
  author: string
  role: string
  type: string
  content: string
  date: string
  isRestricted?: boolean
}

type ChatMessage = {
  id: number
  sender: 'ai' | 'user'
  content: string
  citation?: string
}

export function RightSidebar({ caseData }: { caseData: any }) {
  // Case Notes State
  const [noteText, setNoteText] = useState("")
  const [noteType, setNoteType] = useState("General")
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      author: "Navneet Kaur",
      role: "Paralegal",
      type: "Follow-up",
      content: "Requested PT discharge summary from Coastal on 3 occasions. Escalating to records subpoena if not received this week.",
      date: "9/15/2025, 5:30:00 AM"
    },
    {
      id: 2,
      author: "Alexandra Guidi",
      role: "Attorney",
      type: "Strategy",
      isRestricted: true,
      content: "Do not submit demand until the radiology addendum is in hand — the degenerative language is the single biggest exposure here.",
      date: "9/23/2025, 5:30:00 AM"
    }
  ])

  // Chat Interface State
  const [askText, setAskText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'ai',
      content: "Ask me anything about this medical record — I answer with page citations from the chronology."
    }
  ])

  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleAddNote = () => {
    if (!noteText.trim()) return

    const newNote: Note = {
      id: Date.now(),
      author: "Current User", // Mock user
      role: "Attorney",
      type: noteType,
      isRestricted: noteType === "Restricted",
      content: noteText.trim(),
      date: new Date().toLocaleString('en-US', { 
        month: 'numeric', 
        day: 'numeric', 
        year: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
      })
    }

    setNotes([newNote, ...notes])
    setNoteText("")
  }

  const handleSendMessage = () => {
    if (!askText.trim()) return

    const newUserMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      content: askText.trim()
    }

    setMessages(prev => [...prev, newUserMsg])
    setAskText("")
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const newAiMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        content: "Based on the records, the closest relevant finding indicates no documented care for this specific query during the interval. Defense may argue lack of continuity.",
        citation: "Pages 5-17, treatment timeline"
      }
      setMessages(prev => [...prev, newAiMsg])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <div className="w-full xl:w-[380px] shrink-0 flex flex-col gap-[15px]">
      
      {/* Case Notes */}
      <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            <h2 className="text-[15px] font-bold text-slate-900">Case Notes</h2>
          </div>
          <span className="text-[11px] font-bold text-slate-400">{notes.length}</span>
        </div>
        
        <div className="p-4 flex flex-col gap-3 border-b border-slate-100 shrink-0 bg-slate-50/50">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Internal note — never shared outside the firm."
            className="w-full h-20 text-[13px] border border-slate-200 rounded-lg p-3 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none transition-all placeholder:text-slate-400 font-medium text-slate-700 bg-white"
          />
          <div className="flex items-center gap-2">
            <select 
              value={noteType}
              onChange={(e) => setNoteType(e.target.value)}
              className="flex-1 text-[13px] border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-teal-500 bg-white text-slate-700 font-medium cursor-pointer"
            >
              <option>General</option>
              <option>Follow-up</option>
              <option>Strategy</option>
              <option>Restricted</option>
            </select>
            <button 
              onClick={handleAddNote}
              disabled={!noteText.trim()}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-lg text-[13px] font-bold hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        <div className="flex flex-col overflow-y-auto">
          {notes.map((note) => (
            <div key={note.id} className="p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <span className="text-[12px] font-bold text-slate-800">{note.author}</span>
                <span className="text-[11px] text-slate-400">{note.role}</span>
                
                {note.type === 'Strategy' ? (
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-sm">{note.type}</span>
                ) : note.type === 'Follow-up' ? (
                  <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-sm">{note.type}</span>
                ) : note.type === 'Restricted' ? (
                  <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-sm">{note.type}</span>
                ) : (
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-sm">{note.type}</span>
                )}

                {note.isRestricted && note.type !== 'Restricted' && (
                  <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-sm">Restricted</span>
                )}
              </div>
              <p className="text-[13px] text-slate-700 font-medium leading-relaxed mb-2 break-words">
                {note.content}
              </p>
              <p className="text-[11px] text-slate-400">{note.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ask this case */}
      <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden flex flex-col h-[400px]">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 shrink-0">
          <MessageSquare className="w-4 h-4 text-teal-600" />
          <h2 className="text-[15px] font-bold text-slate-900">Ask this case</h2>
        </div>
        
        <div ref={chatContainerRef} className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={
                msg.sender === 'user' 
                  ? "bg-teal-50 border border-teal-100 rounded-xl rounded-tr-sm p-4 text-[13px] text-teal-900 font-medium leading-relaxed self-end w-3/4 shadow-sm"
                  : "bg-slate-50 border border-slate-100 rounded-xl rounded-tl-sm p-4 text-[13px] text-slate-700 font-medium leading-relaxed shadow-sm w-[90%]"
              }
            >
              {msg.content}
              {msg.citation && (
                <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {msg.citation}</p>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl rounded-tl-sm p-4 text-[13px] text-slate-700 font-medium flex gap-1 w-24 items-center shadow-sm">
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 shrink-0 bg-slate-50/50">
          <div className="relative">
            <input
              type="text"
              value={askText}
              onChange={(e) => setAskText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="w-full text-[13px] border border-slate-200 rounded-xl py-3 pl-4 pr-12 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-slate-400 font-medium text-slate-700 bg-white"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!askText.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5 ml-[-2px] mt-[1px]" />
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
