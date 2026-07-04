"use client";

import React from "react";
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  BarChart3, 
  Users, 
  Zap,
  Check,
  X,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export function FeatureSections() {
  return (
    <div className="bg-white text-[#111827] font-sans relative z-10 pt-20 sm:pt-32">
      
      {/* 1. Chaos vs Clarity Section */}
      <section className="max-w-4xl mx-auto px-6 text-center py-16 sm:py-24 border-b border-gray-100">
        <h2 className="text-4xl sm:text-6xl font-normal tracking-tight leading-[1.1] text-gray-900 mb-8 sm:mb-12">
          Most businesses<br />
          run on chaos.<br />
          <span className="font-bold text-black">Not clarity.</span>
        </h2>

        <div className="space-y-2 text-base sm:text-lg text-gray-500 font-medium max-w-xl mx-auto mb-16">
          <p>Sales lives in one tool.</p>
          <p>HR lives in another.</p>
          <p>Finance lives somewhere else.</p>
          <p className="pt-2 text-gray-800 font-semibold">
            Leadership spends hours chasing answers that should take seconds.
          </p>
        </div>

        <div className="w-16 h-px bg-gray-200 mx-auto mb-16" />

        <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-black mb-8">
          Zindle changes that.
        </h3>

        <div className="space-y-2 text-lg sm:text-xl font-medium text-gray-800 max-w-lg mx-auto">
          <p>One platform.</p>
          <p>One source of truth.</p>
          <p className="text-black font-bold">One intelligence layer across everything.</p>
        </div>
      </section>

      {/* 2. Everything Connected Cards Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Everything. Connected.
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            HR. Attendance. Payroll. AI Copilot. <span className="font-bold text-black">Finally working together.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1 */}
          <div className="rounded-2xl bg-[#FAFAFB] border border-gray-200 p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:border-black hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2">HR & TELEMETRY</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Attendance & People</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Track every shift with full lifecycle history. AI scores attendance regularity so your team always knows who is on active duty and who is on leave.
              </p>
            </div>
            
            {/* Miniature UI Mockup */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-gray-900 font-bold">Acme Engineering</span>
                <span className="text-black font-bold">96% Present</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-black h-full w-[96%]" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                <span>124 Active Staff</span>
                <span>3 Leaves Review</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl bg-[#FAFAFB] border border-gray-200 p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:border-black hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2">ROLE-BASED PERIMETER</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Role-Based Dashboards</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                CEO. CFO. HR Manager — everyone gets their own live view tailored to strict RBAC boundaries. No spreadsheets. No security leaks.
              </p>
            </div>

            {/* Miniature UI Mockup */}
            <div className="relative h-32 bg-white rounded-xl border border-gray-200 p-4 shadow-2xs overflow-hidden">
              <div className="text-xs font-bold text-gray-900 mb-1">Executive Overview</div>
              <div className="text-[11px] text-gray-500 mb-3">Monthly payroll run rate</div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">₹48,20,000</span>
                <span className="text-xs font-bold text-black bg-gray-100 border border-gray-300 px-2 py-0.5 rounded">High Confidence</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl bg-[#FAFAFB] border border-gray-200 p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:border-black hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2">GROQ LPU ENGINE</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Intelligence</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Zindle doesn&apos;t just show static tables. It tells you exactly what action to take — right now — with interactive confirmation cards.
              </p>
            </div>

            {/* Miniature UI Mockup */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs space-y-2">
              <div className="bg-black text-white text-[11px] font-medium p-2.5 rounded-lg flex items-center justify-between">
                <span>Approve EMP0045 sick leave?</span>
                <span className="bg-white text-black px-2 py-0.5 rounded text-[10px] font-bold">Confirm</span>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-medium">Sub-300ms verification via Llama-3.3-70B</div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Real Results Testimonial & Metrics Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24 border-t border-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-3">
            Real results with Zindle
          </h2>
          <p className="text-base sm:text-lg text-gray-500">
            From growing SMBs to enterprises — Zindle gives every team the clarity to move faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Top Left Mockup Card (7 cols) */}
          <div className="md:col-span-7 rounded-2xl bg-black text-white p-6 sm:p-8 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-800">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <span className="text-xs text-white/60 ml-2 font-mono">zindle.ai / telemetry</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-time visibility across every shift</h3>
              <p className="text-sm text-white/80 leading-relaxed mb-6">
                &ldquo;With Zindle, our HR team stopped guessing. Every leave request is tracked, every payroll is automated, and our AI Copilot tells us exactly which action to take next. We reduced administrative friction by over 70% in our first quarter.&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-white/20 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">Rohan Mehta</div>
                <div className="text-xs text-white/60">Founder & CEO, Acme Technologies</div>
              </div>
              <span className="text-xs font-bold text-black bg-white px-3 py-1 rounded-full">
                Enterprise Case Study
              </span>
            </div>
          </div>

          {/* Top Right Stat Box (5 cols) */}
          <div className="md:col-span-5 rounded-2xl bg-[#FAFAFB] border border-gray-200 p-6 sm:p-8 flex flex-col justify-center space-y-8 hover:shadow-xl hover:border-black hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-black mb-1">40%</div>
              <div className="text-sm font-bold text-gray-900">Faster HR Decisions</div>
              <div className="text-xs text-gray-500 mt-0.5">Across all departments and leave approvals</div>
            </div>
            <div className="w-full h-px bg-gray-200" />
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-black mb-1">3x</div>
              <div className="text-sm font-bold text-gray-900">Faster Payroll Dispersal</div>
              <div className="text-xs text-gray-500 mt-0.5">First quarter after switching to Zindle OS</div>
            </div>
          </div>

          {/* Bottom Left Stat Box (4 cols) */}
          <div className="md:col-span-4 rounded-2xl bg-[#FAFAFB] border border-gray-200 p-6 sm:p-8 flex flex-col justify-center space-y-6 hover:shadow-xl hover:border-black hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="text-4xl font-bold text-black mb-1">3.5×</div>
              <div className="text-sm font-bold text-gray-900">Efficiency Gain</div>
              <div className="text-xs text-gray-500">Across daily administrative workflows</div>
            </div>
            <div className="w-full h-px bg-gray-200" />
            <div>
              <div className="text-4xl font-bold text-black mb-1">70%</div>
              <div className="text-sm font-bold text-gray-900">Reduced Manual Errors</div>
              <div className="text-xs text-gray-500">In attendance auditing and pay slips</div>
            </div>
          </div>

          {/* Bottom Middle Card (4 cols) */}
          <div className="md:col-span-4 rounded-2xl bg-[#FAFAFB] border border-gray-200 p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:border-black hover:-translate-y-1 transition-all duration-300">
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">One platform replaced five separate tools</h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                &ldquo;HR used to mean five browser tabs, three spreadsheets, and weekly catchups just to know who was on leave. Zindle gave everyone a live view. Our overhead dropped by half and adoption was instant.&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="text-xs font-bold text-gray-900">Sophie Patel</div>
              <div className="text-[11px] text-gray-500">Operations Head, Info42 India</div>
            </div>
          </div>

          {/* Bottom Right Card (4 cols) */}
          <div className="md:col-span-4 rounded-2xl bg-black text-white p-6 sm:p-8 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-800">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-white/80">AI Copilot Action</span>
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
              <h4 className="text-lg font-bold mb-2">AI that actually tells you what to do next</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                No more digging through chart data. Zindle flags attendance bottlenecks and leave overlaps before they impact shipping deadlines.
              </p>
            </div>
            <div className="pt-4 border-t border-white/20 flex items-center justify-between mt-6">
              <div>
                <div className="text-3xl font-bold text-white">2×</div>
                <div className="text-xs text-white/60">Faster Onboarding</div>
              </div>
              <Link href="/signin" className="bg-white text-black hover:bg-gray-200 text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors">
                Try Now →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Monochromatic AI Action Recommendations Section */}
      <section className="bg-black text-white py-24 sm:py-32 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
            AI that tells you<br />what to do next.
          </h2>
          <p className="text-base sm:text-xl text-white/60 font-medium">
            Most software tells you what happened.<br />
            <span className="text-white font-bold">Zindle tells you what action to take.</span>
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Action Box 1 */}
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-5 hover:border-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold tracking-wider text-black bg-white px-2 py-0.5 rounded flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                URGENT
              </span>
              <span className="text-xs font-semibold text-white/50">98% confidence</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Approve EMP0045 Sick Leave now.</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Medical document verified. Employee shift starts in 14 hours. Replacement personnel identified.
            </p>
          </div>

          {/* Action Box 2 */}
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-5 hover:border-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold tracking-wider text-black bg-white px-2 py-0.5 rounded flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                URGENT
              </span>
              <span className="text-xs font-semibold text-white/50">99% confidence</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Payroll run rate below budget target.</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Monthly dispersal ₹48.2L is within safe liquidity threshold. Execute automated bank disbursement?
            </p>
          </div>

          {/* Action Box 3 */}
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-5 hover:border-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold tracking-wider text-white bg-gray-800 border border-gray-700 px-2 py-0.5 rounded flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                MEDIUM
              </span>
              <span className="text-xs font-semibold text-white/50">92% confidence</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Review overdue leave reviews.</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              3 requests from engineering team pending for over 48 hours. Click confirm to batch approve.
            </p>
          </div>

          {/* Action Box 4 */}
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-5 hover:border-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold tracking-wider text-white bg-gray-800 border border-gray-700 px-2 py-0.5 rounded flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                MEDIUM
              </span>
              <span className="text-xs font-semibold text-white/50">88% confidence</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">High-performing engineer at risk.</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Overtime hours exceeded 18% this month. Schedule 1-on-1 check-in to prevent burnout.
            </p>
          </div>

          {/* Action Box 5 */}
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-5 hover:border-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold tracking-wider text-white/80 bg-gray-900 border border-gray-800 px-2 py-0.5 rounded flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                ROUTINE
              </span>
              <span className="text-xs font-semibold text-white/50">95% confidence</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Attendance rate optimal at 94%.</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              No anomalies detected across 4 regional branches. Telemetry sync complete.
            </p>
          </div>

          {/* Action Box 6 */}
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-5 hover:border-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold tracking-wider text-white/80 bg-gray-900 border border-gray-800 px-2 py-0.5 rounded flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                ROUTINE
              </span>
              <span className="text-xs font-semibold text-white/50">91% confidence</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Generate Q3 Workforce Report.</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              All monthly ledgers reconciled. Click here to download executive PDF summary.
            </p>
          </div>

        </div>
      </section>

      {/* 5. Built for India / Built for Enterprise Comparison Table */}
      <section className="max-w-5xl mx-auto px-6 py-20 sm:py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-3">
            Built for India.<br />Not adapted for it.
          </h2>
          <p className="text-base sm:text-lg text-gray-500">
            Every alternative has a fatal flaw. Zindle is built from the ground up to fix all of them.
          </p>
        </div>

        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          
          {/* Row 1 */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-gray-50 px-4 rounded-xl transition-colors duration-200">
            <div className="md:col-span-3">
              <span className="text-lg font-bold text-gray-500">Workday & SAP</span>
            </div>
            <div className="md:col-span-9">
              <span className="text-[10px] font-bold tracking-wider text-black bg-gray-200 px-2.5 py-0.5 rounded uppercase mr-2 border border-gray-300">THE PROBLEM</span>
              <span className="text-base font-bold text-gray-900">Legacy ERPs are too expensive and bloated.</span>
              <p className="text-sm text-gray-600 mt-1">
                Enterprise pricing puts it out of reach for 95% of growing businesses. You pay millions for complex features your HR team will never use.
              </p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-gray-50 px-4 rounded-xl transition-colors duration-200">
            <div className="md:col-span-3">
              <span className="text-lg font-bold text-gray-500">Zoho & BambooHR</span>
            </div>
            <div className="md:col-span-9">
              <span className="text-[10px] font-bold tracking-wider text-black bg-gray-200 px-2.5 py-0.5 rounded uppercase mr-2 border border-gray-300">THE PROBLEM</span>
              <span className="text-base font-bold text-gray-900">Too fragmented and disconnected.</span>
              <p className="text-sm text-gray-600 mt-1">
                Dozens of disconnected apps create more administrative work than they save. Your managers end up reverting to Excel sheets.
              </p>
            </div>
          </div>

          {/* Row 3 */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-gray-50 px-4 rounded-xl transition-colors duration-200">
            <div className="md:col-span-3">
              <span className="text-lg font-bold text-gray-500">Spreadsheets</span>
            </div>
            <div className="md:col-span-9">
              <span className="text-[10px] font-bold tracking-wider text-black bg-gray-200 px-2.5 py-0.5 rounded uppercase mr-2 border border-gray-300">THE PROBLEM</span>
              <span className="text-base font-bold text-gray-900">Spreadsheets create total chaos.</span>
              <p className="text-sm text-gray-600 mt-1">
                Version control nightmares. Manual formula errors. Zero audit logs. No growing enterprise should run on Excel in 2026.
              </p>
            </div>
          </div>

          {/* Row 4: ZINDLE */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-100 -mx-4 px-6 rounded-2xl border border-gray-300 shadow-sm">
            <div className="md:col-span-3 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-black text-white font-bold flex items-center justify-center text-xs">
                Z
              </div>
              <span className="text-xl font-bold text-black tracking-tight">ZINDLE</span>
            </div>
            <div className="md:col-span-9">
              <span className="text-[10px] font-bold tracking-wider text-white bg-black px-2.5 py-0.5 rounded uppercase mr-2">THE ANSWER</span>
              <span className="text-lg font-bold text-black">One platform. One source of truth.</span>
              <p className="text-sm text-gray-800 mt-1 font-medium">
                Built from the ground up for how modern Indian and global enterprises actually work — not adapted, not translated. Native AI Copilot included.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Big Stats Footer Row */}
      <section className="border-t border-gray-200 py-16 sm:py-20 bg-[#FAFAFB]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl sm:text-6xl font-bold text-black mb-1">63M+</div>
            <div className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">SMBs & Teams in India</div>
          </div>
          <div className="hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl sm:text-6xl font-bold text-black mb-1">80%</div>
            <div className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">Under-served by legacy ERPs</div>
          </div>
          <div className="hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl sm:text-6xl font-bold text-black mb-1">1/3</div>
            <div className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">Cost of Workday & SAP</div>
          </div>
          <div className="hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl sm:text-6xl font-bold text-black mb-1">10×</div>
            <div className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">Faster than spreadsheets</div>
          </div>
        </div>
      </section>

      {/* Footer Copyright */}
      <footer className="bg-white border-t border-gray-200 py-10 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-black text-white font-bold flex items-center justify-center text-[10px]">
              Z
            </div>
            <span className="font-bold text-black">Zindle HRMS</span>
            <span>— Powered by Zindle AI Copilot 2.0</span>
          </div>
          <div className="font-medium">
            &copy; {new Date().getFullYear()} Zindle Inc. All rights reserved. Built with Next.js 16 & Groq LPU.
          </div>
        </div>
      </footer>
    </div>
  );
}
