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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-violet-600/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[2.5rem] p-10 sm:p-14 backdrop-blur-3xl relative z-10">
        <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl text-2xl mb-6 border border-indigo-500/20">
             📡
           </div>
           <h1 className="text-3xl font-black text-white tracking-tighter mb-3 uppercase">Reset Access</h1>
           <p className="text-slate-400 text-sm font-medium">Transmit your email to receive a recovery link.</p>
        </div>

        {isSubmitted ? (
          <div className="text-center animate-fadeIn">
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-8 mb-8">
               <p className="text-white font-bold mb-2">Transmission Successful</p>
               <p className="text-slate-400 text-xs leading-relaxed">If an account exists for {email}, a reset link has been dispatched to your subspace relay (inbox).</p>
            </div>
            <Link href="/" className="text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
              Return to Base →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Personnel Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@enterprise.com" 
                className="w-full bg-black/30 border border-white/5 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50"
            >
              {loading ? "Transmitting..." : "Send Recovery Link"}
            </button>
            <div className="text-center">
               <Link href="/" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                 Cancel Mission
               </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
