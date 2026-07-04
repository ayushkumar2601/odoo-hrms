import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { 
  getWorkforceAnalytics, 
  getAttendanceAnalytics, 
  getLeaveAnalytics, 
  getPayrollAnalytics 
} from "@/lib/copilot/analytics";
import { Role } from "@/lib/copilot/permissions";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role as Role;

    const workforce = await getWorkforceAnalytics();
    const attendance = await getAttendanceAnalytics();
    const leave = await getLeaveAnalytics();
    
    let payroll = null;
    if (role === "ADMIN") {
      payroll = await getPayrollAnalytics();
    }

    return NextResponse.json({
      workforce,
      attendance,
      leave,
      payroll
    });
  } catch (error: unknown) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
