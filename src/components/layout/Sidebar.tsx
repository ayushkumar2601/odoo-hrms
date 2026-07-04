"use client";
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
    { name: "Employees", href: "/dashboard/employees", icon: Users },
    { name: "Attendance", href: "/dashboard/attendance", icon: CalendarClock },
    { name: "Leave Management", href: "/dashboard/leave", icon: CalendarDays },
    { name: "Payroll", href: "/dashboard/payroll", icon: Banknote },
    { name: "Profile Management", href: "/dashboard/profile", icon: UserCircle },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const hrLinks = [
    { name: "Dashboard", href: "/dashboard/hr", icon: LayoutDashboard },
    { name: "Employees", href: "/dashboard/employees", icon: Users },
    { name: "Attendance", href: "/dashboard/attendance", icon: CalendarClock },
    { name: "Leave", href: "/dashboard/leave", icon: CalendarDays },
    { name: "Profiles", href: "/dashboard/profile", icon: UserCircle },
  ];

  const employeeLinks = [
    { name: "Dashboard", href: "/dashboard/employee", icon: LayoutDashboard },
    { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
    { name: "Attendance", href: "/dashboard/attendance", icon: CalendarClock },
    { name: "Leave", href: "/dashboard/leave", icon: CalendarDays },
    { name: "Payroll", href: "/dashboard/payroll", icon: Banknote },
  ];

  const links = role === "ADMIN" ? adminLinks : role === "HR" ? hrLinks : employeeLinks;

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col shadow-sm text-black">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold tracking-tight text-blue-600">Zyoris</h2>
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                isActive 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
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
}