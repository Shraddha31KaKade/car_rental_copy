"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import LoginModal from "./LoginModal";
import Footer from "./Footer";

export default function ClientWrapper({ children }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />

      {/* Page Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer (GLOBAL) */}
      <Footer />

      {/* Login Modal */}
      {isLoginOpen && (
        <LoginModal onClose={() => setIsLoginOpen(false)} />
      )}
    </div>
  );
}
