"use client";
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
