import { prisma } from "@/lib/prisma";

export async function getEmployeeContext(role: string, employeeId: string | null) {
  if (role === 'EMPLOYEE' && employeeId) {
    const profile = await prisma.employee.findUnique({
      where: { id: employeeId }
    });
    return { myProfile: profile };
  }
  
  if (role === 'ADMIN' || role === 'HR') {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        employeeId: true,
        firstName: true,
        lastName: true,
        email: true,
        department: true,
        designation: true,
        joiningDate: true,
        isActive: true
      },
      take: 100 // Limit for context size
    });
    return { companyDirectory: employees };
  }
  return {};
}
