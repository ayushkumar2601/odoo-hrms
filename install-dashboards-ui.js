const fs = require('fs');
const path = require('path');

const files = {
  'src/components/layout/Sidebar.tsx': `"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  CalendarClock, 
  CalendarDays, 
  Banknote, 
  UserCircle, 
  Settings, 
  LogOut 
} from "lucide-react";

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const adminLinks = [
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Employees", href: "/employees", icon: Users },
    { name: "Attendance", href: "/attendance", icon: CalendarClock },
    { name: "Leave Management", href: "/leave", icon: CalendarDays },
    { name: "Payroll", href: "/payroll", icon: Banknote },
    { name: "Profile Management", href: "/profile", icon: UserCircle },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const hrLinks = [
    { name: "Dashboard", href: "/dashboard/hr", icon: LayoutDashboard },
    { name: "Employees", href: "/employees", icon: Users },
    { name: "Attendance", href: "/attendance", icon: CalendarClock },
    { name: "Leave", href: "/leave", icon: CalendarDays },
    { name: "Profiles", href: "/profile", icon: UserCircle },
  ];

  const employeeLinks = [
    { name: "Dashboard", href: "/dashboard/employee", icon: LayoutDashboard },
    { name: "Profile", href: "/profile", icon: UserCircle },
    { name: "Attendance", href: "/attendance", icon: CalendarClock },
    { name: "Leave", href: "/leave", icon: CalendarDays },
    { name: "Payroll", href: "/payroll", icon: Banknote },
  ];

  const links = role === "ADMIN" ? adminLinks : role === "HR" ? hrLinks : employeeLinks;

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col shadow-sm text-black">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold tracking-tight text-blue-600">Zindle</h2>
        <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">{role} PORTAL</p>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={\`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium \${
                isActive 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }\`}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t">
        <button 
          onClick={() => {
            // Hardcode logout redirect for now since better-auth signout is client side
            window.location.href = "/login"; 
          }}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}`,

  'src/app/dashboard/layout.tsx': `import { Sidebar } from "@/components/layout/Sidebar";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    redirect("/signin");
  }

  // Determine role safely
  const role = session.user.role || "EMPLOYEE";

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-black">
      <Sidebar role={role} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}`,

  'src/app/dashboard/admin/page.tsx': `import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, UserCheck, CalendarDays, Activity } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") redirect("/signin");

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {session.user.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Employees</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">1</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Present Today</h3>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><UserCheck className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Pending Leaves</h3>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><CalendarDays className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Recent Activity</h3>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Activity className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">2</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-gray-50/50">
            <h2 className="font-semibold text-gray-900">Recent Employee Activity</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-sm text-center py-8">No recent activity found.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-gray-50/50">
            <h2 className="font-semibold text-gray-900">Pending Actions</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-sm text-center py-8">You're all caught up!</p>
          </div>
        </div>
      </div>
    </div>
  );
}`,

  'src/app/dashboard/hr/page.tsx': `import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, CalendarDays } from "lucide-react";

export default async function HRDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "HR") redirect("/signin");

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage personnel and approvals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Employee Overview</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">Active Staff</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><CalendarDays className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">0 Leaves</p>
        </div>
      </div>
    </div>
  );
}`,

  'src/app/dashboard/employee/page.tsx': `import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserCircle, CalendarClock, CalendarDays, Banknote, Bell } from "lucide-react";

export default async function EmployeeDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "EMPLOYEE") redirect("/signin");

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome, {session.user.name}</p>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/profile" className="bg-white p-6 rounded-xl border shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
          <UserCircle className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900">Profile</h3>
          <p className="text-sm text-gray-500 mt-1">View personal details</p>
        </Link>
        <Link href="/attendance" className="bg-white p-6 rounded-xl border shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group">
          <CalendarClock className="w-8 h-8 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900">Attendance</h3>
          <p className="text-sm text-gray-500 mt-1">Check-in and logs</p>
        </Link>
        <Link href="/leave" className="bg-white p-6 rounded-xl border shadow-sm hover:border-amber-300 hover:shadow-md transition-all group">
          <CalendarDays className="w-8 h-8 text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900">Leave Requests</h3>
          <p className="text-sm text-gray-500 mt-1">Apply for time off</p>
        </Link>
        <Link href="/payroll" className="bg-white p-6 rounded-xl border shadow-sm hover:border-purple-300 hover:shadow-md transition-all group">
          <Banknote className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900">Payroll</h3>
          <p className="text-sm text-gray-500 mt-1">View salary slips</p>
        </Link>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-gray-50/50 flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold text-gray-900">Recent Alerts & Activity</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-sm text-center py-8">No new alerts.</p>
        </div>
      </div>
    </div>
  );
}`
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
  console.log('Created:', filePath);
});
