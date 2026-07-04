import Link from "next/link";
import { ArrowRight, Users, Calendar, Banknote, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      
      {/* Navigation Bar */}
      <nav className="w-full px-8 py-6 flex items-center justify-between bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Zyoris HRMS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/signin" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 mb-8">
          Human Resource Management System
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl">
          Zyoris HRMS <br className="hidden md:block" />
          <span className="text-blue-600">Every workday, perfectly aligned.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
          A secure employee management platform for attendance, leave management, payroll, and workforce operations. Designed for modern enterprises.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/signin" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-all active:scale-95 text-lg"
          >
            Sign In
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/signup" 
            className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-white text-slate-700 font-semibold rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 text-lg"
          >
            Sign Up
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full text-left">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Centralized Profiles</h3>
            <p className="text-slate-500 leading-relaxed">Manage your entire workforce from a single secure dashboard with granular role-based access.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Automated Attendance</h3>
            <p className="text-slate-500 leading-relaxed">Real-time clock-in tracking with dynamic calculations for half-days, absences, and leave workflows.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
              <Banknote className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Payroll Engine</h3>
            <p className="text-slate-500 leading-relaxed">Seamlessly generate and securely distribute detailed salary slips directly to employee portals.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center border-t border-slate-200 bg-white">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Zyoris. All rights reserved. Secure Enterprise Portal.
        </p>
      </footer>
    </div>
  );
}