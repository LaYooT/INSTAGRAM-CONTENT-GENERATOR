
"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";

interface BeforeAfterComparisonProps {
  beforeImage: string;
  afterVideoUrl: string;
}

export function BeforeAfterComparison({ beforeImage, afterVideoUrl }: BeforeAfterComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="space-y-fluid-sm">
      <div className="text-center">
        <h3 className="text-fluid-lg font-bold text-foreground mb-fluid-xs leading-fluid-tight">
          Comparaison Avant / Après
        </h3>
        <p className="text-fluid-sm text-muted-foreground leading-fluid-normal">
          Faites glisser le curseur pour comparer
        </p>
      </div>

      <div className="relative aspect-[9/16] max-w-xs mx-auto bg-black rounded-fluid-lg overflow-hidden">
        {/* Before Image */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <Image
              src={beforeImage}
              alt="Image originale"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black/70 backdrop-blur-sm text-white text-fluid-xs font-semibold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
            AVANT
          </div>
        </div>

        {/* After Video with Clip Path */}
        <div 
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
        >
          <video
            src={afterVideoUrl}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black/70 backdrop-blur-sm text-white text-fluid-xs font-semibold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
            APRÈS
          </div>
        </div>

        {/* Slider Handle - Responsive */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 sm:w-1 bg-white shadow-lg z-10"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full shadow-xl flex items-center justify-center">
            <div className="flex space-x-0.5 sm:space-x-1">
              <div className="w-0.5 h-3 sm:h-4 bg-gray-400"></div>
              <div className="w-0.5 h-3 sm:h-4 bg-gray-400"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Control */}
      <div className="max-w-xs mx-auto px-fluid-sm">
        <Slider
          value={[sliderPosition]}
          max={100}
          step={1}
          onValueChange={(value) => setSliderPosition(value[0])}
          className="cursor-pointer"
        />
      </div>

      {/* Instructions - Mobile Friendly */}
      <div className="max-w-xs mx-auto text-center">
        <p className="text-fluid-xs text-muted-foreground leading-fluid-normal">
          💡 Glissez le curseur ou utilisez le slider ci-dessus
        </p>
      </div>
    </div>
  );
}
