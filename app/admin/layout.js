"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CopyPlus, LayoutDashboard, FileText, Settings, Users, ArrowLeft, Car } from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Fleet Management", href: "/admin/cars", icon: Car },
    { name: "Verifications", href: "/admin/verifications", icon: FileText },
    { name: "System Settings", href: "/admin/settings", icon: Settings },
    { name: "User Management", href: "/admin/users", icon: Users },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col pt-8 pb-4">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
             <CopyPlus size={18} />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight text-slate-900">Admin Suite</h2>
            <p className="text-xs text-slate-500">Control Panel</p>
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
                    ? "bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.2)] text-white" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-auto mb-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-slate-100 text-blue-600 hover:text-white hover:bg-blue-600 transition-all duration-500 font-black text-xs uppercase tracking-widest border border-slate-200 hover:border-blue-600 shadow-sm"
          >
            <ArrowLeft size={16} /> Back to Website
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
