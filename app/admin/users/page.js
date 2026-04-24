"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/api";
import { useRouter } from "next/navigation";
import { Users, Mail, Phone, Loader2, AlertCircle } from "lucide-react";

export default function AdminUsersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("USERS");
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, inqRes] = await Promise.all([
          fetchWithAuth("http://localhost:5000/api/admin/users"),
          fetchWithAuth("http://localhost:5000/api/admin/inquiries")
        ]);
        
        if (!usersRes.ok || !inqRes.ok) throw new Error("Failed to fetch data");
        
        const usersData = await usersRes.json();
        const inqData = await inqRes.json();
        
        setUsers(usersData.data || []);
        setInquiries(inqData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 relative">
        <button 
          onClick={() => router.push("/admin")}
          className="text-slate-400 hover:text-white transition-colors text-sm font-medium mb-4 inline-flex items-center gap-2"
        >
          &larr; Back to Dashboard
        </button>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        <div>
          <p className="text-slate-500 font-semibold tracking-wide text-sm mb-1 uppercase">Admin Suite</p>
          <h1 className="text-4xl text-white font-bold tracking-tight">User Management & Feedback</h1>
        </div>

        <div className="bg-[#0f172a] rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex gap-4">
            <button 
              onClick={() => setActiveTab("USERS")}
              className={`text-lg font-bold px-4 py-2 rounded-xl transition ${activeTab === "USERS" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-white/5"}`}
            >
              Registered Users
            </button>
            <button 
              onClick={() => setActiveTab("INQUIRIES")}
              className={`text-lg font-bold px-4 py-2 rounded-xl transition ${activeTab === "INQUIRIES" ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-white/5"}`}
            >
              Customer Queries & Feedback
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-slate-400 text-sm uppercase tracking-wider">
                  {activeTab === "USERS" ? (
                    <>
                      <th className="p-4 font-semibold w-16"><Users size={18} /></th>
                      <th className="p-4 font-semibold">User ID</th>
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Email</th>
                      <th className="p-4 font-semibold">Role</th>
                    </>
                  ) : (
                    <>
                      <th className="p-4 font-semibold w-16"><Mail size={18} /></th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Contact Info</th>
                      <th className="p-4 font-semibold">Message / Query</th>
                      <th className="p-4 font-semibold">Auto Reply Sent</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="text-slate-300 text-[15px]">
                {loading ? (
                  <tr><td colSpan="6" className="p-8 text-center"><Loader2 className="animate-spin inline-block text-indigo-400" /></td></tr>
                ) : activeTab === "USERS" ? (
                  users.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-slate-500">No users found.</td></tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id} className="hover:bg-white/5 border-t border-white/5">
                        <td className="p-4"></td>
                        <td className="p-4 font-medium">{user.id}</td>
                        <td className="p-4 font-semibold text-white">{user.name}</td>
                        <td className="p-4 text-indigo-300">{user.email}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' :
                            user.role === 'OWNER' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  inquiries.length === 0 ? (
                    <tr><td colSpan="6" className="p-8 text-center text-slate-500">No queries or feedback found.</td></tr>
                  ) : (
                    inquiries.map(inq => (
                      <tr key={inq.id} className="hover:bg-white/5 border-t border-white/5">
                        <td className="p-4"></td>
                        <td className="p-4 text-slate-400 text-sm">{new Date(inq.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 font-semibold text-white">{inq.name}</td>
                        <td className="p-4 text-sm">
                          {inq.email && <div className="flex items-center gap-1 text-indigo-300"><Mail size={12}/> {inq.email}</div>}
                          {inq.mobile && <div className="flex items-center gap-1 text-emerald-300 mt-1"><Phone size={12}/> {inq.mobile}</div>}
                        </td>
                        <td className="p-4 max-w-xs truncate" title={inq.message}>{inq.message}</td>
                        <td className="p-4 max-w-xs truncate text-xs text-slate-400" title={inq.autoReply || "None"}>
                          {inq.autoReply || "None"}
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
