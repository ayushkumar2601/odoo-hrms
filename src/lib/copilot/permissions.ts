import { Intent } from './intent-classifier';

export type Role = 'ADMIN' | 'HR' | 'EMPLOYEE';

export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
  targetEmployeeId?: string | null; // Extracted if they ask for a specific user
}

export function checkPermissions(
  role: Role,
  intent: Intent,
  prompt: string
): PermissionCheck {
  
  if (role === 'ADMIN') {
    return { allowed: true };
  }

  // Detect if the prompt mentions another person by common keywords or names
  // In a real system, we might use NLP here. For this phase, we look for pronouns/names
  // that imply querying someone else's data.
  const isQueryingSelf = prompt.match(/\b(my|mine|i|me)\b/i) !== null;
  const isQueryingOthers = prompt.match(/\b(he|she|they|his|her|their|everyone|all|department|company)\b/i) !== null;
  // Look for a capitalized name to detect asking for a specific person.
  const mentionsName = prompt.match(/[A-Z][a-z]+/g)?.some(word => !['What', 'How', 'Who', 'Where', 'When', 'Why', 'Show', 'List', 'Is', 'Are', 'Do', 'Does'].includes(word));

  const specificallyAskingAboutOthers = isQueryingOthers || mentionsName;

  if (role === 'EMPLOYEE') {
    // Employees can ONLY query themselves
    if (specificallyAskingAboutOthers && !isQueryingSelf) {
      if (intent === 'PAYROLL') return { allowed: false, reason: "You do not have permission to access payroll information of other employees." };
      if (intent === 'EMPLOYEE') return { allowed: false, reason: "You do not have permission to access employee directory information." };
      return { allowed: false, reason: "You do not have permission to access other employees' data." };
    }
    return { allowed: true };
  }

  if (role === 'HR') {
    // HR cannot access payroll according to RBAC restrictions mentioned in spec
    if (intent === 'PAYROLL') {
       return { allowed: false, reason: "You do not have permission to access payroll information." };
    }
    return { allowed: true };
  }

  return { allowed: false, reason: "Unauthorized role." };
}
