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
      alert("Passwords do not match.");
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
        alert(data.error || "Failed to reset password.");
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
        <p className="text-rose-500 font-bold mb-4 uppercase tracking-widest text-xs">Invalid Reset Link</p>
        <p className="text-slate-400 text-sm mb-8">This password reset link is invalid or has expired.</p>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-10 sm:p-14 relative z-10 shadow-2xl">
      <div className="text-center mb-10">
         <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl text-2xl mb-6 border border-blue-200 shadow-sm">
           🔒
         </div>
         <h1 className="text-3xl font-black text-slate-950 tracking-tighter mb-2 uppercase">Reset Password</h1>
         <p className="text-slate-500 text-sm font-medium">Enter your new password below.</p>
      </div>

      {isSubmitted ? (
        <div className="text-center animate-fadeIn">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 mb-8">
             <p className="text-emerald-900 font-bold mb-2">Password Updated</p>
             <p className="text-emerald-700 text-xs">Your password has been reset successfully. Redirecting to home...</p>
          </div>
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">New Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password" 
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Confirm Password</label>
            <input 
              type="password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password" 
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-sky-300/10 rounded-full blur-[120px] pointer-events-none"></div>
      <Suspense fallback={<div className="text-slate-900 uppercase font-black tracking-widest animate-pulse">Loading...</div>}>
         <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
