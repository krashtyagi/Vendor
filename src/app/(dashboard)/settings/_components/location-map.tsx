"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom Leaflet marker icon
const customMarkerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 15, {
        animate: true,
        duration: 1.0,
      });
    }
  }, [center, map]);

  return null;
}

function MapClickHandler({ onChange }: { onChange: (coords: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

interface LocationMapProps {
  center: [number, number]; // [lat, lng]
  onChange: (coords: [number, number]) => void;
}

export default function LocationMap({ center, onChange }: LocationMapProps) {
  // Ensure valid fallback coordinates (e.g. New Delhi: 28.6139, 77.2090) if 0,0 or null
  const validCenter: [number, number] =
    center && !isNaN(center[0]) && !isNaN(center[1]) && center[0] !== 0
      ? center
      : [28.6139, 77.209];

  return (
    <div className="h-[340px] w-full rounded-2xl overflow-hidden border border-border shadow-sm relative z-0">
      <MapContainer
        center={validCenter}
        zoom={14}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={validCenter} />
        <MapClickHandler onChange={onChange} />
        <Marker
          position={validCenter}
          icon={customMarkerIcon}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const pos = marker.getLatLng();
              onChange([pos.lat, pos.lng]);
            },
          }}
        />
      </MapContainer>
    </div>
  );
}
