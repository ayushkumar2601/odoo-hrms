import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { UserCircle, CalendarClock, CalendarDays, Banknote, Bell } from "lucide-react";

export default async function EmployeeDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "EMPLOYEE") redirect("/signin");

  const emp = await prisma.employee.findUnique({ where: { userId: session.user.id } });
  
  const recentLeaves = emp ? await prisma.leaveRequest.findMany({
    where: { employeeId: emp.id },
    orderBy: { createdAt: 'desc' },
    take: 3
  }) : [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome, {session.user.name}</p>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/dashboard/profile" className="bg-white p-6 rounded-xl border shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
          <UserCircle className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900">Profile</h3>
          <p className="text-sm text-gray-500 mt-1">View personal details</p>
        </Link>
        <Link href="/dashboard/attendance" className="bg-white p-6 rounded-xl border shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group">
          <CalendarClock className="w-8 h-8 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900">Attendance</h3>
          <p className="text-sm text-gray-500 mt-1">Check-in and logs</p>
        </Link>
        <Link href="/dashboard/leave" className="bg-white p-6 rounded-xl border shadow-sm hover:border-amber-300 hover:shadow-md transition-all group">
          <CalendarDays className="w-8 h-8 text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900">Leave Requests</h3>
          <p className="text-sm text-gray-500 mt-1">Apply for time off</p>
        </Link>
        <Link href="/dashboard/payroll" className="bg-white p-6 rounded-xl border shadow-sm hover:border-purple-300 hover:shadow-md transition-all group">
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
        <div className="p-0">
          <ul className="divide-y">
            {recentLeaves.map(leave => (
              <li key={leave.id} className="p-4 hover:bg-gray-50">
                 <p className="font-medium text-gray-900">Leave Request {leave.status}</p>
                 <p className="text-sm text-gray-500">Your {leave.leaveType.toLowerCase()} leave request for {new Date(leave.startDate).toLocaleDateString()} is currently {leave.status.toLowerCase()}.</p>
              </li>
            ))}
          </ul>
          {recentLeaves.length === 0 && <p className="text-gray-500 text-sm text-center py-8">No recent alerts.</p>}
        </div>
      </div>
    </div>
  );
}