'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Share2, Eye, Clock, User, Calendar, ArrowUpRight, Bookmark } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import type { Insight } from '@/constants';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Text } from '@/components/ui/Text';
import { Heading } from '@/components/ui/Heading';

export interface InsightCardProps {
  insight: Insight;
  variant?: 'default' | 'compact' | 'featured' | 'minimal';
  showActions?: boolean;
  showExcerpt?: boolean;
  showMetadata?: boolean;
  showImage?: boolean;
  priority?: 'high' | 'medium' | 'low';
  className?: string;
  onClick?: (insight: Insight) => void;
  onLike?: (insightId: string) => void;
  onShare?: (insight: Insight) => void;
  onBookmark?: (insightId: string) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatReadTime = (readTime?: string) => {
  if (!readTime) return '';
  return readTime.replace(' min read', '').trim();
};

const imageAspectRatios = {
  default: 'aspect-[16/10]',
  compact: 'aspect-[4/3]',
  featured: 'aspect-[21/9]',
  minimal: 'aspect-[16/9]',
};

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  variant = 'default',
  showActions = true,
  showExcerpt = true,
  showMetadata = true,
  showImage = true,
  priority = 'medium',
  className,
  onClick,
  onLike,
  onShare,
  onBookmark,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Intersection Observer for lazy loading and entrance animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCardClick = () => {
    onClick?.(insight);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.(insight.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(insight);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.(insight.id);
  };

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20,
      scale: shouldReduceMotion ? 1 : 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      }
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 1.05 },
    visible: { 
      opacity: imageLoaded ? 1 : 0.5,
      scale: 1,
      transition: { duration: shouldReduceMotion ? 0 : 0.6 }
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.3, delay: shouldReduceMotion ? 0 : 0.2 }
    },
  };

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={cardVariants}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        variant="elevated"
        className={`
          h-full group cursor-pointer overflow-hidden
          transition-all duration-300 ease-out
          hover:shadow-2xl hover:-translate-y-2
          ${variant === 'featured' ? 'lg:col-span-2 lg:row-span-2' : ''}
          ${priority === 'high' ? 'ring-2 ring-primary/20' : ''}
        `}
        onClick={handleCardClick}
      >
        <div className="flex flex-col h-full">
          {/* Image Section */}
          <AnimatePresence>
            {showImage && insight.image && (
              <motion.div
                variants={imageVariants}
                className={`relative overflow-hidden ${imageAspectRatios[variant]}`}
              >
                <Image
                  src={insight.image}
                  alt={insight.title}
                  fill
                  className={`
                    object-cover transition-all duration-700 ease-out
                    ${isHovered ? 'scale-110' : 'scale-100'}
                    ${!imageLoaded ? 'blur-sm' : 'blur-0'}
                  `}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  onLoad={() => setImageLoaded(true)}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Priority Badge */}
                {priority === 'high' && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="info" className="bg-primary text-white border-0">
                      Featured
                    </Badge>
                  </div>
                )}
                
                {/* Action Buttons */}
                <AnimatePresence>
                  {showActions && isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute top-3 right-3 flex gap-2"
                    >
                      <button
                        onClick={handleLike}
                        className={`
                          p-2 rounded-full backdrop-blur-sm border border-white/20
                          transition-all duration-200 hover:scale-110
                          ${isLiked 
                            ? 'bg-red-500 text-white' 
                            : 'bg-white/80 text-text hover:bg-red-50 hover:text-red-500'
                          }
                        `}
                        aria-label={isLiked ? 'Unlike' : 'Like'}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      </button>
                      
                      <button
                        onClick={handleBookmark}
                        className={`
                          p-2 rounded-full backdrop-blur-sm border border-white/20
                          transition-all duration-200 hover:scale-110
                          ${isBookmarked 
                            ? 'bg-primary text-white' 
                            : 'bg-white/80 text-text hover:bg-primary hover:text-white'
                          }
                        `}
                        aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Section */}
          <motion.div
            variants={contentVariants}
            className={`flex flex-col flex-grow ${cardVariants[variant]}`}
          >
            {/* Metadata */}
            {showMetadata && (
              <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
                <Badge variant="neutral" className="text-xs font-medium">
                  {insight.category}
                </Badge>
                <Text as="span" className="text-text/60 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(insight.date)}
                </Text>
                {insight.readTime && (
                  <Text as="span" className="text-text/60 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatReadTime(insight.readTime)}
                  </Text>
                )}
                <Text as="span" className="text-text/60 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {insight.author}
                </Text>
              </div>
            )}

            {/* Title */}
            <Heading
              as={3}
              className={`
                text-lg font-semibold text-secondary mb-3 line-clamp-2
                group-hover:text-primary transition-colors duration-300
                ${variant === 'featured' ? 'text-2xl lg:text-3xl' : ''}
                ${variant === 'compact' ? 'text-base' : ''}
              `}
            >
              {insight.title}
            </Heading>

            {/* Excerpt */}
            {showExcerpt && insight.excerpt && (
              <Text
                as="p"
                className={`
                  text-text leading-relaxed mb-4 line-clamp-3
                  ${variant === 'featured' ? 'text-base lg:text-lg' : ''}
                  ${variant === 'compact' ? 'line-clamp-2' : ''}
                `}
              >
                {insight.excerpt}
              </Text>
            )}

            {/* Spacer for featured variant */}
            {variant === 'featured' && <div className="flex-grow" />}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-surface/30 mt-auto">
              <div className="flex items-center gap-4 text-sm text-text/60">
                {insight.views && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{insight.views.toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg text-text/60 hover:text-primary hover:bg-primary/10 transition-all duration-200"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                
                <Link
                  href={insight.link}
                  className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-all duration-200 group/arrow"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ArrowUpRight className="w-4 h-4 group-hover/arrow:translate-x-0.5 group-hover/arrow:-translate-y-0.5 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};