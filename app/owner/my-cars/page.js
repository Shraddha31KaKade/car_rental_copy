"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchWithAuth } from "../../../utils/api";

export default function MyCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (!token) return;

        const res = await fetchWithAuth("http://localhost:5000/api/owner/cars", {
          method: "GET"
        });
        
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

    fetchCars();
  }, []);

  if (loading) return <div className="text-white animate-pulse">Retrieving Fleet Data...</div>;

  return (
    <div className="animate-fadeUp">
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">My Fleet</h1>
        <div className="bg-indigo-500/20 px-4 py-1.5 border border-indigo-500/30 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-widest">
          {cars.length} Active Vehicles
        </div>
      </div>
      
      {cars.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl">
           <div className="text-6xl mb-4 opacity-50">🏎️</div>
           <p className="text-slate-400 font-bold tracking-widest uppercase">No vehicles listed yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <div key={car.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden group">
              <div className="h-48 relative overflow-hidden bg-slate-900">
                <Image 
                  src={car.image ? (car.image.startsWith('/upload') ? `http://localhost:5000${car.image}` : car.image) : "/car-placeholder.png"} 
                  alt={car.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
                {!car.availability && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-rose-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Hidden</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-white mb-2">{car.name}</h3>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                  <span>{car.year || '2024'}</span>
                  <span className="text-indigo-400">₹{car.price}/day</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
