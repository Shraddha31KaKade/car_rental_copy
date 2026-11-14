"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to initiate password reset.");
      }
    } catch (err) {
      alert("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-sky-300/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-10 sm:p-14 relative z-10 shadow-2xl">
        <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl text-2xl mb-6 border border-blue-200 shadow-sm">
             ✉️
           </div>
           <h1 className="text-3xl font-black text-slate-950 tracking-tighter mb-2 uppercase">Forgot Password</h1>
           <p className="text-slate-500 text-sm font-medium">Enter your email address to receive a password reset link.</p>
        </div>

        {isSubmitted ? (
          <div className="text-center animate-fadeIn">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-8">
               <p className="text-slate-900 font-bold mb-2">Reset Link Sent</p>
               <p className="text-slate-600 text-xs leading-relaxed">If an account exists for {email}, a password reset link has been sent to your email inbox.</p>
            </div>
            <Link href="/" className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:text-blue-700 transition-colors">
              Return to Home →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <div className="text-center">
               <Link href="/" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors">
                 Back to Sign In
               </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
