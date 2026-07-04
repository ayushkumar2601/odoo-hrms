import { parseLeaveAction, executeLeaveAction, LeaveActionPayload } from "./leave-action";
import { parseProfileAction, executeProfileAction, ProfileActionPayload } from "./profile-action";

export type ActionType = "APPLY_LEAVE" | "UPDATE_PROFILE" | "NONE";

export interface ActionProposal {
  actionType: ActionType;
  title: string;
  description: string;
  payload: Record<string, unknown>;
}

export async function detectAndProposeAction(prompt: string): Promise<ActionProposal | null> {
  const lower = prompt.toLowerCase();

  if (lower.match(/apply.*leave|take.*leave/i)) {
    const parsed = await parseLeaveAction(prompt);
    if (parsed) {
      return {
        actionType: "APPLY_LEAVE",
        title: "Apply for Leave",
        description: `Requesting ${parsed.leaveType} leave from ${parsed.startDate} to ${parsed.endDate}.`,
        payload: parsed as unknown as Record<string, unknown>
      };
    }
  }

  if (lower.match(/update.*phone|change.*address|update.*address|change.*phone/i)) {
    const parsed = await parseProfileAction(prompt);
    if (parsed) {
      return {
        actionType: "UPDATE_PROFILE",
        title: "Update Profile Information",
        description: `Change your ${parsed.field} to: "${parsed.value}".`,
        payload: parsed as unknown as Record<string, unknown>
      };
    }
  }

  return null;
}

export async function executeConfirmedAction(userId: string, actionType: ActionType, payload: Record<string, unknown>) {
  switch (actionType) {
    case "APPLY_LEAVE":
      return await executeLeaveAction(userId, payload as unknown as LeaveActionPayload);
    case "UPDATE_PROFILE":
      return await executeProfileAction(userId, payload as unknown as ProfileActionPayload);
    default:
      throw new Error("Unsupported action type.");
  }
}
