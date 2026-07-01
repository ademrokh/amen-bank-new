'use client';

import { useState } from 'react';

type TimelineEvent = { year: string; event: string };

export default function Timeline({ events, isRTL }: { events: TimelineEvent[]; isRTL: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    // Changed pt-16 to pt-12
    <div className="w-full pt-12 pb-12">
      <div className="relative">
        {/* The Horizontal Line */}
        <div 
          className="absolute left-0 right-0 h-1 rounded-full top-full -translate-y-1/2 mx-4"
          style={{ background: '#e2e8f0' }}
        ></div>
        
        {/* Dots/Years Container */}
        <div className={`relative flex justify-between items-end w-full ${isRTL ? 'flex-row-reverse' : ''}`}>
          {events.map((e, i) => (
            <div 
              key={i} 
              className="relative flex flex-col items-center cursor-pointer pb-4"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Pop-up Content (Always rendered for smooth transitions) */}
              {/* Changed bottom calculation from 100%-0.5rem to 100%+1.5rem to push it higher */}
              <div 
                className={`absolute bottom-[calc(100%+1.5rem)] left-1/2 -translate-x-1/2 w-56 text-center transition-all duration-300 ease-out z-20 ${
                  activeIndex === i 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
              >
                <span className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#003DA5' }}>
                  {e.year}
                </span>
                <p className="text-sm font-medium leading-snug" style={{ color: '#0f172a' }}>
                  {e.event}
                </p>
              </div>

              {/* Year Label */}
              <span 
                className={`mb-2 text-sm font-bold transition-colors whitespace-nowrap ${
                  activeIndex === i ? 'text-green-700' : 'text-slate-500'
                }`}
              >
                {e.year}
              </span>
              
              {/* The Dot */}
              <span 
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  activeIndex === i 
                    ? 'bg-green-600 border-green-600 scale-125 shadow-md' 
                    : 'bg-white border-slate-300'
                }`}
              ></span>
            </div>
          ))}

          {/* "Today" Marker */}
          <div className="relative flex flex-col items-center cursor-default pb-4 opacity-60">
            <span className="mb-2 text-sm font-bold text-slate-500 whitespace-nowrap">
              {isRTL ? 'اليوم' : 'Today'}
            </span>
            <span 
              className="w-4 h-4 rounded-full border-2 bg-slate-200 border-slate-300"
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
}