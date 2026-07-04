"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  LayoutDashboard, Users, CalendarClock, CalendarDays, 
  Banknote, UserCircle, Settings, LogOut, Activity, Bot, FileText, TrendingUp,
  Layers
} from "lucide-react";

interface SidebarProps {
  role: string;
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ role, userName = "User", userEmail = "user@zindle.com" }: SidebarProps) {
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
    { name: "Directory", href: "/dashboard/employees", icon: Users, badge: "All" },
    { name: "Time & Attendance", href: "/dashboard/attendance", icon: CalendarClock },
    { name: "Time Off", href: "/dashboard/leave", icon: CalendarDays },
    { name: "Payroll", href: "/dashboard/payroll", icon: Banknote },
    { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "AI Copilot", href: "/dashboard/copilot", icon: Bot, badge: "AI" },
  ];

  const hrLinks = [
    { name: "Overview", href: "/dashboard/hr", icon: LayoutDashboard },
    { name: "Directory", href: "/dashboard/employees", icon: Users },
    { name: "Time & Attendance", href: "/dashboard/attendance", icon: CalendarClock },
    { name: "Time Off", href: "/dashboard/leave", icon: CalendarDays },
    { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "AI Copilot", href: "/dashboard/copilot", icon: Bot, badge: "AI" },
  ];

  const employeeLinks = [
    { name: "My Dashboard", href: "/dashboard/employee", icon: LayoutDashboard },
    { name: "My Time", href: "/dashboard/attendance", icon: CalendarClock },
    { name: "My Time Off", href: "/dashboard/leave", icon: CalendarDays },
    { name: "My Pay", href: "/dashboard/payroll", icon: Banknote },
    { name: "My Reports", href: "/dashboard/reports", icon: FileText },
    { name: "AI Copilot", href: "/dashboard/copilot", icon: Bot, badge: "AI" },
  ];

  const links = role === "ADMIN" ? adminLinks : role === "HR" ? hrLinks : employeeLinks;

  return (
    <aside className="w-64 bg-[#F4F5F7] border-r border-[#E5E7EB] min-h-screen flex flex-col text-[#4B5563] z-20 select-none">
      
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-[#E5E7EB]/60">
        <Link href={`/dashboard/${role.toLowerCase()}`} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-[#111827] rounded-xl flex items-center justify-center text-white shadow-sm group-hover:bg-black transition-colors">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-[#111827]">Zindle</span>
        </Link>
        <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded-full">
          {role}
        </span>
      </div>
      
      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-5 px-3.5 space-y-1">
        <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-1">Core Modules</p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-sm group ${
                isActive 
                  ? "bg-[#E5E7EB] text-[#111827] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.03)]" 
                  : "text-slate-600 hover:bg-slate-200/60 hover:text-[#111827] font-medium"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-[#111827]" : "text-slate-500 group-hover:text-[#111827]"}`} />
                <span>{link.name}</span>
              </div>
              {link.badge && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isActive 
                    ? "bg-white text-[#111827] border border-slate-300/80 shadow-2xs" 
                    : "bg-slate-200/80 text-slate-600 group-hover:bg-white group-hover:border group-hover:border-slate-200"
                }`}>
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-6">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">System & Settings</p>
          <Link 
            href="/dashboard/profile" 
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium group ${
              pathname === "/dashboard/profile"
                ? "bg-[#E5E7EB] text-[#111827] font-semibold"
                : "text-slate-600 hover:bg-slate-200/60 hover:text-[#111827]"
            }`}
          >
            <UserCircle className="w-4 h-4 text-slate-500 group-hover:text-[#111827]" />
            <span>My Profile</span>
          </Link>
          
          {role === "ADMIN" && (
            <>
              <Link 
                href="/dashboard/audit-logs" 
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium group ${
                  pathname === "/dashboard/audit-logs"
                    ? "bg-[#E5E7EB] text-[#111827] font-semibold"
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-[#111827]"
                }`}
              >
                <Activity className="w-4 h-4 text-slate-500 group-hover:text-[#111827]" />
                <span>Audit Logs</span>
              </Link>
              <Link 
                href="/dashboard/settings" 
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium group ${
                  pathname === "/dashboard/settings"
                    ? "bg-[#E5E7EB] text-[#111827] font-semibold"
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-[#111827]"
                }`}
              >
                <Settings className="w-4 h-4 text-slate-500 group-hover:text-[#111827]" />
                <span>Settings</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Bottom User Card (ClientEase CRM Style) */}
      <div className="p-3.5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-[#111827] flex-shrink-0 shadow-2xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-[#111827] truncate">{userName}</p>
                <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-slate-200/80 text-slate-600 transition-all text-xs font-medium group"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500 transition-colors" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}