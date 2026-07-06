'use client';

import { useState } from 'react';

export default function ScrollRedHeading({
  text,
  className = '',
  isSubheading = false,
}: {
  text: string;
  className?: string;
  isSubheading?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Transition style for smooth hover growth and color fade
  const style = {
    color: isHovered 
      ? '#E61E2A' // Red on hover
      : (isSubheading ? '#9C968D' : '#F4F1EC'), // Normal text or subheading gray
    transform: isHovered ? 'scale(1.03)' : 'scale(1)', // Grow slightly on hover
    transformOrigin: 'left center',
    transition: 'color 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    display: 'inline-block',
  };

  if (isSubheading) {
    return (
      <p
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${className}`}
        style={style}
      >
        {text}
      </p>
    );
  }

  return (
    <h2
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${className}`}
      style={style}
    >
      {text}
    </h2>
  );
}
