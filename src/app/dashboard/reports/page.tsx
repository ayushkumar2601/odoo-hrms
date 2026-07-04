"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Trash2, Plus, Search, Loader2, Filter } from "lucide-react";
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
    } catch (e: unknown) {
      console.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">AI Report Center</h1>
          <p className="text-slate-400 text-sm mt-1">Generate, manage, and download Zindle workforce PDF reports securely.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            disabled={generating}
            onClick={() => handleGenerate("ATTENDANCE")} 
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Attendance PDF
          </button>
          <button 
            disabled={generating}
            onClick={() => handleGenerate("LEAVE")} 
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Leave PDF
          </button>
          <button 
            disabled={generating}
            onClick={() => handleGenerate("EMPLOYEE")} 
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Directory PDF
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search reports by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Filter:</span>
          {["ALL", "ATTENDANCE", "LEAVE", "PAYROLL", "EMPLOYEE"].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                filterType === type ? "bg-slate-900 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading || generating ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-sm font-medium">{generating ? "Generating branded PDF report..." : "Loading reports history..."}</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h3 className="text-base font-semibold text-slate-700 mb-1">No reports found</h3>
            <p className="text-xs">Click one of the buttons above or ask AI Copilot to generate your first PDF report!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Report Title</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Generated By</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span>{report.title}</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md">
                        {report.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{report.generatedBy}</td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-0.5 text-[11px] font-bold uppercase bg-blue-50 text-blue-700 rounded border border-blue-200/50">
                        {report.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-xs">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleDownloadAgain(report)}
                        className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors inline-flex items-center justify-center"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
