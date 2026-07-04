import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Activity } from "lucide-react";

export default async function AuditLogsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-500 mt-1">System-wide activity tracking (ADMIN ONLY).</p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Timestamp</th>
              <th className="p-4 font-semibold text-gray-600">User</th>
              <th className="p-4 font-semibold text-gray-600">Action</th>
              <th className="p-4 font-semibold text-gray-600">Metadata / Details</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50 transition">
                <td className="p-4 text-gray-500 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="p-4">
                  <div className="font-medium text-gray-900">{log.user?.name || 'Unknown'}</div>
                  <div className="text-gray-500 text-xs">{log.user?.email}</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-gray-700">
                  {log.metadata || "-"}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No audit logs available.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
