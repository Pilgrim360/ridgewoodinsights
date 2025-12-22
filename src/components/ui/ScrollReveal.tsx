'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  variant?: 'slide' | 'fade' | 'scale';
}

export function ScrollReveal({ 
  children, 
  className = '', 
  delay = 0, 
  direction = 'up',
  variant = 'slide'
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    slide: {
      initial: {
        opacity: 0,
        ...(direction === 'up' && { y: 48 }),
        ...(direction === 'down' && { y: -48 }),
        ...(direction === 'left' && { x: 48 }),
        ...(direction === 'right' && { x: -48 }),
      },
      animate: {
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
          duration: 0.6,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    },
    fade: {
      initial: {
        opacity: 0,
      },
      animate: {
        opacity: 1,
        transition: {
          duration: 0.8,
          delay,
          ease: 'easeOut',
        },
      },
    },
    scale: {
      initial: {
        opacity: 0,
        scale: 0.9,
      },
      animate: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.6,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      variants={prefersReducedMotion ? undefined : variants[variant]}
      className={className}
    >
      {children}
    </motion.div>
  );
}