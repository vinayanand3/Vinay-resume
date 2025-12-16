import React, { memo, useEffect, useMemo, useState } from 'react';
import { RESUME_DATA } from '../constants';

const Timeline: React.FC = () => {
  const [animate, setAnimate] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const { events, startYear, totalDuration } = useMemo(() => {
    // Combine Education and Experience once (and keep stable across parent rerenders).
    const educationEvents = RESUME_DATA.education.map((edu) => ({
      id: edu.id,
      type: 'education' as const,
      period: edu.period,
      title: edu.degree,
      subtitle: edu.institution,
    }));

    const experienceEvents = RESUME_DATA.experience.map((exp) => ({
      id: exp.id,
      type: 'experience' as const,
      period: exp.period,
      title: exp.role,
      subtitle: exp.company,
    }));

    const allEvents = [...educationEvents, ...experienceEvents];

    const parsedEvents = allEvents
      .map((event) => {
        const yearMatch = event.period.match(/\d{4}/);
        const year = yearMatch ? parseInt(yearMatch[0], 10) : 0;
        return { ...event, year };
      })
      .sort((a, b) => a.year - b.year)
      .filter((e) => e.year > 0);

    const startYear = 2006; // Adjusted for B.Tech start/end
    const endYear = new Date().getFullYear();
    const totalDuration = Math.max(1, endYear - startYear);

    return { events: parsedEvents, startYear, totalDuration };
  }, []);

  const getPosition = (year: number) => ((year - startYear) / totalDuration) * 100;

  return (
    <div className="w-full mt-10 mb-8 pr-8 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-zinc-600 font-mono mb-3">
        <span>{startYear}</span>
        <span>Present</span>
      </div>
      
      <div className="relative w-full h-12 flex items-center group/timeline">
        {/* Base Line */}
        <div className="absolute left-0 right-0 h-0.5 bg-zinc-800 rounded-full overflow-hidden">
          {/* Animated Fill Line */}
          <div 
            className="h-full bg-gradient-to-r from-zinc-700 via-indigo-500 to-accent transition-all duration-[2000ms] ease-out rounded-full"
            style={{ width: animate ? '100%' : '0%' }}
          />
        </div>

        {/* Event Nodes */}
        {events.map((event, index) => {
          const position = getPosition(event.year);
          const isHovered = hoveredIndex === index;
          const isEducation = event.type === 'education';
          
          return (
            <div 
              key={event.id}
              className="absolute"
              style={{ left: `${position}%` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Dot */}
              <div 
                className={`w-3 h-3 -ml-1.5 rounded-full border-2 transition-all duration-300 z-10 relative cursor-pointer
                  ${animate ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                  ${isHovered 
                    ? (isEducation ? 'bg-emerald-400 border-emerald-400 scale-125' : 'bg-accent border-accent scale-125')
                    : (isEducation ? 'bg-zinc-900 border-emerald-500/50' : 'bg-zinc-900 border-indigo-500/50')
                  }
                  ${!isHovered && hoveredIndex !== null ? 'opacity-50' : 'opacity-100'}
                `}
                style={{ transitionDelay: `${index * 150}ms` }}
              />
              
              {/* Tooltip */}
              <div 
                className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-max max-w-[220px] 
                  px-3 py-2 bg-zinc-900 text-zinc-200 text-xs rounded-lg border border-zinc-800 shadow-xl
                  transition-all duration-200 z-50 pointer-events-none origin-bottom
                  ${isHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}
                `}
              >
                <div className={`font-bold mb-0.5 ${isEducation ? 'text-emerald-400' : 'text-accent'}`}>
                  {event.year}
                </div>
                <div className="font-semibold truncate text-zinc-100">{event.subtitle}</div>
                <div className="text-zinc-400 text-[10px] leading-tight mt-0.5">{event.title}</div>
                
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-zinc-800" />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] font-medium text-zinc-500 mt-[-5px]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full border border-indigo-500/50 bg-zinc-900"></div>
          <span>Experience</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full border border-emerald-500/50 bg-zinc-900"></div>
          <span>Education</span>
        </div>
      </div>
    </div>
  );
};

export default memo(Timeline);
