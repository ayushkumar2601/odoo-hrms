import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Users, UserCheck, CalendarDays, DollarSign, 
  Search, Filter, X, CheckSquare, Square, Trash2, MoreHorizontal, ArrowUpRight, Plus, Upload
} from "lucide-react";

import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") redirect("/signin");

  const employeeCount = await prisma.employee.count();
  const activeCount = Math.max(1, Math.round(employeeCount * 0.9));
  const employees = await prisma.employee.findMany({
    take: 6,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Apple & Linear Style CRM Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Workforce Overview</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time enterprise metrics and personnel directory</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link 
            href="/dashboard/reports"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl shadow-2xs text-xs font-semibold text-slate-700 transition-all active:scale-95"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Report</span>
          </Link>
          <Link 
            href="/dashboard/employees"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#111827] hover:bg-black text-white rounded-xl shadow-sm text-xs font-semibold transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Employee</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-6 border-b border-[#E5E7EB] text-xs font-semibold text-slate-500">
        <span className="pb-3 text-[#111827] border-b-2 border-[#111827] cursor-pointer">Overview</span>
        <Link href="/dashboard/employees" className="pb-3 hover:text-[#111827] transition-colors">Directory</Link>
        <Link href="/dashboard/attendance" className="pb-3 hover:text-[#111827] transition-colors">Attendance</Link>
        <Link href="/dashboard/leave" className="pb-3 hover:text-[#111827] transition-colors">Time Off</Link>
        <Link href="/dashboard/payroll" className="pb-3 hover:text-[#111827] transition-colors">Payroll</Link>
        <Link href="/dashboard/analytics" className="pb-3 hover:text-[#111827] transition-colors">Analytics</Link>
      </div>

      {/* ClientEase Style 4 Metric Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-medium text-slate-500">Total Headcount</span>
            <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold tracking-tight text-[#111827]">{employeeCount}</p>
            <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full text-[11px] flex items-center gap-0.5">
              ↑ 12%
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-medium text-slate-500">Active Today</span>
            <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold tracking-tight text-[#111827]">{activeCount}</p>
            <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full text-[11px] flex items-center gap-0.5">
              ↑ 94%
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-medium text-slate-500">Pending Time Off</span>
            <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold tracking-tight text-[#111827]">7</p>
            <span className="bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">
              Action req.
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-medium text-slate-500">Monthly Payroll</span>
            <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold tracking-tight text-[#111827]">$424k</p>
            <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">
              Disbursed
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar (Exact ClientEase Style) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-[#F3F4F6] border border-slate-200/80 text-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-slate-200/60 transition-colors">
            <span>All departments</span>
            <X className="w-3 h-3 text-slate-400" />
          </div>
          <div className="bg-[#F3F4F6] border border-slate-200/80 text-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-slate-200/60 transition-colors">
            <span>Active status</span>
            <X className="w-3 h-3 text-slate-400" />
          </div>
          <div className="bg-white border border-slate-200/80 text-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 transition-colors shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>More filters</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-xl px-3 py-1.5 w-full sm:w-64 text-xs shadow-2xs focus-within:border-slate-400 transition-colors">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search employee directory..." 
            className="bg-transparent border-none outline-none w-full text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* ClientEase Signature Embedded CRM Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-12 bg-[#FAFAFB] px-6 py-3 text-[11px] font-semibold text-slate-500 border-b border-slate-200/80">
          <div className="col-span-1 flex items-center">
            <CheckSquare className="w-4 h-4 text-[#111827] cursor-pointer" />
          </div>
          <div className="col-span-4">Employee ↓</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Role & Department</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-slate-200/60 text-xs">
          {employees.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No employee records found. Add an employee to populate the directory.</div>
          ) : (
            employees.map((emp, idx) => (
              <div key={emp.id} className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-slate-50/60 transition-colors group">
                <div className="col-span-1 flex items-center">
                  {idx === 0 ? (
                    <CheckSquare className="w-4 h-4 text-[#111827] cursor-pointer" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-400 cursor-pointer" />
                  )}
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-[#111827] flex-shrink-0">
                    {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#111827] leading-none">{emp.firstName} {emp.lastName}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{emp.email}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full text-[11px] border border-emerald-200/50 inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Active
                  </span>
                </div>
                <div className="col-span-3">
                  <p className="font-medium text-slate-700">{emp.designation || "Staff Member"}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{emp.department || "General"}</p>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-3 text-slate-400">
                  <Trash2 className="w-4 h-4 hover:text-red-500 cursor-pointer transition-colors" />
                  <MoreHorizontal className="w-4 h-4 hover:text-slate-700 cursor-pointer transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Minimalist Pagination Bar */}
        <div className="px-6 py-3.5 bg-[#FAFAFB] border-t border-slate-200/80 flex items-center justify-between text-xs font-medium text-slate-600">
          <button className="px-3.5 py-1.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs hover:bg-slate-50 disabled:opacity-50 transition-all">
            Previous
          </button>
          <span className="text-slate-500 font-semibold">Page 1 of 1</span>
          <button className="px-3.5 py-1.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs hover:bg-slate-50 disabled:opacity-50 transition-all">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}