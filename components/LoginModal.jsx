"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful");

        document.cookie = `token=${data.token}; path=/`;
        document.cookie = `refreshToken=${data.refreshToken}; path=/`;
        document.cookie = `loggedInUser=${encodeURIComponent(JSON.stringify(data.user))}; path=/`;
        window.dispatchEvent(new Event("authChange"));

        if (onLoginSuccess) {
          onLoginSuccess(data.user);
          onClose();
        } else if (data.user && data.user.role === 'ADMIN') {
          window.location.href = '/admin';
        } else if (data.user && data.user.role === 'OWNER') {
          window.location.href = '/owner/dashboard';
        } else {
          onClose();
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className="bg-white/95 backdrop-blur-3xl w-full max-w-md p-10 sm:p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl relative z-10 animate-fadeUp overflow-hidden">
        {/* Glow effects */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-300/10 rounded-full blur-[100px] pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-2xl text-slate-400 hover:text-slate-700 transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 text-blue-600 rounded-[1.50rem] text-3xl mb-6 border border-blue-200 shadow-sm animate-float">
            🔑
          </div>
          <h2 className="text-4xl font-black text-slate-950 tracking-tighter mb-2">
            Welcome <span className="text-blue-600">Back</span>
          </h2>
          <p className="text-slate-500 font-medium text-sm">Sign in to your account</p>
        </div>

        <div className="space-y-6">
           <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 px-6 py-4 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 px-6 py-4 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-400"
            />
            <div className="flex justify-end pr-2">
               <Link href="/forgot-password" onClick={onClose} className="text-[9px] font-black text-slate-500 hover:text-blue-600 uppercase tracking-widest transition-colors">
                 Forgot Password?
               </Link>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="btn-primary w-full mt-10 py-5 rounded-2xl shadow-blue-500/25"
        >
          Sign In
        </button>

        <p className="text-center text-slate-500 mt-8 font-bold uppercase tracking-widest text-[10px]">
          Don't have an account?{" "}
          <Link
            href="/register"
            onClick={onClose}
            className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
