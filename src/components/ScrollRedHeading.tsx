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
  const elementRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const currentRef = elementRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        // Triggers color change when at least 30% of heading is in the middle part of viewport
        threshold: 0.3,
        rootMargin: '-10% 0px -10% 0px' 
      }
    );

    observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const style = {
    color: isInView 
      ? '#E61E2A' // Red when scrolled into view
      : (isSubheading ? '#9C968D' : '#F4F1EC'), // White/gray when out of view
    transition: 'color 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
    display: 'inline-block',
  };

  if (isSubheading) {
    return (
      <div ref={elementRef} className="inline-block">
        <p className={`${className}`} style={style}>
          {text}
        </p>
      </div>
    );
  }

  return (
    <div ref={elementRef} className="inline-block">
      <h2 className={`${className}`} style={style}>
        {text}
      </h2>
    </div>
  );
}
