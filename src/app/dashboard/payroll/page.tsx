import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function PayrollPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const emp = await prisma.employee.findUnique({ where: { userId: session.user.id } });
  if (!emp) return <div className="p-8 text-red-500">Employee record not found.</div>;

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "HR";
  
  const payrolls = await prisma.payroll.findMany({
    where: isAdmin ? {} : { employeeId: emp.id },
    include: { employee: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{isAdmin ? "Company Payroll" : "My Salary Slips"}</h1>
      
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              {isAdmin && <th className="p-4">Employee</th>}
              <th className="p-4">Period</th>
              <th className="p-4">Base Salary</th>
              <th className="p-4">Allowances</th>
              <th className="p-4">Deductions</th>
              <th className="p-4">Net Salary</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map(p => (
              <tr key={p.id} className="border-b">
                {isAdmin && <td className="p-4 font-medium">{p.employee.firstName} {p.employee.lastName}</td>}
                <td className="p-4">{p.month}/{p.year}</td>
                <td className="p-4">\${p.basicSalary.toFixed(2)}</td>
                <td className="p-4 text-emerald-600">+\${p.allowances.toFixed(2)}</td>
                <td className="p-4 text-red-600">-\${p.deductions.toFixed(2)}</td>
                <td className="p-4 font-bold text-gray-900">\${p.netSalary.toFixed(2)}</td>
                <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">{p.status}</span></td>
              </tr>
            ))}
            {payrolls.length === 0 && <tr><td colSpan={7} className="p-4 text-center text-gray-500">No salary slips generated yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}