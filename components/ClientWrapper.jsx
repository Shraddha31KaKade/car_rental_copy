"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import LoginModal from "./LoginModal";
import Footer from "./Footer";

export default function ClientWrapper({ children }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const pathname = usePathname();

  // Hide Navbar & Footer for all /admin/* and /owner/* routes
  // Admin panel has its own sidebar navigation; owner panel has its own layout
  const isAdminRoute = pathname?.startsWith("/admin");
  const isOwnerRoute = pathname?.startsWith("/owner");
  const hideChrome = isAdminRoute || isOwnerRoute;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar — hidden on admin and owner panel pages */}
      {!hideChrome && (
        <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      )}

      {/* Page Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer — hidden on admin and owner panel pages */}
      {!hideChrome && <Footer />}

      {/* Login Modal */}
      {isLoginOpen && (
        <LoginModal onClose={() => setIsLoginOpen(false)} />
      )}
    </div>
  );
}
