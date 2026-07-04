export type Intent = 'ATTENDANCE' | 'LEAVE' | 'PAYROLL' | 'EMPLOYEE' | 'UNKNOWN';

export function classifyIntent(prompt: string): Intent {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.match(/salary|payroll|payslip|pay|deductions|allowance/i)) {
    return 'PAYROLL';
  }
  
  if (lowerPrompt.match(/attendance|absent|present|check in|check out|check-in|check-out/i)) {
    return 'ATTENDANCE';
  }
  
  if (lowerPrompt.match(/leave|time off|vacation|sick|pto|pending request/i)) {
    return 'LEAVE';
  }
  
  if (lowerPrompt.match(/employee|profile|department|designation|directory|who is/i)) {
    return 'EMPLOYEE';
  }
  
  return 'UNKNOWN';
}
