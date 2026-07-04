import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserCircle } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const emp = await prisma.employee.findUnique({ where: { userId: session.user.id } });
  
  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
          Edit Profile
        </button>
      </div>
      
      <div className="bg-white p-8 rounded-xl border shadow-sm flex flex-col md:flex-row gap-8 items-start">
        <div className="p-4 bg-gray-50 rounded-full">
          <UserCircle className="w-32 h-32 text-gray-400" />
        </div>
        
        <div className="flex-1 w-full grid grid-cols-2 gap-y-6">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-semibold text-lg">{session.user.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="font-semibold text-lg">{session.user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">System Role</p>
            <p className="font-semibold text-lg">{session.user.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Employee ID</p>
            <p className="font-semibold text-lg">{emp?.employeeId || "Unassigned"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Joining Date</p>
            <p className="font-semibold text-lg">{emp?.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : "Unknown"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Status</p>
            <p className="font-semibold text-lg text-emerald-600">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}