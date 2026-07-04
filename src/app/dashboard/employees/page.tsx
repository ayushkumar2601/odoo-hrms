import { getEmployees, createEmployee } from "@/actions/employee";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  Users, UserPlus, Search, Filter, X, CheckSquare, Square, 
  Trash2, MoreHorizontal, ArrowUpRight, ShieldCheck, Mail, Briefcase 
} from "lucide-react";

export default async function EmployeesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "HR")) redirect("/signin");

  const employees = await getEmployees();
  const activeCount = employees.filter(e => e.isActive).length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Apple & Linear Style Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Personnel Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Manage employee IDs, role permissions, and active status</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 text-slate-700 shadow-2xs">
            Total: {employees.length} ({activeCount} active)
          </span>
        </div>
      </div>

      {/* Register New Employee Card (Sleek Apple Minimalist Box) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#111827] text-white flex items-center justify-center shadow-sm">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-[#111827] text-sm">Onboard New Employee</h2>
              <p className="text-[11px] text-slate-500">System generates ID automatically (e.g. EMP0045) for account linking</p>
            </div>
          </div>
        </div>

        <form action={createEmployee} className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          <div className="md:col-span-1">
            <input 
              name="firstName" 
              placeholder="First Name" 
              className="w-full bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs font-medium text-[#111827] placeholder:text-slate-400 focus:bg-white focus:border-slate-400 outline-none transition-all" 
              required 
            />
          </div>
          <div className="md:col-span-1">
            <input 
              name="lastName" 
              placeholder="Last Name" 
              className="w-full bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs font-medium text-[#111827] placeholder:text-slate-400 focus:bg-white focus:border-slate-400 outline-none transition-all" 
              required 
            />
          </div>
          <div className="md:col-span-1">
            <input 
              name="email" 
              type="email" 
              placeholder="Work Email" 
              className="w-full bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs font-medium text-[#111827] placeholder:text-slate-400 focus:bg-white focus:border-slate-400 outline-none transition-all" 
              required 
            />
          </div>
          <div className="md:col-span-1">
            <select 
              name="role" 
              className="w-full bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs font-medium text-[#111827] focus:bg-white focus:border-slate-400 outline-none transition-all" 
              required
            >
              <option value="EMPLOYEE">Role: Employee</option>
              <option value="HR">Role: HR Manager</option>
              <option value="ADMIN">Role: Admin</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <button 
              type="submit" 
              className="w-full bg-[#111827] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Record</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-[#F3F4F6] border border-slate-200/80 text-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-slate-200/60 transition-colors">
            <span>All departments</span>
            <X className="w-3 h-3 text-slate-400" />
          </div>
          <div className="bg-[#F3F4F6] border border-slate-200/80 text-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-slate-200/60 transition-colors">
            <span>Active status</span>
            <X className="w-3 h-3 text-slate-400" />
          </div>
          <div className="bg-white border border-slate-200/80 text-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 transition-colors shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>More filters</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-xl px-3 py-1.5 w-full sm:w-64 text-xs shadow-2xs focus-within:border-slate-400 transition-colors">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search employee name or ID..." 
            className="bg-transparent border-none outline-none w-full text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* ClientEase Style Staff Directory Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-12 bg-[#FAFAFB] px-6 py-3 text-[11px] font-semibold text-slate-500 border-b border-slate-200/80">
          <div className="col-span-1 flex items-center">
            <CheckSquare className="w-4 h-4 text-[#111827] cursor-pointer" />
          </div>
          <div className="col-span-4">Employee & ID ↓</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Role & Email</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-slate-200/60 text-xs">
          {employees.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No employees found in directory.</div>
          ) : (
            employees.map((emp, idx) => (
              <div key={emp.id} className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-slate-50/60 transition-colors group">
                <div className="col-span-1 flex items-center">
                  {idx === 0 ? (
                    <CheckSquare className="w-4 h-4 text-[#111827] cursor-pointer" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-400 cursor-pointer" />
                  )}
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-[#111827] flex-shrink-0 shadow-2xs">
                    {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#111827] leading-none">{emp.firstName} {emp.lastName}</p>
                    <p className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                      {emp.employeeId}
                    </p>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 border ${
                    emp.isActive 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${emp.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    {emp.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="col-span-3">
                  <span className="bg-[#F4F5F7] border border-slate-200/80 px-2 py-0.5 rounded text-[10px] font-semibold text-[#111827] uppercase tracking-wider">
                    {emp.role}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1 truncate">{emp.email}</p>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-3 text-slate-400">
                  <Trash2 className="w-4 h-4 hover:text-red-500 cursor-pointer transition-colors" />
                  <MoreHorizontal className="w-4 h-4 hover:text-slate-700 cursor-pointer transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Minimalist Pagination Bar */}
        <div className="px-6 py-3.5 bg-[#FAFAFB] border-t border-slate-200/80 flex items-center justify-between text-xs font-medium text-slate-600">
          <button className="px-3.5 py-1.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs hover:bg-slate-50 disabled:opacity-50 transition-all">
            Previous
          </button>
          <span className="text-slate-500 font-semibold">Page 1 of 1</span>
          <button className="px-3.5 py-1.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs hover:bg-slate-50 disabled:opacity-50 transition-all">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}