'use client';

import { useEffect, useState } from 'react';

export interface ReadingProgressProps {
  /**
   * Optional selector to target a specific element (e.g. 'article').
   * If not provided, it will use the entire document body.
   */
  targetSelector?: string;
}

export function ReadingProgress({ targetSelector }: ReadingProgressProps) {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      let currentProgress = window.scrollY;
      let scrollHeight = document.body.scrollHeight - window.innerHeight;

      if (targetSelector) {
        const element = document.querySelector(targetSelector);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementHeight = element.scrollHeight;

          // Current progress is how much of the element we've scrolled past the top of the viewport
          currentProgress = Math.max(0, window.scrollY - elementTop);
          // Scroll height is the total height of the element minus the viewport height (approx)
          // Actually, we want it to be 100% when the bottom of the element is at the bottom of the viewport
          scrollHeight = elementHeight - window.innerHeight;
        }
      }
      
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentProgress / scrollHeight) * 100));
        setCompletion(progress);
      }
    };

    window.addEventListener('scroll', updateScrollCompletion);
    
    // Trigger once on mount
    updateScrollCompletion();

    return () => {
      window.removeEventListener('scroll', updateScrollCompletion);
    };
  }, [targetSelector]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent pointer-events-none">
      <div
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${completion}%` }}
      />
    </div>
  );
}