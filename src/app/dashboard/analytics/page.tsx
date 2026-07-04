"use client";

import { useState, useEffect } from "react";
import { Users, CalendarClock, CalendarDays, Banknote, Loader2, TrendingUp, ShieldAlert } from "lucide-react";

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
      <div className="h-[70vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-sm font-medium">Computing role-aware workforce analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-12 text-center text-slate-500">
        <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-rose-500" />
        <p>Failed to load workforce analytics data.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workforce Intelligence & Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time organizational insights powered by Zindle AI Copilot.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl text-xs font-semibold text-blue-400 border border-slate-700">
          <TrendingUp className="w-4 h-4" />
          <span>Live Metrics</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Workforce Card */}
        {data.workforce && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Active Workforce</span>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-slate-900">{data.workforce.totalActiveEmployees}</h3>
              <p className="text-xs text-slate-500 mt-1">{data.workforce.summary}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              {data.workforce.departmentDistribution.map(d => (
                <div key={d.department} className="flex justify-between text-xs font-medium text-slate-600">
                  <span>{d.department}</span>
                  <span className="font-bold text-slate-900">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attendance Card */}
        {data.attendance && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Attendance Rate</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CalendarClock className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-slate-900">{data.attendance.overallAttendanceRate}</h3>
              <p className="text-xs text-slate-500 mt-1">{data.attendance.summary}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs font-medium text-slate-600">
              <div className="flex justify-between"><span>Present</span> <span className="text-emerald-600 font-bold">{data.attendance.present}</span></div>
              <div className="flex justify-between"><span>Absent</span> <span className="text-rose-600 font-bold">{data.attendance.absent}</span></div>
              <div className="flex justify-between"><span>On Leave</span> <span className="text-amber-600 font-bold">{data.attendance.onLeave}</span></div>
            </div>
          </div>
        )}

        {/* Leave Card */}
        {data.leave && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Pending Leaves</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <CalendarDays className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-slate-900">{data.leave.pendingApprovals}</h3>
              <p className="text-xs text-slate-500 mt-1">{data.leave.summary}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs font-medium text-slate-600">
              <div className="flex justify-between"><span>Approved Total</span> <span className="text-slate-900 font-bold">{data.leave.approvedTotal}</span></div>
              {data.leave.leaveTypesDistribution.map(l => (
                <div key={l.type} className="flex justify-between">
                  <span>{l.type}</span>
                  <span className="font-bold text-slate-900">{l.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payroll Card (Admin Only) */}
        {data.payroll && typeof data.payroll !== "string" ? (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Payroll Expense</span>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Banknote className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-slate-900">${data.payroll.totalMonthlyExpenditure.toLocaleString()}</h3>
              <p className="text-xs text-slate-500 mt-1">{data.payroll.summary}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-xs font-medium text-slate-600 flex justify-between">
              <span>Avg Net Salary</span>
              <span className="font-bold text-slate-900">${data.payroll.averageEmployeeNetSalary.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-2">
            <ShieldAlert className="w-8 h-8 text-slate-400" />
            <h4 className="text-xs font-bold uppercase text-slate-500">Restricted Metric</h4>
            <p className="text-xs text-slate-400">Payroll analytics require executive Admin RBAC permissions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
