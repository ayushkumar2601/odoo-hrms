import { prisma } from "@/lib/prisma";

export async function getLeaveContext(role: string, employeeId: string | null) {
  if (role === 'EMPLOYEE' && employeeId) {
    const records = await prisma.leaveRequest.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    return { myLeaveHistory: records };
  }
  
  if (role === 'ADMIN' || role === 'HR') {
    const pendingRequests = await prisma.leaveRequest.findMany({
      where: { status: 'PENDING' },
      include: { employee: { select: { firstName: true, lastName: true, department: true } } }
    });
    return { pendingLeaveRequests: pendingRequests };
  }
  return {};
}
