"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import GlobalAnnouncement from "./GlobalAnnouncement";

export default function Navbar({ onLoginClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  useEffect(() => {
    const checkUser = async () => {
      const token = getCookie("token");
      if (!token) {
        setLoggedInUser(null);
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLoggedInUser(data.user);
          // Sync to session cookie (clears when browser closes)
          document.cookie = `loggedInUser=${encodeURIComponent(JSON.stringify(data.user))}; path=/`;
        }
      } catch (err) {
        console.error("Failed to fetch user context", err);
      }
    };
    
    // Sync function to read directly from cookies
    const syncLocal = () => {
      const localUser = getCookie("loggedInUser");
      if (localUser) {
        try {
          const userStr = decodeURIComponent(localUser);
          setLoggedInUser(JSON.parse(userStr));
        } catch(e) {}
      } else {
        setLoggedInUser(null);
      }
    };

    const handleAuthChange = () => {
      syncLocal();
      checkUser();
    };

    window.addEventListener("authChange", handleAuthChange);
    
    syncLocal();
    checkUser();

    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";
    document.cookie = "loggedInUser=; path=/; max-age=0";
    setLoggedInUser(null);
    window.dispatchEvent(new Event("authChange"));
    alert("Logged out successfully");
    
    if (window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/owner")) {
      window.location.href = "/";
    }
  };

  return (
    <div className="fixed top-0 w-full z-[100] transition-all duration-500 flex flex-col">
      <GlobalAnnouncement />
      <nav className="w-full glass-nav py-4">
        <div className="max-w-[90rem] mx-auto px-6 flex items-center justify-between gap-4 lg:gap-8">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <img 
            src="/logo.png" 
            alt="CarRental Logo" 
            className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Fallback to text if image not found
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <span className="text-2xl font-black tracking-tighter text-slate-900 hidden md:flex items-baseline">
            car<span className="text-blue-600">Rental</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-10 flex-1 justify-center">
          <Link href="/" className="text-xs lg:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-widest whitespace-nowrap">Home</Link>
          <Link href="/cars" className="text-xs lg:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-widest whitespace-nowrap">Fleet</Link>
          <Link href="/services" className="text-xs lg:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-widest whitespace-nowrap">Services</Link>
          <Link href="/booking" className="text-xs lg:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-widest whitespace-nowrap">My Journeys</Link>
          <Link href="/list-cars" className="text-xs lg:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-widest whitespace-nowrap">List Your Car</Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-6 flex-shrink-0 justify-end">
          {loggedInUser?.role === "ADMIN" && (
            <Link href="/admin" className="bg-blue-600 hover:bg-blue-500 text-white py-2.5 lg:py-3 px-4 lg:px-6 rounded-2xl text-[11px] lg:text-xs font-black shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all uppercase tracking-widest border border-white/10 flex items-center gap-2">
               <span className="text-sm">🛡️</span> Admin Portal
            </Link>
          )}

          {loggedInUser?.role === "OWNER" && (
            <Link href="/owner/dashboard" className="btn-outline py-2 lg:py-2.5 px-4 lg:px-6 text-[11px] lg:text-xs">
               Owner Dashboard
            </Link>
          )}

          {loggedInUser ? (
            <div className="flex items-center gap-4 lg:gap-6">
              <span className="text-[11px] lg:text-xs font-black text-slate-600 uppercase tracking-widest">Welcome, <span className="text-blue-600">{loggedInUser.name || loggedInUser.email}</span></span>
              <button 
                onClick={handleLogout}
                className="text-xs lg:text-sm font-black text-rose-600 hover:text-rose-700 transition-colors uppercase tracking-widest"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="btn-primary py-2.5 lg:py-3 px-5 lg:px-8 text-xs lg:text-sm"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-900 p-2"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-3xl border-t border-slate-200 p-8 animate-fadeIn shadow-2xl">
          <div className="flex flex-col gap-6 text-center">
            <Link href="/" className="text-xl font-bold text-slate-900 hover:text-blue-600" onClick={toggleMobileMenu}>Home</Link>
            <Link href="/cars" className="text-xl font-bold text-slate-700 hover:text-blue-600" onClick={toggleMobileMenu}>Fleet</Link>
            <Link href="/services" className="text-xl font-bold text-slate-700 hover:text-blue-600" onClick={toggleMobileMenu}>Services</Link>
            <Link href="/booking" className="text-xl font-bold text-slate-700 hover:text-blue-600" onClick={toggleMobileMenu}>My Journeys</Link>
            <Link href="/list-cars" className="text-xl font-bold text-slate-700 hover:text-blue-600" onClick={toggleMobileMenu}>List Your Car</Link>

            {loggedInUser?.role === "ADMIN" && (
              <Link 
                href="/admin" 
                className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                onClick={toggleMobileMenu}
              >
                <span>🛡️</span> Admin Portal
              </Link>
            )}

            {loggedInUser?.role === "OWNER" && (
              <Link 
                href="/owner/dashboard" 
                className="btn-outline py-3 px-6 text-sm font-bold text-blue-600 border border-blue-500/30 rounded-2xl uppercase tracking-widest"
                onClick={toggleMobileMenu}
              >
                Owner Dashboard
              </Link>
            )}

            {loggedInUser ? (
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-600 mb-3 uppercase tracking-widest font-black">
                  Signed in as <span className="text-blue-600">{loggedInUser.name || loggedInUser.email}</span>
                </p>
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 text-rose-600 hover:text-rose-700 font-bold uppercase tracking-widest text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { toggleMobileMenu(); onLoginClick(); }}
                className="btn-primary w-full py-4 text-lg"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
      </nav>
    </div>
  );
}