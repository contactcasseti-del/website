'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  colorRgb: string;
  decay: number;
}

export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [isInsideInput, setIsInsideInput] = useState(false);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    // Check if the device supports hover (excludes touchscreens)
    const mediaQuery = window.matchMedia('(hover: hover)');
    if (!mediaQuery.matches) return;

    setIsHidden(false);

    // Mouse coordinates
    const mouse = { x: 0, y: 0 };
    // Current animated position for the trailing ring
    const ring = { x: 0, y: 0 };
    // Track last mouse position to rate-limit particle generation
    const lastMousePos = { x: 0, y: 0 };

    // Set up canvas sizing
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Helper to spawn glitter particles
    const spawnParticles = (x: number, y: number, count = 1) => {
      const colors = [
        '242, 169, 59',   // Amber
        '255, 211, 122',  // Light gold
        '255, 106, 43',   // Ember
        '244, 241, 236',  // Warm white sparkle
      ];
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 1.5, // slight horizontal drift
          vy: (Math.random() - 0.2) * 1.0 + 0.5, // slow downward gravity
          alpha: 0.7 + Math.random() * 0.3,
          size: Math.random() * 2.0 + 0.6, // small subtle size: 0.6px to 2.6px
          colorRgb: colors[Math.floor(Math.random() * colors.length)],
          decay: 0.012 + Math.random() * 0.015, // random decay rate for organic fading
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      }

      // Spawn particles based on distance moved
      const dist = Math.hypot(mouse.x - lastMousePos.x, mouse.y - lastMousePos.y);
      if (dist > 12) {
        spawnParticles(mouse.x, mouse.y, 1);
        lastMousePos.x = mouse.x;
        lastMousePos.y = mouse.y;
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

    const onScroll = () => {
      // Spawn particles when page is scrolled relative to cursor position
      spawnParticles(mouse.x, mouse.y, 2);
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

      // Update and draw particles on the canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const particles = particlesRef.current;
          for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            // Apply drift velocity
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
            
            if (p.alpha <= 0) {
              particles.splice(i, 1);
              continue;
            }
            
            // Draw particle as a glowing soft sparkle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.colorRgb}, ${p.alpha})`;
            ctx.shadowColor = `rgba(${p.colorRgb}, 0.5)`;
            ctx.shadowBlur = p.size * 2;
            ctx.fill();
            // Reset shadow to avoid slowing down rendering
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
          }
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseOut);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver);

    // Start animation loop
    tick();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isHidden) return null;

  return (
    <>
      {/* Full-screen high-performance canvas overlay for glitter particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-130"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Trailing bat signal spotlight ring */}
      {!isInsideInput && (
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
      )}

      {/* Symmetrical Batman Logo Silhouette */}
      {!isInsideInput && (
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
      )}
    </>
  );
}
