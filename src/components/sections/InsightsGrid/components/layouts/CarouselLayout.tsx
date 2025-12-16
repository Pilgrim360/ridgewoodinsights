'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { LayoutRendererProps, CarouselConfig } from '../../types';
import { InsightCard } from '../InsightCard';
import { Button } from '@/components/ui/Button';

interface CarouselLayoutProps extends LayoutRendererProps {
  config: CarouselConfig;
}

export const CarouselLayout: React.FC<CarouselLayoutProps> = ({
  insights,
  config,
  loadingState,
  onInsightClick,
  onLoadMore,
  hasMore,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const {
    autoplay = false,
    autoplayDelay = 5000,
    showDots = true,
    showArrows = true,
    loop = true,
    slidesToShow = 3,
    slidesToScroll = 1,
    centerMode = false,
  } = config;

  const visibleSlides = insights.slice(currentIndex, currentIndex + slidesToShow);
  const maxIndex = Math.max(0, insights.length - slidesToShow);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || shouldReduceMotion) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (loop) {
          return prev >= maxIndex ? 0 : prev + slidesToScroll;
        } else {
          return Math.min(prev + slidesToScroll, maxIndex);
        }
      });
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, loop, maxIndex, slidesToScroll, shouldReduceMotion]);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (loop) {
        return prev >= maxIndex ? 0 : prev + slidesToScroll;
      } else {
        return Math.min(prev + slidesToScroll, maxIndex);
      }
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (loop) {
        return prev <= 0 ? maxIndex : prev - slidesToScroll;
      } else {
        return Math.max(prev - slidesToScroll, 0);
      }
    });
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const responsiveSlidesToShow = {
    mobile: 1,
    tablet: Math.min(2, slidesToShow),
    desktop: slidesToShow,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const slideVariants = {
    hidden: { opacity: 0, scale: 0.9, x: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      x: -50,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.3,
      },
    },
  };

  const currentSlidesToShow = responsiveSlidesToShow.mobile; // Will be updated based on screen size

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel Container */}
      <div
        ref={carouselRef}
        className={`
          overflow-hidden relative
          ${centerMode ? 'px-8' : ''}
        `}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
              flex gap-6
              ${centerMode ? 'justify-center' : ''}
            `}
          >
            {insights.slice(currentIndex, currentIndex + currentSlidesToShow).map((insight, index) => (
              <motion.div
                key={`${insight.id}-${currentIndex}`}
                variants={slideVariants}
                className={`
                  flex-none
                  ${centerMode ? 'w-[calc(100%/3)]' : 'w-full'}
                  ${index === 0 ? 'lg:w-[calc(33.333%-1rem)]' : ''}
                  ${index === 1 ? 'lg:w-[calc(33.333%-1rem)]' : ''}
                  ${index === 2 ? 'lg:w-[calc(33.333%-1rem)]' : ''}
                `}
              >
                <InsightCard
                  insight={insight}
                  variant="default"
                  onClick={onInsightClick}
                  className="h-full"
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <AnimatePresence>
        {showArrows && isHovered && insights.length > currentSlidesToShow && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={prevSlide}
              disabled={!loop && currentIndex === 0}
              className="
                absolute left-2 top-1/2 -translate-y-1/2 z-10
                p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg
                hover:bg-white transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-primary
              "
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-secondary" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={nextSlide}
              disabled={!loop && currentIndex >= maxIndex}
              className="
                absolute right-2 top-1/2 -translate-y-1/2 z-10
                p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg
                hover:bg-white transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-primary
              "
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-secondary" />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Pagination Dots */}
      <AnimatePresence>
        {showDots && insights.length > currentSlidesToShow && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex justify-center gap-2 mt-6"
          >
            {Array.from({ length: Math.ceil(insights.length / slidesToScroll) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index * slidesToScroll)}
                className={`
                  w-2 h-2 rounded-full transition-all duration-200
                  ${index === Math.floor(currentIndex / slidesToScroll)
                    ? 'bg-primary scale-125'
                    : 'bg-surface hover:bg-primary/50'
                  }
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                `}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-12"
        >
          <Button
            onClick={onLoadMore}
            disabled={loadingState === 'loading'}
            variant="primary"
            size="lg"
            isLoading={loadingState === 'loading'}
          >
            Load More Insights
          </Button>
        </motion.div>
      )}
    </div>
  );
};