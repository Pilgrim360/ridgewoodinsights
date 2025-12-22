'use client';

import { useEffect, useRef, useState } from 'react';

interface UseParallaxOptions {
  intensity?: number; // 0.1 to 1.0, how much the element moves
  direction?: 'up' | 'down'; // Direction of parallax movement
  triggerOnce?: boolean; // Only trigger animation once
}

export function useParallax(options: UseParallaxOptions = {}) {
  const {
    intensity = 0.5,
    direction = 'up',
    triggerOnce = false,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      if (triggerOnce && hasTriggered) return;

      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const windowHeight = window.innerHeight;

      // Check if element is in viewport
      if (elementTop < windowHeight && elementTop > -rect.height) {
        // Calculate parallax offset based on scroll position
        const scrolled = window.scrollY;
        const elementOffset = element.offsetTop;
        const distance = scrolled - (elementOffset - windowHeight);
        
        const newOffset = direction === 'up' 
          ? distance * intensity 
          : -distance * intensity;

        setOffset(newOffset);
        
        if (triggerOnce && Math.abs(newOffset) > 0) {
          setHasTriggered(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [intensity, direction, triggerOnce, hasTriggered]);

  return { ref, offset };
}
