import { prisma } from "@/lib/prisma";

export async function getPayrollContext(role: string, employeeId: string | null) {
  // HR is explicitly blocked from payroll in permissions.ts, so we only handle ADMIN and EMPLOYEE
  
  if (role === 'EMPLOYEE' && employeeId) {
    const records = await prisma.payroll.findMany({
      where: { employeeId },
      orderBy: { year: 'desc', month: 'desc' },
      take: 5
    });
    return { myPayrollHistory: records };
  }
  
  if (role === 'ADMIN') {
    // Return high level payroll stats
    const allPayrolls = await prisma.payroll.findMany({
      orderBy: { year: 'desc', month: 'desc' },
      take: 50
    });
    return { recentCompanyPayrolls: allPayrolls };
  }
  return {};
}
