import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateReportData, saveGeneratedReport } from "@/lib/copilot/reports";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/copilot/permissions";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role as Role;
    const userName = session.user.name;

    // Admin sees all reports, HR sees HR/Employee reports, Employee sees only their own reports
    let whereClause = {};
    if (role === "EMPLOYEE") {
      whereClause = { generatedBy: userName };
    } else if (role === "HR") {
      whereClause = { type: { not: "PAYROLL" } };
    }

    const reports = await prisma.report.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 50
    });

    return NextResponse.json({ reports });
  } catch (error: unknown) {
    console.error("Fetch Reports Error:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const role = session.user.role as Role;
    const userName = session.user.name || "Unknown User";

    const { type } = await req.json();
    if (!type || !["ATTENDANCE", "LEAVE", "PAYROLL", "EMPLOYEE"].includes(type)) {
      return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }

    // Generate report data securely
    const reportData = await generateReportData(type, role, userId, userName);
    const savedReport = await saveGeneratedReport(reportData);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: `REPORT_GENERATED_${type}`,
        metadata: JSON.stringify({ reportId: savedReport.id, title: savedReport.title })
      }
    });

    return NextResponse.json({ success: true, report: savedReport, data: reportData });
  } catch (error: unknown) {
    console.error("Generate Report Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate report.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await prisma.report.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
  }
}
