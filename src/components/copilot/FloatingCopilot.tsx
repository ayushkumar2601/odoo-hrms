"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Loader2, Maximize2, CheckCircle2, AlertCircle, FileText, Download } from "lucide-react";
import Link from "next/link";
import { generateAndDownloadPDF, PDFExportOptions } from "@/lib/copilot/pdf-export";

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
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-80 sm:w-96 h-[520px] mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Zindle Copilot</h3>
                <p className="text-xs text-slate-400">Actions, Reports & Analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/copilot" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors" title="Open Full Page">
                <Maximize2 className="w-4 h-4" />
              </Link>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 px-4">
                <Bot className="w-12 h-12 mb-3 text-slate-300" />
                <p className="text-sm">I&apos;m your secure AI assistant. You can ask questions, apply for leave, or export reports as PDFs!</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-tr-sm" 
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Action Confirmation Card */}
                    {msg.actionProposal && msg.status === "pending" && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-blue-800 font-semibold text-xs">
                          <AlertCircle className="w-4 h-4 text-blue-600" />
                          <span>Action Confirmation Required</span>
                        </div>
                        <p className="text-xs text-slate-600">{msg.actionProposal.description}</p>
                        <div className="flex gap-2 pt-1">
                          <button 
                            onClick={() => handleConfirmAction(idx, msg.actionProposal!)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded-lg transition-colors"
                          >
                            Confirm Action
                          </button>
                          <button 
                            onClick={() => handleCancelAction(idx)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium py-1.5 px-3 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Report Generation Card */}
                    {msg.reportProposal && msg.status === "pending" && (
                      <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-indigo-900 font-semibold text-xs">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span>PDF Report Ready</span>
                        </div>
                        <p className="text-xs text-slate-600">{msg.reportProposal.description}</p>
                        <button 
                          onClick={() => handleGenerateReport(idx, msg.reportProposal!)}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 mt-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Generate & Download PDF</span>
                        </button>
                      </div>
                    )}

                    {/* Action / Report Result status */}
                    {msg.actionResult && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{msg.actionResult}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="text-xs text-slate-500 font-medium">Processing request...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-200 bg-white">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask, apply leave, or generate report..."
                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-600/20 transition-transform ${isOpen ? "scale-90" : "hover:scale-105"}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
