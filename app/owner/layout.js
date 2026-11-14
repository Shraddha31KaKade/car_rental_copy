"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTachometerAlt, FaCar, FaBell, FaClipboardList } from "react-icons/fa";

export default function OwnerLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/owner/dashboard", icon: <FaTachometerAlt /> },
    { name: "My Fleet", href: "/owner/my-cars", icon: <FaCar /> },
    { name: "Requests", href: "/owner/requests", icon: <FaClipboardList /> },
    { name: "Alerts", href: "/owner/notifications", icon: <FaBell /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-12 flex relative isolate overflow-hidden">
      {/* Background Blobs */}
      <div className="bg-blob blob-blue top-0 left-[10%] opacity-20"></div>
      
      <div className="max-w-7xl mx-auto w-full px-6 flex flex-col md:flex-row gap-8 relative z-10">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sticky top-32 shadow-md">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Host Portal</h2>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-widest ${
                      isActive 
                        ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <span className="text-lg opacity-80">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-grow">
          <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl min-h-[500px]">
             {children}
          </div>
        </div>

      </div>
    </div>
  );
}
