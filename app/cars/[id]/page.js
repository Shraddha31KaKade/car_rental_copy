"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchWithAuth } from "../../../utils/api";
import dynamic from 'next/dynamic';

const MapLocationDisplay = dynamic(() => import('../../../components/maps/MapLocationDisplay'), { ssr: false });

export default function CarDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/cars/${id}`);
        const data = await res.json();
        if (res.ok) {
          setCar(data);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Fetch car failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 border-r-4 border-r-transparent"></div>
    </div>
  );

  if (!car) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-8">
       <p className="text-white text-4xl font-black uppercase tracking-widest animate-pulse">Vehicle Not Found</p>
       <Link href="/cars" className="btn-outline">Return to Fleet</Link>
    </div>
  );

  const handleBooking = async () => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      if (!token) {
        alert("Please login first to book a car!");
        return;
      }

      if (!startDate || !endDate) {
        alert("Please select both dates!");
        return;
      }

      const start = new Date(startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        alert("⚠️ Selection Error: Journey cannot commence in the past.");
        return;
      }
      
      setCheckoutStep(2);
    } catch (err) {
      console.error("Booking setup error:", err);
    }
  };

  const sendBookingRequest = async () => {
    try {
      setIsSubmitting(true);
      
      const res = await fetchWithAuth("http://localhost:5000/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          carId: Number(id),
          startDate,
          endDate
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Booking failed");

      setIsBooked(true);

    } catch (err) {
      console.error("Booking error:", err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const carImages = {
    "bmw": "/bmw.png",
    "toyota": "/toyota.png",
    "audi": "/audi.png",
    "honda": "/HondaCivic.png",
    "ford": "/FordMustang.png",
    "tesla": "/Tesla.png"
  };

  let displayImage = car.image;
  if (displayImage) {
    if (displayImage.startsWith("/uploads/")) {
      displayImage = `http://localhost:5000${displayImage}`;
    } else if (!displayImage.startsWith("http") && !displayImage.startsWith("/")) {
      displayImage = `/${displayImage}`;
    }
  }

  if (!displayImage) {
    displayImage = "/car-placeholder.png";
    const brandLower = car.brand?.toLowerCase() || car.name?.toLowerCase() || "";
    for (const [key, val] of Object.entries(carImages)) {
      if (brandLower.includes(key)) {
        displayImage = val;
        break;
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-40 pb-24 relative overflow-hidden isolate">

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Link href="/cars" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] mb-12 transition-colors group">
           <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Fleet
        </Link>

        {isBooked ? (
          <div className="max-w-3xl mx-auto text-center bg-[#111] p-20 rounded-3xl border border-white/10">
            <div className="text-9xl mb-10">📨</div>
            <h1 className="text-6xl font-black text-white mb-6 tracking-tighter uppercase italic">Request Sent</h1>
            <p className="text-indigo-400 text-2xl font-black mb-12 tracking-widest uppercase">Host is reviewing.</p>
            <p className="text-slate-400 mb-16 text-lg max-w-sm mx-auto font-medium leading-relaxed">
              Your reservation request for the <span className="text-white font-bold">{car.name}</span> has been forwarded to the elite owner for approval. Payment will be authorized upon acceptance.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/booking" className="btn-primary">View Journey Log</Link>
              <Link href="/cars" className="btn-outline">Browse More</Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-16 items-start justify-center">

          {/* IMAGE SECTION */}
          <div className="lg:sticky lg:top-40 w-full lg:w-1/2">
            <div className="bg-[#111] rounded-3xl border border-white/10 p-12 overflow-hidden">
              <Image
                src={displayImage}
                alt={car.name}
                width={800}
                height={500}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* DETAILS SECTION */}
          <div className="w-full lg:w-1/2">
            <div className="bg-[#111] rounded-3xl border border-white/10 p-10 sm:p-14 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-12 gap-6">
                <div>
                  <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                     {car.brand || "Elite"} Collection
                  </div>
                  <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 tracking-tighter leading-none uppercase italic">
                    {car.name}
                  </h1>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">
                    {car.type || "Performance"} • {car.year || "2024"} Release
                  </p>
                </div>
                <div className="sm:text-right border-l sm:border-l-0 sm:border-r border-indigo-500/20 sm:pr-8 pl-8 sm:pl-0">
                  <div className="text-4xl font-black text-white tracking-tighter">
                    ₹{car.price}
                  </div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">per journey</p>
                </div>
              </div>

              {/* OWNER TRACKER */}
              <div className="mb-12 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-4 group cursor-help relative hover:border-indigo-500/30 transition-all">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xl">👤</div>
                 <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Elite Origin (Owner)</p>
                    <p className="text-white font-black uppercase tracking-tight blur-sm select-none group-hover:blur-0 transition-all">Protected Identity</p>
                    <p className="text-[8px] text-indigo-400 uppercase tracking-widest mt-1">Contact revealed post-authorization</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-12">
                {[
                  { icon: "👥", label: "Capacity", value: `${car.seats || 4} Seats` },
                  { icon: "⚙️", label: "Drivetrain", value: car.transmission || "Automatic" },
                  { icon: "⛽", label: "Propulsion", value: car.fuel || "Hybrid" },
                  { icon: "📍", label: "Origin", value: car.location || "Global Access" }
                ].map((spec, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-5 rounded-2xl group/spec hover:border-indigo-500/30 transition-colors">
                    <div className="text-2xl mb-2 opacity-50 group-hover/spec:opacity-100 transition-opacity">{spec.icon}</div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{spec.label}</p>
                    <p className="font-bold text-white text-xs">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* LOCATION MAP */}
              {car.lat && car.lng && (
                <div className="mb-12">
                   <h3 className="text-white font-bold uppercase tracking-[0.4em] text-[10px] mb-6 opacity-40">Vehicle Geo-Location</h3>
                   <MapLocationDisplay position={{ lat: car.lat, lng: car.lng }} name={car.name} />
                </div>
              )}

              <div className="space-y-8">
                {/* CHECKOUT STEPPER UI */}
                <div className="flex items-center justify-between mb-8 opacity-60 w-1/2">
                   {[1,2].map(step => (
                     <div key={step} className={`flex items-center ${checkoutStep === step ? 'opacity-100 text-indigo-400 font-black' : 'opacity-40'} w-full`}>
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${checkoutStep === step ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-white/5'} border`}>{step}</div>
                        {step < 2 && <div className="h-0.5 w-full bg-white/10 mx-2"></div>}
                     </div>
                   ))}
                </div>

                {checkoutStep === 1 && (
                  <div>
                    <h3 className="text-white font-bold uppercase tracking-[0.4em] text-[10px] mb-6 opacity-40">STEP 1: Schedule Configuration</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Departure Date</label>
                        <input
                          type="date"
                          className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-indigo-500/40 transition-all font-bold text-white text-xs uppercase"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Return Date</label>
                        <input
                          type="date"
                          className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-indigo-500/40 transition-all font-bold text-white text-xs uppercase"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleBooking} // Opens Step 2
                      className="btn-primary w-full mt-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest"
                    >
                      Configure Mission
                    </button>
                  </div>
                )}

                {checkoutStep === 2 && (
                  <div className="bg-[#111] border border-white/10 p-8 rounded-2xl">
                     <h3 className="text-white font-bold uppercase tracking-[0.4em] text-[10px] mb-6 opacity-40">STEP 2: Host Request Review</h3>
                     
                     <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-slate-400 text-xs font-black uppercase tracking-widest"><p>Base Rate</p><p>₹{car.price} / day</p></div>
                        <div className="flex justify-between text-slate-400 text-xs font-black uppercase tracking-widest"><p>Duration</p><p>{Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1} Days</p></div>
                        <div className="w-full h-px bg-white/10 my-4"></div>
                        <div className="flex justify-between text-indigo-400 text-sm font-black uppercase tracking-widest"><p>Estimated Charge</p><p>₹{(car.price * (Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1)).toLocaleString()}</p></div>
                     </div>

                     <div className="bg-slate-900 border border-indigo-500/10 border-l-4 border-l-indigo-500 rounded-xl p-4 flex flex-col gap-2 mb-8">
                         <p className="text-[10px] text-white uppercase tracking-widest font-black leading-relaxed">System Rule Triggered: Owner Approval Required</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">No payment will be collected until host confirms vehicle availability.</p>
                     </div>

                     <button
                        onClick={sendBookingRequest}
                        disabled={isSubmitting}
                        className="btn-primary w-full py-5 rounded-2xl text-sm font-black uppercase tracking-widest bg-gradient-to-r from-indigo-500 to-violet-500 disabled:opacity-50"
                      >
                        {isSubmitting ? "Transmitting..." : "Send Booking Request"}
                      </button>

                      <button onClick={() => setCheckoutStep(1)} className="text-xs uppercase tracking-widest text-slate-500 mt-6 hover:text-white transition-colors font-black text-center w-full block">Modify Dates</button>
                  </div>
                )}

              </div>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
