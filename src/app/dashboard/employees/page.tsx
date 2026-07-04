import { getEmployees, createEmployee } from "@/actions/employee";
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
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${emp.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
}