"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) setToken(t);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Security keys do not match.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });

      if (res.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update security key.");
      }
    } catch (err) {
      alert("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center p-12 bg-rose-500/10 border border-rose-500/20 rounded-3xl">
        <p className="text-rose-500 font-bold mb-4 uppercase tracking-widest text-xs">Access Denied</p>
        <p className="text-slate-400 text-sm mb-8">Invalid or missing security token for this operation.</p>
        <Link href="/" className="btn-primary">Return to Base</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[2.5rem] p-10 sm:p-14 backdrop-blur-3xl relative z-10">
      <div className="text-center mb-10">
         <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl text-2xl mb-6 border border-indigo-500/20">
           🛡️
         </div>
         <h1 className="text-3xl font-black text-white tracking-tighter mb-3 uppercase">Update Credentials</h1>
         <p className="text-slate-400 text-sm font-medium">Re-authorize your account with a new security key.</p>
      </div>

      {isSubmitted ? (
        <div className="text-center animate-fadeIn">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 mb-8">
             <p className="text-white font-bold mb-2">Security Key Updated</p>
             <p className="text-slate-400 text-xs">Your credentials have been re-calibrated. Redirecting to home site...</p>
          </div>
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Security Key</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-black/30 border border-white/5 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Security Key</label>
            <input 
              type="password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-black/30 border border-white/5 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-indigo-500/50 transition-colors" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50"
          >
            {loading ? "Calibrating..." : "Update Security Key"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-violet-600/10 rounded-full blur-[120px]"></div>
      <Suspense fallback={<div className="text-white uppercase font-black tracking-widest animate-pulse">Initializing Security Protocol...</div>}>
         <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
