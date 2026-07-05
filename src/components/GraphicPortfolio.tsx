'use client';

import { useState } from 'react';

type GraphicItem = {
  id: string;
  type: string;
  title: string;
  url: string;
  category: string | null;
};

export default function GraphicPortfolio({ items }: { items: GraphicItem[] }) {
  const [activeGraphic, setActiveGraphic] = useState<GraphicItem | null>(null);

  // SVG-based premium placeholders for mock portfolio graphics
  const getPlaceholderSvg = (title: string) => {
    return (
      <svg className="w-full h-full bg-voidsoft" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F2A93B" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#FF6A2B" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#0A0A0C" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#grid-grad)" />
        {/* Subtle grid lines */}
        <path d="M 0 50 L 400 50 M 0 100 L 400 100 M 0 150 L 400 150 M 0 200 L 400 200 M 0 250 L 400 250 M 0 300 L 400 300 M 0 350 L 400 350" stroke="rgba(244,241,236,0.03)" strokeWidth="1" />
        <path d="M 50 0 L 50 400 M 100 0 L 100 400 M 150 0 L 150 400 M 200 0 L 200 400 M 250 0 L 250 400 M 300 0 L 300 400 M 350 0 L 350 400" stroke="rgba(244,241,236,0.03)" strokeWidth="1" />
        {/* Camera Reticle motif */}
        <path d="M 170 200 L 190 200 M 210 200 L 230 200 M 200 170 L 200 190 M 200 210 L 200 230" stroke="rgba(244,241,236,0.25)" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="45" fill="none" stroke="rgba(244,241,236,0.12)" strokeWidth="1" />
        {/* Text details */}
        <text x="34" y="360" fontFamily="monospace" fontSize="10" fill="#9C968D" letterSpacing="1">
          RETICLE_ACTIVE // F.5.6
        </text>
        <text x="34" y="340" fontFamily="sans-serif" fontWeight="bold" fontSize="16" fill="#F4F1EC" letterSpacing="0.5">
          {title.toUpperCase()}
        </text>
        {/* Border corner markers */}
        <path d="M 20 40 L 20 20 L 40 20" fill="none" stroke="#F2A93B" strokeWidth="2" />
        <path d="M 380 40 L 380 20 L 360 20" fill="none" stroke="#F2A93B" strokeWidth="2" />
        <path d="M 20 360 L 20 380 L 40 380" fill="none" stroke="#F2A93B" strokeWidth="2" />
        <path d="M 380 360 L 380 380 L 360 380" fill="none" stroke="#F2A93B" strokeWidth="2" />
      </svg>
    );
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setActiveGraphic(item)}
            className="frame aspect-square w-full text-left cursor-pointer group focus:outline-none overflow-hidden relative"
            style={{ transitionDelay: `${idx * 0.05}s` }}
          >
            <span className="corner tl"></span>
            <span className="corner tr"></span>
            <span className="corner bl"></span>
            <span className="corner br"></span>
            
            {/* SVG Placeholder */}
            <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-500">
              {getPlaceholderSvg(item.title)}
            </div>

            <div className="placeholder-hint opacity-0 group-hover:opacity-100 transition-opacity bg-void/70 duration-300 flex-col">
              <i className="fa-solid fa-magnifying-glass-plus text-xl text-amber"></i>
              <span className="text-[10px] uppercase font-mono tracking-wider mt-2">View Work</span>
            </div>
            <div className="cap">{item.title}</div>
          </button>
        ))}
      </div>

      {/* Expanded Lightroom Modal Overlay */}
      {activeGraphic && (
        <div className="fixed inset-0 z-100 bg-void/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-voidsoft border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div>
                <span className="eyebrow text-xs text-amber font-mono tracking-wider">
                  DESIGN WORK
                </span>
                <h4 className="font-display text-xl text-ink mt-0.5">
                  {activeGraphic.title} · {activeGraphic.category}
                </h4>
              </div>
              <button
                onClick={() => setActiveGraphic(null)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-ink hover:text-amber transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Design container */}
            <div className="aspect-square w-full max-h-[60vh] md:max-h-[70vh]">
              {getPlaceholderSvg(activeGraphic.title)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
