import { prisma } from "./prisma";

export async function generateEmployeeId(): Promise<string> {
  const lastEmp = await prisma.employee.findFirst({
    orderBy: { employeeId: 'desc' }
  });
  
  let nextNumber = 1;
  if (lastEmp && lastEmp.employeeId.startsWith('EMP')) {
    const numPart = parseInt(lastEmp.employeeId.replace('EMP', ''), 10);
    if (!isNaN(numPart)) {
      nextNumber = numPart + 1;
    }
  }
  
  const paddedNumber = nextNumber.toString().padStart(4, '0');
  return `EMP${paddedNumber}`;
}
