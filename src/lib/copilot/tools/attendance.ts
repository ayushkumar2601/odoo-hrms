import { prisma } from "@/lib/prisma";

export async function getAttendanceContext(role: string, employeeId: string | null) {
  if (role === 'EMPLOYEE' && employeeId) {
    const records = await prisma.attendance.findMany({
      where: { employeeId },
      orderBy: { date: 'desc' },
      take: 10
    });
    return { myRecentAttendance: records };
  }
  
  if (role === 'ADMIN' || role === 'HR') {
    // Get today's attendance summary
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const records = await prisma.attendance.findMany({
      where: { date: { gte: today } },
      include: { employee: { select: { firstName: true, lastName: true, department: true } } }
    });
    return { todaysAttendanceRecords: records };
  }
  return {};
}
