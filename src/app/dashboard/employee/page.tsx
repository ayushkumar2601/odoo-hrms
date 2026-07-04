import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  UserCircle, CalendarClock, CalendarDays, Banknote, Bell, 
  Clock, CheckCircle2, AlertCircle, ArrowUpRight, MoreHorizontal 
} from "lucide-react";

export default async function EmployeeDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "EMPLOYEE") redirect("/signin");

  const emp = await prisma.employee.findUnique({ where: { userId: session.user.id } });
  
  const recentLeaves = emp ? await prisma.leaveRequest.findMany({
    where: { employeeId: emp.id },
    orderBy: { createdAt: 'desc' },
    take: 4
  }) : [];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Apple & Linear Style Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Employee Workspace</h1>
          <p className="text-xs text-slate-500 mt-1">Welcome back, {session.user.name}. Your personal telemetry and records.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link 
            href="/dashboard/attendance"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#111827] hover:bg-black text-white rounded-xl shadow-sm text-xs font-semibold transition-all active:scale-95"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Clock In / Out</span>
          </Link>
        </div>
      </div>

      {/* CRM Metric & Quick Access Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link 
          href="/dashboard/profile" 
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all group"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-medium text-slate-500">Personal ID</span>
            <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-[#111827] font-mono">{emp?.employeeId || "EMP-001"}</p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>View Profile</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </p>
          </div>
        </Link>

        <Link 
          href="/dashboard/attendance" 
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all group"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-medium text-slate-500">Attendance Log</span>
            <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-[#111827]">96.8%</p>
            <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full text-[11px] inline-block mt-1">
              On time
            </span>
          </div>
        </Link>

        <Link 
          href="/dashboard/leave" 
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all group"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-medium text-slate-500">Leave Balance</span>
            <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-[#111827]">18 <span className="text-sm font-normal text-slate-400">days</span></p>
            <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full text-[11px] inline-block mt-1">
              Available
            </span>
          </div>
        </Link>

        <Link 
          href="/dashboard/payroll" 
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all group"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-medium text-slate-500">Last Pay Slip</span>
            <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-[#111827]">Disbursed</p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>View Payroll</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </p>
          </div>
        </Link>
      </div>

      {/* ClientEase Style Recent Activity Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-400" />
            <h2 className="font-bold text-[#111827] text-sm">Recent Time-Off Requests</h2>
          </div>
          <Link href="/dashboard/leave" className="text-xs font-semibold text-slate-600 hover:text-[#111827]">Apply for Leave →</Link>
        </div>

        <div className="grid grid-cols-12 bg-[#FAFAFB] px-6 py-3 text-[11px] font-semibold text-slate-500 border-b border-slate-200/80">
          <div className="col-span-5">Leave Type & Dates</div>
          <div className="col-span-4">Submitted On</div>
          <div className="col-span-3 text-right">Approval Status</div>
        </div>

        <div className="divide-y divide-slate-200/60 text-xs">
          {recentLeaves.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No recent leave requests recorded.</div>
          ) : (
            recentLeaves.map((leave) => (
              <div key={leave.id} className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                <div className="col-span-5 font-semibold text-[#111827]">
                  {leave.type} ({leave.startDate.toISOString().split('T')[0]} to {leave.endDate.toISOString().split('T')[0]})
                </div>
                <div className="col-span-4 text-slate-500 font-medium">
                  {leave.createdAt.toISOString().split('T')[0]}
                </div>
                <div className="col-span-3 text-right">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold inline-block ${
                    leave.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                    leave.status === 'REJECTED' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {leave.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}