"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../../utils/api";
import { useRouter } from "next/navigation";
import { Check, X, Edit3, Loader2, ArrowLeft, Car, FileText, IndianRupee } from "lucide-react";
import { use } from "react";

export default function AdminCarReviewDetail({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [decisionMode, setDecisionMode] = useState(null); // 'REJECT' | 'CHANGES'
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [aiData, setAiData] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchCar = async () => {
      try {
        const res = await fetchWithAuth(`http://localhost:5000/api/admin/cars/${id}`);
        if (!res.ok) throw new Error("Failed to fetch car details");
        const data = await res.json();
        setCar(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const submitDecision = async (status) => {
    if ((status === "REJECTED" || status === "CHANGES_REQUESTED") && !notes.trim()) {
      alert("Please provide a reason/notes for the owner before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/admin/cars/${id}/decision`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          adminNotes: notes,
          rejectionReason: notes,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit decision");

      const label = status === "APPROVED" ? "Approved ✅" : status === "REJECTED" ? "Rejected ❌" : "Changes Requested 📝";
      setSuccessMsg(`Listing has been marked as: ${label}. Owner has been notified by email.`);
      setDecisionMode(null);
      setNotes("");

      // Re-fetch updated car state
      const updated = await fetchWithAuth(`http://localhost:5000/api/admin/cars/${id}`);
      const updatedData = await updated.json();
      setCar(updatedData.data);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this car? This action cannot be undone.")) return;
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/cars/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Car deleted successfully");
        router.push("/admin/verifications");
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
    APPROVED:           { label: "Approved",           color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    REJECTED:           { label: "Rejected",           color: "bg-red-500/15 text-red-400 border-red-500/30" },
    PENDING_APPROVAL:   { label: "Pending Review",     color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
    CHANGES_REQUESTED:  { label: "Changes Requested",  color: "bg-orange-500/15 text-orangeite-400 border-orange-500/30" },
  };

  const currentStatus = car ? (statusConfig[car.listingStatus] || { label: car.listingStatus, color: "bg-slate-500/15 text-slate-400 border-slate-500/30" }) : null;

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-400" size={40} />
    </div>
  );
  if (error || !car) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center text-red-400 font-bold">
      {error || "Car not found"}
    </div>
  );

  const isAlreadyDecided = car.listingStatus === "APPROVED" || car.listingStatus === "REJECTED";

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ─── Breadcrumb ─── */}
        <button
          onClick={() => router.push("/admin/verifications")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Approval Queue
        </button>

        {/* ─── Header Card ─── */}
        <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Car size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{car.name}</h1>
                  <p className="text-slate-400 text-sm">{car.brand} · Listing #{car.id}</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                <span className="font-semibold text-slate-300">Listing Owner:</span> {car.ownerName || car.owner?.name} —{" "}
                <span className="text-indigo-400">{car.ownerEmail || car.owner?.email}</span>
              </p>
              {car.ownerContact && (
                <p className="text-slate-400 text-sm">
                  <span className="font-semibold text-slate-300">Contact:</span> {car.ownerContact}
                </p>
              )}
            </div>

              {/* Status Badge & Delete Button */}
              <div className="flex flex-col items-end gap-2">
                {currentStatus && (
                  <span className={`self-end sm:self-start px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${currentStatus.color}`}>
                    {currentStatus.label}
                  </span>
                )}
                <button
                  onClick={handleDelete}
                  className="px-4 py-1.5 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors"
                >
                  Delete Car
                </button>
              </div>
            </div>
          </div>

        {/* ─── Success Banner ─── */}
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl font-medium flex items-center gap-3">
            <Check size={20} />
            {successMsg}
          </div>
        )}

        {/* ─── Admin Notes (for rejected/changes) ─── */}
        {car.adminNotes && (
          <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl">
            <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-1">Current Admin Notes</p>
            <p className="text-sm text-orange-200">{car.adminNotes}</p>
          </div>
        )}

        {/* ─── Action Buttons ─── */}
        {!isAlreadyDecided && (
          <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-5">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Admin Decision</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => submitDecision("APPROVED")}
                disabled={isSubmitting || decisionMode !== null}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/30"
              >
                <Check size={16} />
                Approve Listing
              </button>
              <button
                onClick={() => setDecisionMode("CHANGES")}
                disabled={isSubmitting || decisionMode === "CHANGES"}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Edit3 size={16} />
                Request Changes
              </button>
              <button
                onClick={() => setDecisionMode("REJECT")}
                disabled={isSubmitting || decisionMode === "REJECT"}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <X size={16} />
                Reject Listing
              </button>
            </div>
          </div>
        )}

        {isAlreadyDecided && !successMsg && (
          <div className="bg-slate-800/50 border border-white/5 p-4 rounded-xl text-slate-400 text-sm font-medium">
            This listing has already been <strong className="text-white">{car.listingStatus.toLowerCase()}</strong>. No further action needed.
          </div>
        )}

        {/* ─── Reason Input Panel ─── */}
        {decisionMode && (
          <div className={`p-5 rounded-2xl border ${decisionMode === "REJECT" ? "bg-red-950/30 border-red-500/30" : "bg-orange-950/20 border-orange-500/20"}`}>
            <h3 className="font-bold text-white mb-1">
              {decisionMode === "REJECT" ? "❌ Rejection Reason" : "📝 Changes Required"}
            </h3>
            <p className="text-xs text-slate-400 mb-3">This message will be emailed to the car owner automatically.</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                decisionMode === "REJECT"
                  ? "Explain why this listing is being rejected..."
                  : "Describe the changes needed (e.g., upload clearer RC document, fix price, add more photos)..."
              }
              className="w-full bg-[#020617] border border-white/10 p-4 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors mb-4 resize-none text-sm"
              rows={4}
            />
            <div className="flex gap-3">
              <button
                onClick={() => submitDecision(decisionMode === "REJECT" ? "REJECTED" : "CHANGES_REQUESTED")}
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-colors ${decisionMode === "REJECT" ? "bg-red-700 hover:bg-red-600" : "bg-orange-600 hover:bg-orange-500"} disabled:opacity-50`}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                {isSubmitting ? "Sending..." : "Confirm & Notify Owner"}
              </button>
              <button
                onClick={() => { setDecisionMode(null); setNotes(""); }}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ─── Details Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Vehicle Details */}
          <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <Car size={18} className="text-indigo-400" /> Vehicle Details
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Brand",     value: car.brand || "N/A" },
                { label: "Model",     value: car.name },
                { label: "Type",      value: car.type || "N/A" },
                { label: "Year",      value: car.year || "N/A" },
                { label: "Condition", value: car.condition || "N/A" },
                { label: "Seats",     value: car.seats || "N/A" },
                { label: "Fuel",      value: car.fuel || "N/A" },
                { label: "Transmission", value: car.transmission || "N/A" },
                { label: "Location",  value: car.location || "N/A" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/5 p-3 rounded-xl">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{label}</p>
                  <p className="text-sm font-semibold text-white">{value}</p>
                </div>
              ))}
              <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl">
                <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold mb-1">Price / Day</p>
                <p className="text-sm font-bold text-indigo-300 flex items-center gap-1">
                  <IndianRupee size={13} />
                  {car.price?.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Documentation & Media */}
          <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-6 space-y-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <FileText size={18} className="text-indigo-400" /> Documentation & Media
            </h2>

            {/* RC Document */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">RC Document</p>
                {car.rcDocument && (
                  <button
                    onClick={async () => {
                      setAnalyzing(true);
                      try {
                        const res = await fetchWithAuth(`http://localhost:5000/api/admin/cars/${id}/analyze-rc`, { method: "POST" });
                        const aires = await res.json();
                        setAiData(aires.data);
                      } catch {
                        alert("AI analysis failed.");
                      } finally {
                        setAnalyzing(false);
                      }
                    }}
                    disabled={analyzing}
                    className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full font-bold flex items-center gap-1 hover:bg-indigo-500/30 transition"
                  >
                    {analyzing ? <Loader2 size={10} className="animate-spin" /> : "✨"} AI Check
                  </button>
                )}
              </div>

              {car.rcDocument ? (
                <div className="space-y-3">
                  <a
                    href={car.rcDocument.startsWith("http") ? car.rcDocument : `http://localhost:5000/${car.rcDocument}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-4 border border-white/10 rounded-xl text-indigo-400 font-medium hover:bg-white/5 transition text-sm"
                  >
                    <FileText size={16} /> View Submitted RC Document
                  </a>

                  {aiData && (
                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl text-sm animate-in fade-in">
                      <p className="font-bold text-indigo-400 flex items-center gap-2 mb-2">✨ AI Verification</p>
                      <ul className="space-y-1 text-slate-300">
                        <li><span className="font-semibold text-slate-100">Owner:</span> {aiData.ownerName}</li>
                        <li><span className="font-semibold text-slate-100">Reg Num:</span> {aiData.registrationNumber}</li>
                        <li><span className="font-semibold text-slate-100">Make/Model:</span> {aiData.make} {aiData.model}</li>
                        <li><span className="font-semibold text-slate-100">Year/Fuel:</span> {aiData.manufactureYear} · {aiData.fuelType}</li>
                      </ul>
                      {aiData.ownerName && aiData.ownerName.toLowerCase() !== car.owner?.name?.toLowerCase() && (
                        <div className="mt-3 bg-red-500/20 border border-red-500/30 text-red-400 text-xs p-2 rounded-lg flex items-start gap-2 font-medium">
                          <X size={14} className="mt-0.5 shrink-0" />
                          Warning: Document owner name doesn't match the listing user's name!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 italic text-sm">No RC document uploaded.</p>
              )}
            </div>

            {/* Vehicle Images */}
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">Images</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {car.images && car.images.length > 0 ? (
                  car.images.map((img, i) => (
                    <img
                      key={i}
                      src={img.startsWith("http") ? img : `http://localhost:5000/${img}`}
                      className="h-28 w-44 object-cover rounded-xl shrink-0 border border-white/10"
                      alt={`Car ${i + 1}`}
                    />
                  ))
                ) : (
                  <p className="text-slate-500 italic text-sm">No images uploaded.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Owner History ─── */}
        <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-6 mt-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
            <Car size={18} className="text-indigo-400" /> Owner's Fleet History
          </h2>
          {car.owner?.ownedCars && car.owner.ownedCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {car.owner.ownedCars.map(c => (
                <div key={c.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-bold text-white mb-1">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.brand} ({c.year})</p>
                  </div>
                  <div className="mt-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      c.listingStatus === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                      c.listingStatus === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {c.listingStatus.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm italic">No history found for this owner.</p>
          )}
        </div>
      </div>
    </div>
  );
}
