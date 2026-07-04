const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname);

function write(filePath, content) {
    const fullPath = path.join(PROJECT_ROOT, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim(), 'utf8');
    console.log(`Updated: ${filePath}`);
}

// 1. UPDATE GLOBALS.CSS
write('src/app/globals.css', `
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

:root {
  /* Premium Enterprise Palette */
  --background: oklch(0.985 0 0); /* #F8FAFC */
  --foreground: oklch(0.205 0 0); /* #0F172A */
  --card: oklch(1 0 0); /* #FFFFFF */
  --card-foreground: oklch(0.205 0 0); /* #0F172A */
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.205 0 0);
  --primary: oklch(0.205 0 0); /* #0F172A */
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.269 0 0); /* #1E293B */
  --secondary-foreground: oklch(1 0 0);
  --muted: oklch(0.96 0 0);
  --muted-foreground: oklch(0.556 0 0); /* #64748B */
  --accent: oklch(0.6 0.16 250); /* Royal Blue #3B82F6 approx */
  --accent-foreground: oklch(1 0 0);
  --destructive: oklch(0.577 0.245 27.325); /* #EF4444 */
  --border: oklch(0.922 0 0); /* #E2E8F0 */
  --input: oklch(0.922 0 0);
  --ring: oklch(0.6 0.16 250);
  --radius: 0.5rem;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground font-sans antialiased selection:bg-blue-100;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply tracking-tight text-primary;
  }
}
`);

// 2. DASHBOARD LAYOUT
write('src/app/dashboard/layout.tsx', `
import { Sidebar } from "@/components/layout/Sidebar";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Search, Bell, UserCircle } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    redirect("/signin");
  }

  const role = session.user.role || "EMPLOYEE";

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-96 focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-slate-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-900">{session.user.name}</p>
                <p className="text-xs text-slate-500 font-medium">{role}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold border border-blue-200">
                {session.user.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
`);

// 3. SIDEBAR
write('src/components/layout/Sidebar.tsx', `
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  LayoutDashboard, Users, CalendarClock, CalendarDays, 
  Banknote, UserCircle, Settings, LogOut, Bell, Activity, ShieldCheck
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
  ];

  const hrLinks = [
    { name: "Overview", href: "/dashboard/hr", icon: LayoutDashboard },
    { name: "Directory", href: "/dashboard/employees", icon: Users },
    { name: "Time & Attendance", href: "/dashboard/attendance", icon: CalendarClock },
    { name: "Time Off", href: "/dashboard/leave", icon: CalendarDays },
  ];

  const employeeLinks = [
    { name: "My Dashboard", href: "/dashboard/employee", icon: LayoutDashboard },
    { name: "My Time", href: "/dashboard/attendance", icon: CalendarClock },
    { name: "My Time Off", href: "/dashboard/leave", icon: CalendarDays },
    { name: "My Pay", href: "/dashboard/payroll", icon: Banknote },
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
              className={\`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium group \${
                isActive 
                  ? "bg-blue-600/10 text-blue-500 shadow-sm" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }\`}
            >
              <Icon className={\`w-5 h-5 transition-colors \${isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-400"}\`} />
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
`);

// 4. ADMIN DASHBOARD
write('src/app/dashboard/admin/page.tsx', `
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, UserCheck, CalendarDays, Activity, TrendingUp, DollarSign } from "lucide-react";

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
              <div className={\`p-2 bg-\${stat.color}-50 text-\${stat.color}-600 rounded-lg border border-\${stat.color}-100\`}>
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
`);
