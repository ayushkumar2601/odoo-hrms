import { prisma } from "./prisma";

export async function generateEmployeeId(): Promise<string> {
  const count = await prisma.employee.count();
  const nextNumber = count + 1;
  const paddedNumber = nextNumber.toString().padStart(4, '0');
  
  return `EMP${paddedNumber}`;
}
