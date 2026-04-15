"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CopyPlus, LayoutDashboard, FileText, Settings, Users, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Verifications", href: "/admin/verifications", icon: FileText },
    { name: "System Settings", href: "/admin/settings", icon: Settings },
    { name: "User Management", href: "/admin/users", icon: Users },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-[#f8fafc]">
      {/* Sidebar - Stitch Inspired Dark Theme */}
      <aside className="w-64 bg-[#0f172a] border-r border-white/5 flex flex-col pt-8 pb-4">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
             <CopyPlus size={18} />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight">Admin Suite</h2>
            <p className="text-xs text-slate-400">Control Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            const Icon = link.icon;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive 
                    ? "bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.2)] text-white" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-auto">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors font-medium border border-transparent hover:border-white/10"
          >
            <ArrowLeft size={18} /> Back to Portal
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background-base">
        {children}
      </main>
    </div>
  );
}
