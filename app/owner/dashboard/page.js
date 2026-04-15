"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [dashRes, anRes] = await Promise.all([
           fetchWithAuth("http://localhost:5000/api/owner/dashboard", { method: "GET" }),
           fetchWithAuth("http://localhost:5000/api/owner/analytics", { method: "GET" })
        ]);
        
        if (dashRes.ok && anRes.ok) {
          const dashData = await dashRes.json();
          const anData = await anRes.json();
          setStats(dashData);
          setAnalytics(anData);
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
  if (!stats || !analytics) return <div className="text-white">Failed to load metrics.</div>;

  const chartData = Object.keys(analytics.earningsPerMonth).map(month => ({
     name: month,
     earnings: analytics.earningsPerMonth[month]
  }));

  return (
    <div className="animate-fadeUp">
      <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-8 italic">Command Center</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 relative z-10">Total Revenue</p>
           <p className="text-4xl font-black text-white tracking-tighter relative z-10">${analytics.totalEarnings}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 relative z-10">Active Fleet</p>
           <p className="text-4xl font-black text-white tracking-tighter relative z-10">{stats.carsCount}</p>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden group">
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 relative z-10">Pending Actions</p>
           <p className="text-4xl font-black text-white tracking-tighter relative z-10">{stats.pendingRequests}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 relative z-10">Authorized Trips</p>
           <p className="text-4xl font-black text-emerald-400 tracking-tighter relative z-10">{stats.approvedBookingsCount}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Revenue History</h2>
        <div className="h-64">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={chartData}>
               <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
               <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
               <YAxis stroke="#94a3b8" fontSize={12} />
               <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
               <Bar dataKey="earnings" fill="#6366f1" radius={[4, 4, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
