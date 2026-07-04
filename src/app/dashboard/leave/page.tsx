import { applyLeave, updateLeaveStatus } from "@/actions/leave";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CalendarDays, Check, X as CloseIcon, Plus, Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";

export default async function LeavePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const emp = await prisma.employee.findUnique({ where: { userId: session.user.id } });
  if (!emp) return <div className="p-8 text-red-500 font-semibold">Employee record not found.</div>;

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "HR";
  
  const leaves = await prisma.leaveRequest.findMany({
    where: isAdmin ? {} : { employeeId: emp.id },
    include: { employee: true },
    orderBy: { createdAt: 'desc' }
  });

  const handleApply = async (formData: FormData) => {
    "use server";
    await applyLeave(emp.id, formData);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Apple & Linear Style Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
            {isAdmin ? "Time-Off & Leave Approvals" : "My Leave Applications"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin ? "Review employee time-off requests, manage balances, and approve schedules" : "Submit time-off requests and track approval statuses"}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 text-slate-700 shadow-2xs">
            Total Requests: {leaves.length}
          </span>
        </div>
      </div>

      {/* CRM Leave Balances Box (For Employee / All) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-medium text-slate-500">Paid Time Off (PTO)</span>
            <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">Active</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold tracking-tight text-[#111827]">12 <span className="text-sm font-normal text-slate-400">days left</span></p>
            <span className="text-xs text-slate-400 font-medium">18 total</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-medium text-slate-500">Sick Leave Allowance</span>
            <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">Medical</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold tracking-tight text-[#111827]">6 <span className="text-sm font-normal text-slate-400">days left</span></p>
            <span className="text-xs text-slate-400 font-medium">10 total</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-medium text-slate-500">Unpaid / Casual Leave</span>
            <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">On demand</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold tracking-tight text-[#111827]">Unlimited</p>
            <span className="text-xs text-slate-400 font-medium">Subject to approval</span>
          </div>
        </div>
      </div>

      {/* Apply for Leave Card (Sleek Apple Minimalist Box) */}
      {!isAdmin && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#111827] text-white flex items-center justify-center shadow-sm">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-[#111827] text-sm">Submit New Time-Off Request</h2>
                <p className="text-[11px] text-slate-500">Requests are routed to HR Manager and Admin for immediate review</p>
              </div>
            </div>
          </div>

          <form action={handleApply} className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            <div className="md:col-span-1">
              <select 
                name="leaveType" 
                className="w-full bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs font-medium text-[#111827] focus:bg-white focus:border-slate-400 outline-none transition-all" 
                required
              >
                <option value="PAID">Type: Paid Leave</option>
                <option value="SICK">Type: Sick Leave</option>
                <option value="UNPAID">Type: Unpaid Leave</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <input 
                name="startDate" 
                type="date" 
                className="w-full bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs font-medium text-[#111827] focus:bg-white focus:border-slate-400 outline-none transition-all" 
                required 
              />
            </div>
            <div className="md:col-span-1">
              <input 
                name="endDate" 
                type="date" 
                className="w-full bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs font-medium text-[#111827] focus:bg-white focus:border-slate-400 outline-none transition-all" 
                required 
              />
            </div>
            <div className="md:col-span-1">
              <input 
                name="remarks" 
                placeholder="Reason or Remarks..." 
                className="w-full bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs font-medium text-[#111827] placeholder:text-slate-400 focus:bg-white focus:border-slate-400 outline-none transition-all" 
                required 
              />
            </div>
            <div className="md:col-span-1">
              <button 
                type="submit" 
                className="w-full bg-[#111827] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Submit Request</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CRM Style Leave Applications Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <h2 className="font-bold text-[#111827] text-sm">Application History & Approvals</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Sorted by submission date</span>
        </div>

        <div className="grid grid-cols-12 bg-[#FAFAFB] px-6 py-3 text-[11px] font-semibold text-slate-500 border-b border-slate-200/80">
          {isAdmin && <div className="col-span-3">Employee ↓</div>}
          <div className={isAdmin ? "col-span-2" : "col-span-3"}>Leave Type</div>
          <div className={isAdmin ? "col-span-3" : "col-span-4"}>Date Range</div>
          <div className="col-span-2">Status</div>
          <div className={isAdmin ? "col-span-2 text-right" : "col-span-3 text-right"}>{isAdmin ? "HR Action" : "Remarks"}</div>
        </div>

        <div className="divide-y divide-slate-200/60 text-xs">
          {leaves.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No time-off requests found.</div>
          ) : (
            leaves.map((l) => (
              <div key={l.id} className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                {isAdmin && (
                  <div className="col-span-3 flex items-center gap-2.5 font-semibold text-[#111827]">
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs">
                      {l.employee.firstName.charAt(0)}{l.employee.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="leading-none">{l.employee.firstName} {l.employee.lastName}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{l.employee.employeeId}</p>
                    </div>
                  </div>
                )}
                <div className={isAdmin ? "col-span-2 font-semibold text-slate-700" : "col-span-3 font-semibold text-slate-700"}>
                  <span className="bg-[#F4F5F7] border border-slate-200/80 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-[#111827]">
                    {l.type}
                  </span>
                </div>
                <div className={isAdmin ? "col-span-3 text-slate-600 font-mono" : "col-span-4 text-slate-600 font-mono"}>
                  {l.startDate.toISOString().split('T')[0]} to {l.endDate.toISOString().split('T')[0]}
                </div>
                <div className="col-span-2">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 border ${
                    l.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
                    l.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200/50' : 
                    'bg-amber-50 text-amber-700 border-amber-200/50'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      l.status === 'APPROVED' ? 'bg-emerald-500' :
                      l.status === 'REJECTED' ? 'bg-red-500' : 'bg-amber-500 animate-pulse'
                    }`}></span>
                    {l.status}
                  </span>
                </div>
                <div className={isAdmin ? "col-span-2 flex items-center justify-end gap-2" : "col-span-3 text-right text-slate-500 truncate"}>
                  {isAdmin && l.status === "PENDING" ? (
                    <div className="flex items-center gap-1.5">
                      <form action={async () => { "use server"; await updateLeaveStatus(l.id, "APPROVED"); }}>
                        <button className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200/60 transition-colors" title="Approve">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </form>
                      <form action={async () => { "use server"; await updateLeaveStatus(l.id, "REJECTED"); }}>
                        <button className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200/60 transition-colors" title="Reject">
                          <CloseIcon className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  ) : isAdmin ? (
                    <span className="text-[11px] text-slate-400 font-medium">Processed</span>
                  ) : (
                    <span>{l.remarks || "No remarks"}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}