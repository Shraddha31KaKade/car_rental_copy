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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/auth/register`, {
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 px-4 pt-20 relative overflow-hidden isolate">
      {/* Background Blobs */}
      <div className="bg-blob blob-blue top-[-10%] left-[-10%] opacity-20"></div>
      <div className="bg-blob blob-sky bottom-[-10%] right-[-10%] opacity-20"></div>

      <div className="bg-white border border-slate-200 w-full max-w-md p-10 sm:p-12 rounded-[3.5rem] shadow-2xl animate-fadeUp relative z-10">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 text-blue-600 rounded-[1.50rem] text-3xl mb-6 border border-blue-200 shadow-sm animate-float">
            ✨
          </div>
          <h2 className="text-4xl font-black text-slate-950 tracking-tighter mb-2">
            Create an <span className="text-blue-600">Account</span>
          </h2>
          <p className="text-slate-500 font-medium text-sm">Sign up to start renting with CarRental</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 ml-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 px-6 py-4 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 px-6 py-4 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 ml-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 px-6 py-4 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 ml-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 px-6 py-4 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleRegister}
          className="btn-primary w-full mt-10 py-5 rounded-2xl shadow-blue-500/25"
        >
          Sign Up
        </button>

        <p className="text-center text-slate-500 mt-8 font-bold uppercase tracking-widest text-[10px]">
          Already have an account?{" "}
          <Link href="/" className="text-blue-600 hover:text-blue-700 transition-colors">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
