import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { classifyIntent } from "@/lib/copilot/intent-classifier";
import { checkPermissions, Role } from "@/lib/copilot/permissions";
import { buildContext } from "@/lib/copilot/context-builder";
import { groq, MODEL_ID } from "@/lib/copilot/groq";
import { prisma } from "@/lib/prisma";

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

    // 1. Intent Classification
    const intent = classifyIntent(prompt);

    // 2. Permission Check (BEFORE hitting Database)
    const permission = checkPermissions(role, intent, prompt);
    
    if (!permission.allowed) {
      // Log denied attempt
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

    // 3. Build Safe Context
    const safeContext = await buildContext(role, intent, userId);

    // 4. Construct System Prompt
    const systemPrompt = `You are Zindle Copilot, a secure AI assistant.
The authenticated user has role ${role} and their name is ${safeContext.currentUser.name}.
You may ONLY answer questions using the provided context.
You MUST NEVER invent data or hallucinate.
You MUST NEVER provide information outside the provided context.
If the user requests unauthorized information not found in the context, politely deny the request.
Respond concisely and professionally.

CONTEXT DATA:
${JSON.stringify(safeContext.retrievedData, null, 2)}`;

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
