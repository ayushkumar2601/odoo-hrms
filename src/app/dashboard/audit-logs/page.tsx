import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Activity, ShieldAlert, UserPlus, FileEdit } from "lucide-react";

export default async function AuditLogsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") redirect("/signin");

  const mockLogs = [
    { id: 1, action: "User Login", user: "Ayush Kumar", email: "whokilledayush@gmail.com", time: "2 minutes ago", icon: Activity, color: "blue" },
    { id: 2, action: "Created Employee", user: "System Admin", email: "admin@zyoris.com", time: "1 hour ago", icon: UserPlus, color: "emerald" },
    { id: 3, action: "Modified Policy", user: "System Admin", email: "admin@zyoris.com", time: "5 hours ago", icon: FileEdit, color: "amber" },
    { id: 4, action: "Failed Login Attempt", user: "Unknown IP", email: "-", time: "1 day ago", icon: ShieldAlert, color: "red" },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Audit Logs</h1>
          <p className="text-slate-500 mt-2 font-medium">Track all system activities and security events.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium hover:bg-slate-50 transition-colors">
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <input type="text" placeholder="Search logs..." className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option>All Events</option>
            <option>Security</option>
            <option>Data Modification</option>
          </select>
        </div>
        
        <div className="divide-y divide-slate-100">
          {mockLogs.map((log) => (
            <div key={log.id} className="p-6 flex gap-6 hover:bg-slate-50 transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-${log.color}-50 text-${log.color}-600`}>
                <log.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-slate-900">{log.action}</h3>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{log.time}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="font-medium">{log.user}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{log.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
