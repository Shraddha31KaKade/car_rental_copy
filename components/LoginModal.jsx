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
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful");

        localStorage.setItem("token", data.token);
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));

        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }

        onClose();
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
        className="absolute inset-0 bg-[#020617]/80 backdrop-blur-xl animate-fadeIn"
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className="bg-slate-900/40 backdrop-blur-3xl w-full max-w-md p-10 sm:p-12 rounded-[3.5rem] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative z-10 animate-fadeUp overflow-hidden">
        {/* Glow effects */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px]"></div>

        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-2xl text-slate-500 hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-[1.50rem] text-3xl mb-8 border border-indigo-500/20 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)] animate-float">
            🗝️
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-3">
            Welcome <span className="text-indigo-500">Back</span>
          </h2>
          <p className="text-slate-400 font-medium">Authorize your next escape</p>
        </div>

        <div className="space-y-6">
           <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email Access</label>
            <input
              type="email"
              name="email"
              placeholder="concierge@carescape.app"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/5 px-6 py-5 rounded-2xl focus:outline-none focus:border-indigo-500/40 transition-all font-bold text-white placeholder:text-slate-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Security Key</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/5 px-6 py-5 rounded-2xl focus:outline-none focus:border-indigo-500/40 transition-all font-bold text-white placeholder:text-slate-700"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="btn-primary w-full mt-12 py-5 rounded-2xl shadow-indigo-500/20"
        >
          Verify Access
        </button>

        <p className="text-center text-slate-500 mt-10 font-bold uppercase tracking-widest text-[10px]">
          New to the Collective?{" "}
          <Link
            href="/register"
            onClick={onClose}
            className="text-indigo-500 font-bold hover:text-indigo-400 transition-colors"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
