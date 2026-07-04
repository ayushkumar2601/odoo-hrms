import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { executeConfirmedAction, ActionType } from "@/lib/copilot/actions";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { actionType, payload } = await req.json();

    if (!actionType || !payload) {
      return NextResponse.json({ error: "Missing action parameters." }, { status: 400 });
    }

    // Execute safe action
    const result = await executeConfirmedAction(userId, actionType as ActionType, payload);

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId,
        action: `COPILOT_ACTION_${actionType}`,
        metadata: JSON.stringify({ payload, success: true })
      }
    });

    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error("Copilot Action Error:", error);
    const message = error instanceof Error ? error.message : "Failed to execute action.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
