'use client';

import { useEffect, useRef, useState } from 'react';

export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [isInsideInput, setIsInsideInput] = useState(false);

  useEffect(() => {
    // Check if the device supports hover (excludes touchscreens)
    const mediaQuery = window.matchMedia('(hover: hover)');
    if (!mediaQuery.matches) return;

    setIsHidden(false);

    // Mouse coordinates
    const mouse = { x: 0, y: 0 };
    // Current animated position for the trailing ring
    const ring = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      }

      // 3D Parallax Tilt Effect for elements with the .tilt-card class
      const target = e.target as HTMLElement;
      const card = target.closest('.tilt-card') as HTMLElement;
      
      if (card) {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;
        
        // Calculate rotation angles (max 8 degrees)
        const rx = ((rect.height / 2) - cardY) / (rect.height / 2) * 8;
        const ry = (cardX - (rect.width / 2)) / (rect.width / 2) * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const card = target.closest('.tilt-card') as HTMLElement;
      if (card && (!e.relatedTarget || !(e.relatedTarget as HTMLElement).closest('.tilt-card'))) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    // Check if cursor is over a link, button, or inside a text input
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      setIsInsideInput(isInput);

      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    // Physics-like smooth lag (Linear Interpolation)
    let animationFrameId: number;
    const lerpSpeed = 0.15; // smooth lag factor

    const tick = () => {
      // Move ring towards mouse position by a percentage of the remaining distance
      ring.x += (mouse.x - ring.x) * lerpSpeed;
      ring.y += (mouse.y - ring.y) * lerpSpeed;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseOut);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver);

    // Start animation loop
    tick();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isHidden || isInsideInput) return null;

  return (
    <>
      {/* Dynamic trailing Bat-Signal spotlight background */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-140 transition-all duration-300 ease-out mix-blend-screen ${
          isHovered
            ? 'w-16 h-16 -ml-8 -mt-8 bg-amber/15 border border-amber/40 scale-110 blur-[1px]'
            : isClicked
            ? 'w-8 h-8 -ml-4 -mt-4 bg-amber/25 border border-amber/60 scale-90'
            : 'w-12 h-12 -ml-6 -mt-6 border border-amber/20 bg-amber/5'
        }`}
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />

      {/* Symmetrical Batman Logo Silhouette */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 pointer-events-none z-150 transition-transform duration-75 ease-out select-none flex items-center justify-center"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className={`transition-all duration-300 ${
            isHovered
              ? 'scale-125 fill-amberlight filter drop-shadow-[0_0_8px_rgba(242,169,59,0.8)]'
              : isClicked
              ? 'scale-90 fill-ember'
              : 'fill-amber'
          }`}
        >
          <path d="M 12, 2.24 C 11.24, 2.24 10.42, 3.48 9.94, 4.3 C 9.53, 5 9.17, 5.75 9, 6.5 C 7.33, 6.46 5.67, 7.37 4.5, 8.5 C 5.5, 9.5 6.75, 10 8, 10.25 C 6.5, 11 5, 12 4.5, 14 C 6.5, 13.5 8.5, 13.5 10, 14 C 9.5, 15.5 8, 17.5 7, 19.5 C 9.5, 18.5 11.5, 17.5 12, 16.5 C 12.5, 17.5 14.5, 18.5 17, 19.5 C 16, 17.5 14.5, 15.5 14, 14 C 15.5, 13.5 17.5, 13.5 19.5, 14 C 19, 12 17.5, 11 16, 10.25 C 17.25, 10 18.5, 9.5 19.5, 8.5 C 18.33, 7.37 16.67, 6.46 15, 6.5 C 14.83, 5.75 14.47, 5 14.06, 4.3 C 13.58, 3.48 12.76, 2.24 12, 2.24 Z" />
        </svg>
      </div>
    </>
  );
}

