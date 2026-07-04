"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "./Logo";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="animate-fade-down relative z-20">
      <nav className="flex items-center justify-between px-5 sm:px-8 lg:px-10 py-4 sm:py-5 max-w-[1440px] mx-auto">
        {/* Logo Left */}
        <Link href="/" className="flex items-center gap-2.5 text-gray-900 group">
          <Logo className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 group-hover:scale-105 transition-transform" />
          <span className="font-bold text-lg sm:text-xl tracking-tight text-gray-900">Zindle</span>
        </Link>

        {/* Desktop Nav Links Center */}
        <div className="hidden md:flex items-center gap-8 text-[13px] text-gray-700 font-medium">
          <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors cursor-pointer outline-none">
            <span>Toolkit</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>
          <a href="#plans" className="hover:text-gray-900 transition-colors">
            Plans
          </a>
          <a href="#news" className="hover:text-gray-900 transition-colors">
            News
          </a>
        </div>

        {/* CTA + Hamburger Right */}
        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="bg-black text-white text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-gray-800 shadow-xs hover:shadow-md hover:scale-105 transition-all duration-300"
          >
            Sign In
          </Link>
          
          {/* Hamburger below md */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-9 h-9 rounded-full text-gray-900 hover:bg-gray-900/10 flex items-center justify-center transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="absolute left-4 right-4 top-full mt-2 rounded-2xl bg-white/90 backdrop-blur-xl ring-1 ring-gray-200 px-5 py-3 animate-fade-up shadow-xl md:hidden">
            <div className="flex flex-col">
              <a
                href="#toolkit"
                onClick={() => setIsOpen(false)}
                className="text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-200 py-2.5 font-medium flex items-center justify-between"
              >
                <span>Toolkit</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="#plans"
                onClick={() => setIsOpen(false)}
                className="text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-200 py-2.5 font-medium"
              >
                Plans
              </a>
              <a
                href="#news"
                onClick={() => setIsOpen(false)}
                className="text-[15px] text-gray-700 hover:text-gray-900 py-2.5 font-medium"
              >
                News
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
