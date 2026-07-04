"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Trash2, Plus, Search, Loader2, Filter, X, CheckSquare, Square, MoreHorizontal, ArrowUpRight } from "lucide-react";
import { generateAndDownloadPDF, PDFExportOptions } from "@/lib/copilot/pdf-export";

interface Report {
  id: string;
  title: string;
  type: string;
  generatedBy: string;
  role: string;
  fileData: string;
  createdAt: string;
}

export default function ReportCenterPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  const fetchReports = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();
      if (data.reports) setReports(data.reports);
    } catch {
      console.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(false);
  }, []);

  const handleGenerate = async (type: string) => {
    setGenerating(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      if (res.ok && data.data) {
        generateAndDownloadPDF(data.data as PDFExportOptions);
        await fetchReports();
      } else {
        alert(`Error: ${data.error || "Failed to generate report."}`);
      }
    } catch {
      alert("Network error.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadAgain = (report: Report) => {
    try {
      const parsed = JSON.parse(report.fileData);
      generateAndDownloadPDF({
        title: report.title,
        type: report.type,
        generatedBy: report.generatedBy,
        role: report.role,
        headers: parsed.headers,
        rows: parsed.rows,
        summary: parsed.summary
      });
    } catch {
      alert("Failed to parse report data for PDF generation.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      const res = await fetch(`/api/reports?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setReports(prev => prev.filter(r => r.id !== id));
      }
    } catch {
      alert("Delete failed");
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.generatedBy.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === "ALL" || r.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Apple & Linear Style Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">AI Report Center & Telemetry</h1>
          <p className="text-xs text-slate-500 mt-1">Generate executive PDF summaries, attendance audits, and leave records</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            disabled={generating}
            onClick={() => handleGenerate("ATTENDANCE")} 
            className="px-3.5 py-2 bg-[#111827] hover:bg-black disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
          >
            {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            <span>Attendance PDF</span>
          </button>
          <button 
            disabled={generating}
            onClick={() => handleGenerate("LEAVE")} 
            className="px-3.5 py-2 bg-white hover:bg-slate-50 disabled:opacity-50 text-[#111827] border border-slate-200/80 text-xs font-semibold rounded-xl shadow-2xs transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>Leave PDF</span>
          </button>
          <button 
            disabled={generating}
            onClick={() => handleGenerate("EMPLOYEE")} 
            className="px-3.5 py-2 bg-white hover:bg-slate-50 disabled:opacity-50 text-[#111827] border border-slate-200/80 text-xs font-semibold rounded-xl shadow-2xs transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>Directory PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {["ALL", "ATTENDANCE", "LEAVE", "PAYROLL", "EMPLOYEE"].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterType === type 
                  ? "bg-[#111827] text-white shadow-xs" 
                  : "bg-[#F3F4F6] border border-slate-200/80 text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              {type === "ALL" ? "All Telemetry" : type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-xl px-3 py-1.5 w-full sm:w-64 text-xs shadow-2xs focus-within:border-slate-400 transition-colors">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search report archive..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* ClientEase Style Report Archive Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <h2 className="font-bold text-[#111827] text-sm">Archived Executive Reports</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">{filteredReports.length} documents indexed</span>
        </div>

        <div className="grid grid-cols-12 bg-[#FAFAFB] px-6 py-3 text-[11px] font-semibold text-slate-500 border-b border-slate-200/80">
          <div className="col-span-5">Report Document ↓</div>
          <div className="col-span-2">Module Type</div>
          <div className="col-span-3">Generated By & Role</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No report documents found matching criteria. Click the buttons above to generate a new PDF.
          </div>
        ) : (
          <div className="divide-y divide-slate-200/60 text-xs">
            {filteredReports.map((report) => (
              <div key={report.id} className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-slate-50/60 transition-colors group">
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F4F5F7] border border-slate-200/80 flex items-center justify-center text-[#111827] flex-shrink-0 group-hover:bg-[#111827] group-hover:text-white transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111827] leading-none">{report.title}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Created on {new Date(report.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="bg-[#F4F5F7] border border-slate-200/80 px-2.5 py-1 rounded-full text-[10px] font-bold text-[#111827] uppercase tracking-wider">
                    {report.type}
                  </span>
                </div>
                <div className="col-span-3">
                  <p className="font-medium text-slate-700">{report.generatedBy}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">{report.role}</p>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-3 text-slate-400">
                  <button 
                    onClick={() => handleDownloadAgain(report)}
                    className="p-1.5 bg-slate-100 hover:bg-[#111827] hover:text-white rounded-lg text-slate-600 transition-colors flex items-center gap-1 text-[11px] font-semibold px-2.5"
                    title="Download PDF"
                  >
                    <Download className="w-3 h-3" />
                    <span>PDF</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(report.id)}
                    className="p-1.5 hover:text-red-500 rounded-lg transition-colors"
                    title="Delete Archive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
