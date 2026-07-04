"use client";
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
