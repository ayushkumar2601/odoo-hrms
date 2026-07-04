import { applyLeave, updateLeaveStatus } from "@/actions/leave";
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
}