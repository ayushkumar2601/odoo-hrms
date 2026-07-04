import { getMyAttendance, checkIn, checkOut } from "@/actions/attendance";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Clock, CheckCircle2, AlertCircle, Calendar, Play, Square, History } from "lucide-react";

export default async function AttendancePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const emp = await prisma.employee.findUnique({ where: { userId: session.user.id } });
  if (!emp) return <div className="p-8 text-red-500 font-semibold">Employee profile link not established.</div>;

  const logs = await getMyAttendance(emp.id);
  const todayLog = logs.find(l => new Date(l.date).toDateString() === new Date().toDateString());
  const canCheckIn = !todayLog;
  const canCheckOut = todayLog && !todayLog.checkOut;

  const handleCheckIn = async () => {
    "use server";
    await checkIn(emp.id);
  };

  const handleCheckOut = async () => {
    "use server";
    await checkOut(emp.id);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Apple & Linear Style Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Time & Attendance Telemetry</h1>
          <p className="text-xs text-slate-500 mt-1">Daily timestamp logging, shift telemetry, and attendance history</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 text-slate-700 shadow-2xs">
            Employee ID: {emp.employeeId}
          </span>
        </div>
      </div>

      {/* CRM Interactive Clock Box */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#F4F5F7] border border-slate-200/80 flex items-center justify-center text-[#111827]">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${canCheckOut ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
              <h2 className="text-lg font-bold tracking-tight text-[#111827]">
                {canCheckIn ? "Ready to Clock In" : canCheckOut ? "Shift In Progress" : "Shift Completed Today"}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {todayLog?.checkIn 
                ? `Clocked in at ${new Date(todayLog.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
                : "No active timestamp recorded for today."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <form action={handleCheckIn} className="flex-1 md:flex-initial">
            <button 
              disabled={!canCheckIn} 
              className="w-full md:w-auto px-6 py-3 bg-[#111827] hover:bg-black text-white rounded-xl font-semibold text-xs shadow-sm disabled:opacity-40 disabled:hover:bg-[#111827] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Clock In Now</span>
            </button>
          </form>
          <form action={handleCheckOut} className="flex-1 md:flex-initial">
            <button 
              disabled={!canCheckOut} 
              className="w-full md:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-[#111827] border border-slate-200/80 rounded-xl font-semibold text-xs shadow-2xs disabled:opacity-40 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Square className="w-3.5 h-3.5 fill-[#111827]" />
              <span>Clock Out</span>
            </button>
          </form>
        </div>
      </div>

      {/* CRM Style Attendance Log Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <h2 className="font-bold text-[#111827] text-sm">Historical Attendance Logs</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">{logs.length} entries recorded</span>
        </div>

        <div className="grid grid-cols-12 bg-[#FAFAFB] px-6 py-3 text-[11px] font-semibold text-slate-500 border-b border-slate-200/80">
          <div className="col-span-4">Date ↓</div>
          <div className="col-span-3">Check In Time</div>
          <div className="col-span-3">Check Out Time</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        <div className="divide-y divide-slate-200/60 text-xs">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No attendance records found.</div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                <div className="col-span-4 font-semibold text-[#111827] flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(log.date).toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="col-span-3 text-slate-600 font-mono">
                  {log.checkIn ? new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}
                </div>
                <div className="col-span-3 text-slate-600 font-mono">
                  {log.checkOut ? new Date(log.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}
                </div>
                <div className="col-span-2 text-right">
                  <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full text-[11px] border border-emerald-200/50 inline-block">
                    {log.status}
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