"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/api";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (!token) return;

        const res = await fetchWithAuth("http://localhost:5000/api/owner/dashboard", {
          method: "GET"
        });
        
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-white animate-pulse">Loading Metrics...</div>;
  if (!stats) return <div className="text-white">Failed to load metrics.</div>;

  return (
    <div className="animate-fadeUp">
      <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-8 italic">Command Center</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-colors"></div>
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 relative z-10">Active Fleet</p>
           <p className="text-5xl font-black text-white tracking-tighter relative z-10">{stats.carsCount}</p>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-500/30 transition-colors"></div>
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 relative z-10">Pending Actions</p>
           <p className="text-5xl font-black text-white tracking-tighter relative z-10">{stats.pendingRequests}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-colors"></div>
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 relative z-10">Authorized Journeys</p>
           <p className="text-5xl font-black text-emerald-400 tracking-tighter relative z-10">{stats.approvedBookingsCount}</p>
        </div>

      </div>
    </div>
  );
}
