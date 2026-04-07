"use client";
import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

// CarCard component
function CarCard({ car, index }) {
  // Map car image if missing or placeholder
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
    <div 
      className="group carCard animate-fadeUp"
      style={{ animationDelay: `${200 + index * 50}ms` }}
    >
      <div className="carImageWrapper h-64">
        <Image
          src={displayImage}
          alt={car.name}
          width={500}
          height={300}
          className="carImage w-full h-full object-cover"
        />
        <span className="availableBadge">
          {car.owner?.name ? `Elite Origin: ${car.owner.name}` : "Exclusive"}
        </span>
        <span className="priceBadge font-mono">
          ₹{car.price}<span className="text-[10px] opacity-50 ml-1">/DAY</span>
        </span>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-black text-2xl text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
            {car.name}
          </h2>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
            {car.year || "2024"}
          </span>
        </div>
        
        <p className="text-slate-400 font-medium text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
           {car.type || "Performance"} • {car.location || "Global"}
        </p>

        <div className="grid grid-cols-2 gap-4 text-slate-300 text-[10px] font-black uppercase tracking-widest mb-8">
          <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="opacity-70 text-lg">👥</span> {car.seats || "4"} Seats
          </div>
          <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="opacity-70 text-lg">⚙️</span> {car.transmission || "Auto"}
          </div>
          <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="opacity-70 text-lg">⛽</span> {car.fuel || "Hybrid"}
          </div>
          <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
             <span className="opacity-70 text-lg">📍</span> Origins
          </div>
        </div>

        <NextLink
          href={`/cars/${car.id}`}
          className="viewBtn"
        >
          Secure Experience
        </NextLink>
      </div>
    </div>
  );
}

export default function CarsPage() {
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get('search') || "";
  
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const url = searchFromUrl 
          ? `http://localhost:5000/api/cars?search=${encodeURIComponent(searchFromUrl)}`
          : `http://localhost:5000/api/cars`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (res.ok) {
          setCars(data);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [searchFromUrl]);

  return (
    <div className="relative isolate min-h-screen pt-40 pb-24 overflow-hidden bg-[#020617]">
      {/* Background Blobs */}
      <div className="bg-blob blob-indigo top-[10%] left-[-10%] opacity-10"></div>
      <div className="bg-blob blob-violet bottom-[10%] right-[-10%] opacity-10"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24 animate-fadeUp">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
            Curated Excellence
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-white">
            The <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent italic">Escape</span> Fleet
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Every vehicle in our collection is a masterpiece of design and performance.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-24 animate-scaleIn delay-100">
          <div className="relative w-full max-w-xl group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-indigo-400 text-xl">
               <span className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">🔍</span>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              window.history.pushState(null, '', `/cars?search=${encodeURIComponent(searchTerm)}`);
              // Force re-fetch manually if needed, or rely on searchParams change
              const event = new PopStateEvent('popstate');
              window.dispatchEvent(event);
            }}>
              <input
                type="text"
                placeholder="Search by brand or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] pl-16 pr-6 py-7 focus:outline-none focus:border-indigo-500/40 transition-all shadow-2xl font-bold text-white placeholder:text-slate-700 text-lg"
              />
            </form>
          </div>
        </div>

        {/* Cars Grid */}
        {loading ? (
          <div className="flex justify-center py-40">
             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 border-r-4 border-r-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {cars.length > 0 ? (
              cars.map((car, index) => <CarCard key={car.id} car={car} index={index} />)
            ) : (
              <div className="text-center col-span-full py-40 animate-fadeIn bg-slate-900/20 border border-white/5 rounded-[4rem] backdrop-blur-3xl">
                <div className="text-9xl mb-8 animate-float brightness-150">🏎️💨</div>
                <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Fleet Not Found</h2>
                <p className="text-slate-500 text-xl font-medium max-w-xs mx-auto">Refine your criteria for the perfect escape.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
