const fs = require('fs');
const path = require('path');

const files = {
  'src/modules/attendance/services/attendance-status.service.ts': `import { AttendanceStatus } from "@prisma/client";

export function determineAttendanceStatus(workedMinutes: number): AttendanceStatus {
  const workedHours = workedMinutes / 60;
  if (workedHours >= 8) {
    return AttendanceStatus.PRESENT;
  } else if (workedHours >= 4) {
    return AttendanceStatus.HALF_DAY;
  } else {
    return AttendanceStatus.ABSENT;
  }
}
`,
  'src/modules/attendance/actions.ts': `"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { determineAttendanceStatus } from "./services/attendance-status.service";

export async function checkInAction(employeeId: string) {
  const today = new Date();
  today.setHours(0,0,0,0);

  const existing = await prisma.attendance.findFirst({
    where: {
      employeeId,
      date: { gte: today }
    }
  });

  if (existing) {
    return { error: "Already checked in today" };
  }

  const record = await prisma.attendance.create({
    data: {
      employeeId,
      date: new Date(),
      checkIn: new Date(),
      status: "ABSENT" // default until checkout
    }
  });

  await prisma.auditLog.create({
    data: { action: "ATTENDANCE_CHECKIN", metadata: JSON.stringify({ attendanceId: record.id }) }
  });

  return { success: true, record };
}

export async function checkOutAction(employeeId: string) {
  const today = new Date();
  today.setHours(0,0,0,0);

  const existing = await prisma.attendance.findFirst({
    where: {
      employeeId,
      date: { gte: today }
    }
  });

  if (!existing || !existing.checkIn || existing.checkOut) {
    return { error: "Cannot check out" };
  }

  const checkOutTime = new Date();
  const diffMs = checkOutTime.getTime() - existing.checkIn.getTime();
  const workedMinutes = Math.floor(diffMs / 60000);
  
  const status = determineAttendanceStatus(workedMinutes);

  const record = await prisma.attendance.update({
    where: { id: existing.id },
    data: {
      checkOut: checkOutTime,
      workedMinutes,
      status
    }
  });

  await prisma.auditLog.create({
    data: { action: "ATTENDANCE_CHECKOUT", metadata: JSON.stringify({ attendanceId: record.id }) }
  });

  return { success: true, record };
}
`,
  'src/modules/leave/actions.ts': `"use server";
import { prisma } from "@/lib/prisma";
import { LeaveType, LeaveStatus } from "@prisma/client";

export async function applyLeaveAction(employeeId: string, data: any) {
  const { leaveType, startDate, endDate, reason } = data;

  const record = await prisma.leaveRequest.create({
    data: {
      employeeId,
      leaveType: leaveType as LeaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: LeaveStatus.PENDING
    }
  });

  await prisma.auditLog.create({
    data: { action: "LEAVE_APPLIED", metadata: JSON.stringify({ leaveId: record.id }) }
  });

  return { success: true, record };
}

export async function approveLeaveAction(leaveId: string, adminUserId: string) {
  const leave = await prisma.leaveRequest.update({
    where: { id: leaveId },
    data: { status: LeaveStatus.APPROVED, reviewedById: adminUserId, reviewedAt: new Date() }
  });

  // Deduct balance logic omitted for brevity in MVP but would update LeaveBalance here
  await prisma.auditLog.create({
    data: { action: "LEAVE_APPROVED", metadata: JSON.stringify({ leaveId }) }
  });

  return { success: true, leave };
}
`,
  'src/app/attendance/page.tsx': `"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { checkInAction, checkOutAction } from "@/modules/attendance/actions";

export default function EmployeeAttendancePage() {
  const [loading, setLoading] = useState(false);
  const employeeId = "temp-employee-id"; // In real app, fetch from session

  const handleCheckIn = async () => {
    setLoading(true);
    await checkInAction(employeeId);
    setLoading(false);
    alert("Checked in!");
  };

  const handleCheckOut = async () => {
    setLoading(true);
    await checkOutAction(employeeId);
    setLoading(false);
    alert("Checked out!");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Attendance</h1>
      <Card>
        <CardHeader>
          <CardTitle>Daily Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <Button onClick={handleCheckIn} disabled={loading}>Check In</Button>
          <Button onClick={handleCheckOut} disabled={loading} variant="destructive">Check Out</Button>
        </CardContent>
      </Card>
    </div>
  );
}
`,
  'src/app/leave/apply/page.tsx': `"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { applyLeaveAction } from "@/modules/leave/actions";

export default function ApplyLeavePage() {
  const [loading, setLoading] = useState(false);
  const employeeId = "temp-employee-id"; 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    await applyLeaveAction(employeeId, data);
    setLoading(false);
    alert("Leave applied successfully!");
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Apply for Leave</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Leave Type</Label>
              <select name="leaveType" className="flex h-10 w-full rounded-md border px-3 py-2 text-sm" required>
                <option value="PAID">Paid</option>
                <option value="SICK">Sick</option>
                <option value="CASUAL">Casual</option>
                <option value="UNPAID">Unpaid</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input name="startDate" type="date" required />
              </div>
              <div>
                <Label>End Date</Label>
                <Input name="endDate" type="date" required />
              </div>
            </div>
            <div>
              <Label>Reason</Label>
              <Input name="reason" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">Submit Request</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created:', filePath);
}
