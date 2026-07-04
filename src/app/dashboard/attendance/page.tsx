import { getMyAttendance, checkIn, checkOut } from "@/actions/attendance";
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
}