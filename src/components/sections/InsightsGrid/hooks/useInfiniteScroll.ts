import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  disabled?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export interface UseInfiniteScrollReturn {
  ref: (node: HTMLElement | null) => void;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  error: Error | null;
}

// Hook for managing infinite scroll behavior with enhanced error handling and performance
export function useInfiniteScroll({
  threshold = 0,
  rootMargin = '100px',
  disabled = false,
  onLoadMore,
  hasMore = false,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const targetRef = useRef<HTMLElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (entry.isIntersecting && !disabled && hasMore && !isLoading && !isFetchingNextPage) {
        setIsLoading(true);
        setError(null);
        
        try {
          onLoadMore?.();
          
          // Reset loading state after a timeout to prevent spam
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        } catch (err) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    },
    [disabled, hasMore, isLoading, isFetchingNextPage, onLoadMore]
  );

  const ref = useCallback((node: HTMLElement | null) => {
    if (node) {
      targetRef.current = node;
      
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(handleIntersection, {
          threshold,
          rootMargin,
        });
        
        observer.observe(node);
        
        // Cleanup function
        return () => {
          observer.unobserve(node);
          observer.disconnect();
        };
      }
    }
  }, [handleIntersection, threshold, rootMargin]);

  // Reset states when dependencies change
  useEffect(() => {
    if (disabled) {
      setIsLoading(false);
      setError(null);
    }
  }, [disabled]);

  return {
    ref,
    isLoading,
    isFetchingNextPage,
    hasNextPage: hasMore && !disabled,
    error,
  };
}