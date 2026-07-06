'use client';

import { useEffect, useRef, useState } from 'react';

export default function ScrollRedHeading({
  text,
  className = '',
  isSubheading = false,
}: {
  text: string;
  className?: string;
  isSubheading?: boolean;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!headingRef.current) return;
      const rect = headingRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start color transition when element enters bottom of screen, finish when it leaves top
      const elementHeight = rect.height;
      const elementTop = rect.top;

      // Map position to a value between -50% and 150% gradient position
      // As element moves up (elementTop gets smaller), progress goes from 0 to 1
      const totalRange = windowHeight + elementHeight;
      const currentPos = windowHeight - elementTop;
      const ratio = Math.max(0, Math.min(1, currentPos / totalRange));

      // Ease the transition to make it feel natural
      setProgress(ratio);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to set initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute gradient background position based on scroll progress
  // Left-to-right fill: we shift the color-stop of the linear-gradient
  // When progress = 0: 100% white
  // When progress = 1: 100% red
  const percentage = progress * 130 - 15; // Range of gradient movement (-15% to 115%)

  const gradientStyle = {
    background: `linear-gradient(90deg, #E61E2A ${percentage}%, #F4F1EC ${percentage + 15}%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
  };

  const subHeadingStyle = {
    background: `linear-gradient(90deg, #E61E2A ${percentage}%, #9C968D ${percentage + 15}%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
  };

  if (isSubheading) {
    return (
      <p
        ref={headingRef}
        className={`transition-all duration-75 ease-out ${className}`}
        style={subHeadingStyle}
      >
        {text}
      </p>
    );
  }

  return (
    <h2
      ref={headingRef}
      className={`transition-all duration-75 ease-out ${className}`}
      style={gradientStyle}
    >
      {text}
    </h2>
  );
}
