"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Curated bright, sunlit, ultra-luxury resort & hotel photography (No dark hallways, No watermark text)
const HOTEL_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85", // Sunlit tropical luxury resort & infinity pool
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=2000&q=85", // Bright modern luxury suite with panoramic glass windows
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=85", // Sun-drenched pool & palm trees resort
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=2000&q=85", // Sunlit Mediterranean luxury terrace over turquoise ocean
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85", // Iconic luxury palace hotel exterior in sunny daylight
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=2000&q=85",
  "https://images.unsplash.com/photo-1787724777728-220ea9321653?auto=format&fit=crop&w=2000&q=85", // Bright boutique hotel room with sunlit balcony
];

interface HotelBackgroundSliderProps {
  className?: string;
}

export default function HotelBackgroundSlider({
  className,
}: HotelBackgroundSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HOTEL_IMAGES.length);
    }, 7000); // Smooth crossfade transition every 7 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none",
        className,
      )}
      aria-hidden="true"
    >
      {HOTEL_IMAGES.map((imgSrc, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={imgSrc}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              isActive ? "opacity-100" : "opacity-0",
            )}
          >
            <img
              src={imgSrc}
              alt="Bright luxury hotel resort"
              className={cn(
                "w-full h-full object-cover brightness-105 contrast-[1.02] transition-transform duration-[8000ms] ease-out",
                isActive ? "scale-105" : "scale-100",
              )}
            />
          </div>
        );
      })}

      {/* Light, luminous overlays so bright daylight luxury imagery shines through with crisp text legibility */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/15 to-black/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/35" />
    </div>
  );
}
