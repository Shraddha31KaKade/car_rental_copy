"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "../../utils/api";
// Removed MapLocationPicker to eliminate Leaflet issues

export default function ListYourCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTermsSubmitted, setIsTermsSubmitted] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Media, 3: Location

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    type: "Sedan",
    condition: "GOOD",
    year: "2024",
    price: "",
    seats: "4",
    transmission: "Automatic",
    fuel: "Petrol",
    location: "",
  });

  const [images, setImages] = useState([]);
  const [rcDocument, setRcDocument] = useState(null);
// Location handling simplified, position state removed

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (e) => {
    setImages(Array.from(e.target.files));
  };
  
  const handleDocChange = (e) => {
    setRcDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      if (!token) {
        alert("Please login as an owner to list your vehicle.");
        setLoading(false);
        return;
      }

      const dataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        dataToSend.append(key, formData[key]);
      });
      
      // Append multiple images
      images.forEach(img => {
        dataToSend.append("images", img);
      });

      // Append document
      if (rcDocument) {
         dataToSend.append("rcDocument", rcDocument);
      }

      // Location is submitted as simple text field from formData.location

      const res = await fetchWithAuth("http://localhost:5000/api/cars", {
        method: "POST",
        body: dataToSend
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setSuccess(true);
      setTimeout(() => router.push("/cars"), 3000);

    } catch (err) {
      console.error("List car error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-40 pb-24 relative overflow-hidden isolate">
       <div className="max-w-7xl mx-auto px-6 relative z-10">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
           
           <div>
             <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
                Partner Program
             </div>
             <h1 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter uppercase italic leading-[0.9]">
               Monetize Your <span className="text-indigo-500">Fleet</span>
             </h1>
             
             <div className="space-y-12 pr-0 lg:pr-12">
                <div className="space-y-4">
                   <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs">01. The Covenant</h3>
                   <p className="text-slate-400 font-medium leading-relaxed">
                     By listing your vehicle on CarRental, you enter into a premium partnership. We ensure your asset is handled only by verified members of our elite community.
                   </p>
                </div>
                <div className="space-y-4">
                   <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs">02. Security Bonds</h3>
                   <p className="text-slate-400 font-medium leading-relaxed">
                     Every rental is covered by a high-stakes security bond. In the event of any discrepancy, our automated resolution system preserves your investment value instantly.
                   </p>
                </div>
             </div>
           </div>

           <div>
             {success ? (
               <div className="bg-slate-900/40 backdrop-blur-3xl p-16 rounded-[4rem] border border-indigo-500/30 text-center shadow-2xl">
                  <div className="text-8xl mb-8">🚀</div>
                  <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Asset Integrated</h2>
                  <p className="text-indigo-400 font-black uppercase tracking-widest text-[10px] mb-10">Verification Protocol Initialized</p>
                  <p className="text-slate-500 max-w-xs mx-auto font-medium">Your vehicle is being reviewed by our specialists. Redirecting to fleet...</p>
               </div>
             ) : (
               !isTermsSubmitted ? (
                 <div className="bg-[#111] p-10 sm:p-14 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
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
                 
                 <div className="flex gap-2 mb-10">
                    {[1,2,3].map(s => (
                       <div key={s} className={`h-2 flex-1 rounded-full ${step >= s ? 'bg-indigo-500' : 'bg-white/10'}`} />
                    ))}
                 </div>

                 <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }} className="space-y-8">
                   
                   {step === 1 && (
                     <>
                        <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tighter">Step 1: Specifications</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Vehicle Name</label>
                             <input name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Aventador SVJ"
                               className="input-field" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Brand</label>
                             <input name="brand" required value={formData.brand} onChange={handleChange} placeholder="e.g. Lamborghini"
                               className="input-field" />
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
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Price (Per Day)</label>
                             <input name="price" type="number" required value={formData.price} onChange={handleChange} placeholder="e.g. 500"
                               className="input-field" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Condition</label>
                             <select name="condition" value={formData.condition} onChange={handleChange} className="input-field">
                               <option value="NEW">New (Less than 10k miles)</option>
                               <option value="GOOD">Good (10k-50k miles)</option>
                               <option value="AVERAGE">Average (50k+ miles)</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Fuel</label>
                             <input name="fuel" required value={formData.fuel} onChange={handleChange} placeholder="e.g. Electric"
                               className="input-field" />
                          </div>
                        </div>
                     </>
                   )}

                   {step === 2 && (
                     <>
                        <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tighter">Step 2: Media & Auth</h2>
                        <div className="space-y-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Car Photos (Up to 5)</label>
                             <div className="relative group/file">
                                <input type="file" multiple accept="image/*" onChange={handleImagesChange} required
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                <div className="w-full bg-indigo-500/5 border-2 border-dashed border-indigo-500/20 rounded-2xl px-6 py-10 flex flex-col items-center justify-center group-hover/file:border-indigo-500/40 transition-all">
                                   <span className="text-3xl mb-2">📸</span>
                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                     {images.length > 0 ? `${images.length} images selected` : "Select multiple images"}
                                   </p>
                                </div>
                             </div>
                           </div>

                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest ml-1">Registration Certificate (RC)</label>
                             <div className="relative group/file">
                                <input type="file" accept=".pdf,image/*,.txt" onChange={handleDocChange} required
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                <div className="w-full bg-emerald-500/5 border-2 border-dashed border-emerald-500/20 rounded-2xl px-6 py-6 flex flex-col items-center justify-center group-hover/file:border-emerald-500/40 transition-all">
                                   <span className="text-2xl mb-2">📄</span>
                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                     {rcDocument ? rcDocument.name : "Upload RC Document for Verification"}
                                   </p>
                                </div>
                             </div>
                           </div>
                        </div>
                     </>
                   )}

                   {step === 3 && (
                     <>
                        <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tighter">Step 3: Location</h2>
                        <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">City / Region Name</label>
                             <input name="location" required value={formData.location} onChange={handleChange} placeholder="e.g. Monaco City Center"
                               className="input-field" />
                          </div>
                          
                          <div className="space-y-2 pt-4">
                             <p className="text-slate-400 text-xs">Note: Map selection has been removed. Simply provide the specific region.</p>
                          </div>
                        </div>
                     </>
                   )}

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
                        className="btn-primary flex-1 py-4 rounded-[1.5rem] text-sm font-black tracking-[0.2em] shadow-indigo-500/20 disabled:opacity-50"
                      >
                        {loading ? "Processing..." : (step === 3 ? "Authorize Listing" : "Next Step")}
                      </button>
                   </div>

                 </form>
               </div>
               )
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
