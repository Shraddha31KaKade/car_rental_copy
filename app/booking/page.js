"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MyBookingsPage() {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      setLoading(false);
      return;
    }

    setUser(storedUser);

    fetch("http://localhost:5000/api/bookings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }
        return res.json();
      })
      .then((data) => {
        setMyBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load bookings:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (bookingId) => {
    const confirmDelete = window.confirm(
      "⚠️ Cancellation Policy: Full refund is not available. Advanced booking fees will not be refunded. Are you sure you want to cancel?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setMyBookings((prev) => prev.filter((b) => b.id !== bookingId));
        alert("Booking cancelled successfully.");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel booking.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error cancelling booking.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 border-r-4 border-r-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 animate-fadeUp relative overflow-hidden">
        <div className="bg-blob blob-indigo top-0 left-0 opacity-10"></div>
        <div className="text-8xl mb-8 animate-float">🔒</div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">Access Reserved</h1>
        <p className="text-slate-500 mb-10 text-center max-w-sm font-medium leading-relaxed">
          Please sign in to your CarRental account to access your exclusive journey logs.
        </p>
        <Link href="/" className="btn-primary">
          Return to Hub
        </Link>
      </div>
    );
  }

  const now = new Date();
  const activeBookings = myBookings.filter(b => new Date(b.endDate) >= now);
  const pastBookings = myBookings.filter(b => new Date(b.endDate) < now);

  const BookingCard = ({ booking, index, isActive }) => {
    const car = booking.car || {};
    const startDate = new Date(booking.startDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const endDate = new Date(booking.endDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    
    const carImages = {
      "bmw": "/bmw.png",
      "toyota": "/toyota.png",
      "audi": "/audi.png",
      "honda": "/HondaCivic.png",
      "ford": "/FordMustang.png",
      "tesla": "/Tesla.png"
    };

    let carImg = car.image
      ? (car.image.startsWith("http") || car.image.startsWith("/") ? car.image : `/${car.image}`)
      : "/car-placeholder.png";

    if (!car.image) {
      const nameLower = car.name?.toLowerCase() || "";
      for (const [key, val] of Object.entries(carImages)) {
        if (nameLower.includes(key)) {
          carImg = val;
          break;
        }
      }
    }

    return (
      <div
        className="group flex flex-col lg:flex-row items-center gap-10 bg-slate-900/30 rounded-[3rem] border border-white/5 backdrop-blur-3xl hover:border-indigo-500/40 transition-all duration-700 p-8 sm:p-10 animate-fadeUp relative overflow-hidden"
        style={{ animationDelay: `${100 + index * 100}ms` }}
      >
        <div className="bg-slate-800/40 p-8 rounded-3xl w-full lg:w-72 flex-shrink-0 flex justify-center items-center overflow-hidden border border-white/5 relative z-10">
          <Image
            src={carImg}
            alt={car.name || "Car"}
            width={300}
            height={180}
            className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transition-all duration-1000 group-hover:scale-110 group-hover:-rotate-3"
          />
        </div>

        <div className="flex-1 w-full text-center lg:text-left relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
            <div className="text-left w-full sm:w-auto">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tighter group-hover:text-indigo-400 transition-colors uppercase italic">
                {car.name || "Elite Performance"}
              </h2>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`}></span>
                {isActive ? 'Active Expedition' : 'Past Venture'} • ID: #{booking.id?.toString().slice(-6) || "N/A"}
              </div>
            </div>
            
            <div className="flex flex-col items-end w-full sm:w-auto">
              <div className="text-right p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 w-full sm:w-60">
                 <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Elite Origin (Owner)</p>
                 <p className="text-white text-xs font-black uppercase tracking-tight truncate">{car.owner?.name || "Premium Rental Collective"}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2 bg-black/20 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden">
               <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-6">Journey Logistics Tracker</p>
               <div className="relative flex justify-between items-center px-4">
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-800 -translate-y-1/2 z-0"></div>
                  <div className={`absolute top-1/2 left-0 h-[1.5px] bg-indigo-500 -translate-y-1/2 z-0 transition-all duration-1000 ${
                    booking.status === 'REJECTED' ? 'w-0' :
                    booking.status === 'KEYS_COLLECTED' ? 'w-full' : 
                    ['DOCS_WITH_OWNER','APPROVED'].includes(booking.status) ? 'w-1/2' : 'w-[5%]'
                  }`}></div>

                  {[
                    { label: 'Requested', sub: booking.status === 'PENDING' ? 'Awaiting Host' : booking.status === 'REJECTED' ? 'Declined' : 'Approved', icon: booking.status === 'REJECTED' ? '❌' :'📍', status: 'PENDING' },
                    { label: 'Documents', sub: 'At Origin', icon: '📄', status: 'DOCS_WITH_OWNER' },
                    { label: 'Access', sub: 'Keys Received', icon: '🔑', status: 'KEYS_COLLECTED' }
                  ].map((step, i) => {
                    const isCompleted = (i === 0 && booking.status !== 'PENDING' && booking.status !== 'REJECTED') || 
                      (booking.status === 'DOCS_WITH_OWNER' && i <= 1) || 
                      (booking.status === 'KEYS_COLLECTED');
                    
                    const isRejected = i === 0 && booking.status === 'REJECTED';

                    return (
                      <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-500 border-2 ${
                          isRejected ? 'bg-rose-500 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]' :
                          isCompleted ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-900 border-slate-700 text-slate-500'
                        }`}>
                          {step.icon}
                        </div>
                        <div className="text-center">
                          <p className={`text-[8px] font-black uppercase tracking-tighter ${isCompleted || isRejected ? 'text-white' : 'text-slate-600'}`}>{step.label}</p>
                          <p className={`text-[7px] font-bold uppercase tracking-widest ${isRejected ? 'text-rose-400' : 'text-slate-500'}`}>{step.sub}</p>
                        </div>
                      </div>
                    );
                  })}
               </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-black/20 p-6 rounded-[2rem] border border-white/5 flex flex-col justify-center">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Total investment</p>
                <p className="text-3xl font-black text-white italic">₹{car.price || 0}<span className="text-[10px] text-slate-500 ml-1">/24H</span></p>
              </div>
              <button 
                onClick={() => handleDelete(booking.id)}
                className="w-full py-4 rounded-[1.5rem] bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:border-rose-500 text-rose-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all duration-300"
              >
                Cancel Journey
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-10 opacity-60">
            <div className="space-y-1.5">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Deployment Window</p>
              <p className="text-xs font-bold text-slate-200 uppercase tracking-tighter">{startDate} <span className="text-indigo-500 mx-1">/</span> {endDate}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-40 pb-24 relative overflow-hidden isolate">
       <div className="bg-blob blob-indigo top-0 right-0 opacity-10"></div>
       <div className="bg-blob blob-violet bottom-0 left-0 opacity-10"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="mb-24 animate-fadeUp">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
            Elite Logbook
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase italic leading-[0.9]">
            The <span className="text-indigo-500">Journey</span> Archives
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-xl">Curating your legacy across the roads of tomorrow.</p>
        </div>

        {myBookings.length === 0 ? (
          <div className="text-center bg-slate-900/20 py-32 rounded-[4rem] border border-white/5 backdrop-blur-3xl animate-fadeUp delay-100 shadow-2xl">
            <div className="text-9xl mb-10 opacity-20 animate-float brightness-150">🏎️</div>
            <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">No Active Logs</h2>
            <p className="text-slate-500 mb-14 max-w-xs mx-auto font-medium text-lg">Your next peak performance is just one reservation away.</p>
            <Link href="/cars" className="btn-primary px-12">
              Explore the Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-32">
            {/* ACTIVE BOOKINGS */}
            <div className="space-y-12">
               <div className="flex items-center gap-6">
                  <h2 className="text-[10px] font-black text-white uppercase tracking-[0.5em] whitespace-nowrap">Active Expeditions</h2>
                  <div className="h-px w-full bg-gradient-to-r from-indigo-500/20 to-transparent"></div>
               </div>
               
               <div className="grid gap-10">
                 {activeBookings.length > 0 ? (
                   activeBookings.map((b, i) => <BookingCard key={b.id} booking={b} index={i} isActive={true} />)
                 ) : (
                   <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest text-center py-10 bg-white/5 rounded-3xl border border-dashed border-white/5">No current missions in progress</p>
                 )}
               </div>
            </div>

            {/* PAST BOOKINGS */}
            <div className="space-y-12">
               <div className="flex items-center gap-6">
                  <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] whitespace-nowrap">Past Ventures</h2>
                  <div className="h-px w-full bg-gradient-to-r from-slate-500/10 to-transparent"></div>
               </div>
               
               <div className="grid gap-10 opacity-60 hover:opacity-100 transition-opacity duration-700">
                 {pastBookings.length > 0 ? (
                   pastBookings.map((b, i) => <BookingCard key={b.id} booking={b} index={i} isActive={false} />)
                 ) : (
                   <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest text-center py-10">No historical records found</p>
                 )}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}