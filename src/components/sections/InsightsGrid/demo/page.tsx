'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown, ChevronUp, Grid, List, Camera, Layers, Star, SlidersHorizontal } from 'lucide-react';
import { InsightsGrid } from '../InsightsGrid';
import type { Insight } from '@/constants';
import { INSIGHTS } from '@/constants';

// Demo component showcasing the new InsightsGrid
export default function DemoPage() {
  const [selectedLayout, setSelectedLayout] = useState<'grid' | 'list' | 'carousel' | 'masonry' | 'featured'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [demoMode, setDemoMode] = useState<'basic' | 'advanced'>('basic');

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Controls Header */}
      <div className="bg-white border-b border-surface sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-secondary">InsightsGrid Demo</h1>
              <p className="text-text/60 mt-1">Modern, professional insights display component</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Layout Selector */}
              <div className="flex items-center gap-2 bg-surface/50 rounded-lg p-1">
                {[
                  { key: 'grid' as const, icon: Grid, label: 'Grid' },
                  { key: 'list' as const, icon: List, label: 'List' },
                  { key: 'carousel' as const, icon: Camera, label: 'Carousel' },
                  { key: 'masonry' as const, icon: Layers, label: 'Masonry' },
                  { key: 'featured' as const, icon: Star, label: 'Featured' },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedLayout(key as any)}
                    className={`
                      relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                      transition-all duration-200
                      ${selectedLayout === key 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-text hover:text-primary hover:bg-white'
                      }
                    `}
                    title={label}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              {/* Demo Mode Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDemoMode(demoMode === 'basic' ? 'advanced' : 'basic')}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${demoMode === 'advanced'
                      ? 'bg-primary text-white'
                      : 'bg-surface text-text hover:bg-primary/10 hover:text-primary'
                    }
                  `}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {demoMode === 'basic' ? 'Basic Mode' : 'Advanced Mode'}
                </button>
              </div>

              {/* Option Toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${showSearch 
                      ? 'bg-primary text-white' 
                      : 'bg-surface text-text hover:bg-primary/10 hover:text-primary'
                    }
                  `}
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${showFilters 
                      ? 'bg-primary text-white' 
                      : 'bg-surface text-text hover:bg-primary/10 hover:text-primary'
                    }
                  `}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Grid Mode - Basic */}
        {selectedLayout === 'grid' && demoMode === 'basic' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-secondary mb-4">Our Latest Insights</h2>
              <p className="text-text/60 text-lg max-w-2xl mx-auto">
                Stay informed with our comprehensive collection of financial insights, tax planning strategies, 
                and business guidance from our expert team.
              </p>
            </div>

            {/* Basic Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {INSIGHTS.slice(0, 6).map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                    {insight.image && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={insight.image}
                          alt={insight.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                            {insight.category}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3 text-sm text-text/60">
                        <span>{new Date(insight.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{insight.readTime}</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-secondary mb-3 group-hover:text-primary transition-colors duration-300">
                        {insight.title}
                      </h3>
                      
                      <p className="text-text leading-relaxed mb-4">
                        {insight.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-surface/30">
                        <span className="text-sm text-text/60">
                          By {insight.author}
                        </span>
                        <button className="text-primary hover:bg-primary/10 px-3 py-1 rounded-lg transition-all duration-200">
                          Read More →
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all duration-200">
                Load More Insights
              </button>
            </div>
          </motion.div>
        )}

        {/* Advanced Mode - Using New Component */}
        {demoMode === 'advanced' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Import and use the new InsightsGrid component */}
            <AdvancedInsightsGrid 
              layout={selectedLayout}
              showFilters={showFilters}
              showSearch={showSearch}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Advanced component that uses the new InsightsGrid system
function AdvancedInsightsGrid({ 
  layout, 
  showFilters, 
  showSearch 
}: { 
  layout: 'grid' | 'list' | 'carousel' | 'masonry' | 'featured';
  showFilters: boolean;
  showSearch: boolean;
}) {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-secondary mb-4">
          Advanced {layout.charAt(0).toUpperCase() + layout.slice(1)} Layout
        </h2>
        <p className="text-text/60 text-lg max-w-2xl mx-auto">
          Experience our sophisticated insights display with modern micro-interactions, 
          responsive design, and professional polish.
        </p>
      </div>

      {/* New InsightsGrid Component */}
      <InsightsGrid
        insights={INSIGHTS}
        layout={layout}
        title="Our Latest Insights"
        subtitle="Professional Financial Guidance"
        showFilters={showFilters}
        showSearch={showSearch}
        showLoadMore={true}
        showInfiniteScroll={false}
        initialDisplayCount={9}
        loadMoreIncrement={6}
        backgroundVariant="white"
        onInsightClick={(insight) => {
          console.log('Insight clicked:', insight.title);
          // Handle insight click - could navigate to detail page
        }}
        onInsightLike={(insightId) => {
          console.log('Insight liked:', insightId);
          // Handle like functionality
        }}
        onInsightShare={(insight) => {
          console.log('Insight shared:', insight.title);
          // Handle share functionality
        }}
        onFilterChange={(filters) => {
          console.log('Filters changed:', filters);
        }}
        onSortChange={(sort) => {
          console.log('Sort changed:', sort);
        }}
        onSearch={(query) => {
          console.log('Search query:', query);
        }}
        className="min-h-screen"
      />
    </div>
  );
}