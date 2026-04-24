"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [dashRes, anRes, notifRes] = await Promise.all([
           fetchWithAuth("http://localhost:5000/api/owner/dashboard", { method: "GET" }),
           fetchWithAuth("http://localhost:5000/api/owner/analytics", { method: "GET" }),
           fetchWithAuth("http://localhost:5000/api/owner/notifications", { method: "GET" })
        ]);
        
        if (dashRes.ok && anRes.ok && notifRes.ok) {
          const dashData = await dashRes.json();
          const anData = await anRes.json();
          const notifData = await notifRes.json();
          setStats(dashData);
          setAnalytics(anData);
          setNotifications(notifData);
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

  const handleMarkAsRead = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:5000/api/owner/notifications/read", { method: "POST" });
      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      }
    } catch (e) {}
  };

  return (
    <div className="animate-fadeUp">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Command Center</h1>
        {notifications.some(n => !n.isRead) && (
          <button onClick={handleMarkAsRead} className="text-[10px] font-black text-indigo-400 border border-indigo-500/30 px-4 py-2 rounded-full hover:bg-indigo-500/10 transition-colors uppercase tracking-widest">
            Clear New Alerts
          </button>
        )}
      </div>

      {/* ALERTS SECTION */}
      {notifications.length > 0 && (
        <div className="mb-12 space-y-4">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
             <h2 className="text-sm font-black text-white uppercase tracking-widest">Operational Alerts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {notifications.slice(0, 4).map((notif, i) => (
               <div key={notif.id} className={`p-6 rounded-[1.5rem] border transition-all ${notif.isRead ? 'bg-white/5 border-white/5 opacity-60' : 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_10px_30px_rgba(99,102,241,0.1)]'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${notif.isRead ? 'bg-white/5 text-slate-500' : 'bg-indigo-500 text-white'}`}>
                      {notif.isRead ? 'Viewed' : 'New Transmission'}
                    </span>
                    <span className="text-[9px] font-bold text-slate-600 font-mono italic">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-200 leading-relaxed">{notif.message}</p>
                  {!notif.isRead && notif.message.includes("update your listing") && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <a href="/owner/my-cars" className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                        Go to Listing Control Panel →
                      </a>
                    </div>
                  )}
               </div>
             ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group col-span-1 sm:col-span-2 lg:col-span-1">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 relative z-10 flex items-center justify-between">
              Net Earnings
              <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">After 15% Fee</span>
           </p>
           <p className="text-4xl font-black text-white tracking-tighter relative z-10 mb-2">₹{analytics.totalEarnings}</p>
           
           <div className="pt-4 border-t border-white/5 mt-4 relative z-10">
              <div className="flex justify-between text-xs mb-1">
                 <span className="text-slate-400 font-medium">Gross Booking Revenue</span>
                 <span className="text-white font-bold">₹{analytics.grossEarnings}</span>
              </div>
              <div className="flex justify-between text-xs">
                 <span className="text-slate-500 font-medium text-[10px] uppercase">Platform Escrow Fee</span>
                 <span className="text-rose-400 font-bold">-₹{analytics.platformFees}</span>
              </div>
           </div>
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
        <div className="mt-4">
           <ResponsiveContainer width="99%" height={256}>
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
