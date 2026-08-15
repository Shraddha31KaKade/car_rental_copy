"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchWithAuth } from "../../utils/api";

// ── Inner component that uses useSearchParams (must be inside Suspense) ──────
function ListCarForm() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const editId      = searchParams.get("edit"); // carId when editing
  const isEditMode  = Boolean(editId);

  const [loading,           setLoading]           = useState(false);
  const [fetchingCar,       setFetchingCar]        = useState(isEditMode);
  const [success,           setSuccess]            = useState(false);
  const [termsAccepted,     setTermsAccepted]      = useState(false);
  const [isTermsSubmitted,  setIsTermsSubmitted]   = useState(isEditMode); // skip terms in edit mode
  const [step,              setStep]               = useState(1);
  const [userRole,          setUserRole]           = useState(null);

  const [formData, setFormData] = useState({
    name:         "",
    brand:        "",
    type:         "Sedan",
    condition:    "GOOD",
    year:         "2024",
    price:        "",
    seats:        "4",
    transmission: "Automatic",
    fuel:         "Petrol",
    location:     "",
    ownerName:    "",
    ownerEmail:   "",
    ownerContact: "",
  });

  // Existing images URLs (from edit mode)
  const [existingImages, setExistingImages] = useState([]);
  const [images,         setImages]         = useState([]); // new File uploads
  const [rcDocument,     setRcDocument]     = useState(null);
  const [existingRC,     setExistingRC]     = useState(null); // existing RC URL

  // ── Fetch car data when in edit mode ───────────────────────────────────────
  useEffect(() => {
    // Check user role from cookie
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };
    const userCookie = getCookie("loggedInUser");
    if (userCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(userCookie));
        setUserRole(parsed.role);
      } catch(e) {}
    }

    if (!isEditMode) return;

    const loadCar = async () => {
      setFetchingCar(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res  = await fetchWithAuth(`${apiUrl}/api/cars/${editId}`);
        const data = await res.json();
        const car  = data;

        setFormData({
          name:         car.name         || "",
          brand:        car.brand        || "",
          type:         car.type         || "Sedan",
          condition:    car.condition    || "GOOD",
          year:         String(car.year  || "2024"),
          price:        String(car.price || ""),
          seats:        String(car.seats || "4"),
          transmission: car.transmission || "Automatic",
          fuel:         car.fuel         || "Petrol",
          location:     car.location     || "",
          ownerName:    car.ownerName    || "",
          ownerEmail:   car.ownerEmail   || "",
          ownerContact: car.ownerContact || "",
        });

        setExistingImages(car.images || (car.image ? [car.image] : []));
        setExistingRC(car.rcDocument || null);
      } catch (err) {
        console.error("Failed to load car for editing:", err);
        alert("Could not load car details. Please try again.");
      } finally {
        setFetchingCar(false);
      }
    };

    loadCar();
  }, [editId, isEditMode]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImagesChange  = (e) => setImages(Array.from(e.target.files));
  const handleDocChange     = (e) => setRcDocument(e.target.files[0]);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach(key => dataToSend.append(key, formData[key]));

      // Only append new images if user selected some; otherwise keep existing ones
      if (images.length > 0) {
        images.forEach(img => dataToSend.append("images", img));
      }

      if (rcDocument) {
        dataToSend.append("rcDocument", rcDocument);
      }

      let res;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      if (isEditMode) {
        // PUT to update — carController.updateCar will reset listingStatus to PENDING_APPROVAL
        res = await fetchWithAuth(`${apiUrl}/api/cars/${editId}`, {
          method: "PUT",
          body:   dataToSend,
        });
      } else {
        res = await fetchWithAuth(`${apiUrl}/api/cars`, {
          method: "POST",
          body:   dataToSend,
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setSuccess(true);
      setTimeout(() => router.push("/owner/my-cars"), 3000);
    } catch (err) {
      console.error("List car error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this car? This action cannot be undone.")) return;
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetchWithAuth(`${apiUrl}/api/cars/${editId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete car");
      }
      alert("Car deleted successfully");
      router.push("/owner/my-cars");
    } catch (err) {
      console.error("Delete car error:", err);
      alert(err.message);
      setLoading(false);
    }
  };


  // ── Loading state while fetching car ──────────────────────────────────────
  if (fetchingCar) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 border-r-4 border-r-transparent mx-auto mb-6" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading car details...</p>
        </div>
      </div>
    );
  }

  // ── Admin blocker ────────────────────────────────────────────────────────
  if (userRole === "ADMIN") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="bg-slate-900/40 backdrop-blur-3xl p-16 rounded-[4rem] border border-red-500/30 text-center shadow-2xl max-w-md mx-auto">
          <div className="text-8xl mb-8">🛡️</div>
          <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">
            Admin Restricted
          </h2>
          <p className="text-slate-500 font-medium">
            Admins are not allowed to list their own cars on the platform to avoid conflict of interest. 
            If you wish to list a car, please use a personal account.
          </p>
          <button 
            onClick={() => router.push("/admin")}
            className="mt-8 bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-8 rounded-full font-bold uppercase tracking-widest text-xs transition"
          >
            Go to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="bg-slate-900/40 backdrop-blur-3xl p-16 rounded-[4rem] border border-indigo-500/30 text-center shadow-2xl max-w-md mx-auto">
          <div className="text-8xl mb-8">{isEditMode ? "🔄" : "🚀"}</div>
          <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">
            {isEditMode ? "Resubmitted!" : "Asset Integrated"}
          </h2>
          <p className="text-indigo-400 font-black uppercase tracking-widest text-[10px] mb-6">
            {isEditMode ? "Back in Admin Review Queue" : "Verification Protocol Initialized"}
          </p>
          <p className="text-slate-500 font-medium">
            {isEditMode
              ? "Your updated listing has been sent back to the admin for re-review. Redirecting to My Fleet..."
              : "Your vehicle is being reviewed by our specialists. Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-24 relative overflow-hidden isolate">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* Left side info panel */}
          <div>
            <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
              {isEditMode ? "Edit & Resubmit" : "Partner Program"}
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter uppercase italic leading-[0.9]">
              {isEditMode ? (
                <>Update Your <span className="text-orange-500">Listing</span></>
              ) : (
                <>Monetize Your <span className="text-indigo-500">Fleet</span></>
              )}
            </h1>

            {isEditMode && (
              <div className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-2xl mb-8">
                <p className="text-orange-400 font-black uppercase tracking-widest text-[10px] mb-2">📝 Changes Requested</p>
                <p className="text-orange-200 text-sm font-medium">
                  Make the required changes below, then click <strong>"Resubmit for Review"</strong>. Your listing will automatically go back to admin review.
                </p>
              </div>
            )}

            <div className="space-y-12 pr-0 lg:pr-12">
              <div className="space-y-4">
                <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs">
                  {isEditMode ? "01. What to Update" : "01. The Covenant"}
                </h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  {isEditMode
                    ? "Check the admin feedback on your My Fleet page and update the relevant fields below. New images are optional — your existing images will be kept if you don't upload new ones."
                    : "By listing your vehicle on CarRental, you enter into a premium partnership. We ensure your asset is handled only by verified members of our elite community."}
                </p>
              </div>
              {!isEditMode && (
                <div className="space-y-4">
                  <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs">02. Security Bonds</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    Every rental is covered by a high-stakes security bond. In the event of any discrepancy, our automated resolution system preserves your investment value instantly.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right side form panel */}
          <div>
            {/* Terms & Conditions — only for new listings */}
            {!isTermsSubmitted ? (
              <div className="bg-[#111] p-10 sm:p-14 rounded-3xl border border-white/10 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tighter">Terms & Conditions</h2>
                <div className="max-h-64 overflow-y-auto pr-4 space-y-4 text-sm text-slate-400 font-medium mb-8">
                  <p>Welcome to CarRental Fleet Partnership. By listing your vehicle, you agree to these legal bindings.</p>
                  <p><strong>1. Accuracy of Information:</strong> The listed specifications, photos, and condition of your vehicle must be thoroughly accurate. Misrepresentations will lead to a permanent ban.</p>
                </div>
                <label className="flex items-center gap-4 cursor-pointer group mb-10">
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-xl border-2 border-indigo-500/30 bg-black/20 group-hover:border-indigo-400 transition-colors">
                    <input
                      type="checkbox"
                      className="absolute opacity-0 w-full h-full cursor-pointer"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    {termsAccepted && <span className="text-indigo-400">✓</span>}
                  </div>
                  <span className="text-white font-bold text-sm tracking-wide">I agree to the Terms & Conditions.</span>
                </label>
                <button
                  disabled={!termsAccepted}
                  className="btn-primary w-full py-7 rounded-[2rem] text-lg tracking-[0.2em] shadow-indigo-500/20 disabled:opacity-50"
                  onClick={() => setIsTermsSubmitted(true)}
                >
                  Proceed to Listing Form
                </button>
              </div>
            ) : (
              <div className="bg-[#111] p-10 sm:p-14 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">

                {/* Edit mode banner */}
                {isEditMode && (
                  <div className="mb-6 bg-orange-500/10 border border-orange-500/20 p-3 rounded-xl text-orange-400 text-xs font-black uppercase tracking-widest text-center">
                    ✏️ Edit Mode — Listing #{editId}
                  </div>
                )}

                {/* Step indicator */}
                <div className="flex gap-2 mb-10">
                  {[1, 2, 3].map(s => (
                    <div key={s} className={`h-2 flex-1 rounded-full ${step >= s ? "bg-indigo-500" : "bg-white/10"}`} />
                  ))}
                </div>

                <form
                  onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}
                  className="space-y-8"
                >
                  {/* ── Step 1: Specifications & Owner Details ── */}
                  {step === 1 && (
                    <>
                      <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tighter">Step 1: Specifications & Owner Details</h2>
                      
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6 mb-8">
                        <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest">Owner Contact Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Owner Full Name</label>
                            <input name="ownerName" required value={formData.ownerName} onChange={handleChange} placeholder="e.g. John Doe" className="input-field" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Owner Email</label>
                            <input name="ownerEmail" type="email" required value={formData.ownerEmail} onChange={handleChange} placeholder="e.g. john@example.com" className="input-field" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Owner Contact Number</label>
                          <input name="ownerContact" type="tel" required value={formData.ownerContact} onChange={handleChange} placeholder="e.g. +91 9876543210" className="input-field" />
                        </div>
                      </div>

                      <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4">Vehicle Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Vehicle Name</label>
                          <input name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Aventador SVJ" className="input-field" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Brand</label>
                          <input name="brand" required value={formData.brand} onChange={handleChange} placeholder="e.g. Lamborghini" className="input-field" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Type</label>
                          <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Coupe">Coupe</option>
                            <option value="Electric">Electric</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Price / Day (₹)</label>
                          <input name="price" type="number" required value={formData.price} onChange={handleChange} placeholder="e.g. 2500" className="input-field" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Condition</label>
                          <select name="condition" value={formData.condition} onChange={handleChange} className="input-field">
                            <option value="NEW">New (Less than 10k km)</option>
                            <option value="GOOD">Good (10k–50k km)</option>
                            <option value="AVERAGE">Average (50k+ km)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Fuel Type</label>
                          <input name="fuel" required value={formData.fuel} onChange={handleChange} placeholder="e.g. Petrol" className="input-field" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Year</label>
                          <input name="year" type="number" value={formData.year} onChange={handleChange} placeholder="2024" className="input-field" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Seats</label>
                          <input name="seats" type="number" value={formData.seats} onChange={handleChange} placeholder="4" className="input-field" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Transmission</label>
                        <select name="transmission" value={formData.transmission} onChange={handleChange} className="input-field">
                          <option value="Automatic">Automatic</option>
                          <option value="Manual">Manual</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* ── Step 2: Media ── */}
                  {step === 2 && (
                    <>
                      <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tighter">Step 2: Media & Docs</h2>
                      <div className="space-y-6">

                        {/* Existing images preview */}
                        {isEditMode && existingImages.length > 0 && images.length === 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Images</p>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                              {existingImages.map((src, i) => (
                                <img key={i} src={src} alt={`Car ${i+1}`} className="h-24 w-36 object-cover rounded-xl shrink-0 border border-white/10" />
                              ))}
                            </div>
                            <p className="text-xs text-slate-500 font-medium ml-1">Upload new images below to replace them, or leave blank to keep these.</p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">
                            {isEditMode ? "New Car Photos (optional — replaces existing)" : "Car Photos (Up to 5)"}
                          </label>
                          <div className="relative group/file">
                            <input type="file" multiple accept="image/*" onChange={handleImagesChange}
                              required={!isEditMode}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <div className="w-full bg-indigo-500/5 border-2 border-dashed border-indigo-500/20 rounded-2xl px-6 py-10 flex flex-col items-center justify-center group-hover/file:border-indigo-500/40 transition-all">
                              <span className="text-3xl mb-2">📸</span>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                {images.length > 0 ? `${images.length} new image(s) selected` : "Select images"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Existing RC preview */}
                        {isEditMode && existingRC && !rcDocument && (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Current RC Document</p>
                            <a href={existingRC} target="_blank" rel="noreferrer" className="text-xs text-emerald-300 underline">View existing RC document</a>
                            <p className="text-xs text-slate-500 mt-1">Upload a new one below to replace it, or leave blank to keep this.</p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest ml-1">
                            {isEditMode ? "New RC Document (optional — replaces existing)" : "Registration Certificate (RC)"}
                          </label>
                          <div className="relative group/file">
                            <input type="file" accept=".pdf,image/*,.txt" onChange={handleDocChange}
                              required={!isEditMode}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <div className="w-full bg-emerald-500/5 border-2 border-dashed border-emerald-500/20 rounded-2xl px-6 py-6 flex flex-col items-center justify-center group-hover/file:border-emerald-500/40 transition-all">
                              <span className="text-2xl mb-2">📄</span>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                {rcDocument ? rcDocument.name : "Upload RC Document"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── Step 3: Location ── */}
                  {step === 3 && (
                    <>
                      <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tighter">Step 3: Location</h2>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">City / Region</label>
                          <input name="location" required value={formData.location} onChange={handleChange} placeholder="e.g. Mumbai, Maharashtra"
                            className="input-field" />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Navigation buttons */}
                  <div className="flex gap-4 pt-10">
                    {step > 1 && (
                      <button type="button" onClick={() => setStep(step - 1)}
                        className="w-1/3 py-4 rounded-[1.5rem] bg-white/5 text-white font-bold tracking-widest uppercase text-xs hover:bg-white/10 transition">
                        Back
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`btn-primary flex-1 py-4 rounded-[1.5rem] text-sm font-black tracking-[0.2em] shadow-indigo-500/20 disabled:opacity-50 ${isEditMode && step === 3 ? "bg-orange-600 hover:bg-orange-500" : ""}`}
                    >
                      {loading ? "Processing..." : (
                        step < 3 ? "Next Step →" : (isEditMode ? "✅ Resubmit for Review" : "Authorize Listing")
                      )}
                    </button>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="w-1/3 py-4 rounded-[1.5rem] bg-red-600/20 text-red-500 font-bold tracking-widest uppercase text-xs hover:bg-red-600 hover:text-white transition"
                      >
                        Delete Car
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>

        </div>
      </div>
      <style jsx>{`
        .input-field {
          @apply w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 focus:border-indigo-500/40 transition-all font-bold text-white text-xs uppercase;
        }
      `}</style>
    </div>
  );
}

// ── Page wrapper with Suspense (required for useSearchParams in Next.js 15) ──
export default function ListYourCarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 border-r-4 border-r-transparent" />
      </div>
    }>
      <ListCarForm />
    </Suspense>
  );
}
