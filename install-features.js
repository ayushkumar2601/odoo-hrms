const fs = require('fs');
const path = require('path');

const files = {
  // --- SERVER ACTIONS ---
  'src/actions/employee.ts': `"use server";
import { prisma } from "@/lib/prisma";
import { generateEmployeeId } from "@/lib/id-generator";
import { revalidatePath } from "next/cache";

export async function createEmployee(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  if (!firstName || !lastName || !email || !role) throw new Error("Missing fields");

  const empId = await generateEmployeeId();

  await prisma.employee.create({
    data: {
      employeeId: empId,
      firstName,
      lastName,
      email,
      role,
      joiningDate: new Date(),
      isActive: true,
    }
  });

  revalidatePath("/employees");
}

export async function getEmployees() {
  return await prisma.employee.findMany({ orderBy: { createdAt: 'desc' } });
}`,

  'src/actions/attendance.ts': `"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function checkIn(employeeId: string) {
  const today = new Date();
  today.setHours(0,0,0,0);

  // Check if already checked in today
  const existing = await prisma.attendance.findFirst({
    where: { employeeId, date: { gte: today } }
  });

  if (existing) throw new Error("Already checked in today.");

  await prisma.attendance.create({
    data: {
      employeeId,
      date: new Date(),
      checkIn: new Date(),
      status: "PRESENT"
    }
  });

  revalidatePath("/attendance");
}

export async function checkOut(employeeId: string) {
  const today = new Date();
  today.setHours(0,0,0,0);

  const existing = await prisma.attendance.findFirst({
    where: { employeeId, date: { gte: today } },
    orderBy: { createdAt: 'desc' }
  });

  if (!existing || existing.checkOut) throw new Error("Cannot check out.");

  await prisma.attendance.update({
    where: { id: existing.id },
    data: { checkOut: new Date() }
  });

  revalidatePath("/attendance");
}

export async function getMyAttendance(employeeId: string) {
  return await prisma.attendance.findMany({
    where: { employeeId },
    orderBy: { date: 'desc' }
  });
}`,

  'src/actions/leave.ts': `"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function applyLeave(employeeId: string, formData: FormData) {
  const leaveType = formData.get("leaveType") as string;
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = new Date(formData.get("endDate") as string);
  const remarks = formData.get("remarks") as string;

  await prisma.leaveRequest.create({
    data: {
      employeeId,
      leaveType,
      startDate,
      endDate,
      remarks,
      status: "PENDING"
    }
  });

  revalidatePath("/leave");
}

export async function updateLeaveStatus(id: string, status: string) {
  await prisma.leaveRequest.update({
    where: { id },
    data: { status }
  });
  revalidatePath("/leave");
}`,

  // --- PAGES ---
  'src/app/employees/page.tsx': `import { getEmployees, createEmployee } from "@/actions/employee";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function EmployeesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "HR")) redirect("/signin");

  const employees = await getEmployees();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Manage Employees</h1>
      
      <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
        <h2 className="font-semibold text-lg mb-4">Register New Employee</h2>
        <form action={createEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="firstName" placeholder="First Name" className="border p-2 rounded" required />
          <input name="lastName" placeholder="Last Name" className="border p-2 rounded" required />
          <input name="email" type="email" placeholder="Email" className="border p-2 rounded" required />
          <select name="role" className="border p-2 rounded" required>
            <option value="EMPLOYEE">Employee</option>
            <option value="HR">HR</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700 md:col-span-2">Create Employee</button>
        </form>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">EMP ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="border-b">
                <td className="p-4 font-mono font-medium">{emp.employeeId}</td>
                <td className="p-4">{emp.firstName} {emp.lastName}</td>
                <td className="p-4">{emp.email}</td>
                <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold">{emp.role}</span></td>
                <td className="p-4">
                  <span className={\`px-2 py-1 rounded text-xs font-semibold \${emp.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}\`}>
                    {emp.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
            {employees.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-500">No employees found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}`,

  'src/app/attendance/page.tsx': `import { getMyAttendance, checkIn, checkOut } from "@/actions/attendance";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AttendancePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const emp = await prisma.employee.findUnique({ where: { userId: session.user.id } });
  if (!emp) return <div className="p-8 text-red-500">Employee record not found.</div>;

  const logs = await getMyAttendance(emp.id);
  const todayLog = logs.find(l => new Date(l.date).toDateString() === new Date().toDateString());
  const canCheckIn = !todayLog;
  const canCheckOut = todayLog && !todayLog.checkOut;

  const handleCheckIn = async () => {
    "use server";
    await checkIn(emp.id);
  }

  const handleCheckOut = async () => {
    "use server";
    await checkOut(emp.id);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Attendance Tracker</h1>
      
      <div className="bg-white p-8 rounded-xl border shadow-sm mb-8 flex items-center justify-center gap-6">
        <form action={handleCheckIn}>
           <button disabled={!canCheckIn} className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 hover:bg-emerald-700 transition">Clock In</button>
        </form>
        <form action={handleCheckOut}>
           <button disabled={!canCheckOut} className="px-8 py-4 bg-rose-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 hover:bg-rose-700 transition">Clock Out</button>
        </form>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Check In</th>
              <th className="p-4">Check Out</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b">
                <td className="p-4">{new Date(log.date).toLocaleDateString()}</td>
                <td className="p-4">{log.checkIn ? new Date(log.checkIn).toLocaleTimeString() : '-'}</td>
                <td className="p-4">{log.checkOut ? new Date(log.checkOut).toLocaleTimeString() : '-'}</td>
                <td className="p-4 font-semibold text-emerald-600">{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}`,

  'src/app/leave/page.tsx': `import { applyLeave, updateLeaveStatus } from "@/actions/leave";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function LeavePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const emp = await prisma.employee.findUnique({ where: { userId: session.user.id } });
  if (!emp) return <div className="p-8 text-red-500">Employee record not found.</div>;

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "HR";
  
  const leaves = await prisma.leaveRequest.findMany({
    where: isAdmin ? {} : { employeeId: emp.id },
    include: { employee: true },
    orderBy: { createdAt: 'desc' }
  });

  const handleApply = async (formData: FormData) => {
    "use server";
    await applyLeave(emp.id, formData);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{isAdmin ? "Leave Management" : "My Leave Requests"}</h1>
      
      {!isAdmin && (
        <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
          <h2 className="font-semibold text-lg mb-4">Apply for Time Off</h2>
          <form action={handleApply} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="leaveType" className="border p-2 rounded" required>
              <option value="PAID">Paid Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="UNPAID">Unpaid Leave</option>
            </select>
            <input name="startDate" type="date" className="border p-2 rounded" required />
            <input name="endDate" type="date" className="border p-2 rounded" required />
            <input name="remarks" placeholder="Reason/Remarks" className="border p-2 rounded" required />
            <button type="submit" className="bg-amber-500 text-white p-2 rounded font-semibold hover:bg-amber-600 md:col-span-2">Submit Request</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              {isAdmin && <th className="p-4">Employee</th>}
              <th className="p-4">Type</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Status</th>
              {isAdmin && <th className="p-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {leaves.map(l => (
              <tr key={l.id} className="border-b">
                {isAdmin && <td className="p-4 font-medium">{l.employee.firstName} {l.employee.lastName}</td>}
                <td className="p-4">{l.leaveType}</td>
                <td className="p-4">{new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()}</td>
                <td className="p-4 font-semibold">{l.status}</td>
                {isAdmin && (
                  <td className="p-4 flex gap-2">
                    {l.status === "PENDING" && (
                      <>
                        <form action={async () => { "use server"; await updateLeaveStatus(l.id, "APPROVED"); }}>
                          <button className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200">Approve</button>
                        </form>
                        <form action={async () => { "use server"; await updateLeaveStatus(l.id, "REJECTED"); }}>
                          <button className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200">Reject</button>
                        </form>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}`,

  'src/app/profile/page.tsx': `import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserCircle } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const emp = await prisma.employee.findUnique({ where: { userId: session.user.id } });
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
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
}`,

  'src/app/payroll/page.tsx': `import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PayrollPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Payroll & Salary</h1>
      
      <div className="bg-white p-8 rounded-xl border shadow-sm text-center py-20">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Salary Slips Generated</h2>
        <p className="text-gray-500">Your payroll records will appear here once HR processes them.</p>
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
