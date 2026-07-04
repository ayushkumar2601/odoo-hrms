import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Banknote, DollarSign, Download, CreditCard, ShieldCheck, CheckCircle2, ArrowUpRight } from "lucide-react";

export default async function PayrollPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const emp = await prisma.employee.findUnique({ where: { userId: session.user.id } });
  if (!emp) return <div className="p-8 text-red-500 font-semibold">Employee record not found.</div>;

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "HR";
  
  const payrolls = await prisma.payroll.findMany({
    where: isAdmin ? {} : { employeeId: emp.id },
    include: { employee: true },
    orderBy: { createdAt: 'desc' }
  });

  const totalDisbursed = payrolls.reduce((acc, curr) => acc + curr.netSalary, 0);
  const avgSalary = payrolls.length > 0 ? totalDisbursed / payrolls.length : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Apple & Linear Style Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
            {isAdmin ? "Enterprise Payroll Administration" : "My Compensation & Salary Slips"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin ? "Manage monthly compensation, allowance disbursements, and tax deductions" : "View compensation breakdown, net earnings, and download monthly pay slips"}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 text-slate-700 shadow-2xs flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Bank-Grade Encryption</span>
          </span>
        </div>
      </div>

      {/* CRM Salary Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-medium text-slate-500">{isAdmin ? "Total Disbursed (Period)" : "Total Earnings"}</span>
            <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">Paid</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold tracking-tight text-[#111827]">${totalDisbursed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <span className="text-xs text-slate-400 font-medium">{payrolls.length} cycles</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-medium text-slate-500">{isAdmin ? "Average Monthly Net" : "Base Monthly Compensation"}</span>
            <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">Standard</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold tracking-tight text-[#111827]">${avgSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <span className="text-xs text-slate-400 font-medium">Per slip</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-medium text-slate-500">Next Disbursement Date</span>
            <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">Scheduled</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold tracking-tight text-[#111827]">Last Working Day</p>
            <span className="text-xs text-slate-400 font-medium">Automated</span>
          </div>
        </div>
      </div>

      {/* CRM Style Payroll Ledger Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-slate-400" />
            <h2 className="font-bold text-[#111827] text-sm">Disbursement Ledger & Pay Slips</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Sorted by disbursement cycle</span>
        </div>

        <div className="grid grid-cols-12 bg-[#FAFAFB] px-6 py-3 text-[11px] font-semibold text-slate-500 border-b border-slate-200/80">
          {isAdmin && <div className="col-span-3">Employee ↓</div>}
          <div className={isAdmin ? "col-span-2" : "col-span-2"}>Cycle Period</div>
          <div className={isAdmin ? "col-span-2" : "col-span-3"}>Base Salary</div>
          <div className="col-span-2">Allowances / Ded.</div>
          <div className={isAdmin ? "col-span-2" : "col-span-3"}>Net Pay</div>
          <div className="col-span-1 text-right">Status</div>
        </div>

        <div className="divide-y divide-slate-200/60 text-xs">
          {payrolls.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No compensation slips generated in the ledger yet.</div>
          ) : (
            payrolls.map((p) => (
              <div key={p.id} className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                {isAdmin && (
                  <div className="col-span-3 flex items-center gap-2.5 font-semibold text-[#111827]">
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs">
                      {p.employee.firstName.charAt(0)}{p.employee.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="leading-none">{p.employee.firstName} {p.employee.lastName}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.employee.employeeId}</p>
                    </div>
                  </div>
                )}
                <div className={isAdmin ? "col-span-2 font-mono text-slate-700 font-semibold" : "col-span-2 font-mono text-slate-700 font-semibold"}>
                  {p.month.toString().padStart(2, '0')}/{p.year}
                </div>
                <div className={isAdmin ? "col-span-2 font-mono text-slate-600" : "col-span-3 font-mono text-slate-600"}>
                  ${p.basicSalary.toFixed(2)}
                </div>
                <div className="col-span-2 font-mono">
                  <span className="text-emerald-600 font-medium">+${p.allowances.toFixed(2)}</span>
                  <span className="text-slate-300 mx-1">/</span>
                  <span className="text-red-500 font-medium">-${p.deductions.toFixed(2)}</span>
                </div>
                <div className={isAdmin ? "col-span-2 font-mono font-bold text-[#111827]" : "col-span-3 font-mono font-bold text-[#111827]"}>
                  ${p.netSalary.toFixed(2)}
                </div>
                <div className="col-span-1 text-right">
                  <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full text-[10px] border border-emerald-200/50 inline-block">
                    {p.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}