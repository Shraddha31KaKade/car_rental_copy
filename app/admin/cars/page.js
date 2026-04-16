"use client";

import { useEffect, useState, useMemo } from "react";
import { AlertCircle, CheckCircle2, Search, Car as CarIcon, X, Loader2 } from "lucide-react";
import { fetchWithAuth } from "../../../utils/api";
import { useRouter } from "next/navigation";

export default function AdminPendingCars() {
  const router = useRouter();
  
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPendingCars = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth("http://localhost:5000/api/admin/cars/pending");
      if (!res.ok) throw new Error("Failed to fetch pending cars");
      const data = await res.json();
      setCars(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCars();
  }, []);

  const filteredCars = useMemo(() => {
    return cars.filter(c => 
      c.id.toString().includes(searchQuery) || 
      (c.brand || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.owner?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cars, searchQuery]);

  return (
    <div className="min-h-screen bg-background-base p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 relative">
        <button 
          onClick={() => router.push("/admin")}
          className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium mb-4 inline-flex items-center gap-2"
        >
          &larr; Back to Dashboard
        </button>

        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-between items-end">
          <div>
            <p className="text-on-surface-variant font-semibold tracking-wide text-sm mb-1 uppercase">Admin Suite</p>
            <h1 className="text-4xl text-on-surface font-bold tracking-tight">Pending Fleet Approvals</h1>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-diffused overflow-hidden">
          <div className="p-6 border-b border-surface-container flex flex-wrap gap-4 justify-between items-center">
            <h2 className="text-xl font-bold text-on-surface">Queue</h2>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vehicles..." 
                className="bg-surface-container-lowest border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/60 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-primary w-72"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high text-on-surface-variant text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold w-16"><CarIcon size={18} /></th>
                  <th className="p-4 font-semibold">Car ID</th>
                  <th className="p-4 font-semibold">Vehicle</th>
                  <th className="p-4 font-semibold">Owner</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-on-surface text-[15px]">
                {loading ? (
                  <tr><td colSpan="6" className="p-8 text-center"><Loader2 className="animate-spin inline-block" /></td></tr>
                ) : filteredCars.length === 0 ? (
                  <tr><td colSpan="6" className="p-8 text-center text-on-surface-variant">No pending cars found.</td></tr>
                ) : (
                  filteredCars.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container">
                      <td className="p-4"></td>
                      <td className="p-4 font-medium text-primary cursor-pointer hover:underline" onClick={() => router.push(`/admin/cars/${item.id}`)}>{item.id}</td>
                      <td className="p-4">{item.brand} {item.name}</td>
                      <td className="p-4">{item.owner?.name || "Unknown"}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          item.listingStatus === 'CHANGES_REQUESTED' ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-surface'
                        }`}>
                          {item.listingStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => router.push(`/admin/cars/${item.id}`)} className="text-primary font-medium hover:underline">Review</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
