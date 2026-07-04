import { Intent } from './intent-classifier';
import { Role } from './permissions';
import { getAttendanceContext } from './tools/attendance';
import { getLeaveContext } from './tools/leave';
import { getPayrollContext } from './tools/payroll';
import { getEmployeeContext } from './tools/employee';
import { prisma } from "@/lib/prisma";

export async function buildContext(role: Role, intent: Intent, userId: string): Promise<Record<string, unknown>> {
  // First, find the employeeId for the current user if they have one
  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    include: { employee: true }
  });
  
  const employeeId = userRecord?.employee?.id || null;
  const userName = userRecord?.name || 'Unknown User';

  let dataContext = {};

  switch (intent) {
    case 'ATTENDANCE':
      dataContext = await getAttendanceContext(role, employeeId);
      break;
    case 'LEAVE':
      dataContext = await getLeaveContext(role, employeeId);
      break;
    case 'PAYROLL':
      dataContext = await getPayrollContext(role, employeeId);
      break;
    case 'EMPLOYEE':
      dataContext = await getEmployeeContext(role, employeeId);
      break;
    default:
      dataContext = { info: "No specific database context needed for this general query." };
  }

  // Inject user identity metadata into context so the LLM knows who it's talking to
  return {
    currentUser: {
      role,
      name: userName
    },
    retrievedData: dataContext
  };
}
