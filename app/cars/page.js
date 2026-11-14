"use client";
import React, { useState, useEffect, Suspense } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const SearchMap = dynamic(() => import("../../components/maps/SearchMap"), { ssr: false });

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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  if (displayImage) {
    if (displayImage.startsWith("/uploads/")) {
      displayImage = `${apiUrl}${displayImage}`;
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
      className="group carCard"
      onMouseEnter={() => window.dispatchEvent(new CustomEvent('carHover', { detail: car.id }))}
      onMouseLeave={() => window.dispatchEvent(new CustomEvent('carHover', { detail: null }))}
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
          <h2 className="font-black text-2xl text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
            {car.name}
          </h2>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            {car.year || "2024"}
          </span>
        </div>
        
        <p className="text-slate-500 font-medium text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
           {car.type || "Performance"} • {car.location || "Global"}
        </p>

        <div className="grid grid-cols-2 gap-4 text-slate-700 text-[10px] font-black uppercase tracking-widest mb-8">
          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="opacity-70 text-lg">👥</span> {car.seats || "4"} Seats
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="opacity-70 text-lg">⚙️</span> {car.transmission || "Auto"}
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="opacity-70 text-lg">⛽</span> {car.fuel || "Hybrid"}
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
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

function CarsContent() {
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get('search') || "";
  const latFromUrl = searchParams.get('lat') || "";
  const lngFromUrl = searchParams.get('lng') || "";
  const startFromUrl = searchParams.get('startDate') || "";
  const endFromUrl = searchParams.get('endDate') || "";
  
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [hoverCarId, setHoverCarId] = useState(null);

  useEffect(() => {
    const handleHover = (e) => setHoverCarId(e.detail);
    window.addEventListener('carHover', handleHover);
    return () => window.removeEventListener('carHover', handleHover);
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchFromUrl) params.append('search', searchFromUrl);
        if (latFromUrl) params.append('lat', latFromUrl);
        if (lngFromUrl) params.append('lng', lngFromUrl);
        if (startFromUrl) params.append('startDate', startFromUrl);
        if (endFromUrl) params.append('endDate', endFromUrl);

        const paramString = params.toString();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const url = paramString 
          ? `${apiUrl}/api/cars?${paramString}`
          : `${apiUrl}/api/cars`;
        
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
  }, [searchFromUrl, latFromUrl, lngFromUrl, startFromUrl, endFromUrl]);

  return (
    <div className="relative isolate min-h-screen pt-32 pb-24 bg-slate-50 text-slate-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header & Controls Area */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 gap-8">
          <div>
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              Curated Excellence
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 mb-2">
              The <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 bg-clip-text text-transparent italic">Escape</span> Fleet
            </h1>
            <p className="text-slate-600 text-lg font-medium leading-relaxed max-w-xl">
              Every vehicle in our collection is a masterpiece of design and performance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-96 group text-slate-900">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-blue-600">
                 <span>🔍</span>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                window.history.pushState(null, '', `/cars?search=${encodeURIComponent(searchTerm)}`);
                const event = new PopStateEvent('popstate');
                window.dispatchEvent(event);
              }}>
                <input
                  type="text"
                  placeholder="Search by brand or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-blue-500 transition-all shadow-md font-bold placeholder:text-slate-400 text-sm"
                />
              </form>
            </div>

            {/* View Map Toggle */}
            <button 
              onClick={() => setShowMap(!showMap)}
              title={showMap ? "Hide Map" : "Show Map"}
              className="w-14 h-14 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 hover:border-blue-400 flex items-center justify-center transition-all shadow-md text-2xl group text-slate-700"
            >
              <span className="group-hover:scale-110 transition-transform">
                {showMap ? "🗺️" : "🌍"}
              </span>
            </button>
          </div>
        </div>

        {/* Split Layout Container */}
        <div className={`flex flex-col xl:flex-row gap-8 ${!showMap ? 'justify-center mx-auto max-w-7xl' : ''}`}>
          
          {/* Map Side (Sticky) */}
          {showMap && (
             <div className="w-full xl:w-1/3 relative z-20">
               <div className="xl:sticky xl:top-32 h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-lg group bg-white">
                 <div className="h-[600px] w-full [&>div]:h-full">
                    <SearchMap cars={cars} hoverCarId={hoverCarId} />
                 </div>
               </div>
             </div>
          )}

          {/* Cars Grid Side */}
          <div className={`w-full ${showMap ? 'xl:w-2/3' : 'w-full'}`}>
            {loading ? (
              <div className="flex justify-center py-40">
                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-r-4 border-r-transparent"></div>
              </div>
            ) : (
              <div className={`grid grid-cols-1 ${showMap ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                {cars.length > 0 ? (
                  cars.map((car, index) => <CarCard key={car.id} car={car} index={index} />)
                ) : (
                  <div className={`text-center col-span-full py-32 bg-white border border-slate-200 rounded-3xl shadow-sm`}>
                    <div className="text-6xl mb-6">🏎️</div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Fleet Not Found</h2>
                    <p className="text-slate-500 max-w-xs mx-auto">Refine your criteria for the perfect escape.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-r-4 border-r-transparent"></div>
      </div>
    }>
      <CarsContent />
    </Suspense>
  );
}
