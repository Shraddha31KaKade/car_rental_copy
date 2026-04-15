"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ResetCenterView({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);
  return null;
}

export default function MapLocationDisplay({ position, name }) {
  if (!position) return null;

  return (
    <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-white/10 z-0">
      <MapContainer 
        center={position} 
        zoom={15} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        <Marker position={position}>
          <Popup minWidth={90}>{name || "Vehicle Location"}</Popup>
        </Marker>
        <ResetCenterView position={position} />
      </MapContainer>
    </div>
  );
}
