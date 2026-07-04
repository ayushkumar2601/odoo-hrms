import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Users, CalendarDays } from "lucide-react";

export default async function HRDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "HR") redirect("/signin");

  const totalEmployees = await prisma.employee.count();
  const pendingLeaves = await prisma.leaveRequest.count({
    where: { status: "PENDING" }
  });

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
          <p className="text-3xl font-bold text-gray-900">{totalEmployees} <span className="text-sm font-medium text-gray-500">Active Staff</span></p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><CalendarDays className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingLeaves} <span className="text-sm font-medium text-gray-500">Leaves</span></p>
        </div>
      </div>
    </div>
  );
}