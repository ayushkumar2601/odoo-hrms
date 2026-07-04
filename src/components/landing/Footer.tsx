"use client";

import React from "react";
import { Globe, Link2, GitBranch, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white text-gray-900 font-sans relative z-10 border-t border-gray-100 overflow-hidden">
      
      {/* Top Centered Content */}
      <div className="pt-20 sm:pt-28 pb-8 text-center px-6 max-w-5xl mx-auto">
        <p className="text-gray-500 font-medium text-sm sm:text-base mb-1.5">
          India&apos;s Intelligent Business OS.
        </p>
        <p className="text-gray-600 font-medium text-sm sm:text-base mb-8">
          One platform for HR, Attendance, Payroll and Operations.
        </p>

        {/* Icons Row */}
        <div className="flex items-center justify-center gap-6 mb-10 text-gray-400">
          <Globe className="w-4 h-4 sm:w-5 sm:h-5 hover:text-black hover:scale-110 transition-all cursor-pointer" />
          <Link2 className="w-4 h-4 sm:w-5 sm:h-5 hover:text-black hover:scale-110 transition-all cursor-pointer" />
          <GitBranch className="w-4 h-4 sm:w-5 sm:h-5 hover:text-black hover:scale-110 transition-all cursor-pointer" />
          <Mail className="w-4 h-4 sm:w-5 sm:h-5 hover:text-black hover:scale-110 transition-all cursor-pointer" />
        </div>

        {/* Navigation Links Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-gray-500">
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
          <a href="#about" className="hover:text-black transition-colors">About</a>
          <a href="#careers" className="hover:text-black transition-colors">Careers</a>
          <a href="#privacy" className="hover:text-black transition-colors">Privacy</a>
          <a href="#contact" className="hover:text-black transition-colors">Contact</a>
        </div>
      </div>

      {/* Massive Background Hero Word ("ZINDLE") */}
      <div className="relative w-full overflow-hidden flex items-center justify-center select-none pointer-events-none mt-8 sm:mt-12 -mb-2 sm:-mb-6">
        <span className="text-[18vw] font-bold tracking-tighter uppercase leading-[0.82] bg-gradient-to-b from-gray-200/90 to-gray-100/30 bg-clip-text text-transparent text-center w-full block">
          ZINDLE
        </span>
      </div>

      {/* Bottom Copyright & Credits Bar */}
      <div className="border-t border-gray-100 py-6 px-6 text-[11px] sm:text-xs text-gray-400 font-medium bg-white relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>Zindle. All rights reserved.</div>
          <div>Built in India.</div>
          <div>Crafted by Ayush with ❤️</div>
        </div>
      </div>

    </footer>
  );
}
