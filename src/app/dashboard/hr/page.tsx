import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Users, CalendarDays, UserCheck, Clock, 
  MoreHorizontal, ArrowUpRight, CheckSquare, Square, Trash2, Plus
} from "lucide-react";

export default async function HRDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "HR") redirect("/signin");

  const totalEmployees = await prisma.employee.count();
  const pendingLeaves = await prisma.leaveRequest.count({
    where: { status: "PENDING" }
  });
  const recentLeaves = await prisma.leaveRequest.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { employee: true }
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Apple & Linear Style Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">HR Operations Portal</h1>
          <p className="text-xs text-slate-500 mt-1">Personnel management, time-off approvals, and daily telemetry</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link 
            href="/dashboard/employees"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#111827] hover:bg-black text-white rounded-xl shadow-sm text-xs font-semibold transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard Staff</span>
          </Link>
        </div>
      </div>

      {/* CRM Metric Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-medium text-slate-500">Active Staff Headcount</span>
            <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold tracking-tight text-[#111827]">{totalEmployees}</p>
            <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">
              ↑ 100%
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-medium text-slate-500">Pending Leave Requests</span>
            <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold tracking-tight text-[#111827]">{pendingLeaves}</p>
            <span className="bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">
              Needs review
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-medium text-slate-500">Daily Attendance Rate</span>
            <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold tracking-tight text-[#111827]">94%</p>
            <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">
              Optimal
            </span>
          </div>
        </div>
      </div>

      {/* Recent Leaves Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-[#111827] text-sm">Recent Time-Off Applications</h2>
          <Link href="/dashboard/leave" className="text-xs font-semibold text-slate-600 hover:text-[#111827]">View All Approvals →</Link>
        </div>

        <div className="grid grid-cols-12 bg-[#FAFAFB] px-6 py-3 text-[11px] font-semibold text-slate-500 border-b border-slate-200/80">
          <div className="col-span-4">Employee & ID</div>
          <div className="col-span-3">Type & Dates</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y divide-slate-200/60 text-xs">
          {recentLeaves.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No recent leave applications.</div>
          ) : (
            recentLeaves.map((l) => (
              <div key={l.id} className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                <div className="col-span-4 flex items-center gap-2.5 font-semibold text-[#111827]">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs">
                    {l.employee.firstName.charAt(0)}
                  </div>
                  <span>{l.employee.firstName} {l.employee.lastName}</span>
                </div>
                <div className="col-span-3 text-slate-600 font-medium">
                  {l.type} ({l.startDate.toISOString().split('T')[0]})
                </div>
                <div className="col-span-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    l.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                    l.status === 'REJECTED' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {l.status}
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <Link href="/dashboard/leave" className="text-xs font-semibold text-blue-600 hover:underline">Review</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}