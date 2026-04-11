"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";
import { useRouter } from "next/navigation";

export default function CarMap({ cars = [], centerLat, centerLng }) {
  const router = useRouter();
  // Default center (Pune for example, overridden by user location)
  const defaultCenter = [centerLat || 18.5204, centerLng || 73.8567]; 

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
      <MapContainer center={defaultCenter} zoom={11} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cars.map((car, index) => {
          // If no coordinates in DB, fallback to an array around Pune for demo
          const fallbackLat = defaultCenter[0] + (Math.random() - 0.5) * 0.1;
          const fallbackLng = defaultCenter[1] + (Math.random() - 0.5) * 0.1;
          const lat = car.lat || fallbackLat;
          const lng = car.lng || fallbackLng;
          
          return (
            <Marker key={car.id || index} position={[lat, lng]}>
              <Popup>
                <div style={{ textAlign: "center" }}>
                  <img src={car.image || "/ferrari.png"} alt={car.name} style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
                  <h4 style={{ margin: "5px 0" }}>{car.name}</h4>
                  <p style={{ margin: "0", fontWeight: "bold" }}>₹{car.price} / day</p>
                  <button 
                    onClick={() => router.push(`/cars/${car.id}`)}
                    style={{ background: "#2563eb", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", marginTop: "5px"}}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
