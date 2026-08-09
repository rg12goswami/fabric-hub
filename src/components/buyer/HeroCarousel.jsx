"use client";

import { useEffect, useState } from "react";

export default function HeroCarousel({ products }) {
  const [index, setIndex] = useState(0);
  const slides = products.slice(0, 5);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl p-8 mb-8 text-white">
        <p className="text-xs uppercase tracking-wide opacity-80 mb-2">New arrivals</p>
        <h1 className="text-2xl font-bold mb-2">Discover quality fabrics</h1>
        <p className="text-sm opacity-90">Sourced from verified suppliers worldwide</p>
      </div>
    );
  }

  const current = slides[index];

  return (
    <div className="relative bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl mb-8 text-white overflow-hidden h-48">
      {current.images?.[0] && (
        <img
          src={current.images[0]}
          alt={current.name}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
      )}
      <div className="relative z-10 p-8 h-full flex flex-col justify-center">
        <p className="text-xs uppercase tracking-wide opacity-90 mb-2">New this season</p>
        <h1 className="text-2xl font-bold mb-1">{current.name}</h1>
        <p className="text-sm opacity-90">Starting at ${current.price}/m</p>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
