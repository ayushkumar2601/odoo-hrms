const fs = require('fs');
const path = require('path');

const files = {
  'src/app/dashboard/employee/page.tsx': `import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function EmployeeDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "EMPLOYEE") redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Employee Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <a href="/profile" className="bg-white p-6 rounded-xl shadow-sm border text-center hover:bg-gray-50">Profile</a>
          <a href="/attendance" className="bg-white p-6 rounded-xl shadow-sm border text-center hover:bg-gray-50">Attendance</a>
          <a href="/leave/apply" className="bg-white p-6 rounded-xl shadow-sm border text-center hover:bg-gray-50">Leave Requests</a>
          <a href="/payroll" className="bg-white p-6 rounded-xl shadow-sm border text-center hover:bg-gray-50">Payroll</a>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-500">No recent activity.</p>
        </div>
      </div>
    </div>
  );
}`,

  'src/app/profile/page.tsx': `import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { employee: true }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="font-semibold">{user?.name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-semibold">{user?.email}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Role</p>
            <p className="font-semibold">{user?.role}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Joining Date</p>
            <p className="font-semibold">{user?.employee?.joiningDate?.toLocaleDateString() || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}`,

  'src/app/payroll/page.tsx': `import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function PayrollPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Payroll</h1>
        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <p className="text-gray-500">Your payroll records will appear here.</p>
        </div>
      </div>
    </div>
  );
}`,

  'src/app/leave/manage/page.tsx': `import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function LeaveManagePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role === "EMPLOYEE") redirect("/login");

  const requests = await prisma.leaveRequest.findMany({
    include: { employee: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Leave Approvals</h1>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Employee</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">No leave requests found.</td></tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id} className="border-b">
                    <td className="p-4">{req.employee.firstName} {req.employee.lastName}</td>
                    <td className="p-4">{req.leaveType}</td>
                    <td className="p-4 font-semibold">{req.status}</td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:underline">Review</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created:', filePath);
}
