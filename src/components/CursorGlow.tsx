'use client';

import { useEffect, useRef, useState } from 'react';

export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isClicked, setIsClicked] = useState(false);

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
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    // Check if cursor is over a link or button
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
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
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver);

    // Start animation loop
    tick();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isHidden) return null;

  return (
    <>
      {/* Precision inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-amber rounded-full pointer-events-none z-150 transition-transform duration-100 ease-out"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
      {/* Smooth lagging trailing ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-150 mix-blend-screen transition-all duration-300 ease-out ${
          isHovered
            ? 'w-16 h-16 -ml-8 -mt-8 bg-amber/10 border border-amber/60 scale-110 blur-[1px]'
            : isClicked
            ? 'w-6 h-6 -ml-3 -mt-3 bg-amber/20 border border-amber/80 scale-90'
            : 'w-10 h-10 -ml-5 -mt-5 border border-amber/30'
        }`}
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
    </>
  );
}
