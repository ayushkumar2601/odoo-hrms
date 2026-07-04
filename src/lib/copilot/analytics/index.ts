import { prisma } from "@/lib/prisma";

export async function getWorkforceAnalytics() {
  const totalEmployees = await prisma.employee.count({ where: { isActive: true } });
  
  const departmentCounts = await prisma.employee.groupBy({
    by: ['department'],
    where: { isActive: true },
    _count: { id: true }
  });

  const formattedDepts = departmentCounts.map(d => ({
    department: d.department || "Unassigned",
    count: d._count.id
  }));

  return {
    totalActiveEmployees: totalEmployees,
    departmentDistribution: formattedDepts,
    summary: `Workforce consists of ${totalEmployees} active employees across ${formattedDepts.length} departments.`
  };
}

export async function getAttendanceAnalytics() {
  const totalRecords = await prisma.attendance.count();
  const presentCount = await prisma.attendance.count({ where: { status: "PRESENT" } });
  const absentCount = await prisma.attendance.count({ where: { status: "ABSENT" } });
  const leaveCount = await prisma.attendance.count({ where: { status: "LEAVE" } });

  const attendanceRate = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

  return {
    overallAttendanceRate: `${attendanceRate}%`,
    present: presentCount,
    absent: absentCount,
    onLeave: leaveCount,
    summary: `Overall company attendance rate stands at ${attendanceRate}%.`
  };
}

export async function getLeaveAnalytics() {
  const pendingRequests = await prisma.leaveRequest.count({ where: { status: "PENDING" } });
  const approvedRequests = await prisma.leaveRequest.count({ where: { status: "APPROVED" } });
  
  const byType = await prisma.leaveRequest.groupBy({
    by: ['leaveType'],
    _count: { id: true }
  });

  return {
    pendingApprovals: pendingRequests,
    approvedTotal: approvedRequests,
    leaveTypesDistribution: byType.map(t => ({ type: t.leaveType, count: t._count.id })),
    summary: `There are currently ${pendingRequests} leave requests pending HR/Admin approval.`
  };
}

export async function getPayrollAnalytics() {
  const totalPayroll = await prisma.payroll.aggregate({
    _sum: { netSalary: true },
    _avg: { netSalary: true }
  });

  return {
    totalMonthlyExpenditure: totalPayroll._sum.netSalary || 0,
    averageEmployeeNetSalary: Math.round(totalPayroll._avg.netSalary || 0),
    summary: `Total company payroll expenditure is $${totalPayroll._sum.netSalary || 0} with an average net salary of $${Math.round(totalPayroll._avg.netSalary || 0)}.`
  };
}
