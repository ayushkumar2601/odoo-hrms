import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Users, UserCheck, CalendarDays, Activity } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") redirect("/signin");

  // Fetch live stats
  const totalEmployees = await prisma.employee.count();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const presentToday = await prisma.attendance.count({
    where: { date: { gte: today }, status: "PRESENT" }
  });

  const pendingLeaves = await prisma.leaveRequest.count({
    where: { status: "PENDING" }
  });

  const recentEmployees = await prisma.employee.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

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
          <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Present Today</h3>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><UserCheck className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{presentToday}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Pending Leaves</h3>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><CalendarDays className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingLeaves}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Recent Activity</h3>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Activity className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">Live</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-gray-50/50">
            <h2 className="font-semibold text-gray-900">Recently Added Employees</h2>
          </div>
          <div className="p-0">
            <ul className="divide-y">
              {recentEmployees.map(emp => (
                <li key={emp.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                   <div>
                     <p className="font-medium text-gray-900">{emp.firstName} {emp.lastName}</p>
                     <p className="text-sm text-gray-500">{emp.email}</p>
                   </div>
                   <span className="text-xs bg-gray-100 px-2 py-1 rounded font-semibold">{emp.employeeId}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-gray-50/50">
            <h2 className="font-semibold text-gray-900">Pending Actions</h2>
          </div>
          <div className="p-6">
            {pendingLeaves > 0 ? (
              <p className="text-amber-600 text-sm text-center py-8 font-medium">You have {pendingLeaves} leave requests to review.</p>
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">You're all caught up!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}