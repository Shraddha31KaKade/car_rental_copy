"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Register API call
  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registered successfully 🎉");
        router.push("/");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 pt-20 relative overflow-hidden isolate">
      {/* Background Blobs */}
      <div className="bg-blob blob-indigo top-[-10%] left-[-10%] opacity-20"></div>
      <div className="bg-blob blob-violet bottom-[-10%] right-[-10%] opacity-20"></div>

      <div className="bg-slate-900/40 backdrop-blur-3xl w-full max-w-md p-10 sm:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl animate-fadeUp relative z-10">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-[1.50rem] text-3xl mb-8 border border-indigo-500/20 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)] animate-float">
            ✨
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-3">
            Join the <span className="text-indigo-500">Circle</span>
          </h2>
          <p className="text-slate-400 font-medium">Elevate your mobility with CarRental</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Wick"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/5 px-6 py-5 rounded-2xl focus:outline-none focus:border-indigo-500/40 transition-all font-bold text-white placeholder:text-slate-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email Domain</label>
            <input
              type="email"
              name="email"
              placeholder="vantage@continental.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/5 px-6 py-5 rounded-2xl focus:outline-none focus:border-indigo-500/40 transition-all font-bold text-white placeholder:text-slate-700"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Access Key</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/5 px-6 py-5 rounded-2xl focus:outline-none focus:border-indigo-500/40 transition-all font-bold text-white placeholder:text-slate-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Verify Key</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/5 px-6 py-5 rounded-2xl focus:outline-none focus:border-indigo-500/40 transition-all font-bold text-white placeholder:text-slate-700"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleRegister}
          className="btn-primary w-full mt-12 py-5 rounded-2xl shadow-indigo-500/20"
        >
          Initialize Access
        </button>

        <p className="text-center text-slate-500 mt-10 font-bold uppercase tracking-widest text-[10px]">
          Already an Elite Member?{" "}
          <Link href="/" className="text-indigo-500 hover:text-indigo-400 transition-colors">
            Authorize Now
          </Link>
        </p>

      </div>
    </div>
  );
}
