'use client';

import { useRef, useState, MouseEvent } from 'react';

export function use3DTilt(maxRotate = 10) {
  const cardRef = useRef<HTMLDivElement | HTMLButtonElement | null>(null);
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center (range -0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Calculate rotation angles
    const rotateX = -mouseY * maxRotate;
    const rotateY = mouseX * maxRotate;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      boxShadow: `${-rotateY * 2}px ${rotateX * 2}px 30px rgba(230, 30, 42, 0.15), 0 20px 40px rgba(0, 0, 0, 0.6)`,
      borderColor: 'rgba(230, 30, 42, 0.35)',
      transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out, border-color 0.2s ease',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      boxShadow: 'none',
      borderColor: 'rgba(244, 241, 236, 0.1)',
      transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.5s ease',
    });
  };

  return {
    cardRef,
    tiltStyle,
    handleMouseMove,
    handleMouseLeave,
  };
}
