import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, UserCheck, CalendarDays, Activity, TrendingUp, DollarSign, ShieldCheck } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") redirect("/signin");

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Overview</h1>
          <p className="text-slate-500 mt-2 font-medium">Real-time pulse of your workforce operations.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium hover:bg-slate-50 transition-colors">Generate Report</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-blue-700 transition-colors">Add Employee</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Headcount", value: "142", trend: "+12% this year", icon: Users, color: "blue" },
          { label: "Active Today", value: "128", trend: "94% attendance rate", icon: UserCheck, color: "emerald" },
          { label: "Pending Time Off", value: "7", trend: "Needs approval", icon: CalendarDays, color: "amber" },
          { label: "Monthly Payroll", value: "$424k", trend: "Processed 2 days ago", icon: DollarSign, color: "purple" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</h3>
              <div className={`p-2 bg-${stat.color}-50 text-${stat.color}-600 rounded-lg border border-${stat.color}-100`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-2 font-medium flex items-center gap-1">
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-900 text-lg">Workforce Activity</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-slate-900 font-semibold mb-1">No recent activity</h3>
            <p className="text-slate-500 text-sm max-w-sm">Activity logs will populate here once employees start interacting with the system.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-lg">Action Items</h2>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-slate-900 font-semibold mb-1">Inbox Zero</h3>
            <p className="text-slate-500 text-sm">You are all caught up on approvals.</p>
          </div>
        </div>
      </div>
    </div>
  );
}