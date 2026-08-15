"use client";

import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// A component to automatically fit map to all markers
function MapBounds({ markers }) {
  const map = useMap();
  React.useEffect(() => {
    if (!markers || markers.length === 0) return;
    const bounds = L.latLngBounds(markers.map(m => m.pos));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [markers, map]);

  return null;
}

const fallbackLocations = {
  "delhi": { lat: 28.6139, lng: 77.2090 },
  "new delhi": { lat: 28.6139, lng: 77.2090 },
  "mumbai": { lat: 19.0760, lng: 72.8777 },
  "bangalore": { lat: 12.9716, lng: 77.5946 },
  "chennai": { lat: 13.0827, lng: 80.2707 },
  "kolkata": { lat: 22.5726, lng: 88.3639 },
  "pune": { lat: 18.5204, lng: 73.8567 },
  "hyderabad": { lat: 17.3850, lng: 78.4867 },
  "india": { lat: 20.5937, lng: 78.9629 },
};

function getLatLng(car) {
  if (car.lat && car.lng) return [car.lat, car.lng];
  
  if (car.location) {
     const loc = car.location.toLowerCase();
     for (const key of Object.keys(fallbackLocations)) {
        if (loc.includes(key)) {
           // Add slight jitter so multiple cars in "Delhi" don't overlap completely
           const jitterLat = (Math.random() - 0.5) * 0.02;
           const jitterLng = (Math.random() - 0.5) * 0.02;
           return [fallbackLocations[key].lat + jitterLat, fallbackLocations[key].lng + jitterLng];
        }
     }
  }
  
  // Default to central Delhi with wider jitter if completely unknown
  const pseudoSeed = car.id || Math.random();
  const jitterLat = ((pseudoSeed % 10) * 0.05) - 0.25;
  const jitterLng = (((pseudoSeed * 3) % 10) * 0.05) - 0.25;
  return [28.6139 + jitterLat, 77.2090 + jitterLng];
}

export default function SearchMap({ cars, hoverCarId }) {
  const router = useRouter();
  const defaultCenter = { lat: 28.6139, lng: 77.2090 };

  const markers = useMemo(() => {
    if (!cars) return [];
    return cars.map(car => ({
      car,
      pos: getLatLng(car)
    }));
  }, [cars]);

  return (
    <div className="h-[600px] w-full rounded-3xl overflow-hidden border border-white/10 relative z-0 shadow-2xl">
      <MapContainer 
        center={defaultCenter} 
        zoom={10} 
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        
        {markers.map(({ car, pos }) => {
           // Special icon for hovered car
           const isHovered = hoverCarId === car.id;
           const icon = L.icon({
             iconUrl: isHovered 
                 ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png'
                 : 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
             shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
             iconSize: isHovered ? [30, 48] : [25, 41],
             iconAnchor: isHovered ? [15, 48] : [12, 41],
             popupAnchor: [1, -34],
             shadowSize: [41, 41]
           });

           return (
             <Marker 
               key={car.id} 
               position={pos}
               icon={icon}
               zIndexOffset={isHovered ? 1000 : 0}
             >
               <Popup minWidth={250} className="custom-popup">
                 <div className="flex flex-col gap-3 p-1">
                   <div className="h-32 w-full relative rounded-xl overflow-hidden bg-slate-900 leading-[0]">
                     {car.images && car.images[0] ? (
                       <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover" />
                     ) : (
                       <Image 
                         src={car.image ? (car.image.startsWith('/upload') ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${car.image}` : car.image) : "/car-placeholder.png"} 
                         alt={car.name} 
                         fill 
                         className="object-cover"
                         unoptimized
                       />
                     )}
                   </div>
                   <div>
                     <h3 className="font-black text-slate-800 text-lg leading-tight">{car.name}</h3>
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">₹{car.price} / day</p>
                   </div>
                   <button 
                     onClick={() => router.push(`/cars/${car.id}`)}
                     className="w-full py-2 bg-indigo-500 text-white font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-indigo-600 transition-colors mt-2"
                   >
                     View Booking Details
                   </button>
                 </div>
               </Popup>
             </Marker>
           );
        })}
        <MapBounds markers={markers} />
      </MapContainer>
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 1.5rem;
          padding: 0;
          overflow: hidden;
        }
        .custom-popup .leaflet-popup-content {
          margin: 12px;
        }
      `}</style>
    </div>
  );
}
