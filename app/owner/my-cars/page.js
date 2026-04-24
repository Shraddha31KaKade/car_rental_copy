"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchWithAuth } from "../../../utils/api";
import { PauseCircle, PlayCircle, AlertCircle, CheckCircle2, Clock, Edit } from "lucide-react";

export default function MyCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  const fetchCars = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:5000/api/owner/cars", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setCars(data);
      }
    } catch (err) {
      console.error("Fetch cars error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handlePauseToggle = async (carId, currentPausedStatus) => {
    setTogglingId(carId);
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/cars/${carId}/pause`, {
        method: "PATCH",
        body: JSON.stringify({ isPaused: !currentPausedStatus }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        fetchCars();
      } else {
        alert("Failed to toggle pause status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car? This action cannot be undone.")) return;
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/cars/${carId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Car deleted successfully");
        fetchCars(); // Refresh list
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete car.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting car.");
    }
  };

  const statusConfig = {
    APPROVED:          { label: "Live",             color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
    PENDING_APPROVAL:  { label: "Pending Review",   color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",   icon: Clock },
    CHANGES_REQUESTED: { label: "Changes Required", color: "bg-orange-500/15 text-orange-400 border-orange-500/30",   icon: AlertCircle },
    REJECTED:          { label: "Rejected",          color: "bg-red-500/15 text-red-400 border-red-500/30",            icon: AlertCircle },
  };

  if (loading) return (
    <div className="flex items-center justify-center py-40">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 border-r-4 border-r-transparent" />
    </div>
  );

  return (
    <div className="animate-fadeUp">
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">My Fleet</h1>
        <div className="bg-indigo-500/20 px-4 py-1.5 border border-indigo-500/30 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-widest">
          {cars.length} Vehicle{cars.length !== 1 ? "s" : ""}
        </div>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl">
          <div className="text-6xl mb-4 opacity-50">🏎️</div>
          <p className="text-slate-400 font-bold tracking-widest uppercase">No vehicles listed yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => {
            const status = statusConfig[car.listingStatus] || { label: car.listingStatus, color: "bg-slate-500/15 text-slate-400 border-slate-500/30", icon: AlertCircle };
            const StatusIcon = status.icon;
            const isToggling = togglingId === car.id;

            // Only APPROVED cars can be paused/unpaused
            const canPause = car.listingStatus === "APPROVED";
            const needsResubmit = car.listingStatus === "CHANGES_REQUESTED" || car.listingStatus === "REJECTED";

            return (
              <div key={car.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden group">
                {/* Image */}
                <div className="h-48 relative overflow-hidden bg-slate-900">
                  {car.images && car.images[0] ? (
                    <img
                      src={car.images[0]}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <Image
                      src={car.image ? (car.image.startsWith("/upload") ? `http://localhost:5000${car.image}` : car.image) : "/car-placeholder.png"}
                      alt={car.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      unoptimized
                    />
                  )}

                  {/* Paused overlay */}
                  {car.isPaused && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                      <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                        ⏸ Paused
                      </span>
                    </div>
                  )}

                  {/* Listing status badge (top-left) */}
                  <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.color}`}>
                    <StatusIcon size={10} />
                    {status.label}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3 className="text-xl font-black text-white mb-1">{car.name}</h3>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                    <span>{car.brand} · {car.year || "2024"}</span>
                    <span className="text-indigo-400">₹{car.price?.toLocaleString("en-IN")}/day</span>
                  </div>

                  {/* Admin feedback panel — visible when rejected or changes requested */}
                  {(car.adminNotes || car.rejectionReason) && needsResubmit && (
                    <div className={`mb-4 p-3 rounded-xl border text-xs ${car.listingStatus === "REJECTED" ? "bg-red-500/10 border-red-500/20" : "bg-orange-500/10 border-orange-500/20"}`}>
                      <p className={`font-black uppercase tracking-widest mb-1 ${car.listingStatus === "REJECTED" ? "text-red-400" : "text-orange-400"}`}>
                        {car.listingStatus === "REJECTED" ? "❌ Rejection Reason" : "📝 Changes Required"}
                      </p>
                      <p className={`font-medium ${car.listingStatus === "REJECTED" ? "text-red-200" : "text-orange-200"}`}>
                        {car.adminNotes || car.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Resubmit notice */}
                  {needsResubmit && (
                    <div className="mb-4 bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl text-xs text-indigo-300 font-medium">
                      Make the changes above, then click <strong>Edit & Resubmit</strong> — your listing will automatically go back to Admin review.
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {/* Pause/Unpause — only for approved cars */}
                    {canPause && (
                      <button
                        onClick={() => handlePauseToggle(car.id, car.isPaused)}
                        disabled={isToggling}
                        className={`flex items-center gap-1.5 flex-1 justify-center py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${
                          car.isPaused
                            ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                            : "bg-white/10 hover:bg-white/20 text-white"
                        } disabled:opacity-50`}
                      >
                        {isToggling ? (
                          <span className="animate-spin">⏳</span>
                        ) : car.isPaused ? (
                          <><PlayCircle size={13} /> Unpause</>
                        ) : (
                          <><PauseCircle size={13} /> Pause</>
                        )}
                      </button>
                    )}

                    {/* Edit button — always available */}
                    <button
                      onClick={() => window.location.href = `/list-cars?edit=${car.id}`}
                      className={`flex items-center gap-1.5 justify-center py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors ${canPause ? "flex-none px-4" : "flex-1"}`}
                    >
                      <Edit size={13} />
                      {needsResubmit ? "Edit & Resubmit" : "Edit"}
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="flex items-center gap-1.5 flex-none px-4 justify-center py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
