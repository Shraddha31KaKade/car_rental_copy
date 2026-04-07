"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar({ onLoginClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (user) {
      setLoggedInUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    alert("Logged out successfully");
  };

  return (
    <nav className="fixed top-0 w-full z-[100] transition-all duration-500 glass-nav py-4">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-500 overflow-hidden">
             🏎️
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase flex items-baseline">
            Car<span className="text-indigo-500 italic lowercase">Rental</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-sm font-bold text-slate-100 hover:text-indigo-400 transition-colors uppercase tracking-widest">Home</Link>
          <Link href="/cars" className="text-sm font-bold text-slate-400 hover:text-indigo-400 transition-colors uppercase tracking-widest">Fleet</Link>
          <Link href="/booking" className="text-sm font-bold text-slate-400 hover:text-indigo-400 transition-colors uppercase tracking-widest">My Journeys</Link>
          <Link href="/list-cars" className="text-sm font-bold text-slate-400 hover:text-indigo-400 transition-colors uppercase tracking-widest">List Your Car</Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          {loggedInUser ? (
            <div className="flex items-center gap-6">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Welcome, <span className="text-indigo-400">{loggedInUser.name || loggedInUser.email}</span></span>
              <button 
                onClick={handleLogout}
                className="text-sm font-black text-rose-500 hover:text-rose-400 transition-colors uppercase tracking-widest"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="btn-primary py-3 px-8 text-sm"
            >
              Member Access
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-3xl border-t border-white/5 p-8 animate-fadeIn">
          <div className="flex flex-col gap-6 text-center">
            <Link href="/" className="text-xl font-black text-white" onClick={toggleMobileMenu}>Home</Link>
            <Link href="/cars" className="text-xl font-black text-slate-400" onClick={toggleMobileMenu}>Fleet</Link>
            <Link href="/booking" className="text-xl font-black text-slate-400" onClick={toggleMobileMenu}>My Journeys</Link>
            <Link href="/list-cars" className="text-xl font-black text-slate-400" onClick={toggleMobileMenu}>List Your Car</Link>
            {loggedInUser ? (
              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 text-rose-500 font-bold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="btn-primary w-full py-4 text-lg"
              >
                Member Access
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}