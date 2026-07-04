import { prisma } from "./prisma";

export async function generateEmployeeId(companyId: string, firstName: string, lastName: string, joiningDate: Date): Promise<string> {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) throw new Error("Company not found");

  const code = company.code;
  const initials = (firstName.substring(0, 2) + lastName.substring(0, 2)).toUpperCase();
  const year = joiningDate.getFullYear().toString();

  // Find max sequence for this year
  const prefix = `${code}${initials}${year}`;
  
  const lastUser = await prisma.user.findFirst({
    where: {
      companyId: companyId,
      employeeId: {
        startsWith: `${code}${initials}${year}`
      }
    },
    orderBy: { employeeId: 'desc' }
  });

  let nextSeq = 1;
  if (lastUser && lastUser.employeeId) {
    const lastSeqStr = lastUser.employeeId.slice(-4);
    const lastSeq = parseInt(lastSeqStr, 10);
    if (!isNaN(lastSeq)) {
      nextSeq = lastSeq + 1;
    }
  }

  const sequenceStr = nextSeq.toString().padStart(4, '0');
  return `${prefix}${sequenceStr}`;
}
