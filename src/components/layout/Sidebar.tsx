"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  LayoutDashboard, Users, CalendarClock, CalendarDays, 
  Banknote, UserCircle, Settings, LogOut, Bell, Activity, ShieldCheck, Bot
} from "lucide-react";

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        }
      }
    });
  };

  const adminLinks = [
    { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Directory", href: "/dashboard/employees", icon: Users },
    { name: "Time & Attendance", href: "/dashboard/attendance", icon: CalendarClock },
    { name: "Time Off", href: "/dashboard/leave", icon: CalendarDays },
    { name: "Payroll", href: "/dashboard/payroll", icon: Banknote },
    { name: "AI Copilot", href: "/dashboard/copilot", icon: Bot },
  ];

  const hrLinks = [
    { name: "Overview", href: "/dashboard/hr", icon: LayoutDashboard },
    { name: "Directory", href: "/dashboard/employees", icon: Users },
    { name: "Time & Attendance", href: "/dashboard/attendance", icon: CalendarClock },
    { name: "Time Off", href: "/dashboard/leave", icon: CalendarDays },
    { name: "AI Copilot", href: "/dashboard/copilot", icon: Bot },
  ];

  const employeeLinks = [
    { name: "My Dashboard", href: "/dashboard/employee", icon: LayoutDashboard },
    { name: "My Time", href: "/dashboard/attendance", icon: CalendarClock },
    { name: "My Time Off", href: "/dashboard/leave", icon: CalendarDays },
    { name: "My Pay", href: "/dashboard/payroll", icon: Banknote },
    { name: "AI Copilot", href: "/dashboard/copilot", icon: Bot },
  ];

  const links = role === "ADMIN" ? adminLinks : role === "HR" ? hrLinks : employeeLinks;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen flex flex-col text-slate-300 shadow-xl z-20">
      
      {/* Brand */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800 bg-slate-950">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-inner">
          <ShieldCheck className="text-white w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">Zindle</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Core Modules</p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium group ${
                isActive 
                  ? "bg-blue-600/10 text-blue-500 shadow-sm" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-400"}`} />
              {link.name}
            </Link>
          );
        })}

        <div className="pt-8">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">System</p>
          <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 group">
            <UserCircle className="w-5 h-5 text-slate-500 group-hover:text-slate-400" />
            My Profile
          </Link>
          {role === "ADMIN" && (
            <>
              <Link href="/dashboard/audit-logs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 group">
                <Activity className="w-5 h-5 text-slate-500 group-hover:text-slate-400" />
                Audit Logs
              </Link>
              <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 group">
                <Settings className="w-5 h-5 text-slate-500 group-hover:text-slate-400" />
                Settings
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium group"
        >
          <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}