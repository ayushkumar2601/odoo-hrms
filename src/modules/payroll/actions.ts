"use server";
import { prisma } from "@/lib/prisma";

export async function generatePayrollRecord(employeeId: string, month: number, year: number) {
  const structure = await prisma.salaryStructure.findUnique({ where: { employeeId } });
  if (!structure) throw new Error("Salary structure not defined for employee");

  const gross = Number(structure.basicSalary) + Number(structure.hra) + Number(structure.allowances) + Number(structure.bonus);
  const net = gross - Number(structure.deductions);

  const record = await prisma.payrollRecord.create({
    data: {
      employeeId, month, year,
      grossSalary: gross,
      totalDeductions: structure.deductions,
      netSalary: net
    }
  });

  await prisma.auditLog.create({
    data: { action: "PAYROLL_CREATED", metadata: JSON.stringify({ recordId: record.id }) }
  });

  return { success: true, record };
}
