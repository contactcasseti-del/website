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
        threshold: 0.1, // Trigger earlier so the animation feels responsive
        rootMargin: '-5% 0px -5% 0px' 
      }
    );

    observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  // Soft gradient: half red, half text-color with a wide blur area in between
  const gradient = isSubheading
    ? 'linear-gradient(270deg, #E61E2A 30%, #9C968D 70%)'
    : 'linear-gradient(270deg, #E61E2A 30%, #F4F1EC 70%)';

  const style = {
    background: gradient,
    backgroundSize: '220% 100%',
    // If not in view: background position is shifted right (showing white/gray)
    // If in view: background position is shifted left (showing red flowing from right to left)
    backgroundPosition: isInView ? '0% 0' : '100% 0',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
    // Smooth, slow right-to-left wash animation
    transition: 'background-position 1.4s cubic-bezier(0.25, 1, 0.5, 1)',
    display: 'inline-block',
  };

  if (isSubheading) {
    return (
      <div ref={elementRef} className="inline-block max-w-full">
        <p className={`${className}`} style={style}>
          {text}
        </p>
      </div>
    );
  }

  return (
    <div ref={elementRef} className="inline-block max-w-full">
      <h2 className={`${className}`} style={style}>
        {text}
      </h2>
    </div>
  );
}
