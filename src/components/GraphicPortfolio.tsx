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

  return (
    <div>
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setActiveGraphic(item)}
            className="frame break-inside-avoid w-full text-left cursor-pointer group focus:outline-none overflow-hidden relative block mb-4"
            style={{ transitionDelay: `${idx * 0.05}s` }}
          >
            <span className="corner tl"></span>
            <span className="corner tr"></span>
            <span className="corner bl"></span>
            <span className="corner br"></span>

            {/* Real image — natural aspect ratio */}
            <div className="w-full transform group-hover:scale-105 transition-transform duration-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-auto object-cover block"
                loading="lazy"
              />
            </div>

            <div className="placeholder-hint opacity-0 group-hover:opacity-100 transition-opacity bg-void/70 duration-300 flex-col">
              <i className="fa-solid fa-magnifying-glass-plus text-xl text-amber"></i>
              <span className="text-[10px] uppercase font-mono tracking-wider mt-2">View Work</span>
            </div>
            <div className="cap">{item.title}</div>
          </button>
        ))}
      </div>

      {/* Expanded Lightbox Modal Overlay */}
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

            {/* Full image in lightbox */}
            <div className="w-full flex items-center justify-center bg-black max-h-[75vh] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeGraphic.url}
                alt={activeGraphic.title}
                className="w-full h-full object-contain max-h-[75vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
