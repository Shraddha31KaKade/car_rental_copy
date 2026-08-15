"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchWithAuth } from "../../../utils/api";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchRequests = async () => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetchWithAuth(`${apiUrl}/api/owner/requests`, {
        method: "GET"
      });
      
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Requests fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetchWithAuth(`${apiUrl}/api/bookings/${id}/approve`, {
        method: "PATCH"
      });

      if (res.ok) {
        setRequests(requests.map(req => req.id === id ? { ...req, status: 'APPROVED' } : req));
      }
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetchWithAuth(`${apiUrl}/api/bookings/${id}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ reason: rejectReason }),
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        setRequests(requests.map(req => req.id === id ? { ...req, status: 'REJECTED' } : req));
        setRejectingId(null);
        setRejectReason("");
      }
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  if (loading) return <div className="text-white animate-pulse">Scanning Requests...</div>;

  return (
    <div className="animate-fadeUp">
      <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-8 italic">Authorization Queue</h1>
      
      {requests.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl">
           <div className="text-6xl mb-4 opacity-50">📋</div>
           <p className="text-slate-400 font-bold tracking-widest uppercase">No pending actions</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map(request => (
            <div key={request.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-20 h-20 bg-slate-800 rounded-xl overflow-hidden shrink-0 relative leading-[0]">
                   {request.car.images && request.car.images[0] ? (
                     <img src={request.car.images[0]} alt={request.car.name} className="w-full h-full object-cover" />
                   ) : (
                     <Image 
                       src={request.car.image ? (request.car.image.startsWith('/upload') ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${request.car.image}` : request.car.image) : "/car-placeholder.png"} 
                       alt={request.car.name} 
                       fill 
                       className="object-cover"
                       unoptimized
                     />
                   )}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{request.car.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Req by: <span className="text-indigo-400">{request.user.name}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2 font-mono">
                    {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs font-bold text-emerald-400 mt-1 uppercase tracking-widest">
                    Total: ₹{request.totalAmount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
                {rejectingId === request.id ? (
                   <div className="flex flex-col gap-2 w-full">
                      <input 
                         type="text" 
                         value={rejectReason}
                         onChange={(e) => setRejectReason(e.target.value)}
                         placeholder="Enter reason for rejection..."
                         className="bg-black/40 border border-white/10 px-4 py-2 rounded-xl text-xs text-white uppercase tracking-widest"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => setRejectingId(null)} className="flex-1 py-2 text-[10px] uppercase font-bold text-slate-400 bg-white/5 rounded-lg hover:bg-white/10">Cancel</button>
                        <button onClick={() => handleReject(request.id)} className="flex-1 py-2 text-[10px] uppercase font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-600">Submit</button>
                      </div>
                   </div>
                ) : request.status === 'PENDING' ? (
                  <>
                    <button 
                      onClick={() => setRejectingId(request.id)}
                      className="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleApprove(request.id)}
                      className="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
                    >
                      Authorize
                    </button>
                  </>
                ) : (
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    request.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {request.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
