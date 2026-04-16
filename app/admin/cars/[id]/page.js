"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../../utils/api";
import { useRouter } from "next/navigation";
import { Check, X, Edit3, Loader2 } from "lucide-react";

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
    if ((status === 'REJECTED' || status === 'CHANGES_REQUESTED') && !notes.trim()) {
      alert("Please provide notes/reason for the owner.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/admin/cars/${id}/decision`, {
        method: "PATCH",
        body: JSON.stringify({ 
          status, 
          adminNotes: notes,
          rejectionReason: notes 
        })
      });
      if (!res.ok) throw new Error("Failed to submit decision");
      
      alert(`Car marked as ${status.replace('_', ' ')}`);
      router.push("/admin/cars");
    } catch (err) {
      alert(err.message);
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-10"><Loader2 className="animate-spin" /></div>;
  if (error || !car) return <div className="p-10 text-error">{error || "Car not found"}</div>;

  return (
    <div className="min-h-screen bg-background-base p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
          <div>
            <button onClick={() => router.push("/admin/cars")} className="text-sm text-primary mb-2 hover:underline">&larr; Back to Queue</button>
            <h1 className="text-3xl font-bold text-on-surface">Review Listing #{car.id}</h1>
            <p className="text-on-surface-variant font-medium mt-1">Owner: {car.owner?.name} ({car.owner?.email})</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => submitDecision('APPROVED')}
              disabled={isSubmitting}
              className="px-6 py-3 bg-tertiary-container text-on-tertiary-container font-bold rounded-xl hover:opacity-90 flex items-center gap-2 transition"
            >
              <Check size={18} /> Approve
            </button>
            <button 
              onClick={() => setDecisionMode('CHANGES')}
              disabled={isSubmitting}
              className="px-6 py-3 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest flex items-center gap-2 transition"
            >
              <Edit3 size={18} /> Request Changes
            </button>
            <button 
              onClick={() => setDecisionMode('REJECT')}
              disabled={isSubmitting}
              className="px-6 py-3 bg-error-container text-on-error-container font-bold rounded-xl hover:opacity-90 flex items-center gap-2 transition"
            >
              <X size={18} /> Reject
            </button>
          </div>
        </div>

        {decisionMode && (
          <div className="bg-surface-container-low p-6 rounded-2xl border border-error/50">
            <h3 className="font-bold text-on-surface mb-2">Provide Reason for {decisionMode === 'REJECT' ? 'Rejection' : 'Changes'}</h3>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="This message will be visible to the owner..."
              className="w-full bg-surface-container-lowest border border-outline-variant p-4 rounded-xl text-on-surface focus:outline-primary mb-4"
              rows={4}
            />
            <div className="flex gap-3">
              <button 
                onClick={() => submitDecision(decisionMode === 'REJECT' ? 'REJECTED' : 'CHANGES_REQUESTED')}
                disabled={isSubmitting}
                className="btn-primary py-2 px-6 shadow-sm"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : "Submit Status"}
              </button>
              <button 
                onClick={() => { setDecisionMode(null); setNotes(""); }}
                className="py-2 px-6 bg-surface-container hover:bg-surface-container-high rounded-xl text-on-surface font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-on-surface">Vehicle Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-4 rounded-xl"><p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">Brand</p><p className="font-medium text-on-surface">{car.brand || 'N/A'}</p></div>
              <div className="bg-surface-container-low p-4 rounded-xl"><p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">Model</p><p className="font-medium text-on-surface">{car.name}</p></div>
              <div className="bg-surface-container-low p-4 rounded-xl"><p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">Type</p><p className="font-medium text-on-surface">{car.type}</p></div>
              <div className="bg-surface-container-low p-4 rounded-xl"><p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">Price/Day</p><p className="font-bold text-primary">${car.price}</p></div>
              <div className="bg-surface-container-low p-4 rounded-xl"><p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">Condition</p><p className="font-medium text-on-surface">{car.condition}</p></div>
              <div className="bg-surface-container-low p-4 rounded-xl"><p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">Location</p><p className="font-medium text-on-surface">{car.location || "N/A"}</p></div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-on-surface">Documentation & Media</h2>
            
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Registration (RC) Document</p>
                {car.rcDocument && (
                  <button 
                    onClick={async () => {
                      setAnalyzing(true);
                      try {
                        const res = await fetchWithAuth(`http://localhost:5000/api/admin/cars/${id}/analyze-rc`, { method: "POST" });
                        const aires = await res.json();
                        setAiData(aires.data);
                      } catch (err) {
                        alert("AI analysis failed.");
                      } finally {
                        setAnalyzing(false);
                      }
                    }}
                    disabled={analyzing}
                    className="text-xs bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-bold flex items-center gap-1 hover:opacity-80 transition"
                  >
                    {analyzing ? <Loader2 size={12} className="animate-spin" /> : "✨ Check with AI"}
                  </button>
                )}
              </div>
              
              {car.rcDocument ? (
                <div className="space-y-3">
                  <a href={car.rcDocument.startsWith('http') ? car.rcDocument : `http://localhost:5000/${car.rcDocument}`} target="_blank" rel="noreferrer" className="block p-4 border border-outline-variant rounded-xl text-primary font-medium hover:bg-surface-container-low transition">
                    📄 View Submitted RC Document
                  </a>
                  
                  {aiData && (
                    <div className="bg-tertiary-container/20 border border-tertiary-container text-on-surface p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-4">
                      <p className="font-bold text-tertiary flex items-center gap-2 mb-2">✨ AI Verification Results</p>
                      <ul className="space-y-1">
                        <li><span className="font-semibold">Detected Owner:</span> {aiData.ownerName}</li>
                        <li><span className="font-semibold">Reg. Num:</span> {aiData.registrationNumber}</li>
                        <li><span className="font-semibold">Make/Model:</span> {aiData.make} {aiData.model}</li>
                        <li><span className="font-semibold">Year/Fuel:</span> {aiData.manufactureYear} • {aiData.fuelType}</li>
                      </ul>
                      
                      {aiData.ownerName && aiData.ownerName.toLowerCase() !== car.owner?.name.toLowerCase() && (
                         <div className="mt-3 bg-error-container text-on-error-container text-xs p-2 rounded flex items-start gap-2 font-medium">
                           <X size={14} className="mt-0.5" /> Warning: The uploaded document's owner name doesn't match the current hosting user's name!
                         </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-on-surface-variant italic">No document uploaded.</p>
              )}
            </div>

            <div>
               <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-3">Vehicle Images</p>
               <div className="flex gap-4 overflow-x-auto pb-2">
                 {(car.images && car.images.length > 0) ? car.images.map((img, i) => (
                    <img key={i} src={img.startsWith('http') ? img : `http://localhost:5000/${img}`} className="h-32 w-48 object-cover rounded-xl shrink-0 border border-surface-container-high" alt="Car" />
                 )) : (
                    <p className="text-on-surface-variant italic">No images.</p>
                 )}
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
