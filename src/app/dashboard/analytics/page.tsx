"use client";

import { useState, useEffect } from "react";
import { Users, CalendarClock, CalendarDays, Banknote, Loader2, TrendingUp, ShieldAlert, MoreHorizontal, ArrowUpRight } from "lucide-react";

interface AnalyticsData {
  workforce?: {
    totalActiveEmployees: number;
    departmentDistribution: { department: string; count: number }[];
    summary: string;
  };
  attendance?: {
    overallAttendanceRate: string;
    present: number;
    absent: number;
    onLeave: number;
    summary: string;
  };
  leave?: {
    pendingApprovals: number;
    approvedTotal: number;
    leaveTypesDistribution: { type: string; count: number }[];
    summary: string;
  };
  payroll?: {
    totalMonthlyExpenditure: number;
    averageEmployeeNetSalary: number;
    summary: string;
  } | string;
}

export default function AnalyticsDashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        if (res.ok) setData(json);
      } catch {
        console.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 text-[#111827] animate-spin mb-4" />
        <p className="text-xs font-semibold uppercase tracking-wider">Synthesizing telemetry data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <ShieldAlert className="w-10 h-10 mx-auto mb-3 text-rose-500" />
        <p className="text-sm font-semibold text-[#111827]">Analytics Stream Interrupted</p>
        <p className="text-xs text-slate-400 mt-1">Failed to establish connection with AI analytics endpoint.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Apple & Linear Style Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Workforce Intelligence & Telemetry</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time organizational insights, shift distribution, and payroll analytics</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 text-slate-700 shadow-2xs flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>AI Copilot Synthesizer Active</span>
          </span>
        </div>
      </div>

      {/* Metric Cards Grid (Exact ClientEase Box Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Workforce Card */}
        {data.workforce && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-medium text-slate-500">Active Workforce</span>
                <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-3xl font-bold tracking-tight text-[#111827]">{data.workforce.totalActiveEmployees}</p>
                <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">Active</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{data.workforce.summary}</p>
            </div>
            
            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              {data.workforce.departmentDistribution.map(d => (
                <div key={d.department} className="flex justify-between text-xs font-medium text-slate-600">
                  <span className="truncate">{d.department || "General"}</span>
                  <span className="font-mono font-bold text-[#111827]">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attendance Card */}
        {data.attendance && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-medium text-slate-500">Attendance Rate</span>
                <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-3xl font-bold tracking-tight text-[#111827]">{data.attendance.overallAttendanceRate}</p>
                <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">Optimal</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{data.attendance.summary}</p>
            </div>
            
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs font-medium text-slate-600">
              <div className="flex justify-between"><span>Present</span> <span className="text-emerald-600 font-mono font-bold">{data.attendance.present}</span></div>
              <div className="flex justify-between"><span>Absent</span> <span className="text-red-500 font-mono font-bold">{data.attendance.absent}</span></div>
              <div className="flex justify-between"><span>On Leave</span> <span className="text-amber-600 font-mono font-bold">{data.attendance.onLeave}</span></div>
            </div>
          </div>
        )}

        {/* Leave Card */}
        {data.leave && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-medium text-slate-500">Pending Approvals</span>
                <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-3xl font-bold tracking-tight text-[#111827]">{data.leave.pendingApprovals}</p>
                <span className="bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">Review req.</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{data.leave.summary}</p>
            </div>
            
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs font-medium text-slate-600">
              <div className="flex justify-between"><span>Approved Total</span> <span className="font-mono font-bold text-[#111827]">{data.leave.approvedTotal}</span></div>
              {data.leave.leaveTypesDistribution.map(l => (
                <div key={l.type} className="flex justify-between">
                  <span>{l.type}</span>
                  <span className="font-mono font-bold text-[#111827]">{l.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payroll Card (Admin Only) */}
        {data.payroll && typeof data.payroll !== "string" ? (
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-medium text-slate-500">Payroll Expenditure</span>
                <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-3xl font-bold tracking-tight text-[#111827]">${data.payroll.totalMonthlyExpenditure.toLocaleString()}</p>
                <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">Disbursed</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{data.payroll.summary}</p>
            </div>
            
            <div className="pt-3 border-t border-slate-100 text-xs font-medium text-slate-600 flex justify-between items-center">
              <span>Avg Employee Net</span>
              <span className="font-mono font-bold text-[#111827]">${data.payroll.averageEmployeeNetSalary.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="bg-[#FAFAFB] p-5 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-2">
            <ShieldAlert className="w-6 h-6 text-slate-400" />
            <h4 className="text-xs font-bold uppercase text-slate-500">Restricted Telemetry</h4>
            <p className="text-[11px] text-slate-400">Payroll expenditure analytics require Admin RBAC elevation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
