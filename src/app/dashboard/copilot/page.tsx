"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function CopilotPage() {
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
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "An unexpected error occurred while communicating with the Copilot." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-200/80 overflow-hidden">
      
      {/* Header */}
      <div className="bg-[#111827] text-white p-6 px-8 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-sm">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Zindle AI Copilot 2.0 (Executive Edition)</h2>
            <p className="text-xs text-slate-400 mt-0.5">Natural Language Workforce Telemetry & Automated Mutations</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold bg-white/10 text-slate-200 px-3 py-1 rounded-full border border-white/10">
          Role-Aware RBAC Active
        </span>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#FAFAFB]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200/80 flex items-center justify-center mb-5 shadow-2xs">
              <Bot className="w-8 h-8 text-[#111827]" />
            </div>
            <h3 className="text-base font-bold text-[#111827] mb-1.5">How can Zindle Copilot assist you?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Query employee attendance, inspect leave applications, check salary slips, or generate executive PDF telemetry reports. All outputs strictly adhere to your authenticated RBAC permissions.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-3xl px-6 py-4.5 ${
                msg.role === "user" 
                  ? "bg-[#111827] text-white rounded-tr-xs shadow-sm font-medium text-sm" 
                  : "bg-white border border-slate-200/80 text-[#111827] rounded-tl-xs shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-sm"
              }`}>
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                ) : (
                  <div className="text-sm leading-relaxed space-y-2">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-bold text-[#111827] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/80">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 my-2 pl-2 text-slate-600">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 my-2 pl-2 text-slate-600">{children}</ol>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        h3: ({ children }) => <h3 className="font-bold text-sm mt-4 mb-2 text-[#111827] border-b border-slate-200/80 pb-1.5 flex items-center gap-2">{children}</h3>,
                        h4: ({ children }) => <h4 className="font-semibold text-xs mt-3 mb-1 text-slate-700">{children}</h4>,
                        code: ({ children }) => <code className="bg-slate-100 text-[#111827] px-1.5 py-0.5 rounded text-xs font-mono border border-slate-200/80">{children}</code>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200/80 rounded-3xl rounded-tl-xs px-6 py-4 shadow-2xs flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-[#111827] animate-spin" />
              <span className="text-xs text-slate-500 font-medium">Synthesizing workforce telemetry...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-5 border-t border-slate-200/80 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Copilot to analyze attendance, apply for time off, or export a report..."
            className="flex-1 bg-[#FAFAFB] border border-[#E5E7EB] rounded-2xl px-5 py-3.5 outline-none focus:bg-white focus:border-slate-400 transition-all text-sm text-[#111827] placeholder:text-slate-400 font-medium"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-[#111827] hover:bg-black disabled:opacity-40 text-white rounded-2xl flex items-center justify-center transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
