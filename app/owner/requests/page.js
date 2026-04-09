"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchWithAuth } from "../../../utils/api";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      if (!token) return;

      const res = await fetchWithAuth("http://localhost:5000/api/owner/requests", {
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

  const handleAction = async (id, action) => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const res = await fetchWithAuth(`http://localhost:5000/api/owner/requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ action })
      });

      if (res.ok) {
        // Refresh local state to show updated status
        setRequests(requests.map(req => req.id === id ? { ...req, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : req));
      }
    } catch (err) {
      console.error("Action error:", err);
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
                <div className="w-20 h-20 bg-slate-800 rounded-xl overflow-hidden shrink-0 relative">
                   <Image 
                     src={request.car.image ? (request.car.image.startsWith('/upload') ? `http://localhost:5000${request.car.image}` : request.car.image) : "/car-placeholder.png"} 
                     alt={request.car.name} 
                     fill 
                     className="object-cover"
                     unoptimized
                   />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{request.car.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Req by: <span className="text-indigo-400">{request.user.name}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2 font-mono">
                    {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {request.status === 'PENDING' ? (
                  <>
                    <button 
                      onClick={() => handleAction(request.id, 'REJECT')}
                      className="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleAction(request.id, 'APPROVE')}
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
