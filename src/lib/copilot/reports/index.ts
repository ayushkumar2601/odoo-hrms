import { prisma } from "@/lib/prisma";
import { Role } from "../permissions";

export interface GeneratedReportData {
  title: string;
  type: string;
  generatedBy: string;
  role: string;
  headers: string[];
  rows: (string | number)[][];
  summary: string;
}

export async function generateReportData(
  type: "ATTENDANCE" | "LEAVE" | "PAYROLL" | "EMPLOYEE",
  role: Role,
  userId: string,
  userName: string
): Promise<GeneratedReportData> {
  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    include: { employee: true }
  });
  const employeeId = userRecord?.employee?.id || null;

  if (role === "EMPLOYEE" && !employeeId) {
    throw new Error("No employee profile found for report generation.");
  }

  if (type === "PAYROLL" && role !== "ADMIN") {
    if (role === "EMPLOYEE") {
      // Employee can only generate their own payroll report
      const payrolls = await prisma.payroll.findMany({
        where: { employeeId: employeeId! },
        orderBy: { year: 'desc', month: 'desc' }
      });
      return {
        title: `Personal Payroll Report - ${userName}`,
        type: "PAYROLL",
        generatedBy: userName,
        role,
        headers: ["Month", "Year", "Basic ($)", "Allowances ($)", "Deductions ($)", "Net Salary ($)", "Status"],
        rows: payrolls.map(p => [p.month, p.year, p.basicSalary, p.allowances, p.deductions, p.netSalary, p.status]),
        summary: `Showing ${payrolls.length} historical payroll records for ${userName}.`
      };
    }
    throw new Error("You do not have permission to generate company payroll reports.");
  }

  if (type === "ATTENDANCE") {
    if (role === "EMPLOYEE") {
      const records = await prisma.attendance.findMany({
        where: { employeeId: employeeId! },
        orderBy: { date: 'desc' },
        take: 30
      });
      return {
        title: `Personal Attendance Report - ${userName}`,
        type: "ATTENDANCE",
        generatedBy: userName,
        role,
        headers: ["Date", "Status", "Worked Minutes", "Check In", "Check Out"],
        rows: records.map(r => [
          r.date.toISOString().split('T')[0],
          r.status,
          r.workedMinutes || 0,
          r.checkIn ? r.checkIn.toLocaleTimeString() : "-",
          r.checkOut ? r.checkOut.toLocaleTimeString() : "-"
        ]),
        summary: `Recent 30 days attendance history for ${userName}.`
      };
    } else {
      // HR/ADMIN sees recent company attendance
      const records = await prisma.attendance.findMany({
        orderBy: { date: 'desc' },
        take: 50,
        include: { employee: { select: { firstName: true, lastName: true, employeeId: true } } }
      });
      return {
        title: "Company-Wide Attendance Report",
        type: "ATTENDANCE",
        generatedBy: userName,
        role,
        headers: ["Emp ID", "Name", "Date", "Status", "Worked Mins"],
        rows: records.map(r => [
          r.employee.employeeId,
          `${r.employee.firstName} ${r.employee.lastName}`,
          r.date.toISOString().split('T')[0],
          r.status,
          r.workedMinutes || 0
        ]),
        summary: `Showing latest 50 attendance records across the organization.`
      };
    }
  }

  if (type === "LEAVE") {
    if (role === "EMPLOYEE") {
      const records = await prisma.leaveRequest.findMany({
        where: { employeeId: employeeId! },
        orderBy: { createdAt: 'desc' }
      });
      return {
        title: `Personal Leave History - ${userName}`,
        type: "LEAVE",
        generatedBy: userName,
        role,
        headers: ["Type", "Start Date", "End Date", "Status", "Remarks"],
        rows: records.map(r => [
          r.leaveType,
          r.startDate.toISOString().split('T')[0],
          r.endDate.toISOString().split('T')[0],
          r.status,
          r.remarks || "-"
        ]),
        summary: `Historical leave records for ${userName}.`
      };
    } else {
      const records = await prisma.leaveRequest.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { employee: { select: { firstName: true, lastName: true, department: true } } }
      });
      return {
        title: "Company Leave Requests Summary",
        type: "LEAVE",
        generatedBy: userName,
        role,
        headers: ["Name", "Department", "Type", "Dates", "Status"],
        rows: records.map(r => [
          `${r.employee.firstName} ${r.employee.lastName}`,
          r.employee.department || "N/A",
          r.leaveType,
          `${r.startDate.toISOString().split('T')[0]} to ${r.endDate.toISOString().split('T')[0]}`,
          r.status
        ]),
        summary: `Showing 50 most recent company leave requests.`
      };
    }
  }

  if (type === "PAYROLL" && role === "ADMIN") {
    const payrolls = await prisma.payroll.findMany({
      orderBy: { year: 'desc', month: 'desc' },
      take: 50,
      include: { employee: { select: { firstName: true, lastName: true, department: true } } }
    });
    return {
      title: "Executive Company Payroll Summary",
      type: "PAYROLL",
      generatedBy: userName,
      role,
      headers: ["Employee", "Department", "Period", "Basic ($)", "Net Salary ($)", "Status"],
      rows: payrolls.map(p => [
        `${p.employee.firstName} ${p.employee.lastName}`,
        p.employee.department || "N/A",
        `${p.month}/${p.year}`,
        p.basicSalary,
        p.netSalary,
        p.status
      ]),
      summary: `Executive financial report displaying ${payrolls.length} payroll transactions.`
    };
  }

  if (type === "EMPLOYEE") {
    if (role === "EMPLOYEE") {
      const emp = await prisma.employee.findUnique({ where: { id: employeeId! } });
      return {
        title: `Employee Profile Verification - ${userName}`,
        type: "EMPLOYEE",
        generatedBy: userName,
        role,
        headers: ["Field", "Value"],
        rows: [
          ["Employee ID", emp?.employeeId || "-"],
          ["Full Name", `${emp?.firstName} ${emp?.lastName}`],
          ["Email", emp?.email || "-"],
          ["Department", emp?.department || "-"],
          ["Designation", emp?.designation || "-"],
          ["Joining Date", emp?.joiningDate ? emp.joiningDate.toISOString().split('T')[0] : "-"]
        ],
        summary: `Official employee record for ${userName}.`
      };
    } else {
      const emps = await prisma.employee.findMany({ where: { isActive: true }, take: 100 });
      return {
        title: "Active Workforce Directory Report",
        type: "EMPLOYEE",
        generatedBy: userName,
        role,
        headers: ["Emp ID", "Name", "Email", "Department", "Designation", "Joined"],
        rows: emps.map(e => [
          e.employeeId,
          `${e.firstName} ${e.lastName}`,
          e.email,
          e.department || "-",
          e.designation || "-",
          e.joiningDate.toISOString().split('T')[0]
        ]),
        summary: `Directory report of ${emps.length} active personnel.`
      };
    }
  }

  throw new Error("Unsupported report type or permission denied.");
}

export async function saveGeneratedReport(data: GeneratedReportData) {
  const report = await prisma.report.create({
    data: {
      title: data.title,
      type: data.type,
      generatedBy: data.generatedBy,
      role: data.role,
      fileData: JSON.stringify({ headers: data.headers, rows: data.rows, summary: data.summary })
    }
  });
  return report;
}

export interface ReportProposal {
  type: "ATTENDANCE" | "LEAVE" | "PAYROLL" | "EMPLOYEE";
  title: string;
  description: string;
}

export function detectReportProposal(prompt: string): ReportProposal | null {
  const lower = prompt.toLowerCase();
  if (!lower.match(/generate.*report|create.*report|export.*report|download.*report|export.*pdf|download.*pdf/i)) {
    return null;
  }

  if (lower.includes("payroll") || lower.includes("salary") || lower.includes("compensation")) {
    return {
      type: "PAYROLL",
      title: "Payroll & Compensation Report",
      description: "Comprehensive financial statement detailing basic salaries, allowances, deductions, and net payouts."
    };
  }
  if (lower.includes("leave") || lower.includes("time off") || lower.includes("absence") || lower.includes("vacation")) {
    return {
      type: "LEAVE",
      title: "Workforce Leave & Absence Report",
      description: "Detailed summary of leave applications, dates, types, and current approval statuses."
    };
  }
  if (lower.includes("employee") || lower.includes("directory") || lower.includes("workforce") || lower.includes("profile")) {
    return {
      type: "EMPLOYEE",
      title: "Employee Directory & Profile Report",
      description: "Official personnel document listing designations, departments, contact info, and joining dates."
    };
  }
  // Default to attendance if general report or attendance specified
  return {
    type: "ATTENDANCE",
    title: "Time & Attendance Log Report",
    description: "Complete log of daily check-ins, check-outs, worked minutes, and attendance statuses."
  };
}

