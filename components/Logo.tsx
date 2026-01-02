import React from 'react';
import { Plane } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 'md' }) => {
  const scale = size === 'sm' ? 0.7 : size === 'lg' ? 1.3 : 1;
  
  return (
    <div className={`flex items-center gap-3 select-none ${className}`} style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}>
       {/* Graphic Element: Plane + Trail */}
       <div className="relative h-10 w-14 flex items-center justify-center">
          {/* Trail Path SVG */}
          <svg className="absolute inset-0 w-full h-full text-slate-200 overflow-visible" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M 5 38 Q 25 38 50 12" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 0" />
          </svg>
          {/* Plane Icon */}
          <div className="absolute top-0 right-0 transform -translate-x-1 translate-y-1 -rotate-12 text-slate-400">
             <Plane size={20} fill="#f1f5f9" className="text-slate-400" />
          </div>
       </div>

       {/* The 4 Colored Bars (Signature Mark) */}
       <div className="flex gap-1 h-8 items-end transform -skew-x-12 mx-1">
          <div className="w-1.5 h-3/4 bg-red-600 rounded-sm shadow-sm"></div>
          <div className="w-1.5 h-5/6 bg-yellow-400 rounded-sm shadow-sm"></div>
          <div className="w-1.5 h-full bg-green-500 rounded-sm shadow-sm"></div>
          <div className="w-1.5 h-4/5 bg-blue-600 rounded-sm shadow-sm"></div>
       </div>

       {/* Text Brand */}
       <div className="flex flex-col justify-center h-full">
          <span className="text-xl font-black text-slate-500 tracking-widest uppercase leading-none" style={{ fontFamily: 'Inter, sans-serif' }}>
            O PERFIL
          </span>
          <span className="text-xl font-light text-slate-400 tracking-[0.2em] uppercase leading-none">
            EXPLICA
          </span>
       </div>
    </div>
  );
};