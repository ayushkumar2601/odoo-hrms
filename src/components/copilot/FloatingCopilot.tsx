"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Loader2, Maximize2, CheckCircle2, AlertCircle, FileText, Download } from "lucide-react";
import Link from "next/link";
import { generateAndDownloadPDF, PDFExportOptions } from "@/lib/copilot/pdf-export";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ActionProposal {
  actionType: string;
  title: string;
  description: string;
  payload: Record<string, unknown>;
}

interface ReportProposal {
  type: string;
  title: string;
  description: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  actionProposal?: ActionProposal;
  reportProposal?: ReportProposal;
  status?: "pending" | "confirmed" | "cancelled" | "generated";
  actionResult?: string;
}

export function FloatingCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response || data.error || "An error occurred." }]);
      } else if (data.actionProposal) {
        setMessages((prev) => [
          ...prev, 
          { 
            role: "assistant", 
            content: `I found an action request: ${data.actionProposal.title}`,
            actionProposal: data.actionProposal,
            status: "pending"
          }
        ]);
      } else if (data.reportProposal) {
        setMessages((prev) => [
          ...prev, 
          { 
            role: "assistant", 
            content: `Ready to generate report: ${data.reportProposal.title}`,
            reportProposal: data.reportProposal,
            status: "pending"
          }
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAction = async (idx: number, proposal: ActionProposal) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/copilot/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionType: proposal.actionType, payload: proposal.payload })
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => prev.map((msg, i) => i === idx ? { ...msg, status: "confirmed", actionResult: "Action executed successfully! Notice sent to HR." } : msg));
      } else {
        setMessages((prev) => prev.map((msg, i) => i === idx ? { ...msg, status: "confirmed", actionResult: `Error: ${data.error}` } : msg));
      }
    } catch {
      setMessages((prev) => prev.map((msg, i) => i === idx ? { ...msg, status: "confirmed", actionResult: "Failed to connect to action server." } : msg));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAction = (idx: number) => {
    setMessages((prev) => prev.map((msg, i) => i === idx ? { ...msg, status: "cancelled", actionResult: "Action cancelled by user." } : msg));
  };

  const handleGenerateReport = async (idx: number, proposal: ReportProposal) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: proposal.type })
      });
      const data = await res.json();
      if (res.ok && data.data) {
        generateAndDownloadPDF(data.data as PDFExportOptions);
        setMessages((prev) => prev.map((msg, i) => i === idx ? { ...msg, status: "generated", actionResult: "Report generated and downloaded as PDF successfully!" } : msg));
      } else {
        setMessages((prev) => prev.map((msg, i) => i === idx ? { ...msg, status: "generated", actionResult: `Error: ${data.error || "Failed to generate."}` } : msg));
      }
    } catch {
      setMessages((prev) => prev.map((msg, i) => i === idx ? { ...msg, status: "generated", actionResult: "Network failure during report generation." } : msg));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] w-80 sm:w-96 h-[540px] mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#111827] text-white p-4 px-5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xs tracking-tight">Zindle AI Copilot 2.0</h3>
                <p className="text-[10px] text-slate-400">Role-Aware Telemetry & Actions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/copilot" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1" title="Open Full Screen">
                <Maximize2 className="w-3.5 h-3.5" />
              </Link>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAFAFB]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 px-6">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center mb-3 shadow-2xs">
                  <Bot className="w-6 h-6 text-[#111827]" />
                </div>
                <p className="text-xs font-semibold text-[#111827]">Secure Enterprise Copilot</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Ask natural language questions, execute clock-ins, apply for time off, or generate executive PDF reports.</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs ${
                    msg.role === "user" 
                      ? "bg-[#111827] text-white rounded-tr-xs shadow-sm font-medium" 
                      : "bg-white border border-slate-200/80 text-[#111827] rounded-tl-xs shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                  }`}>
                    {msg.role === "user" ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="text-xs leading-relaxed space-y-1.5">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-bold text-[#111827] bg-slate-100 px-1 py-0.5 rounded border border-slate-200/60">{children}</strong>,
                            ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-1.5 pl-1 text-slate-600">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-1.5 pl-1 text-slate-600">{children}</ol>,
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            h3: ({ children }) => <h3 className="font-bold text-xs mt-3 mb-1 text-[#111827] border-b border-slate-200/80 pb-1">{children}</h3>,
                            h4: ({ children }) => <h4 className="font-semibold text-[11px] mt-2 mb-1 text-slate-700">{children}</h4>,
                            code: ({ children }) => <code className="bg-slate-100 text-[#111827] px-1 py-0.5 rounded text-[10px] font-mono border border-slate-200/80">{children}</code>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}

                    {/* Action Confirmation Card */}
                    {msg.actionProposal && msg.status === "pending" && (
                      <div className="mt-3 p-3 bg-[#FAFAFB] border border-slate-200/80 rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5 text-[#111827] font-bold text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                          <span>Action Confirmation Required</span>
                        </div>
                        <p className="text-[11px] text-slate-500">{msg.actionProposal.description}</p>
                        <div className="flex gap-2 pt-1">
                          <button 
                            onClick={() => handleConfirmAction(idx, msg.actionProposal!)}
                            className="flex-1 bg-[#111827] hover:bg-black text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg transition-all shadow-sm"
                          >
                            Confirm & Execute
                          </button>
                          <button 
                            onClick={() => handleCancelAction(idx)}
                            className="bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 text-[11px] font-semibold py-1.5 px-3 rounded-lg transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Report Generation Card */}
                    {msg.reportProposal && msg.status === "pending" && (
                      <div className="mt-3 p-3 bg-[#FAFAFB] border border-slate-200/80 rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5 text-[#111827] font-bold text-[11px]">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>PDF Telemetry Prepared</span>
                        </div>
                        <p className="text-[11px] text-slate-500">{msg.reportProposal.description}</p>
                        <button 
                          onClick={() => handleGenerateReport(idx, msg.reportProposal!)}
                          className="w-full bg-[#111827] hover:bg-black text-white text-[11px] font-semibold py-2 px-3 rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 mt-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download PDF Report</span>
                        </button>
                      </div>
                    )}

                    {/* Action / Report Result status */}
                    {msg.actionResult && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{msg.actionResult}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs px-3.5 py-2.5 shadow-2xs flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-[#111827] animate-spin" />
                  <span className="text-[11px] text-slate-500 font-medium">Synthesizing response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-200/80 bg-white">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Copilot or request action..."
                className="flex-1 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs font-medium text-[#111827] outline-none focus:bg-white focus:border-slate-400 transition-all placeholder:text-slate-400"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 bg-[#111827] hover:bg-black disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 bg-[#111827] hover:bg-black text-white rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.16)] transition-all ${isOpen ? "scale-90" : "hover:scale-105"}`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </button>
    </div>
  );
}
