"use client"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { MessageSquare, Plus, FileText, Send, X, Minus, Maximize2, Minimize2 } from "lucide-react"
import { getMockCaseNotes, createMockCaseNote, getMockChatHistory, createMockChatHistory } from "@/lib/mock-data"

type Note = {
  id: string
  caseId: string
  firmId: string
  author: string
  role: string
  type: string
  content: string
  createdAt: Date
  isRestricted?: boolean
}

type ChatMessage = {
  id: string
  caseId: string
  firmId: string
  sender: 'ai' | 'user'
  content: string
  citation?: string | null
  createdAt: Date
}

type ChatState = 'closed' | 'minimized' | 'normal' | 'maximized';

export function RightSidebar({ caseData }: { caseData: any }) {
  const firmId = caseData?.firmId;
  const caseId = caseData?.id;

  // Case Notes State
  const [noteText, setNoteText] = useState("")
  const [noteType, setNoteType] = useState("General")
  const [notes, setNotes] = useState<Note[]>([])

  // Chat Interface State
  const [askText, setAskText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatState, setChatState] = useState<ChatState>('closed')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Fetch initial data
  useEffect(() => {
    if (firmId && caseId) {
      setNotes(getMockCaseNotes(firmId, caseId) as Note[]);
      setMessages(getMockChatHistory(firmId, caseId) as ChatMessage[]);
    }
  }, [firmId, caseId]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current && (chatState === 'normal' || chatState === 'maximized')) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isTyping, chatState])

  const handleAddNote = () => {
    if (!noteText.trim() || !firmId || !caseId) return

    const newNote: Note = {
      id: "note-" + Date.now(),
      caseId,
      firmId,
      author: "Current User", // Mock user
      role: "Attorney",
      type: noteType,
      isRestricted: noteType === "Restricted",
      content: noteText.trim(),
      createdAt: new Date()
    }

    const saved = createMockCaseNote(newNote);
    setNotes([saved, ...notes])
    setNoteText("")
  }

  const handleSendMessage = () => {
    if (!askText.trim() || !firmId || !caseId) return

    const newUserMsg: ChatMessage = {
      id: "chat-" + Date.now(),
      caseId,
      firmId,
      sender: 'user',
      content: askText.trim(),
      createdAt: new Date()
    }

    createMockChatHistory(newUserMsg);
    setMessages(prev => [...prev, newUserMsg])
    setAskText("")
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const newAiMsg: ChatMessage = {
        id: "chat-" + (Date.now() + 1),
        caseId,
        firmId,
        sender: 'ai',
        content: "Based on the records, the closest relevant finding indicates no documented care for this specific query during the interval. Defense may argue lack of continuity.",
        citation: "Pages 5-17, treatment timeline",
        createdAt: new Date()
      }
      createMockChatHistory(newAiMsg);
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
    <div className="w-full xl:w-[380px] shrink-0 flex flex-col gap-[15px] xl:sticky xl:top-[120px] self-start">

      {/* Case Notes */}
      <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-100px)] max-h-[800px]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            <h2 className="text-[15px] font-bold text-slate-900">Case Notes</h2>
            <span className="text-[11px] font-bold text-slate-400 ml-1">{notes.length}</span>
          </div>
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

        <div className="flex flex-col gap-3 p-4 overflow-y-auto flex-1 bg-slate-50/50">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <span className="text-[13px] font-bold text-slate-800">{note.author}</span>
                <span className="text-[12px] text-slate-500">{note.role}</span>

                {note.type === 'Strategy' ? (
                  <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-md ml-auto">{note.type}</span>
                ) : note.type === 'Follow-up' ? (
                  <span className="bg-teal-50 text-teal-700 text-[11px] font-bold px-2 py-0.5 rounded-md ml-auto">{note.type}</span>
                ) : note.type === 'Restricted' ? (
                  <span className="bg-rose-50 text-rose-700 text-[11px] font-bold px-2 py-0.5 rounded-md ml-auto">{note.type}</span>
                ) : (
                  <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-md ml-auto">{note.type}</span>
                )}
              </div>

              <p className="text-[14px] text-slate-700 font-medium leading-relaxed mb-3 break-words group-hover:text-slate-900 transition-colors">
                {note.content}
              </p>

              <div className="flex items-center justify-between">
                <p className="text-[12px] text-slate-400 font-medium">
                  {note.createdAt && new Date(note.createdAt).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                    hour: 'numeric', minute: '2-digit', hour12: true
                  })}
                </p>
                {note.isRestricted && note.type !== 'Restricted' && (
                  <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-md">Restricted</span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Floating Ask this case Chat Widget */}

      {/* Floating Trigger Button (when chat is closed) */}
      {chatState === 'closed' && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Infinite Wave Layers */}
          <div className="absolute inset-0 rounded-full bg-teal-500 opacity-30 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
          <div className="absolute inset-0 rounded-full bg-teal-500 opacity-30 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '800ms' }}></div>
          <div className="absolute inset-0 rounded-full bg-teal-500 opacity-30 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '1600ms' }}></div>

          <button
            onClick={() => setChatState('normal')}
            className="relative group flex items-center justify-center gap-2 px-5 py-3.5 bg-teal-600 text-white hover:bg-teal-700 rounded-full text-[14px] font-bold transition-all shadow-[0_0_20px_rgba(13,148,136,0.6)] hover:shadow-[0_0_30px_rgba(13,148,136,0.8)] leading-none"
          >
            <div className="group-hover:animate-wave origin-bottom-right flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span>Ask this case</span>
          </button>
        </div>
      )}

      {/* Actual Chat Widget */}
      {chatState !== 'closed' && (
        <div
          className={`fixed z-50 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${chatState === 'minimized' ? 'bottom-6 right-6 w-[300px] h-[56px]' :
            chatState === 'maximized' ? 'bottom-6 right-6 w-[80vw] h-[85vh] sm:w-[600px]' :
              'bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px]'
            }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0 bg-teal-900 text-white ${chatState === 'minimized' ? 'cursor-pointer hover:bg-teal-800 transition-colors h-full' : ''}`}
            onClick={() => { if (chatState === 'minimized') setChatState('normal') }}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <h2 className="text-[15px] font-bold">Ask this case</h2>
            </div>

            <div className="flex items-center gap-3">
              {chatState !== 'minimized' && (
                <button
                  onClick={(e) => { e.stopPropagation(); setChatState('minimized'); }}
                  className="text-teal-200 hover:text-white transition-colors"
                  title="Minimize"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
              {chatState === 'normal' && (
                <button
                  onClick={(e) => { e.stopPropagation(); setChatState('maximized'); }}
                  className="text-teal-200 hover:text-white transition-colors"
                  title="Maximize"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
              {chatState === 'maximized' && (
                <button
                  onClick={(e) => { e.stopPropagation(); setChatState('normal'); }}
                  className="text-teal-200 hover:text-white transition-colors"
                  title="Restore Down"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setChatState('closed'); }}
                className="text-teal-200 hover:text-white transition-colors ml-1"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          {chatState !== 'minimized' && (
            <>
              <div ref={chatContainerRef} className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto bg-slate-50/30">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={
                      msg.sender === 'user'
                        ? "bg-teal-50 border border-teal-100 rounded-xl rounded-tr-sm p-4 text-[13px] text-teal-900 font-medium leading-relaxed self-end max-w-[85%] shadow-sm"
                        : "bg-white border border-slate-100 rounded-xl rounded-tl-sm p-4 text-[13px] text-slate-700 font-medium leading-relaxed shadow-sm max-w-[90%]"
                    }
                  >
                    {msg.content}
                    {msg.citation && (
                      <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {msg.citation}</p>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="bg-white border border-slate-100 rounded-xl rounded-tl-sm p-4 text-[13px] text-slate-700 font-medium flex gap-1 w-24 items-center shadow-sm">
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-slate-100 shrink-0 bg-white">
                <div className="relative">
                  <input
                    type="text"
                    value={askText}
                    onChange={(e) => setAskText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question about this case..."
                    className="w-full text-[13px] border border-slate-200 rounded-xl py-3 pl-4 pr-12 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-slate-400 font-medium text-slate-700 bg-slate-50"
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
            </>
          )}
        </div>
      )}

      {/* Note Details Modal */}
      {selectedNote && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 transition-opacity"
          onClick={() => setSelectedNote(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-[16px]">Note Details</h3>
              <button
                onClick={() => setSelectedNote(null)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 hover:bg-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <span className="text-[15px] font-bold text-slate-800">{selectedNote.author}</span>
                <span className="text-[14px] text-slate-500">{selectedNote.role}</span>

                {selectedNote.type === 'Strategy' ? (
                  <span className="bg-emerald-50 text-emerald-700 text-[12px] font-bold px-2 py-0.5 rounded-md ml-auto">{selectedNote.type}</span>
                ) : selectedNote.type === 'Follow-up' ? (
                  <span className="bg-teal-50 text-teal-700 text-[12px] font-bold px-2 py-0.5 rounded-md ml-auto">{selectedNote.type}</span>
                ) : selectedNote.type === 'Restricted' ? (
                  <span className="bg-rose-50 text-rose-700 text-[12px] font-bold px-2 py-0.5 rounded-md ml-auto">{selectedNote.type}</span>
                ) : (
                  <span className="bg-slate-100 text-slate-700 text-[12px] font-bold px-2 py-0.5 rounded-md ml-auto">{selectedNote.type}</span>
                )}

                {selectedNote.isRestricted && selectedNote.type !== 'Restricted' && (
                  <span className="bg-rose-50 text-rose-700 text-[11px] font-bold px-2 py-0.5 rounded-md">Restricted</span>
                )}
              </div>
              <p className="text-[15px] text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                {selectedNote.content}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[13px] text-slate-400 font-medium">
                <span>
                  {selectedNote.createdAt && new Date(selectedNote.createdAt).toLocaleString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric',
                    hour: 'numeric', minute: '2-digit', hour12: true
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Case Note
                </span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  )
}

