import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { classifyIntent } from "@/lib/copilot/intent-classifier";
import { checkPermissions, Role } from "@/lib/copilot/permissions";
import { buildContext } from "@/lib/copilot/context-builder";
import { groq, MODEL_ID } from "@/lib/copilot/groq";
import { prisma } from "@/lib/prisma";
import { detectAndProposeAction } from "@/lib/copilot/actions";
import { detectReportProposal } from "@/lib/copilot/reports";
import { 
  getWorkforceAnalytics, 
  getAttendanceAnalytics, 
  getLeaveAnalytics, 
  getPayrollAnalytics 
} from "@/lib/copilot/analytics";

// Simple in-memory rate limiting (30 requests per hour)
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();
const RATE_LIMIT = 30;
const TIME_WINDOW = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const role = session.user.role as Role;
    
    // Rate Limiting
    const now = Date.now();
    const userRateData = rateLimitMap.get(userId);
    if (userRateData) {
      if (now - userRateData.timestamp < TIME_WINDOW) {
        if (userRateData.count >= RATE_LIMIT) {
          return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
        }
        userRateData.count++;
      } else {
        rateLimitMap.set(userId, { count: 1, timestamp: now });
      }
    } else {
      rateLimitMap.set(userId, { count: 1, timestamp: now });
    }

    const body = await req.json();
    const prompt = body.prompt;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    // PHASE B: Check for Action Proposal
    const actionProposal = await detectAndProposeAction(prompt);
    if (actionProposal) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'COPILOT_ACTION_PROPOSED',
          metadata: JSON.stringify({ prompt, actionType: actionProposal.actionType })
        }
      });
      return NextResponse.json({ actionProposal });
    }

    // PHASE B: Check for Report Generation Proposal
    const reportProposal = detectReportProposal(prompt);
    if (reportProposal) {
      // Permission check for report
      if (reportProposal.type === "PAYROLL" && role !== "ADMIN") {
        return NextResponse.json({ 
          response: "You do not have permission to generate payroll reports." 
        }, { status: 403 });
      }
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'COPILOT_REPORT_PROPOSED',
          metadata: JSON.stringify({ prompt, reportType: reportProposal.type })
        }
      });
      return NextResponse.json({ reportProposal });
    }

    // 1. Intent Classification
    const intent = classifyIntent(prompt);

    // 2. Permission Check (BEFORE hitting Database)
    const permission = checkPermissions(role, intent, prompt);
    
    if (!permission.allowed) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'COPILOT_QUERY',
          metadata: JSON.stringify({ prompt, intent, allowed: false, reason: permission.reason })
        }
      });
      return NextResponse.json({ 
        response: permission.reason || "You do not have permission to access this information." 
      }, { status: 403 });
    }

    // 3. Build Safe Context & Analytics
    const safeContext = await buildContext(role, intent, userId);

    // PHASE B: Inject summarized analytics if query asks for analytical insights
    let analyticsData = null;
    const lower = prompt.toLowerCase();
    if (lower.match(/why|trend|most|average|analytics|rate|distribution|headcount|expenditure|cost|attrition|tenure/i)) {
      if (role === "ADMIN" || role === "HR") {
        analyticsData = {
          workforce: await getWorkforceAnalytics(),
          attendance: await getAttendanceAnalytics(),
          leave: await getLeaveAnalytics(),
          payroll: role === "ADMIN" ? await getPayrollAnalytics() : "Restricted"
        };
      }
    }

    // 4. Construct System Prompt
    const systemPrompt = `You are Zindle Copilot, a secure AI assistant for workplace data.
The authenticated user has role ${role} and their name is ${safeContext.currentUser.name}.
You may ONLY answer questions using the provided context.
You MUST NEVER invent data or hallucinate.
You MUST NEVER provide information outside the provided context.
If the user requests unauthorized information not found in the context, politely deny the request.

FORMATTING RULES:
1. Always format your responses cleanly using Markdown.
2. Use **bold text** for names, dates, times, statuses (e.g., **PRESENT**, **APPROVED**), and numbers.
3. When listing multiple items, dates, or records, ALWAYS format them as bulleted lists or numbered lists for visual scannability.
4. For time & attendance queries, clearly format timestamps (e.g., **09:00 AM - 05:30 PM**) and highlight worked duration or status badges.
5. If providing an analytical summary or multi-part answer, use sub-headings (###) to separate sections cleanly.
6. Keep explanations friendly, structured, and easy to read.

CONTEXT DATA:
${JSON.stringify(safeContext.retrievedData, null, 2)}
${analyticsData ? `\nANALYTICS SUMMARY:\n${JSON.stringify(analyticsData, null, 2)}` : ""}`;

    // 5. Call Groq
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      model: MODEL_ID,
      temperature: 0, // Strict, deterministic responses
    });

    const aiResponse = completion.choices[0]?.message?.content || "I couldn't generate a response.";

    // 6. Log success
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'COPILOT_QUERY',
        metadata: JSON.stringify({ prompt, intent, allowed: true })
      }
    });

    return NextResponse.json({ response: aiResponse });

  } catch (error: unknown) {
    console.error("Copilot API Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
